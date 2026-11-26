/**
 * Bild der Auftritte (regeln/auftritt.ts): eine Figur am Übergang einblenden, wenn sie hereinkommt,
 * und ausblenden, wenn sie durch einen Übergang hinausgeht.
 *
 * Warum: Wer neu auf die Karte kommt, soll sichtbar durch die Tür kommen; wer geht, soll durch die
 * Tür verschwinden und nicht davor stehen bleiben (Befunde des Autors, 26.11.2026: Hale und {rivale}
 * standen nach der Partie vor der Tür des Clubraums und versperrten sie).
 * Rolle im Gesamtbild: Werkzeug für fuehrungsschicht.ts (`#gehe`) und auftrittsschicht.ts (Aufbau);
 * ohne Abhängigkeit von der Führung, damit beide es nutzen können.
 * Abhängigkeiten: Phaser, auftrittsziele.ts, gefuehrterweg.ts und fuehrungsschicht.ts (nur Typen).
 */
import Phaser from "phaser";
import type { Feld } from "./gefuehrterweg";
import type { Fuehrungszugang } from "./fuehrungsschicht";
import { rueckeAusloeser } from "./auftrittsziele";
export { istAusgang, rueckeAusloeser, uebergangsfelder } from "./auftrittsziele";

/** Datenschlüssel am Sprite: „wartet“ (unsichtbar am Übergang) oder „kommt“ (geht herein). */
export const AUFTRITT = "auftritt";
/** Datenschlüssel am Sprite: Die Figur ist durch einen Übergang hinausgegangen. */
export const GEGANGEN = "gegangen";
/** Dauer des Ein- und Ausblendens am Übergang (ms): kurz, wie ein Schritt durch die Tür. */
export const BLENDE_MS = 300;
/** Feld außerhalb jeder Karte: Dort liegt der Auslöser einer Figur, die nicht da ist. */
const NIRGENDS: Feld = { x: -1, y: -1 };

/** Schaltet den festen Körper einer Figur an oder aus und rückt ihn auf das Bild. */
function koerper(figur: Phaser.Physics.Arcade.Sprite, an: boolean): void {
  if (!figur.body) return;
  figur.body.enable = an;
  if (figur.body instanceof Phaser.Physics.Arcade.StaticBody) figur.body.updateFromGameObject();
}

/**
 * Stellt eine Figur unsichtbar auf ein Feld am Übergang, ohne Körper und ohne Auslöser (man kann sie
 * nicht ansprechen und läuft nicht gegen sie). Beispiel: Hale wartet in der Tür des Clubraums.
 */
export function lasseWarten(
  z: Fuehrungszugang,
  figur: Phaser.Physics.Arcade.Sprite,
  feld: Feld,
): void {
  figur.setPosition((feld.x + 0.5) * z.kachel, (feld.y + 0.5) * z.kachel).setDepth(figur.y);
  figur.setVisible(false).setAlpha(0).setData(AUFTRITT, "wartet");
  koerper(figur, false);
  rueckeAusloeser(z, figur.name, NIRGENDS);
}

/**
 * Vor einem `#gehe`: Eine wartende Figur tritt am Übergang hervor (blendet ein, bekommt ihren
 * Körper); eine, die gerade von selbst hereingeht, bricht diesen Weg ab und folgt dem Dialog.
 * Sonst nichts (Geister behalten ihr Schweben).
 */
export function trittHervor(z: Fuehrungszugang, figur: Phaser.Physics.Arcade.Sprite): void {
  const art = figur.getData(AUFTRITT) as string | undefined;
  if (art === undefined) return;
  figur.setData(AUFTRITT, undefined);
  z.szene.tweens.killTweensOf(figur);
  if (art === "wartet") {
    figur.setVisible(true).setAlpha(0);
    z.szene.tweens.add({ targets: figur, alpha: 1, duration: BLENDE_MS });
    koerper(figur, true);
  } else {
    figur.setAlpha(1);
  }
}

/**
 * Am Übergang angekommen: Die Figur geht hinaus (blendet aus, ohne Körper, ohne Auslöser) und steht
 * nicht mehr im Weg. Beispiel: „Dann sind sie weg.“ mit `#gehe:victorClub>schule`.
 */
export function gehtHinaus(z: Fuehrungszugang, figur: Phaser.Physics.Arcade.Sprite): Promise<void> {
  koerper(figur, false);
  rueckeAusloeser(z, figur.name, NIRGENDS);
  figur.setData(GEGANGEN, true);
  return new Promise((fertig) => {
    z.szene.tweens.add({
      targets: figur,
      alpha: 0,
      duration: BLENDE_MS,
      onComplete: () => {
        figur.setVisible(false);
        fertig();
      },
    });
  });
}
