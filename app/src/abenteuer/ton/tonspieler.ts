/**
 * Spielt Musik und Geräusche des Abenteuers mit Web Audio: je eine Spur für Musik und Dauergeräusch
 * mit Überblenden, dazu einmalige Klänge (Atmosphäre T1, T2) und eine Spur für die Klangquelle in
 * der Nähe des Helden (T28), deren Lautstärke dem Abstand folgt; die Musik der Karte weicht ihr.
 * Das Dauergeräusch läuft über einen Raumregler (Grundpegel, Ankunft, Nähe zur Quelle: ton/raumregie.ts).
 *
 * Rolle im Gesamtbild: dünne Schicht unter ton/tonregie.ts; was klingen soll, entscheidet
 * ton/tonplan.ts. Die Dateien kommen über `lade` (im Spiel aus dem Paket, im Test erfunden).
 * Fehlt eine Datei, bleibt die Spur still: Es gibt noch keine Tondatei, und das Spiel muss ohne
 * sie fehlerfrei laufen (docs/spiel/23_Technik_Atmosphaere.md, Grundsätze).
 * Einmalige Stücke (musik/einmal.json, Satzplan `schleife=False`: Erinnerung, Walzer, Abspann …)
 * laufen nicht als Schleife. Danach bleibt die Spur still, bis ein anderer Wunsch kommt (Marke,
 * Dialogende, Kartenwechsel); derselbe Wunsch startet das Stück nicht neu, denn die Regie wiederholt
 * ihn bei jeder Dialogzeile (ton/tonregie.ts `spiele`). Leise Geräusche hebt klang/pegel.json an.
 * Abhängigkeiten: Browser-Schnittstelle AudioContext, ton/tonplan.ts (Dateinamen),
 * ton/tonangaben.ts (Tabellen einmalig und Anhebung), ton/puffervorrat.ts (Budget der dekodierten
 * Puffer: Ohne Grenze wuchs der Speicher in langen Sitzungen mit jeder Karte).
 */
import { raumpegel } from "./geraeuschraum";
import { motivFuer } from "./motive";
import { Musikspuren, type Musikmessung } from "./musikspuren";
import type { Mischlage } from "./spurenmischung";
import { Puffervorrat } from "./puffervorrat";
import { spieleMotiv } from "./motivspieler";
import { ladeTonangaben, stammVon, weicheAnhebung, type Tonangaben } from "./tonangaben";
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
type Ordner = "musik" | "klang";

/** Ein dekodierter Puffer und der Stamm seiner Datei (für die Tabellen, ton/tonangaben.ts). */
interface Geladen {
  readonly puffer: AudioBuffer;
  readonly stamm: string;
}
/** Wie schnell die Nähe einer Klangquelle der Bewegung folgt (Zeitkonstante, Sekunden). */
const NAEHE_S = 0.3;
/** Wie schnell der Pegel des Dauergeräuschs folgt (Zeitkonstante, Sekunden): kein Sprung. */
const RAUM_S = 0.25;
/** Musik unter Dialogzeilen (Klangplan A0, Regel 3): 3 dB leiser, weich (Zeitkonstante, s). */
export const DIALOG_DB = -3;
const DIALOG_S = 0.4;
const DEZIBEL_JE_ZEHNFACH = 20;

export class Tonspieler {
  /** Dekodierte Puffer mit Budget (ton/puffervorrat.ts). */
  private readonly puffer = new Puffervorrat<Geladen | null>((g) => g?.puffer ?? null);
  /** Schlüssel, zu denen es noch keine Datei gab (Ton lädt im Hintergrund nach, paket/aktton.ts). */
  private readonly fehlend = new Set<string>();
  private angaben: Promise<Tonangaben> | null = null;
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
  /** Pegel des Dauergeräuschs nach Ort und Ankunft (ton/raumregie.ts); `#klang` geht vorbei. */
  private readonly raum: GainNode;
  /** Musik unter Dialogzeilen 3 dB leiser (zwischen Musikregler und Ausgang). */
  private readonly dialog: GainNode;
  /** Ortsthemen in Spuren (ton/musikspuren.ts); sonst spielt die Musik als eine Datei. */
  private readonly spuren: Musikspuren;

  constructor(
    private readonly ctx: AudioContext,
    private readonly lade: Laden,
  ) {
    this.gesamt = { musik: ctx.createGain(), geraeusche: ctx.createGain() };
    this.dialog = ctx.createGain();
    this.dialog.connect(ctx.destination);
    this.gesamt.musik.connect(this.dialog);
    this.gesamt.geraeusche.connect(ctx.destination);
    this.anteil = { karte: ctx.createGain(), quelle: ctx.createGain() };
    this.anteil.karte.connect(this.gesamt.musik);
    this.anteil.quelle.connect(this.gesamt.musik);
    this.anteil.quelle.gain.value = 0;
    this.raum = ctx.createGain();
    this.raum.gain.value = raumpegel(0, 0);
    this.raum.connect(this.gesamt.geraeusche);
    this.spuren = new Musikspuren(
      ctx,
      this.anteil.karte,
      async (schluessel, pfade) => (await this.holeDatei(schluessel, pfade))?.puffer ?? null,
      (schluessel) => this.puffer.vergiss(schluessel),
    );
  }

  /** Lage der Spurenmischung (Innenraum, Siege, Nähe zum Musiker; ton/spurenmischung.ts). */
  setzeMischlage(lage: Mischlage): void {
    this.spuren.setzeLage(lage);
  }

  /** Eine Karte wurde betreten: Das Ausdünnen zählt die Schleifen neu. */
  neueKarte(): void {
    this.spuren.neueKarte();
  }

  /** Während einer Dialogzeile klingt die Musik 3 dB leiser. */
  setzeDialog(aktiv: boolean): void {
    const faktor = aktiv ? 10 ** (DIALOG_DB / DEZIBEL_JE_ZEHNFACH) : 1;
    this.dialog.gain.setTargetAtTime(faktor, this.ctx.currentTime, DIALOG_S);
  }

  /** Was an Musikspuren klingt (Tonmesser für Oberflächentests und Pegelprotokoll). */
  musikmessung(): Musikmessung | null {
    return this.spuren.messung();
  }

  /** Pegel des Dauergeräuschs (Faktor, ton/geraeuschraum.ts), weich ohne Sprung. */
  setzeRaum(faktor: number): void {
    this.raum.gain.setTargetAtTime(faktor, this.ctx.currentTime, RAUM_S);
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
   * Lässt auf der Spur die Angabe laufen (null: ausblenden), als Schleife außer bei einmaligen
   * Stücken. Ist sie schon die laufende (auch ein verklungenes einmaliges Stück), ändert sich
   * nichts; sonst blendet die alte aus und die neue ein. `ausblenden` (Sekunden) gilt nur für
   * null: Die Titelmusik geht beim Spielbeginn in 1 s (ton/tonregie.ts `titelAus`), sonst 2 s.
   */
  async spieleSchleife(
    spur: Spur,
    angabe: string | null,
    ausblenden: number = AUSBLENDEN_S,
  ): Promise<void> {
    if (this.laufend[spur]?.angabe === angabe) return;
    if (spur === "musik" && angabe !== null && this.spuren.spielt(angabe)) return;
    const nummer = ++this.wunsch[spur];
    const blende = angabe === null ? ausblenden : UEBERBLENDEN_S;
    this.blendeAus(spur, blende);
    if (spur === "musik") this.spuren.stoppe(blende);
    if (angabe === null) return;
    if (spur === "musik" && (await this.spieleSpuren(angabe, nummer))) return;
    const ordner: Ordner = spur === "geraeusch" ? "klang" : "musik";
    const [geladen, angaben] = await Promise.all([
      this.holePuffer(ordner, angabe),
      this.tabellen(),
    ]);
    if (!geladen || nummer !== this.wunsch[spur]) return;
    const regler = this.ctx.createGain();
    regler.gain.setValueAtTime(STILLE, this.ctx.currentTime);
    regler.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + UEBERBLENDEN_S);
    regler.connect(this.ziel(spur));
    const quelle = this.ctx.createBufferSource();
    quelle.buffer = geladen.puffer;
    quelle.loop = !(ordner === "musik" && angaben.einmalig.has(geladen.stamm));
    this.verbinde(quelle, regler, ordner, geladen.stamm, angaben);
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
    const [geladen, angaben] = await Promise.all([
      this.holePuffer("klang", angabe),
      this.tabellen(),
    ]);
    if (!geladen) return;
    const quelle = this.ctx.createBufferSource();
    quelle.buffer = geladen.puffer;
    this.verbinde(quelle, this.gesamt.geraeusche, "klang", geladen.stamm, angaben);
    quelle.start();
  }

  /** Belegter Speicher der dekodierten Puffer (Bytes), für Messungen. */
  pufferBytes(): number {
    return this.puffer.belegt();
  }

  /** Blendet alles aus (Abenteuer verlassen). */
  stoppeAlles(): void {
    for (const spur of ["musik", "geraeusch", "quelle"] as const) {
      this.wunsch[spur]++;
      this.blendeAus(spur, AUSBLENDEN_S);
    }
    this.spuren.stoppe(AUSBLENDEN_S);
  }

  /**
   * Ein Stück in Spuren (spuren.json nennt es, der Grund ist da): true, wenn es so spielt oder der
   * Wunsch inzwischen überholt ist; false, dann spielt die volle Mischung als eine Datei.
   */
  private async spieleSpuren(angabe: string, nummer: number): Promise<boolean> {
    const angaben = await this.tabellen();
    const stamm = stammVon(dateienFuer("musik", angabe)[0] ?? angabe);
    const a = angaben.spuren.get(stamm);
    if (!a) return false;
    return this.spuren.starte(angabe, stamm, a, () => nummer === this.wunsch.musik);
  }

  /** Die Tabellen des Pakets, einmal geladen (ton/tonangaben.ts). */
  private tabellen(): Promise<Tonangaben> {
    this.angaben ??= ladeTonangaben(this.lade);
    return this.angaben;
  }

  /** Verbindet eine Quelle mit ihrem Ziel; leise Geräusche über die weiche Anhebung (pegel.json). */
  private verbinde(
    quelle: AudioBufferSourceNode,
    ziel: AudioNode,
    ordner: Ordner,
    stamm: string,
    angaben: Tonangaben,
  ): void {
    const db = ordner === "klang" ? angaben.anhebungDb.get(stamm) : undefined;
    if (db === undefined || db <= 0) {
      quelle.connect(ziel);
      return;
    }
    const anhebung = weicheAnhebung(this.ctx, db);
    quelle.connect(anhebung);
    anhebung.connect(ziel);
  }

  /** Wohin eine Spur klingt: Musik und Quelle über ihren Anteil, das Dauergeräusch über den Raum. */
  private ziel(spur: Spur): GainNode {
    if (spur === "musik") return this.anteil.karte;
    if (spur === "quelle") return this.anteil.quelle;
    return this.raum;
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
  private holePuffer(ordner: Ordner, angabe: string): Promise<Geladen | null> {
    return this.holeDatei(`${ordner}:${angabe}`, dateienFuer(ordner, angabe));
  }

  /** Der dekodierte Puffer unter einem Schlüssel im Vorrat: erste Datei der Liste, die es gibt. */
  private holeDatei(schluessel: string, pfade: readonly string[]): Promise<Geladen | null> {
    let versprechen = this.puffer.hole(schluessel);
    if (!versprechen) {
      versprechen = this.ladeErste(pfade);
      this.puffer.lege(schluessel, versprechen);
      void versprechen.then((geladen) => {
        if (!geladen) this.fehlend.add(schluessel);
      });
    }
    return versprechen;
  }

  /**
   * Vergisst, welche Stücke fehlten: Nach dem Nachladen des Tons (paket/aktton.ts) versucht der
   * nächste Wunsch sie neu, statt still zu bleiben, bis die Seite neu lädt.
   */
  vergissFehlende(): void {
    for (const schluessel of this.fehlend) this.puffer.vergiss(schluessel);
    this.fehlend.clear();
  }

  private async ladeErste(pfade: readonly string[]): Promise<Geladen | null> {
    for (const pfad of pfade) {
      const bytes = await this.lade(pfad);
      if (!bytes) continue;
      try {
        return { puffer: await this.ctx.decodeAudioData(bytes), stamm: stammVon(pfad) };
      } catch (fehler: unknown) {
        // Eine kaputte Datei ist ein Fehler im Paket, kein Grund, das Spiel anzuhalten.
        console.warn(`Tondatei nicht lesbar: ${pfad}`, fehler);
      }
    }
    return null;
  }
}
