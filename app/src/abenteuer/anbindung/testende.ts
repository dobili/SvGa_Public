/**
 * Testhilfe des Autors: eine Partie des Abenteuers sofort mit Sieg, Remis oder Niederlage beenden.
 *
 * Rolle im Gesamtbild: Der Autor spielt die Beta von vorn bis hinten durch und will dabei nicht
 * jede Partie ausspielen (Wunsch vom 11.11.2026). Die Hülle der Partie zeigt dafür drei Knöpfe,
 * solange nicht für die Leser gebaut wird (`__VEROEFFENTLICHUNG__`). Das Ergebnis läuft über
 * denselben Weg wie ein echtes Ende, damit Ergebniskarte, Nadeln und Geschichte gleich reagieren.
 * Dasselbe gilt für Rätsel (Aufgabenrunde mit Endspielen, Erinnerung, Gedächtnisstellung): „Bestehen“
 * und „Verfehlen“ melden das Ergebnis über den Rückruf, den auch die echte Runde benutzt.
 * Abhängigkeiten: spiel/partie.ts, spiel/ablauf.ts, training/wiederholung.ts.
 * Beispiel: Leser Weiß, Knopf „Gewinnen“ → ende { art: „aufgabe“, sieger: „white“ }.
 */
import { pausiere } from "../../spiel/ablauf";
import type { Partie } from "../../spiel/partie";
import type { Antwortergebnis } from "../../training/wiederholung";

/** Die drei Ausgänge, die der Autor erzwingen kann. */
export type Testausgang = "sieg" | "remis" | "niederlage";

/** Die Knöpfe gibt es nur in Fassungen für den Autor, nie in der Veröffentlichung. */
export const TESTKNOEPFE_AN: boolean = !__VEROEFFENTLICHUNG__;

/**
 * Beendet die Partie mit dem gewünschten Ausgang aus Sicht des Lesers.
 *
 * Warum als Aufgabe und vereinbartes Remis: Diese Enden brauchen keine passende Stellung auf dem
 * Brett; „matt“ ohne Matt widerspräche den Regeln (Kapitel 0, Ende der Partie).
 * Eingaben: die laufende Partie, der Ausgang, die Uhrzeit in Millisekunden.
 * Ausgabe: die beendete Partie mit angehaltener Uhr.
 * Sonderfall: Eine schon beendete Partie bleibt, wie sie ist.
 */
export function mitTestende(partie: Partie, ausgang: Testausgang, jetztMs: number): Partie {
  if (partie.ende) return partie;
  const angehalten = pausiere(partie, jetztMs);
  if (ausgang === "remis") return { ...angehalten, ende: { art: "vereinbart" } };
  const eigene = partie.einstellung.eigeneFarbe;
  const andere = eigene === "white" ? "black" : "white";
  return { ...angehalten, ende: { art: "aufgabe", sieger: ausgang === "sieg" ? eigene : andere } };
}

/**
 * Antworten einer ganzen Runde für die Testknöpfe „Bestehen“ und „Verfehlen“.
 *
 * Warum alle gleich: Jede Regel des Spiels (Quote, zweite Runde, R31) besteht mit lauter richtigen
 * und scheitert mit lauter falschen Antworten; der Autor muss die Schwelle nicht kennen.
 * Eingaben: Zahl der Aufgaben der Runde, gewünschter Ausgang. Ausgabe: je Aufgabe eine Antwort.
 * Beispiel: testantworten(3, true) → ["richtig", "richtig", "richtig"].
 * Sonderfall: Eine Runde ohne Aufgaben ergibt eine leere Liste.
 */
export function testantworten(anzahl: number, bestanden: boolean): Antwortergebnis[] {
  return Array.from({ length: Math.max(0, anzahl) }, () => (bestanden ? "richtig" : "falsch"));
}
