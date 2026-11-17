/**
 * Texte der kurzen Partieformen: Zielsatz und bisheriger Verlauf (für anbindung/Kurzformzeile.tsx).
 *
 * Rolle im Gesamtbild: eigene Datei, damit die Komponenten-Datei nur Komponenten enthält.
 * Abhängigkeiten: i18n/sprache.ts, schach/notation.ts, texte/texte.ts, anbindung/useKurzform.ts.
 */
import { sprache } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { tSpiel } from "../texte/texte";
import type { Kurzformstand } from "./useKurzform";

/** Vorteil mit einer Nachkommastelle in der Schreibweise der Sprache („1,5“). */
function vorteilText(wert: number): string {
  return wert.toLocaleString(sprache(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Der Zielsatz einer kurzen Form. Beispiel: Vorteil, 10 Züge, 1 Bauer → „Ziel: in 10 Zügen …“. */
export function zieltext(stand: Kurzformstand): string {
  const { form } = stand;
  const werte = { zuege: form.zuege, vorteil: vorteilText(form.mindestvorteil ?? 1) };
  if (form.art === "endspiel")
    return tSpiel(`huelle.kurzform.ziel.endspiel.${form.ziel ?? "sieg"}`, werte);
  return tSpiel(`huelle.kurzform.ziel.${form.art}`, werte);
}

/**
 * Züge als Text mit Zugnummern ab dem ersten Zug von Weiß, in der Notation der Sprache.
 * Beispiel: ["e4", "c5", "Nf3"] auf Deutsch → „1. e4 c5 2. Sf3“.
 */
export function verlaufAlsText(zuege: readonly string[], sprachcode: string): string {
  return zuege
    .map((san, i) => `${i % 2 === 0 ? `${i / 2 + 1}. ` : ""}${sanInSprache(san, sprachcode)}`)
    .join(" ");
}
