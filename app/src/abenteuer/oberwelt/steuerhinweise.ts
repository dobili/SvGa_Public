/**
 * Einmalige Hinweise zur Steuerung (Erstspieler-Durchgang, 20.11.2026): Steuerkreuz, Aktionsknopf,
 * Tagebuch mit dem Pfeil und Spielmenü bekommen je eine Zeile, wenn sie zum ersten Mal zählen.
 *
 * Warum: Im Durchgang mit den Augen eines neuen Spielers erklärte nichts die Bedienung. Wer das
 * Spiel zum ersten Mal öffnet, sieht ein Kreuz, später einen Knopf mit „Ansehen“, eine Meldung
 * „Neu im Tagebuch“ und ein ☰, ohne zu wissen, was davon was tut. Kein langes Lernkapitel: eine
 * Zeile im Moment, in dem das Ding zum ersten Mal gebraucht wird (wie erklaerungen.ts für Münzen).
 * Rolle im Gesamtbild: reine Regel für oberwelt/Steuerhinweis.tsx (zeigt die Zeile und hakt ab).
 * Ob ein Hinweis schon kam, merkt sich der Spielstand in den Dialogvariablen.
 * Abhängigkeiten: schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Die Hinweise, in der Reihenfolge, in der ein neuer Spieler ihnen begegnet. */
export type Steuerhinweis = "steuerkreuz" | "aktion" | "tagebuch" | "menue" | "rennen";

/** Ab diesem Akt kommt der Hinweis zum Rennen (nach Akt 1, Wunsch des Autors, 21.11.2026). */
const RENNEN_AB_AKT = 2;

/** Dialogvariable, die einen Hinweis abhakt. Beispiel: „hinweisSteuerkreuz“. */
export function hinweisvariable(hinweis: Steuerhinweis): string {
  return `hinweis${hinweis.charAt(0).toUpperCase()}${hinweis.slice(1)}`;
}

/** Was die Oberwelt gerade zeigt, soweit es für die Hinweise zählt. */
export interface Hinweislage {
  /** Kein Fenster offen und keine Meldung: Die Welt ist frei. */
  readonly frei: boolean;
  /** In einer Erinnerung (Ambroses Zeit) fehlen Tagebuch und Leiste. */
  readonly erinnerung: boolean;
  /** Der Aktionsknopf ist gerade zu sehen. */
  readonly aktionSichtbar: boolean;
  /** Eine Außenkarte: Dort kann der Held rennen (gangart.ts). Fehlt: wie innen. */
  readonly draussen?: boolean;
}

/** Ob der Hinweis schon kam. */
function gesehen(stand: Abenteuerstand, hinweis: Steuerhinweis): boolean {
  return stand.dialogvariablen[hinweisvariable(hinweis)] === true;
}

/**
 * Der Hinweis, der jetzt fällig ist, oder null. Nur in freier Welt; nie zwei zugleich.
 * - Steuerkreuz: sobald die Welt zum ersten Mal frei ist (nach der Einleitung im Wohnzimmer);
 * - Aktionsknopf: sobald er zum ersten Mal erscheint;
 * - Tagebuch: sobald die erste Quest im Tagebuch steht (nach der Meldung „Neu im Tagebuch“),
 *   nicht in Erinnerungen;
 * - Menü: danach einmal, ebenfalls nicht in Erinnerungen;
 * - Rennen: danach, ab Akt 2, beim ersten Mal draußen (gangart.ts).
 * Beispiel: neuer Spielstand, Einleitung vorbei → „steuerkreuz“; danach am Karton → „aktion“.
 * Sonderfall: Ein alter Spielstand mit Quests bekommt die Hinweise der Reihe nach einmal.
 */
export function faelligerHinweis(stand: Abenteuerstand, lage: Hinweislage): Steuerhinweis | null {
  if (!lage.frei) return null;
  if (!gesehen(stand, "steuerkreuz")) return "steuerkreuz";
  if (lage.aktionSichtbar && !gesehen(stand, "aktion")) return "aktion";
  if (lage.erinnerung || stand.quests.length === 0) return null;
  if (!gesehen(stand, "tagebuch")) return "tagebuch";
  if (!gesehen(stand, "menue")) return "menue";
  const rennen = lage.draussen === true && stand.handlung.akt >= RENNEN_AB_AKT;
  if (rennen && !gesehen(stand, "rennen")) return "rennen";
  return null;
}

/** Der Stand mit abgehaktem Hinweis. */
export function hakeAb(stand: Abenteuerstand, hinweis: Steuerhinweis): Abenteuerstand {
  const variablen = { ...stand.dialogvariablen, [hinweisvariable(hinweis)]: true };
  return { ...stand, dialogvariablen: variablen };
}
