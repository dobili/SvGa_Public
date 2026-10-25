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
 * ohne Korrektur. (Runde 1 bis 3 gaben dem Wahlmodell die Zeitklasse nicht mit und gelten nicht.)
 * Nachmessung: docs/ENTSCHEIDUNGEN.md, „Bots als ein Mensch mit drei Wertungen“.
 * Abhängigkeiten: engine/zeitklassenabstand.ts, engine/stufen.ts (Typ), spiel/elomodell-daten.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import type { Stufe } from "./stufen";
import { wertungInZeitklasse } from "./zeitklassenabstand";

/** Korrektur der Wertung (Elo) je Stufe 1 bis 9; Stufe 10 (volle Engine) braucht keine. */
const KORREKTUR: Readonly<Record<"blitz" | "classical", readonly number[]>> = {
  blitz: [0, 0, -180, -350, -360, -125, 0, 0, 0],
  classical: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

/**
 * Die Wertung für Wahlmodell und Zeitnot einer Stufe in einer Zeitklasse.
 * Beispiel: Stufe 3 (Zielwertung 900) in Blitz → etwa 792 − 180 = 612; in Schnellschach 900.
 * Sonderfall: Stufe 10 und Schnellschach ohne Korrektur.
 */
export function wahlwertung(stufe: Stufe, tempo: Wertungstempo): number {
  const umgerechnet = wertungInZeitklasse(stufe.wertung, tempo);
  if (tempo === "rapid") return umgerechnet;
  return umgerechnet + (KORREKTUR[tempo][stufe.nummer - 1] ?? 0);
}
