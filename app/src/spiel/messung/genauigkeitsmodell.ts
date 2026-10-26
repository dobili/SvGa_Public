/**
 * Genauigkeit einer Seite mit zwei Reglern: Abfall der Zugkurve und Gewicht entschiedener Züge.
 *
 * Rolle im Gesamtbild: Eichung von Genauigkeit und Spielstärke (Plan vom 18.10.2026, Entscheidung
 * 1): eine Rechnung für die drei Schalterstellungen „Lichess“, „Mittelweg“ und „nahe chess.com“.
 * Mit den Lichess-Reglern (Abfall 0,04354, Polster 1) kommt genau die Genauigkeit von Lichess
 * heraus (wie spiel/genauigkeit.ts, partiegenauigkeit). Ein größerer Abfall bestraft kleine
 * Fehler stärker; ein Polster unter 1 lässt Züge in entschiedenen Stellungen weniger zählen (bei
 * Lichess gleichen viele saubere Züge in längst gewonnener Stellung Fehler aus).
 * Dazu gibt es die innere Genauigkeit nur bis zur Entscheidung der Partie
 * (spiel/entscheidung.ts), auf der die Kurven Genauigkeit → Spielstärke geeicht sind.
 * Abhängigkeiten: spiel/genauigkeit.ts (Gewinnwahrscheinlichkeit, Gewichte nach Lichess),
 * spiel/entscheidung.ts.
 */
import type { Color } from "chessops/types";
import {
  ENTSCHIEDEN_AB,
  gewinnwahrscheinlichkeit,
  partiegenauigkeit,
  zuggewichte,
} from "../genauigkeit";
import { gewerteteHalbzuege } from "../entscheidung";

export interface Regler {
  /** Abfall der Zugkurve je Prozentpunkt Verlust (Lichess 0,04354). */
  readonly abfall: number;
  /** Gewicht der Züge in entschiedenen Stellungen, 0 bis 1 (Lichess 1). */
  readonly polster: number;
}

/** Die Regler, mit denen genau die Genauigkeit von Lichess herauskommt (Zahl von Lichess). */
export const LICHESS_REGLER: Regler = { abfall: 0.04354, polster: 1 };

/** Lichess: Genauigkeit eines Zuges = 103,1668 · e^(−Abfall · Verlust) − 3,1669. */
const FAKTOR = 103.1668;
const VERSATZ = 3.1669;
const PROZENT = 100;
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
  /** Verlust in Bauern aus eigener Sicht und Wert danach (seit 0.2.125 für das Elo-Modell). */
  readonly verlust: number;
  readonly nachher: number;
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
    const wertVorher = werte[i] ?? 0;
    const wertNachher = werte[i + 1] ?? 0;
    const eigenerNachher = seite === "white" ? wertNachher : -wertNachher;
    ergebnis.push({
      genauigkeit: zuggenauigkeitMit(verlust, abfall),
      gewicht: gewichte[i] ?? 1,
      entschieden: eigeneVorher >= ENTSCHIEDEN_AB || eigeneVorher <= PROZENT - ENTSCHIEDEN_AB,
      verlust: Math.max(0, (seite === "white" ? wertVorher : -wertVorher) - eigenerNachher),
      nachher: eigenerNachher,
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
  return partiegenauigkeit(zuege, polster);
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

/**
 * Die Züge einer Seite, die für die Spielstärke zählen: nur die vor dem Entscheidungspunkt
 * (spiel/entscheidung.ts), mit den Lichess-Reglern wie die innere Genauigkeit der App.
 * Warum: Die Kurven der Eichung müssen auf derselben Rechnung stehen wie die Schätzung in der App
 * (spiel/genauigkeit.ts, seitenbilanz). Eingaben wie `zugwerte`. Ausgabe: die gezählten Zugwerte.
 * Beispiel: Partie des Autors gegen Stufe 1 (19.10.2026): Von 43 schwarzen Zügen zählen nur die
 * bis etwa zum neunten; danach blieb Weiß über 90 % (Damenverlust 9...Db8??).
 */
export function zugwerteBisEntscheidung(
  werte: readonly number[],
  seite: Color,
  anfang: Color = "white",
): Zugwert[] {
  const bis = gewerteteHalbzuege(werte.map(gewinnwahrscheinlichkeit));
  const zuege = zugwerte(werte, seite, LICHESS_REGLER.abfall, anfang);
  const erster = seite === anfang ? 0 : 1;
  return zuege.filter((_, j) => erster + 2 * j < bis);
}

/** Innere Genauigkeit bis zur Entscheidung (Lichess-Rechnung); null ohne gezählte Züge. */
export function innereGenauigkeit(
  werte: readonly number[],
  seite: Color,
  anfang: Color = "white",
): number | null {
  return genauigkeitAus(zugwerteBisEntscheidung(werte, seite, anfang), LICHESS_REGLER.polster);
}

/** Regler halb zwischen zwei anderen (Schalterstellung „Mittelweg“). */
export function mittelweg(a: Regler, b: Regler): Regler {
  return { abfall: (a.abfall + b.abfall) / 2, polster: (a.polster + b.polster) / 2 };
}
