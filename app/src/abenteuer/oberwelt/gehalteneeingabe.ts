/**
 * Gehaltene Eingaben über einen Kartenwechsel hinweg (Befund aus der Zeitlupen-Arbeit, 26.11.2026).
 *
 * Warum: Jede Karte baut ihre Szene neu, und mit ihr Heldsteuerung und Gangartsteuerung. Die neuen
 * Phaser-Tasten wissen nichts von einer Taste, die schon vor dem Wechsel gedrückt war (ein Browser
 * meldet sie erst mit der nächsten Wiederholung, Playwright nie), und der Joystick meldet nur
 * Änderungen. So blieb der Held auf der neuen Karte stehen, obwohl Daumen oder Taste noch drückten;
 * man musste loslassen und neu drücken. Hier liegt der Eingabezustand außerhalb der Szene: Die
 * neue Steuerung übernimmt ihn, und der Held läuft nach der Eingabepause (eingabepause.ts) weiter.
 * Rolle im Gesamtbild: Eingabeschicht. Joystick.tsx (über joysticksteuerung.ts) meldet hier jede
 * Lage, heldsteuerung.ts und gangart.ts lesen sie beim Aufbau und je Bild. Die Tastatur verfolgt
 * eigene Hörer am Fenster (Pfeile, WASD, Umschalttaste); sie vergessen alles, wenn das Fenster den
 * Fokus verliert oder unsichtbar wird, damit nichts „klemmt“.
 * Beispiel: Pfeil rechts gehalten, durch die Tür → neue Karte, 350 ms Pause, der Held läuft weiter.
 * Abhängigkeiten: achtrichtung.ts (Typen), heldsteuerung.ts (Typ).
 */
import type { Hauptrichtung } from "./achtrichtung";
import type { Steuereingabe } from "./heldsteuerung";

/** Tasten (KeyboardEvent.code) je Hauptrichtung: Pfeil und WASD. */
const RICHTUNGSTASTEN: Readonly<Record<Hauptrichtung, readonly string[]>> = {
  oben: ["ArrowUp", "KeyW"],
  unten: ["ArrowDown", "KeyS"],
  links: ["ArrowLeft", "KeyA"],
  rechts: ["ArrowRight", "KeyD"],
};
/** Die Umschalttasten (Rennen, gangart.ts). */
const UMSCHALT = ["ShiftLeft", "ShiftRight"];

const gedrueckt = new Set<string>();
let beobachtet = false;
let joystick: { eingabe: Steuereingabe | null; rennen: boolean } = { eingabe: null, rennen: false };

/** Hörer am Fenster einmal einrichten (ohne Fenster, etwa im Test ohne DOM: nichts). */
function beobachteTasten(): void {
  if (beobachtet || typeof window === "undefined") return;
  beobachtet = true;
  const vergiss = () => gedrueckt.clear();
  window.addEventListener("keydown", (e) => gedrueckt.add(e.code), true);
  window.addEventListener("keyup", (e) => gedrueckt.delete(e.code), true);
  window.addEventListener("blur", vergiss);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") vergiss();
  });
}

/**
 * Ist eine Taste der Richtung gerade gedrückt (Pfeil oder WASD)? Richtet beim ersten Aufruf die
 * Hörer ein; heldsteuerung.ts ruft es schon beim Aufbau der ersten Szene.
 */
export function richtungGehalten(richtung: Hauptrichtung): boolean {
  beobachteTasten();
  return RICHTUNGSTASTEN[richtung].some((code) => gedrueckt.has(code));
}

/** Ist eine Umschalttaste gedrückt? */
export function umschaltGehalten(): boolean {
  beobachteTasten();
  return UMSCHALT.some((code) => gedrueckt.has(code));
}

/** Der Joystick meldet seine Lage (null: Daumen weg, joysticksteuerung.ts). */
export function merkeJoystick(eingabe: Steuereingabe | null): void {
  joystick = { eingabe, rennen: eingabe ? joystick.rennen : false };
}

/** Der Joystick meldet großen Ausschlag (rennen) oder nicht. */
export function merkeJoystickRennen(rennen: boolean): void {
  joystick = { ...joystick, rennen };
}

/** Was der Joystick gerade hält: Eingabe (oder null) und ob er rennt. */
export function gehaltenerJoystick(): {
  readonly eingabe: Steuereingabe | null;
  readonly rennen: boolean;
} {
  return joystick;
}

/** Nur für Tests: alles vergessen. */
export function vergissEingaben(): void {
  gedrueckt.clear();
  joystick = { eingabe: null, rennen: false };
}
