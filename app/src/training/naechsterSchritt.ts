/**
 * „Dein nächster Schritt“ (Gamifizierung P1): aus dem Lernstand eine kleine, klare Handlung
 * vorschlagen, dazu zwei Alternativen.
 *
 * Rolle im Gesamtbild: Die Karte oben im Buch (ui/komponenten/start/NaechsterSchritt.tsx) zeigt
 * den ersten Vorschlag, „Lieber etwas anderes?“ die nächsten zwei. Welche Arten es gibt und in
 * welcher Rangfolge, steht als Liste in training/vorschlagsarten.ts; ein späterer Trainer trägt
 * dort eine Zeile ein (Wunsch des Autors, 31.10.2026: eintragen statt umbauen). Diese Datei hält
 * nur die gemeinsamen Typen und die Auswahl, alles rein und ohne Speicherzugriff.
 * Warum: Beim Öffnen senkt ein einzelner Vorschlag die Hürde zum Anfangen; die Alternativen
 * lassen die Wahl beim Leser (Selbstbestimmung, gamifizierung.md Abschnitt 1).
 * Abhängigkeiten: training/vorschlagsarten.ts, training/kurzplaene.ts, Typen aus Speicher,
 * Navigation und Sprache.
 */
import type { Ansicht } from "../app/stapel";
import type { Textschluessel, Textwerte } from "../i18n/sprache";
import type { Nutzerdaten } from "../speicher/format";
import { tagesschluessel, type Tagesserie } from "./kurzplaene";
import { VORSCHLAGSARTEN } from "./vorschlagsarten";

export { GESEHEN_FUER_UEBUNGEN, kapitelFuerUebungen } from "./vorschlagsarten";

/** Ein Kapitel, wie es das Datenverzeichnis (index.json) kennt. */
export interface Kapitelangabe {
  readonly kapitel: number;
  readonly titel: string;
  /** Abbildungsnummern in Buchreihenfolge. */
  readonly abbildungen: readonly string[];
}

/** Alles, was die Vorschläge wissen dürfen; die Karte stellt es zusammen. */
export interface Lage {
  readonly daten: Nutzerdaten;
  readonly kapitel: readonly Kapitelangabe[];
  /** Übungskennungen je geladenem Kapitel; fehlt ein Kapitel, gilt es als ohne Übungen. */
  readonly uebungen: Readonly<Record<number, readonly string[]>>;
  /** Zuletzt geöffnete Abbildung (Merker „zuletzt“), oder null. */
  readonly zuletzt: string | null;
  readonly tagesaufgabeErledigt: boolean;
  readonly jetzt: Date;
}

/** Ein Vorschlag: Satz, Knopf und Ziel. */
export interface Vorschlag {
  /** Kennung der Vorschlagsart, etwa „faellig“. */
  readonly art: string;
  readonly text: Textschluessel;
  readonly werte: Textwerte;
  /** Werte, die selbst Textschlüssel sind (Thema, Trainer); die Karte übersetzt sie. */
  readonly namen?: Readonly<Record<string, Textschluessel>>;
  readonly knopf: Textschluessel;
  readonly ziel: Ansicht;
}

/** Eine Art von Vorschlag; kleiner Rang kommt zuerst. */
export interface Vorschlagsart {
  readonly kennung: string;
  readonly rang: number;
  readonly ermittle: (lage: Lage) => Vorschlag | null;
}

/** So viele Vorschläge zeigt die Karte höchstens: einen und zwei Alternativen. */
export const HOECHSTENS_VORSCHLAEGE = 3;

/**
 * Alle Vorschläge in Rangfolge, höchstens drei.
 *
 * Eingaben: Lage, optional eine eigene Liste von Arten (für Tests).
 * Ausgabe: Vorschläge, der wichtigste zuerst; leer, wenn es nichts vorzuschlagen gibt.
 * Beispiel: 4 fällige Karten, Tagesaufgabe offen, Kapitel 6 halb gelesen →
 * Wiederholen, Tagesaufgabe, Weiterlesen.
 */
export function vorschlaege(
  lage: Lage,
  arten: readonly Vorschlagsart[] = VORSCHLAGSARTEN,
  hoechstens: number = HOECHSTENS_VORSCHLAEGE,
): Vorschlag[] {
  return [...arten]
    .sort((a, b) => a.rang - b.rang)
    .map((art) => art.ermittle(lage))
    .filter((v): v is Vorschlag => v !== null)
    .slice(0, hoechstens);
}

/**
 * Ist die Tagesaufgabe heute schon bearbeitet? Ja, wenn die Serie (Merker) oder das
 * Tagesprotokoll (G2) den heutigen Tag kennt.
 * Beispiel: Serie mit letztem Tag heute → ja; nur gestern → nein.
 */
export function tagesaufgabeHeuteErledigt(
  daten: Nutzerdaten,
  serie: Tagesserie,
  jetzt: Date,
): boolean {
  const heute = tagesschluessel(jetzt);
  return serie.letzterTag === heute || (daten.aktivitaet[heute]?.tagesaufgabe ?? 0) > 0;
}
