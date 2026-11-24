/**
 * Ambrose als Begleiter auf der Karte (Regeln in regeln/begleiter.ts): Spricht der Geist in einem
 * Gespräch der Oberwelt und steht er nicht schon auf der Karte, erscheint er durchsichtig auf einem
 * freien Feld neben dem Helden; nach dem Gespräch blendet er aus. Er sperrt keinen Weg und läuft
 * nicht mit.
 *
 * Rolle im Gesamtbild: gerufen von oberwelt/useBuehne.ts (je Zeile und am Dialogende). Zeichnen
 * macht geistfigur.ts wie bei `#erscheint`; hier nur Feld, Blick und das Ein- und Ausblenden. Der
 * Sprite heißt „begleiter:<name>“, damit Zuwendung und Figurblende (suchen nach dem Namen der
 * Figur) ihn nicht anfassen.
 * Für die Oberflächentests steht der Zustand am Attribut `data-begleiter` der Spielfläche
 * („ambrose@6,5“, nach dem Gespräch „weg“); im Spiel ohne Wirkung.
 * Abhängigkeiten: Phaser, geistfigur.ts, figurbilder.ts, regeln/begleiter.ts.
 */
import Phaser from "phaser";
import {
  BEGLEITER_BLENDE_MS,
  begleiterblick,
  begleiterfeld,
  nebenDemHelden,
  type Blick,
  type Kachelfeld,
} from "../regeln/begleiter";
import { fussUrsprungY, standbild } from "./figurbilder";
import type { Fuehrungszugang } from "./fuehrungsschicht";
import { lasseGeistErscheinen } from "./geistfigur";
import { PLATZHALTER_BILD } from "./zuwendung";

/** Texturschlüssel des Platzhalterbogens (szene.ts lädt ihn als „figur“), Ursprung in der Mitte. */
const PLATZHALTER = "figur";
const MITTE = 0.5;

/** Der sichtbare Begleiter je Szene und das Feld, auf dem er steht. */
const begleiter = new WeakMap<
  Phaser.Scene,
  { sprite: Phaser.GameObjects.Sprite; feld: Kachelfeld }
>();

/** Kachelfeld eines Punktes in Pixeln. */
function feldVon(punkt: { readonly x: number; readonly y: number }, kachel: number): Kachelfeld {
  return { x: Math.floor(punkt.x / kachel), y: Math.floor(punkt.y / kachel) };
}

/** Felder, auf denen eine Figur, ein Statist oder ein Tier steht (alle Sprites außer dem Helden). */
function besetzteFelder(z: Fuehrungszugang): ReadonlySet<string> {
  const felder = new Set<string>();
  for (const ding of z.szene.children.list) {
    if (!(ding instanceof Phaser.GameObjects.Sprite) || ding === z.held || !ding.visible) continue;
    const feld = feldVon(ding, z.kachel);
    felder.add(`${feld.x},${feld.y}`);
  }
  return felder;
}

/** Meldet den Zustand für die Oberflächentests (siehe Dateikopf). */
function meldeFuerTests(szene: Phaser.Scene, wert: string): void {
  szene.game.canvas?.setAttribute("data-begleiter", wert);
}

/** Nimmt den Begleiter sofort von der Karte (vor dem Umstellen). */
function entferne(szene: Phaser.Scene): void {
  const alt = begleiter.get(szene);
  if (!alt) return;
  szene.tweens.killTweensOf(alt.sprite);
  alt.sprite.destroy();
  begleiter.delete(szene);
}

/**
 * Zeigt den Begleiter `name` neben dem Helden. Eingaben: Zugang der Szene, Kurzname der Figur
 * („ambrose“), Blick des Helden. Ausgabe: true, wenn er jetzt zu sehen ist.
 * Beispiel: Im Diner sagt Ambrose etwas → er blendet rechts neben dem Helden ein.
 * Sonderfälle: Steht er schon neben dem Helden, bleibt er, wo er ist. Ist der Held inzwischen
 * weitergegangen (`#gehe`), erscheint er neu neben ihm. Ohne freies Feld: nichts (das Porträt im
 * Gespräch bleibt). Ohne eigenen Bogen zeigt er die Platzhalterfigur.
 */
export function zeigeBegleiter(z: Fuehrungszugang, name: string, blick: Blick): boolean {
  const held = feldVon(z.held, z.kachel);
  const alt = begleiter.get(z.szene);
  if (alt?.sprite.active && nebenDemHelden(alt.feld, held)) return true;
  entferne(z.szene);
  const besetzt = besetzteFelder(z);
  const feld = begleiterfeld(held, blick, (x, y) => z.frei(x, y) && !besetzt.has(`${x},${y}`));
  if (!feld) return false;
  const mitte = { x: (feld.x + 0.5) * z.kachel, y: (feld.y + 0.5) * z.kachel };
  const richtung = begleiterblick(feld, held, blick);
  // Ohne eigenen Bogen (Paket ohne gekaufte Grafik): die Platzhalterfigur, damit er zu sehen ist.
  const eigen = z.szene.textures.exists(`figur:${name}`);
  const bild = eigen
    ? { schluessel: `figur:${name}`, nummer: standbild(richtung) }
    : { schluessel: PLATZHALTER, nummer: PLATZHALTER_BILD[richtung] };
  const ursprung = (s: Phaser.GameObjects.Sprite) => (eigen ? fussUrsprungY(s, z.kachel) : MITTE);
  const sprite = lasseGeistErscheinen(
    z.szene,
    `begleiter:${name}`,
    bild,
    mitte,
    ursprung,
    BEGLEITER_BLENDE_MS,
  );
  begleiter.set(z.szene, { sprite, feld });
  meldeFuerTests(z.szene, `${name}@${feld.x},${feld.y}`);
  return true;
}

/**
 * Blendet den Begleiter aus und nimmt ihn danach von der Karte (Dialogende). Ohne Begleiter:
 * nichts. Beispiel: Das Gespräch im Diner ist zu Ende → Ambrose verblasst in einer halben Sekunde.
 */
export function verabschiedeBegleiter(szene: Phaser.Scene): void {
  const alt = begleiter.get(szene);
  if (!alt) return;
  begleiter.delete(szene);
  szene.tweens.killTweensOf(alt.sprite);
  szene.tweens.add({
    targets: alt.sprite,
    alpha: 0,
    duration: BEGLEITER_BLENDE_MS,
    onComplete: () => alt.sprite.destroy(),
  });
  meldeFuerTests(szene, "weg");
}
