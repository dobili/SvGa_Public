/**
 * Rückrufe des Joysticks in der Oberwelt (aus Oberwelt.tsx gelöst, 25.11.2026, damit die Datei
 * unter 400 Zeilen bleibt): Richtung und Blick an die Szene, Rennen an die Gangart, beides mit dem
 * Vermerk für die Steuerhinweise (useSteuerhinweis.ts). Der Hinweis heißt intern weiter
 * „steuerkreuz“ (Dialogvariable hinweisSteuerkreuz in den Spielständen), zeigt aber den Joystick.
 * Abhängigkeiten: kern.ts (szeneAus), useSteuerhinweis.ts (Typ), heldsteuerung.ts (Typ).
 */
import type { RefObject } from "react";
import { szeneAus } from "./kern";
import type { Steuereingabe } from "./heldsteuerung";
import type { Hinweissteuerung } from "./useSteuerhinweis";

export function joysticksteuerung(spiel: RefObject<Phaser.Game | null>, hinweis: Hinweissteuerung) {
  return {
    beiSteuerung: (eingabe: Steuereingabe | null) => {
      if (eingabe) hinweis.benutzt("steuerkreuz");
      szeneAus(spiel)?.setzeSteuerung(eingabe);
    },
    beiGangart: (rennen: boolean) => {
      if (rennen) hinweis.benutzt("rennen");
      szeneAus(spiel)?.gangart.setzeKreuz(rennen);
    },
  };
}
