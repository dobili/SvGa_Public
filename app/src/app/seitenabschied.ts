/**
 * Abschied der Seite (Neuladen, Wegnavigieren): Ablehnungen, die WebKit beim Entladen mit
 * „Context is stopped“ an offene Versprechen des Browsers schickt, gelten dann als erwartet.
 *
 * Warum (WebKit-Läufe 44657454880, 44750802847, 44754757551; 20.11.2026): Beim Neuladen mitten im
 * Gespräch, im Affentest und bei „Uhr läuft auf null“ meldete Safari eine unbehandelte Ausnahme
 * „Context is stopped“ ohne JavaScript-Stapel. WebKit stoppt beim Entladen die Schnittstellen der
 * Seite (Ton, Zwischenspeicher, Abrufe im Hintergrund) und lehnt ihre offenen Versprechen ab, auch
 * die, auf die gerade niemand wartet, weil die Seite verschwindet. Die Seite ist in diesem Moment
 * schon fort; für den Leser ist das kein Fehler.
 * Nichts wird verschluckt: Nur nach `pagehide` und nur genau diese Meldung wird als erwartet
 * behandelt und in der Konsole vermerkt; jede andere Ablehnung bleibt sichtbar. Kommt die Seite aus
 * dem Zwischenspeicher zurück (pageshow mit persisted), gilt wieder alles.
 * Abhängigkeiten: keine (Ereignisse des Fensters).
 */

/** Die Meldung, mit der WebKit beim Entladen offene Versprechen ablehnt. */
const GESTOPPT = /context is stopped/i;

/** Was beachteSeitenabschied vom Fenster braucht (im Test ein Ersatz). */
export interface Seitenfenster {
  addEventListener(art: string, hoerer: (ereignis: Event) => void): void;
}

/** Die Meldung eines abgelehnten Grundes, auch ohne Error-Objekt. Beispiel: DOMException → message. */
function meldungVon(grund: unknown): string {
  if (grund instanceof Error || grund instanceof DOMException) return grund.message;
  return typeof grund === "string" ? grund : "";
}

/**
 * Ist dieser Grund die erwartete Ablehnung beim Entladen? Eingaben: Grund, ob die Seite geht.
 * Beispiel: (DOMException „Context is stopped“, true) → true; dasselbe ohne pagehide → false.
 */
export function istAbschiedsablehnung(grund: unknown, seiteGeht: boolean): boolean {
  return seiteGeht && GESTOPPT.test(meldungVon(grund));
}

/**
 * Meldet beim Fenster an: pagehide und pageshow merken, unbehandelte Ablehnungen beim Abschied
 * vermerken statt als Fehler der Seite zu melden. Einmal beim Start (main.tsx).
 */
export function beachteSeitenabschied(fenster: Seitenfenster = window): void {
  let seiteGeht = false;
  fenster.addEventListener("pagehide", () => {
    seiteGeht = true;
  });
  fenster.addEventListener("pageshow", (ereignis) => {
    if ((ereignis as PageTransitionEvent).persisted) seiteGeht = false;
  });
  fenster.addEventListener("unhandledrejection", (ereignis) => {
    const grund = (ereignis as PromiseRejectionEvent).reason;
    if (!istAbschiedsablehnung(grund, seiteGeht)) return;
    ereignis.preventDefault();
    console.warn("Beim Verlassen der Seite abgebrochen:", grund);
  });
}
