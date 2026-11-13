/**
 * Spielt Musik und Geräusche des Abenteuers mit Web Audio: je eine Spur für Musik und Dauergeräusch
 * mit Überblenden, dazu einmalige Klänge (Atmosphäre T1, T2) und eine Spur für die Klangquelle in
 * der Nähe des Helden (T28), deren Lautstärke dem Abstand folgt; die Musik der Karte weicht ihr.
 *
 * Rolle im Gesamtbild: dünne Schicht unter ton/tonregie.ts; was klingen soll, entscheidet
 * ton/tonplan.ts. Die Dateien kommen über `lade` (im Spiel aus dem Paket, im Test erfunden).
 * Fehlt eine Datei, bleibt die Spur still: Es gibt noch keine Tondatei, und das Spiel muss ohne
 * sie fehlerfrei laufen (docs/spiel/23_Technik_Atmosphaere.md, Grundsätze).
 * Abhängigkeiten: Browser-Schnittstelle AudioContext, ton/tonplan.ts (Dateinamen).
 */
import { motivFuer } from "./motive";
import { spieleMotiv } from "./motivspieler";
import { dateienFuer } from "./tonplan";

/** Überblenden beim Wechsel der Musik (Sekunden je Richtung). */
export const UEBERBLENDEN_S = 1.5;
/** Ausblenden bei `#musik:aus` und am Ende (Sekunden). */
export const AUSBLENDEN_S = 2;
/** Eine Spur gilt als still unter diesem Pegel (exponentielle Rampen dürfen nicht bis 0). */
const STILLE = 0.0001;

/** Liest eine Paketdatei als Bytes; null, wenn es sie nicht gibt. */
export type Laden = (pfad: string) => Promise<ArrayBuffer | null>;

/** Eine laufende Schleife: ihre Quelle, ihr Regler und die Angabe, die sie spielt. */
interface Schleife {
  readonly angabe: string;
  readonly quelle: AudioBufferSourceNode;
  readonly regler: GainNode;
}

type Spur = "musik" | "geraeusch" | "quelle";
/** Wie schnell die Nähe einer Klangquelle der Bewegung folgt (Zeitkonstante, Sekunden). */
const NAEHE_S = 0.3;

export class Tonspieler {
  private readonly puffer = new Map<string, Promise<AudioBuffer | null>>();
  private readonly laufend: Record<Spur, Schleife | null> = {
    musik: null,
    geraeusch: null,
    quelle: null,
  };
  /** Zähler je Spur: Ein späterer Wunsch macht einen früheren, noch ladenden ungültig. */
  private readonly wunsch: Record<Spur, number> = { musik: 0, geraeusch: 0, quelle: 0 };
  private readonly gesamt: Record<"musik" | "geraeusche", GainNode>;
  /** Anteil der Kartenmusik und der Klangquelle (T28), zusammen 1. */
  private readonly anteil: Record<"karte" | "quelle", GainNode>;

  constructor(
    private readonly ctx: AudioContext,
    private readonly lade: Laden,
  ) {
    this.gesamt = { musik: ctx.createGain(), geraeusche: ctx.createGain() };
    this.gesamt.musik.connect(ctx.destination);
    this.gesamt.geraeusche.connect(ctx.destination);
    this.anteil = { karte: ctx.createGain(), quelle: ctx.createGain() };
    this.anteil.karte.connect(this.gesamt.musik);
    this.anteil.quelle.connect(this.gesamt.musik);
    this.anteil.quelle.gain.value = 0;
  }

  /** Nähe der Klangquelle 0 bis 1 (T28): die Quelle so laut, die Kartenmusik um so viel leiser. */
  setzeNaehe(anteil: number): void {
    const jetzt = this.ctx.currentTime;
    this.anteil.quelle.gain.setTargetAtTime(anteil, jetzt, NAEHE_S);
    this.anteil.karte.gain.setTargetAtTime(1 - anteil, jetzt, NAEHE_S);
  }

  /** Pegel 0 bis 1 für Musik und Geräusche (Einstellungen, ton/tonplan.ts `pegel`). */
  setzePegel(musik: number, geraeusche: number): void {
    const jetzt = this.ctx.currentTime;
    this.gesamt.musik.gain.setTargetAtTime(musik, jetzt, AUSBLENDEN_S / 4);
    this.gesamt.geraeusche.gain.setTargetAtTime(geraeusche, jetzt, AUSBLENDEN_S / 4);
  }

  /**
   * Lässt auf der Spur die Angabe als Schleife laufen (null: ausblenden). Läuft sie schon, ändert
   * sich nichts; sonst blendet die alte aus und die neue ein.
   */
  async spieleSchleife(spur: Spur, angabe: string | null): Promise<void> {
    if (this.laufend[spur]?.angabe === angabe) return;
    const nummer = ++this.wunsch[spur];
    this.blendeAus(spur, angabe === null ? AUSBLENDEN_S : UEBERBLENDEN_S);
    if (angabe === null) return;
    const puffer = await this.holePuffer(spur === "geraeusch" ? "klang" : "musik", angabe);
    if (!puffer || nummer !== this.wunsch[spur]) return;
    const regler = this.ctx.createGain();
    regler.gain.setValueAtTime(STILLE, this.ctx.currentTime);
    regler.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + UEBERBLENDEN_S);
    regler.connect(this.ziel(spur));
    const quelle = this.ctx.createBufferSource();
    quelle.buffer = puffer;
    quelle.loop = true;
    quelle.connect(regler);
    quelle.start();
    this.laufend[spur] = { angabe, quelle, regler };
  }

  /**
   * Spielt ein Geräusch einmal (`#klang`); fehlt die Datei, geschieht nichts. Ist die Kennung ein
   * erzeugtes Motiv (ton/motive.ts: aha, hale, blindschach.e4 …), erzeugt der Browser es selbst und
   * spielt es mit der Musik (Regler „Musik“).
   */
  async spieleEinmal(angabe: string): Promise<void> {
    const motiv = motivFuer(angabe);
    if (motiv) {
      spieleMotiv(this.ctx, this.gesamt.musik, motiv);
      return;
    }
    const puffer = await this.holePuffer("klang", angabe);
    if (!puffer) return;
    const quelle = this.ctx.createBufferSource();
    quelle.buffer = puffer;
    quelle.connect(this.gesamt.geraeusche);
    quelle.start();
  }

  /** Blendet alles aus (Abenteuer verlassen). */
  stoppeAlles(): void {
    for (const spur of ["musik", "geraeusch", "quelle"] as const) {
      this.wunsch[spur]++;
      this.blendeAus(spur, AUSBLENDEN_S);
    }
  }

  /** Wohin eine Spur klingt: Musik und Quelle über ihren Anteil, Geräusche direkt. */
  private ziel(spur: Spur): GainNode {
    if (spur === "musik") return this.anteil.karte;
    if (spur === "quelle") return this.anteil.quelle;
    return this.gesamt.geraeusche;
  }

  private blendeAus(spur: Spur, dauer: number): void {
    const alt = this.laufend[spur];
    if (!alt) return;
    this.laufend[spur] = null;
    const jetzt = this.ctx.currentTime;
    alt.regler.gain.setValueAtTime(Math.max(alt.regler.gain.value, STILLE), jetzt);
    alt.regler.gain.exponentialRampToValueAtTime(STILLE, jetzt + dauer);
    alt.quelle.stop(jetzt + dauer);
  }

  /** Der dekodierte Puffer zu einer Angabe: erste Datei, die es gibt (m4a vor ogg), sonst null. */
  private holePuffer(ordner: "musik" | "klang", angabe: string): Promise<AudioBuffer | null> {
    const schluessel = `${ordner}:${angabe}`;
    let versprechen = this.puffer.get(schluessel);
    if (!versprechen) {
      versprechen = this.ladeErste(dateienFuer(ordner, angabe));
      this.puffer.set(schluessel, versprechen);
    }
    return versprechen;
  }

  private async ladeErste(pfade: readonly string[]): Promise<AudioBuffer | null> {
    for (const pfad of pfade) {
      const bytes = await this.lade(pfad);
      if (!bytes) continue;
      try {
        return await this.ctx.decodeAudioData(bytes);
      } catch (fehler: unknown) {
        // Eine kaputte Datei ist ein Fehler im Paket, kein Grund, das Spiel anzuhalten.
        console.warn(`Tondatei nicht lesbar: ${pfad}`, fehler);
      }
    }
    return null;
  }
}
