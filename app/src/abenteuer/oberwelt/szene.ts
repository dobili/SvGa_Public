/**
 * Die Phaser-Szene der Oberwelt: eine Tiled-Karte, der Held, Kollision, Auslöser.
 *
 * Rolle im Gesamtbild: Phaser zeichnet nur Karte und Figuren (Entscheidung C4); alles andere ist
 * React (oberwelt/Oberwelt.tsx). Die Schnittstelle nach oben ist der `Melder` (Held steht auf
 * einem Auslöser, Held hat ihn verlassen, Position beim Verlassen); nach unten `setzeRichtung`
 * (Steuerkreuz) und `laufenErlaubt` (Dialog offen → stehen bleiben).
 * Kacheln sind 16 px (inhalte/abenteuer/README.md), gezeichnet mit Faktor ZOOM (Architektur,
 * Abschnitt 10: DS-Look statt Game Boy). Kollision kommt aus der Kacheleigenschaft `kollision`
 * des Kachelsatzes; Auslöser aus der Objektebene `ausloeser` (Name = Bedeutung in orte.json).
 * Abhängigkeiten: phaser (MIT, docs/spiel/LIZENZEN.md), schnittstelle/spielstand.ts (Weltposition).
 */
import Phaser from "phaser";
import { kameragrenzen } from "./kamera";
import type { Weltposition } from "../schnittstelle/spielstand";
import {
  erzeugeLaufanimationen,
  ladeFigurbogen,
  laufname,
  standbild,
  stelleAufKachel,
} from "./figurbilder";
import { ladeMoebelbilder, stelleMoebelAuf, type Moebel } from "./moebel";
import { baueSperrkarte } from "./sperrkarte";
import { liesBelebung, type Belebung, type Feld } from "./belebung";
import { Belebungsschicht, ladeBelebungsbilder, type Belebungsbilder } from "./belebungsschicht";

export type Richtung = Weltposition["richtung"];

/** Kachelgröße der Karten in Pixeln. */
export const KACHEL = 16;
/** Vergrößerung auf dem Bildschirm (drei Bildschirmpixel je Kachelpixel). */
export const ZOOM = 3;
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

/** Ein Auslöser, auf dem der Held steht oder den er ansieht: Name und Art aus der Tiled-Datei. */
export interface Ausloesertreffer {
  readonly name: string;
  /**
   * „ausloeser“ (Übergang, Gegenstand, Start), „figur“ (Objekt mit type = figur) oder „statist“
   * (ansprechbarer Statist der Belebung, mit `sagt`).
   */
  readonly typ: "ausloeser" | "figur" | "statist";
  /** Der Held steht selbst darauf (true) oder nur davor (false). */
  readonly darauf: boolean;
}

/** Was die Szene nach oben meldet. */
export interface Melder {
  /** Der Held steht auf einem Auslöser oder vor einer Figur, oder auf nichts (null). */
  readonly beiAusloeser: (treffer: Ausloesertreffer | null) => void;
  /** Der Held hat eine neue Kachel erreicht (für Anzeige und Oberflächentests), nur bei Änderung. */
  readonly beiKachel?: (x: number, y: number) => void;
}

/** Was die Szene zum Aufbau braucht. */
export interface Szenendaten {
  /** Die Tiled-Karte als Objekt (aus dem Paket gelesen). */
  readonly karte: object;
  /** Adressen der Bilder (Objekt-Adressen aus dem Paket). */
  readonly kachelbild: string;
  readonly heldbild: string;
  /** Spritesheet für alle Figuren ohne eigenes Bild (Platzhalter, 16 × 16). */
  readonly figurbild: string;
  /** Bogen des Helden im Format von LimeZu (figurbilder.ts); ohne gilt heldbild. */
  readonly heldfigur?: string | null;
  /** Bögen der Figuren dieser Karte im Format von LimeZu, nach Objektname. */
  readonly figurenbilder?: Readonly<Record<string, string>>;
  /** Möbel und Schmuck der Karte (moebel.ts). */
  readonly moebel?: readonly Moebel[];
  /**
   * Hintergrundbild aus dem Kartenbauer (Boden und Wände der gekauften Grafik); mit ihm werden die
   * Kachelebenen nur noch für die Kollision gebraucht und nicht gezeichnet.
   */
  readonly hintergrund?: string | null;
  /** Name des Kachelsatzes in der Tiled-Datei. */
  readonly kachelsatz: string;
  readonly start: Weltposition;
  readonly melder: Melder;
  /** Faktor auf das Lauftempo (Fahrrad draußen: 2; sonst 1). */
  readonly tempofaktor?: number;
  /** Bögen der Statisten und Tiere (belebungsschicht.ts), Pfad im Paket → Adresse. */
  readonly belebungsbilder?: Belebungsbilder;
  /** Stunde für die Tageszeit der Statisten (`wann`); ohne Angabe die Uhr des Geräts. */
  readonly stunde?: number;
}

/** Ein Auslöser der Karte in Kachelkoordinaten. */
interface Ausloeser {
  readonly name: string;
  readonly typ: Ausloesertreffer["typ"];
  readonly x: number;
  readonly y: number;
}

const FIGUR_TYP = "figur";
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
  private letzterAusloeser: string | null = null;
  /** Zuletzt gemeldete Kachel des Helden („x,y“), damit beiKachel nur bei Änderung feuert. */
  private letzteKachel: string | null = null;
  /** Der Auslöser, auf dem der Held startet (Übergang zurück): erst melden, wenn er ihn verlässt. */
  private startAusloeserOffen = true;
  private tasten!: Phaser.Types.Input.Keyboard.CursorKeys | null;
  /** Statisten und Tiere der Karte (aus der Objektebene) und ihre Schicht nach create(). */
  private belebung: Belebung[] = [];
  private belebungsschicht: Belebungsschicht | null = null;
  /** Ist eine Kachel für Tiere begehbar (sperrkarte.ts)? Vor create() ist nichts frei. */
  private frei: (x: number, y: number) => boolean = () => false;

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
    const g = kameragrenzen(karte.widthInPixels, karte.heightInPixels, kamera.width, kamera.height);
    kamera.setBounds(g.x, g.y, g.breite, g.hoehe);
    this.cameras.main.startFollow(held, true);
    this.cameras.main.setRoundPixels(true);
    this.ausloeser = this.liesAusloeser(karte);
    this.stelleFigurenAuf(held);
    const moebel = stelleMoebelAuf(this, this.daten.moebel ?? [], KACHEL);
    this.physics.add.collider(held, moebel);
    this.frei = baueSperrkarte(karte, feste, moebel, KACHEL);
    const stunde = this.daten.stunde ?? new Date().getHours();
    const schicht = new Belebungsschicht(this, this.belebung, KACHEL, stunde, "figur");
    this.physics.add.collider(held, schicht.sperren());
    this.belebungsschicht = schicht;
    this.tasten = this.input.keyboard?.createCursorKeys() ?? null;
  }

  /** Figuren der Karte als feste Sprites mit Kollision: Der Held bleibt vor ihnen stehen. */
  private stelleFigurenAuf(held: Phaser.Physics.Arcade.Sprite): void {
    const gruppe = this.physics.add.staticGroup();
    for (const a of this.ausloeser) {
      if (a.typ !== FIGUR_TYP) continue;
      const eigenes = this.daten.figurenbilder?.[a.name] !== undefined;
      const figur = gruppe.create(
        a.x * KACHEL + KACHEL / 2,
        a.y * KACHEL + KACHEL / 2,
        eigenes ? `figur:${a.name}` : "figur",
        eigenes ? standbild("unten") : BILD_JE_RICHTUNG.unten,
      ) as Phaser.Physics.Arcade.Sprite;
      figur.setName(a.name);
      if (eigenes) stelleAufKachel(figur, KACHEL);
      // Wer weiter unten steht, wird davor gezeichnet (Köpfe ragen in die Kachel darüber).
      figur.setDepth(figur.y);
    }
    this.physics.add.collider(held, gruppe);
  }

  /** Die Objekte der Ebene „ausloeser“ als Kachelkoordinaten. */
  private liesAusloeser(karte: Phaser.Tilemaps.Tilemap): Ausloeser[] {
    const ebene = karte.getObjectLayer(AUSLOESER_EBENE);
    return (
      (ebene?.objects ?? [])
        .filter((o) => typeof o.name === "string" && o.name.length > 0)
        // Statisten und Tiere (type statist/tier) bewegen sich; sie meldet die Belebungsschicht.
        .filter((o) => o.type !== "statist" && o.type !== "tier" && o.type !== "moebel")
        .map((o) => ({
          name: o.name,
          typ: o.type === FIGUR_TYP ? ("figur" as const) : ("ausloeser" as const),
          x: Math.round((o.x ?? 0) / KACHEL),
          y: Math.round((o.y ?? 0) / KACHEL),
        }))
    );
  }

  /** Das Steuerkreuz: Richtung gedrückt oder losgelassen. */
  setzeRichtung(richtung: Richtung, gedrueckt: boolean): void {
    if (gedrueckt) this.gedrueckt.add(richtung);
    else this.gedrueckt.delete(richtung);
  }

  /** Dialog offen: Der Held bleibt stehen, Eingaben werden verworfen. */
  laufenErlaubt(erlaubt: boolean): void {
    this.laufen = erlaubt;
    if (!erlaubt) this.gedrueckt.clear();
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
    const richtung = this.laufen ? this.gewuenschteRichtung() : null;
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
    this.meldeAusloeser();
    this.meldeKachel();
  }

  /**
   * Laufhilfe: Beim Gehen rückt der Held quer zur Richtung sanft zur Mitte seiner Kachel, damit er
   * an Ecken von Möbeln und Wänden nicht hängen bleibt (auf dem Handy trifft man selten genau).
   */
  private rueckeZurMitte(richtung: Richtung): void {
    const held = this.held;
    if (!held) return;
    const quer = richtung === "oben" || richtung === "unten" ? "x" : "y";
    const mitte = Math.floor(held[quer] / KACHEL) * KACHEL + KACHEL / 2;
    const abstand = mitte - held[quer];
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
    const { x, y, richtung } = this.position();
    const vorne = KACHEL_VOR[richtung];
    const alle: readonly Ausloeser[] = [
      ...this.ausloeser,
      ...(this.belebungsschicht?.ansprechbare() ?? []).map((s) => ({
        ...s,
        typ: "statist" as const,
      })),
    ];
    const darauf = alle.find((a) => a.x === x && a.y === y) ?? null;
    const davor = alle.find((a) => a.x === x + vorne.x && a.y === y + vorne.y) ?? null;
    const treffer = darauf ?? davor;
    const name = treffer?.name ?? null;
    if (name === this.letzterAusloeser) return;
    // Der Startauslöser (etwa die Tür, durch die der Held kam) zählt erst nach dem Verlassen.
    if (this.startAusloeserOffen) {
      this.startAusloeserOffen = false;
      if (darauf) {
        this.letzterAusloeser = darauf.name;
        return;
      }
    }
    this.letzterAusloeser = name;
    this.daten.melder.beiAusloeser(
      treffer ? { name: treffer.name, typ: treffer.typ, darauf: treffer === darauf } : null,
    );
  }
}

/** Versatz der Kachel vor dem Helden je Blickrichtung. */
const KACHEL_VOR: Readonly<Record<Richtung, { readonly x: number; readonly y: number }>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};
