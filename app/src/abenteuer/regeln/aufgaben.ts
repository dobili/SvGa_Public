/**
 * Aufgabenrunden (Regelwerk R30, R31; Entscheidung A7): Umfang aus dem Zeitbudget des Clubs,
 * Schwierigkeit aus der Wertung, Bestehen ab 70 Prozent, zweite Runde eine Stufe leichter.
 *
 * Rolle im Gesamtbild: Reine Funktionen ohne Oberfläche; die Oberwelt baut damit aus einer
 * Runde (runden.json) den Aufgabenauftrag und wertet das Ergebnis aus. Die App-Seite
 * (anbindung/AufgabenAnsicht.tsx) spielt den Auftrag und kennt diese Regeln nicht.
 * Abhängigkeiten: schnittstelle/aufgaben.ts.
 * Beispiel: Maple Falls, Zeitbudget 12 Minuten, drei Buchübungen, A = 850 → Schwierigkeit 2,
 * 60 Sekunden je Motivaufgabe → (720 − 360) / 60 = 6 Motivaufgaben, auf zwei Reihenblöcke
 * verteilt also 3 je Block.
 */
import type { Antwortergebnis } from "../../training/wiederholung";
import type { Aufgabenauftrag, Aufgabenergebnis, Rundenstand } from "../schnittstelle/aufgaben";

/** Schwierigkeit 1–5 aus der Abenteuerwertung A (R30, Tabelle). */
const SCHWIERIGKEITSGRENZEN: readonly number[] = [700, 1000, 1300, 1600];
/** Sekunden je Motivaufgabe nach Schwierigkeit 1–5 (R30). */
const SEKUNDEN_JE_AUFGABE: readonly number[] = [50, 60, 90, 120, 150];
/** Sekunden je Buchübung (R30). */
export const SEKUNDEN_JE_BUCHUEBUNG = 120;
/** Höchstens so viele Buchübungen je Club zählen für das Budget (R30). */
export const HOECHSTENS_BUCHUEBUNGEN = 3;
/** Bestanden ab diesem Anteil der möglichen Punkte (R31). */
export const BESTEHENSGRENZE = 0.7;
/** Wenigstens eine Motivaufgabe je Block, damit eine Runde nie leer ist. */
const MINDESTENS_MOTIVE = 1;
const SEKUNDEN_JE_MINUTE = 60;

/** Schwierigkeit 1 bis 5 aus der Wertung; ohne Wertung (0 oder null) die leichteste. */
export function schwierigkeitAus(wertung: number | null): number {
  if (!wertung || wertung <= 0) return 1;
  return SCHWIERIGKEITSGRENZEN.filter((grenze) => wertung >= grenze).length + 1;
}

/** Sekunden, die eine Motivaufgabe der Schwierigkeit kostet (R30). */
export function sekundenJeAufgabe(schwierigkeit: number): number {
  return SEKUNDEN_JE_AUFGABE[Math.min(Math.max(schwierigkeit, 1), 5) - 1] ?? 60;
}

/** Was eine Runde zum Rechnen des Umfangs braucht (aus runden.json und orte.json). */
export interface Rundenvorgabe {
  readonly buchuebungen: readonly string[];
  readonly themen: readonly string[];
  /** Feste Zahl der Motivaufgaben, sonst null (dann aus dem Zeitbudget). */
  readonly anzahl: number | null;
  /** Zeitbudget des Clubs in Minuten, Zahl aller Buchübungen des Clubs, Zahl der Reihenblöcke. */
  readonly minuten: number;
  readonly buchuebungenDesClubs: number;
  readonly bloecke: number;
}

/**
 * Zahl der Motivaufgaben einer Runde (R30): fest, wenn `anzahl` steht; sonst der Anteil dieses
 * Blocks am Zeitbudget nach Abzug der Buchübungen, abgerundet, wenigstens eine.
 */
export function motivanzahl(vorgabe: Rundenvorgabe, schwierigkeit: number): number {
  if (vorgabe.anzahl !== null) return vorgabe.anzahl;
  if (vorgabe.themen.length === 0) return 0;
  const buch = Math.min(vorgabe.buchuebungenDesClubs, HOECHSTENS_BUCHUEBUNGEN);
  const rest = vorgabe.minuten * SEKUNDEN_JE_MINUTE - buch * SEKUNDEN_JE_BUCHUEBUNG;
  const gesamt = Math.floor(Math.max(0, rest) / sekundenJeAufgabe(schwierigkeit));
  return Math.max(MINDESTENS_MOTIVE, Math.floor(gesamt / Math.max(1, vorgabe.bloecke)));
}

/** Schwierigkeit des nächsten Versuchs (R31): ab dem zweiten eine Stufe leichter, mindestens 1. */
export function schwierigkeitDesVersuchs(grund: number, versuch: number): number {
  return Math.max(1, grund - Math.max(0, versuch - 1));
}

/** Punkte einer Antwort (R31): richtig 1, mit Hilfe 0,5, falsch 0. */
export function punkteFuer(ergebnis: Antwortergebnis): number {
  if (ergebnis === "richtig") return 1;
  if (ergebnis === "mitHilfe") return 0.5;
  return 0;
}

/** Punkte, mögliche Punkte und ob die Runde bestanden ist (R31, 70 Prozent). */
export function wertung(ergebnis: Aufgabenergebnis): {
  punkte: number;
  moeglich: number;
  bestanden: boolean;
} {
  const punkte = ergebnis.ergebnisse.reduce((summe, e) => summe + punkteFuer(e), 0);
  const moeglich = ergebnis.ergebnisse.length;
  return { punkte, moeglich, bestanden: moeglich > 0 && punkte >= moeglich * BESTEHENSGRENZE };
}

/** Der Stand der Runde nach einem Versuch (ersetzt den alten Eintrag derselben Runde). */
export function mitRundenergebnis(
  runden: readonly Rundenstand[],
  auftrag: Aufgabenauftrag,
  ergebnis: Aufgabenergebnis,
): readonly Rundenstand[] {
  const alt = runden.find((r) => r.kennung === auftrag.runde);
  const w = wertung(ergebnis);
  const neu: Rundenstand = {
    kennung: auftrag.runde,
    bestanden: (alt?.bestanden ?? false) || w.bestanden,
    versuche: (alt?.versuche ?? 0) + 1,
    punkte: w.punkte,
    moeglich: w.moeglich,
  };
  return [...runden.filter((r) => r.kennung !== auftrag.runde), neu];
}

/** Aufgabenreihe des Clubs bestanden (R31): alle Reihenblöcke des Ortes sind bestanden. */
export function reiheBestanden(
  runden: readonly Rundenstand[],
  reihenbloecke: readonly string[],
): boolean {
  return (
    reihenbloecke.length > 0 &&
    reihenbloecke.every((k) => runden.find((r) => r.kennung === k)?.bestanden === true)
  );
}
