/**
 * Vorrat der dekodierten Tonpuffer mit festem Speicherbudget: Was am längsten nicht mehr verlangt
 * wurde, fliegt zuerst.
 *
 * Warum: Der Tonspieler (ton/tonspieler.ts) hielt jedes einmal gehörte Stück dekodiert bis zum
 * Neuladen der Seite. Dekodiert (48 kHz, Stereo, 32 Bit) sind die 152 Musikstücke zusammen rund
 * 3 GB, die 221 Geräusche 1,2 GB; das mittlere Stück 18 MB, das längste 86 MB. In einer langen
 * Sitzung auf dem Handy (13 bis 18 Stunden Spiel, oft am Stück) wuchs der Speicher so mit jeder
 * Karte, bis das System den Tab beendete (Ausdauerprüfung, 19.11.2026). Ein Puffer, der gerade
 * spielt, gehört seiner Quelle selbst; Aussortieren bricht nichts ab, das nächste Abspielen
 * dekodiert neu.
 * Eingaben: Schlüssel („musik:maple-falls“) und das Versprechen des Puffers; Größe erst, wenn er
 * dekodiert ist. Abhängigkeiten: keine.
 */

/** Budget für dekodierte Puffer (Bytes): das längste Stück, ein Geräusch und kurze Klänge. */
export const PUFFER_BUDGET_BYTES = 160 * 1024 * 1024;
/** Bytes je Abtastwert (32-Bit-Gleitkomma, wie Web Audio dekodiert). */
const BYTES_JE_WERT = 4;

/** Was am Puffer zählt: Länge und Kanäle (AudioBuffer). */
export interface Puffermass {
  readonly length: number;
  readonly numberOfChannels: number;
}

/** Bytes eines dekodierten Puffers. Beispiel: 49 s bei 48 kHz, Stereo → 18,8 MB. */
export function pufferBytes(p: Puffermass): number {
  return p.length * p.numberOfChannels * BYTES_JE_WERT;
}

/**
 * Hält Puffer-Versprechen je Schlüssel in der Reihenfolge des letzten Zugriffs und sortiert die
 * ältesten aus, sobald die dekodierten zusammen das Budget übersteigen. Der zuletzt verlangte
 * bleibt immer, auch wenn er allein größer ist.
 */
export class Puffervorrat<T> {
  private readonly eintraege = new Map<string, Promise<T>>();
  private readonly bytes = new Map<string, number>();

  constructor(
    private readonly massVon: (wert: T) => Puffermass | null,
    private readonly budget = PUFFER_BUDGET_BYTES,
  ) {}

  /** Das Versprechen zum Schlüssel (und merkt den Zugriff), sonst undefined. */
  hole(schluessel: string): Promise<T> | undefined {
    const wert = this.eintraege.get(schluessel);
    if (wert === undefined) return undefined;
    this.eintraege.delete(schluessel);
    this.eintraege.set(schluessel, wert);
    return wert;
  }

  /** Legt ein Versprechen ab; ist es dekodiert, zählt seine Größe, und der Vorrat räumt auf. */
  lege(schluessel: string, wert: Promise<T>): void {
    this.eintraege.set(schluessel, wert);
    void wert.then((fertig) => {
      if (this.eintraege.get(schluessel) !== wert) return;
      const mass = this.massVon(fertig);
      if (!mass) return;
      this.bytes.set(schluessel, pufferBytes(mass));
      this.raeumeAuf(schluessel);
    });
  }

  /** Vergisst einen Schlüssel (etwa eine Datei, die fehlte und jetzt nachgeladen ist). */
  vergiss(schluessel: string): void {
    this.eintraege.delete(schluessel);
    this.bytes.delete(schluessel);
  }

  /** Summe der dekodierten Puffer im Vorrat (Bytes). */
  belegt(): number {
    let summe = 0;
    for (const b of this.bytes.values()) summe += b;
    return summe;
  }

  /** Sortiert die ältesten dekodierten Puffer aus, bis das Budget wieder reicht. */
  private raeumeAuf(behalte: string): void {
    let summe = this.belegt();
    for (const schluessel of [...this.eintraege.keys()]) {
      if (summe <= this.budget) return;
      const b = this.bytes.get(schluessel);
      if (b === undefined || schluessel === behalte) continue;
      summe -= b;
      this.vergiss(schluessel);
    }
  }
}
