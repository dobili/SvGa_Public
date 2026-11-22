/**
 * Zuwendung in der Szene (Regeln in zuwendung.ts): Spricht der Held eine Figur an, dreht sie sich
 * zu ihm; im Gespräch dreht sich, wer spricht (`#sprecher`), wenn er auf der Karte steht. Nach dem
 * Gespräch kehrt jede gedrehte Figur nach ZURUECK_MS in ihre alte Blickrichtung (`blick` der Szene)
 * zurück, damit es natürlich wirkt (Wunsch des Autors, 22.11.2026).
 *
 * Die alte Richtung liegt als Rahmen am Sprite (GRUNDBILD), nur solange die Figur gedreht ist.
 * Andere Figuren im Gespräch bleiben, wie sie stehen: Sie hören zu, ohne hin und her zu drehen.
 * Geht eine Figur einen geführten Weg (fuehrungsschicht.ts, GEFUEHRT), gilt danach ihre neue
 * Richtung; sie dreht sich nicht zurück.
 * Rolle im Gesamtbild: gerufen von useAusloeser.ts (Ansprechen) und useBuehne.ts (Sprecher,
 * Dialogende). Abhängigkeiten: Phaser, zuwendung.ts, figurbilder.ts, sitzrichtung.ts.
 */
import Phaser from "phaser";
import { standbild } from "./figurbilder";
import type { Fuehrungszugang } from "./fuehrungsschicht";
import { LIEGT } from "./sitzrichtung";
import { PLATZHALTER_BILD, zuwendung, type Figurlage } from "./zuwendung";

/** Datenschlüssel am Sprite: Rahmen vor dem Drehen (nur solange gedreht). */
export const GRUNDBILD = "grundbild";
/** Datenschlüssel am Sprite: Die Figur geht gerade einen geführten Weg. */
export const GEFUEHRT = "gefuehrt";
/** Datenschlüssel am Sprite: Die Figur sitzt (figurensitz.ts). */
export const SITZT = "sitzt";
/** Verzug, bis sich die Figuren nach dem Gespräch zurückdrehen (ms). */
const ZURUECK_MS = 1000;

/** Texturschlüssel des Platzhalterbogens (szene.ts lädt ihn als „figur“). */
const PLATZHALTER = "figur";

/** Welcher Bogen die Figur zeichnet. */
function bildart(figur: Phaser.GameObjects.Sprite, name: string): Figurlage["bild"] {
  if (figur.texture.key === `figur:${name}`) return "eigen";
  return figur.texture.key === PLATZHALTER ? "platzhalter" : "anderes";
}

/**
 * Für die Oberflächentests: die letzte Zuwendung als Attribut der Spielfläche
 * (`data-zuwendung="mutter=links"`, nach dem Rückweg `…=zurueck`); im Spiel ohne Wirkung.
 */
function meldeFuerTests(z: Fuehrungszugang, wert: string): void {
  z.szene.game.canvas?.setAttribute("data-zuwendung", wert);
}

/** Je Szene der laufende Rückweg, damit ein neues Gespräch ihn abbrechen kann. */
const rueckwege = new WeakMap<Phaser.Scene, Phaser.Time.TimerEvent>();

/** Eine Figur der Karte mit diesem Namen, oder null (der Held zählt nicht). */
function figurNamens(z: Fuehrungszugang, name: string): Phaser.Physics.Arcade.Sprite | null {
  if (name === "held") return null;
  const figur = z.szene.children.getByName(name);
  return figur instanceof Phaser.Physics.Arcade.Sprite ? figur : null;
}

/**
 * Dreht die Figur `name` zum Helden, falls sie das darf (zuwendung.ts). Bricht einen laufenden
 * Rückweg ab. Beispiel: Held links neben Mama → Mama zeigt das Standbild „links“.
 */
export function wendeZu(z: Fuehrungszugang, name: string): void {
  const figur = figurNamens(z, name);
  if (!figur) return;
  rueckwege.get(z.szene)?.remove(false);
  rueckwege.delete(z.szene);
  const blick = zuwendung(
    {
      x: figur.x,
      y: figur.y,
      sitzt: figur.getData(SITZT) === true,
      liegt: figur.getData(LIEGT) === true,
      gefuehrt: figur.getData(GEFUEHRT) === true,
      bild: bildart(figur, name),
    },
    z.held,
  );
  if (!blick) return;
  if (figur.getData(GRUNDBILD) === undefined) figur.setData(GRUNDBILD, figur.frame.name);
  figur.setFrame(figur.texture.key === PLATZHALTER ? PLATZHALTER_BILD[blick] : standbild(blick));
  meldeFuerTests(z, `${name}=${blick}`);
}

/** Nach dem Gespräch: alle gedrehten Figuren nach ZURUECK_MS wieder in ihre alte Richtung. */
export function wendeZurueck(z: Fuehrungszugang): void {
  rueckwege.get(z.szene)?.remove(false);
  const weg = z.szene.time.delayedCall(ZURUECK_MS, () => {
    rueckwege.delete(z.szene);
    for (const kind of z.szene.children.list) {
      if (!(kind instanceof Phaser.Physics.Arcade.Sprite)) continue;
      const grund: unknown = kind.getData(GRUNDBILD);
      if (grund === undefined) continue;
      kind.setData(GRUNDBILD, undefined);
      if (typeof grund === "string" || typeof grund === "number") kind.setFrame(grund);
      meldeFuerTests(z, `${kind.name}=zurueck`);
    }
  });
  rueckwege.set(z.szene, weg);
}
