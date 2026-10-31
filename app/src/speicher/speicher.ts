/**
 * Der Speicher der App: Nutzerdaten laden, ändern, sofort speichern, Fehler sichtbar machen.
 *
 * Rolle im Gesamtbild: Modul Speicher aus Konzept 6.4 (lade, speichere, bitteUmDauerhaftenSpeicher;
 * exportiere und importiere stehen in sicherung.ts). Einstellungen, Lernstand und Fortschritt
 * lesen und schreiben ausschließlich hierüber. Regeln aus Konzept 9.4: speichern nach jeder
 * Antwort, um dauerhaften Speicher bitten (seit V8, Nutzungsprüfung 25.10.2026, bei jedem Start,
 * solange der Browser ihn nicht gewährt hat), Fehler dem Leser zeigen, ältere Formate umwandeln. Komponenten abonnieren den Stand mit useSpeicher.
 * Abhängigkeiten: speicher/datenbank.ts, speicher/format.ts, app/merker.ts, React.
 */
import { useSyncExternalStore } from "react";
import { entferneMerker, liesMerker } from "../app/merker";
import { hebeAuf, liesRoh, schreibeRoh } from "./datenbank";
import { leereDaten, wandleUm, type Nutzerdaten } from "./format";
import { merkerAlsFormat0 } from "./format0";
import { mitMerkerRekorden } from "./rekordmerker";

/** Was beim Laden oder Speichern schiefging, für den Hinweis an den Leser. */
export interface Speicherfehler {
  /** „laden“: kein Zugriff auf den Speicher; „speichern“: der letzte Stand fehlt auf dem
   * Gerät; „neuer“ und „kaputt“: gespeicherte Daten unlesbar, aufgehoben, Neubeginn. */
  readonly art: "laden" | "speichern" | "neuer" | "kaputt";
  readonly meldung: string;
}

export interface Speicherzustand {
  readonly daten: Nutzerdaten;
  readonly geladen: boolean;
  readonly fehler: Speicherfehler | null;
  /** Ergebnis der Bitte um dauerhaften Speicher (null: nicht gefragt oder nicht möglich). */
  readonly dauerhaft: boolean | null;
}

/** Merker der Versionen 0.2.x, die beim ersten Laden in den Speicher umziehen. */
const ALTE_MERKER = ["einstellungen", "lernstand"] as const;

/** Vorläufiger Stand bis zum Laden: die alten Merker, sonst leer (kein Aufblitzen alter Farben). */
function vorlaeufig(): Nutzerdaten {
  const roh = merkerAlsFormat0(liesMerker("einstellungen"), liesMerker("lernstand"));
  const ergebnis = wandleUm(roh, new Date());
  return ergebnis.ok ? ergebnis.daten : leereDaten(new Date());
}

let zustand: Speicherzustand = {
  daten: vorlaeufig(),
  geladen: false,
  fehler: null,
  dauerhaft: null,
};
const abonnenten = new Set<() => void>();
let ladevorgang: Promise<void> | null = null;
/** Schreibvorgänge nacheinander, damit ein älterer Stand nie einen neueren überholt. */
let schreibkette: Promise<void> = Promise.resolve();

function setze(teil: Partial<Speicherzustand>): void {
  zustand = { ...zustand, ...teil };
  abonnenten.forEach((abonnent) => abonnent());
}

function alsMeldung(fehler: unknown): string {
  return fehler instanceof Error ? `${fehler.name}: ${fehler.message}` : String(fehler);
}

/**
 * Bittet den Browser, die Daten nicht bei Speichermangel zu löschen.
 *
 * Warum: Ohne diese Bitte darf vor allem Safari die Daten einer Web-App nach Wochen ohne Nutzung
 * entfernen (Konzept 9.4). Ausgabe: true (gewährt), false (abgelehnt), null (nicht möglich).
 * Sonderfall: Chrome entscheidet ohne Rückfrage nach Nutzung und Installation.
 */
export async function bitteUmDauerhaftenSpeicher(): Promise<boolean | null> {
  if (typeof navigator === "undefined" || typeof navigator.storage?.persist !== "function") {
    return null;
  }
  try {
    const gewaehrt = await navigator.storage.persist();
    setze({ dauerhaft: gewaehrt });
    return gewaehrt;
  } catch (fehler) {
    console.warn("Bitte um dauerhaften Speicher fehlgeschlagen:", fehler);
    return null;
  }
}

/**
 * Bittet bei jedem Start um dauerhaften Speicher, solange der Browser ihn nicht gewährt hat.
 *
 * Warum (V8): Bis 0.2.129 fragte die App nur beim allerersten Start. Lehnte der Browser damals
 * ab (etwa weil die App noch nicht installiert war), blieb es dabei. Chrome und Safari entscheiden
 * nach Nutzung und Installation; eine spätere Bitte hat also oft Erfolg.
 * Ausgabe: true (dauerhaft), false (abgelehnt), null (nicht möglich). Steht auch im Zustand
 * („dauerhaft“), damit die Anzeige in den Einstellungen sich erneuert.
 * Beispiel: App inzwischen auf dem Home-Bildschirm → persisted() false, persist() true.
 * Sonderfall: Ist der Speicher schon dauerhaft, fragt die App nicht noch einmal.
 */
export async function sichereDauerhaftenSpeicher(): Promise<boolean | null> {
  if (typeof navigator === "undefined" || typeof navigator.storage?.persisted !== "function") {
    return bitteUmDauerhaftenSpeicher();
  }
  try {
    if (await navigator.storage.persisted()) {
      setze({ dauerhaft: true });
      return true;
    }
  } catch (fehler) {
    console.warn("Dauerhafter Speicher nicht abfragbar:", fehler);
  }
  return bitteUmDauerhaftenSpeicher();
}

/** Erster Start: die alten Merker übernehmen, schreiben, danach die Merker entfernen. */
async function ersterStart(jetzt: Date): Promise<Nutzerdaten> {
  const roh = merkerAlsFormat0(liesMerker("einstellungen"), liesMerker("lernstand"));
  const ergebnis = wandleUm(roh, jetzt);
  const daten = ergebnis.ok ? ergebnis.daten : leereDaten(jetzt);
  await schreibeRoh(daten);
  ALTE_MERKER.forEach(entferneMerker);
  return daten;
}

async function ladeJetzt(jetzt: Date): Promise<void> {
  try {
    const roh = await liesRoh();
    if (roh === undefined) {
      setze({ daten: await ersterStart(jetzt), geladen: true });
      return;
    }
    const ergebnis = wandleUm(roh, jetzt);
    if (ergebnis.ok) {
      // Bestwerte aus Merkern in die Rekorde (Format 7), damit sie in die Sicherung kommen.
      const daten = mitMerkerRekorden(
        ergebnis.daten,
        liesMerker("taktikzeitBeste"),
        liesMerker("tagesserie"),
        jetzt,
      );
      // Ein älteres Format (oder ein neuer Rekord aus den Merkern) wird sofort gespeichert.
      if (ergebnis.vonVersion !== daten.schemaVersion || daten !== ergebnis.daten)
        await schreibeRoh(daten);
      setze({ daten, geladen: true });
      return;
    }
    await hebeAuf(roh, jetzt);
    const meldung = ergebnis.grund === "neuer" ? `Format ${ergebnis.version ?? "?"}` : "";
    setze({ daten: leereDaten(jetzt), geladen: true, fehler: { art: ergebnis.grund, meldung } });
  } catch (fehler) {
    console.error("Speicher nicht lesbar:", fehler);
    setze({ geladen: true, fehler: { art: "laden", meldung: alsMeldung(fehler) } });
  }
}

/**
 * Lädt die Nutzerdaten (einmal je Sitzung, weitere Aufrufe warten auf denselben Vorgang).
 *
 * Warum: Beim Start muss der Stand des Lesers da sein, bevor er etwas ändert. Danach bittet sie
 * nebenher um dauerhaften Speicher (sichereDauerhaftenSpeicher, V8).
 * Ausgabe: erfüllt, sobald geladen; Fehler stehen im Zustand, nie als Ausnahme.
 * Beispiel: Erster Start nach Version 0.2.20 mit Holzbrett → aktuelles Format mit Holzbrett,
 * Merker weg.
 * Sonderfälle: Kein IndexedDB (sehr alte Browser, gesperrte Website-Daten) → Fehler „laden“,
 * die App läuft mit dem vorläufigen Stand weiter.
 */
export function lade(jetzt: Date = new Date()): Promise<void> {
  if (!ladevorgang) {
    ladevorgang = ladeJetzt(jetzt);
    // Nebenher und ohne zu warten: Firefox fragt den Leser, das darf das Laden nicht aufhalten.
    void ladevorgang.then(sichereDauerhaftenSpeicher);
  }
  return ladevorgang;
}

/**
 * Setzt einen neuen Stand und schreibt ihn sofort.
 *
 * Warum: „Nach jeder Antwort wird gespeichert“ (Konzept 9.4). Ausgabe: true, wenn geschrieben.
 * Sonderfall: Ein Fehler erscheint als Hinweis „speichern“; der Stand bleibt in der Sitzung,
 * der nächste erfolgreiche Schreibvorgang nimmt den Hinweis zurück.
 */
export function speichere(daten: Nutzerdaten): Promise<boolean> {
  setze({ daten });
  const vorgang = schreibkette.then(async () => {
    try {
      await schreibeRoh(zustand.daten);
      if (zustand.fehler?.art === "speichern") setze({ fehler: null });
      return true;
    } catch (fehler) {
      console.error("Speichern fehlgeschlagen:", fehler);
      setze({ fehler: { art: "speichern", meldung: alsMeldung(fehler) } });
      return false;
    }
  });
  schreibkette = vorgang.then(() => undefined);
  return vorgang;
}

/**
 * Ändert die Nutzerdaten mit einer reinen Funktion und speichert sofort.
 *
 * Sonderfälle: Vor dem Laden wartet die Änderung auf den geladenen Stand, damit das Laden sie
 * nicht überschreibt. Gibt die Funktion dieselben Daten zurück (etwa eine schon gesehene
 * Abbildung), wird nichts geschrieben.
 */
export function aendere(aenderung: (daten: Nutzerdaten) => Nutzerdaten): Promise<boolean> {
  const anwenden = () => {
    const neu = aenderung(zustand.daten);
    return neu === zustand.daten ? Promise.resolve(true) : speichere(neu);
  };
  return zustand.geladen ? anwenden() : lade().then(anwenden);
}

/**
 * Vergisst den Stand der Sitzung nach „Alle Daten löschen“, ohne etwas zu schreiben.
 *
 * Sonderfall: Ändert der Leser danach noch etwas, legt das Speichern die Datenbank neu an.
 */
export function vergiss(jetzt: Date = new Date()): void {
  setze({ daten: leereDaten(jetzt), fehler: null });
}

/** Der aktuelle Zustand außerhalb von React (Export, Tests). */
export function speicherzustand(): Speicherzustand {
  return zustand;
}

function abonniere(abonnent: () => void): () => void {
  abonnenten.add(abonnent);
  return () => abonnenten.delete(abonnent);
}

/**
 * Abonniert einen Teil des Speichers in einer Komponente.
 *
 * Eingabe: Auswahl, die einen unveränderten Teil unverändert zurückgibt (etwa
 * `(z) => z.daten.einstellungen`). Beispiel: useSpeicher((z) => z.daten.fortschritt).
 */
export function useSpeicher<T>(auswahl: (zustand: Speicherzustand) => T): T {
  return useSyncExternalStore(abonniere, () => auswahl(zustand));
}
