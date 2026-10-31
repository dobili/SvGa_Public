/**
 * Abschnitte der Woche (Gamifizierung P4): eine Liste zum Eintragen unter der Tageskette der Karte
 * „Heute“.
 *
 * Rolle im Gesamtbild: Die Karte „Heute“ (Heutekarte.tsx, Gestaltung A2 vom 31.10.2026) zeigt
 * je Abschnitt einen Reiter mit kurzem Titel und Stand („Aufträge 1/3“); ein Tipp klappt den
 * Abschnitt darunter auf. Abschnitte: Wochenaufträge (P6), Übungsplan (P11), eigene Ziele (P13),
 * später Abschnitte neuer Trainer oder Werkzeuge. Jedes Paket trägt nur eine Zeile ein (eintragen
 * statt umbauen, Wunsch des Autors 31.10.2026); Heutekarte.tsx bleibt unverändert.
 * Abhängigkeiten: speicher/format.ts (Typ), die Abschnitte und ihre Stände.
 */
import type { ComponentType } from "react";
import type { Textschluessel } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import { Auftragsabschnitt, AuftraegeStand } from "./Auftragsabschnitt";
import { Planabschnitt, PlanStand } from "./Planabschnitt";
import { Zielabschnitt, ZieleStand } from "./Zielabschnitt";

/** Ein Abschnitt der Wochenkarte. */
export interface Wochenabschnitt {
  readonly kennung: string;
  /** Reihenfolge (kleiner zuerst): Aufträge P6 = 20, Übungsplan P11 = 30, Ziele P13 = 40. */
  readonly rang: number;
  /** Soll der Abschnitt jetzt erscheinen? Rein, ohne Nebenwirkung. */
  readonly sichtbar: (daten: Nutzerdaten, jetzt: Date) => boolean;
  /** Kurzer Titel im Reiter, etwa „Aufträge“. */
  readonly titel: Textschluessel;
  /** Kurzer Stand neben dem Titel („1/3“, „heute“); darf nichts zeigen. */
  readonly Stand: ComponentType;
  readonly Abschnitt: ComponentType;
}

/** Alle Abschnitte; Pakete fügen je eine Zeile an. */
export const WOCHENABSCHNITTE: readonly Wochenabschnitt[] = [
  {
    kennung: "auftraege",
    rang: 20,
    sichtbar: () => true,
    titel: "buchlook.reiter.auftraege",
    Stand: AuftraegeStand,
    Abschnitt: Auftragsabschnitt,
  },
  {
    kennung: "uebungsplan",
    rang: 30,
    sichtbar: () => true,
    titel: "buchlook.reiter.plan",
    Stand: PlanStand,
    Abschnitt: Planabschnitt,
  },
  {
    kennung: "ziele",
    rang: 40,
    sichtbar: () => true,
    titel: "buchlook.reiter.ziele",
    Stand: ZieleStand,
    Abschnitt: Zielabschnitt,
  },
];

/** Die sichtbaren Abschnitte nach Rang. Beispiel: Plan (30), Aufträge (20) → Aufträge, Plan. */
export function sichtbareAbschnitte<A extends Pick<Wochenabschnitt, "rang" | "sichtbar">>(
  abschnitte: readonly A[],
  daten: Nutzerdaten,
  jetzt: Date,
): A[] {
  return abschnitte.filter((a) => a.sichtbar(daten, jetzt)).sort((a, b) => a.rang - b.rang);
}
