/**
 * Musikspuren im Tonspieler: lädt die Spuren eines Ortsthemas, startet sie als ein Stück
 * (ton/spurenspieler.ts), hält die Lage der Mischung und gibt die Puffer nach dem Ausblenden frei.
 *
 * Warum eigene Klasse: Der Tonspieler (ton/tonspieler.ts) spielt Stücke als eine Datei; Spuren
 * brauchen drei Dateien, gemeinsamen Start, Mischung und Speicherplanung. So bleibt der Spieler
 * klein, und die Regel „fehlen Spuren, spielt die volle Mischung“ steht an einer Stelle.
 * Speicher (iPhone-Budget 160 MB, ton/puffervorrat.ts): Ein Ortsthema in drei Spuren liegt
 * dekodiert bei etwa 48 MB. Beim Überblenden klingen altes und neues Stück 1,5 s zusammen, also
 * etwa 96 MB. Danach vergisst der Vorrat die Spuren des alten Stücks sofort, statt sie bis zum
 * Verdrängen zu halten: So liegen nie die Spuren zweier alter Orte neben denen des neuen, und vier
 * Stereospuren gibt es nur während der 1,5 s des Überblendens.
 * Abhängigkeiten: ton/spurenmischung.ts, ton/spurenspieler.ts.
 */
import {
  GRUNDLAGE,
  spurpfad,
  type Anteile,
  type Mischlage,
  type Spurangabe,
  type Spurname,
} from "./spurenmischung";
import { STUECK_BLENDE_S, Spurenstueck } from "./spurenspieler";

/** Holt einen dekodierten Puffer über den Vorrat des Tonspielers (null, wenn die Datei fehlt). */
export type Pufferholer = (
  schluessel: string,
  pfade: readonly string[],
) => Promise<AudioBuffer | null>;

/** Was der Tonmesser über die Musik meldet (e2e, Pegelprotokoll). */
export interface Musikmessung {
  readonly angabe: string;
  readonly spuren: Anteile;
}

/** Schlüssel einer Spur im Vorrat. Beispiel: „musik:maple-falls.grund“. */
export function spurschluessel(stamm: string, spur: Spurname): string {
  return `musik:${stamm}.${spur}`;
}

export class Musikspuren {
  private stueck: Spurenstueck | null = null;
  /** Stamm der Dateien des laufenden Stücks (für das Freigeben der Puffer). */
  private stamm = "";
  private lage: Mischlage = GRUNDLAGE;

  constructor(
    private readonly ctx: AudioContext,
    private readonly ziel: AudioNode,
    private readonly hole: Pufferholer,
    private readonly vergiss: (schluessel: string) => void,
  ) {}

  /** Spielt das Stück schon (dann ändert ein neuer Wunsch nichts)? */
  spielt(angabe: string): boolean {
    return this.stueck?.angabe === angabe;
  }

  /**
   * Lädt und startet die Spuren. Ausgabe false, wenn es keinen Grund gibt (dann spielt der
   * Tonspieler die volle Mischung). `gilt` sagt nach dem Laden, ob der Wunsch noch aktuell ist.
   */
  async starte(
    angabe: string,
    stamm: string,
    a: Spurangabe,
    gilt: () => boolean,
  ): Promise<boolean> {
    const geladen = await Promise.all(
      a.spuren.map(
        async (s) => [s, await this.hole(spurschluessel(stamm, s), [spurpfad(stamm, s)])] as const,
      ),
    );
    const puffer = new Map<Spurname, AudioBuffer>();
    for (const [s, p] of geladen) if (p) puffer.set(s, p);
    if (!puffer.has("grund")) return false;
    if (!gilt()) return true;
    // Kam inzwischen ein anderes Stück in Spuren dazwischen, blendet es jetzt aus.
    this.stoppe(STUECK_BLENDE_S);
    const stueck = new Spurenstueck(this.ctx, this.ziel, angabe, a, puffer);
    stueck.setzeLage(this.lage);
    this.stueck = stueck;
    this.stamm = stamm;
    return true;
  }

  /** Blendet das laufende Stück aus; danach vergisst der Vorrat seine Spuren (Speicher). */
  stoppe(dauer: number): void {
    const alt = this.stueck;
    const stamm = this.stamm;
    if (!alt) return;
    this.stueck = null;
    alt.stoppe(dauer, () => {
      if (this.stueck?.angabe === alt.angabe) return;
      for (const s of ["grund", "melodie", "zusatz"] as const)
        this.vergiss(spurschluessel(stamm, s));
    });
  }

  /** Neue Lage der Mischung (Innenraum, Siege, Musiker). */
  setzeLage(lage: Mischlage): void {
    this.lage = lage;
    this.stueck?.setzeLage(lage);
  }

  /** Neue Karte mit demselben Stück: Ausdünnen zählt neu. */
  neueKarte(): void {
    this.stueck?.neueKarte();
  }

  /** Was gerade klingt (null ohne Spuren). */
  messung(): Musikmessung | null {
    return this.stueck ? { angabe: this.stueck.angabe, spuren: this.stueck.pegel } : null;
  }
}
