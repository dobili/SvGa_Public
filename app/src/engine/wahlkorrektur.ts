/**
 * Die Wertung, die eine Stufe in Blitz und Klassisch an das Wahlmodell gibt (0.2.131, Empfehlung
 * an den Autor, angenommen am 25.10.2026): die Wertung desselben Menschen in der Zeitklasse
 * (engine/zeitklassenabstand.ts) plus eine geeichte Korrektur je Stufe.
 *
 * Rolle im Gesamtbild: Stufen mit menschlichen Fehlern (alle Bots, die Nm-Stufen der Messung)
 * wählen ihren Zug mit dem Wahlmodell aus dem Kandidatenpool (engine/menschenwahl.ts); seine
 * Wertung bestimmt ihre Stärke. Die Prüfmessung vom 25.10.2026 (Anker, je 40 Partien gegen sich
 * selbst mit Blitz-Uhr, Tiefe 18, Runde 4 mit der Zeitklasse im Wahlmodell wie in der App) ergab
 * für Stufe 2 bis 7 die Anker 879, 1214, 1543, 1807, 1864, 2021 gegen die Blitz-Zahlen 839, 1078,
 * 1278, 1537, 1770, 1998: Stufe 2 und 7 passen (±65), 3 bis 6 spielen 94 bis 270 zu stark. Die
 * Korrektur für 3 bis 6 ist diese Abweichung durch etwa 0,75 Elo Stärke je Elo Wertung (Steigung
 * der Stufen in Schnellschach, engine/botstaerke-daten.ts); 1, 8 und 9 bleiben wie ihre Nachbarn
 * ohne Korrektur; Runde 5 mit Korrektur: Stufe 3 bis 5 auf −49, −21, +13 (Stufe 6 misst nahe der
 * Sättigung nicht trennscharf: 1950 bei geringerer Genauigkeit als ohne Korrektur).
 * Klassisch (Runde 4): Stufe 2 bis 7 Anker 1179, 1414, 1600, 1629, 1857, 2050 gegen 1177, 1438,
 * 1597, 1776, 1956, 2158. Stufe 2 bis 4 passen; Stufe 5 mit +195 ergab 1950, also wirkt die
 * Korrektur in Klassisch mit etwa 1,65 statt 0,75; +90 liegt zwischen beiden Messungen auf der
 * Zahl. Stufe 6 und 7 bleiben ohne: Bei 81 bis 83 % Genauigkeit sättigen die Anker und messen zu
 * niedrig. (Runde 1 bis 3 gaben dem Wahlmodell die Zeitklasse nicht mit und gelten nicht.)
 * Nachmessung: docs/ENTSCHEIDUNGEN.md, „Bots als ein Mensch mit drei Wertungen“.
 * Mit Maia (seit 0.2.144): Die Wertung geht auch an Maia, deren Netz nach Wertungsklassen wählt;
 * dieselbe Korrektur wirkte dort stärker. Prüfmessung vom 25./26.10.2026 (Blitz, Plan C, je 40
 * Partien): ohne Maia liegen die Anker im Rauschen (±110 um die erwartete Zahl, nur Stufe 8 höher);
 * mit Maia spielt Stufe 4 etwa 120 bis 260 und Stufe 5 etwa 450 zu schwach, Stufe 7 etwa 130 bis
 * 280 zu stark. Darum mit Maia eine eigene Reihe: Stufe 4 halb, Stufe 5 ohne Korrektur, Stufe 7
 * mit −150 (Steigung etwa 0,75 wie oben); Nachprüfung auf den Zweigen pruefung-blitz-N-maia2.
 * Abhängigkeiten: engine/zeitklassenabstand.ts, engine/stufen.ts (Typ), spiel/elomodell-daten.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import type { Stufe } from "./stufen";
import { wertungInZeitklasse } from "./zeitklassenabstand";

type Zeitklasse = "blitz" | "classical";

/** Korrektur der Wertung (Elo) je Stufe 1 bis 9; Stufe 10 (volle Engine) braucht keine. */
const KORREKTUR: Readonly<Record<Zeitklasse, readonly number[]>> = {
  blitz: [0, 0, -180, -350, -360, -125, 0, 0, 0],
  classical: [0, 0, 0, 0, 90, 0, 0, 0, 0],
};

/** Dieselbe Korrektur, wenn Maia mitspielt (seit 0.2.144, Herleitung im Dateikopf). */
const KORREKTUR_MAIA: Readonly<Record<Zeitklasse, readonly number[]>> = {
  blitz: [0, 0, -180, -175, 0, -125, -150, 0, 0],
  classical: [0, 0, 0, 0, 90, 0, 0, 0, 0],
};

/**
 * Die Wertung für Wahlmodell und Zeitnot einer Stufe in einer Zeitklasse.
 * `maia`: Spielt Maia mit, gilt die eigene Reihe KORREKTUR_MAIA.
 * Beispiel: Stufe 3 (Zielwertung 900) in Blitz → etwa 792 − 180 = 612; in Schnellschach 900.
 * Stufe 5 in Blitz mit Maia: ohne Korrektur.
 * Sonderfall: Stufe 10 und Schnellschach ohne Korrektur.
 */
export function wahlwertung(stufe: Stufe, tempo: Wertungstempo, maia = false): number {
  const umgerechnet = wertungInZeitklasse(stufe.wertung, tempo);
  if (tempo === "rapid") return umgerechnet;
  const reihe = maia ? KORREKTUR_MAIA : KORREKTUR;
  return umgerechnet + (reihe[tempo][stufe.nummer - 1] ?? 0);
}
