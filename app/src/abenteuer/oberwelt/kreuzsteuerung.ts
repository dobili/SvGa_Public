/**
 * Rückrufe des Steuerkreuzes in der Oberwelt (aus Oberwelt.tsx gelöst, 25.11.2026, damit die Datei
 * unter 400 Zeilen bleibt): Richtung an die Szene, Rennen an die Gangart, beides mit dem Vermerk
 * für die Steuerhinweise (useSteuerhinweis.ts).
 * Abhängigkeiten: kern.ts (szeneAus), useSteuerhinweis.ts (Typ).
 */
import type { RefObject } from "react";
import { szeneAus } from "./kern";
import type { Richtung } from "./szene";
import type { Hinweissteuerung } from "./useSteuerhinweis";

export function kreuzsteuerung(spiel: RefObject<Phaser.Game | null>, hinweis: Hinweissteuerung) {
  return {
    beiRichtung: (richtung: Richtung, gedrueckt: boolean) => {
      if (gedrueckt) hinweis.benutzt("steuerkreuz");
      szeneAus(spiel)?.setzeRichtung(richtung, gedrueckt);
    },
    beiGangart: (rennen: boolean) => {
      if (rennen) hinweis.benutzt("rennen");
      szeneAus(spiel)?.gangart.setzeKreuz(rennen);
    },
  };
}
