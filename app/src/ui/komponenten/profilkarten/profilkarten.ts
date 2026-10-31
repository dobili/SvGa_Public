/**
 * Plätze für Karten im Profil (Gamifizierung G4): „Deine Themen“ (P3), „Deine Rekorde“ (P5),
 * „Fundstücke“ (P10), „Rückblicke“ (P12), „Erreichte Ziele“ (P13) und spätere.
 *
 * Rolle im Gesamtbild: Wie die Startkarten (start/startkarten.ts): je Karte eine Datei, je Paket
 * eine Zeile hier. Die Karten stehen unter „Dein Fortschritt“, alle sichtbaren nach Rang.
 * Abhängigkeiten: speicher/format.ts (Typ).
 */
import type { ComponentType } from "react";
import type { Nutzerdaten } from "../../../speicher/format";

/** Eine Karte im Profil. */
export interface Profilkarte {
  readonly kennung: string;
  /** Reihenfolge: P3 = 10, P5 = 20, P13 = 25, P12 = 30, P10 = 40. */
  readonly rang: number;
  readonly sichtbar: (daten: Nutzerdaten) => boolean;
  readonly Karte: ComponentType;
}

/** Alle Karten im Profil; Pakete fügen je eine Zeile an. */
export const PROFILKARTEN: readonly Profilkarte[] = [];
