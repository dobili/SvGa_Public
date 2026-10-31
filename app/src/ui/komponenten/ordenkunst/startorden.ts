/**
 * Was die Startanimation von Orden und Abzeichen zeigt, und der goldene Punkt am Reiter „Profil“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026, Entwürfe 3 und 4): Springer und Titel laufen
 * unverändert. Ist seit dem letzten Start ein Orden oder Abzeichen neu verdient, erscheint es danach
 * unter dem Titel und fliegt zum Reiter „Profil“; dort bleibt ein goldener Punkt, bis man das Profil
 * öffnet. Ohne Neues erscheint leise ein schon verdientes Stück („Stück des Tages“). Was beim
 * letzten Start verdient war, steht in einem Merker auf dem Gerät (keine neuen Felder im Speicher
 * der Leser); fehlt er (erster Start nach dem Update), gilt nichts als neu, damit nicht alle
 * gesammelten Stücke auf einmal „neu“ sind.
 * Abhängigkeiten: app/merker.ts, React (useSyncExternalStore).
 */
import { useSyncExternalStore } from "react";
import { beobachteMerker, entferneMerker, liesMerker, schreibeMerker } from "../../../app/merker";
import { festerZufall } from "../../../training/zufall";
import type { Stueckart } from "./entwuerfe";

/** Merker: alle Stücke, die beim letzten Start verdient waren („orden:uebungen,abzeichen:warum“). */
export const MERKER_BEKANNT = "ordenBekannt";
/** Merker: ein neues Stück wartet auf den Blick ins Profil (goldener Punkt an der Leiste). */
export const MERKER_UNGESEHEN = "ordenUngesehen";

/** Bis hierhin stehen Springer und Titel still (55 % der 2,5 s der Startanimation). */
export const LOGO_STEHT_MS = 1400;
/** Gesamtdauer mit neuem Stück: Logo, Stück, Name, Flug ins Profil. */
export const DAUER_MIT_NEUEM_MS = 4600;
/** Gesamtdauer mit dem Stück des Tages. */
export const DAUER_STUECK_DES_TAGES_MS = 3500;

/** Ein Orden oder Abzeichen mit Art und Kennung. */
export interface Stueck {
  readonly art: Stueckart;
  readonly kennung: string;
  /** Kurzer Name für die Zeile unter dem Bild. */
  readonly name: string;
}

/** Schlüssel eines Stücks im Merker. Beispiel: { art: "orden", kennung: "engine" } → „orden:engine“. */
export function stueckSchluessel(s: Pick<Stueck, "art" | "kennung">): string {
  return `${s.art}:${s.kennung}`;
}

/** Was die Startanimation zeigt. */
export type Startplan =
  | {
      readonly art: "neu";
      readonly stueck: Stueck;
      readonly weitere: number;
      readonly dauerMs: number;
    }
  | {
      readonly art: "tag";
      readonly stueck: Stueck;
      readonly verdient: number;
      readonly dauerMs: number;
    }
  | { readonly art: "nichts" };

/**
 * Entscheidet, was gezeigt wird, und liefert den neuen Wert für MERKER_BEKANNT.
 *
 * Eingaben: Merker vom letzten Start (null beim ersten Mal), alle jetzt verdienten Stücke,
 * Zufallszahl 0 … 1 für das Stück des Tages.
 * Beispiel: bekannt „abzeichen:erstePartie“, verdient erstePartie und ersterSieg → neu: ersterSieg.
 * Sonderfälle: bekannt null → nichts ist neu (Stück des Tages, sofern etwas verdient ist);
 * nichts verdient → „nichts“ (die Startanimation bleibt wie bisher).
 */
export function planeStart(
  bekannt: string | null,
  verdient: readonly Stueck[],
  zufall: number,
): { plan: Startplan; bekanntNeu: string } {
  const alt = new Set((bekannt ?? "").split(",").filter(Boolean));
  // Vereinigung statt Ersetzen: Lädt ein Ring später (Lernziele), gilt sein Orden beim nächsten
  // Start nicht noch einmal als neu (Prüfung beim Übernehmen, 31.10.2026).
  const bekanntNeu = [...new Set([...alt, ...verdient.map(stueckSchluessel)])].join(",");
  const neu = bekannt === null ? [] : verdient.filter((s) => !alt.has(stueckSchluessel(s)));
  const erstes = neu[0];
  if (erstes)
    return {
      plan: { art: "neu", stueck: erstes, weitere: neu.length - 1, dauerMs: DAUER_MIT_NEUEM_MS },
      bekanntNeu,
    };
  const tag = verdient[Math.min(verdient.length - 1, Math.floor(zufall * verdient.length))];
  if (tag)
    return {
      plan: {
        art: "tag",
        stueck: tag,
        verdient: verdient.length,
        dauerMs: DAUER_STUECK_DES_TAGES_MS,
      },
      bekanntNeu,
    };
  return { plan: { art: "nichts" }, bekanntNeu };
}

/** Stellen je Teil des Datums in der Saat (JJJJMMTT). */
const MONATSSTELLEN = 100;

/**
 * Zufallszahl 0 bis 1, die einen Tag lang gleich bleibt: So ist das „Stück des Tages“ wirklich
 * eines je Tag (Ortszeit), statt bei jedem Start ein anderes.
 * Beispiel: zweimal am 31.10.2026 → dieselbe Zahl; am 1.11. eine andere.
 */
export function zufallDesTages(jetzt: Date): number {
  const saat =
    (jetzt.getFullYear() * MONATSSTELLEN + jetzt.getMonth() + 1) * MONATSSTELLEN + jetzt.getDate();
  return festerZufall(saat)();
}

/** Liest den Merker der beim letzten Start bekannten Stücke. */
export function liesBekannt(): string | null {
  return liesMerker(MERKER_BEKANNT);
}

/** Merkt die jetzt verdienten Stücke für den nächsten Start. */
export function merkeBekannt(wert: string): void {
  schreibeMerker(MERKER_BEKANNT, wert);
}

/** Ein neues Stück ist ins Profil geflogen: goldener Punkt an „Profil“. */
export function merkeUngesehen(s: Stueck): void {
  schreibeMerker(MERKER_UNGESEHEN, stueckSchluessel(s));
}

/** Das Profil wurde geöffnet: Punkt weg. */
export function loescheUngesehen(): void {
  if (liesMerker(MERKER_UNGESEHEN) !== null) entferneMerker(MERKER_UNGESEHEN);
}

/** Wartet ein neues Stück auf den Blick ins Profil? Zeichnet neu, wenn sich das ändert. */
export function useOrdenUngesehen(): boolean {
  return useSyncExternalStore(
    (melde) => beobachteMerker((name) => name === MERKER_UNGESEHEN && melde()),
    () => liesMerker(MERKER_UNGESEHEN) !== null,
    () => false,
  );
}
