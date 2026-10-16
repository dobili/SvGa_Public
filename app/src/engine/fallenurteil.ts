/**
 * Fallenurteil: Ist das Material im Angebot ein Geschenk oder eine Falle?
 *
 * Rolle im Gesamtbild: Kern des Werkzeugs k4-falle. Pflichtenheft 6.2: „Die Engine vergleicht
 * ‚Material nehmen‘ mit dem besten anderen Zug und sagt, ob das Angebot eine Falle ist.“ Dieses
 * Modul vergleicht nur zwei Werte und ist ohne Engine testbar; die Werte liefert
 * fallenpruefung.ts.
 * Abhängigkeiten: uci.ts (Wert).
 * Buchbezug: Kapitel 4, „Fallenkabinett“: Ein Schlag ist eine Falle, wenn er gegenüber dem
 * besten anderen Zug Material oder die Partie kostet (Abb. 4.11: Lxf3?? Sxc7#).
 */
import type { Color } from "chessops/types";
import type { Wert } from "./uci";

/** Ab so vielen Bauerneinheiten schlechter als der beste andere Zug ist ein Schlag eine Falle. */
export const FALLE_AB_BAUERN = 1.0;
/** Ein Matt zählt als sehr großer Wert, ein schnelleres Matt als größer. */
const MATT_WERT = 1000;

/** Ein Wert aus Sicht einer Farbe als Zahl (Bauerneinheiten, Matt als ±1000 minus Züge). */
export function wertFuer(wert: Wert, farbe: Color): number {
  const weiss =
    wert.art === "bauern"
      ? wert.bauern
      : Math.sign(wert.zuege) * (MATT_WERT - Math.abs(wert.zuege));
  return farbe === "white" ? weiss : -weiss;
}

export type Fallenurteil =
  | { readonly art: "falle"; readonly verlust: number }
  | { readonly art: "geschenk" }
  | { readonly art: "einzigerZug" };

/**
 * Vergleicht „Material nehmen“ mit dem besten anderen Zug.
 *
 * Eingaben: Wert nach dem Schlag, Wert des besten anderen Zuges (null, wenn es keinen gibt), Seite
 * am Zug. Ausgabe: Falle mit dem Verlust in Bauerneinheiten (gegenüber dem anderen Zug), Geschenk
 * oder „einziger Zug“. Beispiel: Abb. 4.11: Lxf3 führt zu Matt, der beste andere Zug hält etwa
 * gleich, also Falle.
 */
export function beurteile(
  nachSchlag: Wert,
  besterAndererZug: Wert | null,
  farbe: Color,
): Fallenurteil {
  if (!besterAndererZug) return { art: "einzigerZug" };
  const verlust = wertFuer(besterAndererZug, farbe) - wertFuer(nachSchlag, farbe);
  return verlust >= FALLE_AB_BAUERN ? { art: "falle", verlust } : { art: "geschenk" };
}
