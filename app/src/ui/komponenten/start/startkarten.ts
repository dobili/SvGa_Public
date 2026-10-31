/**
 * Plätze für Karten oben auf der Buch-Startseite (Gamifizierung G4, Entscheidung E2).
 *
 * Rolle im Gesamtbild: Mehrere Pakete zeigen dort eine Karte: nächster Schritt (P1), Wochenziel und
 * Aufträge (P4/P6), Rivale (P8), Monatsrückblick (P12), eigene Ziele (P13). Jede Karte ist eine
 * eigene Datei; das Paket trägt hier nur eine Zeile ein. Höchstens zwei Karten stehen zugleich,
 * nach Rang (kleiner zuerst). So kommen später auch Karten neuer Trainer oder Werkzeuge dazu,
 * ohne Buch.tsx zu ändern.
 * Abhängigkeiten: speicher/format.ts (Typ), die Karten der Pakete (Wochenkarte P4, nächster
 * Schritt P1).
 */
import type { ComponentType } from "react";
import type { Nutzerdaten } from "../../../speicher/format";
import { Wochenkarte } from "./Wochenkarte";
import { wochenkarteSichtbar } from "./wochensichtbar";
import { NaechsterSchritt } from "./NaechsterSchritt";
import { naechsterSchrittSichtbar } from "./naechsterSchrittMerker";
import { Rivalenkarte } from "../rivale/Rivalenkarte";
import { rivalenkarteSichtbar } from "../rivale/rivalenmerker";

/** Eine Karte der Startseite. */
export interface Startkarte {
  readonly kennung: string;
  /** Reihenfolge: P1 = 10, P4/P6 = 20, P13 = 25, P8 = 30, P12 = 40 (Lücken für Späteres). */
  readonly rang: number;
  /** Soll die Karte jetzt erscheinen? Rein, ohne Nebenwirkung. */
  readonly sichtbar: (daten: Nutzerdaten, jetzt: Date) => boolean;
  readonly Karte: ComponentType;
}

/** Höchstens so viele Karten stehen zugleich über der Kapitelliste. */
export const HOECHSTENS_STARTKARTEN = 2;

/** Alle Karten; Pakete fügen je eine Zeile an (Konfliktkarte, gamifizierung.md Abschnitt 5). */
export const STARTKARTEN: readonly Startkarte[] = [
  { kennung: "woche", rang: 20, sichtbar: wochenkarteSichtbar, Karte: Wochenkarte },
  {
    kennung: "naechster",
    rang: 10,
    sichtbar: (_daten, jetzt) => naechsterSchrittSichtbar(jetzt),
    Karte: NaechsterSchritt,
  },
  { kennung: "rivale", rang: 30, sichtbar: rivalenkarteSichtbar, Karte: Rivalenkarte },
];

/**
 * Die sichtbaren Karten nach Rang, höchstens zwei.
 * Beispiel: nächster Schritt (10), Rivale (30), Wochenziel (20) → nächster Schritt, Wochenziel.
 */
export function sichtbareKarten<K extends Pick<Startkarte, "rang" | "sichtbar">>(
  karten: readonly K[],
  daten: Nutzerdaten,
  jetzt: Date,
  hoechstens: number = HOECHSTENS_STARTKARTEN,
): K[] {
  return karten
    .filter((k) => k.sichtbar(daten, jetzt))
    .sort((a, b) => a.rang - b.rang)
    .slice(0, hoechstens);
}
