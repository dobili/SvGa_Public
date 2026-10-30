/**
 * Namen gespeicherter Eröffnungswerte zur Anzeige, mit den deutschen Namen der Eröffnungen nach
 * Spielstärke, sobald deren Daten geladen sind (Paket 9: Gegnereditor und Spielfenster).
 * Abhängigkeiten: spiel/boteroeffnung.ts, daten/laden.ts, useDaten, i18n.
 */
import { useCallback } from "react";
import { ladeEroeffnungsbaender } from "../../../daten/laden";
import { sprache } from "../../../i18n/sprache";
import { eroeffnungsname } from "../../../spiel/boteroeffnung";
import { useDaten } from "../bausteine/useDaten";

/**
 * Eine Funktion von Wert zu Name. Beispiel: „praxis:Italian Game“ → „Italienische Partie“
 * (vor dem Laden der Daten „Italian Game“).
 */
export function useEroeffnungsname(): (wert: string) => string {
  const daten = useDaten(ladeEroeffnungsbaender, "eroeffnungsbaender");
  const geladen = daten.art === "fertig" ? daten.wert : null;
  return useCallback(
    (wert: string) => eroeffnungsname(wert, geladen, sprache() === "de"),
    [geladen],
  );
}
