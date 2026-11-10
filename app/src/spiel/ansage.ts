/**
 * Ansage des Gegnerzugs vor dem Brett: Partie nach Gehör im Schach-Abenteuer (Funkschach auf
 * Weg 7, docs/spiel/15_Routen_Ereignisse.md, Abschnitt 4, Punkt 3; Auftrag Runde 6).
 *
 * Rolle im Gesamtbild: Ein kleiner Speicher mit Zuhörern, ohne React. ui/komponenten/partie/
 * botzug.ts sagt bei Variante „gehoer“ den Zug an und setzt ihn erst nach `ANSAGE_MS` auf das
 * Brett; die Kartenleiste des Abenteuers zeigt die Ansage (anbindung/Funkansage.tsx).
 * Beispiel: sageAn("weg7.funk#a1", "Nf3") → Zuhörer bekommen { partie: "weg7.funk#a1", san: "Nf3" }.
 */

/** So lange steht der Zug nur als Ansage da, bevor er auf das Brett kommt. */
export const ANSAGE_MS = 2500;

/** Die letzte Ansage einer Partie (Kennung des Abenteuers). */
export interface Ansage {
  readonly partie: string;
  readonly san: string;
}

let letzte: Ansage | null = null;
const zuhoerer = new Set<(ansage: Ansage | null) => void>();

/** Sagt einen Zug an (oder löscht die Ansage mit null) und benachrichtigt die Zuhörer. */
export function sageAn(ansage: Ansage | null): void {
  letzte = ansage;
  for (const z of zuhoerer) z(ansage);
}

/** Die letzte Ansage, etwa beim ersten Zeichnen der Leiste. */
export function letzteAnsage(): Ansage | null {
  return letzte;
}

/** Meldet sich für Ansagen an; zurück kommt die Abmeldung. */
export function beiAnsage(zuhoeren: (ansage: Ansage | null) => void): () => void {
  zuhoerer.add(zuhoeren);
  return () => zuhoerer.delete(zuhoeren);
}
