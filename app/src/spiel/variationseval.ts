/**
 * Engine-Werte einer Variante im PGN-Kommentar: „[%eval 0.35]“ wie bei Lichess und ein eigener
 * Befehl „[%svgb e2e4,12]“ mit bestem Zug und Abstand zum zweitbesten.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 3 (Entwurf, Abschnitt 5 „PGN“: „Ab Stufe 3 kommt
 * [%eval 0.35] dazu“). Lichess liest „%eval“ aus Sicht von Weiß in Bauern, Matt als „#3“ (Weiß setzt
 * in 3 matt) oder „#-2“. Die App speichert Hundertstel und Matt als großen Wert
 * (engine/spielbewerter.ts: Matt in n = 100 − n Bauern). Bester Zug und Abstand kennt PGN nicht;
 * ohne sie gibt es keine Zugarten (Q12-3), deshalb stehen sie im eigenen Befehl „%svgb“, den Lichess
 * überliest (wie „%svga“ für die Farben, spiel/variationsformen.ts). Eine fremde PGN mit nur
 * „%eval“ zeigt sofort den Balken; die Zugarten kommen nach der Analyse. Reine Funktionen.
 * Abhängigkeiten: chessops/pgn (makeComment, parseComment), training/variationswerte.ts.
 */
import { makeComment, parseComment, type Evaluation } from "chessops/pgn";
import type { Knotendaten } from "../training/variationen";
import { HUNDERTSTEL } from "../training/variationswerte";

/** Matt in n Zügen zählt wie MATT_BAUERN − n Bauern (engine/spielbewerter.ts, MATTWERT). */
const MATT_BAUERN = 100;
/** Ab diesem Betrag (in Bauern) ist ein Wert ein Matt; normale Werte bleiben weit darunter. */
const MATT_AB = MATT_BAUERN / 2;

/** Der eigene Befehl: bester Zug (UCI) und Abstand in Hundertstel. */
const SVGB = /\s?\[%svgb\s([a-h][1-8][a-h][1-8][qrbn]?),(\d{1,5})\]\s?/;
const SVGB_ALLE = new RegExp(SVGB.source, "g");

/** Wert in Hundertstel → Bewertung für PGN. Beispiel: 35 → 0,35; 9700 → „#3“. */
export function alsEvaluation(w: number): Evaluation {
  const bauern = w / HUNDERTSTEL;
  if (Math.abs(bauern) < MATT_AB) return { pawns: bauern };
  return { mate: Math.sign(bauern) * Math.round(MATT_BAUERN - Math.abs(bauern)) };
}

/** Bewertung aus PGN → Wert in Hundertstel. Beispiel: „#-2“ → −9800; 1.5 → 150. */
export function ausEvaluation(e: Evaluation): number {
  if ("mate" in e) return Math.sign(e.mate) * (MATT_BAUERN - Math.abs(e.mate)) * HUNDERTSTEL;
  return Math.round(e.pawns * HUNDERTSTEL);
}

/**
 * Die Befehle zu den Werten einer Stellung: „[%eval 0.35] [%svgb e2e4,12]“; leer ohne Wert.
 * Sonderfall: Ohne besten Zug (Endstellung, fremde PGN) nur „%eval“.
 */
export function evalbefehle(daten: Knotendaten): string {
  if (daten.w === undefined) return "";
  const evaluation = makeComment({ evaluation: alsEvaluation(daten.w) });
  return daten.b ? `${evaluation} [%svgb ${daten.b},${daten.a ?? 0}]` : evaluation;
}

/**
 * Liest die Werte aus einem PGN-Kommentar und gibt den Kommentar ohne „%svgb“ zurück („%eval“
 * entfernt danach parseComment wie die Formen).
 * Beispiel: „gut [%eval -0.4] [%svgb g8f6,25]“ → w −40, b „g8f6“, a 25, Rest „gut [%eval -0.4]“.
 */
export function werteAusKommentar(kommentar: string): {
  werte: Pick<Knotendaten, "w" | "b" | "a">;
  rest: string;
} {
  const svgb = SVGB.exec(kommentar);
  const rest = kommentar.replace(SVGB_ALLE, " ").trim();
  const evaluation = parseComment(rest).evaluation;
  if (!evaluation) return { werte: {}, rest };
  const w = ausEvaluation(evaluation);
  const b = svgb?.[1];
  const a = svgb?.[2] !== undefined ? Number(svgb[2]) : undefined;
  return { werte: { w, ...(b ? { b } : {}), ...(b && a !== undefined ? { a } : {}) }, rest };
}
