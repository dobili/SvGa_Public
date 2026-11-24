/**
 * Tagesabläufe im Kartenwissen des Spieler-Durchlaufs: Die Figuren stehen dort, wo die Uhr sie
 * hinstellt, wie im Spiel (oberwelt/tagesaufstellung.ts, nachUhr).
 *
 * Warum: Seit den Tagesabläufen (Auftrag 90) schlafen Figuren nachts oder sitzen im Diner. Der
 * Durchlauf kannte nur die Plätze der Karte, ging nachts zu Coach Delgado in den Clubraum und
 * meldete „steht davor, kein Aktionsknopf“ (eiliger Durchlauf Akt 1, 23.11.2026).
 * Rolle im Gesamtbild: Hilfe für welt.ts (kartenwissen). Liest die Daten aus inhalte/abenteuer/.
 * Abhängigkeiten: oberwelt/tagesaufstellung.ts, regeln/tagesablauf.ts, welt.ts (lies).
 */
import type { Ortdaten, Spieldaten as App } from "../../src/abenteuer/daten/laden";
import { nachUhr } from "../../src/abenteuer/oberwelt/tagesaufstellung";
import type { Tagesablaeufe } from "../../src/abenteuer/regeln/tagesablauf";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";

/** Was nachUhr braucht, einmal gelesen. */
interface Uhrdaten {
  readonly daten: App;
  readonly ablaeufe: Tagesablaeufe;
}

let vorrat: Uhrdaten | null = null;

/** Liest Orte, Quests, Runden, Begegnungen und Abläufe (die übrigen Felder braucht nachUhr nicht). */
function uhrdaten(lies: <T>(pfad: string) => T): Uhrdaten {
  vorrat ??= {
    daten: {
      gegner: [],
      karten: [],
      funde: [],
      laeden: [],
      orte: lies<{ orte: Ortdaten[] }>("orte.json").orte,
      quests: lies<{ quests: App["quests"][number][] }>("quests.json").quests,
      runden: lies<{ runden: App["runden"][number][] }>("runden.json").runden,
      begegnungen: lies<{ begegnungen: App["begegnungen"][number][] }>("begegnungen.json")
        .begegnungen,
    },
    ablaeufe: lies<Tagesablaeufe>("tagesablaeufe.json"),
  };
  return vorrat;
}

/** Stunde, mit der das Spiel die Karte unter dem Helden aufgebaut hat (`data-stunde` der Welt). */
let aufbau: { readonly karte: string; readonly stunde: number } | null = null;

/**
 * Merkt die Stunde des Kartenaufbaus (lage.ts liest sie aus der Seite). Warum: Das Spiel stellt
 * die Figuren nur beim Kartenaufbau nach der Uhr auf, nie vor den Augen des Spielers
 * (regeln/tagesablauf.ts). Lief die Uhr auf der Karte über 17 Uhr, suchte der Durchlauf Kit, Sol
 * und Ward schon an ihren Abendplätzen und meldete „kein Aktionsknopf“ (eiliger Durchlauf Akt 4,
 * 24.11.2026).
 */
export function merkeAufbaustunde(karte: string | undefined, stunde: number | null): void {
  aufbau = karte && stunde !== null && Number.isFinite(stunde) ? { karte, stunde } : null;
}

/** Spielminuten je Stunde und Tag (regeln/spieluhr.ts). */
const MINUTEN_JE_STUNDE = 60;
const MINUTEN_JE_TAG = 24 * MINUTEN_JE_STUNDE;

/** Der Stand mit der Uhr auf der Aufbaustunde, wenn die Karte die unter dem Helden ist. */
function mitAufbaustunde(stand: Abenteuerstand, kennung: string): Abenteuerstand {
  if (aufbau?.karte !== kennung) return stand;
  const tag = Math.floor((stand.spieluhr ?? 0) / MINUTEN_JE_TAG);
  return { ...stand, spieluhr: tag * MINUTEN_JE_TAG + aufbau.stunde * MINUTEN_JE_STUNDE };
}

/**
 * Die Karte nach der Uhr des Stands, wie das Spiel sie aufstellt; ohne Ort unverändert. Für die
 * Karte unter dem Helden gilt die Stunde ihres Aufbaus (merkeAufbaustunde).
 * Beispiel: Clubraum um 0 Uhr → ohne Coach Delgado und Sam (sie sitzen im Diner oder schlafen).
 */
export function karteNachUhr<T extends object>(
  karte: T,
  kennung: string,
  stand: Abenteuerstand,
  variablen: Readonly<Record<string, unknown>>,
  lies: <U>(pfad: string) => U,
): T {
  const { daten, ablaeufe } = uhrdaten(lies);
  const ort = daten.orte.find((o) => o.karten.some((k) => k.kennung === kennung));
  const uhr = mitAufbaustunde(stand, kennung);
  return ort ? nachUhr(karte, kennung, ort, uhr, daten, variablen, ablaeufe) : karte;
}
