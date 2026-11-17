/**
 * Zustände für Oberflächentests direkt in den Speicher der App schreiben (Vortest der offenen
 * Testpunkte, 17.11.2026). Warum: Viele Punkte des Autors brauchen einen Stand, der sich durch
 * Bedienen nur mühsam herstellen lässt (ganze Kapitel gelesen, 200 fällige Karten, viele
 * ausgewertete Partien). Die Hilfe liest die Nutzerdaten aus IndexedDB, legt die übergebenen
 * Felder darüber (oberste Ebene, flach) und lädt die App neu.
 * Abbildungsnummern je Kapitel kommen aus den erzeugten Buchdaten (public/daten/de/a1).
 */
import { readFileSync } from "node:fs";
import { expect, type Page } from "@playwright/test";

/** Abbildungsnummern eines Kapitels aus den Buchdaten, etwa „2.1“ bis „2.153“. */
export function abbildungenVon(kapitel: number): string[] {
  const datei = new URL(
    `../../public/daten/de/a1/kap${String(kapitel).padStart(2, "0")}.json`,
    import.meta.url,
  );
  const daten = JSON.parse(readFileSync(datei, "utf-8")) as { abbildungen: { id: string }[] };
  return daten.abbildungen.map((a) => a.id);
}

/** Ein Stand „gesehen“ (Abbildung → Datum) für ganze Kapitel und einzelne Abbildungen. */
export function gesehenFuer(kapitel: readonly number[], einzeln: readonly string[] = []) {
  const datum = "2026-11-10T09:00:00.000Z";
  const nummern = [...kapitel.flatMap(abbildungenVon), ...einzeln];
  return Object.fromEntries(nummern.map((n) => [n, datum]));
}

/** Legt Felder über die gespeicherten Nutzerdaten; false, solange die App nichts gespeichert hat. */
function ueberschreibe(teil: Record<string, unknown>): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const neu: Record<string, unknown> = { ...alt };
        for (const [schluessel, wert] of Object.entries(teil)) {
          const vorher = alt[schluessel];
          const beideObjekte =
            typeof wert === "object" &&
            wert !== null &&
            !Array.isArray(wert) &&
            typeof vorher === "object" &&
            vorher !== null &&
            !Array.isArray(vorher);
          neu[schluessel] = beideObjekte ? { ...vorher, ...wert } : wert;
        }
        const schreiben = bereich.put(neu, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/**
 * Setzt Felder der Nutzerdaten (eine Ebene tief zusammengeführt, etwa fortschritt.gesehen ersetzt
 * nur „gesehen“) und lädt neu. Vorher muss die App einmal gestartet sein (starteImBrowser).
 */
export async function setzeDaten(seite: Page, teil: Record<string, unknown>): Promise<void> {
  await expect.poll(() => seite.evaluate(ueberschreibe, teil)).toBe(true);
  await seite.reload();
}

/** Liest die gespeicherten Nutzerdaten (für Prüfungen nach einer Bedienung). */
export function liesDaten(seite: Page): Promise<Record<string, unknown>> {
  return seite.evaluate(
    () =>
      new Promise<Record<string, unknown>>((fertig, fehler) => {
        const anfrage = indexedDB.open("schach-von-grund-auf");
        anfrage.onerror = () => fehler(anfrage.error);
        anfrage.onsuccess = () => {
          const db = anfrage.result;
          const lesen = db.transaction("nutzerdaten").objectStore("nutzerdaten").get("aktuell");
          lesen.onsuccess = () => {
            db.close();
            fertig(lesen.result as Record<string, unknown>);
          };
        };
      }),
  );
}
