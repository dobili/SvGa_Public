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
import { legeHin, sitzlageMitZustand } from "./figurenaufstellung";
import { haltungAus, standbildrahmen } from "./figurzustand";
import { bogenname, geladenerStandbildindex } from "./standbildindex";
import { setzeSitzend } from "./figurensitz";
import { erzeugeSchwimmanimationen, schwimmname } from "./schwimmbilder";
import { sitzlageAuf, sitzsperre, type Sitzlage, type Sitzmoebel } from "./sitzplatz";
import { legeSitzausschnitt } from "./vordergrund";
import Phaser from "phaser";
import { passtZurStunde, statistenbild, type Belebung, type Feld } from "./belebung";
import {
  haeltAuf,
  neueBewegung,
  schritt,
  sperreAn,
  steht,
  tempoJetzt,
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
  gangfaktor,
  mitSchwimmbildern,
  scharGroesse,
  scharversatz,
  schwimmUrsprungY,
  schwimmversatz,
  standbasis,
  tierAnsicht,
  tierartVon,
  TIERBILDER,
  type Tierbild,
} from "./tiere";

/**
 * Messhilfe für die Tierfotos (tests/durchlauf/tierfoto.spec.ts): Setzt ein Test
 * `window.__belebungStill = true`, bleiben Statisten und Tiere auf ihrem Startfeld stehen, damit
 * scheue und fliegende Tiere auf dem Foto sind. Im Spiel nie gesetzt.
 */
function belebungStill(): boolean {
  return (globalThis as { __belebungStill?: unknown }).__belebungStill === true;
}

/** Bilder der Belebung im Paket: Pfad („figuren/statist-07.png“, „tiere/taube.png“) → Adresse. */
export type Belebungsbilder = Readonly<Record<string, string>>;

/** Ein gezeichneter Statist oder ein Tier. */
/** Ruhende Tiere blicken zur Seite: Ihr Vordergrund ist der Teil unter der Sitzfläche. */
const TIERBLICK = "links";

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
  /** Maße und Reihen des Tierbogens (tiere.ts); fehlt bei Statisten. */
  readonly tier?: Tierbild;
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

/** Ereignis des Spiels: die Namen der aufgestellten Statisten (nach der Stunde der Spieluhr). */
export const BELEBUNG_EREIGNIS = "belebung";

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
    const aufgestellt: string[] = [];
    for (const v of eintraege) {
      if (!passtZurStunde(v.wann, stunde)) continue;
      if (v.typ === "statist") this.stelleStatistAuf(v, platzhalter);
      else this.stelleTierAuf(v);
      if (v.typ === "statist") aufgestellt.push(v.name);
    }
    // Wer zur Stunde der Spieluhr da ist (für Prüfungen, useWeltladen.ts schreibt es an die Welt).
    szene.game.events.emit(BELEBUNG_EREIGNIS, aufgestellt);
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
    // Zustand an dieser Stelle (Editor 1.9): Stuhl oder Boden statt der Regel aus dem Sitzmöbel.
    const amBoden = haltungAus(v.haltung, v.sitzt, null).amBoden;
    const lage = sitzlageMitZustand(sitz, amBoden);
    const versatz = eigen && v.sitzt ? setzeSitzend(sprite, v.sitzt, lage) : null;
    if (eigen && v.haltung === "liegt") legeHin(sprite, true, this.kachel);
    const sperre = this.neueSperre(versatz?.dx, versatz?.dy);
    this.fuegeHinzu(v, sprite, eigen ? bogen : null, sperre, {
      ...(sitz ? { tiefe: sitz.tiefe } : {}),
      ...(versatz ? { versatz } : {}),
    });
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
    const tier = TIERBILDER[art];
    if (!tier) return;
    erzeugeLaufanimationen(this.szene, bogen);
    const eigenesWasser = mitSchwimmbildern(tier, v.verhalten);
    if (eigenesWasser) erzeugeSchwimmanimationen(this.szene, bogen);
    for (let i = 0; i < scharGroesse(v.name); i++) {
      const sprite = this.szene.add.sprite(
        0,
        0,
        bogen,
        standbasis(tier, v.verhalten) + standbild("unten"),
      );
      if (eigenesWasser) sprite.setOrigin(0.5, schwimmUrsprungY(tier));
      else {
        // Schwimmer ohne eigene Schwimmbilder liegen im Wasser: unten abgeschnitten (Regel 10.55).
        const ansicht = tierAnsicht(
          tier.hoehe,
          this.kachel,
          v.verhalten === "schwimmen",
          tier.fuss,
        );
        if (ansicht.sichtbar < sprite.height) sprite.setCrop(0, 0, sprite.width, ansicht.sichtbar);
        sprite.setOrigin(0.5, ansicht.ursprungY);
      }
      sprite.setScale(tier.massstab);
      // Große Tiere (Ziege, Kuh) brauchen in der Schar mehr als eine Kachel Abstand.
      const weite = Math.ceil(sprite.displayWidth / this.kachel);
      const d = v.verhalten === "schwimmen" ? schwimmversatz(v.von, v.bis, i, 1) : scharversatz(i);
      // Das erste Tier einer Schar hält den Helden auf (belebungsbewegung.ts, haeltAuf); die
      // übrigen stehen locker darum und bleiben durchlässig, damit eine Schar keinen Weg zustellt.
      const sperre = i === 0 && haeltAuf(v) ? this.neueSperre() : null;
      const ruht = i === 0 ? this.ruheplatz(v) : null;
      this.fuegeHinzu(verschoben(v, { x: d.x * weite, y: d.y * weite }), sprite, bogen, sperre, {
        tier,
        ...(ruht ? { tiefe: ruht.tiefe } : {}),
      });
    }
  }

  /**
   * Ein Tier, das auf einem Sitzmöbel sitzt oder schläft (Katze auf dem Sessel): liegt knapp über dem
   * Möbel, und dessen vorderer Teil liegt über ihm (vordergrund.ts, Auftrag des Haupt-Chats,
   * 23.11.2026). Ausgabe: die Lage auf dem Möbel, sonst null.
   */
  private ruheplatz(v: Belebung): Sitzlage | null {
    if (v.verhalten !== "sitzen" && v.verhalten !== "schlafen") return null;
    const lage = sitzlageAuf(this.sitze, v.feld, this.kachel);
    if (lage) legeSitzausschnitt(this.szene, lage, TIERBLICK);
    return lage;
  }

  private fuegeHinzu(
    v: Belebung,
    sprite: Phaser.GameObjects.Sprite,
    bogen: string | null,
    sperre: Phaser.GameObjects.Rectangle | null,
    extra: {
      readonly tiefe?: number;
      readonly versatz?: { readonly dx: number; readonly dy: number };
      readonly tier?: Tierbild;
    } = {},
  ): void {
    const { tiefe, versatz, tier } = extra;
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
      ...(tier ? { tier } : {}),
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
      if (!belebungStill()) schritt(d.b, d.v, dt, umgebung);
      this.zeige(d);
      this.schalteSperre(d, held);
    }
  }

  /** Lage, Tiefe und Bild eines Darstellers nach seinem Zustand. */
  private zeige(d: Darsteller): void {
    const k = this.kachel;
    d.sprite.setPosition(d.b.x * k + k / 2, d.b.y * k + k / 2);
    // Fliegende Tiere liegen auch im Sitzen über allem: Sie sitzen auf Turm, Dach oder Baum. Mit der
    // Tiefe ihrer Fußlinie verdeckten Wasserturm und Baum Eule und Eichelhäher ganz (Fotos 23.11.2026).
    const fliegt = d.v.verhalten === "fliegen";
    d.sprite.setDepth(fliegt ? FLUGTIEFE : (d.tiefe ?? d.sprite.y));
    if (!d.bogen) return;
    // Statisten mit Verhalten „rennen“ (Kinder zwischen den Fahnen) rennen auch im Bild; Tiere mit
    // eigenen Schwimmbildern schwimmen mit ihnen (tiere.ts).
    const schwimmt = d.tier !== undefined && mitSchwimmbildern(d.tier, d.v.verhalten);
    const gang = schwimmt ? schwimmname : d.v.verhalten === "rennen" ? rennname : laufname;
    if (!steht(d.b)) {
      d.sprite.anims.play(gang(d.bogen, d.b.richtung), true);
      // Gehbilder im Takt der Füße (tiere.ts, gangfaktor); Flieger und Schwimmer wie bisher.
      const amBoden = d.tier && !schwimmt && d.v.verhalten !== "fliegen";
      d.sprite.anims.timeScale = amBoden ? gangfaktor(d.tier, tempoJetzt(d.b, d.v), k) : 1;
    } else {
      if (d.sprite.anims.isPlaying) d.sprite.anims.stop();
      // Wer sitzt, behält sein Sitzbild (Stuhl oder Boden, figurensitz.ts), sonst das Standbild;
      // ein Tier zeigt das Bild seines Verhaltens (Katze schläft, Kuh grast, Ente schwimmt).
      if (!d.v.sitzt && d.v.haltung !== "liegt") d.sprite.setFrame(this.stillbild(d));
    }
  }

  /**
   * Bild im Stillstand: Tier nach Verhalten oder Zustand (Katze schläft, Kuh grast, Ente schwimmt),
   * Statist mit weiterem Standbild aus PixelLab (Editor 1.9, figurzustand.ts), sonst Standbild.
   */
  private stillbild(d: Darsteller): number {
    const richtung = d.b.schaut ?? d.b.richtung;
    if (d.tier) return standbasis(d.tier, d.v.verhalten) + standbild(richtung);
    const index = d.bogen ? geladenerStandbildindex()[bogenname(d.bogen)] : undefined;
    return standbildrahmen(index, d.v.standbild, richtung) ?? standbild(richtung);
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
