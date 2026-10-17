/**
 * Rückblick nach der Partie: Zeichen am Brett, besserer Zug, Bewertungsbalken, Verlaufskurve.
 *
 * Rolle im Gesamtbild: Vorschlag H zu 0.2.26, vom Autor angenommen („Spielen: Rückblick nach der
 * Partie“). Beim Nachspielen einer ausgewerteten Partie steht am Zielfeld des gezeigten Zuges
 * sein Zeichen (?!, ?, ??), ein goldener Pfeil zeigt den besseren Zug; links am Brett ein
 * schmaler Balken mit der Bewertung, über der Auswertung eine Kurve. Während der Partie bleibt
 * das alles aus (es verriete zu viel). Reine Funktionen; die Werte kommen aus
 * ui/komponenten/useAuswertung.ts, die Zeichen aus spiel/auswertung.ts.
 * Seit 0.2.56 (Empfehlung R5) nennt die Karte nach „Besser war …“ auch die nächsten Züge der
 * Hauptvariante der Engine („Danach etwa …“, `variantentext`).
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), schach/weiterspielen.ts, schach/notation.ts,
 * spiel/auswertung.ts, spiel/zuege.ts.
 */
import type { Markierung, Markierungsfarbe } from "../analyse/werkzeug";
import { sanInSprache } from "../schach/notation";
import { zugFelder } from "../schach/weiterspielen";
import type { Zugklasse, Zugurteil } from "./auswertung";
import { fenNach, uciZuSan } from "./zuege";

/** So viele Halbzüge der Hauptvariante nennt die Karte nach dem besseren Zug. */
const VARIANTE_ANZEIGE = 5;

/**
 * Die Hauptvariante der Engine als lesbare Zugfolge, ohne ihren ersten Zug (den nennt die Karte
 * schon als „Besser war …“): „2... Sc6 3. Lc4 Sf6“, deutsche Figurenbuchstaben, höchstens fünf
 * Halbzüge. Eingaben: Stellung vor dem Zug (FEN), Variante in UCI (beginnt mit dem besseren Zug).
 * Ausgabe: Text, leer ohne Fortsetzung oder bei einem Zug, der in der Stellung nicht geht.
 * Beispiel: nach 1. e4 e5 2. Dh5?! mit Variante [g1f3, b8c6, f1c4] → „2... Sc6 3. Lc4“.
 */
export function variantentext(fen: string, variante: readonly string[]): string {
  const teile: string[] = [];
  let stellung = fen;
  for (const [i, uci] of variante.slice(0, VARIANTE_ANZEIGE + 1).entries()) {
    const san = uciZuSan(stellung, uci);
    const naechste = san ? fenNach(stellung, san) : null;
    if (!san || !naechste) break;
    if (i > 0) teile.push(mitZugnummer(stellung, sanInSprache(san, "de"), teile.length === 0));
    stellung = naechste;
  }
  return teile.join(" ");
}

/** „2. Sf3“ für Weiß, „2... Sc6“ für Schwarz; bei Schwarz nur am Anfang mit Nummer. */
function mitZugnummer(fen: string, san: string, erster: boolean): string {
  const [, seite = "w", , , , nummer = "1"] = fen.split(" ");
  if (seite === "w") return `${nummer}. ${san}`;
  return erster ? `${nummer}... ${san}` : san;
}

/** Der Balken und die Kurve reichen bis ±5 Bauern; mehr (auch Matt) steht am Rand. */
export const ANZEIGEGRENZE = 5;
/** Ab diesem Wert (Matt in der Auswertung) zeigt der Balken „M“ statt einer Zahl. */
const MATTWERT = 10;
/** UCI: zwei Zeichen Startfeld, zwei Zeichen Zielfeld. */
const FELDLAENGE = 2;

/** Marke am Zielfeld je Klasse (Text und Farbe); Klassen ohne Marke bleiben leer. */
const MARKE_JE_KLASSE: Readonly<
  Record<Zugklasse, { text: string; farbe: Markierungsfarbe } | null>
> = {
  brillant: { text: "!!", farbe: "blau" },
  stark: { text: "!", farbe: "gold" },
  bester: { text: "✓", farbe: "gruen" },
  sehrGut: null,
  gut: null,
  buch: null,
  ungenau: { text: "?!", farbe: "grau" },
  fehler: { text: "?", farbe: "rot" },
  verpasst: { text: "?", farbe: "rot" },
  patzer: { text: "??", farbe: "rot" },
};

/** Bei diesen Klassen zeigt ein goldener Pfeil den besseren Zug. */
const MIT_BESSEREM_ZUG: ReadonlySet<Zugklasse> = new Set<Zugklasse>([
  "sehrGut",
  "gut",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
]);

/**
 * Markierungen für die Stellung nach einem Zug: Marke der Klasse am Zielfeld (seit 0.2.40 wie bei
 * chess.com: „!!“ blau, „!“ gold, „✓“ grün für den besten Zug, „?!“ grau, „?“ und „??“ rot),
 * goldener Pfeil für den besseren Zug der Engine bei allen Zügen, die nicht der beste waren.
 *
 * Eingaben: Stellung vor dem Zug (FEN), der Zug (SAN), sein Urteil, bester Zug der Engine (UCI).
 * Beispiel: 2. Dh5?! nach 1. e4 e5: Feld h5 mit „?!“ (grau), goldener Pfeil g1–f3, falls die
 * Engine 2. Sf3 vorzieht.
 * Sonderfälle: Ohne Urteil keine Markierung; ohne gültigen Zug ebenfalls keine.
 */
export function rueckblickMarken(
  vorher: string,
  san: string,
  urteil: Zugurteil | undefined,
  bester: string,
): Markierung[] {
  const gespielt = zugFelder(vorher, san);
  if (!gespielt || !urteil) return [];
  const marke = MARKE_JE_KLASSE[urteil.klasse];
  const marken: Markierung[] = marke
    ? [{ typ: "feld", farbe: marke.farbe, feld: gespielt.nach, text: marke.text }]
    : [];
  const von = bester.slice(0, FELDLAENGE);
  const nach = bester.slice(FELDLAENGE, 2 * FELDLAENGE);
  const gleich = von === gespielt.von && nach === gespielt.nach;
  if (von && nach && !gleich && MIT_BESSEREM_ZUG.has(urteil.klasse)) {
    marken.push({ typ: "pfeil", farbe: "gold", von, nach });
  }
  return marken;
}

/**
 * Anteil von Weiß am Bewertungsbalken, 0 bis 1 (0,5 ausgeglichen).
 *
 * Beispiel: +1 → 0,6; −5 und weniger → 0; Matt für Weiß → 1.
 */
export function balkenanteil(wert: number): number {
  const begrenzt = Math.max(-ANZEIGEGRENZE, Math.min(ANZEIGEGRENZE, wert));
  return (begrenzt + ANZEIGEGRENZE) / (2 * ANZEIGEGRENZE);
}

/**
 * Die Zahl am Balken, wie im Buch mit Komma: „+1,3“, „−0,4“, „0,0“; Matt „M“ mit Vorzeichen.
 */
export function balkentext(wert: number): string {
  if (Math.abs(wert) >= MATTWERT) return wert > 0 ? "+M" : "−M";
  const text = Math.abs(wert).toFixed(1).replace(".", ",");
  if (text === "0,0") return text;
  return `${wert > 0 ? "+" : "−"}${text}`;
}

/** Ein Punkt der Verlaufskurve in Koordinaten der Zeichenfläche. */
export interface Kurvenpunkt {
  readonly x: number;
  readonly y: number;
}

/**
 * Die Punkte der Verlaufskurve: x je Stellung gleichmäßig, y von oben (+5) nach unten (−5).
 *
 * Eingaben: Werte je Stellung (aus Sicht von Weiß), Breite und Höhe der Zeichenfläche.
 * Beispiel: Werte [0, 5, −5] bei 100 × 50 → (0|25), (50|0), (100|50).
 */
export function kurvenpunkte(
  werte: readonly number[],
  breite: number,
  hoehe: number,
): Kurvenpunkt[] {
  const schritt = werte.length > 1 ? breite / (werte.length - 1) : 0;
  return werte.map((wert, i) => ({ x: i * schritt, y: hoehe * (1 - balkenanteil(wert)) }));
}
