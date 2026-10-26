/**
 * Merkt eine Abbildung als angesehen, wenn sie 30 Sekunden am Stück auf dem Bildschirm steht.
 *
 * Rolle im Gesamtbild: Füllt den Fortschritt „angesehene Abbildungen“ (Pflichtenheft 4, Stufe 2).
 * Wunsch des Autors: Wer nur durch die Abbildungen blättert, hat sie nicht angesehen. Deshalb
 * zählt eine Abbildung erst nach VERWEILZEIT_MS ohne Unterbrechung; geht die App in den
 * Hintergrund oder wechselt die Abbildung, beginnt die Zeit von vorn. Das gilt für die geöffnete
 * Abbildung und jede, die der Leser beim Nachspielen erreicht. Von Hand abhaken lässt sie sich in
 * der Kapitelübersicht. Eine schon gesehene Abbildung schreibt nichts neu.
 * Abhängigkeiten: speicher/speicher.ts, speicher/fortschritt.ts, React.
 */
import { useEffect } from "react";
import { markiereGesehen } from "../../../speicher/fortschritt";
import { aendere } from "../../../speicher/speicher";

/** So lange muss eine Abbildung am Stück zu sehen sein (Entscheidung des Autors, 15.10.2026). */
export const VERWEILZEIT_MS = 30_000;

/** Beispiel: useGesehen("1.26") auf Abb. 1.26; nach 30 Sekunden zählt sie. undefined tut nichts. */
export function useGesehen(abbildung: string | undefined): void {
  useEffect(() => {
    if (!abbildung) return undefined;
    let uhr: number | undefined;
    const starte = () => {
      window.clearTimeout(uhr);
      if (document.visibilityState === "hidden") return;
      uhr = window.setTimeout(() => {
        void aendere((daten) => markiereGesehen(daten, abbildung, new Date()));
      }, VERWEILZEIT_MS);
    };
    starte();
    document.addEventListener("visibilitychange", starte);
    return () => {
      window.clearTimeout(uhr);
      document.removeEventListener("visibilitychange", starte);
    };
  }, [abbildung]);
}
