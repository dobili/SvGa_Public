/**
 * Übungsplan (Gamifizierung P11, neu gefasst am 6.11.2026): Der Leser plant Wochentage und eine
 * Dauer; die App zählt die aktive Übungszeit mit und erinnert beim Öffnen auf der Karte „Heute“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (6.11.2026, Q15-2): Der Kalendertermin (Uhrzeit,
 * ics-Datei) war nutzlos; sinnvoll ist ein Plan, der mitzählt. Die Zeit misst app/uebungszeit.ts
 * (Aktivitätsart „minuten“: Minuten mit sichtbarer App und Eingabe in den letzten drei Minuten).
 * Erinnert wird ohne Server beim Öffnen der App: An einem Plantag zeigt die Karte „Heute“ „Heute
 * geplant: 20 Minuten, 7 geschafft“. Reine Funktionen; Wahl in ui/komponenten/start/Planwahl.tsx.
 * Abhängigkeiten: speicher/gamifizierung.ts (Typ), training/kurzplaene.ts (Tagesschlüssel).
 */
import type { Gamifizierungsdaten, Uebungsplan } from "../speicher/gamifizierung";
import { tagesschluessel } from "./kurzplaene";

/** Wählbare Dauern je Übungstag in Minuten. */
export const PLANDAUERN = [10, 15, 20, 30, 45, 60] as const;
/** Vorgabe beim ersten Planen. */
export const VORGABE_MINUTEN = 20;

const TAGE_JE_WOCHE = 7;
/** getDay() zählt ab Sonntag; im Plan ist 0 der Montag. */
const SONNTAG_JS = 0;

/** Wochentag im Plan (0 = Montag) zu einem Datum, Ortszeit. Beispiel: Samstag, 31.10.2026 → 5. */
export function plantag(datum: Date): number {
  const js = datum.getDay();
  return js === SONNTAG_JS ? TAGE_JE_WOCHE - 1 : js - 1;
}

/** Ist heute ein geplanter Übungstag? Beispiel: Plan Mo/Mi/Fr, Mittwoch → true. */
export function heuteGeplant(plan: Uebungsplan | null, jetzt: Date): boolean {
  return plan !== null && plan.tage.includes(plantag(jetzt));
}

/** Stand des heutigen Plantags: geplante und geschaffte Minuten. */
export interface Planstand {
  readonly geplant: number;
  readonly geschafft: number;
  readonly fertig: boolean;
}

/**
 * Der Stand von heute; null, wenn heute kein Plantag ist.
 * Beispiel: Plan Mo/Mi je 20 Minuten, Mittwoch, 7 aktive Minuten → { 20, 7, fertig: false }.
 */
export function planstandHeute(
  daten: Pick<Gamifizierungsdaten, "uebungsplan" | "aktivitaet">,
  jetzt: Date,
): Planstand | null {
  const plan = daten.uebungsplan;
  if (!plan || !heuteGeplant(plan, jetzt)) return null;
  const geschafft = daten.aktivitaet[tagesschluessel(jetzt)]?.minuten ?? 0;
  return { geplant: plan.minuten, geschafft, fertig: geschafft >= plan.minuten };
}

/** Ein gültiger Plan aus der Wahl? Mindestens ein Tag und eine wählbare Dauer. */
export function istPlan(plan: Uebungsplan): boolean {
  return (
    plan.tage.length > 0 &&
    plan.tage.every((t) => Number.isInteger(t) && t >= 0 && t < TAGE_JE_WOCHE) &&
    (PLANDAUERN as readonly number[]).includes(plan.minuten)
  );
}

/**
 * Setzt den Übungsplan (Tage sortiert, ohne Doppel) oder entfernt ihn (null).
 * Sonderfall: ein ungültiger Plan ändert nichts.
 */
export function mitUebungsplan<T extends Pick<Gamifizierungsdaten, "uebungsplan">>(
  daten: T,
  plan: Uebungsplan | null,
): T {
  if (plan === null) return { ...daten, uebungsplan: null };
  if (!istPlan(plan)) return daten;
  const tage = [...new Set(plan.tage)].sort((a, b) => a - b);
  return { ...daten, uebungsplan: { ...plan, tage, satz: plan.satz.trim() } };
}
