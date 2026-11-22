/**
 * Lässt die Spieluhr laufen (regeln/spieluhr.ts, Wunsch des Autors, 22.11.2026): nur solange die
 * Oberwelt offen und frei ist (kein Dialog, keine Partie, kein Laden, kein Tagebuch, keine
 * Meldung) und die Seite sichtbar ist. Geschlossene App: keine Zeit.
 *
 * Warum nicht bei jedem Bild schreiben: Der Spielstand geht in die Datenbank der App. Die Uhr
 * sammelt deshalb echte Zeit und schreibt höchstens alle SICHERN_MS und sofort, wenn eine neue
 * Stunde beginnt; dann wechselt auch die Tönung (weich, toenungsschicht.ts). Statisten wechseln
 * nicht hier, sondern erst beim nächsten Aufbau einer Karte, nie vor den Augen des Spielers.
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx. Abhängigkeiten: kern.ts, uhrtoenung.ts.
 */
import { useEffect, useRef } from "react";
import { rueckeVor, spielminuteJetzt, stundeAus } from "../regeln/spieluhr";
import type { Oberweltkern } from "./kern";
import { toenungJetzt } from "./uhrtoenung";

/** Takt der Uhr in echten Millisekunden. */
const TAKT_MS = 1000;
/** Spätestens so oft schreibt die Uhr in den Spielstand. */
const SICHERN_MS = 20_000;
/** Längere Lücken zwischen zwei Takten (Gerät schlief) zählen nicht. */
const HOECHSTENS_LUECKE_MS = 5000;

/**
 * Hängt die Uhr an die Oberwelt. Eingaben: Kern, ob die Welt gerade frei ist.
 * Beispiel: 15 echte Minuten frei am Morgen → die Uhr springt von 6 auf 9 Uhr (in Schritten).
 */
export function useSpieluhr(k: Oberweltkern, frei: boolean): void {
  const freiRef = useRef(frei);
  useEffect(() => {
    freiRef.current = frei;
  }, [frei]);
  useEffect(() => {
    let letzt = performance.now();
    let offen = 0;
    const schreibe = (stundenwechsel: boolean) => {
      const stand = k.standRef.current;
      if (!stand || offen <= 0) return;
      const neu = { ...stand, spieluhr: rueckeVor(spielminuteJetzt(stand), offen) };
      offen = 0;
      k.schreibe(neu);
      const welt = k.weltRef.current;
      if (stundenwechsel && welt) k.zeigeToenung(toenungJetzt(welt, neu));
    };
    const takt = window.setInterval(() => {
      const jetzt = performance.now();
      const luecke = jetzt - letzt;
      letzt = jetzt;
      const stand = k.standRef.current;
      if (!stand || !freiRef.current || document.visibilityState !== "visible") return;
      offen += Math.min(luecke, HOECHSTENS_LUECKE_MS);
      const alt = spielminuteJetzt(stand);
      const wechsel = stundeAus(rueckeVor(alt, offen)) !== stundeAus(alt);
      if (wechsel || offen >= SICHERN_MS) schreibe(wechsel);
    }, TAKT_MS);
    return () => {
      window.clearInterval(takt);
      schreibe(false);
    };
    // Einmal je Oberwelt; Kern und Freiheit liest die Uhr über Refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
