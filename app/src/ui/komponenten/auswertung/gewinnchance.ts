/**
 * Gewinnchance der ziehenden Seite vor und nach einem Zug, in ganzen Prozent, mit dem Namen der
 * Seite: für die Sätze der Auswertung und des Rückblicks. Grund (Rückmeldung des Autors): Die
 * Bauerneinheiten der Engine passten weder zu chess.com noch zur Wertungstabelle des Buches.
 * Abhängigkeiten: spiel/genauigkeit.ts (gewinnwahrscheinlichkeit, wie Lichess), i18n.
 */
import { t } from "../../../i18n/sprache";
import { gewinnwahrscheinlichkeit } from "../../../spiel/genauigkeit";

const PROZENT = 100;

export interface Chance {
  readonly seite: string;
  readonly vorher: number;
  readonly nachher: number;
}

/**
 * Eingaben: Werte je Stellung aus Sicht von Weiß (Bauerneinheiten), Index des Zuges, zieht Weiß.
 * Beispiel: 10. Tab1?? mit +0,1 vorher und −5,8 danach → Weiß, 51 %, 10 %.
 */
export function gewinnchanceVorNach(
  werte: readonly number[],
  index: number,
  weissZieht: boolean,
): Chance {
  const fuer = (wert: number) => {
    const weiss = gewinnwahrscheinlichkeit(wert);
    return Math.round(weissZieht ? weiss : PROZENT - weiss);
  };
  return {
    seite: t(weissZieht ? "farbe.w" : "farbe.b"),
    vorher: fuer(werte[index] ?? 0),
    nachher: fuer(werte[index + 1] ?? 0),
  };
}
