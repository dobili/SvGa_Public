/**
 * Die Tasche einer Variante mit Märchenfiguren über dem Brett der Spielhülle (Wunsch von mittel-2,
 * 26.11.2026): welche Figuren jede Seite noch einsetzen kann, etwa „Deine Tasche: Falke, Bison“.
 *
 * Warum als Zeile: Die Figuren der Tasche stehen nicht auf dem Brett (FEN „[HEhe]“); eingesetzt
 * werden sie beim Zug einer Figur von der Grundreihe (Zusatzwahl.tsx). Eine leere Tasche zeigt
 * „leer“, damit der Leser sieht, dass nichts mehr kommt.
 * Abhängigkeiten: Tischblase.tsx (BrettfreieZeile), i18n (Figurennamen), texte/texte.ts.
 */
import type { Farbe } from "../../schach/stellung";
import { t } from "../../i18n/sprache";
import { tSpiel } from "../texte/texte";
import { BrettfreieZeile } from "./Tischblase";

/** Figurennamen der App je Buchstabe (auch Märchenfiguren). */
const NAMEN = {
  p: "figur.p",
  n: "figur.n",
  b: "figur.b",
  r: "figur.r",
  q: "figur.q",
  k: "figur.k",
  h: "figur.h",
  e: "figur.e",
  d: "figur.d",
} as const;

/** Die Figuren als Text („Falke, Bison“) oder „leer“. */
function figurenText(buchstaben: string): string {
  if (buchstaben === "") return tSpiel("huelle.tascheLeer");
  return [...buchstaben]
    .map((z) => z.toLowerCase())
    .map((z) => (z in NAMEN ? t(NAMEN[z as keyof typeof NAMEN]) : z))
    .join(", ");
}

export function Taschenzeile({
  tasche,
  eigene,
  gegner,
}: {
  tasche: { readonly weiss: string; readonly schwarz: string };
  eigene: Farbe;
  gegner: string;
}) {
  const meine = eigene === "white" ? tasche.weiss : tasche.schwarz;
  const fremde = eigene === "white" ? tasche.schwarz : tasche.weiss;
  return (
    <BrettfreieZeile testid="abenteuer-tasche">
      {tSpiel("huelle.tasche", { eigene: figurenText(meine), gegner, fremde: figurenText(fremde) })}
    </BrettfreieZeile>
  );
}
