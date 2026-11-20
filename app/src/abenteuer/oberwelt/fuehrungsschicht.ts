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
 * Abhängigkeiten: phaser, gefuehrterweg.ts, figurbilder.ts.
 */
import Phaser from "phaser";
import { laufname, standbild } from "./figurbilder";
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
/** Liegen: um eine Vierteldrehung gekippt (Bogenmaß). */
const LIEGEN = Math.PI / 2;
/** Liegend über dem Bett gezeichnet: so viele Kacheln tiefer als die eigene Fußkachel. */
const LIEGETIEFE_KACHELN = 2;

/** Was die Schicht von der Szene braucht. */
export interface Fuehrungszugang {
  readonly szene: Phaser.Scene;
  readonly held: Phaser.Physics.Arcade.Sprite;
  readonly kachel: number;
  /** Begehbar für Figuren (Wände und Möbel, sperrkarte.ts). */
  readonly frei: (x: number, y: number) => boolean;
  readonly ausloeser: readonly { readonly name: string; readonly x: number; readonly y: number }[];
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
  return fuehreFigur(z, wer, auftrag.wer, weg, blick);
}

/** Der Held geht den Weg mit seiner Laufbewegung (szene.ts fragt die Führung in jedem Bild). */
function fuehreHeld(z: Fuehrungszugang, weg: readonly Feld[], blick: Blick | null): Promise<void> {
  // Wer im Bett lag (`#stelle … >liegt`), steht auf und bekommt seinen Körper zurück.
  z.held.setRotation(0);
  if (z.held.body instanceof Phaser.Physics.Arcade.Body) z.held.body.enable = true;
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
  name: string,
  weg: readonly Feld[],
  blick: Blick | null,
): Promise<void> {
  return new Promise((fertig) => {
    const schritte = weg.map((f) => ({
      x: (f.x + 0.5) * z.kachel,
      y: (f.y + 0.5) * z.kachel,
      duration: FIGUR_MS_JE_KACHEL,
      onStart: () => laufe(z, figur, name, f),
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
  name: string,
  nach: Feld,
): void {
  const richtung = blickZu(kachelVon(figur, z.kachel), nach);
  const animation = richtung ? laufname(`figur:${name}`, richtung) : "";
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

/**
 * Versetzt eine Figur sofort (`#stelle`), liegend um eine Vierteldrehung gekippt (im Bett). Ein
 * liegender Held hat keinen Körper, damit ihn das Bett nicht hinausschiebt; der nächste Weg stellt
 * ihn wieder auf.
 */
export function stelle(z: Fuehrungszugang, auftrag: Stellauftrag): void {
  const figur = figurNamens(z, auftrag.wer);
  if (!figur) return;
  figur.setPosition((auftrag.feld.x + 0.5) * z.kachel, (auftrag.feld.y + 0.5) * z.kachel);
  figur.setRotation(auftrag.liegt ? LIEGEN : 0);
  // Das Bett liegt mit seiner Unterkante tiefer; liegend wäre die Figur sonst darunter verborgen.
  figur.setDepth(figur.y + (auftrag.liegt ? LIEGETIEFE_KACHELN * z.kachel : 0));
  if (figur.body instanceof Phaser.Physics.Arcade.Body) figur.body.enable = !auftrag.liegt;
  if (figur.body instanceof Phaser.Physics.Arcade.StaticBody) figur.body.updateFromGameObject();
}

/**
 * Am Ende des Dialogs: Liegt der Held noch (`#stelle … >liegt`), steht er neben dem Bett auf, auf
 * einem freien Nachbarfeld, mit Körper. Sonst kehrte er liegend und ohne Kollision in die Welt
 * zurück.
 */
export function stehAuf(z: Fuehrungszugang): void {
  if (z.held.rotation === 0) return;
  const hier = kachelVon(z.held, z.kachel);
  const neben = endfelder(hier, true, z.frei)[0] ?? hier;
  z.held.setRotation(0);
  z.held.setPosition((neben.x + 0.5) * z.kachel, (neben.y + 0.5) * z.kachel);
  if (z.held.body instanceof Phaser.Physics.Arcade.Body) z.held.body.enable = true;
}
