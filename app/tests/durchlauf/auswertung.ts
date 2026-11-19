/**
 * Auswertung des Spieler-Durchlaufs: aus den gemessenen Zahlen je Akt (messung.ts) die geschätzte
 * Spielzeit für einen zügigen und einen gründlichen Spieler, als Tabelle in Markdown.
 *
 * Warum: Gemessen ist nur, was der Durchlauf tat (Laufzeit der Figur, gelesene Wörter, Halbzüge,
 * Ladezeiten). Ein Mensch liest und denkt; dafür stehen hier die Annahmen an einer Stelle, damit
 * der Bericht Gemessenes und Geschätztes trennen kann (Wunsch des Autors, 18.11.2026: Lesen mit
 * 180 Wörtern je Minute, Kinder 120; 15 Sekunden je eigenem Zug).
 * Abhängigkeiten: messung.ts.
 * Beispiel: 2400 Wörter, 4 Minuten Laufen, 60 eigene Züge → zügig 13 + 4 + 15 = 32 Minuten.
 */
import type { Aktmessung } from "./messung";

/** Die Annahmen eines Spielertyps. */
export interface Spielertyp {
  readonly name: string;
  /** Lesetempo in Wörtern je Minute. */
  readonly woerterJeMinute: number;
  /** Sekunden je Dialogzeile für das Weitertippen. */
  readonly sekundenJeZeile: number;
  /** Faktor auf die gemessene Laufzeit (Umwege, Umsehen). */
  readonly lauffaktor: number;
  /** Bedenkzeit je eigenem Zug in Sekunden. */
  readonly sekundenJeZug: number;
  /** Sekunden je Aufgabe einer Aufgabenrunde. */
  readonly sekundenJeAufgabe: number;
}

/** Zügig: liest mit 180 Wörtern je Minute, läuft die kürzesten Wege, 15 Sekunden je Zug. */
export const ZUEGIG: Spielertyp = {
  name: "zügig",
  woerterJeMinute: 180,
  sekundenJeZeile: 0.5,
  lauffaktor: 1,
  sekundenJeZug: 15,
  sekundenJeAufgabe: 45,
};

/** Gründlich: liest mit 120 Wörtern je Minute (Kinder), sieht sich um, denkt länger. */
export const GRUENDLICH: Spielertyp = {
  name: "gründlich",
  woerterJeMinute: 120,
  sekundenJeZeile: 1,
  lauffaktor: 1.5,
  sekundenJeZug: 15,
  sekundenJeAufgabe: 90,
};

const MS_JE_MINUTE = 60_000;
const SEKUNDEN_JE_MINUTE = 60;

/** Kantenlänge einer Kachel und Tempo des Helden in Pixeln je Sekunde (oberwelt/szene.ts). */
const KACHEL_PIXEL = 16;
const TEMPO_PIXEL_JE_SEKUNDE = 56;

/**
 * Laufzeit im Spiel in Sekunden, aus den gelaufenen Kacheln gerechnet (16 Pixel bei 56 Pixeln je
 * Sekunde). Warum nicht die gemessene Zeit am Steuerkreuz: Unter Last (zwei Browser zugleich)
 * läuft das Spiel langsamer, die Zahl der Kacheln bleibt gleich.
 * Beispiel: 800 Kacheln → 229 Sekunden.
 */
export function laufsekunden(a: Aktmessung): number {
  return (a.schritte * KACHEL_PIXEL) / TEMPO_PIXEL_JE_SEKUNDE;
}

/** Die Teile der geschätzten Spielzeit eines Akts in Minuten. */
export interface Schaetzung {
  readonly lesen: number;
  readonly laufen: number;
  readonly partien: number;
  readonly aufgaben: number;
  readonly laden: number;
  readonly summe: number;
}

/**
 * Geschätzte Spielzeit eines Akts für einen Spielertyp, in Minuten.
 * Sonderfall: Ladezeiten und Rechenzeit des Gegners sind gemessen und für beide Typen gleich.
 */
export function schaetze(a: Aktmessung, typ: Spielertyp): Schaetzung {
  const woerter = a.dialogwoerter + a.meldungswoerter;
  const lesen =
    woerter / typ.woerterJeMinute +
    ((a.dialogzeilen + a.meldungen) * typ.sekundenJeZeile) / SEKUNDEN_JE_MINUTE;
  const laufen = (laufsekunden(a) * typ.lauffaktor) / SEKUNDEN_JE_MINUTE;
  const zuege = a.partien.reduce((summe, p) => summe + p.eigeneZuege, 0);
  const partien = (zuege * typ.sekundenJeZug) / SEKUNDEN_JE_MINUTE;
  const zahl = a.runden.reduce((summe, r) => summe + r.aufgaben, 0);
  const aufgaben = (zahl * typ.sekundenJeAufgabe) / SEKUNDEN_JE_MINUTE;
  const laden = a.ladeMs / MS_JE_MINUTE;
  return {
    lesen,
    laufen,
    partien,
    aufgaben,
    laden,
    summe: lesen + laufen + partien + aufgaben + laden,
  };
}

/** Eine Zahl mit einer Nachkommastelle und deutschem Komma. */
function zahl(wert: number): string {
  return wert.toFixed(1).replace(".", ",");
}

/**
 * Die Tabellen des Berichts: gemessene Zahlen je Akt und die Schätzung für beide Spielertypen.
 * Eingabe: die Akte der Messung (Schlüssel: Nummer des Akts).
 */
export function tabellen(akte: Readonly<Record<string, Aktmessung>>): string {
  const nummern = Object.keys(akte).sort((a, b) => Number(a) - Number(b));
  const zeilen = [
    "| Akt | Kacheln gelaufen | Laufen (min, aus Kacheln) | Kartenwechsel | Dialogzeilen | Wörter (Dialog + Meldungen) | Partien | Halbzüge (eigene Züge) | Aufgabenrunden (Aufgaben) | Laden (min) | Laufzeit des Laufs (min) |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const n of nummern) {
    const a = akte[n] as Aktmessung;
    const halb = a.partien.reduce((s, p) => s + p.halbzuege, 0);
    const eigene = a.partien.reduce((s, p) => s + p.eigeneZuege, 0);
    const aufgaben = a.runden.reduce((s, r) => s + r.aufgaben, 0);
    zeilen.push(
      `| ${n} | ${a.schritte} | ${zahl(laufsekunden(a) / SEKUNDEN_JE_MINUTE)} | ${a.kartenwechsel} | ${a.dialogzeilen} | ` +
        `${a.dialogwoerter + a.meldungswoerter} | ${a.partien.length} | ${halb} (${eigene}) | ` +
        `${a.runden.length} (${aufgaben}) | ${zahl(a.ladeMs / MS_JE_MINUTE)} | ${zahl(a.echtMs / MS_JE_MINUTE)} |`,
    );
  }
  zeilen.push("", "| Akt | Spieler | Lesen | Laufen | Partien | Aufgaben | Laden | Summe (min) |");
  zeilen.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const typ of [ZUEGIG, GRUENDLICH]) {
    let gesamt = 0;
    for (const n of nummern) {
      const s = schaetze(akte[n] as Aktmessung, typ);
      gesamt += s.summe;
      zeilen.push(
        `| ${n} | ${typ.name} | ${zahl(s.lesen)} | ${zahl(s.laufen)} | ${zahl(s.partien)} | ` +
          `${zahl(s.aufgaben)} | ${zahl(s.laden)} | ${zahl(s.summe)} |`,
      );
    }
    zeilen.push(`| alle | ${typ.name} |  |  |  |  |  | ${zahl(gesamt)} |`);
  }
  return zeilen.join("\n");
}
