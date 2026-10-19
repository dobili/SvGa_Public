/**
 * Urteilswort je Phase („Hervorragend“ bis „Schwach“) aus der inneren Genauigkeit.
 *
 * Rolle im Gesamtbild: Teil der Spielstärke-Bewertung (spiel/genauigkeit.ts, das die Funktion
 * weiterreicht); seit 0.2.99 eigene Datei, damit genauigkeit.ts unter 400 Zeilen bleibt.
 * Abhängigkeiten: keine.
 */

/**
 * Urteilswort je Phase aus der inneren Genauigkeit der Phase (wie die Symbole je Phase bei
 * chess.com, Wunsch des Autors 18.10.2026): hervorragend ab 95 %, sehr gut ab 88 %, gut ab 78 %,
 * ungenau ab 68 %, fehlerhaft ab 55 %, sonst schwach. Seit 0.2.83 an der inneren Genauigkeit,
 * damit der Schalter „Genauigkeit wie“ die Wörter nicht verschiebt.
 */
export type Phasenurteil =
  "hervorragend" | "sehrGut" | "gut" | "ungenau" | "fehlerhaft" | "schwach";
const URTEILSGRENZEN: readonly (readonly [number, Phasenurteil])[] = [
  [95, "hervorragend"],
  [88, "sehrGut"],
  [78, "gut"],
  [68, "ungenau"],
  [55, "fehlerhaft"],
];
const URTEIL_SONST: Phasenurteil = "schwach";

/**
 * Das Urteilswort zu einer Genauigkeit.
 * Beispiel: Partie des Autors gegen einen 1700er-Bot, Eröffnung 96 % → hervorragend;
 * Mittelspiel 85 % → gut.
 */
export function phasenurteil(genauigkeit: number): Phasenurteil {
  return URTEILSGRENZEN.find(([grenze]) => genauigkeit >= grenze)?.[1] ?? URTEIL_SONST;
}
