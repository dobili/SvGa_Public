/**
 * Passiver König im Endspiel (Kapitel 8, Regel 1 „Aktiviere deinen König“), mit dem
 * Königsweg des Endspielwerkzeugs (analyse/k8-regeln.ts).
 *
 * Rolle im Gesamtbild: Teil von fehlerbefundIn (engine/fehlerart.ts). Nicht jeder Zug, bei dem
 * die Engine einen Königszug vorzog, ist „König passiv“; in der Gegenprüfung (Tiefe 20) war das
 * oft nur „ungenau“. Festlegung nach Regel 1: Im Endspiel marschiert der König zu seinem Ziel
 * (Schlüsselfelder eigener Freibauern, sonst Zentrum), sobald ihn keine gegnerische Dame mehr mit
 * Schachs oder Mattdrohungen bestrafen kann. Passiv ist ein Zug ohne Schlag und Schach, wenn
 * - der König noch nicht am Ziel ist und der beste Zug ein Königszug näher ans Ziel ist, gespielt
 *   aber ein anderer Zug, oder
 * - der König ohne Not vom Ziel weg zieht,
 * und der Zug mindestens einen halben Bauern verliert. Den König in der Eröffnung in der Mitte zu
 * lassen ist eine eigene Art („König in der Mitte“, Kapitel 1).
 * Abhängigkeiten: analyse/k8-regeln.ts, engine/fehlerart-taktik.ts (Stellung), engine/zugprobe.ts.
 */
import { koenigsabstandZumZiel } from "../analyse/k8-regeln";
import type { Lage } from "./fehlerart-typen";
import { stellungVon } from "./fehlerart-taktik";
import { probe, type Zugprobe } from "./zugprobe";

/** Ab so viel Verlust ist ein passiver Königszug ein Fehler (Grenze der Auswertung). */
const VERLUST_AB = 0.5;

/** Abstand des Königs der Seite, die gerade gezogen hat, zu seinem Ziel nach dem Zug. */
function abstandNach(p: Zugprobe): number | null {
  return koenigsabstandZumZiel(stellungVon(p.danach), p.figur.color);
}

/**
 * Passiver König (Kapitel 8, Regel 1). Beispiel: Bauernendspiel, der weiße König steht auf e1,
 * Kd2 ginge zum Zentrum, Weiß zieht e3 → passiv. Sonderfälle: mit gegnerischer Dame, im Schach,
 * mit Schlag oder Schach als Zug nie passiv.
 */
export function istKoenigPassiv(
  lage: Lage,
  p: Zugprobe,
  besterZug: string | null,
  verlust: number | null,
): boolean {
  const farbe = lage.regeln.turn;
  if (lage.phase !== "endspiel" || verlust === null || verlust < VERLUST_AB) return false;
  if (lage.regeln.isCheck() || p.geschlagen !== null || p.danach.isCheck()) return false;
  if (lage.regeln.board.pieces(farbe === "white" ? "black" : "white", "queen").nonEmpty())
    return false;
  const vorher = koenigsabstandZumZiel(stellungVon(lage.regeln), farbe);
  if (vorher === null || vorher === 0) return false;
  if (p.figur.role === "king") return (abstandNach(p) ?? vorher) > vorher;
  const bester = besterZug ? probe(lage.regeln, besterZug) : null;
  return (
    bester !== null && bester.figur.role === "king" && (abstandNach(bester) ?? vorher) < vorher
  );
}
