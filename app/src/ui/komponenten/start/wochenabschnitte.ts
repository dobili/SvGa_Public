/**
 * Abschnitte der Wochenkarte (Gamifizierung P4): eine Liste zum Eintragen unter dem Wochenstand.
 *
 * Rolle im Gesamtbild: Die Wochenkarte zeigt oben das Wochenziel (sieben Punkte, Ring, Bilanz).
 * Darunter stehen Abschnitte anderer Pakete: der Übungsplan (P11) gleich hier, später die
 * Wochenaufträge (P6) und die eigenen Ziele (P13), ebenso Abschnitte neuer Trainer oder Werkzeuge.
 * Jedes Paket trägt nur eine Zeile ein (eintragen statt umbauen, Wunsch des Autors 31.10.2026);
 * Wochenkarte.tsx bleibt unverändert.
 * Abhängigkeiten: speicher/format.ts (Typ), Planabschnitt.tsx.
 */
import type { ComponentType } from "react";
import type { Nutzerdaten } from "../../../speicher/format";
import { Auftragsabschnitt } from "./Auftragsabschnitt";
import { Planabschnitt } from "./Planabschnitt";

/** Ein Abschnitt der Wochenkarte. */
export interface Wochenabschnitt {
  readonly kennung: string;
  /** Reihenfolge (kleiner zuerst): Aufträge P6 = 20, Übungsplan P11 = 30, Ziele P13 = 40. */
  readonly rang: number;
  /** Soll der Abschnitt jetzt erscheinen? Rein, ohne Nebenwirkung. */
  readonly sichtbar: (daten: Nutzerdaten, jetzt: Date) => boolean;
  readonly Abschnitt: ComponentType;
}

/** Alle Abschnitte; Pakete fügen je eine Zeile an. */
export const WOCHENABSCHNITTE: readonly Wochenabschnitt[] = [
  { kennung: "auftraege", rang: 20, sichtbar: () => true, Abschnitt: Auftragsabschnitt },
  { kennung: "uebungsplan", rang: 30, sichtbar: () => true, Abschnitt: Planabschnitt },
];

/** Die sichtbaren Abschnitte nach Rang. Beispiel: Plan (30), Aufträge (20) → Aufträge, Plan. */
export function sichtbareAbschnitte<A extends Pick<Wochenabschnitt, "rang" | "sichtbar">>(
  abschnitte: readonly A[],
  daten: Nutzerdaten,
  jetzt: Date,
): A[] {
  return abschnitte.filter((a) => a.sichtbar(daten, jetzt)).sort((a, b) => a.rang - b.rang);
}
