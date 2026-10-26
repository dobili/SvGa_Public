/**
 * Eine beendete Partie mit ihrer Auswertung, so wie sie im Speicher liegt.
 *
 * Rolle im Gesamtbild: Der Typ gehört zu speicher/partien.ts (Konzept 4.7 „Partien“), wird aber
 * auch von spiel/wertung.ts gebraucht, das die Wertung des Lesers aus diesen Einträgen rechnet.
 * Steht er in einer eigenen Datei, benutzen sich speicher/partien.ts und spiel/wertung.ts nicht
 * mehr gegenseitig (Ordnung im Code, docs/codefuehrer/8-verbesserungen.md). Von außen geht der
 * Import weiter über speicher/partien.ts, das den Typ weiterreicht.
 * Abhängigkeiten: spiel/partie.ts (Typ).
 */
import type { Partie } from "../spiel/partie";

/** Eine beendete Partie mit ihrer Auswertung. */
export interface Partieeintrag {
  readonly partie: Partie;
  /** Wert je Stellung aus Sicht von Weiß in Bauerneinheiten; leer, solange nicht ausgewertet. */
  readonly werte: readonly number[];
  /** Bester Zug der Engine je Stellung (UCI, „“ in Endstellungen); leer wie „werte“. */
  readonly beste: readonly string[];
  /**
   * Abstand des besten zum zweitbesten Zug je Stellung in Bauerneinheiten (für das „!“ des
   * einzigen guten Zuges, seit 0.2.39); leer bei Auswertungen aus älteren Versionen.
   */
  readonly abstaende: readonly number[];
  /**
   * Hauptvariante der Engine je Stellung (UCI, bis sechs Halbzüge, beginnt mit dem besten Zug;
   * für „Danach etwa …“ in der Rückblickkarte, Empfehlung R5, 0.2.56); leer bei älteren
   * Auswertungen.
   */
  readonly varianten: readonly (readonly string[])[];
}
