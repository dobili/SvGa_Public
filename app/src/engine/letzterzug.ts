/**
 * Urteil der Engine über den zuletzt gespielten Zug: Zeichen (??, ?, ?!, !) und Verlust.
 *
 * Rolle im Gesamtbild: Wunsch des Autors nach dem Test von 0.2.30: In der Engine-Karte lässt sich
 * auf Wunsch der letzte Zug bewerten, mit dem Zeichen am Zielfeld. Die Engine rechnet dafür die
 * Stellung vor dem Zug; der Verlust ist der Abstand des gespielten Zuges zum besten. Die Grenzen
 * sind dieselben wie in der Auswertung nach der Partie (Konzept 8.3, spiel/auswertung.ts): „?!“ ab
 * 0,5, „?“ ab 1,2, „??“ ab 3 Bauerneinheiten. „!“ bekommt der beste Zug, wenn jeder andere
 * mindestens 1,2 kostet (der einzige gute Zug). Rein und ohne Engine testbar.
 * Abhängigkeiten: uci.ts, zugwahl.ts (Wert aus Sicht einer Seite), spiel/auswertung.ts,
 * spiel/zuege.ts.
 */
import {
  GRENZE_FEHLER,
  WERTGRENZE,
  endwert,
  zeichenFuer,
  type Zugzeichen,
} from "../spiel/auswertung";
import { fenNach, sanZuUci } from "../spiel/zuege";
import type { Variante } from "./uci";
import { wertFuer } from "./zugwahl";

export type Letztzeichen = Zugzeichen | "!";

export interface LetzterZugUrteil {
  readonly zeichen: Letztzeichen | null;
  /** Verlust gegenüber dem besten Zug in Bauerneinheiten, aus Sicht der ziehenden Seite. */
  readonly verlust: number;
  /** Bester Zug laut Engine (UCI) oder null. */
  readonly besterZug: string | null;
  readonly warBester: boolean;
}

/** Der letzte Zug und die Stellung davor. */
export interface LetzterZug {
  readonly vorherFen: string;
  readonly uci: string;
}

function begrenzt(wert: number): number {
  return Math.max(-WERTGRENZE, Math.min(WERTGRENZE, wert));
}

/**
 * Die Stellung vor dem letzten Zug eines Verlaufs und der Zug in UCI.
 * Beispiel: Abb. 1.26 (… 5. Sf3 Db6) → Stellung nach 5. Sf3 und „d8b6“. Ohne Züge: null.
 */
export function letzterZugAus(startFen: string, zuege: readonly string[]): LetzterZug | null {
  const san = zuege.at(-1);
  if (san === undefined) return null;
  let fen: string | null = startFen;
  for (const zug of zuege.slice(0, -1)) fen = fen ? fenNach(fen, zug) : null;
  const uci = fen ? sanZuUci(fen, san) : null;
  return fen && uci ? { vorherFen: fen, uci } : null;
}

/**
 * Wert der Stellung nach dem Zug aus Sicht von Weiß: beste Variante der Engine, bei Matt oder Patt
 * der Endwert (dann gibt die Engine keinen Zug her).
 */
export function wertNachDemZug(varianten: readonly Variante[], fen: string): number | null {
  const beste = varianten[0];
  return beste ? begrenzt(wertFuer(beste.wert, true)) : endwert(fen);
}

/**
 * Urteil über den letzten Zug.
 *
 * Eingaben: Varianten der Engine vor dem Zug (beste zuerst), Wert nach dem Zug aus Sicht von Weiß
 * (falls der Zug nicht unter den Varianten ist), der Zug in UCI, ob Weiß gezogen hat.
 * Ausgabe: Zeichen, Verlust, bester Zug; null ohne Varianten oder Wert.
 * Beispiel: Vorher 6. a3 +0,3, gespielt 6. Ld3 mit −0,4 → Verlust 0,7 → „?!“.
 */
export function urteilUeberLetztenZug(
  vorher: readonly Variante[],
  wertDanachWeiss: number | null,
  gespielt: string,
  weissZog: boolean,
): LetzterZugUrteil | null {
  const beste = vorher[0];
  if (!beste) return null;
  const sicht = (variante: Variante) => begrenzt(wertFuer(variante.wert, weissZog));
  const eigene = vorher.find((v) => v.zuege[0] === gespielt);
  const danach = wertDanachWeiss === null ? null : weissZog ? wertDanachWeiss : -wertDanachWeiss;
  const gespielterWert = eigene ? sicht(eigene) : danach;
  if (gespielterWert === null) return null;
  const verlust = Math.max(0, sicht(beste) - gespielterWert);
  const warBester = beste.zuege[0] === gespielt;
  const zweite = vorher[1];
  const einziger =
    warBester && zweite !== undefined && sicht(beste) - sicht(zweite) >= GRENZE_FEHLER;
  return {
    zeichen: einziger ? "!" : zeichenFuer(verlust),
    verlust,
    besterZug: beste.zuege[0] ?? null,
    warBester,
  };
}
