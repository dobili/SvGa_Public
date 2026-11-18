/**
 * Zugriff auf IndexedDB: eine Datenbank, ein Speicherbereich, ein Eintrag „aktuell“.
 *
 * Rolle im Gesamtbild: Unterste Schicht des Moduls Speicher (Konzept 6.4). Die Nutzerdaten sind
 * klein (einige Kilobyte); ein einziger Eintrag hält sie zusammen und macht jedes Speichern zu
 * einem vollständigen, in sich stimmigen Stand. Beschädigte Daten werden vor dem Überschreiben
 * unter eigenem Schlüssel aufgehoben, damit nichts verloren geht. Neben „aktuell“ liegt eine
 * Schreibmarke: Jedes Schreiben setzt eine neue; so erkennt ein Tab, ob seit seinem letzten Lesen
 * ein anderer geschrieben hat (schreibeAbgeglichen, Fehlertest „zwei Tabs“, 18.11.2026).
 * Abhängigkeiten: idb.
 */
import { openDB, type IDBPDatabase } from "idb";

/** Name der Datenbank; loeschen.ts löscht alle Datenbanken der App, auch diese. */
export const DATENBANK = "schach-von-grund-auf";
/** Version der Datenbankstruktur (nicht des Formats der Nutzerdaten). */
const DATENBANK_VERSION = 1;
const BEREICH = "nutzerdaten";
const AKTUELL = "aktuell";
/** Schlüssel der Schreibmarke neben dem Stand. */
const MARKE = "marke";

/** Eine neue, zufällige Schreibmarke. */
function neueMarke(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

let verbindung: Promise<IDBPDatabase> | null = null;

function oeffne(): Promise<IDBPDatabase> {
  verbindung ??= openDB(DATENBANK, DATENBANK_VERSION, {
    upgrade(datenbank) {
      if (!datenbank.objectStoreNames.contains(BEREICH)) {
        datenbank.createObjectStore(BEREICH);
      }
    },
    // Löscht ein anderer Tab die Datenbank (Alle Daten löschen), gibt dieser Tab sie frei.
    blocking() {
      void verbindung?.then((offen) => offen.close());
      verbindung = null;
    },
  });
  return verbindung;
}

/** Liest den gespeicherten Stand; undefined beim ersten Start. */
export async function liesRoh(): Promise<unknown> {
  const datenbank = await oeffne();
  return datenbank.get(BEREICH, AKTUELL);
}

/** Schreibt den Stand vollständig; ein Fehler kommt beim Aufrufer an (Konzept 9.4). */
export async function schreibeRoh(daten: unknown): Promise<string> {
  const datenbank = await oeffne();
  const vorgang = datenbank.transaction(BEREICH, "readwrite");
  const marke = neueMarke();
  await Promise.all([vorgang.store.put(daten, AKTUELL), vorgang.store.put(marke, MARKE)]);
  await vorgang.done;
  return marke;
}

/** Liest Stand und Schreibmarke in einem Vorgang (Marke undefined: vor dem 18.11.2026 geschrieben). */
export async function liesMitMarke(): Promise<{ roh: unknown; marke: unknown }> {
  const datenbank = await oeffne();
  const vorgang = datenbank.transaction(BEREICH, "readonly");
  const [roh, marke] = await Promise.all([vorgang.store.get(AKTUELL), vorgang.store.get(MARKE)]);
  await vorgang.done;
  return { roh, marke };
}

/**
 * Schreibt einen Stand nur, wenn seit dem letzten Lesen niemand anders geschrieben hat; sonst
 * schreibt sie, was `abgleich` aus dem fremden Stand macht. Lesen und Schreiben liegen in einem
 * Vorgang, dazwischen schreibt kein anderer Tab.
 *
 * Warum: Tab B schrieb nach dem Einlesen einer Partie laufend Ergebnisse der Auswertung und
 * überschrieb dabei einen Zug, den Tab A gerade in einer Variante gespeichert hatte.
 * Eingaben: die Marke, die der Tab kennt, der neue Stand, `abgleich` (synchron, erhält den fremden
 * Stand). Ausgabe: der geschriebene Stand und die neue Marke.
 * Beispiel: Marke unverändert → `neu`; fremde Marke → abgleich(fremder Stand).
 */
export async function schreibeAbgeglichen(
  bekannt: unknown,
  neu: unknown,
  abgleich: (fremd: unknown) => unknown,
): Promise<{ geschrieben: unknown; marke: string }> {
  const datenbank = await oeffne();
  const vorgang = datenbank.transaction(BEREICH, "readwrite");
  const [roh, marke] = await Promise.all([vorgang.store.get(AKTUELL), vorgang.store.get(MARKE)]);
  const geschrieben = roh === undefined || marke === bekannt ? neu : abgleich(roh);
  const neueMarkeJetzt = neueMarke();
  await Promise.all([
    vorgang.store.put(geschrieben, AKTUELL),
    vorgang.store.put(neueMarkeJetzt, MARKE),
  ]);
  await vorgang.done;
  return { geschrieben, marke: neueMarkeJetzt };
}

/**
 * Hebt unlesbare Daten unter „defekt-<Zeitpunkt>“ auf, bevor neue Daten sie überschreiben.
 *
 * Sonderfall: Daten aus einer neueren App (nach dem Zurückgehen auf eine ältere Version) bleiben
 * so erhalten und lassen sich nach dem nächsten Update von Hand wiederherstellen.
 */
export async function hebeAuf(daten: unknown, jetzt: Date): Promise<void> {
  const datenbank = await oeffne();
  await datenbank.put(BEREICH, daten, `defekt-${jetzt.toISOString()}`);
}

/** Schließt die Verbindung (Tests und Alle Daten löschen). */
export async function schliesse(): Promise<void> {
  const offen = verbindung;
  verbindung = null;
  if (offen) (await offen).close();
}
