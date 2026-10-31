/**
 * Fundstücke (Gamifizierung P10 b): selten, am Ende einer Trainerrunde, eine kleine Karte mit
 * einer Schachgeschichte, einer Kuriosität oder einem Merksatz mit Kapitel, gesammelt im Album.
 *
 * Rolle im Gesamtbild: Die Meldung am Rundenende (ui/komponenten/fundstuecke/Fundstueckmeldung.tsx,
 * eingetragen in NACH_DER_RUNDE) ruft findeFundstueck; das Album (Profilkarte und Bildschirm
 * „fundstuecke“) liest den Katalog. Der Katalog steht in inhalte/de/fundstuecke.json (Kennung, Art,
 * Kapitel), die Texte in den Sprachdateien (fundstueck.text.<kennung>, Deutsch und Englisch).
 * Ein weiteres Fundstück ist eine Zeile im Katalog und je ein Text; eine weitere Art eine Zeile in
 * FUNDSTUECKARTEN (eintragen statt umbauen, Wunsch des Autors, 31.10.2026).
 * Warum selten und zufällig: Unerwartete Belohnungen untergraben die Freude am Üben nicht, fest
 * versprochene schon (Deci, Koestner, Ryan 1999; Vorrecherche, Abschnitt 1). Deshalb etwa jede
 * zwölfte Runde, höchstens eins am Tag, und nur nach einer Runde mit mindestens einer richtigen
 * Antwort (Belohnung fürs Lernen, nicht fürs Antippen).
 * Speicher: `fundstuecke` (Kennungen, Format 7) und das Datum unter `verdient` „fundstueck:<k>“
 * (speicher/verdient.ts), beides in der Datensicherung.
 * Abhängigkeiten: inhalte/de/fundstuecke.json, speicher (Typen, mitVerdient, summeIn),
 * training/kurzplaene.ts (tagesschluessel).
 */
import katalog from "../../../inhalte/de/fundstuecke.json";
import type { Nutzerdaten } from "../speicher/format";
import { summeIn } from "../speicher/aktivitaet";
import { mitVerdient } from "../speicher/verdient";
import { tagesschluessel } from "./kurzplaene";

/** Die Arten der Fundstücke; je weitere Art eine Zeile (Name in fundstueck.art.<art>). */
export const FUNDSTUECKARTEN = ["geschichte", "kurios", "merksatz"] as const;
export type Fundstueckart = (typeof FUNDSTUECKARTEN)[number];

/** Ein Fundstück des Katalogs; der Text steht in der Sprachdatei. */
export interface Fundstueck {
  readonly kennung: string;
  readonly art: Fundstueckart;
  /** Kapitel des Buches, zu dem es passt (Merksätze immer), sonst null. */
  readonly kapitel: number | null;
}

/** Wahrscheinlichkeit eines Fundes je Runde: etwa jede zwölfte (Vorrecherche P10 b). */
export const CHANCE_JE_RUNDE = 1 / 12;
/**
 * Das erste Fundstück kommt sicher, sobald schon so viele Runden fertig sind (also in der
 * dritten): So lernt jeder Leser das Album kennen, ohne dass es angekündigt wird.
 */
export const ERSTER_FUND_NACH_RUNDEN = 2;
/** Schlüssel unter `verdient`: „fundstueck:<kennung>“ → Datum des Fundes. */
export const VERDIENT_PRAEFIX = "fundstueck:";
const FRUEHESTER_TAG = "0000-00-00";
const SPAETESTER_TAG = "9999-99-99";

/** Alle Fundstücke in der Reihenfolge des Albums. */
export const FUNDSTUECKE: readonly Fundstueck[] = katalog.fundstuecke.map((f) => ({
  kennung: f.kennung,
  art: alsArt(f.art),
  kapitel: f.kapitel,
}));

function alsArt(art: string): Fundstueckart {
  const gefunden = FUNDSTUECKARTEN.find((a) => a === art);
  if (!gefunden) throw new Error(`Unbekannte Art eines Fundstücks: ${art}`);
  return gefunden;
}

/**
 * Wurde am Tag des Zeitpunkts schon ein Fundstück gefunden (Ortszeit)?
 * Beispiel: verdient { "fundstueck:dame-neu": heute 9 Uhr } → true; gestern → false.
 */
export function heuteGefunden(verdient: Readonly<Record<string, string>>, jetzt: Date): boolean {
  const heute = tagesschluessel(jetzt);
  return Object.entries(verdient).some(
    ([schluessel, datum]) =>
      schluessel.startsWith(VERDIENT_PRAEFIX) && tagesschluessel(new Date(datum)) === heute,
  );
}

/** Die noch nicht gefundenen Fundstücke, in der Reihenfolge des Albums. */
export function offeneFundstuecke(
  gefunden: readonly string[],
  liste: readonly Fundstueck[] = FUNDSTUECKE,
): Fundstueck[] {
  const schon = new Set(gefunden);
  return liste.filter((f) => !schon.has(f.kennung));
}

/** Was eine fertige Runde für den Fund wissen muss (Teil von Rundenergebnis). */
export interface Rundenfund {
  readonly richtig: number;
}

/**
 * Darf und soll nach dieser Runde ein Fundstück erscheinen?
 * Sonderfälle: heute schon eins, alle gefunden, keine richtige Antwort → nein; noch keins
 * gefunden und genug frühere Runden → ja (ohne Zufall); sonst entscheidet der Zufall (0 bis 1).
 */
export function sollFinden(
  daten: Nutzerdaten,
  runde: Rundenfund,
  jetzt: Date,
  zufall: number,
  liste: readonly Fundstueck[] = FUNDSTUECKE,
): boolean {
  if (runde.richtig < 1 || heuteGefunden(daten.verdient, jetzt)) return false;
  if (offeneFundstuecke(daten.fundstuecke, liste).length === 0) return false;
  const runden = summeIn(daten.aktivitaet, "trainerRunde", FRUEHESTER_TAG, SPAETESTER_TAG);
  if (daten.fundstuecke.length === 0 && runden >= ERSTER_FUND_NACH_RUNDEN) return true;
  return zufall < CHANCE_JE_RUNDE;
}

/**
 * Sucht nach einer fertigen Runde ein Fundstück und legt es ins Album.
 *
 * Eingaben: Nutzerdaten, Runde, Zeitpunkt, Zufallsquelle (Math.random, im Test fest).
 * Ausgabe: neue Daten und die Kennung, oder dieselben Daten und null.
 * Beispiel: dritte Runde mit 7 von 10 richtig, noch nichts gefunden → das erste Fundstück aus
 * den offenen, zufällig gewählt. Sonderfall: Zweiter Aufruf am selben Tag → null (keine Doppel).
 */
export function findeFundstueck(
  daten: Nutzerdaten,
  runde: Rundenfund,
  jetzt: Date,
  zufall: () => number,
  liste: readonly Fundstueck[] = FUNDSTUECKE,
): { readonly daten: Nutzerdaten; readonly kennung: string | null } {
  if (!sollFinden(daten, runde, jetzt, zufall(), liste)) return { daten, kennung: null };
  const offen = offeneFundstuecke(daten.fundstuecke, liste);
  const wahl = offen[Math.min(Math.floor(zufall() * offen.length), offen.length - 1)];
  if (!wahl) return { daten, kennung: null };
  const neu = { ...daten, fundstuecke: [...daten.fundstuecke, wahl.kennung] };
  return {
    daten: mitVerdient(neu, [`${VERDIENT_PRAEFIX}${wahl.kennung}`], jetzt),
    kennung: wahl.kennung,
  };
}

/** Das Fundstück zu einer Kennung; undefined für unbekannte (etwa aus einer neueren App). */
export function fundstueck(kennung: string): Fundstueck | undefined {
  return FUNDSTUECKE.find((f) => f.kennung === kennung);
}
