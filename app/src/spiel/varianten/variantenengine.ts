/**
 * Engine für Varianten (Auftrag des Hauptchats, 26.11.2026; Wünsche von mittel-2 und mittel-4):
 * Bewertete Kandidatenzüge und legale Züge für Stellungen jeder Variante, über Fairy-Stockfish.
 *
 * Warum eigene Schnittstelle: Die gewöhnliche Engineanbindung (engine/) kennt nur Schach. Bots
 * für Varianten (Drache, Ente, Tandem) und Regelschichten für Märchenfiguren, die chessops nicht
 * kennt, brauchen dieselbe Engine mit `UCI_Variant`. Die Umsetzung (Zusatzpaket wie Maia, ein Kern)
 * meldet sich hier an; bis dahin ist keine angemeldet, und `variantenengine()` gibt null zurück.
 * Abhängigkeiten: spiel/varianten/variante.ts (Engineangabe).
 */
import type { Engineangabe } from "./variante";

/** Eine Frage an die Engine. Stärke frei: Skill Level 0 bis 20 und/oder höchste Tiefe. */
export interface Variantenanfrage {
  readonly fen: string;
  readonly engine: Engineangabe;
  /** Rechenzeit in Millisekunden. */
  readonly ms: number;
  /** Wie viele Kandidaten (MultiPV), mindestens 1. */
  readonly kandidaten: number;
  readonly staerke?: { readonly skill?: number; readonly tiefe?: number };
}

/** Ein Kandidatenzug mit Wert aus Sicht der Seite am Zug: Hundertstel Bauern oder Matt in n. */
export interface Variantenkandidat {
  /** UCI; Ente in der Schreibweise von Fairy-Stockfish „e2e4,e4d5“, Einsetzen „P@e4“. */
  readonly zug: string;
  readonly wert: { readonly cp: number } | { readonly matt: number };
}

/** Was eine Variantenengine kann. */
export interface Variantenengine {
  /** Kandidaten, bester zuerst. */
  analysiere(anfrage: Variantenanfrage): Promise<readonly Variantenkandidat[]>;
  /** Alle legalen Züge in UCI (über `go perft 1`), für Stellungen mit Märchenfiguren. */
  legaleZuege(fen: string, engine: Engineangabe): Promise<readonly string[]>;
}

let angemeldet: Variantenengine | null = null;

/** Meldet die Umsetzung an (einmal, beim Laden des Zusatzpakets). */
export function meldeVariantenengineAn(engine: Variantenengine): void {
  angemeldet = engine;
}

/** Die angemeldete Variantenengine oder null, solange das Zusatzpaket fehlt. */
export function variantenengine(): Variantenengine | null {
  return angemeldet;
}
