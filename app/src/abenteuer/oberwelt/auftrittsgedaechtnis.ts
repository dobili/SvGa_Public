/**
 * Gedächtnis der Auftritte (regeln/auftritt.ts): wer beim letzten Abbau einer Karte wo stand.
 *
 * Warum im Speicher der Seite und nicht im Spielstand: Gebraucht wird es nur, solange der Held auf
 * derselben Karte bleibt, auch über eine Partie hinweg (die Oberwelt wird dafür abgebaut und danach
 * neu aufgebaut, das Modul bleibt geladen). Nach dem Neuladen der Seite gibt es nichts zu vergleichen;
 * die Figuren stehen dann an ihrem Platz wie bisher. Warten (useWarten.ts) vergisst die Aufstellung:
 * Nach Stunden im Zeitraffer sind neue Figuren einfach da, statt vor den Augen hereinzukommen.
 * Je Spielstand (Hauptmenü, 27.11.2026): Die Aufstellung gilt nur für den Platz, auf dem sie
 * gemerkt wurde. Lädt der Leser einen anderen Spielstand auf derselben Karte, stehen dessen
 * Figuren einfach da, statt vor den Augen herein- oder hinauszugehen, als hätte sich die Welt des
 * anderen Stands verändert.
 * Rolle im Gesamtbild: useWeltladen.ts merkt beim Abbau und liest beim Aufbau.
 * Abhängigkeiten: regeln/auftritt.ts (nur Typen).
 */
import type { Aufstellung } from "../regeln/auftritt";

let gemerkt: Aufstellung | null = null;
/** Der Platz (Beginn des Spielstands), zu dem `gemerkt` gehört; leer: ohne Platzangabe (Tests). */
let gemerktFuer = "";
/** Der nächste Aufbau zählt nicht als Auftritt (Warten: der Zeitraffer stellt neu auf). */
let ohneNaechsten = false;

/** Merkt die Aufstellung einer Karte auf dem Platz `platz` (ersetzt die vorige). */
export function merkeAufstellung(aufstellung: Aufstellung, platz = ""): void {
  gemerkt = aufstellung;
  gemerktFuer = platz;
}

/**
 * Die zuletzt gemerkte Aufstellung für einen Aufbau auf dem Platz `platz`, oder null (auch einmal
 * nach dem Warten, und wenn sie zu einem anderen Spielstand gehört).
 */
export function gemerkteAufstellung(platz = ""): Aufstellung | null {
  if (ohneNaechsten) {
    ohneNaechsten = false;
    return null;
  }
  return gemerktFuer === platz ? gemerkt : null;
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
  gemerktFuer = "";
  ohneNaechsten = false;
}
