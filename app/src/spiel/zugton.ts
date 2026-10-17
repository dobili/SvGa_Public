/**
 * Welcher Ton zu einem Zug gehört: Zug, Schlag, Schach, Matt oder Remis (Patt, Material, Wiederholung).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026): eigene Töne für Schach, Schachmatt, Patt und
 * Remis. Reine Funktion aus der Stellung nach dem Zug; das Brett ruft sie beim Wechsel des letzten
 * Zuges (ui/brett/useZugton.ts), die Töne selbst erzeugt app/ton.ts.
 * Abhängigkeiten: spiel/zuege.ts (regelstellung).
 */
import { regelstellung } from "./zuege";

export type Tonart = "zug" | "schlag" | "schach" | "matt" | "remis" | "warnung";

/**
 * Die Tonart zur Stellung nach einem Zug.
 *
 * Eingaben: Stellung nach dem Zug (FEN), ob der Zug geschlagen hat. Ausgabe: matt vor remis vor
 * schach vor schlag vor zug. Beispiel: nach 4. Dxf7# → „matt“; nach 2. Dh5 (kein Schach) → „zug“;
 * nach Lxf7+ → „schach“. Sonderfall: eine unlesbare Stellung ergibt „zug“ oder „schlag“.
 */
export function tonartNach(fen: string, geschlagen: boolean): Tonart {
  const pos = regelstellung(fen);
  if (pos) {
    if (pos.isCheckmate()) return "matt";
    if (pos.isStalemate() || pos.isInsufficientMaterial()) return "remis";
    if (pos.isCheck()) return "schach";
  }
  return geschlagen ? "schlag" : "zug";
}
