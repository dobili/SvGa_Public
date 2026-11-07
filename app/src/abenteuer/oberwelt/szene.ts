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
import type { Weltposition } from "../schnittstelle/spielstand";

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

/** Was die Szene nach oben meldet. */
export interface Melder {
  /** Der Held steht auf einem Auslöser (Name aus der Tiled-Datei) oder auf keinem (null). */
  readonly beiAusloeser: (name: string | null) => void;
}

/** Was die Szene zum Aufbau braucht. */
export interface Szenendaten {
  /** Die Tiled-Karte als Objekt (aus dem Paket gelesen). */
  readonly karte: object;
  /** Adressen der Bilder (Objekt-Adressen aus dem Paket). */
  readonly kachelbild: string;
  readonly heldbild: string;
  /** Name des Kachelsatzes in der Tiled-Datei. */
  readonly kachelsatz: string;
  readonly start: Weltposition;
  readonly melder: Melder;
}

/** Ein Auslöser der Karte in Kachelkoordinaten. */
interface Ausloeser {
  readonly name: string;
  readonly x: number;
  readonly y: number;
}

export class Oberweltszene extends Phaser.Scene {
  /** Der Held; null, bis create() gelaufen ist (die Hülle kann vorher schon fragen). */
  private held: Phaser.Physics.Arcade.Sprite | null = null;
  private readonly gedrueckt = new Set<Richtung>();
  private laufen = true;
  private blick: Richtung;
  private ausloeser: Ausloeser[] = [];
  private letzterAusloeser: string | null = null;
  private tasten!: Phaser.Types.Input.Keyboard.CursorKeys | null;

  constructor(private readonly daten: Szenendaten) {
    super("oberwelt");
    this.blick = daten.start.richtung;
  }

  preload(): void {
    this.load.image("kacheln", this.daten.kachelbild);
    this.load.spritesheet("held", this.daten.heldbild, { frameWidth: KACHEL, frameHeight: KACHEL });
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
      feste.push(ebene);
    }
    const { x, y } = this.daten.start;
    const held = this.physics.add.sprite(
      x * KACHEL + KACHEL / 2,
      y * KACHEL + KACHEL / 2,
      "held",
      BILD_JE_RICHTUNG[this.blick],
    );
    this.held = held;
    held.setCollideWorldBounds(true);
    const koerper = held.body as Phaser.Physics.Arcade.Body;
    koerper.setSize(KACHEL - 4, KACHEL - 4).setOffset(2, 2);
    for (const ebene of feste) this.physics.add.collider(held, ebene);
    this.physics.world.setBounds(0, 0, karte.widthInPixels, karte.heightInPixels);
    this.cameras.main.setBounds(0, 0, karte.widthInPixels, karte.heightInPixels);
    this.cameras.main.startFollow(held, true);
    this.cameras.main.setRoundPixels(true);
    this.ausloeser = this.liesAusloeser(karte);
    this.tasten = this.input.keyboard?.createCursorKeys() ?? null;
  }

  /** Die Objekte der Ebene „ausloeser“ als Kachelkoordinaten. */
  private liesAusloeser(karte: Phaser.Tilemaps.Tilemap): Ausloeser[] {
    const ebene = karte.getObjectLayer(AUSLOESER_EBENE);
    return (ebene?.objects ?? [])
      .filter((o) => typeof o.name === "string" && o.name.length > 0)
      .map((o) => ({
        name: o.name,
        x: Math.round((o.x ?? 0) / KACHEL),
        y: Math.round((o.y ?? 0) / KACHEL),
      }));
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

  override update(): void {
    if (!this.held) return;
    const richtung = this.laufen ? this.gewuenschteRichtung() : null;
    const koerper = this.held.body as Phaser.Physics.Arcade.Body;
    koerper.setVelocity(0, 0);
    if (richtung) {
      this.blick = richtung;
      this.held.setFrame(BILD_JE_RICHTUNG[richtung]);
      if (richtung === "links") koerper.setVelocityX(-TEMPO);
      if (richtung === "rechts") koerper.setVelocityX(TEMPO);
      if (richtung === "oben") koerper.setVelocityY(-TEMPO);
      if (richtung === "unten") koerper.setVelocityY(TEMPO);
    }
    this.meldeAusloeser();
  }

  /**
   * Meldet, wenn der Held einen Auslöser betritt oder verlässt (nur bei Änderung). Gezählt wird
   * die eigene Kachel und die Kachel vor dem Helden: Gegenstände wie das Brett sind Kollision,
   * man steht davor und schaut sie an (wie in Rollenspielen in Draufsicht).
   */
  private meldeAusloeser(): void {
    const { x, y, richtung } = this.position();
    const vorne = KACHEL_VOR[richtung];
    const treffer =
      this.ausloeser.find((a) => a.x === x && a.y === y) ??
      this.ausloeser.find((a) => a.x === x + vorne.x && a.y === y + vorne.y) ??
      null;
    const name = treffer?.name ?? null;
    if (name === this.letzterAusloeser) return;
    this.letzterAusloeser = name;
    this.daten.melder.beiAusloeser(name);
  }
}

/** Versatz der Kachel vor dem Helden je Blickrichtung. */
const KACHEL_VOR: Readonly<Record<Richtung, { readonly x: number; readonly y: number }>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};

/** Startet Phaser in einem Element; die Breite folgt dem Element, gezeichnet mit ZOOM. */
export function starteOberwelt(element: HTMLElement, daten: Szenendaten): Phaser.Game {
  const szene = new Oberweltszene(daten);
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: element,
    width: Math.max(1, Math.floor(element.clientWidth / ZOOM)),
    height: Math.max(1, Math.floor(element.clientHeight / ZOOM)),
    zoom: ZOOM,
    pixelArt: true,
    backgroundColor: "#1a1612",
    physics: { default: "arcade", arcade: { debug: false } },
    scene: szene,
    // Die App regelt Ton und Blattstapel selbst; Phaser soll keine Tastatur-Scrolls abfangen.
    input: { keyboard: { capture: [] } },
    audio: { noAudio: true },
  });
}

/**
 * Beendet ein Spiel sauber: Läuft Phaser noch hoch (der Leser hat die Ansicht sofort wieder
 * verlassen), erst nach dem Start zerstören; ein Fehler dabei darf die App nicht abstürzen lassen.
 */
export function beendeOberwelt(spiel: Phaser.Game): void {
  const zerstoere = () => {
    try {
      spiel.destroy(true);
    } catch (fehler) {
      console.warn("Oberwelt konnte nicht sauber beendet werden:", fehler);
    }
  };
  if (spiel.isBooted) zerstoere();
  else spiel.events.once(Phaser.Core.Events.READY, zerstoere);
}

/** Die laufende Szene eines Spiels (nach dem Start). */
export function szeneVon(spiel: Phaser.Game): Oberweltszene | null {
  const szene = spiel.scene.getScene("oberwelt");
  return szene instanceof Oberweltszene ? szene : null;
}
