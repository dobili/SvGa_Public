/**
 * Raumregie: führt den Pegel des Dauergeräuschs über die Zeit (Ankunft) und den Weg des Helden
 * (Nähe zur Quelle), höchstens alle `TAKT_MS` neu (Auftrag des Hauptchats, 22.11.2026).
 *
 * Warum eigene Klasse: Die Rechnung (ton/geraeuschraum.ts) ist zeitlos; hier kommen Uhr, Takt und
 * Gedächtnis dazu (wo der Held steht, seit wann die Karte betreten ist). Die Tonregie bleibt so
 * kurz und ihre Tests ohne Uhr.
 * Leistung (iPhone): Beim Gehen rechnet die Regie je neuem Feld, aber höchstens alle 100 ms; der
 * Takt läuft nur während der Ankunft (gut 6 s), danach steht er. Den weichen Übergang zwischen
 * zwei Werten macht Web Audio (ton/tonspieler.ts, `setzeRaum`).
 * Abhängigkeiten: ton/geraeuschraum.ts.
 */
import {
  ANKUNFT_DAUER_S,
  ankunftsanteil,
  naeheZu,
  raumpegel,
  TAKT_MS,
  type Geraeuschquelle,
} from "./geraeuschraum";

const MS_JE_SEKUNDE = 1000;

/** Uhr und Wecker (im Test erfunden). */
export interface Raumuhr {
  jetzt(): number;
  spaeter(arbeit: () => void, ms: number): void;
}

const ECHTE_UHR: Raumuhr = {
  jetzt: () => performance.now(),
  spaeter: (arbeit, ms) => void setTimeout(arbeit, ms),
};

/** Stamm einer Klangangabe: „klang/wasserfall.m4a“ → „wasserfall“, „wind“ → „wind“. */
export function artVon(angabe: string | null): string | null {
  if (!angabe) return null;
  return (angabe.split("/").pop() ?? angabe).replace(/\.(m4a|ogg)$/, "");
}

export class Raumregie {
  private quellen: readonly Geraeuschquelle[] = [];
  private art: string | null = null;
  private feld: { readonly x: number; readonly y: number } | null = null;
  private ankunftSeit: number | null = null;
  private zuletzt = Number.NEGATIVE_INFINITY;
  private geplant = false;
  private gesetzt: number | null = null;

  constructor(
    private readonly setze: (faktor: number) => void,
    private readonly uhr: Raumuhr = ECHTE_UHR,
  ) {}

  /**
   * Eine Karte wurde betreten. Ihr Geräusch schwillt an, wenn es ein anderes ist als vorher; wer
   * vom Park auf die Straße geht (beide Wasserfall), hört es einfach weiter.
   */
  betreten(art: string | null, quellen: readonly Geraeuschquelle[]): void {
    const neu = art !== null && art !== this.art;
    this.art = art;
    this.quellen = quellen;
    this.feld = null;
    this.ankunftSeit = neu ? this.uhr.jetzt() : null;
    this.rechne();
  }

  /** Das Geräusch wechselt ohne Kartenwechsel (Dialog `#geraeusch`): kein Anschwellen. */
  geraeusch(art: string | null): void {
    if (art === this.art) return;
    this.art = art;
    this.rechne();
  }

  /** Der Held steht auf einem neuen Feld. */
  heldBei(x: number, y: number): void {
    this.feld = { x, y };
    this.rechne();
  }

  /** Der Pegel, der zuletzt gesetzt wurde (für Tests und das Pegelprotokoll). */
  get pegel(): number | null {
    return this.gesetzt;
  }

  /** Rechnet neu, höchstens alle `TAKT_MS`; sonst einmal am Ende des Takts. */
  private rechne(): void {
    const jetzt = this.uhr.jetzt();
    const warten = this.zuletzt + TAKT_MS - jetzt;
    if (warten > 0) {
      this.plane(warten);
      return;
    }
    this.zuletzt = jetzt;
    const naehe = this.feld ? naeheZu(this.quellen, this.art, this.feld.x, this.feld.y) : 0;
    const sekunden = this.ankunftSeit === null ? -1 : (jetzt - this.ankunftSeit) / MS_JE_SEKUNDE;
    const faktor = raumpegel(naehe, ankunftsanteil(sekunden));
    if (faktor !== this.gesetzt) {
      this.gesetzt = faktor;
      this.setze(faktor);
    }
    // Während der Ankunft weiter im Takt, danach nur noch auf Schritte hin.
    if (this.ankunftSeit !== null && sekunden <= ANKUNFT_DAUER_S) this.plane(TAKT_MS);
    else this.ankunftSeit = null;
  }

  private plane(ms: number): void {
    if (this.geplant) return;
    this.geplant = true;
    this.uhr.spaeter(() => {
      this.geplant = false;
      this.rechne();
    }, ms);
  }
}
