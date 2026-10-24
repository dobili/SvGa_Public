/**
 * Umrechnung der eigenen Wertung auf andere Listen (0.2.125): „entspricht etwa“ chess.com (Blitz,
 * Schnellschach) oder FIDE (Klassisch), dazu die Kurvenrechnung, die auch die Eichung nutzt.
 *
 * Rolle im Gesamtbild: Die eigene Wertung je Zeitklasse (spiel/elomodell.ts) ist auf dem Maßstab
 * von Lichess geeicht. Der Autor wollte (23.10.2026) dazu die grobe Entsprechung auf chess.com und
 * beim Weltschachbund; die Zahlen stammen aus dem Wertungsvergleich von chessgoals.com (Juli 2026,
 * Selbstangaben aktiver Spieler) in spiel/umrechnung-daten.ts. Außerhalb der Tabellen gibt es keine
 * Entsprechung (FIDE erst ab etwa 1730 Lichess Klassisch).
 * Abhängigkeiten: spiel/umrechnung-daten.ts, spiel/elomodell-daten.ts (Zeitklasse).
 */
import type { Wertungstempo } from "./elomodell-daten";
import { UMRECHNUNG } from "./umrechnung-daten";

/** Eine Kurve als Stützstellen [x, y], aufsteigend in x. */
export type Kurve = readonly (readonly [number, number])[];

/** Auf welche Liste eine Zeitklasse umgerechnet wird. */
export const ZIELLISTE: Readonly<Record<Wertungstempo, "chesscom" | "fide">> = {
  blitz: "chesscom",
  rapid: "chesscom",
  classical: "fide",
};

const RUNDUNG = 10;

/** Wert der Kurve an einer Stelle, linear dazwischen, außerhalb der Randwert. */
export function kurvenwert(kurve: Kurve, x: number): number {
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte) return Number.NaN;
  if (x <= erste[0]) return erste[1];
  if (x >= letzte[0]) return letzte[1];
  for (let i = 1; i < kurve.length; i += 1) {
    const [x0, y0] = kurve[i - 1] ?? erste;
    const [x1, y1] = kurve[i] ?? letzte;
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return letzte[1];
}

/**
 * „Entspricht etwa“ auf der Zielliste der Zeitklasse, auf 10 gerundet; null außerhalb der Tabelle.
 * Beispiel: Schnellschach 1680 → chess.com Schnellschach etwa 1340; Klassisch 2120 → FIDE etwa 1965;
 * Klassisch 1500 → null (unter der Tabelle).
 */
export function entsprichtEtwa(tempo: Wertungstempo, wertung: number): number | null {
  const kurve = UMRECHNUNG[tempo];
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte || wertung < erste[0] || wertung > letzte[0]) return null;
  return Math.round(kurvenwert(kurve, wertung) / RUNDUNG) * RUNDUNG;
}
