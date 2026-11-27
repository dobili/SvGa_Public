/**
 * Texturspeicher der Oberwelt: Bilder, die auf mehreren Karten vorkommen (Figurenbögen, Kacheln,
 * Möbel, Hintergründe), bleiben über den Kartenwechsel im Speicher des einen Phaser-Spiels.
 *
 * Rolle im Gesamtbild: Seit dem 26.11.2026 läuft die ganze Oberwelt-Sitzung in einem Phaser-Spiel
 * (oberweltspiel.ts); beim Kartenwechsel startet nur die Szene neu. Phasers Lader überspringt
 * einen Schlüssel, den der Texturspeicher schon kennt, auch wenn die Adresse eine andere ist.
 * Dieser Baustein merkt sich deshalb je Schlüssel die Adresse und entscheidet vor jedem Laden:
 * gleiche Adresse → behalten (kein neues Dekodieren, kein neues Hochladen auf die Grafikkarte),
 * andere Adresse → altes Bild samt seinen Animationen weg, neu laden.
 * Warum eine Obergrenze: Am iPhone teilt sich die Seite wenig Grafikspeicher. Nach jedem Abbau
 * einer Karte fallen zuerst Bilder, die die Szene selbst gemalt oder umgefärbt hat (Dunkelheit,
 * Winterfarben), dann die am längsten unbenutzten, bis der Speicher unter OBERGRENZE_BYTES liegt.
 * Abhängigkeiten: keine zur Laufzeit; die Anbindung an Phaser steht in texturanbindung.ts.
 */

/** Gemessener Platz der dekodierten Bilder (RGBA, 4 Byte je Pixel), höchstens so viel. */
export const OBERGRENZE_BYTES = 96 * 1024 * 1024;
const BYTES_JE_PIXEL = 4;

/** Was der Speicher vom Texturspeicher des Spiels braucht (für Tests ersetzbar). */
export interface Texturablage {
  /** Alle Schlüssel ohne Phasers eigene (`__DEFAULT` und Verwandte). */
  schluessel(): readonly string[];
  vorhanden(schluessel: string): boolean;
  /** Das Texturobjekt, um ein ersetztes Bild (gleicher Schlüssel, neues Objekt) zu erkennen. */
  kennung(schluessel: string): object | null;
  /** Fläche aller Quellbilder der Textur in Pixeln. */
  pixel(schluessel: string): number;
  /** Entfernt die Textur und jede Animation, die auf ihr läuft. */
  entferne(schluessel: string): void;
}

/** Was über ein geladenes Bild bekannt ist. */
interface Eintrag {
  /** Adresse samt Rahmengröße, mit der es geladen wurde. */
  readonly signatur: string;
  /** Texturobjekt nach dem Laden; null, solange es noch lädt. */
  kennung: object | null;
  /** Nummer der Karte, die es zuletzt brauchte (für die Verdrängung). */
  genutzt: number;
}

/** Kennzahlen für Prüfungen (Attribut data-texturspeicher an der Leinwand). */
export interface Speicherstand {
  readonly texturen: number;
  readonly bytes: number;
  readonly behalten: number;
  readonly geladen: number;
}

export class Texturspeicher {
  private readonly eintraege = new Map<string, Eintrag>();
  private karte = 0;
  /** Treffer und Ladevorgänge seit dem letzten Aufbau (für die Messung). */
  private behalten = 0;
  private geladen = 0;

  constructor(
    private readonly ablage: Texturablage,
    private readonly obergrenze: number = OBERGRENZE_BYTES,
  ) {}

  /** Eine neue Karte beginnt: Zähler für Nutzung und Messung. */
  neueKarte(): void {
    this.karte += 1;
    this.behalten = 0;
    this.geladen = 0;
  }

  /**
   * Vor dem Laden eines Bildes: Ausgabe true, wenn es schon da ist und bleiben kann (Phaser
   * überspringt es dann). Beispiel: Ambroses Bogen auf mapleFalls.aussen und im Wohnzimmer →
   * beim zweiten Mal true. Sonderfall: Gleicher Schlüssel, neue Adresse (Held statt Heldin,
   * anderer Kachelstil) → das alte Bild geht, Ausgabe false.
   */
  vorLaden(schluessel: string, signatur: string): boolean {
    const eintrag = this.eintraege.get(schluessel);
    if (this.ablage.vorhanden(schluessel)) {
      const gleich = eintrag?.signatur === signatur && eintrag.kennung !== null;
      if (gleich && eintrag.kennung === this.ablage.kennung(schluessel)) {
        eintrag.genutzt = this.karte;
        this.behalten += 1;
        return true;
      }
      this.ablage.entferne(schluessel);
    }
    this.eintraege.set(schluessel, { signatur, kennung: null, genutzt: this.karte });
    this.geladen += 1;
    return false;
  }

  /** Der Lader ist fertig (vor create der Szene): geladene Bilder gelten ab jetzt als bekannt. */
  nachLaden(): void {
    for (const [schluessel, eintrag] of this.eintraege) {
      if (eintrag.kennung !== null) continue;
      if (this.ablage.vorhanden(schluessel)) eintrag.kennung = this.ablage.kennung(schluessel);
      else this.eintraege.delete(schluessel); // Laden fehlgeschlagen
    }
  }

  /**
   * Nach dem Abbau einer Karte (keine Szene zeigt mehr ein Bild): Gemaltes und Umgefärbtes weg,
   * dann das am längsten Unbenutzte, bis die Obergrenze eingehalten ist.
   */
  raeumeAuf(): void {
    for (const schluessel of this.ablage.schluessel()) {
      const eintrag = this.eintraege.get(schluessel);
      if (eintrag?.kennung && eintrag.kennung === this.ablage.kennung(schluessel)) continue;
      this.ablage.entferne(schluessel);
      this.eintraege.delete(schluessel);
    }
    for (const schluessel of [...this.eintraege.keys()]) {
      if (!this.ablage.vorhanden(schluessel)) this.eintraege.delete(schluessel);
    }
    const alt = [...this.eintraege.entries()].sort((a, b) => a[1].genutzt - b[1].genutzt);
    let bytes = this.bytes();
    for (const [schluessel] of alt) {
      if (bytes <= this.obergrenze) break;
      bytes -= this.ablage.pixel(schluessel) * BYTES_JE_PIXEL;
      this.ablage.entferne(schluessel);
      this.eintraege.delete(schluessel);
    }
  }

  /** Platz der bekannten Bilder in Byte. */
  bytes(): number {
    let summe = 0;
    for (const schluessel of this.eintraege.keys()) {
      summe += this.ablage.pixel(schluessel) * BYTES_JE_PIXEL;
    }
    return summe;
  }

  /** Kennzahlen: Texturen im Spiel, Byte der bekannten, Treffer und Ladevorgänge dieser Karte. */
  stand(): Speicherstand {
    return {
      texturen: this.ablage.schluessel().length,
      bytes: this.bytes(),
      behalten: this.behalten,
      geladen: this.geladen,
    };
  }
}
