/**
 * Feier des erreichten Wochenziels (Gamifizierung P4), aus der früheren Wochenkarte gelöst, damit
 * die Karte „Heute“ (Heutekarte.tsx) sie nutzt.
 *
 * Rolle im Gesamtbild: Hält neu erreichte Wochen im Feld `verdient` fest (so bleibt eine Woche
 * erreicht, auch wenn der Leser das Ziel später erhöht) und meldet, ob die laufende Woche dabei war;
 * dann zeigt die Karte einmal das kleine Feuerwerk.
 * Abhängigkeiten: training/wochenziel.ts, speicher/verdient.ts, Speicher.
 */
import { useEffect, useState } from "react";
import type { Nutzerdaten } from "../../../speicher/format";
import { aendere } from "../../../speicher/speicher";
import { mitVerdient } from "../../../speicher/verdient";
import { neuErreichteWochen, WOCHE_VERDIENT } from "../../../training/wochenziel";

/**
 * Hält neu erreichte Wochen fest; true, wenn dabei die laufende Woche war (dann feiern).
 * Sonderfall: frühere Wochen (etwa nach dem ersten Wählen des Ziels) kommen still dazu.
 */
export function useWochenfeier(daten: Nutzerdaten, montag: string): boolean {
  const [feiern, setzeFeiern] = useState(false);
  const neu = neuErreichteWochen(daten).join(",");
  useEffect(() => {
    if (neu === "") return;
    const schluessel = neu.split(",");
    void aendere((d) => mitVerdient(d, schluessel, new Date())).then((gespeichert) => {
      if (gespeichert && schluessel.includes(WOCHE_VERDIENT + montag)) setzeFeiern(true);
    });
  }, [neu, montag]);
  return feiern;
}
