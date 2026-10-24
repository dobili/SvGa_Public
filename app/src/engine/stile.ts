/**
 * Die sieben Spielstile der Bots (Teil D, Entscheidung des Autors 23.10.2026) als Verschiebungen
 * der Stilmerkmale im Wahlmodell (0.2.124).
 *
 * Rolle im Gesamtbild: Aus 3 889 Lichess-Spielern ergaben sich drei Stilachsen (Königsangriff,
 * Aktivität, Bauernsturm gegen Vereinfachen; docs/ENTSCHEIDUNGEN.md „Spielstile der Bots“). Ein
 * Stil liegt eine Standardabweichung von der Mitte auf einer Achse; je Bot genau ein Stil. Hier
 * wird jeder Stil auf die Stilmerkmale des Wahlmodells (engine/stilmerkmale.ts) abgebildet:
 * Königsangriff → Schach und Königsnähe, Aktivität → Schlag und Vorwärts gegen Rückzug, Bauernsturm
 * gegen Vereinfachen → Bauernsturm gegen Abtausch. Die Stärke STILSTAERKE entspricht etwa der
 * Streuung der Menschen (Nachspielen in Teil E, Restplan 8). Der Regler −2 bis 2 eigener Gegner
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

/** Verschiebung des Nutzens je Stilmerkmal (etwa eine Standardabweichung der Spieler). */
const STILSTAERKE = 0.5;

type Stilverschiebung = Readonly<Partial<Record<keyof Stilmerkmale, number>>>;

const STILE: Readonly<Record<Stilname, Stilverschiebung>> = {
  angreifer: { schach: STILSTAERKE, koenigsnaehe: STILSTAERKE },
  positionsspieler: { schach: -STILSTAERKE, koenigsnaehe: -STILSTAERKE },
  taktiker: { schlag: STILSTAERKE, vorwaerts: STILSTAERKE, rueckzug: -STILSTAERKE },
  verteidiger: { schlag: -STILSTAERKE, vorwaerts: -STILSTAERKE, rueckzug: STILSTAERKE },
  draufgaenger: { bauernsturm: STILSTAERKE, vorwaerts: STILSTAERKE, tausch: -STILSTAERKE },
  vereinfacher: { tausch: STILSTAERKE, bauernsturm: -STILSTAERKE },
  universell: {},
};

/**
 * Die Verschiebung eines Stils. Beispiel: „angreifer“ → Schach und Königsnähe je +0,5;
 * „universell“ → nichts.
 */
export function stilverschiebung(stil: Stilname): Stilverschiebung {
  return STILE[stil];
}
