/**
 * Hatte der Held bei einem Zug eine echte Wahl? Teil der Zeit-Hinweise (regeln/zeithinweis.ts):
 * „Lass dir Zeit“ passt nur, wo Nachdenken etwas bringt.
 *
 * Rolle im Gesamtbild: reine Regel ohne React für anbindung/Zeithinweis.tsx. Keine echte Wahl
 * heißt: der einzige legale Zug, oder ein Wiederschlag (der Gegner schlug eben auf einem Feld,
 * der Held schlägt auf demselben Feld zurück). Beides zieht auch ein guter Spieler sofort; die
 * Bots behandeln dieselben Lagen ebenso (engine/bedenkzeit.ts, „einzig“ und „wiederschlag“).
 * Buchbezug: Kapitel 1, Zählen von Angreifern und Verteidigern (der Wiederschlag gehört zum
 * Abtausch).
 * Abhängigkeiten: spiel/zuege.ts (regelstellung).
 */
import { regelstellung } from "../../spiel/zuege";

/** Zielfeld eines Zuges in SAN („Nxe5+“ → „e5“, „O-O“ → null). */
function zielfeld(san: string): string | null {
  const treffer = san.match(/([a-h][1-8])(?:=[QRBN])?[+#]?$/);
  return treffer?.[1] ?? null;
}

/** Ist der Zug ein Wiederschlag auf das Feld, auf dem der Gegner eben schlug? */
export function istWiederschlag(sanGegner: string | null, san: string): boolean {
  if (!sanGegner?.includes("x") || !san.includes("x")) return false;
  const ziel = zielfeld(san);
  return ziel !== null && ziel === zielfeld(sanGegner);
}

/** Zahl der legalen Züge in der Stellung (0 bei unlesbarer FEN). */
function legaleZuege(fen: string): number {
  const stellung = regelstellung(fen);
  if (!stellung) return 0;
  let anzahl = 0;
  for (const [, ziele] of stellung.allDests()) anzahl += ziele.size();
  return anzahl;
}

/**
 * Echte Wahl bei diesem Zug?
 * Eingaben: Stellung vor dem Zug, der Zug des Gegners davor (SAN, null am Anfang), der eigene Zug.
 * Beispiel: 1. e4 d5 2. exd5 Dxd5: „Dxd5“ nach „exd5“ → keine echte Wahl; ein ruhiger Zug im
 * Mittelspiel → echte Wahl; im Schach mit nur einem Zug → keine.
 */
export function echteWahl(fenVorher: string, sanGegner: string | null, san: string): boolean {
  if (istWiederschlag(sanGegner, san)) return false;
  return legaleZuege(fenVorher) > 1;
}
