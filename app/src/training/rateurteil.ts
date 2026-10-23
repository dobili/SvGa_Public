/**
 * Zug erraten: Wie gut war der eigene Zug im Vergleich zum Partiezug? (W12)
 *
 * Rolle im Gesamtbild: Kapitel 12 nennt den Sinn der Methode: „erst selbst denken und dann
 * vergleichen“. Ein anderer Zug als der des Meisters ist nicht automatisch schlecht. Die Engine
 * rechnet nach einem verfehlten Zug genau die beiden Züge (eigener und Partiezug), und der
 * Trainer sagt, ob der eigene gleichwertig, schwächer oder sogar stärker war. Rein und ohne Engine
 * testbar.
 * Abhängigkeiten: engine/uci.ts (Variante), engine/spielbewerter.ts (Wert aus Sicht der Seite).
 * Buchbezug: Kapitel 12, „Von Meistern lernen: Zug erraten statt Zug lesen“.
 */
import type { Variante, Wert } from "../engine/uci";
import { wertFuer } from "../engine/spielbewerter";

/** Bis zu diesem Abstand (Bauerneinheiten) gelten beide Züge als gleichwertig. */
export const GLEICHWERTIG_BIS = 0.3;

export interface Rateurteil {
  readonly art: "gleichwertig" | "schwaecher" | "staerker";
  /** Abstand zum Partiezug in Bauerneinheiten, immer positiv. */
  readonly unterschied: number;
  /** Die Werte beider Züge, aus Sicht von Weiß (R46: beide Bewertungen nebeneinander). */
  readonly eigenerWert: Wert;
  readonly partieWert: Wert;
  /** Die Variante der Engine nach dem eigenen Zug (UCI, erster Zug ist der eigene). */
  readonly eigeneFolge: readonly string[];
}

/** Ob ein Matt im Spiel ist; dann ist ein Abstand in Bauerneinheiten nicht sinnvoll. */
export function mitMatt(urteil: Rateurteil): boolean {
  return urteil.eigenerWert.art === "matt" || urteil.partieWert.art === "matt";
}

/**
 * Vergleicht den eigenen Zug mit dem Partiezug.
 *
 * Eingaben: Varianten der Engine für genau diese beiden Züge, beide Züge in UCI, ob Weiß zieht.
 * Ausgabe: das Urteil mit beiden Werten und der Variante nach dem eigenen Zug, oder null, wenn
 * einer der beiden Züge in den Varianten fehlt.
 * Beispiel: Partiezug +0,5, eigener Zug +0,4 → gleichwertig (0,1); eigener Zug −0,5 → schwächer
 * um 1,0.
 */
export function rateurteil(
  varianten: readonly Variante[],
  eigen: string,
  partie: string,
  weissZieht: boolean,
): Rateurteil | null {
  const eigeneVariante = varianten.find((x) => x.zuege[0] === eigen);
  const partieVariante = varianten.find((x) => x.zuege[0] === partie);
  if (!eigeneVariante || !partieVariante) return null;
  const werte = {
    eigenerWert: eigeneVariante.wert,
    partieWert: partieVariante.wert,
    eigeneFolge: eigeneVariante.zuege,
  };
  const abstand =
    wertFuer(eigeneVariante.wert, weissZieht) - wertFuer(partieVariante.wert, weissZieht);
  const unterschied = Math.abs(abstand);
  if (unterschied <= GLEICHWERTIG_BIS) return { art: "gleichwertig", unterschied, ...werte };
  return { art: abstand < 0 ? "schwaecher" : "staerker", unterschied, ...werte };
}
