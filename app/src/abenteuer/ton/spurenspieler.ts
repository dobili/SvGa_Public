/**
 * Ein Ortsthema in Spuren mit Web Audio abspielen (Klangplan A0.1, Auftrag des Hauptchats,
 * 22.11.2026): Alle Spuren starten im selben Augenblick und schleifen gemeinsam; ihre Pegel setzt
 * die Mischung (ton/spurenmischung.ts), an jeder Schleifengrenze neu (Ausdünnen).
 *
 * Warum `loopStart`/`loopEnd`: AAC hat einen Vorlauf von 2112 Abtastwerten. Safari dekodiert ihn
 * mit, Chrome schneidet ihn ab. Ohne Schleifenpunkte auf die Formlänge (spuren.json `form`) läge
 * an der Naht eine Lücke, und die Spuren liefen auseinander. Ist der Puffer um mindestens den
 * Vorlauf länger als die Form, beginnt die Schleife nach dem Vorlauf, sonst bei 0.
 * Speicher: Grund und Melodie Stereo, Zusatz Mono; 50 s bei 48 kHz sind 19 + 19 + 10 = 48 MB.
 * Abhängigkeiten: Browser-Schnittstelle AudioContext, ton/spurenmischung.ts.
 */
import {
  formSekunden,
  GRUNDLAGE,
  mischung,
  SPUREN,
  type Anteile,
  type Mischlage,
  type Spurangabe,
  type Spurname,
} from "./spurenmischung";

/** Vorlauf des AAC-Kodierers in Abtastwerten (Apple und ffmpeg). */
export const AAC_VORLAUF = 2112;
/** Zeitkonstante, mit der eine Spur ihrem neuen Pegel folgt (Sekunden): weich, kein Sprung. */
const SPURWECHSEL_S = 0.4;
/** Ein- und Ausblenden des ganzen Stücks (Sekunden), wie Überblenden im Tonspieler. */
export const STUECK_BLENDE_S = 1.5;
/** Kleiner Abstand zum gemeinsamen Start (Sekunden): alle Quellen bekommen denselben Zeitpunkt. */
const STARTVERSATZ_S = 0.05;
/** Eine Spur gilt als still unter diesem Pegel (exponentielle Rampen dürfen nicht bis 0). */
const STILLE = 0.0001;
const MS_JE_SEKUNDE = 1000;

/**
 * Schleifenpunkte eines dekodierten Puffers (Sekunden): nach dem Vorlauf, wenn der Puffer ihn
 * enthält, sonst ab 0; Ende = Anfang + Form, nie über den Puffer hinaus.
 * Beispiel: Form 50 s bei 44,1 kHz, Puffer 50,048 s → [0,0479, 50,0479]; Puffer 50 s → [0, 50].
 */
export function schleifenpunkte(dauer: number, a: Spurangabe): [number, number] {
  const form = formSekunden(a);
  const vorlauf = AAC_VORLAUF / a.rate;
  const anfang = dauer - form >= vorlauf ? vorlauf : 0;
  return [anfang, Math.min(dauer, anfang + form)];
}

/** Was je Spur läuft. */
interface Laufend {
  readonly quelle: AudioBufferSourceNode;
  readonly regler: GainNode;
}

export class Spurenstueck {
  private readonly spuren = new Map<Spurname, Laufend>();
  private readonly gesamt: GainNode;
  private readonly beginn: number;
  /** Nummer der Schleife, ab der gezählt wird (seit dem Betreten der Karte). */
  private zaehlerAb = 0;
  private lage: Mischlage = GRUNDLAGE;
  private wecker: ReturnType<typeof setTimeout> | null = null;
  private gesetzt: Anteile = { grund: 0, melodie: 0, zusatz: 0 };

  constructor(
    private readonly ctx: AudioContext,
    ziel: AudioNode,
    readonly angabe: string,
    private readonly a: Spurangabe,
    puffer: ReadonlyMap<Spurname, AudioBuffer>,
  ) {
    this.gesamt = ctx.createGain();
    this.gesamt.gain.setValueAtTime(STILLE, ctx.currentTime);
    this.gesamt.gain.exponentialRampToValueAtTime(1, ctx.currentTime + STUECK_BLENDE_S);
    this.gesamt.connect(ziel);
    this.beginn = ctx.currentTime + STARTVERSATZ_S;
    for (const spur of SPUREN) {
      const p = puffer.get(spur);
      if (p) this.spuren.set(spur, this.starte(p));
    }
    this.wende();
  }

  /** Die Lage ändert sich (Innenraum, Siege, Nähe zum Musiker): neu mischen. */
  setzeLage(lage: Mischlage): void {
    this.lage = lage;
    this.wende();
  }

  /** Neue Karte mit demselben Stück: Die Zählung der Schleifen beginnt neu (Ausdünnen). */
  neueKarte(): void {
    this.zaehlerAb = this.laufendeSchleife();
    this.wende();
  }

  /** Nummer der Schleife, die gerade klingt (ab Beginn des Stücks). */
  private laufendeSchleife(): number {
    return Math.floor(Math.max(0, this.ctx.currentTime - this.beginn) / formSekunden(this.a));
  }

  /** Die zuletzt gesetzten Pegel je Spur (Tonmesser, Tests). */
  get pegel(): Anteile {
    return this.gesetzt;
  }

  /** Blendet aus und hält an; `fertig` nach dem Ausblenden (Puffer freigeben). */
  stoppe(dauer: number, fertig: () => void): void {
    if (this.wecker) clearTimeout(this.wecker);
    this.wecker = null;
    const jetzt = this.ctx.currentTime;
    this.gesamt.gain.setValueAtTime(Math.max(this.gesamt.gain.value, STILLE), jetzt);
    this.gesamt.gain.exponentialRampToValueAtTime(STILLE, jetzt + dauer);
    for (const s of this.spuren.values()) s.quelle.stop(jetzt + dauer);
    setTimeout(fertig, dauer * MS_JE_SEKUNDE);
  }

  private starte(p: AudioBuffer): Laufend {
    const [anfang, ende] = schleifenpunkte(p.duration, this.a);
    const regler = this.ctx.createGain();
    regler.gain.value = 0;
    regler.connect(this.gesamt);
    const quelle = this.ctx.createBufferSource();
    quelle.buffer = p;
    quelle.loop = true;
    quelle.loopStart = anfang;
    quelle.loopEnd = ende;
    quelle.connect(regler);
    quelle.start(this.beginn, anfang);
    return { quelle, regler };
  }

  /** Mischt für die laufende Schleife und weckt sich an der nächsten Grenze wieder. */
  private wende(): void {
    if (this.wecker) clearTimeout(this.wecker);
    // Gewechselt wird an den Grenzen der klingenden Schleife; gezählt ab dem Betreten der Karte.
    const form = formSekunden(this.a);
    const klingt = this.laufendeSchleife();
    this.gesetzt = mischung(this.a, this.lage, klingt - this.zaehlerAb);
    for (const [spur, s] of this.spuren) {
      s.regler.gain.setTargetAtTime(this.gesetzt[spur], this.ctx.currentTime, SPURWECHSEL_S);
    }
    const bisGrenze = this.beginn + (klingt + 1) * form - this.ctx.currentTime;
    this.wecker = setTimeout(() => this.wende(), bisGrenze * MS_JE_SEKUNDE);
  }
}
