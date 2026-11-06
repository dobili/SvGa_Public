/**
 * Schwächste Phase aus den eigenen Partien: Eröffnung, Mittelspiel oder Endspiel, wenn eine Phase
 * über die letzten gewerteten Partien deutlich unter der eigenen Spielstärke liegt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (6.11.2026, Q15-5): Schwächen aus den Partien je Phase
 * erkennen und dezent passende Trainer und Buchteile vorschlagen, ohne falsche Erwartungen. Die
 * Schätzung je Phase kommt aus dem Elo-Modell (spiel/wertung.ts, staerkeLetzterPartien, letzte
 * zehn gewertete Partien gegen die Engine); sie gilt nur, wo ihre Spanne schmal ist. Ein Hinweis
 * erst ab MINDESTENS_PARTIEN und ABSTAND_AB, damit Zufall einer Partie keinen Vorschlag auslöst.
 * Abhängigkeiten: spiel/wertung.ts, spiel/phasen.ts, training/trainer.ts (Kennungen).
 */
import { PHASEN, type Phase } from "../spiel/phasen";
import { staerkeLetzterPartien, tempoDesPunkts } from "../spiel/wertung";
import type { Nutzerdaten } from "../speicher/format";
import type { TrainerKennung } from "./trainer";

/** Erst ab so vielen ausgewerteten gewerteten Partien (Wunsch des Autors: dezent, belastbar). */
export const MINDESTENS_PARTIEN = 5;
/** So weit muss eine Phase unter der Gesamtschätzung liegen (Elo), damit sie als Schwäche gilt. */
export const ABSTAND_AB = 150;

/** Wo das Buch und welcher Trainer eine Phase üben. Regel: Kapitel 2 bis 10 nach Teilen. */
export const UEBEN_JE_PHASE: Readonly<Record<Phase, { kapitel: number; trainer: TrainerKennung }>> =
  {
    eroeffnung: { kapitel: 2, trainer: "repertoire" },
    mittelspiel: { kapitel: 7, trainer: "taktik" },
    endspiel: { kapitel: 8, trainer: "endspiel" },
  };

/** Die gefundene Schwäche. */
export interface Phasenschwaeche {
  readonly phase: Phase;
  /** So viele Punkte liegt die Phase unter der Gesamtschätzung (gerundet). */
  readonly abstand: number;
  readonly partien: number;
}

const ZEHNER = 10;
const zwischen = new WeakMap<object, Phasenschwaeche | null>();

/** Die Rechnung ohne Zwischenspeicher. */
function rechne(daten: Nutzerdaten): Phasenschwaeche | null {
  const letzter = daten.spiel.wertung.at(-1);
  const tempo = letzter ? tempoDesPunkts(letzter) : "rapid";
  const s = staerkeLetzterPartien(daten.spiel.partien, tempo);
  if (!s || s.partien < MINDESTENS_PARTIEN) return null;
  const kandidaten = PHASEN.flatMap((phase) => {
    const p = s.phasen[phase];
    return p ? [{ phase, abstand: s.mitte - p.mitte }] : [];
  });
  const schwaechste = kandidaten.sort((a, b) => b.abstand - a.abstand)[0];
  if (!schwaechste || schwaechste.abstand < ABSTAND_AB) return null;
  const abstand = Math.round(schwaechste.abstand / ZEHNER) * ZEHNER;
  return { phase: schwaechste.phase, abstand, partien: s.partien };
}

/**
 * Die schwächste Phase; null ohne genug Partien oder ohne deutlichen Abstand.
 * Beispiel: 8 Partien, gesamt etwa 1400, Endspiel etwa 1150 → { endspiel, 250, 8 }.
 * Die Rechnung läuft je Partienliste nur einmal (die Karte „Heute“ zeichnet oft).
 */
export function phasenschwaeche(daten: Nutzerdaten): Phasenschwaeche | null {
  const schluessel = daten.spiel.partien;
  if (zwischen.has(schluessel)) return zwischen.get(schluessel) ?? null;
  const ergebnis = rechne(daten);
  zwischen.set(schluessel, ergebnis);
  return ergebnis;
}
