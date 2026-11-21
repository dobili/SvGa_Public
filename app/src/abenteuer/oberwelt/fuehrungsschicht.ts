/**
 * Geführte Wege in der Szene (gefuehrterweg.ts): Der Held folgt dem Weg Kachel für Kachel mit
 * seiner gewöhnlichen Laufbewegung (Animation, Kamera, Kollision wie beim Spieler), andere Figuren
 * gehen mit einer Bewegung von Kachel zu Kachel und ihrer Laufanimation.
 *
 * Warum: Die Nachtszene beginnt im Bett, und der Held geht von selbst zu Ambrose ans Fenster; am
 * Spielanfang geht er mit Mama zur Haustür, statt ins Haus gebeamt zu werden (Wunsch des Autors,
 * 20.11.2026). Während des Wegs nimmt die Szene keine Eingaben an (Dialog offen, szene.ts).
 * Neuladen mitten im Weg: Die Szene meldet als Position des Helden schon das Ziel (szene.ts,
 * position), so steht er nach dem Laden dort.
 * Rolle im Gesamtbild: Werkzeug der Szene; useBuehne.ts reicht die Aufträge aus dem Dialog hierher.
 * Rennen (21.11.2026): `#gehe:wer>ziel>rennt` lässt andere Figuren schneller und mit der
 * Rennanimation laufen (figurbilder.ts, rennname); der Held geht auch dann in seinem Tempo.
 * Liegen (seit 21.11.2026): Hat der Bogen eine Liegereihe (PixelLab-Zustand, sitzrichtung.ts), zeigt
 * die Figur das Liegebild mit dem Kopf auf der Seite des Betts (Name KopfRechts/KopfWest im
 * Katalog); sonst kippt sie wie bisher das Standbild um eine Vierteldrehung.
 * Abhängigkeiten: phaser, gefuehrterweg.ts, figurbilder.ts, figurensitz.ts, sitzrichtung.ts.
 */
import Phaser from "phaser";
import { laufname, rennname, standbild, stelleAufKachel } from "./figurbilder";
import { rahmenzahl } from "./figurensitz";
import type { Moebel } from "./moebel";
import { kopfseiteDesBetts, liegebild, LIEGT, type Kopfseite } from "./sitzrichtung";
import {
  blickZu,
  endfelder,
  wegZu,
  type Blick,
  type Feld,
  type Stellauftrag,
  type Wegauftrag,
} from "./gefuehrterweg";

/** So nah (Pixel) an der Mitte einer Kachel gilt sie als erreicht. */
const NAH = 1.5;
/** Kommt der Held so lange nicht weiter (ms), rückt er auf die nächste Kachel (Ecke, Figur). */
const FESTGEFAHREN_MS = 1000;
/** Gehzeit einer Figur je Kachel (ms), etwa so schnell wie der Held. */
const FIGUR_MS_JE_KACHEL = 260;
/** Rennzeit je Kachel (ms), `#gehe:…>rennt`. */
const RENN_MS_JE_KACHEL = 130;
/** Liegen: um eine Vierteldrehung gekippt (Bogenmaß). */
const LIEGEN = Math.PI / 2;
/** Liegend über dem Bett gezeichnet: so viele Kacheln tiefer als die eigene Fußkachel. */
const LIEGETIEFE_KACHELN = 2;
/** Ein Bett ohne Angabe im Namen (Kopfende oben): Kopf rechts, die Ansicht West der Probe. */
const KOPF_VORGABE: Kopfseite = "rechts";
/** Ursprung des Liegebilds: die Mitte des Rahmens auf der Mitte der Kachel. */
const MITTE = 0.5;

/** Was die Schicht von der Szene braucht. */
export interface Fuehrungszugang {
  readonly szene: Phaser.Scene;
  readonly held: Phaser.Physics.Arcade.Sprite;
  readonly kachel: number;
  /** Begehbar für Figuren (Wände und Möbel, sperrkarte.ts). */
  readonly frei: (x: number, y: number) => boolean;
  readonly ausloeser: readonly { readonly name: string; readonly x: number; readonly y: number }[];
  /** Möbel der Karte (das Bett unter einer Liegenden gibt die Kopfseite vor). */
  readonly moebel: readonly Moebel[];
  readonly setzeFuehrung: (f: Heldfuehrung | null) => void;
  readonly blicke: (b: Blick) => void;
}

/** Der laufende Weg des Helden; die Szene fragt ihn in jedem Bild nach der Richtung. */
export class Heldfuehrung {
  private index = 0;
  private stillMs = 0;
  private letzte = { x: 0, y: 0 };

  constructor(
    private readonly weg: readonly Feld[],
    private readonly kachel: number,
    private readonly fertig: () => void,
  ) {}

  /** Das letzte Feld des Wegs (für die gesicherte Position beim Neuladen). */
  get ziel(): Feld | null {
    return this.weg.at(-1) ?? null;
  }

  /** Richtung zum nächsten Feld; am Ende null (und fertig wird gemeldet). */
  richtung(held: Phaser.GameObjects.Sprite, deltaMs: number): Blick | null {
    const naechstes = this.weg[this.index];
    if (!naechstes) return this.beende();
    const mitte = { x: (naechstes.x + 0.5) * this.kachel, y: (naechstes.y + 0.5) * this.kachel };
    const dx = mitte.x - held.x;
    const dy = mitte.y - held.y;
    const bewegt = held.x !== this.letzte.x || held.y !== this.letzte.y;
    this.letzte = { x: held.x, y: held.y };
    this.stillMs = bewegt ? 0 : this.stillMs + deltaMs;
    if ((Math.abs(dx) <= NAH && Math.abs(dy) <= NAH) || this.stillMs > FESTGEFAHREN_MS) {
      held.setPosition(mitte.x, mitte.y);
      this.index += 1;
      this.stillMs = 0;
      return this.richtung(held, 0);
    }
    if (Math.abs(dx) > NAH) return dx > 0 ? "rechts" : "links";
    return dy > 0 ? "unten" : "oben";
  }

  private beende(): null {
    this.fertig();
    return null;
  }
}

/** Kachel eines Sprites (Mitte der Fußkachel). */
function kachelVon(sprite: Phaser.GameObjects.Sprite, kachel: number): Feld {
  return { x: Math.floor(sprite.x / kachel), y: Math.floor(sprite.y / kachel) };
}

/** Eine Figur der Karte (Sprite mit Namen) oder, mit dem Namen „held“, der Held. */
function figurNamens(z: Fuehrungszugang, name: string): Phaser.Physics.Arcade.Sprite | null {
  const figur = name === "held" ? z.held : z.szene.children.getByName(name);
  return figur instanceof Phaser.Physics.Arcade.Sprite ? figur : null;
}

/** Wohin ein Weg führt: Endfelder und das Feld, auf das die Figur am Ende schaut. */
function ziele(
  z: Fuehrungszugang,
  auftrag: Wegauftrag,
  frei: (x: number, y: number) => boolean,
): { felder: Feld[]; blickAuf: Feld | null } {
  if ("feld" in auftrag.ziel)
    return { felder: endfelder(auftrag.ziel.feld, false, frei), blickAuf: null };
  const name = auftrag.ziel.name;
  const figur = figurNamens(z, name);
  if (figur) {
    const feld = kachelVon(figur, z.kachel);
    return { felder: endfelder(feld, true, frei), blickAuf: feld };
  }
  const felder = z.ausloeser.filter((a) => a.name === name).map((a) => ({ x: a.x, y: a.y }));
  return { felder: felder.flatMap((f) => endfelder(f, false, frei)), blickAuf: null };
}

/** Begehbar für diesen Weg: frei und nicht unter einer anderen Figur (oder dem Helden). */
function freiFuer(
  z: Fuehrungszugang,
  wer: Phaser.GameObjects.Sprite,
): (x: number, y: number) => boolean {
  const besetzt = new Set<string>();
  // Andere Figuren und, wenn eine Figur geht, auch der Held stehen im Weg.
  for (const kind of z.szene.children.list) {
    if (kind === wer || !(kind instanceof Phaser.Physics.Arcade.Sprite)) continue;
    if (kind !== z.held && (!kind.name || !kind.visible)) continue;
    const f = kachelVon(kind, z.kachel);
    besetzt.add(`${f.x},${f.y}`);
  }
  return (x, y) => z.frei(x, y) && !besetzt.has(`${x},${y}`);
}

/**
 * Führt einen Weg aus. Ausgabe: erfüllt, wenn die Figur angekommen ist (sofort, wenn es keinen Weg
 * gibt oder die Figur fehlt; dann bleibt sie stehen, der Dialog hängt nicht).
 */
export function fuehre(z: Fuehrungszugang, auftrag: Wegauftrag): Promise<void> {
  const wer = figurNamens(z, auftrag.wer);
  if (!wer) return Promise.resolve();
  const frei = freiFuer(z, wer);
  const { felder, blickAuf } = ziele(z, auftrag, frei);
  const start = kachelVon(wer, z.kachel);
  const weg = wegZu(start, felder, frei) ?? [];
  const ende = weg.at(-1) ?? start;
  const blick = blickAuf ? blickZu(ende, blickAuf) : null;
  if (wer === z.held) return fuehreHeld(z, weg, blick);
  return fuehreFigur(z, wer, { name: auftrag.wer, rennt: auftrag.rennt === true }, weg, blick);
}

/** Der Held geht den Weg mit seiner Laufbewegung (szene.ts fragt die Führung in jedem Bild). */
function fuehreHeld(z: Fuehrungszugang, weg: readonly Feld[], blick: Blick | null): Promise<void> {
  // Wer im Bett lag (`#stelle … >liegt`), steht auf und bekommt seinen Körper zurück.
  if (z.held.getData(LIEGT)) aufstehen(z);
  return new Promise((fertig) => {
    const fuehrung = new Heldfuehrung(weg, z.kachel, () => {
      z.setzeFuehrung(null);
      if (blick) z.blicke(blick);
      fertig();
    });
    z.setzeFuehrung(fuehrung);
  });
}

/** Eine Figur geht Kachel für Kachel, mit Laufanimation, falls ihr Bogen sie hat. */
function fuehreFigur(
  z: Fuehrungszugang,
  figur: Phaser.Physics.Arcade.Sprite,
  gang: { readonly name: string; readonly rennt: boolean },
  weg: readonly Feld[],
  blick: Blick | null,
): Promise<void> {
  const name = gang.name;
  // Wer saß (Juno auf der Tribüne), steht zum Gehen auf: Ursprung und Körper wieder auf den Füßen.
  if (weg.length > 0 && z.szene.textures.exists(`figur:${name}`)) stelleAufKachel(figur, z.kachel);
  return new Promise((fertig) => {
    const schritte = weg.map((f) => ({
      x: (f.x + MITTE) * z.kachel,
      y: (f.y + MITTE) * z.kachel,
      duration: gang.rennt ? RENN_MS_JE_KACHEL : FIGUR_MS_JE_KACHEL,
      onStart: () => laufe(z, figur, gang, f),
      onUpdate: () => figur.setDepth(figur.y),
    }));
    const ende = () => {
      steheStill(z, figur, name, blick);
      fertig();
    };
    if (schritte.length === 0) ende();
    else z.szene.tweens.chain({ targets: figur, tweens: schritte, onComplete: ende });
  });
}

/** Laufanimation in Richtung des nächsten Felds (ohne eigenen Bogen: nichts). */
function laufe(
  z: Fuehrungszugang,
  figur: Phaser.GameObjects.Sprite,
  gang: { readonly name: string; readonly rennt: boolean },
  nach: Feld,
): void {
  const richtung = blickZu(kachelVon(figur, z.kachel), nach);
  const bogen = `figur:${gang.name}`;
  const animation = richtung ? (gang.rennt ? rennname : laufname)(bogen, richtung) : "";
  if (animation && z.szene.anims.exists(animation)) figur.anims.play(animation, true);
}

/** Am Ziel: Standbild mit Blick, fester Körper an der neuen Stelle. */
function steheStill(
  z: Fuehrungszugang,
  figur: Phaser.Physics.Arcade.Sprite,
  name: string,
  blick: Blick | null,
): void {
  figur.anims.stop();
  if (blick && z.szene.textures.exists(`figur:${name}`)) figur.setFrame(standbild(blick));
  figur.setDepth(figur.y);
  if (figur.body instanceof Phaser.Physics.Arcade.StaticBody) figur.body.updateFromGameObject();
}

/** Kopfseite des Betts unter diesem Feld (Mitte der Kachel im Bild des Möbels), sonst die Vorgabe. */
function kopfseiteAuf(z: Fuehrungszugang, feld: Feld): Kopfseite {
  const mx = (feld.x + MITTE) * z.kachel;
  const my = (feld.y + MITTE) * z.kachel;
  const bett = z.moebel.find(
    (m) =>
      /Bett/.test(m.name) &&
      mx >= m.x &&
      my >= m.y &&
      mx < m.x + m.angabe.breite &&
      my < m.y + m.angabe.hoehe,
  );
  return (bett && kopfseiteDesBetts(bett.name, bett.form?.spiegeln)) ?? KOPF_VORGABE;
}

/** Liegend zeichnen: Liegebild aus dem Bogen, sonst das Standbild um eine Vierteldrehung gekippt. */
function legeHin(z: Fuehrungszugang, figur: Phaser.Physics.Arcade.Sprite, feld: Feld): void {
  const rahmen = liegebild(rahmenzahl(figur), kopfseiteAuf(z, feld));
  if (rahmen === null) figur.setRotation(LIEGEN);
  else figur.setFrame(rahmen).setOrigin(MITTE, MITTE);
  figur.setData(LIEGT, true);
  // Das Bett liegt mit seiner Unterkante tiefer; liegend wäre die Figur sonst darunter verborgen.
  figur.setDepth(figur.y + LIEGETIEFE_KACHELN * z.kachel);
}

/** Der Held steht auf: Standbild, Ursprung auf den Füßen, Körper wieder an. */
function aufstehen(z: Fuehrungszugang): void {
  z.held.setData(LIEGT, false).setRotation(0);
  stelleAufKachel(z.held, z.kachel);
  z.blicke("unten");
  if (z.held.body instanceof Phaser.Physics.Arcade.Body) z.held.body.enable = true;
}

/**
 * Versetzt eine Figur sofort (`#stelle`), liegend im Bett (legeHin: Liegebild oder gekippt). Ein
 * liegender Held hat keinen Körper, damit ihn das Bett nicht hinausschiebt; der nächste Weg stellt
 * ihn wieder auf.
 */
export function stelle(z: Fuehrungszugang, auftrag: Stellauftrag): void {
  const figur = figurNamens(z, auftrag.wer);
  if (!figur) return;
  figur.setPosition((auftrag.feld.x + MITTE) * z.kachel, (auftrag.feld.y + MITTE) * z.kachel);
  if (auftrag.liegt) legeHin(z, figur, auftrag.feld);
  else figur.setDepth(figur.y);
  if (figur.body instanceof Phaser.Physics.Arcade.Body) figur.body.enable = !auftrag.liegt;
  if (figur.body instanceof Phaser.Physics.Arcade.StaticBody) figur.body.updateFromGameObject();
}

/**
 * Am Ende des Dialogs: Liegt der Held noch (`#stelle … >liegt`), steht er neben dem Bett auf, auf
 * einem freien Nachbarfeld, mit Körper. Sonst kehrte er liegend und ohne Kollision in die Welt
 * zurück.
 */
export function stehAuf(z: Fuehrungszugang): void {
  if (!z.held.getData(LIEGT)) return;
  const hier = kachelVon(z.held, z.kachel);
  const neben = endfelder(hier, true, z.frei)[0] ?? hier;
  z.held.setPosition((neben.x + MITTE) * z.kachel, (neben.y + MITTE) * z.kachel);
  aufstehen(z);
}
