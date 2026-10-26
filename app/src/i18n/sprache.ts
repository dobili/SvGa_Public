/**
 * Übersetzungsfunktion der App: liefert sichtbare Texte aus den Sprachdateien.
 *
 * Rolle im Gesamtbild: Kein Oberflächentext steht im Code, alle kommen über `t` aus
 * src/i18n/de.json (Konzept Abschnitt 6.5 und 11.4). Eine zweite Sprache ist eine zweite Datei,
 * eingetragen in SPRACHLADER (AP 18). Die Startsprache folgt der Wahl des Lesers oder der Sprache
 * des Geräts; ein Wechsel benachrichtigt die App (useSprache.ts lässt sie neu zeichnen), und
 * `<html lang>` folgt der Sprache. Nur Deutsch ist fest eingebaut; jede weitere Sprachdatei lädt
 * erst, wenn sie gebraucht wird (ladeSprache, V4, Nutzungsprüfung 25.10.2026).
 * Abhängigkeiten: keine.
 */
import de from "./de.json";

/** Alle Schlüssel der deutschen Sprachdatei. Ein Tippfehler im Schlüssel fällt schon beim Bauen auf. */
export type Textschluessel = keyof typeof de;

/** Werte, die in Platzhalter wie {feld} eingesetzt werden. */
export type Textwerte = Readonly<Record<string, string | number>>;

/** Die Texte einer Sprache, Schlüssel → Text. */
type Sprachtexte = Readonly<Record<string, string>>;

/**
 * Die weiteren Sprachdateien der App, je als eigener Baustein, der erst auf Wunsch lädt (V4: die
 * Sprachdatei ist etwa 76 KB groß, Leser auf Deutsch brauchen sie nie). Der Baustein heißt
 * „sprachpaket-<sprache>“, daran erkennt ihn der Service Worker (sw/dateiliste.ts).
 * Englisch seit 0.2.104 als Vorschau (Wunsch des Autors, 19.10.2026). Seit 0.2.116 auch die 27
 * wörtlichen Buchzitate auf Englisch (EN2, nach gängigen englischen Fassungen) und Englisch auch in
 * der Fassung für die Leser (V1: Der Rest wird vor 1.0 übersetzt, unabhängig vom englischen Buch).
 */
const SPRACHLADER: Readonly<Record<string, () => Promise<Sprachtexte>>> = {
  en: async () => (await import("./sprachpaket-en")).default,
};
/** Alle Sprachen der App in der Reihenfolge der Auswahl. */
const SPRACHEN: readonly string[] = ["de", ...Object.keys(SPRACHLADER)];
/** Die Sprachdateien, die schon geladen sind; Deutsch ist immer da. */
const geladen = new Map<string, Sprachtexte>([["de", de]]);
/**
 * Sprachen, die die App von selbst nach der Sprache des Geräts wählt. Englisch ist Vorschau und
 * muss in den Einstellungen gewählt werden, bis es Buch- und Trainerdaten auf Englisch gibt.
 */
const FERTIGE_SPRACHEN: readonly string[] = ["de"];
/**
 * Sprachen mit eigenen Buchdaten (/daten/<sprache>/a1/); sonst gelten die deutschen. Englisch seit
 * P6 (R25, 23.10.2026): alle Buchdaten übersetzt (pipeline/uebersetzen, inhalte/en/).
 */
const DATENSPRACHEN: readonly string[] = ["de", "en"];
/**
 * Sprachen mit eigenen Trainerdaten (/daten/<sprache>/trainer/) und eigener Eröffnungsliste von
 * Lichess. Englisch seit dem P6-Abschluss (R25, 24.10.2026): Fallennamen aus den englischen
 * Buchdaten (skripte/kopiere-trainerdaten.mjs), Eröffnungsnamen wie bei Lichess.
 */
const TRAINERSPRACHEN: readonly string[] = ["de", "en"];
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
  const vorlage = geladen.get(aktuelleSprache)?.[schluessel] ?? de[schluessel];
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
 * Text mit richtiger Einzahl: bei 1 der Schlüssel „…Eins“, bei 0 „…Null“, wenn es ihn gibt.
 *
 * Warum: „1 Züge“ und „0 eigene Figuren decken“ fielen beim Korrekturlesen auf (19.10.2026).
 * Eingaben: Grundschlüssel (Mehrzahl), die Zahl, die über Einzahl oder Mehrzahl entscheidet,
 * Werte für die Platzhalter. Beispiel: tZahl("denk.minute", 1, { sekunden: 1 }) →
 * „Noch 1 Sekunde nachdenken“.
 */
export function tZahl(schluessel: Textschluessel, zahl: number, werte: Textwerte = {}): string {
  const variante = zahl === 1 ? `${schluessel}Eins` : zahl === 0 ? `${schluessel}Null` : "";
  return t(variante && istTextschluessel(variante) ? variante : schluessel, werte);
}

/**
 * Lädt die Sprachdatei einer Sprache, falls sie noch nicht da ist.
 *
 * Warum: Seit V4 kommt eine weitere Sprache erst, wenn der Leser sie wählt (oder beim Start, wenn
 * er sie gewählt hat). Ohne Netz und ohne gespeichertes Sprachpaket schlägt das fehl; der Aufrufer
 * zeigt dann eine Meldung und bleibt bei der bisherigen Sprache (app/sprachwahl.ts).
 * Eingabe: Sprachcode wie „en“. Ausgabe: erfüllt, sobald setzeSprache die Sprache annimmt.
 * Beispiel: await ladeSprache("en"); setzeSprache("en") → t("abbildung.titel", …) „Fig. 1.26“.
 * Sonderfälle: Deutsch ist immer geladen; ein unbekannter Code oder ein Netzfehler lehnt ab.
 */
export async function ladeSprache(sprachcode: string): Promise<void> {
  if (geladen.has(sprachcode)) return;
  const lade = SPRACHLADER[sprachcode];
  if (!lade) throw new Error(`Unbekannte Sprache: ${sprachcode}`);
  geladen.set(sprachcode, await lade());
}

/** Ist die Sprachdatei dieser Sprache schon geladen? Beispiel: istGeladen("de") → true. */
export function istGeladen(sprachcode: string): boolean {
  return geladen.has(sprachcode);
}

/**
 * Wählt die Sprache der Oberfläche.
 *
 * Warum: Die Sprache wird in der App gewählt (Entscheidung vom 13.10.2026).
 * Eingabe: Sprachcode wie „de“. Unbekannte Codes werden abgelehnt, ebenso Sprachen, deren Datei
 * noch nicht geladen ist (vorher ladeSprache, V4).
 * Ausgabe: true, wenn die Sprache jetzt gilt.
 */
export function setzeSprache(sprachcode: string): boolean {
  if (!geladen.has(sprachcode)) {
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

/** Die Sprachen, in denen es die App gibt (geladen oder nicht), in der Reihenfolge der Auswahl. */
export function verfuegbareSprachen(): string[] {
  return [...SPRACHEN];
}

/**
 * Name einer Sprache in ihr selbst, etwa „Deutsch“ oder „English (preview)“; für die Sprachwahl.
 * Die Namen stehen seit V4 in jeder Sprachdatei gleich (sprache.name.<code>), damit die Auswahl sie
 * zeigen kann, ohne die fremde Sprachdatei zu laden.
 */
export function sprachname(sprachcode: string): string {
  const schluessel = `sprache.name.${sprachcode}`;
  return istTextschluessel(schluessel) ? de[schluessel] : sprachcode;
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
 * Die Sprache der Buchdaten: die der App, wenn es Daten in ihr gibt, sonst Deutsch.
 * Beispiel: App auf Englisch → „en“ (Bildunterschriften, Übungen, Glossar englisch); eine Sprache
 * ohne eigene Daten → „de“ (Züge darin mit den Buchstaben der Sprache, siehe schach/notation.ts).
 */
export function datensprache(): string {
  return DATENSPRACHEN.includes(aktuelleSprache) ? aktuelleSprache : GRUNDSPRACHE;
}

/**
 * Die Sprache der Trainerdaten (Taktik, „Falle oder Köder“, Strukturerkenner, Endspiel): wie
 * datensprache, aber nur für Sprachen mit eigenen Trainerdaten. Beispiel: App auf Englisch → „en“
 * (seit R25), eine Sprache ohne eigene Trainerdaten → „de“.
 */
export function trainerdatensprache(): string {
  return TRAINERSPRACHEN.includes(aktuelleSprache) ? aktuelleSprache : GRUNDSPRACHE;
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
