/**
 * Rechnung der Eichung von Genauigkeit und Spielstärke (Schritt c des Plans vom 18.10.2026).
 *
 * Rolle im Gesamtbild: reine Funktionen für spiel/eichung.messung.ts: Werte der Engine in die
 * Sicht von Weiß umrechnen, Eich- und Kontrollpartien trennen, die Regler für „nahe chess.com“
 * suchen (Rastersuche, kleinste mittlere Abweichung), eine monotone Kurve Genauigkeit →
 * Wertungszahl bilden und die Streuung der Schätzung je Partie und über zehn Partien messen.
 * Die App selbst nutzt diese Datei nicht; sie bekommt nur die Ergebnisse als Konstanten.
 * Abhängigkeiten: spiel/genauigkeitsmodell.ts, spiel/auswertung.ts (Wertgrenze), training/zufall.ts.
 */
import type { Color } from "chessops/types";
import { WERTGRENZE } from "./auswertung";
import { genauigkeitAus, zugwerte, type Regler } from "./genauigkeitsmodell";
import { festerZufall, mische } from "../training/zufall";

/** Rohe Bewertung einer Stellung aus Sicht der Seite am Zug (Ausgabe von eichung-rechnen.mjs). */
export interface Rohwert {
  readonly cp?: number | null;
  readonly matt?: number;
}

const CENTI = 100;

/**
 * Werte je Stellung aus Sicht von Weiß in Bauern (wie die Auswertung der App, begrenzt auf ±10).
 * Matt in n für die Seite am Zug → +10, gegen sie → −10; „Matt 0“ heißt: die Seite am Zug ist
 * matt → −10. Ohne Bewertung (Patt) → 0.
 */
export function werteAusEngine(stellungen: readonly Rohwert[], anfang: Color = "white"): number[] {
  return stellungen.map((s, i) => {
    let wert = 0;
    if (s.matt !== undefined) wert = s.matt > 0 ? WERTGRENZE : -WERTGRENZE;
    else if (typeof s.cp === "number")
      wert = Math.max(-WERTGRENZE, Math.min(WERTGRENZE, s.cp / CENTI));
    const weissAmZug = (i % 2 === 0) === (anfang === "white");
    return weissAmZug ? wert : -wert;
  });
}

const KONTROLLE_JE_HUNDERT = 20;
const HUNDERT = 100;
const STREU_PRIMZAHL = 31;

/** Gehört die Partie zu den Kontrollpartien (etwa jede fünfte, fest nach ihrer Kennung)? */
export function istKontrolle(kennung: string): boolean {
  let streu = 0;
  for (const zeichen of kennung) streu = (streu * STREU_PRIMZAHL + zeichen.charCodeAt(0)) >>> 0;
  return streu % HUNDERT < KONTROLLE_JE_HUNDERT;
}

/** Eine Seite einer Partie für die Eichung. */
export interface Eichseite {
  readonly werte: readonly number[];
  readonly seite: Color;
  /** Genauigkeit der Plattform (chess.com oder Lichess). */
  readonly genauigkeit: number;
  readonly wertung: number;
}

export function mittel(zahlen: readonly number[]): number {
  return zahlen.length === 0 ? Number.NaN : zahlen.reduce((s, x) => s + x, 0) / zahlen.length;
}

export function streuung(zahlen: readonly number[]): number {
  const m = mittel(zahlen);
  return Math.sqrt(mittel(zahlen.map((x) => (x - m) ** 2)));
}

/** Abweichungen (unsere Genauigkeit − die der Plattform) einer Reihe von Seiten. */
export function abweichungen(seiten: readonly Eichseite[], regler: Regler): number[] {
  return seiten.flatMap((s) => {
    const wert = genauigkeitAus(zugwerte(s.werte, s.seite, regler.abfall), regler.polster);
    return wert === null ? [] : [wert - s.genauigkeit];
  });
}

/**
 * Die Regler mit der kleinsten mittleren Abweichung vom Betrag zur Genauigkeit der Plattform.
 * Eingaben: Eichseiten, Raster für Abfall und Polster. Ausgabe: beste Regler und ihre Abweichung.
 */
export function besteRegler(
  seiten: readonly Eichseite[],
  abfaelle: readonly number[],
  polster: readonly number[],
): { regler: Regler; abweichung: number } {
  let bestes = {
    regler: { abfall: abfaelle[0] ?? 0, polster: polster[0] ?? 1 },
    abweichung: Infinity,
  };
  for (const abfall of abfaelle) {
    const zuege = seiten.map((s) => zugwerte(s.werte, s.seite, abfall));
    for (const p of polster) {
      const fehler = zuege.flatMap((z, i) => {
        const wert = genauigkeitAus(z, p);
        return wert === null ? [] : [Math.abs(wert - (seiten[i]?.genauigkeit ?? wert))];
      });
      const abweichung = mittel(fehler);
      if (abweichung < bestes.abweichung) bestes = { regler: { abfall, polster: p }, abweichung };
    }
  }
  return bestes;
}

/** Eine Kurve als Stützstellen [Genauigkeit, Wertungszahl], aufsteigend. */
export type Kurve = readonly (readonly [number, number])[];

/** Wert der Kurve an einer Stelle, linear dazwischen, außerhalb der Randwert. */
export function kurvenwert(kurve: Kurve, x: number): number {
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte) return Number.NaN;
  if (x <= erste[0]) return erste[1];
  if (x >= letzte[0]) return letzte[1];
  for (let i = 1; i < kurve.length; i += 1) {
    const [x0, y0] = kurve[i - 1] ?? erste;
    const [x1, y1] = kurve[i] ?? letzte;
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return letzte[1];
}

/** Ausgleich zu einer steigenden Folge (Pool-Adjacent-Violators), gewichtet nach Anzahl. */
function steigend(werte: readonly number[], gewichte: readonly number[]): number[] {
  const bloecke: { wert: number; gewicht: number; laenge: number }[] = [];
  werte.forEach((wert, i) => {
    bloecke.push({ wert, gewicht: gewichte[i] ?? 1, laenge: 1 });
    while (bloecke.length > 1 && (bloecke.at(-2)?.wert ?? 0) > (bloecke.at(-1)?.wert ?? 0)) {
      const b = bloecke.pop();
      const a = bloecke.pop();
      if (!a || !b) break;
      const gewicht = a.gewicht + b.gewicht;
      bloecke.push({
        wert: (a.wert * a.gewicht + b.wert * b.gewicht) / gewicht,
        gewicht,
        laenge: a.laenge + b.laenge,
      });
    }
  });
  return bloecke.flatMap((b) => Array.from({ length: b.laenge }, () => b.wert));
}

/**
 * Monotone Kurve Genauigkeit → Wertungszahl: die Seiten nach Genauigkeit in gleich große Gruppen
 * teilen, je Gruppe mittlere Genauigkeit und mittlere Wertungszahl, dann steigend ausgleichen.
 */
export function monotoneKurve(
  punkte: readonly { readonly x: number; readonly y: number }[],
  gruppen: number,
): Kurve {
  const sortiert = [...punkte].sort((a, b) => a.x - b.x);
  const groesse = Math.max(1, Math.floor(sortiert.length / gruppen));
  const xs: number[] = [];
  const ys: number[] = [];
  const ns: number[] = [];
  for (let i = 0; i < sortiert.length; i += groesse) {
    const gruppe = sortiert.slice(i, i + groesse);
    if (gruppe.length < groesse && xs.length > 0) break;
    xs.push(mittel(gruppe.map((p) => p.x)));
    ys.push(mittel(gruppe.map((p) => p.y)));
    ns.push(gruppe.length);
  }
  const ausgeglichen = steigend(ys, ns);
  return xs.map((x, i) => [x, ausgeglichen[i] ?? 0] as const);
}

/**
 * Streuung der Schätzung über zehn Partien: Je Durchgang zehn Seiten aus demselben Wertungsband
 * ziehen, Mittel der Schätzungen gegen Mittel der echten Zahlen. Ausgabe: Abweichungen.
 */
export function zehnerFehler(
  paare: readonly {
    readonly schaetzung: number;
    readonly wertung: number;
    readonly band: number;
  }[],
  durchgaenge: number,
  je: number,
): number[] {
  const zufall = festerZufall(durchgaenge);
  const baender = [...new Set(paare.map((p) => p.band))];
  const fehler: number[] = [];
  for (let d = 0; d < durchgaenge; d += 1) {
    const band = baender[d % baender.length];
    const auswahl = mische(
      paare.filter((p) => p.band === band),
      zufall,
    ).slice(0, je);
    if (auswahl.length < je) continue;
    fehler.push(mittel(auswahl.map((p) => p.schaetzung)) - mittel(auswahl.map((p) => p.wertung)));
  }
  return fehler;
}

/**
 * Umgekehrte Kurve für Mittelwerte: je Wertungsband die mittlere Genauigkeit, steigend
 * ausgeglichen, dann als Kurve Genauigkeit → Wertung gelesen.
 *
 * Warum: Die Kurve „Genauigkeit → mittlere Wertung“ (monotoneKurve) ist für eine einzelne
 * Partie die beste Schätzung, zieht aber jede Schätzung zur Mitte (Regression zur Mitte). Über
 * zehn Partien mittelt sich der Zufall heraus, die Verzerrung bleibt: Ein Spieler mit 600 käme
 * immer bei etwa 1000 heraus. Die umgekehrte Kurve (Wertung → mittlere Genauigkeit, dann
 * aufgelöst) hat diese Verzerrung nicht und passt deshalb für den Schnitt über zehn Partien.
 * Beispiel: Band 600 mit mittlerer Genauigkeit 61, Band 800 mit 66 → Schnitt 63,5 ergibt 700.
 */
export function umkehrKurve(
  punkte: readonly { readonly x: number; readonly y: number }[],
  bandbreite: number,
): Kurve {
  const baender = [...new Set(punkte.map((p) => Math.floor(p.y / bandbreite)))].sort(
    (a, b) => a - b,
  );
  const mitte = baender.map((b) => {
    const im = punkte.filter((p) => Math.floor(p.y / bandbreite) === b);
    return { y: mittel(im.map((p) => p.y)), x: mittel(im.map((p) => p.x)), n: im.length };
  });
  const xs = steigend(
    mitte.map((m) => m.x),
    mitte.map((m) => m.n),
  );
  // Gleiche Genauigkeit nach dem Ausgleich: eine Stützstelle mit mittlerer Wertung.
  const kurve: [number, number][] = [];
  xs.forEach((x, i) => {
    const y = mitte[i]?.y ?? 0;
    const letzte = kurve.at(-1);
    if (letzte && letzte[0] === x) letzte[1] = (letzte[1] + y) / 2;
    else kurve.push([x, y]);
  });
  return kurve;
}

/**
 * Fehler der Schätzung aus dem Schnitt von je zehn Seiten desselben Bandes: Mittel der
 * Genauigkeiten, daraus die Schätzung, gegen das Mittel der echten Zahlen.
 */
export function zehnerFehlerAusMittel(
  paare: readonly { readonly x: number; readonly wertung: number; readonly band: number }[],
  schaetze: (mittlereGenauigkeit: number) => number,
  durchgaenge: number,
  je: number,
): number[] {
  const zufall = festerZufall(durchgaenge);
  const baender = [...new Set(paare.map((p) => p.band))];
  const fehler: number[] = [];
  for (let d = 0; d < durchgaenge; d += 1) {
    const band = baender[d % baender.length];
    const auswahl = mische(
      paare.filter((p) => p.band === band),
      zufall,
    ).slice(0, je);
    if (auswahl.length < je) continue;
    fehler.push(schaetze(mittel(auswahl.map((p) => p.x))) - mittel(auswahl.map((p) => p.wertung)));
  }
  return fehler;
}
