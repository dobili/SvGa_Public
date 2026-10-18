/**
 * Spielstärke der Engine-Stufen und der Bots als Wertungszahl („etwa 1100“), auf derselben Skala
 * wie „Deine Spielstärke“ (Rückfrage S23, umgesetzt in 0.2.85).
 *
 * Rolle im Gesamtbild: Wie bei den Bots von chess.com steht an jeder Stufe und an jedem Bot eine
 * Zahl. Gemessen mit spiel/botstaerke.messung.ts: Jede Stufe spielt 16 Partien gegen sich selbst
 * (gleich starker Gegner wie in den gewerteten Partien, an denen die Kurven geeicht sind); jede
 * Stellung mit Tiefe 18 nachgerechnet, die Genauigkeit aller Seiten durch dieselbe Rechnung wie
 * die Spielstärke des Lesers über mehrere Partien (spiel/staerkemodell.ts). Bots und eigene Stufen
 * je Phase liegen dazwischen: Wert am Durchschnitt ihrer drei Stufen, linear zwischen den Stufen.
 * Seit 0.2.85 rechnet die Wertung des Lesers mit dieser Zahl als Stärke des Gegners (wie im Verein
 * die Wertungszahl des Gegners) statt mit seiner Genauigkeit in der einzelnen Partie.
 * Abhängigkeiten: engine/stufen.ts (Stufennummer), schach/phase.ts (Phase).
 */
import type { Stufennummer } from "../engine/stufen";
import type { Phase } from "../schach/phase";

/**
 * Wertungszahl je Stufe, Messung vom 18.10.2026 (Ergebnis nur lokal in
 * `buch/arbeit/botstaerke/ergebnis.json`), gerundet auf 50 und aufsteigend.
 */
export const STAERKE_DER_STUFE: Readonly<Record<Stufennummer, number>> = {
  1: 600,
  2: 800,
  3: 1000,
  4: 1200,
  5: 1400,
  6: 1600,
  7: 1800,
  8: 2000,
};

const RUNDUNG = 50;
const ERSTE = 1;
const LETZTE = 8;

/** Die Zahl einer Stufe. Beispiel: Stufe 3 → 1000. */
export function staerkeDerStufe(nummer: Stufennummer): number {
  return STAERKE_DER_STUFE[nummer];
}

/**
 * Die Zahl zu Stufen je Phase (Bot, eigener Bot, Regler): Wert am Durchschnitt der drei Stufen,
 * linear zwischen den Stufen, gerundet auf 50.
 * Beispiel: Timo (Eröffnung 5, Mittelspiel 4, Endspiel 3) → Durchschnitt 4 → Wert der Stufe 4.
 */
export function staerkeDerStufen(stufen: Readonly<Record<Phase, Stufennummer>>): number {
  const schnitt = (stufen.eroeffnung + stufen.mittelspiel + stufen.endspiel) / 3;
  const x = Math.min(LETZTE, Math.max(ERSTE, schnitt));
  const unten = Math.floor(x) as Stufennummer;
  const oben = Math.min(LETZTE, unten + 1) as Stufennummer;
  const wert =
    staerkeDerStufe(unten) + (x - unten) * (staerkeDerStufe(oben) - staerkeDerStufe(unten));
  return Math.round(wert / RUNDUNG) * RUNDUNG;
}
