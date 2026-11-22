/**
 * Die Belebung in der Phaser-Szene: Statisten und Tiere zeichnen, bewegen und (nur Statisten, nur
 * im Stehen) sperren.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/szene.ts, ausgelagert, damit die Szene klein bleibt. Die
 * Logik steht in belebung.ts, tiere.ts und belebungsbewegung.ts. Leistung (Auftrag Runde 7: 30
 * Statisten und 15 Tiere flüssig auf dem Handy): Tiere haben keinen Physikkörper, Statisten nur
 * ein unsichtbares Rechteck, das an- und ausgeschaltet wird; bewegt wird nur, was in der Nähe des
 * Bildausschnitts steht.
 * Abhängigkeiten: Phaser, figurbilder.ts, figurensitz.ts, sitzplatz.ts.
 */
import { setzeSitzend } from "./figurensitz";
import { BODENSITZ, sitzlageAuf, sitzsperre, type Sitzmoebel } from "./sitzplatz";
import Phaser from "phaser";
import { passtZurStunde, statistenbild, type Belebung, type Feld } from "./belebung";
import {
  haeltAuf,
  neueBewegung,
  schritt,
  sperreAn,
  steht,
  type Bewegung,
  type Sperrflaeche,
  type Umgebung,
} from "./belebungsbewegung";
import {
  erzeugeLaufanimationen,
  rennname,
  fussUrsprungY,
  ladeFigurbogen,
  laufname,
  standbild,
} from "./figurbilder";
import {
  scharGroesse,
  scharversatz,
  schwimmversatz,
  tierAnsicht,
  tierartVon,
  TIERBILDER,
} from "./tiere";

/** Bilder der Belebung im Paket: Pfad („figuren/statist-07.png“, „tiere/taube.png“) → Adresse. */
export type Belebungsbilder = Readonly<Record<string, string>>;

/** Ein gezeichneter Statist oder ein Tier. */
interface Darsteller {
  /** Eintrag der Karte; in einer Schar mit verschobenem Laufweg. */
  readonly v: Belebung;
  readonly b: Bewegung;
  readonly sprite: Phaser.GameObjects.Sprite;
  /** Schlüssel des Bogens im Spielformat; null beim Platzhalter (ein Bild, keine Laufbilder). */
  readonly bogen: string | null;
  /** Unsichtbare Sperrfläche eines Statisten (nur im Stehen an). */
  readonly sperre: Phaser.GameObjects.Rectangle | null;
  /** Ihre Fläche in Kacheln um die Mitte der Fußkachel, wenn sie größer ist (Sitzende). */
  readonly flaeche?: Sperrflaeche;
  /** Feste Zeichentiefe einer Sitzenden auf ihrem Möbel (sitzplatz.ts); sonst die Fußlinie. */
  readonly tiefe?: number;
}

/** Im Sichtbereich plus so viele Kacheln ringsum wird bewegt. */
const RAND = 3;
/** Fliegende Vögel liegen über allem auf dem Boden. */
const FLUGTIEFE = 100000;
/** Ein Schritt höchstens so lang (Sekunden), damit ein Ruckler niemanden durch Wände trägt. */
const LAENGSTER_SCHRITT = 0.1;
const MS_JE_S = 1000;

function statistenbogen(pfad: string): string {
  return `statist:${pfad}`;
}
function tierbogen(art: string): string {
  return `tier:${art}`;
}
function tierpfad(art: string): string {
  return `tiere/${art}.png`;
}

/** Verschiebt den Laufweg eines Eintrags (für die Tiere einer Schar). */
function verschoben(v: Belebung, d: Feld): Belebung {
  const plus = (f: Feld) => ({ x: f.x + d.x, y: f.y + d.y });
  return { ...v, feld: plus(v.feld), von: plus(v.von), bis: plus(v.bis) };
}

/** Lädt die Bögen der Belebung (in preload der Szene). */
export function ladeBelebungsbilder(
  szene: Phaser.Scene,
  eintraege: readonly Belebung[],
  bilder: Belebungsbilder,
): void {
  for (const v of eintraege) {
    if (v.typ === "statist") {
      const pfad = statistenbild(v);
      const adresse = bilder[pfad];
      if (adresse && !szene.textures.exists(statistenbogen(pfad))) {
        ladeFigurbogen(szene, statistenbogen(pfad), adresse);
      }
      continue;
    }
    const art = tierartVon(v.name, v.bild);
    const adresse = art ? bilder[tierpfad(art)] : undefined;
    const masse = art ? TIERBILDER[art] : undefined;
    if (!art || !adresse || !masse || szene.textures.exists(tierbogen(art))) continue;
    szene.load.spritesheet(tierbogen(art), adresse, {
      frameWidth: masse.breite,
      frameHeight: masse.hoehe,
    });
  }
}

export class Belebungsschicht {
  private readonly darsteller: Darsteller[] = [];

  /**
   * Stellt alle Statisten (zur Stunde passend) und Tiere auf. `platzhalter` ist der Schlüssel des
   * Bildes für Statisten ohne eigenen Bogen; Tiere ohne Bogen werden nicht gezeichnet. `sitze`
   * (sitzplatz.ts, sitzmoebelAus) sind die Sitzmöbel der Karte: Sitzende rücken auf ihr Möbel.
   */
  constructor(
    private readonly szene: Phaser.Scene,
    eintraege: readonly Belebung[],
    private readonly kachel: number,
    stunde: number,
    platzhalter: string,
    private readonly sitze: readonly Sitzmoebel[] = [],
  ) {
    for (const v of eintraege) {
      if (!passtZurStunde(v.wann, stunde)) continue;
      if (v.typ === "statist") this.stelleStatistAuf(v, platzhalter);
      else this.stelleTierAuf(v);
    }
  }

  private stelleStatistAuf(v: Belebung, platzhalter: string): void {
    const bogen = statistenbogen(statistenbild(v));
    const eigen = this.szene.textures.exists(bogen);
    const sprite = this.szene.add.sprite(0, 0, eigen ? bogen : platzhalter, 0);
    if (eigen) {
      erzeugeLaufanimationen(this.szene, bogen);
      sprite.setOrigin(0.5, fussUrsprungY(sprite, this.kachel));
    }
    const sitz = v.sitzt ? sitzlageAuf(this.sitze, v.feld, this.kachel) : null;
    const versatz = eigen && v.sitzt ? setzeSitzend(sprite, v.sitzt, sitz ?? BODENSITZ) : null;
    const sperre = this.neueSperre(versatz?.dx, versatz?.dy);
    this.fuegeHinzu(v, sprite, eigen ? bogen : null, sperre, sitz?.tiefe, versatz ?? undefined);
  }

  /**
   * Unsichtbare Fläche von einer Kachel, an der der Held anstößt (Statist oder Tier). Eine
   * Sitzende, deren Bild um dx, dy aufs Sitzmöbel gerückt ist, sperrt auch ihren Sitzpunkt
   * (sitzplatz.ts, sitzsperre); der Punkt der Fläche bleibt die Mitte der Fußkachel.
   */
  private neueSperre(dx = 0, dy = 0): Phaser.GameObjects.Rectangle {
    const f = sitzsperre(dx, dy, this.kachel);
    const sperre = this.szene.add.rectangle(0, 0, f.breite, f.hoehe).setVisible(false);
    sperre.setOrigin(-f.x / f.breite, -f.y / f.hoehe);
    this.szene.physics.add.existing(sperre, true);
    return sperre;
  }

  private stelleTierAuf(v: Belebung): void {
    const art = tierartVon(v.name, v.bild);
    if (!art || !this.szene.textures.exists(tierbogen(art))) return;
    const bogen = tierbogen(art);
    erzeugeLaufanimationen(this.szene, bogen);
    for (let i = 0; i < scharGroesse(v.name); i++) {
      const sprite = this.szene.add.sprite(0, 0, bogen, standbild("unten"));
      // Schwimmer liegen im Wasser: unten abgeschnitten, um den Rest tiefer (Regel 10.55).
      const ansicht = tierAnsicht(sprite.height, this.kachel, v.verhalten === "schwimmen");
      if (ansicht.sichtbar < sprite.height) sprite.setCrop(0, 0, sprite.width, ansicht.sichtbar);
      sprite.setOrigin(0.5, ansicht.ursprungY);
      sprite.setScale(TIERBILDER[art]?.massstab ?? 1);
      // Große Tiere (Ziege, Kuh) brauchen in der Schar mehr als eine Kachel Abstand.
      const weite = Math.ceil(sprite.displayWidth / this.kachel);
      const d = v.verhalten === "schwimmen" ? schwimmversatz(v.von, v.bis, i, 1) : scharversatz(i);
      // Das erste Tier einer Schar hält den Helden auf (belebungsbewegung.ts, haeltAuf); die
      // übrigen stehen locker darum und bleiben durchlässig, damit eine Schar keinen Weg zustellt.
      const sperre = i === 0 && haeltAuf(v) ? this.neueSperre() : null;
      this.fuegeHinzu(verschoben(v, { x: d.x * weite, y: d.y * weite }), sprite, bogen, sperre);
    }
  }

  private fuegeHinzu(
    v: Belebung,
    sprite: Phaser.GameObjects.Sprite,
    bogen: string | null,
    sperre: Phaser.GameObjects.Rectangle | null,
    tiefe?: number,
    versatz?: { readonly dx: number; readonly dy: number },
  ): void {
    const b = neueBewegung(v.feld, v.blick);
    const k = this.kachel;
    // Fläche der Sitzenden in Kacheln (sitzsperre rechnet in Pixeln), für das Schalten der Sperre.
    const f = versatz ? sitzsperre(versatz.dx, versatz.dy, k) : null;
    const d: Darsteller = {
      v,
      b,
      sprite,
      bogen,
      sperre,
      ...(tiefe === undefined ? {} : { tiefe }),
      ...(f
        ? { flaeche: { x: f.x / k, y: f.y / k, breite: f.breite / k, hoehe: f.hoehe / k } }
        : {}),
    };
    this.darsteller.push(d);
    this.zeige(d);
  }

  /** Die Sperrflächen der Statisten, für den Zusammenstoß mit dem Helden. */
  sperren(): Phaser.GameObjects.Rectangle[] {
    return this.darsteller.flatMap((d) => (d.sperre ? [d.sperre] : []));
  }

  /** Ansprechbare Statisten (mit `sagt`) und ihre Kachel gerade jetzt. */
  ansprechbare(): { readonly name: string; readonly x: number; readonly y: number }[] {
    return this.darsteller
      .filter((d) => d.v.typ === "statist" && d.v.sagt)
      .map((d) => ({ name: d.v.name, x: Math.round(d.b.x), y: Math.round(d.b.y) }));
  }

  /** Ein Bild weiter: bewegt, was nah am Bildausschnitt ist, und schaltet die Sperren. */
  aktualisiere(
    deltaMs: number,
    held: Feld,
    frei: Umgebung["frei"],
    blick?: Pick<Umgebung, "heldBlick" | "heldGeht">,
  ): void {
    const dt = Math.min(deltaMs / MS_JE_S, LAENGSTER_SCHRITT);
    const sicht = this.szene.cameras.main.worldView;
    const k = this.kachel;
    const umgebung: Umgebung = { held, frei, zufall: Math.random, ...blick };
    for (const d of this.darsteller) {
      const px = d.b.x * k;
      const py = d.b.y * k;
      const nah =
        px > sicht.x - RAND * k &&
        px < sicht.right + RAND * k &&
        py > sicht.y - RAND * k &&
        py < sicht.bottom + RAND * k;
      d.sprite.setVisible(nah);
      if (!nah) continue;
      schritt(d.b, d.v, dt, umgebung);
      this.zeige(d);
      this.schalteSperre(d, held);
    }
  }

  /** Lage, Tiefe und Bild eines Darstellers nach seinem Zustand. */
  private zeige(d: Darsteller): void {
    const k = this.kachel;
    d.sprite.setPosition(d.b.x * k + k / 2, d.b.y * k + k / 2);
    const fliegt = d.v.verhalten === "fliegen" && !steht(d.b);
    d.sprite.setDepth(fliegt ? FLUGTIEFE : (d.tiefe ?? d.sprite.y));
    if (!d.bogen) return;
    // Statisten mit Verhalten „rennen“ (Kinder zwischen den Fahnen) rennen auch im Bild.
    const gang = d.v.verhalten === "rennen" ? rennname : laufname;
    if (!steht(d.b)) d.sprite.anims.play(gang(d.bogen, d.b.richtung), true);
    else {
      if (d.sprite.anims.isPlaying) d.sprite.anims.stop();
      // Wer sitzt, behält sein Sitzbild (Stuhl oder Boden, figurensitz.ts), sonst das Standbild.
      if (!d.v.sitzt) d.sprite.setFrame(standbild(d.b.schaut ?? d.b.richtung));
    }
  }

  /**
   * Statisten und Tiere am Boden sperren ihre Kachel, auch im Gehen (Wunsch des Autors,
   * 10.11.2026), aber nie, solange der Held in ihrer Fläche steckt (er läuft nie fest); bloßes
   * Anstoßen schaltet sie nicht aus (belebungsbewegung.ts, sperreAn).
   */
  private schalteSperre(d: Darsteller, held: Feld): void {
    const sperre = d.sperre;
    const koerper = sperre?.body;
    if (!sperre || !(koerper instanceof Phaser.Physics.Arcade.StaticBody)) return;
    const x = Math.round(d.b.x);
    const y = Math.round(d.b.y);
    const an = sperreAn(held, x, y, d.flaeche);
    const mx = x * this.kachel + this.kachel / 2;
    const my = y * this.kachel + this.kachel / 2;
    if (an && (sperre.x !== mx || sperre.y !== my || !koerper.enable)) {
      sperre.setPosition(mx, my);
      koerper.updateFromGameObject();
    }
    koerper.enable = an;
  }
}
