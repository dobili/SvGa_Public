/**
 * Menschenprofil: Fehlerraten, blinde Flecken, Wahlkern und Zeitnot je Wertungszahl.
 *
 * Rolle im Gesamtbild: Plan „menschlichere Bots und Uhr der Bots“ (vom Autor freigegeben am
 * 20.10.2026). Die Zahlen stammen aus 111 752 Stellungen gewerteter Lichess-Partien
 * (engine/menschenprofil-daten.ts, erzeugt von pipeline/menschenprofil/daten.py). Diese Datei
 * liest sie für eine beliebige Wertungszahl, linear zwischen den Mitten der 200er-Bänder.
 * Die Zugwahl (engine/menschenwahl.ts) und die Bedenkzeit (engine/bedenkzeit.ts) fragen hier.
 * Abhängigkeiten: engine/menschenprofil-daten.ts, engine/fehlerart.ts (Typ),
 * engine/blindeFlecken.ts (Typ), schach/phase.ts (Typ).
 */
import type { Phase } from "../schach/phase";
import type { BlinderFleck } from "./blindeFlecken";
import type { Fehlerart } from "./fehlerart";
import {
  BAENDER,
  BEDENKZEIT,
  BLIND,
  GELEGENHEIT,
  KERN,
  VERLUSTFAKTOR,
  ZEITNOT,
  ZEITNOT_PATZER,
} from "./menschenprofil-daten";

const HALBES_BAND = 100;
const SEKUNDE_MS = 1000;

/**
 * Wert einer Bandtabelle für eine Wertungszahl, linear zwischen den Bandmitten (500, 700, …),
 * außerhalb der Randwert. Beispiel: Tabelle [0,3; 0,2; …], 600 → 0,25.
 */
export function bandwert(tabelle: readonly number[], wertung: number): number {
  const mitten = BAENDER.map((b) => b + HALBES_BAND);
  const erste = mitten[0] ?? 0;
  const letzte = mitten.at(-1) ?? 0;
  if (wertung <= erste) return tabelle[0] ?? 0;
  if (wertung >= letzte) return tabelle.at(-1) ?? 0;
  const i = mitten.findIndex((m) => m > wertung);
  const [m0, m1] = [mitten[i - 1] ?? erste, mitten[i] ?? letzte];
  const [w0, w1] = [tabelle[i - 1] ?? 0, tabelle[i] ?? 0];
  return w0 + ((wertung - m0) / (m1 - m0)) * (w1 - w0);
}

/** Die Fehlerarten mit Daten (alle aus engine/fehlerart.ts außer „ungenau“ und „pattGesetzt“). */
export type Gelegenheitsart = keyof typeof GELEGENHEIT;
export const GELEGENHEITSARTEN = Object.keys(GELEGENHEIT) as Gelegenheitsart[];

export function hatDaten(art: Fehlerart): art is Gelegenheitsart {
  return art in GELEGENHEIT;
}

/**
 * Wie oft ein Mensch dieser Stärke eine angebotene Gelegenheit zu einem Fehler dieser Art nutzt.
 * Beispiel: „drohungIgnoriert“ bei 600 etwa 0,26, bei 2000 etwa 0,08 (Mittelspiel etwas mehr).
 */
export function gelegenheitsrate(art: Gelegenheitsart, wertung: number, phase: Phase): number {
  const daten = GELEGENHEIT[art];
  return bandwert(daten.rate, wertung) * daten.phase[phase];
}

/** Typischer Verlust eines Fehlers dieser Art bei Menschen (Bauern): Median und 90-%-Wert. */
export function typischerVerlust(art: Gelegenheitsart): { median: number; hoechst: number } {
  return { median: GELEGENHEIT[art].median, hoechst: GELEGENHEIT[art].p90 };
}

/**
 * Zusatzwahrscheinlichkeit, einen klar besten Zug dieses blinden Flecks zu verfehlen (über das
 * Verfehlen anderer klar bester Züge hinaus). Beispiel: „ruhig“ bei 1200 etwa 0,47.
 */
export function blindZusatz(fleck: BlinderFleck, wertung: number): number {
  const tabelle = (BLIND as Partial<Record<BlinderFleck, readonly number[]>>)[fleck];
  return tabelle ? bandwert(tabelle, wertung) : 0;
}

/** Der Wahlkern (1 + Verlust/tau)^(−Exponent) einer Stärke. */
export interface Wahlkern {
  /** Breite in Bauern; Temperaturfaktoren (Strähne, Zeitnot, Häufigkeit) wirken auf sie. */
  readonly tau: number;
  readonly exponent: number;
}

/**
 * Wahlkern der gewichteten Wahl für eine Stärke (angepasst an Lichess-Züge ohne erkannte
 * Fehlerart). Warum ein Potenzkern: schwache Spieler stellen öfter grob ein, als eine
 * Exponentialwahl hergibt. Beispiel: 500 → tau 3, Exponent 0,25 (langer Schwanz); 2300 →
 * tau 0,08, Exponent 0,75 (kaum grobe Fehler).
 */
export function wahlkern(wertung: number): Wahlkern {
  return { tau: bandwert(KERN.tau, wertung), exponent: bandwert(KERN.exponent, wertung) };
}

/**
 * beta der Wahl innerhalb einer Fehlerart (Gewicht Verlust^(−beta)): Starke Spieler wählen unter
 * mehreren Fehlerzügen einer Art eher den billigsten. Beispiel: 500 → 0,25 (fast gleich
 * verteilt), 2300 → 1,25.
 */
export function wahlInArt(wertung: number): number {
  return bandwert(KERN.beta, wertung);
}

/**
 * Faktor auf die Gelegenheitsrate nach dem Verlust des gewählten Fehlerzugs: Menschen machen
 * billige Fehler einer Art eher als teure, starke Spieler deutlich mehr als schwache.
 * Beispiel: 1300, Verlust 0,7 → etwa 1,4; Verlust 6 → etwa 0,5; bei 2300 Verlust 6 → etwa 0,25.
 */
export function verlustfaktor(wertung: number, verlust: number): number {
  let klasse = 0;
  VERLUSTFAKTOR.klassen.forEach((grenze, i) => {
    if (verlust >= grenze) klasse = i;
  });
  return bandwert(
    VERLUSTFAKTOR.faktor.map((jeKlasse) => jeKlasse[klasse] ?? 1),
    wertung,
  );
}

/** Zeitnot-Stufe aus der Restzeit: „0“ unter 10 s, „10“ bis 30 s, „30“ bis 60 s, sonst null. */
export type Zeitnotstufe = "0" | "10" | "30";

export function zeitnotstufe(restMs: number | null): Zeitnotstufe | null {
  if (restMs === null) return null;
  const sekunden = restMs / SEKUNDE_MS;
  if (sekunden < 10) return "0";
  if (sekunden < 30) return "10";
  return sekunden < 60 ? "30" : null;
}

/**
 * Faktoren der Zeitnot gegenüber ruhiger Zeit (ab 60 s): für Fehler ab einem Bauern und für
 * Patzer ab drei Bauern. Beispiel: 2000, unter 10 s → Fehler etwa ×1,4, Patzer etwa ×3,2.
 */
export function zeitnotFaktoren(
  wertung: number,
  restMs: number | null,
): { fehler: number; patzer: number } {
  const stufe = zeitnotstufe(restMs);
  if (!stufe) return { fehler: 1, patzer: 1 };
  return {
    fehler: bandwert(ZEITNOT[stufe], wertung),
    patzer: bandwert(ZEITNOT_PATZER[stufe], wertung),
  };
}

/** Die Tabellen der Bedenkzeit (engine/bedenkzeit.ts liest sie). */
export const BEDENKZEIT_DATEN = BEDENKZEIT;
export const BAND_UNTERGRENZEN: readonly number[] = BAENDER;
