/**
 * Begleiter, die dem Helden auf der Karte folgen (Regeln in regeln/gefolge.ts; Wunsch des Autors,
 * 25.11.2026): Juno geht mit nach Cedar Creek, ein Feld hinter dem Helden, auf seinem Weg.
 *
 * Beim Aufbau der Karte erscheint jeder Begleiter auf einem freien Feld neben dem Helden (wie
 * Ambrose, regeln/begleiter.ts); danach läuft er der Spur des Helden nach. Er hat keinen Körper für
 * die Kollision und sperrt deshalb keinen Weg; im Gespräch steht der Held, also steht er neben ihm.
 * Beim Kartenwechsel baut die neue Karte ihn wieder neben dem Helden auf.
 * Schräg (Joystick, 26.11.2026): Die Spur nimmt Stufen heraus, wo die Schräge frei ist, und legt
 * an Wandecken das freie Eckfeld dazwischen (regeln/gefolge.ts). Der Begleiter zeigt dann seine
 * Schrägbilder (Juno und Mama haben welche, figurbilder.ts); ohne sie die nächste Hauptrichtung.
 * Für die Oberflächentests steht die Lage am Attribut `data-gefolge` der Spielfläche
 * („juno@6,5“, mehrere mit Semikolon); im Spiel ohne Wirkung.
 * Abhängigkeiten: Phaser, figurbilder.ts, regeln/begleiter.ts, regeln/gefolge.ts.
 */
import Phaser from "phaser";
import { begleiterfeld, type Blick, type Kachelfeld } from "../regeln/begleiter";
import { FOLGEABSTAND, Spur } from "../regeln/gefolge";
import { blickZu, istSchraege, type Achtrichtung } from "./achtrichtung";
import { sektorZu, winkelVon } from "./joystick";
import { erzeugeLaufanimationen, fussUrsprungY, laufname, standbild } from "./figurbilder";
import { PLATZHALTER_BILD } from "./zuwendung";

/** Grundtempo in Kartenpixeln je Sekunde (wie der Held zu Fuß, szene.ts TEMPO). */
const GRUNDTEMPO = 56;
/** Ist der Begleiter weiter weg als so viele Felder (Fahrrad, Versetzen), springt er hinterher. */
const SPRUNG_FELDER = 4;
const MS_JE_SEKUNDE = 1000;
/** Abstand unter einem Pixel gilt als angekommen. */
const ANGEKOMMEN_PX = 0.5;
/** Texturschlüssel des Platzhalterbogens (szene.ts lädt ihn als „figur“), Ursprung in der Mitte. */
const PLATZHALTER = "figur";
const MITTE = 0.5;

interface Glied {
  readonly name: string;
  readonly sprite: Phaser.GameObjects.Sprite;
  /** Eigener Bogen (gekaufte Grafik); ohne ihn die Platzhalterfigur ohne Laufbilder. */
  readonly eigen: boolean;
  blick: Blick;
  /** Laufrichtung in acht Werten (Hysterese an den Sektorgrenzen, joystick.ts); null: steht. */
  richtung: Achtrichtung | null;
}

/** Was die Schicht von der Szene braucht (Teil von fuehrungsschicht.ts, Fuehrungszugang). */
interface Gefolgezugang {
  readonly szene: Phaser.Scene;
  readonly held: Phaser.GameObjects.Sprite;
  readonly kachel: number;
  /** Begehbar für Figuren (Sperrkarte der Szene). */
  readonly frei: (x: number, y: number) => boolean;
}

function feldVon(punkt: { readonly x: number; readonly y: number }, kachel: number): Kachelfeld {
  return { x: Math.floor(punkt.x / kachel), y: Math.floor(punkt.y / kachel) };
}

/** Ein Begleiter auf ein Feld neben dem Helden (oder auf das Feld des Helden, wenn keins frei ist). */
function stelleNeben(
  z: Gefolgezugang,
  blick: Blick,
  name: string,
  besetzt: Set<string>,
): Glied | null {
  const schluessel = `figur:${name}`;
  // Ohne eigenen Bogen (Paket ohne gekaufte Grafik): die Platzhalterfigur, wie bei Ambrose.
  const eigen = z.szene.textures.exists(schluessel);
  const held = feldVon(z.held, z.kachel);
  const feld =
    begleiterfeld(held, blick, (x, y) => z.frei(x, y) && !besetzt.has(`${x},${y}`)) ?? held;
  besetzt.add(`${feld.x},${feld.y}`);
  const sprite = z.szene.add.sprite(
    (feld.x + 0.5) * z.kachel,
    (feld.y + 0.5) * z.kachel,
    eigen ? schluessel : PLATZHALTER,
    eigen ? standbild(blick) : PLATZHALTER_BILD[blick],
  );
  sprite.setName(`gefolge:${name}`);
  sprite.setOrigin(MITTE, eigen ? fussUrsprungY(sprite, z.kachel) : MITTE);
  if (eigen) erzeugeLaufanimationen(z.szene, schluessel);
  return { name, sprite, eigen, blick, richtung: null };
}

/** Bewegt ein Glied in diesem Bild auf sein Ziel zu; Ausgabe: ob es geht. */
function gehe(g: Glied, ziel: Kachelfeld, kachel: number, delta: number): boolean {
  const zx = (ziel.x + 0.5) * kachel;
  const zy = (ziel.y + 0.5) * kachel;
  const dx = zx - g.sprite.x;
  const dy = zy - g.sprite.y;
  const weite = Math.hypot(dx, dy);
  if (weite < ANGEKOMMEN_PX) return false;
  if (weite > SPRUNG_FELDER * kachel) {
    g.sprite.setPosition(zx, zy);
    return false;
  }
  // Je weiter hinten, desto schneller: So holt er den Helden auch auf dem Fahrrad wieder ein.
  const tempo = GRUNDTEMPO * (1 + weite / kachel);
  const schritt = Math.min(weite, (tempo * delta) / MS_JE_SEKUNDE);
  g.sprite.setPosition(g.sprite.x + (dx / weite) * schritt, g.sprite.y + (dy / weite) * schritt);
  g.richtung = sektorZu(winkelVon(dx, dy), g.richtung);
  g.blick = blickZu(g.richtung, g.blick);
  return true;
}

/** Richtung der Laufbilder: die Schräge, wenn es ihre Animation gibt, sonst der Blick. */
function bildrichtung(g: Glied): Achtrichtung {
  const r = g.richtung;
  if (r && istSchraege(r) && g.sprite.scene.anims.exists(laufname(`figur:${g.name}`, r))) return r;
  return g.blick;
}

/** Bild eines Glieds: Laufanimation in Bewegung, sonst Standbild seines Blicks. */
function zeige(g: Glied, geht: boolean): void {
  const schluessel = `figur:${g.name}`;
  if (!g.eigen) g.sprite.setFrame(PLATZHALTER_BILD[g.blick]);
  else if (geht) g.sprite.anims.play(laufname(schluessel, bildrichtung(g)), true);
  else {
    g.richtung = null;
    g.sprite.anims.stop();
    g.sprite.setFrame(standbild(g.blick));
  }
  g.sprite.setDepth(g.sprite.y);
}

/**
 * Stellt die Begleiter neben den Helden und lässt sie ihm in jedem Bild der Szene folgen.
 * Eingaben: Zugang der Szene (null vor create: nichts), Blick des Helden, Kurznamen der Begleiter
 * (ihr Bogen ist als „figur:<name>“ geladen).
 * Sonderfälle: Ohne Begleiter oder ohne geladenen Bogen geschieht nichts; der erste Begleiter geht
 * FOLGEABSTAND Felder hinter dem Helden, jeder weitere ein Feld mehr.
 * Beispiel: begleiter „juno“ auf der Landstraße → Juno erscheint neben dem Helden und folgt ihm.
 */
export function richteGefolgeEin(
  z: Gefolgezugang | null,
  blick: () => Blick,
  namen: readonly string[],
): void {
  if (!z) return;
  const besetzt = new Set<string>();
  const glieder = namen.flatMap((n) => stelleNeben(z, blick(), n, besetzt) ?? []);
  if (!glieder.length) return;
  const spur = new Spur(
    feldVon(z.held, z.kachel),
    glieder.map((g) => feldVon(g.sprite, z.kachel)),
  );
  const laenge = FOLGEABSTAND + glieder.length;
  z.szene.events.on(Phaser.Scenes.Events.UPDATE, (_zeit: number, delta: number) => {
    spur.merke(feldVon(z.held, z.kachel), laenge, z.frei); // schräg, wo frei (regeln/gefolge.ts)
    glieder.forEach((g, i) => zeige(g, gehe(g, spur.ziel(FOLGEABSTAND + i), z.kachel, delta)));
    const lage = glieder.map((g) => {
      const f = feldVon(g.sprite, z.kachel);
      return `${g.name}@${f.x},${f.y}`;
    });
    z.szene.game.canvas?.setAttribute("data-gefolge", lage.join(";"));
  });
}
