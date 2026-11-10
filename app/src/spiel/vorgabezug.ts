/**
 * Vorgegebene Züge des Gegners in Partien des Schach-Abenteuers: Kandidatenwahl und „Buch und
 * Bruch“ (docs/spiel/15_Routen_Ereignisse.md, Abschnitt 4, Punkte 2 und 6; Auftrag Runde 6).
 *
 * Rolle im Gesamtbild: Reine Logik für ui/komponenten/partie/botzug.ts (getestet in
 * vorgabezug.test.ts). Gewöhnliche Partien haben kein Feld `abenteuer` und bleiben unberührt.
 * - Kandidatenwahl (Stream auf der Glasbrücke): Der erste Zug des Gegners ist zufällig einer von
 *   drei vorgegebenen, einer davon ein Fehler; der Leser soll ihn bestrafen (Kapitel 4).
 * - Buch und Bruch (Z-1 in der Tankstelle): Der Gegner folgt einer Hauptvariante; weicht der Leser
 *   davon ab, spielt er von da an nur noch auf einer schwachen Stufe (Kapitel 11).
 * Abhängigkeiten: spiel/partie.ts (Typen), engine/stufen.ts (Typ der Stufe).
 */
import type { Stufennummer } from "../engine/stufen";
import type { Partie } from "./partie";

/** Vorgaben einer Abenteuer-Partie für die Zugwahl des Gegners. */
export interface Zugvorgabe {
  /** Kandidaten für den ersten Zug des Gegners (SAN), einer wird zufällig gewählt. */
  readonly kandidaten?: readonly string[];
  /** Hauptvariante ab der Startstellung (SAN, beide Seiten) und die Stufe nach dem Abweichen. */
  readonly buchbruch?: { readonly linie: readonly string[]; readonly stufe: Stufennummer };
}

type Partieteil = Pick<Partie, "zuege" | "einstellung">;

/** Die Vorgabe einer Partie (Feld `abenteuer` der Einstellung), sonst leer. */
function vorgabeVon(partie: Partieteil): Zugvorgabe {
  return partie.einstellung.abenteuer ?? {};
}

/** Folgt die Partie bisher der Linie (jeder gespielte Zug wie vorgegeben)? */
function folgtLinie(partie: Partieteil, linie: readonly string[]): boolean {
  return partie.zuege.every((z, i) => linie[i] === z.san);
}

/**
 * Der vorgegebene Zug des Gegners in dieser Lage, sonst null (dann wählt die Engine).
 * `legal` prüft einen SAN-Zug in der aktuellen Stellung.
 * Beispiel: Kandidaten ["Nf6", "Qh4", "f6"], noch kein Zug des Gegners → einer der drei.
 */
export function vorgegebenerZug(
  partie: Partieteil,
  legal: (san: string) => boolean,
  zufall: () => number,
): string | null {
  const { kandidaten, buchbruch } = vorgabeVon(partie);
  const ersterZugDesGegners = !partie.zuege.some((z) => z.von === "engine");
  if (kandidaten && kandidaten.length > 0 && ersterZugDesGegners) {
    const moegliche = kandidaten.filter(legal);
    const wahl = moegliche[Math.floor(zufall() * moegliche.length)];
    if (wahl) return wahl;
  }
  if (buchbruch && folgtLinie(partie, buchbruch.linie)) {
    const naechster = buchbruch.linie[partie.zuege.length];
    if (naechster && legal(naechster)) return naechster;
  }
  return null;
}

/**
 * Die Stufe nach dem Bruch: Ist der Leser von der Linie abgewichen, die schwache Stufe der Vorgabe;
 * sonst null (die gewöhnliche Stufe gilt).
 * Beispiel: Linie 1. e4 e5 2. Nf3, der Leser spielt 2. Bc4 → Stufe 2 ab dem nächsten Zug.
 */
export function stufeNachBruch(partie: Partieteil): Stufennummer | null {
  const { buchbruch } = vorgabeVon(partie);
  if (!buchbruch || folgtLinie(partie, buchbruch.linie)) return null;
  return buchbruch.stufe;
}
