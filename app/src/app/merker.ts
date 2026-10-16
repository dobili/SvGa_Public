/**
 * Kleine Merker auf dem Gerät, etwa die zuletzt geöffnete Abbildung.
 *
 * Rolle im Gesamtbild: Nur Bequemlichkeiten, die verloren gehen dürfen (zuletzt geöffnete
 * Abbildung, Koordinaten an oder aus). Einstellungen, Lernstand und Fortschritt stehen seit AP 12
 * im Speicher auf IndexedDB (speicher/speicher.ts) und ziehen mit der Datensicherung um.
 * Abhängigkeiten: keine.
 */

const VORSILBE = "svga.";

/** Liest einen Merker; ein gesperrter Gerätespeicher (privates Fenster) liefert null. */
export function liesMerker(name: string): string | null {
  try {
    return window.localStorage.getItem(VORSILBE + name);
  } catch (fehler) {
    console.warn("Gerätespeicher nicht lesbar:", fehler);
    return null;
  }
}

/** Schreibt einen Merker; schlägt das fehl, bleibt die App benutzbar und meldet es im Protokoll. */
export function schreibeMerker(name: string, wert: string): void {
  try {
    window.localStorage.setItem(VORSILBE + name, wert);
  } catch (fehler) {
    console.warn("Gerätespeicher nicht beschreibbar:", fehler);
  }
}

/** Entfernt einen Merker (nach dem Umzug in den Speicher, AP 12). */
export function entferneMerker(name: string): void {
  try {
    window.localStorage.removeItem(VORSILBE + name);
  } catch (fehler) {
    console.warn("Gerätespeicher nicht beschreibbar:", fehler);
  }
}
