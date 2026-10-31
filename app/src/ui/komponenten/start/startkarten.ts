/**
 * Plätze für Karten oben auf der Buch-Startseite (Gamifizierung G4, Entscheidung E2).
 *
 * Rolle im Gesamtbild: Mehrere Pakete zeigen dort eine Karte: „Heute“ mit nächstem Schritt (P1),
 * Wochenziel, Aufträgen, Plan und eigenen Zielen (P4/P6/P11/P13; seit der Gestaltung A2 vom
 * 31.10.2026 eine Karte), Rivale (P8), Monatsrückblick (P12). Jede Karte ist eine
 * eigene Datei; das Paket trägt hier nur eine Zeile ein. Höchstens zwei Karten stehen zugleich,
 * nach Rang (kleiner zuerst). So kommen später auch Karten neuer Trainer oder Werkzeuge dazu,
 * ohne Buch.tsx zu ändern.
 * Abhängigkeiten: speicher/format.ts (Typ), die Karten der Pakete (Heutekarte, Rivale, Rückblick).
 */
import type { ComponentType } from "react";
import type { Nutzerdaten } from "../../../speicher/format";
import { Heutekarte } from "./Heutekarte";
import { wochenkarteSichtbar } from "./wochensichtbar";
import { naechsterSchrittSichtbar } from "./naechsterSchrittMerker";
import { Rivalenkarte } from "../rivale/Rivalenkarte";
import { rivalenkarteSichtbar } from "../rivale/rivalenmerker";
import { RueckblickStartkarte } from "../rueckblick/RueckblickKarten";
import { rueckblickkarteJetzt } from "../rueckblick/rueckblickMerker";

/** Eine Karte der Startseite. */
export interface Startkarte {
  readonly kennung: string;
  /** Reihenfolge: Heute = 10, P12 = 15 (nur 1. bis 7. des Monats), P8 = 30. */
  readonly rang: number;
  /** Soll die Karte jetzt erscheinen? Rein, ohne Nebenwirkung. */
  readonly sichtbar: (daten: Nutzerdaten, jetzt: Date) => boolean;
  readonly Karte: ComponentType;
}

/** Höchstens so viele Karten stehen zugleich über der Kapitelliste. */
export const HOECHSTENS_STARTKARTEN = 2;

/** Alle Karten; Pakete fügen je eine Zeile an (Konfliktkarte, gamifizierung.md Abschnitt 5). */
export const STARTKARTEN: readonly Startkarte[] = [
  // Gestaltung A2: nächster Schritt (früher Rang 10) und Woche (früher 20) in einer Karte.
  {
    kennung: "heute",
    rang: 10,
    sichtbar: (daten, jetzt) =>
      naechsterSchrittSichtbar(jetzt) || wochenkarteSichtbar(daten, jetzt),
    Karte: Heutekarte,
  },
  { kennung: "rivale", rang: 30, sichtbar: rivalenkarteSichtbar, Karte: Rivalenkarte },
  // P12 Monatsrückblick: Rang 15 statt 40, sonst verdrängen P1 und P4 die Karte immer (Bericht).
  { kennung: "rueckblick", rang: 15, sichtbar: rueckblickkarteJetzt, Karte: RueckblickStartkarte },
];

/**
 * Die sichtbaren Karten nach Rang, höchstens zwei.
 * Beispiel: Heute (10), Rivale (30), Rückblick (15) → Heute, Rückblick.
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
