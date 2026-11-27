/**
 * Spielsitzung des Abenteuers: Ist der Leser in diesem Tab schon über das Hauptmenü in die Welt
 * gegangen? Dann führt der nächste Einstieg gleich wieder in die Welt, sonst erst Startbild und
 * Hauptmenü (Wunsch des Autors, 27.11.2026).
 *
 * Warum im Sitzungsspeicher des Tabs (sessionStorage): Der Rückweg aus Partie, Aufgabenrunde und
 * Besprechung baut die Ansicht neu auf und soll in der Welt landen, nicht im Hauptmenü. Ebenso ein
 * Neuladen: iOS lädt Seiten im Hintergrund oft neu, und wer kurz eine Nachricht las, soll weiter
 * dort stehen, wo er war. Ein neuer Start der App (neuer Tab, installierte App geöffnet) beginnt
 * mit leerem Sitzungsspeicher und zeigt das Hauptmenü. „Zurück zur App“ und „Hauptmenü“ beenden
 * die Sitzung. Gemerkt wird die Kennung des Platzes (speicherplaetze.ts): Lädt ein anderer Tab
 * einen anderen Spielstand, passt sie nicht mehr, und dieser Tab zeigt wieder das Hauptmenü.
 * Abhängigkeiten: app/merker.ts, ui/komponenten/rahmen/Startanimation.tsx (Schalter).
 */
import { liesMerker } from "../../app/merker";
import { MERKER_STARTANIMATION } from "../../ui/komponenten/rahmen/Startanimation";

/** Name des Eintrags im Sitzungsspeicher (Vorsilbe wie app/merker.ts). */
const SITZUNG = "svga.abenteuer.sitzung";

/**
 * Läuft das Startbild (Startbild.tsx) überhaupt? Nein, wenn der Leser die Startanimation der App
 * in den Einstellungen ausgeschaltet hat (Merker „startanimation“).
 */
export function startbildErlaubt(): boolean {
  return liesMerker(MERKER_STARTANIMATION) !== "aus";
}

/**
 * Testschalter für Oberflächentests (wie TESTSCHALTER_OHNE_MAIA in maiapflicht.ts): Mit ihm führt
 * ein vorhandener Spielstand gleich in die Welt, ohne Startbild und Hauptmenü, wie vor dem
 * 27.11.2026. Die meisten Tests prüfen das Spiel, nicht den Einstieg; abenteuer-hauptmenue.spec.ts
 * prüft den Einstieg ohne den Schalter.
 */
export const TESTSCHALTER_OHNE_HAUPTMENUE = "__abenteuerOhneHauptmenue";

/** Ist der Einstieg über das Hauptmenü abgeschaltet (nur Oberflächentests)? */
export function ohneHauptmenue(): boolean {
  return (
    typeof window !== "undefined" && Reflect.get(window, TESTSCHALTER_OHNE_HAUPTMENUE) === true
  );
}

/** Der Platz, mit dem dieser Tab in der Welt ist, oder null; ein gesperrter Speicher gilt als leer. */
export function sitzungsplatz(): string | null {
  try {
    return window.sessionStorage.getItem(SITZUNG);
  } catch (fehler) {
    console.warn("Sitzungsspeicher nicht lesbar:", fehler);
    return null;
  }
}

/** Merkt, dass dieser Tab mit dem Platz `kennung` in der Welt ist. */
export function merkeSitzung(kennung: string): void {
  try {
    window.sessionStorage.setItem(SITZUNG, kennung);
  } catch (fehler) {
    console.warn("Sitzungsspeicher nicht beschreibbar:", fehler);
  }
}

/**
 * Beendet die Sitzung: Der nächste Einstieg zeigt das Hauptmenü. Auch für den Reiter der App, der
 * das Abenteuer öffnet, falls er beim Verlassen das Hauptmenü wünscht.
 */
export function beendeSitzung(): void {
  try {
    window.sessionStorage.removeItem(SITZUNG);
  } catch (fehler) {
    console.warn("Sitzungsspeicher nicht beschreibbar:", fehler);
  }
}
