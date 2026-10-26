/**
 * Gemessene Bereiche der eigenen Wertung auf FIDE und chess.com (seit 0.3.3): Zwischenrechnung in
 * der Tabelle aus spiel/plattformvergleich-daten.ts.
 *
 * Rolle im Gesamtbild: spiel/umrechnung.ts nimmt diese Messung, wo es sie gibt, und sonst den
 * Umweg über die Tabellen von chessgoals.com. Die Messung beruht auf Paaren echter Spieler
 * (Lichess-Profile mit abgeglichener FIDE-Wertung oder verlinktem chess.com-Konto) und misst die
 * Streuung je Wertungsband statt einer Zahl für die ganze Tabelle; Herleitung in
 * pipeline/wertungsvergleich/auswerten.py.
 * Abhängigkeiten: spiel/plattformvergleich-daten.ts, spiel/elomodell-daten.ts (Zeitklasse).
 */
import type { Wertungstempo } from "./elomodell-daten";
import { GEMESSEN, type Vergleichsband } from "./plattformvergleich-daten";

/** Die Listen mit eigener Messung. */
export type GemesseneListe = keyof typeof GEMESSEN;

/** Ränder und Mitte werden auf so viele Punkte gerundet („etwa“). */
const RUNDUNG = 10;

/** Auf RUNDUNG gerundet. */
function gerundet(wert: number): number {
  return Math.round(wert / RUNDUNG) * RUNDUNG;
}

/** true, wenn es für Zeitklasse und Liste eine Messung gibt. */
export function istGemessen(tempo: Wertungstempo, liste: GemesseneListe): boolean {
  return GEMESSEN[liste][tempo].length > 0;
}

/**
 * Von welcher bis zu welcher eigenen Wertung die Messung reicht (Bänder mit genug Spielern).
 * Beispiel: FIDE Blitz → etwa 1100 bis 2600; ohne Messung null.
 */
export function gemessenerVergleichsbereich(
  tempo: Wertungstempo,
  liste: GemesseneListe,
): { von: number; bis: number } | null {
  const baender = GEMESSEN[liste][tempo];
  const erstes = baender[0];
  const letztes = baender.at(-1);
  return erstes && letztes ? { von: erstes[0], bis: letztes[0] } : null;
}

/** Die beiden Bänder links und rechts der Wertung und der Anteil dazwischen. */
function nachbarn(
  baender: readonly Vergleichsband[],
  wertung: number,
): readonly [Vergleichsband, Vergleichsband, number] | null {
  for (let i = 1; i < baender.length; i += 1) {
    const links = baender[i - 1];
    const rechts = baender[i];
    if (links && rechts && wertung <= rechts[0]) {
      return [links, rechts, (wertung - links[0]) / (rechts[0] - links[0])];
    }
  }
  const einziges = baender[0];
  return baender.length === 1 && einziges ? [einziges, einziges, 0] : null;
}

/**
 * Der gemessene Bereich (von, Mitte, bis) zu einer eigenen Wertung, linear zwischen den Bändern,
 * auf 10 gerundet; null außerhalb der Messung.
 * Warum linear: Die Bänder liegen alle 50 Punkte und sind schon geglättet (Fenster ±100).
 * Beispiel: FIDE Klassisch 2000 → das Band 2000 selbst; 2025 → Mitte der Bänder 2000 und 2050.
 * Sonderfall: genau auf dem ersten oder letzten Band noch ein Wert, daneben null.
 */
export function gemessenerBereich(
  tempo: Wertungstempo,
  wertung: number,
  liste: GemesseneListe,
): { von: number; mitte: number; bis: number } | null {
  const baender = GEMESSEN[liste][tempo];
  const erstes = baender[0];
  const letztes = baender.at(-1);
  if (!erstes || !letztes || wertung < erstes[0] || wertung > letztes[0]) return null;
  const paar = nachbarn(baender, wertung);
  if (!paar) return null;
  const [links, rechts, anteil] = paar;
  const mische = (stelle: 1 | 2 | 3) =>
    gerundet(links[stelle] + anteil * (rechts[stelle] - links[stelle]));
  return { von: mische(1), mitte: mische(2), bis: mische(3) };
}
