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

/** Alle Schlüssel der deutschen Sprachdatei. Ein Tippfehler im Schlüssel fällt schon beim Bauen auf. */
export type Textschluessel = keyof typeof de;

/** Werte, die in Platzhalter wie {feld} eingesetzt werden. */
export type Textwerte = Readonly<Record<string, string | number>>;

/** Die Sprachdateien der App. Englisch kommt mit AP 18 als en.json dazu. */
const SPRACHDATEIEN: Readonly<Record<string, Readonly<Record<string, string>>>> = { de };
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
