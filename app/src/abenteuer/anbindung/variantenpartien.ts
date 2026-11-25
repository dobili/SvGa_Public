/**
 * Eigene Partiekomponenten für Varianten mit eigenem Ablauf (Auftrag des Hauptchats, 26.11.2026;
 * Wunsch von mittel-4): Tandem (zwei Bretter), Ente (zweiter Teilzug), Nebel (eigene Sicht), auf
 * Wunsch auch Varianten mit Märchenfiguren (mittel-2).
 *
 * Warum: Die Spielhülle (anbindung/PartieHuelle.tsx) übernimmt Rahmen, Porträt, Ergebnis, den
 * Dialogknoten danach und die Belohnung wie bei Schach960. Nur das Brett und der Bot sind je
 * Variante eigen. Eine Variante mit `ablauf: "eigene_partie"` meldet hier ihre Komponente an; die
 * Hülle zeigt sie an Stelle ihres Bretts und nimmt das Ergebnis über `beiEnde` entgegen.
 * Abhängigkeiten: React (Typ), abenteuer/schnittstelle/partie.ts.
 */
import type { ComponentType } from "react";
import type { Ausgang, Partieauftrag } from "../schnittstelle/partie";

/** Ergebnis einer eigenen Variantenpartie. */
export interface Variantenergebnis {
  /** Aus Sicht des Lesers; „abgebrochen“, wenn er die Partie verlässt. */
  readonly ausgang: Ausgang;
  /** Gespielte Halbzüge (für Ambroses Satz danach und die Statistik). */
  readonly halbzuege: number;
  /** Zugfolge als Text, wenn die Variante eine hat (nur zum Nachlesen). */
  readonly zuege?: readonly string[];
}

/** Was die Hülle der Komponente gibt. */
export interface Variantenpartiewerte {
  readonly auftrag: Partieauftrag;
  /** Gegnerstärke als Elo-Schätzung der Begegnung (wie beim Bot der Hülle). */
  readonly staerke: number;
  readonly eigeneFarbe: "weiss" | "schwarz";
  readonly beiEnde: (ergebnis: Variantenergebnis) => void;
}

const KOMPONENTEN = new Map<string, ComponentType<Variantenpartiewerte>>();

/** Meldet die Partiekomponente einer Variante an (Kennung wie in spiel/varianten). */
export function registriereVariantenpartie(
  kennung: string,
  komponente: ComponentType<Variantenpartiewerte>,
): void {
  if (KOMPONENTEN.has(kennung)) throw new Error(`Partie für ${kennung} ist schon angemeldet`);
  KOMPONENTEN.set(kennung, komponente);
}

/** Die angemeldete Komponente oder undefined (dann spielt die Hülle selbst). */
export function variantenpartie(kennung: string): ComponentType<Variantenpartiewerte> | undefined {
  return KOMPONENTEN.get(kennung);
}
