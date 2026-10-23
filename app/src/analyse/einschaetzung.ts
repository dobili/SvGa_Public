/**
 * Einschätzung einer Stellung („Weiß steht besser“, „ausgeglichen“, „Schwarz steht besser“) und
 * das Urteil der Engine in derselben Sprache.
 *
 * Rolle im Gesamtbild: „Erst selbst denken“ an den Abbildungen (seit 0.2.90). Wunsch des Autors
 * (NA1, 19.10.2026): Nach der eigenen Einschätzung steht die Antwort der Engine, und richtig
 * eingeschätzte Abbildungen merkt sich die App. Rein und ohne Engine testbar.
 * Abhängigkeiten: engine/uci.ts (Wert), engine/spielbewerter.ts (Wert in Bauerneinheiten).
 */
import { wertFuer } from "../engine/spielbewerter";
import type { Wert } from "../engine/uci";

/** Die drei Einschätzungen der Stellung, wie der Leser sie vor dem Werkzeug trifft. */
export type Einschaetzung = "weiss" | "gleich" | "schwarz";
export const EINSCHAETZUNGEN: readonly Einschaetzung[] = ["weiss", "gleich", "schwarz"];

/**
 * Bis zu diesem Wert (Bauerneinheiten, Betrag) gilt eine Stellung als ausgeglichen. Ein halber
 * Bauer ist die übliche Grenze der Engine-Anzeigen (Lichess und chess.com zeigen darunter kein
 * „besser“); Empfehlung an den Autor in AUFGABEN_AUTOR, Teil 2.
 */
export const AUSGEGLICHEN_BIS = 0.5;

/**
 * Das Urteil der Engine als Einschätzung.
 *
 * Eingabe: Wert der besten Variante (aus Sicht von Weiß). Ausgabe: weiss, gleich oder schwarz.
 * Beispiel: Abb. 1.26 etwa +0,3 → „gleich“; +1,2 → „weiss“; Matt für Schwarz → „schwarz“.
 * Sonderfall: genau ±0,5 zählt noch als ausgeglichen.
 */
export function einschaetzungDerEngine(wert: Wert): Einschaetzung {
  const bauern = wertFuer(wert, true);
  if (bauern > AUSGEGLICHEN_BIS) return "weiss";
  if (bauern < -AUSGEGLICHEN_BIS) return "schwarz";
  return "gleich";
}
