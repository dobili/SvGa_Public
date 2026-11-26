/**
 * Gedächtnis der Auftritte (regeln/auftritt.ts): wer beim letzten Abbau einer Karte wo stand.
 *
 * Warum im Speicher der Seite und nicht im Spielstand: Gebraucht wird es nur, solange der Held auf
 * derselben Karte bleibt, auch über eine Partie hinweg (die Oberwelt wird dafür abgebaut und danach
 * neu aufgebaut, das Modul bleibt geladen). Nach dem Neuladen der Seite gibt es nichts zu vergleichen;
 * die Figuren stehen dann an ihrem Platz wie bisher. Warten (useWarten.ts) vergisst die Aufstellung:
 * Nach Stunden im Zeitraffer sind neue Figuren einfach da, statt vor den Augen hereinzukommen.
 * Rolle im Gesamtbild: useWeltladen.ts merkt beim Abbau und liest beim Aufbau.
 * Abhängigkeiten: regeln/auftritt.ts (nur Typen).
 */
import type { Aufstellung } from "../regeln/auftritt";

let gemerkt: Aufstellung | null = null;
/** Der nächste Aufbau zählt nicht als Auftritt (Warten: der Zeitraffer stellt neu auf). */
let ohneNaechsten = false;

/** Merkt die Aufstellung einer Karte (ersetzt die vorige). */
export function merkeAufstellung(aufstellung: Aufstellung): void {
  gemerkt = aufstellung;
}

/** Die zuletzt gemerkte Aufstellung für einen Aufbau, oder null (auch einmal nach dem Warten). */
export function gemerkteAufstellung(): Aufstellung | null {
  if (!ohneNaechsten) return gemerkt;
  ohneNaechsten = false;
  return null;
}

/**
 * Der nächste Aufbau soll keine Auftritte zeigen: Warten (useWarten.ts) stellt die Karte nach der
 * neuen Uhrzeit auf, und wer dann da ist, ist schon da. Der Abbau davor merkt trotzdem.
 */
export function naechsterAufbauOhneAuftritt(): void {
  ohneNaechsten = true;
}

/** Vergisst alles (Tests). */
export function vergissAufstellung(): void {
  gemerkt = null;
  ohneNaechsten = false;
}
