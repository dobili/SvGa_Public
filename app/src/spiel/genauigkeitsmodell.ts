/**
 * Genauigkeit einer Seite mit zwei Reglern: Abfall der Zugkurve und Gewicht entschiedener Züge.
 *
 * Rolle im Gesamtbild: Eichung von Genauigkeit und Spielstärke (Plan vom 18.10.2026, Entscheidung
 * 1): eine Rechnung für die drei Schalterstellungen „Lichess“, „Mittelweg“ und „nahe chess.com“.
 * Mit den Lichess-Reglern (Abfall 0,04354, Polster 1) kommt genau die Genauigkeit von Lichess
 * heraus (wie spiel/genauigkeit.ts, partiegenauigkeit). Ein größerer Abfall bestraft kleine
 * Fehler stärker; ein Polster unter 1 lässt Züge in entschiedenen Stellungen weniger zählen (bei
 * Lichess gleichen viele saubere Züge in längst gewonnener Stellung Fehler aus).
 * Abhängigkeiten: spiel/genauigkeit.ts (Gewinnwahrscheinlichkeit, Gewichte nach Lichess).
 */
import type { Color } from "chessops/types";
import { gewinnwahrscheinlichkeit, zuggewichte } from "./genauigkeit";

export interface Regler {
  /** Abfall der Zugkurve je Prozentpunkt Verlust (Lichess 0,04354). */
  readonly abfall: number;
  /** Gewicht der Züge in entschiedenen Stellungen, 0 bis 1 (Lichess 1). */
  readonly polster: number;
}

export const LICHESS_REGLER: Regler = { abfall: 0.04354, polster: 1 };

/** Lichess: Genauigkeit eines Zuges = 103,1668 · e^(−Abfall · Verlust) − 3,1669. */
const FAKTOR = 103.1668;
const VERSATZ = 3.1669;
const PROZENT = 100;
/** Kleinste Zuggenauigkeit im harmonischen Mittel (wie in genauigkeit.ts). */
const MINDESTENS = 1;
/**
 * Entschieden ist eine Stellung, wenn die Gewinnwahrscheinlichkeit der ziehenden Seite vor dem Zug
 * über 90 % oder unter 10 % liegt (etwa sechs Bauern Vorsprung oder Rückstand).
 */
const ENTSCHIEDEN_AB = 90;

/** Genauigkeit eines Zuges (0 bis 100) aus dem Verlust an Gewinnwahrscheinlichkeit. */
export function zuggenauigkeitMit(verlustProzent: number, abfall: number): number {
  const roh = FAKTOR * Math.exp(-abfall * Math.max(0, verlustProzent)) - VERSATZ;
  return Math.max(0, Math.min(PROZENT, roh));
}

/** Ein Zug der Seite: Genauigkeit, Gewicht nach Lichess und ob die Stellung entschieden war. */
export interface Zugwert {
  readonly genauigkeit: number;
  readonly gewicht: number;
  readonly entschieden: boolean;
}

/**
 * Die Züge einer Seite mit Genauigkeit und Gewicht.
 * Eingaben: Werte je Stellung aus Sicht von Weiß (Bauern, Startstellung bis Ende), Farbe der Seite,
 * Farbe am Zug in der Startstellung (bei Partien aus der Grundstellung Weiß), Abfall.
 */
export function zugwerte(
  werte: readonly number[],
  seite: Color,
  abfall: number,
  anfang: Color = "white",
): Zugwert[] {
  const gewichte = zuggewichte(werte);
  const ergebnis: Zugwert[] = [];
  for (let i = 0; i + 1 < werte.length; i += 1) {
    const amZug: Color = (i % 2 === 0) === (anfang === "white") ? "white" : "black";
    if (amZug !== seite) continue;
    const vorher = gewinnwahrscheinlichkeit(werte[i] ?? 0);
    const nachher = gewinnwahrscheinlichkeit(werte[i + 1] ?? 0);
    const eigeneVorher = seite === "white" ? vorher : PROZENT - vorher;
    const verlust = seite === "white" ? vorher - nachher : nachher - vorher;
    ergebnis.push({
      genauigkeit: zuggenauigkeitMit(verlust, abfall),
      gewicht: gewichte[i] ?? 1,
      entschieden: eigeneVorher >= ENTSCHIEDEN_AB || eigeneVorher <= PROZENT - ENTSCHIEDEN_AB,
    });
  }
  return ergebnis;
}

/**
 * Genauigkeit aus den Zugwerten: Mittel aus gewichtetem und harmonischem Mittel (Lichess); Züge
 * in entschiedenen Stellungen zählen in beiden Mitteln mit dem Faktor `polster`. Null ohne Züge
 * (oder wenn alle Züge mit 0 zählen).
 * Beispiel: Polster 1 → genau partiegenauigkeit aus genauigkeit.ts.
 */
export function genauigkeitAus(zuege: readonly Zugwert[], polster: number): number | null {
  let gewichtet = 0;
  let gewichte = 0;
  let anzahl = 0;
  let kehrwerte = 0;
  for (const z of zuege) {
    const faktor = z.entschieden ? polster : 1;
    gewichtet += z.genauigkeit * z.gewicht * faktor;
    gewichte += z.gewicht * faktor;
    anzahl += faktor;
    kehrwerte += faktor / Math.max(MINDESTENS, z.genauigkeit);
  }
  if (gewichte <= 0 || kehrwerte <= 0) return null;
  return (gewichtet / gewichte + anzahl / kehrwerte) / 2;
}

/** Genauigkeit einer Seite mit den gegebenen Reglern; null ohne Züge. */
export function seitengenauigkeit(
  werte: readonly number[],
  seite: Color,
  regler: Regler,
  anfang: Color = "white",
): number | null {
  return genauigkeitAus(zugwerte(werte, seite, regler.abfall, anfang), regler.polster);
}

/** Regler halb zwischen zwei anderen (Schalterstellung „Mittelweg“). */
export function mittelweg(a: Regler, b: Regler): Regler {
  return { abfall: (a.abfall + b.abfall) / 2, polster: (a.polster + b.polster) / 2 };
}
