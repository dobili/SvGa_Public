/**
 * Die Phaser-Szene der Oberwelt: eine Tiled-Karte, der Held, Kollision, Auslöser.
 *
 * Rolle im Gesamtbild: Phaser zeichnet nur Karte und Figuren (Entscheidung C4); alles andere ist
 * React (oberwelt/Oberwelt.tsx). Die Schnittstelle nach oben ist der `Melder` (Held steht auf
 * einem Auslöser, Held hat ihn verlassen, Position beim Verlassen); nach unten `setzeRichtung`
 * (Steuerkreuz) und `laufenErlaubt` (Dialog offen → stehen bleiben).
 * Kacheln sind 16 px (inhalte/abenteuer/README.md), gezeichnet mit Faktor ZOOM (Architektur,
 * Abschnitt 10: DS-Look statt Game Boy); die Kamera vergrößert, PixelLab-Figuren stehen mit 2/3
 * in der Welt (Variante B, weltmassstab.ts). Kollision kommt aus der Kacheleigenschaft `kollision`
 * des Kachelsatzes; Auslöser aus der Objektebene `ausloeser` (Name = Bedeutung in orte.json).
 * Abhängigkeiten: phaser (MIT, docs/spiel/LIZENZEN.md), schnittstelle/spielstand.ts (Weltposition).
 */
import Phaser from "phaser";
import {
  liesAusloeser,
  MELDE_START,
  meldeschritt,
  mitDurchgang,
  type Ausloeser,
  type Meldezustand,
} from "./ausloeserebene";
import { OHNE_RAENDER, type Raender } from "./kamera";
import { Kamerafuehrung } from "./kamerafuehrung";
import { ZOOM } from "./weltmassstab";
import { kachelVon, tippschrittBeimLoslassen, zielErreicht, type Tippschritt } from "./tippschritt";
import { Zielmarker, type Zielfeld } from "./zielmarker";
import type { Weltposition } from "../schnittstelle/spielstand";
import {
  erzeugeLaufanimationen,
  ladeFigurbogen,
  fussUrsprungY,
  laufname,
  standbild,
  stelleAufKachel,
} from "./figurbilder";
import { ladeMoebelbilder, rahmenJeTextur, richteMoebelrahmenEin, stelleMoebelAuf } from "./moebel";
import { querziel } from "./laufhilfe";
import { stelleFigurenAuf } from "./figurenaufstellung";
import { sitzmoebelAus } from "./sitzplatz";
import { sichtbarMesser } from "./sitzumriss";
import { erscheinungsfeld, lasseGeistErscheinen } from "./geistfigur";
import { EINGABEPAUSE_MS, gegenrichtung, pausenschritt, pfeiltasten } from "./eingabepause";
import { baueSperrkarte } from "./sperrkarte";
import type { Toenung } from "./toenung";
import { zeigeTeilchen } from "./teilchen";
import { Toenungsschicht } from "./toenungsschicht";
import { faerbeWinterlich } from "./winter";
import { liesBelebung, type Belebung, type Feld } from "./belebung";
import { Belebungsschicht, ladeBelebungsbilder } from "./belebungsschicht";
import type { Szenendaten } from "./szenentypen";
export type { Ausloesertreffer, Melder, Szenendaten } from "./szenentypen";

export type Richtung = Weltposition["richtung"];

/** Kachelgröße der Karten in Pixeln. */
export const KACHEL = 16;
/** Laufgeschwindigkeit des Helden in Kachelpixeln je Sekunde. */
const TEMPO = 56;
/** Bild je Blickrichtung im Spritesheet des Helden (grafik/held.png: unten, links, rechts, oben). */
const BILD_JE_RICHTUNG: Readonly<Record<Richtung, number>> = {
  unten: 0,
  links: 1,
  rechts: 2,
  oben: 3,
};
const EBENEN = ["boden", "waende", "objekte"] as const;
const AUSLOESER_EBENE = "ausloeser";

/** Tiefe des Hintergrundbilds: unter Möbeln an der Wand (Tiefe 0) und allem anderen. */
const HINTERGRUND_TIEFE = -1;
/** Höchstens so viele Kachelpixel je Bild rückt die Laufhilfe den Helden zur Kachelmitte. */
const MITTENSCHRITT = 1;
/** Schlüssel des Heldenbogens im Format von LimeZu. */
const HELDFIGUR = "heldfigur";

export class Oberweltszene extends Phaser.Scene {
  /** Der Held; null, bis create() gelaufen ist (die Hülle kann vorher schon fragen). */
  private held: Phaser.Physics.Arcade.Sprite | null = null;
  private readonly gedrueckt = new Set<Richtung>();
  private laufen = true;
  private blick: Richtung;
  private ausloeser: Ausloeser[] = [];
  /** Letzter Treffer und ob der Held noch auf seinem Startauslöser steht (ausloeserebene.ts). */
  private meldezustand: Meldezustand = MELDE_START;
  private geht = false; // in diesem Bild ist eine Richtung gedrückt (Durchgang, R060)
  /** Rest der Eingabepause nach dem Kartenwechsel in Millisekunden (eingabepause.ts). */
  private pause = EINGABEPAUSE_MS;
  /** Zuletzt gemeldete Kachel des Helden („x,y“), damit beiKachel nur bei Änderung feuert. */
  private letzteKachel: string | null = null;
  private tasten!: Phaser.Types.Input.Keyboard.CursorKeys | null;
  /** Statisten und Tiere der Karte (aus der Objektebene) und ihre Schicht nach create(). */
  private belebung: Belebung[] = [];
  private belebungsschicht: Belebungsschicht | null = null;
  private toenungsschicht: Toenungsschicht | null = null;
  /** Ist eine Kachel für Tiere begehbar (sperrkarte.ts)? Vor create() ist nichts frei. */
  private frei: (x: number, y: number) => boolean = () => false;
  /** Dasselbe für Zellen von 4 Pixeln (Laufhilfe an feinen Sperren, laufhilfe.ts). */
  private zellfrei: (x: number, y: number) => boolean = () => true;
  /** Kurzes Antippen (tippschritt.ts): Kachel beim Druck und der laufende Schritt danach. */
  private druck: { richtung: Richtung; kachel: string } | null = null;
  private tipp: Tippschritt | null = null;
  /** Zielhinweis (zielmarker.ts) und das Ziel, das schon vor create() kommen kann. */
  private zielmarker: Zielmarker | null = null;
  private ziel: { feld: Zielfeld | null; an: boolean } = { feld: null, an: true };
  /** Ränder unter festen Bedienelementen in Spielpixeln (kamera.ts, kameraregie.ts). */
  private verdeckt: Raender = OHNE_RAENDER;
  private kamerafuehrung: Kamerafuehrung | null = null; // vorausschauend (kameravoraus.ts)

  constructor(private readonly daten: Szenendaten) {
    super("oberwelt");
    this.blick = daten.start.richtung;
  }

  preload(): void {
    this.load.image("kacheln", this.daten.kachelbild);
    this.load.spritesheet("held", this.daten.heldbild, { frameWidth: KACHEL, frameHeight: KACHEL });
    this.load.spritesheet("figur", this.daten.figurbild, {
      frameWidth: KACHEL,
      frameHeight: KACHEL,
    });
    if (this.daten.heldfigur) ladeFigurbogen(this, HELDFIGUR, this.daten.heldfigur);
    for (const [name, adresse] of Object.entries(this.daten.figurenbilder ?? {})) {
      ladeFigurbogen(this, `figur:${name}`, adresse);
    }
    ladeMoebelbilder(this, this.daten.moebel ?? []);
    this.belebung = liesBelebung(this.daten.karte);
    ladeBelebungsbilder(this, this.belebung, this.daten.belebungsbilder ?? {});
    if (this.daten.hintergrund) this.load.image("hintergrund", this.daten.hintergrund);
  }

  create(): void {
    this.cache.tilemap.add("karte", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: this.daten.karte,
    });
    const karte = this.make.tilemap({ key: "karte" });
    const kacheln = karte.addTilesetImage(this.daten.kachelsatz, "kacheln");
    if (!kacheln) throw new Error(`Kachelsatz ${this.daten.kachelsatz} fehlt in der Karte`);
    const feste: Phaser.Tilemaps.TilemapLayer[] = [];
    for (const name of EBENEN) {
      const ebene = karte.createLayer(name, kacheln);
      // Phaser 4 kann Ebenen auch auf der Grafikkarte zeichnen (TilemapGPULayer); die Kollision
      // braucht die gewöhnliche Ebene, die createLayer ohne weitere Angabe liefert.
      if (!(ebene instanceof Phaser.Tilemaps.TilemapLayer)) continue;
      ebene.setCollisionByProperty({ kollision: true });
      if (this.daten.hintergrund) ebene.setVisible(false);
      feste.push(ebene);
    }
    if (this.daten.hintergrund) {
      this.add.image(0, 0, "hintergrund").setOrigin(0, 0).setDepth(HINTERGRUND_TIEFE);
    }
    const { x, y } = this.daten.start;
    const echt = Boolean(this.daten.heldfigur);
    const held = this.physics.add.sprite(
      x * KACHEL + KACHEL / 2,
      y * KACHEL + KACHEL / 2,
      echt ? HELDFIGUR : "held",
      echt ? standbild(this.blick) : BILD_JE_RICHTUNG[this.blick],
    );
    this.held = held;
    held.setCollideWorldBounds(true);
    if (echt) {
      erzeugeLaufanimationen(this, HELDFIGUR);
      stelleAufKachel(held, KACHEL);
    } else {
      (held.body as Phaser.Physics.Arcade.Body).setSize(KACHEL - 4, KACHEL - 4).setOffset(2, 2);
    }
    for (const ebene of feste) this.physics.add.collider(held, ebene);
    this.physics.world.setBounds(0, 0, karte.widthInPixels, karte.heightInPixels);
    const kamera = this.cameras.main;
    this.kamerafuehrung = new Kamerafuehrung(kamera, KACHEL, () => this.ausloeser);
    this.verdeckt = this.kamerafuehrung.richteEin(karte.widthInPixels, karte.heightInPixels, ZOOM);
    kamera.startFollow(held, true).setRoundPixels(true);
    this.zielmarker = new Zielmarker(this, KACHEL, () => this.verdeckt);
    this.zielmarker.setze(this.ziel.feld, this.ziel.an);
    this.ausloeser = liesAusloeserAus(karte);
    this.pause = EINGABEPAUSE_MS;
    const liste = this.daten.moebel ?? [];
    if (this.daten.winter) faerbeWinterlich(this, rahmenJeTextur(liste));
    richteMoebelrahmenEin(this, liste);
    // Sitzende rücken auf ihr Möbel (sitzplatz.ts); gemessen am geladenen Bild (sitzumriss.ts).
    const sitze = sitzmoebelAus(liste, KACHEL, sichtbarMesser(this));
    stelleFigurenAuf(this, held, this.ausloeser, this.daten, KACHEL, BILD_JE_RICHTUNG.unten, sitze);
    // Mit den feinen Sperren der Karte (Karteneditor 1.6, feinsperren.ts) in derselben Gruppe.
    const moebel = stelleMoebelAuf(this, liste, KACHEL, this.daten.karte);
    this.physics.add.collider(held, moebel);
    const sperrkarte = baueSperrkarte(karte, feste, moebel, KACHEL);
    [this.frei, this.zellfrei] = [sperrkarte.kachel, sperrkarte.zelle];
    this.ausloeser = mitDurchgang(this.ausloeser, this.frei, this.daten.uebergaenge ?? []);
    const stunde = this.daten.stunde ?? new Date().getHours();
    const schicht = new Belebungsschicht(this, this.belebung, KACHEL, stunde, "figur", sitze);
    this.physics.add.collider(held, schicht.sperren());
    this.belebungsschicht = schicht;
    this.toenungsschicht = new Toenungsschicht(this, KACHEL);
    this.setzeToenung(this.daten.toenung ?? null);
    zeigeTeilchen(this, this.daten.winter ? "schnee" : (this.daten.teilchen ?? null), true);
    this.tasten = pfeiltasten(this.input.keyboard);
  }

  /**
   * Das Steuerkreuz: Richtung gedrückt oder losgelassen. Ein kurzes Antippen läuft bis zur
   * nächsten Kachel weiter (tippschritt.ts), wenn der Held seine Kachel noch nicht verlassen hat.
   */
  setzeRichtung(richtung: Richtung, gedrueckt: boolean): void {
    const mitte = this.held ? { x: this.held.x, y: this.held.y } : null;
    if (gedrueckt) {
      this.gedrueckt.add(richtung);
      this.tipp = null;
      const frei = mitte && this.laufen && this.pause === 0;
      this.druck = frei ? { richtung, kachel: kachelVon(mitte, KACHEL) } : null;
      return;
    }
    this.gedrueckt.delete(richtung);
    const d = this.druck;
    this.druck = null;
    if (d?.richtung !== richtung || !mitte || this.gedrueckt.size > 0) return;
    this.tipp = tippschrittBeimLoslassen(richtung, d.kachel, mitte, KACHEL, this.frei);
  }

  /** Neue Größe des Bildes (Gerät gedreht, oberweltspiel.ts): Kamera neu einrichten. */
  passeKameraAn(): void {
    const welt = this.physics.world.bounds;
    this.verdeckt = this.kamerafuehrung?.richteEin(welt.width, welt.height, ZOOM) ?? this.verdeckt;
  }

  /** Ziel des Zielhinweises (Kachelfeld oder null) und ob er an ist (Spielmenü). */
  setzeZiel(feld: Zielfeld | null, an: boolean): void {
    this.ziel = { feld, an };
    this.zielmarker?.setze(feld, an);
  }

  /**
   * Eine Figur erscheint als Geist, wenn der Dialog es sagt (`#erscheint`), sie aber nicht auf
   * der Karte steht (geistfigur.ts): zwei Felder vor dem Helden, dort, wohin er schaut (auf dem
   * Dachboden über dem Brett). Ohne geladenen Bogen der Figur oder wenn sie schon da ist: nichts.
   */
  erscheine(name: string): void {
    const schluessel = `figur:${name}`;
    const held = this.held;
    if (!held || this.children.getByName(name) || !this.textures.exists(schluessel)) return;
    const mitte = erscheinungsfeld(held, this.blick, KACHEL);
    const bild = { schluessel, nummer: standbild("unten") };
    lasseGeistErscheinen(this, name, bild, mitte, (s) => fussUrsprungY(s, KACHEL));
  }

  /** Neue Tönung, etwa nach `setzeToenung` in einem Dialog (null: keine). */
  setzeToenung(toenung: Toenung | null): void {
    this.toenungsschicht?.setze(toenung, this.daten.laterne ?? false);
  }

  /** Dialog offen: Der Held bleibt stehen, Eingaben werden verworfen. */
  laufenErlaubt(erlaubt: boolean): void {
    this.laufen = erlaubt;
    if (erlaubt) return;
    this.gedrueckt.clear();
    this.tipp = null;
  }

  /**
   * Versetzt den Helden auf derselben Karte (Übergang innerhalb einer Karte, etwa der Steg über
   * die Schleuse in Lockport, Sperre S3). Der Zielauslöser zählt wie beim Kartenwechsel erst nach
   * dem Verlassen, sonst schickte er den Helden gleich zurück.
   */
  versetze(x: number, y: number): void {
    if (!this.held) return;
    this.held.setPosition((x + 0.5) * KACHEL, (y + 0.5) * KACHEL);
    this.meldezustand = MELDE_START;
    this.pause = EINGABEPAUSE_MS;
  }

  /** Wo der Held steht, in Kachelkoordinaten (für den Spielstand beim Verlassen). */
  position(): Weltposition {
    // Vor create() (Verlassen während des Hochfahrens) gilt die Startposition weiter.
    if (!this.held) return { ...this.daten.start, richtung: this.blick };
    return {
      karte: "",
      x: Math.floor(this.held.x / KACHEL),
      y: Math.floor(this.held.y / KACHEL),
      richtung: this.blick,
    };
  }

  /** Die gewünschte Richtung aus Steuerkreuz und Tastatur; null, wenn nichts gedrückt ist. */
  private gewuenschteRichtung(): Richtung | null {
    const t = this.tasten;
    if (this.gedrueckt.has("links") || t?.left.isDown) return "links";
    if (this.gedrueckt.has("rechts") || t?.right.isDown) return "rechts";
    if (this.gedrueckt.has("oben") || t?.up.isDown) return "oben";
    if (this.gedrueckt.has("unten") || t?.down.isDown) return "unten";
    return null;
  }

  override update(_zeit: number, delta: number): void {
    if (!this.held) return;
    const heldfeld: Feld = { x: this.held.x / KACHEL - 0.5, y: this.held.y / KACHEL - 0.5 };
    this.belebungsschicht?.aktualisiere(delta, heldfeld, this.frei);
    const gewuenscht = this.gewuenschteRichtung() ?? this.tippRichtung();
    // Der Held kommt mit Blick vom Durchgang weg an; die Gegenrichtung führte zurück hinein.
    const zurueck = gewuenscht === gegenrichtung(this.daten.start.richtung);
    this.pause = pausenschritt(this.pause, delta, gewuenscht !== null, zurueck);
    const richtung = this.laufen && this.pause === 0 ? gewuenscht : null;
    this.geht = richtung !== null;
    const koerper = this.held.body as Phaser.Physics.Arcade.Body;
    koerper.setVelocity(0, 0);
    this.zeigeHeld(richtung);
    if (richtung) {
      this.blick = richtung;
      const tempo = TEMPO * (this.daten.tempofaktor ?? 1);
      this.rueckeZurMitte(richtung);
      if (richtung === "links") koerper.setVelocityX(-tempo);
      if (richtung === "rechts") koerper.setVelocityX(tempo);
      if (richtung === "oben") koerper.setVelocityY(-tempo);
      if (richtung === "unten") koerper.setVelocityY(tempo);
    }
    this.held.setDepth(this.held.y);
    this.kamerafuehrung?.schritt(delta, richtung, { x: this.held.x, y: this.held.y });
    this.toenungsschicht?.folge(this.held.x, this.held.y);
    this.meldeAusloeser();
    this.meldeKachel();
    this.zielmarker?.aktualisiere();
  }

  /** Richtung des laufenden Tippschritts; am Ziel (oder an einer Wand) endet er genau dort. */
  private tippRichtung(): Richtung | null {
    const tipp = this.tipp;
    const held = this.held;
    if (!tipp || !held) return null;
    const koerper = held.body as Phaser.Physics.Arcade.Body;
    const seite = { oben: "up", unten: "down", links: "left", rechts: "right" } as const;
    const steht = koerper.blocked[seite[tipp.richtung]];
    if (!zielErreicht(tipp, held) && !steht) return tipp.richtung;
    if (!steht) held.setPosition(tipp.ziel.x, tipp.ziel.y);
    this.tipp = null;
    return null;
  }

  /**
   * Laufhilfe: Beim Gehen rückt der Held quer zur Richtung sanft zur Mitte seiner Kachel, damit er
   * an Ecken von Möbeln und Wänden nicht hängen bleibt (auf dem Handy trifft man selten genau);
   * vor einer schmalen Lücke neben der Mitte bis zu 4 Pixel daneben (laufhilfe.ts, Editor 1.6).
   */
  private rueckeZurMitte(richtung: Richtung): void {
    const held = this.held;
    if (!held) return;
    const quer = richtung === "oben" || richtung === "unten" ? "x" : "y";
    const koerper = (held.body as Phaser.Physics.Arcade.Body).center;
    const abstand = querziel(koerper, richtung, KACHEL, this.zellfrei) - koerper[quer];
    held[quer] += Math.sign(abstand) * Math.min(Math.abs(abstand), MITTENSCHRITT);
  }

  /** Bild des Helden: Laufanimation in Bewegung, sonst Standbild der Blickrichtung. */
  private zeigeHeld(richtung: Richtung | null): void {
    const held = this.held;
    if (!held) return;
    if (!this.daten.heldfigur) {
      if (richtung) held.setFrame(BILD_JE_RICHTUNG[richtung]);
      return;
    }
    if (richtung) held.anims.play(laufname(HELDFIGUR, richtung), true);
    else if (held.anims.isPlaying) held.anims.stop();
    if (!richtung) held.setFrame(standbild(this.blick));
  }

  /** Meldet die Kachel des Helden nach oben, wenn sie sich geändert hat. */
  private meldeKachel(): void {
    const { x, y } = this.position();
    const kachel = `${x},${y}`;
    if (kachel === this.letzteKachel) return;
    this.letzteKachel = kachel;
    this.daten.melder.beiKachel?.(x, y);
  }

  /**
   * Meldet, wenn der Held einen Auslöser betritt oder verlässt (nur bei Änderung). Gezählt wird
   * die eigene Kachel und die Kachel vor dem Helden: Gegenstände wie das Brett sind Kollision,
   * man steht davor und schaut sie an (wie in Rollenspielen in Draufsicht).
   */
  private meldeAusloeser(): void {
    const alle: readonly Ausloeser[] = [
      ...this.ausloeser,
      ...(this.belebungsschicht?.ansprechbare() ?? []).map((s) => ({
        ...s,
        typ: "statist" as const,
      })),
    ];
    // Die Regel (nur bei Änderung, „davor“ und „darauf“ getrennt, Startauslöser erst nach dem
    // Verlassen) steht in ausloeserebene.ts, damit der Lauftest über alle Übergänge sie mitprüft.
    const held = { ...this.position(), geht: this.geht };
    const schritt = meldeschritt(this.meldezustand, alle, held);
    this.meldezustand = schritt.zustand;
    if (schritt.meldung !== undefined) this.daten.melder.beiAusloeser(schritt.meldung);
  }
}

/** Die Auslöser der Ebene „ausloeser“ einer geladenen Karte (ausloeserebene.ts). */
function liesAusloeserAus(karte: Phaser.Tilemaps.Tilemap): Ausloeser[] {
  return liesAusloeser(karte.getObjectLayer(AUSLOESER_EBENE)?.objects ?? [], KACHEL);
}
