/**
 * Misst die aktive Übungszeit: jede Minute, in der die App sichtbar ist und der Leser in den
 * letzten drei Minuten getippt, gezogen oder eine Taste gedrückt hat, zählt eine Minute
 * (Aktivitätsart „minuten“ im Tagesprotokoll).
 *
 * Rolle im Gesamtbild: Grundlage des Übungsplans mit Dauer (training/uebungsplan.ts, Wunsch des
 * Autors vom 6.11.2026, Q15-2: „das Training mitzählen“). Drei Minuten Ruhe sind erlaubt, weil
 * Lesen und Nachdenken über einer Stellung dazugehören; wer die App offen liegen lässt, zählt
 * danach nicht weiter. App.tsx ruft useUebungszeit einmal in der Hülle auf.
 * Abhängigkeiten: speicher/aktivitaet.ts, speicher/speicher.ts.
 */
import { useEffect } from "react";
import { zaehleAktivitaet } from "../speicher/aktivitaet";
import { aendere } from "../speicher/speicher";

const MS_JE_MINUTE = 60_000;
/** So lange nach der letzten Eingabe zählt die Zeit noch als Üben. */
export const RUHE_ERLAUBT_MS = 3 * MS_JE_MINUTE;
const EINGABEN = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/**
 * Zählt die laufende Minute? Ja, wenn die App sichtbar ist und die letzte Eingabe höchstens drei
 * Minuten zurückliegt. Beispiel: sichtbar, letzte Eingabe vor 2 Minuten → ja; vor 5 → nein.
 */
export function zaehltAlsUebung(sichtbar: boolean, letzteEingabe: number, jetzt: number): boolean {
  return sichtbar && jetzt - letzteEingabe <= RUHE_ERLAUBT_MS;
}

/** Misst die aktive Zeit, solange die App läuft. */
export function useUebungszeit(): void {
  useEffect(() => {
    let letzte = Date.now();
    const merke = () => {
      letzte = Date.now();
    };
    for (const art of EINGABEN) window.addEventListener(art, merke, { passive: true });
    const takt = setInterval(() => {
      if (!zaehltAlsUebung(document.visibilityState === "visible", letzte, Date.now())) return;
      void aendere((d) => zaehleAktivitaet(d, "minuten", 1, new Date()));
    }, MS_JE_MINUTE);
    return () => {
      clearInterval(takt);
      for (const art of EINGABEN) window.removeEventListener(art, merke);
    };
  }, []);
}
