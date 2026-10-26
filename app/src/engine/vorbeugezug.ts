/**
 * Vorbeugezug mit der Engine: Welcher eigene Zug nimmt dem Gegner seinen Plan?
 *
 * Rolle im Gesamtbild: Vorschlag D4 (Entscheidung des Autors vom 15.10.2026): „Gegner?“ zeigt in
 * einer Karte den Plan des Gegners (Nullzug, gegnerplan.ts) und dazu den eigenen Vorbeugezug.
 * Regel: Kapitel 6, Prophylaxe („Nenne seinen nächsten Zug und verhindere ihn“). Die Engine nimmt
 * ihre besten eigenen Züge der Reihe nach und prüft für jeden, was der Gegner danach spielen
 * würde; der erste Zug, nach dem er seinen Plan nicht mehr wählt, ist der Vorbeugezug.
 * Abhängigkeiten: gegnerplan.ts (Bewerter), spiel/zuege.ts (Züge umrechnen).
 */
import { fenNach, uciZuSan } from "../spiel/zuege";
import type { Bewerter } from "./gegnerplan";

/** So viele eigene Kandidaten prüft die Engine. */
export const VORBEUGE_KANDIDATEN = 3;

export interface Vorbeugung {
  /** Der eigene Zug (UCI). */
  readonly zug: string;
  /** Was der Gegner danach am liebsten spielt (UCI), oder null ohne Zug (Matt, Patt). */
  readonly antwort: string | null;
  /** Spielt der Gegner danach seinen Plan nicht mehr? */
  readonly verhindert: boolean;
}

/** Die Stellung nach einem Zug in UCI, oder null, wenn er nicht passt. */
function fenNachUci(fen: string, uci: string): string | null {
  const san = uciZuSan(fen, uci);
  return san ? fenNach(fen, san) : null;
}

/**
 * Sucht den Vorbeugezug.
 *
 * Eingaben: Bewerter, Stellung (eigene Seite am Zug), der Planzug des Gegners (UCI, aus dem
 * Nullzug), Rechenzeit für die eigenen Kandidaten und je Prüfung.
 * Ausgabe: der erste eigene Kandidat, nach dem der Gegner seinen Plan nicht mehr wählt; findet sich
 * keiner, der beste eigene Zug mit verhindert = false; null ohne eigene Züge.
 * Beispiel: Abb. 6.13 (Schwarz am Zug, Weiß plant Lxh7+): ein schwarzer Zug, nach dem Weiß nicht
 * mehr Lxh7+ spielt.
 */
export async function rechneVorbeugezug(
  bewerter: Bewerter,
  fen: string,
  plan: string,
  rechenzeitMs: number,
  pruefzeitMs: number,
): Promise<Vorbeugung | null> {
  const eigene = await bewerter.bewerte(fen, rechenzeitMs, VORBEUGE_KANDIDATEN);
  const kandidaten = eigene.varianten.map((v) => v.zuege[0]).filter((z) => z !== undefined);
  for (const zug of kandidaten) {
    const danach = fenNachUci(fen, zug);
    if (!danach) continue;
    const antwort = (await bewerter.bewerte(danach, pruefzeitMs, 1)).besterZug;
    if (antwort !== plan) return { zug, antwort, verhindert: true };
  }
  const bester = kandidaten[0];
  return bester ? { zug: bester, antwort: plan, verhindert: false } : null;
}
