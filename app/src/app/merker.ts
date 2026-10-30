/**
 * Kleine Merker auf dem Gerät, etwa die zuletzt geöffnete Abbildung.
 *
 * Rolle im Gesamtbild: Nur Bequemlichkeiten, die verloren gehen dürfen (zuletzt geöffnete
 * Abbildung, Koordinaten an oder aus). Einstellungen, Lernstand und Fortschritt stehen im
 * Speicher auf IndexedDB (speicher/speicher.ts, AP 12) und ziehen mit der Datensicherung um.
 * Abhängigkeiten: keine.
 */

const VORSILBE = "svga.";

/** Wer wissen will, wenn ein Merker geschrieben oder entfernt wird (etwa die Abzeichen). */
const beobachter = new Set<(name: string) => void>();

/**
 * Meldet jede Änderung eines Merkers in dieser Sitzung mit seinem Namen. Warum: Merker liegen
 * außerhalb des Speichers; wer sie anzeigt (Abzeichen nach der Tagesaufgabe), bekäme sonst erst
 * nach einem Neuladen den neuen Stand. Ausgabe: Funktion zum Abmelden.
 */
export function beobachteMerker(rueckruf: (name: string) => void): () => void {
  beobachter.add(rueckruf);
  return () => beobachter.delete(rueckruf);
}

function benachrichtige(name: string): void {
  for (const rueckruf of beobachter) rueckruf(name);
}

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
  benachrichtige(name);
}

/** Entfernt einen Merker (nach dem Umzug in den Speicher, AP 12). */
export function entferneMerker(name: string): void {
  try {
    window.localStorage.removeItem(VORSILBE + name);
  } catch (fehler) {
    console.warn("Gerätespeicher nicht beschreibbar:", fehler);
  }
  benachrichtige(name);
}
