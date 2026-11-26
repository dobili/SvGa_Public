/**
 * Zeitbasis der Oberwelt: wie Phaser die Zeit zwischen zwei Bildern an die Welt weitergibt.
 *
 * Rolle im Gesamtbild: Einstellung für oberweltspiel.ts (Phaser.Game, Eintrag `fps`).
 * Warum: Befund des Autors (iPhone, 26.11.2026): Nach jedem Kartenwechsel lief das Spiel 2 bis 3
 * Sekunden wie in Zeitlupe. Die App startet je Karte ein neues Phaser-Spiel, und Phaser begrenzt in
 * den ersten `panicMax` Bildern (Vorgabe 120) das Zeitdelta auf ein Sechzigstel Sekunde
 * (TimeStep.smoothDelta). Genau dann sind die Bilder lang (Texturen laden, Aufbau, langsames Handy),
 * und die Welt lief entsprechend langsamer, statt aufzuholen: bei 30 Bildern je Sekunde mit halbem
 * Tempo, vier Sekunden lang. Messung in tests/e2e/abenteuer-zeitlupe.spec.ts.
 * Abhängigkeiten: phaser (nur der Typ).
 */
import type Phaser from "phaser";

/**
 * Einstellung für Phasers Takt. Ohne Anlaufbegrenzung (`panicMax: 0`) läuft die Welt ab dem ersten
 * Bild in echter Zeit. Was bleibt (Phaser-Vorgaben, bewusst):
 * - Glättung über die letzten zehn Bilder (`smoothStep`): verteilt ein langes Bild auf die
 *   folgenden, die Zeit insgesamt bleibt gleich.
 * - Ein Bild über 200 ms (`min: 5` Bilder je Sekunde) zählt wie das vorige: Nach einer langen Pause
 *   (Bildaufbau, App im Hintergrund) springt niemand durch Wände; die Welt hält kurz an.
 * Beispiel: Ankunft auf einer Karte, die ersten Bilder dauern 40 ms → der Held läuft gleich
 * 40 ms weit je Bild, statt 16,7 ms (vorher: Zeitlupe mit 42 % Tempo).
 */
export const ZEITBASIS: Phaser.Types.Core.FPSConfig = {
  panicMax: 0,
  smoothStep: true,
};
