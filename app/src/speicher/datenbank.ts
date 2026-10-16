/**
 * Zugriff auf IndexedDB: eine Datenbank, ein Speicherbereich, ein Eintrag „aktuell“.
 *
 * Rolle im Gesamtbild: Unterste Schicht des Moduls Speicher (Konzept 6.4). Die Nutzerdaten sind
 * klein (einige Kilobyte); ein einziger Eintrag hält sie zusammen und macht jedes Speichern zu
 * einem vollständigen, in sich stimmigen Stand. Beschädigte Daten werden vor dem Überschreiben
 * unter eigenem Schlüssel aufgehoben, damit nichts verloren geht.
 * Abhängigkeiten: idb.
 */
import { openDB, type IDBPDatabase } from "idb";

/** Name der Datenbank; loeschen.ts löscht alle Datenbanken der App, auch diese. */
export const DATENBANK = "schach-von-grund-auf";
/** Version der Datenbankstruktur (nicht des Formats der Nutzerdaten). */
const DATENBANK_VERSION = 1;
const BEREICH = "nutzerdaten";
const AKTUELL = "aktuell";

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
export async function schreibeRoh(daten: unknown): Promise<void> {
  const datenbank = await oeffne();
  await datenbank.put(BEREICH, daten, AKTUELL);
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
