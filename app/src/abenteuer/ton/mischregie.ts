/**
 * Mischregie: führt die Lage der Spurenmischung (ton/spurenmischung.ts) aus dem Spiel nach,
 * also Innenraum, Siege im Kampfthema und Nähe zum Musiker (Auftrag des Hauptchats, 22.11.2026).
 *
 * Warum eigene Klasse: Die Tonregie (ton/tonregie.ts) bleibt kurz; hier steht, wann gezählt und
 * wann zurückgesetzt wird.
 * - Siege zählen für das Kampfthema, das zuletzt als Szenenmusik lief (`#musik:…clubkampf`), auch
 *   wenn der Dialog für die Partie endet und kurz die Kartenmusik spielt. Ein anderes Kampfthema
 *   oder eine andere Karte beginnt bei 0. Ob ein Stück ein Kampfthema ist, weiß spuren.json; die
 *   Regie zählt für jedes Szenenstück, der Spieler wendet es nur bei `kampf` an.
 * - Musiker: Quellen der Art `musik` aus der Karte (pipeline/abenteuer/geraeuschquellen.py), Nähe
 *   mit der Abstandskurve der räumlichen Geräusche (ton/geraeuschraum.ts).
 * Abhängigkeiten: ton/geraeuschraum.ts, ton/spurenmischung.ts.
 */
import { naeheZu, type Geraeuschquelle } from "./geraeuschraum";
import { GRUNDLAGE, type Mischlage } from "./spurenmischung";

/** Art der Musikerquellen in der Karteneigenschaft geraeuschquellen. */
export const MUSIKERART = "musik";
/** Kleinere Änderungen der Nähe hört man nicht; sie lösen kein neues Mischen aus. */
const NAEHE_SCHWELLE = 0.02;

/** Wohin die Regie ihre Wünsche gibt. */
export interface Mischziel {
  setzeMischlage(lage: Mischlage): void;
  neueKarte(): void;
}

export class Mischregie {
  private karte: string | null = null;
  private innen = false;
  private quellen: readonly Geraeuschquelle[] = [];
  private naehe = 0;
  private szenenmusik: string | null = null;
  private musik: string | null = null;
  private siege = { angabe: null as string | null, zahl: 0 };
  private gesetzt: Mischlage | null = null;

  constructor(private readonly ziel: (arbeit: (z: Mischziel) => void) => void) {}

  /** Eine Karte wurde betreten (`kennung` null: unbekannt, zählt als neue). */
  betreten(kennung: string | null, innen: boolean, quellen: readonly Geraeuschquelle[]): void {
    const neu = kennung === null || kennung !== this.karte;
    this.karte = kennung;
    this.innen = innen;
    this.quellen = quellen.filter((q) => q.art === MUSIKERART);
    this.naehe = 0;
    if (neu) {
      this.siege = { angabe: null, zahl: 0 };
      this.ziel((z) => z.neueKarte());
    }
    this.melde();
  }

  /** Der Held steht auf einem neuen Feld: Nähe zum Musiker. */
  heldBei(x: number, y: number): void {
    if (this.quellen.length === 0) return;
    const naehe = naeheZu(this.quellen, MUSIKERART, x, y);
    if (Math.abs(naehe - this.naehe) < NAEHE_SCHWELLE && naehe !== 0 && naehe !== 1) return;
    this.naehe = naehe;
    this.melde();
  }

  /** Was jetzt klingt: die Musik und, wenn es eine gibt, die Szenenmusik (`#musik`). */
  musikJetzt(musik: string | null, szenenmusik: string | null | undefined): void {
    if (szenenmusik) this.szenenmusik = szenenmusik;
    if (musik === this.musik) return;
    this.musik = musik;
    this.melde();
  }

  /** Eine Partie oder Runde ist zu Ende; ein Sieg hebt die Steigerung des Kampfthemas. */
  ergebnis(sieg: boolean): void {
    const angabe = this.szenenmusik;
    if (this.siege.angabe !== angabe) this.siege = { angabe, zahl: 0 };
    if (sieg) this.siege = { angabe, zahl: this.siege.zahl + 1 };
    this.melde();
  }

  /** Die Lage, die zuletzt gemeldet wurde (Tests). */
  get lage(): Mischlage {
    return this.gesetzt ?? GRUNDLAGE;
  }

  private melde(): void {
    const siege =
      this.siege.angabe !== null && this.siege.angabe === this.musik ? this.siege.zahl : 0;
    const lage: Mischlage = { innen: this.innen, siege, musikerNaehe: this.naehe };
    const g = this.gesetzt;
    if (
      g &&
      g.innen === lage.innen &&
      g.siege === lage.siege &&
      g.musikerNaehe === lage.musikerNaehe
    )
      return;
    this.gesetzt = lage;
    this.ziel((z) => z.setzeMischlage(lage));
  }
}
