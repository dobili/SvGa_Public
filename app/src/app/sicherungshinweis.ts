/**
 * Hinweis auf die Datensicherung nach vier Stunden App-Zeit (seit 0.2.32).
 *
 * Rolle im Gesamtbild: Antwort des Autors auf Frage Q4 (15.10.2026): Nach jeweils vier Stunden
 * „In-App-Zeit“ ohne Sicherung macht die App oben auf die Datensicherung aufmerksam, mit dem Haken
 * „Nicht mehr nachfragen“. Gezählt wird nur die Zeit, in der die App sichtbar ist; nach jeder
 * Sicherung und nach „Später“ beginnt die Zählung neu. Der Stand ist ein Merker auf dem Gerät
 * (wie die Koordinaten): Er gehört zu diesem Gerät, nicht zum Lernstand. Der sanfte Hinweis alle
 * vier Wochen in den Einstellungen (speicher/sicherung.ts) bleibt daneben bestehen.
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker, schreibeMerker } from "./merker";

const MS_JE_STUNDE = 3_600_000;
/** Nach so vielen Stunden App-Zeit ohne Sicherung erscheint der Hinweis (Wunsch des Autors). */
export const HINWEIS_NACH_STUNDEN = 4;
const HINWEIS_NACH_MS = HINWEIS_NACH_STUNDEN * MS_JE_STUNDE;

const MERKER_ZEIT = "appzeit";
const MERKER_AUS = "sicherungshinweis";
const AUS = "aus";

/** Gezählte App-Zeit seit einer bestimmten Sicherung (null: noch nie gesichert). */
export interface Appzeit {
  readonly seitSicherung: string | null;
  readonly ms: number;
}

/**
 * Zählt App-Zeit dazu. Hat sich die letzte Sicherung geändert, beginnt die Zählung neu.
 * Beispiel: {seit: null, ms: 3 h} plus 1 h → 4 h; nach einer Sicherung am 15.10. → 1 h ab dann.
 */
export function zaehle(stand: Appzeit, letzteSicherung: string | null, plusMs: number): Appzeit {
  const gleich = stand.seitSicherung === letzteSicherung;
  return { seitSicherung: letzteSicherung, ms: (gleich ? stand.ms : 0) + plusMs };
}

/** Ist der Hinweis fällig? Nur mit eigenen Daten, nicht abgeschaltet, ab vier Stunden. */
export function hinweisFaellig(
  stand: Appzeit,
  letzteSicherung: string | null,
  hatDaten: boolean,
  abgeschaltet: boolean,
): boolean {
  if (!hatDaten || abgeschaltet || stand.seitSicherung !== letzteSicherung) return false;
  return stand.ms >= HINWEIS_NACH_MS;
}

/** Der gespeicherte Stand; ein fehlender oder kaputter Merker zählt als „noch nichts gezählt“. */
export function liesAppzeit(): Appzeit {
  const roh = liesMerker(MERKER_ZEIT);
  if (!roh) return { seitSicherung: null, ms: 0 };
  try {
    const wert: unknown = JSON.parse(roh);
    if (typeof wert === "object" && wert !== null && "ms" in wert && "seitSicherung" in wert) {
      const { ms, seitSicherung } = wert;
      if (typeof ms === "number" && (seitSicherung === null || typeof seitSicherung === "string"))
        return { seitSicherung, ms };
    }
  } catch (fehler) {
    console.warn("App-Zeit nicht lesbar, Zählung beginnt neu:", fehler);
  }
  return { seitSicherung: null, ms: 0 };
}

export function schreibeAppzeit(stand: Appzeit): void {
  schreibeMerker(MERKER_ZEIT, JSON.stringify(stand));
}

/** Hat der Leser „Nicht mehr nachfragen“ gewählt? */
export function hinweisAbgeschaltet(): boolean {
  return liesMerker(MERKER_AUS) === AUS;
}

export function schalteHinweisAb(): void {
  schreibeMerker(MERKER_AUS, AUS);
}
