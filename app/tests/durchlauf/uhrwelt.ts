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

/**
 * Die Karte nach der Uhr des Stands, wie das Spiel sie aufstellt; ohne Ort unverändert.
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
  return ort ? nachUhr(karte, kennung, ort, stand, daten, variablen, ablaeufe) : karte;
}
