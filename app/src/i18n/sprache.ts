/**
 * Übersetzungsfunktion der App: liefert sichtbare Texte aus den Sprachdateien.
 *
 * Rolle im Gesamtbild: Kein Oberflächentext steht im Code, alle kommen über `t` aus
 * src/i18n/de.json (Konzept Abschnitt 6.5 und 11.4). Eine zweite Sprache ist eine zweite Datei,
 * eingetragen in SPRACHDATEIEN (AP 18). Seit 0.2.94 die Technik dafür: Startsprache nach Wahl des
 * Lesers oder nach der Sprache des Geräts, Wechsel mit Benachrichtigung (useSprache.ts lässt die
 * App neu zeichnen), `<html lang>` folgt der Sprache.
 * Abhängigkeiten: keine.
 */
import de from "./de.json";
import en from "./en.json";

/** Alle Schlüssel der deutschen Sprachdatei. Ein Tippfehler im Schlüssel fällt schon beim Bauen auf. */
export type Textschluessel = keyof typeof de;

/** Werte, die in Platzhalter wie {feld} eingesetzt werden. */
export type Textwerte = Readonly<Record<string, string | number>>;

/**
 * Die Sprachdateien der App. Englisch seit 0.2.104 als Vorschau (Wunsch des Autors, 19.10.2026):
 * Wörtliche Buchzitate fehlen in en.json und erscheinen deutsch, bis es die englische Fassung
 * des Autors gibt (Liste in en.buchzitate.json). In der Fassung für die Leser (AP 17,
 * VEROEFFENTLICHUNG=1) fehlt die Vorschau; dann steht in den Einstellungen nur „Deutsch“.
 */
const SPRACHDATEIEN: Readonly<Record<string, Readonly<Record<string, string>>>> =
  __VEROEFFENTLICHUNG__ ? { de } : { de, en };
/**
 * Sprachen, die die App von selbst nach der Sprache des Geräts wählt. Englisch ist Vorschau und
 * muss in den Einstellungen gewählt werden, bis es Buch- und Trainerdaten auf Englisch gibt.
 */
const FERTIGE_SPRACHEN: readonly string[] = ["de"];
/** Sprachen mit eigenen Buch- und Trainerdaten (/daten/<sprache>/); sonst gelten die deutschen. */
const DATENSPRACHEN: readonly string[] = ["de"];
/** Sprache, wenn weder der Leser noch das Gerät eine verfügbare wählt. */
export const GRUNDSPRACHE = "de";

let aktuelleSprache = GRUNDSPRACHE;
const hoerer = new Set<() => void>();

/**
 * Liefert den Text zu einem Schlüssel in der aktuellen Sprache.
 *
 * Warum: Oberflächentexte gehören nicht in den Code, damit Englisch später ohne Codeänderung
 * dazukommt. Fehlt ein Text in einer Sprache, erscheint der deutsche.
 * Eingaben: Schlüssel, optional Werte für Platzhalter in geschweiften Klammern.
 * Ausgabe: fertiger Text.
 * Beispiel: t("zaehlen.titel", { feld: "d4" }) → „Feld d4 zählen“ (Abb. 1.26).
 * Sonderfälle: Ein Platzhalter ohne Wert bleibt sichtbar stehen, damit der Fehler auffällt.
 */
export function t(schluessel: Textschluessel, werte: Textwerte = {}): string {
  const vorlage = SPRACHDATEIEN[aktuelleSprache]?.[schluessel] ?? de[schluessel];
  return vorlage.replace(/\{(\w+)\}/g, (ganz, name: string) => {
    const wert = werte[name];
    return wert === undefined ? ganz : String(wert);
  });
}

/**
 * Gibt es diesen Schlüssel in der deutschen Sprachdatei?
 *
 * Warum: Manche Texte gibt es nur für einen Teil der Werkzeuge (etwa die Legende der Markierungen);
 * ein zusammengesetzter Schlüssel wird vorher geprüft, statt einen leeren Text zu zeigen.
 * Beispiel: istTextschluessel("werkzeug.k1-roentgen.legende") → true.
 */
export function istTextschluessel(schluessel: string): schluessel is Textschluessel {
  return schluessel in de;
}

/**
 * Wählt die Sprache der Oberfläche.
 *
 * Warum: Die Sprache wird in der App gewählt (Entscheidung vom 13.10.2026).
 * Eingabe: Sprachcode wie „de“. Unbekannte Codes werden abgelehnt.
 * Ausgabe: true, wenn die Sprache verfügbar ist.
 */
export function setzeSprache(sprachcode: string): boolean {
  if (!(sprachcode in SPRACHDATEIEN)) {
    return false;
  }
  if (sprachcode === aktuelleSprache) return true;
  aktuelleSprache = sprachcode;
  if (typeof document !== "undefined") document.documentElement.lang = sprachcode;
  hoerer.forEach((melde) => melde());
  return true;
}

/** Meldet jeden Sprachwechsel; Ausgabe: Abmeldung. Für useSprache (React). */
export function beiSprachwechsel(melde: () => void): () => void {
  hoerer.add(melde);
  return () => hoerer.delete(melde);
}

/** Die Sprachen, in denen es die App gibt, in der Reihenfolge der Sprachdateien. */
export function verfuegbareSprachen(): string[] {
  return Object.keys(SPRACHDATEIEN);
}

/** Name einer Sprache in ihr selbst, etwa „Deutsch“; für die Sprachwahl. */
export function sprachname(sprachcode: string): string {
  return SPRACHDATEIEN[sprachcode]?.["sprache.eigenname"] ?? sprachcode;
}

/**
 * Die Sprache beim Start.
 *
 * Warum: Voreinstellung ist die Sprache des Geräts (Auftrag des Autors, 18.10.2026); wer selbst
 * gewählt hat, behält seine Wahl.
 * Eingaben: gemerkte Wahl des Lesers (oder null), Sprachen des Geräts in Vorzugsreihenfolge
 * (navigator.languages, etwa „en-GB“), verfügbare Sprachen.
 * Ausgabe: verfügbarer Sprachcode. Beispiel: (null, ["en-US", "de-DE"], ["de", "en"]) → „en“;
 * („de“, ["en-US"], ["de", "en"]) → „de“; (null, ["fr-FR"], ["de"]) → „de“.
 */
export function startsprache(
  gewaehlt: string | null,
  geraet: readonly string[],
  verfuegbar: readonly string[] = verfuegbareSprachen(),
): string {
  if (gewaehlt && verfuegbar.includes(gewaehlt)) return gewaehlt;
  const passend = geraet
    .map((code) => code.toLowerCase().split("-")[0] ?? "")
    .find((code) => verfuegbar.includes(code));
  return (
    passend ?? (verfuegbar.includes(GRUNDSPRACHE) ? GRUNDSPRACHE : (verfuegbar[0] ?? GRUNDSPRACHE))
  );
}

/** Die Sprache, in der gerade alle Texte erscheinen. */
export function sprache(): string {
  return aktuelleSprache;
}

/** Die Sprachen, die beim Start nach dem Gerät gewählt werden (nicht die Vorschau-Sprachen). */
export function fertigeSprachen(): string[] {
  return verfuegbareSprachen().filter((code) => FERTIGE_SPRACHEN.includes(code));
}

/**
 * Die Sprache der Buch- und Trainerdaten: die der App, wenn es Daten in ihr gibt, sonst Deutsch.
 * Beispiel: App auf Englisch, noch ohne /daten/en/ → „de“ (Bildunterschriften deutsch, Züge darin
 * mit englischen Buchstaben, siehe schach/notation.ts).
 */
export function datensprache(): string {
  return DATENSPRACHEN.includes(aktuelleSprache) ? aktuelleSprache : GRUNDSPRACHE;
}

/** Gebietsschema für Zahlen und Daten je Sprache. */
const GEBIETSSCHEMA: Readonly<Record<string, string>> = { de: "de-DE", en: "en-US" };
const zahlformate = new Map<string, Intl.NumberFormat>();

/**
 * Eine Zahl mit fester Zahl an Nachkommastellen im Format der Sprache.
 * Beispiel: zahlText(1.25, 1) → „1,3“ auf Deutsch, „1.3“ auf Englisch (Bauerneinheiten, Kapitel 1).
 * Sonderfall: fest = false lässt Nullen am Ende weg (zahlText(3, 1, false) → „3“).
 */
export function zahlText(zahl: number, nachkommastellen: number, fest = true): string {
  const mindestens = fest ? nachkommastellen : 0;
  const schluessel = `${aktuelleSprache}:${mindestens}:${nachkommastellen}`;
  let format = zahlformate.get(schluessel);
  if (!format) {
    // Ein Formatierer je Sprache und Stellenzahl: neu anlegen ist teuer, die Werkzeuge rufen
    // zahlText auf jeder Abbildung oft auf.
    format = new Intl.NumberFormat(GEBIETSSCHEMA[aktuelleSprache] ?? "de-DE", {
      minimumFractionDigits: mindestens,
      maximumFractionDigits: nachkommastellen,
      useGrouping: false,
    });
    zahlformate.set(schluessel, format);
  }
  return format.format(zahl);
}

/** Ein Datum im Format der Sprache, etwa „19.10.2026“ oder „10/19/2026“. */
export function datumText(datum: Date): string {
  return datum.toLocaleDateString(GEBIETSSCHEMA[aktuelleSprache] ?? "de-DE");
}

/** Figurenbuchstaben je Sprache für die Notation (Konzept Abschnitt 6.5). */
const FIGURENBUCHSTABEN: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  de: { K: "K", Q: "D", R: "T", B: "L", N: "S" },
  en: { K: "K", Q: "Q", R: "R", B: "B", N: "N" },
};

/**
 * Liefert die Figurenbuchstaben der Notation für eine Sprache.
 *
 * Warum: Das Buch schreibt deutsch (K, D, T, L, S), die Schachbibliothek englisch.
 * Eingabe: Sprachcode. Ausgabe: Zuordnung englischer Buchstabe → Buchstabe der Sprache.
 * Beispiel: figurenbuchstaben("de").Q → „D“ wie in „5... Db6“ (Abb. 1.26).
 */
export function figurenbuchstaben(sprachcode: string): Readonly<Record<string, string>> {
  return FIGURENBUCHSTABEN[sprachcode] ?? FIGURENBUCHSTABEN.de ?? {};
}
