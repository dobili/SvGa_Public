/**
 * Die sieben Spielstile der Bots (Teil D, Entscheidung des Autors 23.10.2026) als Verschiebungen
 * der Stilmerkmale im Wahlmodell (0.2.124).
 *
 * Rolle im Gesamtbild: Aus 3 889 Lichess-Spielern ergaben sich drei Stilachsen (Königsangriff,
 * Aktivität, Bauernsturm gegen Vereinfachen; docs/ENTSCHEIDUNGEN.md „Spielstile der Bots“). Ein
 * Stil liegt eine Standardabweichung von der Mitte auf einer Achse; je Bot genau ein Stil. Hier
 * wird jeder Stil auf die Stilmerkmale des Wahlmodells (engine/stilmerkmale.ts) abgebildet:
 * Königsangriff → Schach und Königsnähe, Aktivität → Schlag und Vorwärts gegen Rückzug, Bauernsturm
 * gegen Vereinfachen → Bauernsturm gegen Abtausch. Die Stärke je Merkmal (STAERKE) ist an der
 * Streuung der Menschen geeicht (etwa anderthalb Standardabweichungen). Der Regler −2 bis 2 eigener Gegner
 * (engine/stil.ts, engine/wahlschritt.ts) bleibt daneben bestehen.
 * Abhängigkeiten: engine/stilmerkmale.ts (Namen der Merkmale).
 */
import type { Stilmerkmale } from "./stilmerkmale";

export const STILNAMEN = [
  "angreifer",
  "positionsspieler",
  "taktiker",
  "verteidiger",
  "draufgaenger",
  "vereinfacher",
  "universell",
] as const;
export type Stilname = (typeof STILNAMEN)[number];

/**
 * Verschiebung des Nutzens je Stilmerkmal, so gewählt, dass ein Stil den Anteil der Züge mit dem
 * Merkmal um etwa anderthalb Standardabweichungen der Spieler verschiebt (deutlich erkennbar, aber
 * im Rahmen echter Spieler; Eichung 24.10.2026 an den Spielerprofilen, Schnellschach 1200:
 * Streuung zwischen Spielern Schach 2,5, Königsnähe 3,3, Schlag 2,3, Vorwärts 3,3, Rückzug 2,2,
 * Bauernsturm 1,7, Abtausch 1,3 Prozentpunkte; Wirkung im Wahlmodell je 0,5 Verschiebung:
 * +3,1, +4,2, +4,7, +8,2, −4,7, +4,9, +1,5 Punkte; lokal buch/arbeit/zugwahl/stilstaerke.py und
 * spielerprofil/stilstreuung.py).
 */
const STAERKE: Readonly<Record<keyof Stilmerkmale, number>> = {
  schach: 0.6,
  koenigsnaehe: 0.6,
  schlag: 0.4,
  vorwaerts: 0.3,
  rueckzug: 0.35,
  bauernsturm: 0.25,
  tausch: 0.6,
};

type Stilverschiebung = Readonly<Partial<Record<keyof Stilmerkmale, number>>>;

const STILE: Readonly<Record<Stilname, Stilverschiebung>> = {
  angreifer: { schach: STAERKE.schach, koenigsnaehe: STAERKE.koenigsnaehe },
  positionsspieler: { schach: -STAERKE.schach, koenigsnaehe: -STAERKE.koenigsnaehe },
  taktiker: { schlag: STAERKE.schlag, vorwaerts: STAERKE.vorwaerts, rueckzug: -STAERKE.rueckzug },
  verteidiger: {
    schlag: -STAERKE.schlag,
    vorwaerts: -STAERKE.vorwaerts,
    rueckzug: STAERKE.rueckzug,
  },
  draufgaenger: {
    bauernsturm: STAERKE.bauernsturm,
    vorwaerts: STAERKE.vorwaerts,
    tausch: -STAERKE.tausch,
  },
  vereinfacher: { tausch: STAERKE.tausch, bauernsturm: -STAERKE.bauernsturm },
  universell: {},
};

/**
 * Die Verschiebung eines Stils. Beispiel: „angreifer“ → Schach und Königsnähe je +0,6;
 * „universell“ → nichts.
 */
export function stilverschiebung(stil: Stilname): Stilverschiebung {
  return STILE[stil];
}
