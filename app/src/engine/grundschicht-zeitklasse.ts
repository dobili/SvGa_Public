/**
 * Die Grundschicht je Zeitklasse (0.2.131, Empfehlung an den Autor, angenommen am 25.10.2026):
 * In Blitz streut die Engine-Suche einer Stufe breiter, in Klassisch enger, wie ein Mensch mit
 * weniger oder mehr Zeit.
 *
 * Rolle im Gesamtbild: Die Umrechnung der Wertung (engine/zeitklassenabstand.ts) erreicht nur das
 * Wahlmodell. Die Prüfmessung vom 25.10.2026 zeigte: Die Grundschicht trägt den größten Teil der
 * Stärke, und ohne eigenen Zeitklassenfaktor spielten die Stufen in Blitz so stark wie in
 * Schnellschach (Anker Stufe 2, 3, 5: 950, 1264, 1875 statt 839, 1078, 1537). Der Faktor wirkt auf
 * tau (engine/grundschicht.ts): größer heißt breiter streuen, also schwächer.
 * Startwerte: benötigte Verschiebung (Lichess-Abstand der Stufe plus gemessener Überschuss) durch
 * die Elo je Faktor e auf tau aus der Eichung vom 22.10.2026 (Tiefe 1: etwa 150, Tiefe 8: etwa
 * 210); nachgemessen in den Ankern (docs/ENTSCHEIDUNGEN.md, „Bots als ein Mensch mit drei
 * Wertungen“). Stufe 1 zieht ohnehin fast zufällig, Stufe 10 (volle Engine) hat keine Grundschicht.
 * Abhängigkeiten: engine/stufen.ts (Typ), spiel/elomodell-daten.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import type { Stufennummer } from "./stufen";

/** Faktor auf tau je Stufe 1 bis 9; Schnellschach ist die Eichung (Faktor 1). */
const TAU_FAKTOR: Readonly<Record<"blitz" | "classical", readonly number[]>> = {
  blitz: [1, 2.4, 3.5, 3.5, 3.7, 2.5, 2.1, 1.8, 1.6],
  classical: [1, 0.75, 0.75, 0.75, 0.75, 0.85, 0.85, 0.85, 0.85],
};

/**
 * Der Faktor auf tau der Grundschicht einer Stufe in einer Zeitklasse.
 * Beispiel: Stufe 3 in Blitz → 3,5 (streut breiter), in Klassisch → 0,75, in Schnellschach → 1.
 * Sonderfall: Stufe 10 und unbekannte Nummern → 1.
 */
export function tauFaktor(nummer: Stufennummer, tempo: Wertungstempo): number {
  if (tempo === "rapid") return 1;
  return TAU_FAKTOR[tempo][nummer - 1] ?? 1;
}
