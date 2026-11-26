/**
 * Rückrufe des Joysticks in der Oberwelt (aus Oberwelt.tsx gelöst, 25.11.2026, damit die Datei
 * unter 400 Zeilen bleibt): Richtung und Blick an die Szene, Rennen an die Gangart, beides mit dem
 * Vermerk für die Steuerhinweise (useSteuerhinweis.ts). Der Hinweis heißt intern weiter
 * „steuerkreuz“ (Dialogvariable hinweisSteuerkreuz in den Spielständen), zeigt aber den Joystick.
 * Jede Lage wird auch außerhalb der Szene vermerkt (gehalteneeingabe.ts), damit die Szene der
 * nächsten Karte den gehaltenen Daumen übernimmt. Dafür bleibt der Joystick auch stehen, während
 * die nächste Karte lädt (`bleibt`): Die Welt ist dann kurz null, und ein ausgehängter Joystick
 * verlöre den Daumen (Zeigerfang weg, kein Loslassen gemeldet).
 * Abhängigkeiten: kern.ts (szeneAus), gehalteneeingabe.ts, useSteuerhinweis.ts (Typ), heldsteuerung.ts (Typ).
 */
import { useState, type RefObject } from "react";
import { merkeJoystick, merkeJoystickRennen } from "./gehalteneeingabe";
import { szeneAus } from "./kern";
import type { Steuereingabe } from "./heldsteuerung";
import type { Hinweissteuerung } from "./useSteuerhinweis";

/**
 * Rückrufe des Joysticks und ob er ohne geladene Welt stehen bleibt. Eingaben: das Spiel, die
 * Steuerhinweise, ob die Welt der aktuellen Karte geladen ist. `bleibt` ist true, sobald einmal
 * eine Welt da war (beim ersten Laden gibt es noch keinen Joystick und keinen Daumen).
 */
export function useJoysticksteuerung(
  spiel: RefObject<Phaser.Game | null>,
  hinweis: Hinweissteuerung,
  weltDa: boolean,
) {
  // Abgeleiteter Zustand, beim Zeichnen gesetzt (React zeichnet dann sofort neu, ohne Effekt).
  const [schonDa, setzeSchonDa] = useState(false);
  if (weltDa && !schonDa) setzeSchonDa(true);
  return {
    bleibt: schonDa || weltDa,
    beiSteuerung: (eingabe: Steuereingabe | null) => {
      if (eingabe) hinweis.benutzt("steuerkreuz");
      merkeJoystick(eingabe);
      szeneAus(spiel)?.setzeSteuerung(eingabe);
    },
    beiGangart: (rennen: boolean) => {
      if (rennen) hinweis.benutzt("rennen");
      merkeJoystickRennen(rennen);
      szeneAus(spiel)?.gangart.setzeKreuz(rennen);
    },
  };
}
