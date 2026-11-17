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

/** So viele Halbzüge zeigt der Einstieg höchstens; davor steht „…“ (lange Vorgeschichten aus dem Vorrat). */
export const VERLAUF_HOECHSTENS = 12;

/**
 * Züge als Text mit Zugnummern ab dem ersten Zug von Weiß, in der Notation der Sprache; von einer
 * langen Folge nur die letzten Halbzüge.
 * Beispiel: ["e4", "c6", "Nf3"] auf Deutsch → „1. e4 c6 2. Sf3“; 30 Halbzüge → „… 10. … 15... Td8“.
 */
export function verlaufAlsText(
  zuege: readonly string[],
  sprachcode: string,
  hoechstens = VERLAUF_HOECHSTENS,
): string {
  const ab = Math.max(0, zuege.length - hoechstens);
  const teile = zuege.slice(ab).map((san, j) => {
    const i = ab + j;
    const nummer = Math.floor(i / 2) + 1;
    const marke = i % 2 === 0 ? `${nummer}. ` : j === 0 ? `${nummer}... ` : "";
    return `${marke}${sanInSprache(san, sprachcode)}`;
  });
  return `${ab > 0 ? "… " : ""}${teile.join(" ")}`;
}
