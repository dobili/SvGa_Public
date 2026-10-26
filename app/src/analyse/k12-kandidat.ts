/**
 * Ein Kandidat des Werkzeugs k12-kandidaten: der Zug mit seiner Aufgabe, und ob er ruhig ist.
 *
 * Rolle im Gesamtbild: Rechenteil (analyse/k12-kandidaten.ts) und Textteil
 * (analyse/k12-kandidatentexte.ts) brauchen beide diesen Typ. Steht er hier, benutzen sich die
 * zwei Dateien nicht mehr gegenseitig (Ordnung im Code, docs/codefuehrer/8-verbesserungen.md).
 * Von außen geht der Import weiter über analyse/k12-kandidaten.ts, das alles weiterreicht.
 * Abhängigkeiten: schach/schachabwehr.ts (Typ Abwehrart).
 * Buchbezug: Kapitel 12, Denkroutine Schritt 2 („Jeder erfüllt eine konkrete Aufgabe: Schach,
 * Materialgewinn, Verteidigung einer Drohung …“).
 */
import type { Abwehrart } from "../schach/schachabwehr";

/** Die Aufgabe eines Kandidaten (Kapitel 12, Schritt 2). */
export type Kandidatenart = "schach" | "schlag" | "drohung" | "ruhig" | "mattabwehr" | Abwehrart;

/** Ein Kandidat mit seiner Aufgabe. */
export interface Kandidat {
  readonly san: string;
  readonly uci: string;
  readonly art: Kandidatenart;
  /** Ob es der nächste Zug des Buches ist. */
  readonly buchzug: boolean;
}

/**
 * Ein ruhiger Kandidat: kein Schach, kein Schlag, keine Drohung, keine Abwehr (der Buchzug oder
 * die Mattabwehr). Für ihn sagt die Rechnung einen Zug tief wenig über Material; seine Wirkung
 * zeigt die Bewertung der Engine (R43, Wunsch des Autors vom 23.10.2026).
 */
export function istRuhig(k: Kandidat): boolean {
  return k.art === "ruhig" || k.art === "mattabwehr";
}
