/**
 * Hilfen des Messlaufs engine/botstaerke.messung.ts (0.2.125, ausgelagert für Dateien unter 400
 * Zeilen): Phasen einer nachgespielten Partie und die Datei der Kandidaten.
 * Abhängigkeiten: chessops, spiel/phasen.ts, engine/botkandidaten.ts.
 */
import { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { phaseVon, type Phase } from "../spiel/phasen";
import { BOTKANDIDATEN } from "./botkandidaten";

/**
 * Die Phase je Stellung einer nachgespielten Partie (SAN-Züge), monoton wie spiel/phasen.ts;
 * bricht ein Zug nicht lesbar, bleibt die letzte Phase stehen.
 */
export function phasenAusZuegen(zuege: readonly string[]): Phase[] {
  const stellung = Chess.default();
  let bisher: Phase = "eroeffnung";
  const rang: Record<Phase, number> = { eroeffnung: 0, mittelspiel: 1, endspiel: 2 };
  const phasen: Phase[] = [];
  const merke = () => {
    const jetzt = phaseVon(makeFen(stellung.toSetup()));
    if (jetzt && rang[jetzt] > rang[bisher]) bisher = jetzt;
    phasen.push(bisher);
  };
  merke();
  for (const san of zuege) {
    const zug = parseSan(stellung, san);
    if (!zug) break;
    stellung.play(zug);
    merke();
  }
  return phasen;
}

/** Datei der Kandidaten (engine/botkandidaten-daten.ts): Zahl je Kandidat, der gemessen wurde. */
export function kandidatendatei(werte: Map<string, number>, streu: Map<string, number>): string {
  const zeilen = BOTKANDIDATEN.filter((g) => werte.has(g.kennung)).map(
    (g) =>
      `  "${g.kennung}": { zahl: ${Math.round(werte.get(g.kennung) ?? 0)}, streuung: ${Math.round(streu.get(g.kennung) ?? 0)} },`,
  );
  return [
    "/**",
    " * Gemessene Zahl der Kandidaten für den Bot-Satz (erzeugt vom Messlauf engine/botstaerke.messung.ts",
    ` * am ${new Date().toISOString().slice(0, 10)}, nicht von Hand ändern). Bleibt erhalten, auch für nicht`,
    " * gewählte Kandidaten (Wunsch des Autors, 24.10.2026). Abhängigkeiten: keine.",
    " */",
    "export const KANDIDATEN_STAERKE: Readonly<",
    "  Record<string, { readonly zahl: number; readonly streuung: number }>",
    "> = {",
    ...zeilen,
    "};",
    "",
  ].join("\n");
}

/** Fester Zufall für das Nachziehen (LCG). */
export function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}
