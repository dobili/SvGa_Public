/**
 * Sprachwahl der App: Startsprache, Wechsel durch den Leser, Abonnement für React.
 *
 * Rolle im Gesamtbild: Technik für die englische Fassung (AP 18). Die Wahl des Lesers liegt als
 * Merker auf dem Gerät (wie Koordinaten und Wischen): Sie muss beim Start sofort da sein, bevor
 * die Nutzerdaten aus IndexedDB geladen sind, und folgt ohne Wahl der Sprache des Geräts. Ein
 * Wechsel vergisst die geladenen Buch- und Trainerdaten; App.tsx zeichnet die ganze Oberfläche
 * neu, sodass jeder Bildschirm die Daten der neuen Sprache lädt.
 * Eine weitere Sprache lädt erst bei der Wahl (V4, Nutzungsprüfung 25.10.2026): Sprachdatei und
 * Sprachpaket (Buch- und Trainerdaten) kommen beim ersten Mal aus dem Netz. Ohne Netz und ohne
 * vollständiges Paket bleibt die App bei der bisherigen Sprache und meldet das, statt halb
 * englisch zu sein.
 * Abhängigkeiten: i18n/sprache.ts, app/merker.ts, app/sprachpaket.ts, daten/laden.ts,
 * daten/trainerdaten.ts, React.
 */
import { useSyncExternalStore } from "react";
import { vergissBuchdaten } from "../daten/laden";
import { vergissTrainerdaten } from "../daten/trainerdaten";
import {
  beiSprachwechsel,
  fertigeSprachen,
  GRUNDSPRACHE,
  istGeladen,
  ladeSprache,
  setzeSprache,
  sprache,
  startsprache,
  verfuegbareSprachen,
} from "../i18n/sprache";
import { liesMerker, schreibeMerker } from "./merker";
import { ladeSprachpaket, sprachpaketVollstaendig } from "./sprachpaket";

/** Name des Merkers mit der Wahl des Lesers; fehlt er, gilt die Sprache des Geräts. */
export const MERKER_SPRACHE = "sprache";

/** Ausgang eines Sprachwechsels: gewechselt oder ohne Netz bei der bisherigen Sprache geblieben. */
export type Sprachwechsel = "gewechselt" | "ohneNetz";

/** Konnte die gewählte Sprache beim Start nicht laden (ohne Netz), gilt Deutsch; das merkt sich dies. */
let startOhneNetz = false;

/** Die Sprachen des Geräts in Vorzugsreihenfolge (ohne Angabe: keine). */
function geraetesprachen(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages.length > 0 ? navigator.languages : [navigator.language];
}

/** Bittet im Hintergrund um das ganze Sprachpaket, damit die Sprache danach offline geht. */
function vervollstaendigePaket(sprachcode: string): void {
  if (sprachcode === GRUNDSPRACHE) return;
  ladeSprachpaket(sprachcode).catch((fehler: unknown) =>
    console.warn(`Sprachpaket ${sprachcode} nicht nachgeladen:`, fehler),
  );
}

/**
 * Setzt beim Start die Sprache (Wahl des Lesers, sonst Gerät) und `<html lang>`. Nach dem Gerät
 * gelten nur fertige Sprachen; die englische Vorschau gibt es nur auf Wahl (seit 0.2.104).
 *
 * Warum asynchron: Seit V4 muss eine gewählte weitere Sprache erst ihre Sprachdatei laden; main.tsx
 * zeichnet die App erst danach, damit sie nicht kurz deutsch erscheint. Für Deutsch ist das Ergebnis
 * sofort da.
 * Sonderfall: Lädt die Sprachdatei nicht (ohne Netz, Paket nie geladen), gilt für diesen Start
 * Deutsch; die Wahl bleibt gemerkt, und die Sprachwahl zeigt den Grund (startOhneNetzGewesen).
 */
export async function starteSprache(): Promise<void> {
  const gewaehlt = liesMerker(MERKER_SPRACHE);
  const wahlGilt = gewaehlt !== null && verfuegbareSprachen().includes(gewaehlt);
  let ziel = wahlGilt ? gewaehlt : startsprache(null, geraetesprachen(), fertigeSprachen());
  if (!istGeladen(ziel)) {
    try {
      await ladeSprache(ziel);
    } catch (fehler) {
      console.warn(`Sprache ${ziel} beim Start nicht geladen, Deutsch gilt:`, fehler);
      startOhneNetz = true;
      ziel = GRUNDSPRACHE;
    }
  }
  vervollstaendigePaket(ziel);
  setzeSprache(ziel);
  document.documentElement.lang = sprache();
}

/** War die gewählte Sprache beim Start nicht ladbar? Dann zeigt die Sprachwahl den Hinweis. */
export function startOhneNetzGewesen(): boolean {
  return startOhneNetz;
}

/** Darf der Wechsel versucht werden? Ohne Netz nur mit vollständigem Paket auf dem Gerät. */
async function wechselMoeglich(sprachcode: string): Promise<boolean> {
  if (typeof navigator === "undefined" || navigator.onLine) return true;
  return (await sprachpaketVollstaendig(sprachcode)) === true;
}

/**
 * Wechselt die Sprache auf Wunsch des Lesers und merkt die Wahl.
 *
 * Warum: Seit V4 kommt eine weitere Sprache erst bei der Wahl aus dem Netz (etwa 6 MB, die Leser
 * auf Deutsch nie brauchen). Gelingt das nicht, bleibt alles bei der bisherigen Sprache.
 * Eingabe: Sprachcode. Ausgabe: „gewechselt“ oder „ohneNetz“ (Sprachwahl zeigt die Meldung).
 * Beispiel: „en“ mit Netz → Texte, Buchdaten und `<html lang="en">` auf Englisch, das Paket lädt im
 * Hintergrund nach; „en“ im Flugmodus vor dem ersten Laden → „ohneNetz“, die App bleibt deutsch.
 */
export async function waehleSprache(sprachcode: string): Promise<Sprachwechsel> {
  if (!istGeladen(sprachcode)) {
    if (!(await wechselMoeglich(sprachcode))) return "ohneNetz";
    try {
      await ladeSprache(sprachcode);
    } catch (fehler) {
      console.warn(`Sprache ${sprachcode} nicht geladen:`, fehler);
      return "ohneNetz";
    }
  }
  vervollstaendigePaket(sprachcode);
  schreibeMerker(MERKER_SPRACHE, sprachcode);
  vergissBuchdaten();
  vergissTrainerdaten();
  setzeSprache(sprachcode);
  startOhneNetz = false;
  return "gewechselt";
}

/** Die Sprache der App; die Komponente zeichnet sich bei einem Wechsel neu. */
export function useSprache(): string {
  return useSyncExternalStore(beiSprachwechsel, sprache, sprache);
}
