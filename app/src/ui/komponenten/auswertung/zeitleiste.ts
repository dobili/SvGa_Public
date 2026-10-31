/**
 * Abschnitte der Zeitleiste: die Phasen der Partie mit ihren Zügen und Momenten (Entwurf F2).
 *
 * Rolle im Gesamtbild: Die Zeitleiste (Zeitleiste.tsx) gliedert die Momente nach Eröffnung,
 * Mittelspiel und Endspiel, je mit Kopf „Mittelspiel · Zug 10 bis 24 · 71 %“. Diese Datei rechnet
 * die Abschnitte ohne Prozent; die Genauigkeit je Phase kommt aus der Spielstärke
 * (spiel/genauigkeit.ts, spielstaerkeJePhase). Phase eines Zuges ist die Phase der Stellung vor
 * dem Zug (spiel/phasen.ts, phasenJeStellung).
 * Abhängigkeiten: spiel/partie.ts, spiel/phasen.ts, momente.ts.
 */
import { stellungen, type Partie } from "../../../spiel/partie";
import { PHASEN, type Phase } from "../../../spiel/phasen";
import type { Moment } from "./momente";

/** Ein Abschnitt der Zeitleiste. */
export interface Phasenabschnitt {
  readonly phase: Phase;
  /** Erste und letzte Zugnummer der Phase im Buchformat (Vollzug). */
  readonly vonZug: number;
  readonly bisZug: number;
  readonly momente: readonly Moment[];
}

/** Zugnummer (Vollzug) des Halbzuges an dieser Stelle, aus der FEN davor. */
function vollzug(fens: readonly string[], index: number): number {
  return Number(fens[index]?.split(" ")[5] ?? "1") || 1;
}

/**
 * Die Abschnitte in der Reihenfolge der Phasen; Phasen ohne Zug fehlen.
 * Eingaben: Partie, Phase je Stellung, Momente (momente.ts).
 * Beispiel: 29 Züge, Mittelspiel ab Zug 10, Endspiel ab Zug 25 → drei Abschnitte 1–9, 10–24,
 * 25–29, jeder mit seinen Momenten.
 * Sonderfall: Ohne Züge gibt es keinen Abschnitt.
 */
export function phasenabschnitte(
  partie: Partie,
  phasen: readonly Phase[],
  momente: readonly Moment[],
): readonly Phasenabschnitt[] {
  const fens = stellungen(partie);
  const halbzuege = partie.zuege.map((_, index) => index);
  return PHASEN.flatMap((phase) => {
    const hier = halbzuege.filter((i) => (phasen[i] ?? "eroeffnung") === phase);
    const erster = hier[0];
    const letzter = hier[hier.length - 1];
    if (erster === undefined || letzter === undefined) return [];
    return [
      {
        phase,
        vonZug: vollzug(fens, erster),
        bisZug: vollzug(fens, letzter),
        momente: momente.filter((m) => hier.includes(m.index)),
      },
    ];
  });
}
