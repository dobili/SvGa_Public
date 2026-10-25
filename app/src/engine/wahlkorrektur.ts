/**
 * Die Wertung, die eine Stufe in Blitz und Klassisch an das Wahlmodell gibt (0.2.131, Empfehlung
 * an den Autor, angenommen am 25.10.2026): die Wertung desselben Menschen in der Zeitklasse
 * (engine/zeitklassenabstand.ts) plus eine geeichte Korrektur je Stufe.
 *
 * Rolle im Gesamtbild: Stufen mit menschlichen Fehlern (alle Bots, die Nm-Stufen der Messung)
 * wählen ihren Zug mit dem Wahlmodell aus dem Kandidatenpool (engine/menschenwahl.ts); seine
 * Wertung bestimmt ihre Stärke. Die Prüfmessung vom 25.10.2026 (Anker, je 40 Partien gegen sich
 * selbst, Tiefe 18) zeigte: Mit der reinen Umrechnung spielten die Stufen in Blitz 110 bis 340
 * stärker als ihre Blitz-Zahl (Stufe 2, 3, 5: 950, 1264, 1875 statt 839, 1078, 1537), in
 * Klassisch passend. Die Korrektur gleicht das aus: benötigte Verschiebung durch etwa 0,75 Elo
 * Stärke je Elo Wertung (Steigung der Stufen in Schnellschach, engine/botstaerke-daten.ts).
 * Stufe 1 lag schon passend (Anker 593, Zahl 667).
 * Stand Runde 4 (25.10.2026): Die Messung gab dem Wahlmodell bis Runde 3 die Zeitklasse nicht mit
 * (engine/messspieler.testhilfe.ts), die App schon; die Anker oben maßen also Schnellschach-Wahl
 * mit Blitz-Uhr. Deshalb steht die Korrektur auf null, bis Runde 4 mit Zeitklasse misst.
 * Nachmessung: docs/ENTSCHEIDUNGEN.md, „Bots als ein Mensch mit drei Wertungen“.
 * Abhängigkeiten: engine/zeitklassenabstand.ts, engine/stufen.ts (Typ), spiel/elomodell-daten.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import type { Stufe } from "./stufen";
import { wertungInZeitklasse } from "./zeitklassenabstand";

/** Korrektur der Wertung (Elo) je Stufe 1 bis 9; Stufe 10 (volle Engine) braucht keine. */
const KORREKTUR: Readonly<Record<"blitz" | "classical", readonly number[]>> = {
  blitz: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  classical: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

/**
 * Die Wertung für Wahlmodell und Zeitnot einer Stufe in einer Zeitklasse.
 * Beispiel: Stufe 3 (Zielwertung 900) in Blitz → etwa 792; in Schnellschach 900.
 * Sonderfall: Stufe 10 und Schnellschach ohne Korrektur.
 */
export function wahlwertung(stufe: Stufe, tempo: Wertungstempo): number {
  const umgerechnet = wertungInZeitklasse(stufe.wertung, tempo);
  if (tempo === "rapid") return umgerechnet;
  return umgerechnet + (KORREKTUR[tempo][stufe.nummer - 1] ?? 0);
}
