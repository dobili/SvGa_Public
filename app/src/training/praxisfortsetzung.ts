/**
 * Fortsetzungen der Varianten aus der Praxis: die häufigsten Folgezüge echter Spieler nach dem
 * namengebenden Zug, je 200er-Band.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026, Entscheidung zu N2538): Die Varianten „Aus
 * der Praxis (Lichess)“ im Repertoire-Trainer enden am Zug, der ihnen den Namen gibt („Old
 * Sicilian“: 1. e4 c5 2. Sf3 Sc6), und sind deshalb kurz. Die Pipeline (pipeline/praxisbuch/
 * fortsetzungen.py) zählt aus demselben Lichess-Monat wie das Praxisbuch (CC0, die ersten 20
 * Halbzüge) je Zugfolge und Band die häufigsten Folgezüge, solange die Stellung im Band genug
 * Partien hat und ein Zug deutlich vorn liegt, höchstens zehn Halbzüge (Regeln dort). Die App
 * rechnet nichts nach, sie hängt nur an: ein Nachschlagen je Variante, also auch auf dem Handy
 * ohne Wartezeit. Das Band ist das des Lesers (seine Wertung, Maßstab von Lichess), ohne Wertung
 * 1200, die Mitte der Vorgabe der Auswahl nach Spielstärke (Leser des Buches).
 * Abhängigkeiten: keine (reine Daten und Rechnung).
 */

/** Die Datei public/daten/praxisfortsetzungen.json. */
export interface Praxisfortsetzungen {
  /** Untergrenzen der Bänder (400, 600, … 2800), wie im Praxisbuch. */
  readonly baender: readonly number[];
  /** Zugfolge (Lichess-Kurznotation mit Leerzeichen) → Fortsetzung je Band ("" ohne). */
  readonly fortsetzungen: Readonly<Record<string, readonly string[]>>;
}

/** Wertung, wenn der Leser noch keine hat: Mitte der Vorgabe 1000 bis 1400 (Staerkewahl.tsx). */
export const WERTUNG_OHNE_PARTIEN = 1200;

/** Prüft die Rohdaten (aus JSON) grob; null bei unbekanntem Format. */
export function praxisfortsetzungenAus(roh: unknown): Praxisfortsetzungen | null {
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  if (!Array.isArray(r.baender) || r.baender.some((b) => typeof b !== "number")) return null;
  if (typeof r.fortsetzungen !== "object" || r.fortsetzungen === null) return null;
  const fortsetzungen: Record<string, readonly string[]> = {};
  for (const [folge, je] of Object.entries(r.fortsetzungen)) {
    if (Array.isArray(je) && je.every((f) => typeof f === "string")) fortsetzungen[folge] = je;
  }
  return { baender: r.baender as number[], fortsetzungen };
}

/**
 * Der Index des Bandes zu einer Wertung: das höchste Band, dessen Untergrenze sie erreicht.
 * Beispiel: 1250 → Index 4 (Band 1200); 350 → 0 (unter dem ersten Band zählt das erste).
 */
export function bandindexFuer(daten: Praxisfortsetzungen, wertung: number): number {
  let index = 0;
  daten.baender.forEach((untergrenze, i) => {
    if (wertung >= untergrenze) index = i;
  });
  return index;
}

/**
 * Die Folgezüge nach der Zugfolge im Band, leer, wenn die Daten zu dünn sind.
 *
 * Eingaben: Fortsetzungen, Zugfolge wie in den Eröffnungen nach Spielstärke, Index des Bandes.
 * Beispiel: „e4 c5 Nf3 Nc6“, Band 1200 → [Bc4, e6, O-O, d5, exd5, exd5, Bb5, Bd7, Re1+].
 * Sonderfall: unbekannte Zugfolge oder Band außerhalb der Daten → [].
 */
export function folgezuege(
  daten: Praxisfortsetzungen,
  folge: string,
  band: number,
): readonly string[] {
  const text = daten.fortsetzungen[folge]?.[band] ?? "";
  return text === "" ? [] : text.split(" ");
}
