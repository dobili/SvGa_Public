/**
 * Hilfen des Messlaufs engine/botstaerke.messung.ts (0.2.125, ausgelagert für Dateien unter 400
 * Zeilen): Phasen einer nachgespielten Partie und die Datei der Kandidaten.
 * Abhängigkeiten: chessops, spiel/phasen.ts, engine/botkandidaten.ts.
 */
import { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { phaseVon, type Phase } from "../spiel/phasen";
import { WERTUNGSTEMPI, wertungstempo, type Wertungstempo } from "../spiel/elomodell";
import { BOTKANDIDATEN } from "./botkandidaten";
import { BOTMESSNAMEN } from "./botmessnamen";
import { GEGNER } from "./gegnerliste";
import { STUFEN } from "./stufen";

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

/** Die Nummern aller Stufen (1 bis 10). */
const STUFEN_NUMMERN = STUFEN.map((s) => s.nummer);
const SEKUNDE_MS = 1000;

/** Die Zeitklasse einer gemessenen Bedenkzeit („180+2“ → blitz), wie in der App. */
export function zeitklasseVon(tempo: string): Wertungstempo {
  const [grund, zuschlag] = tempo.split("+").map(Number);
  return wertungstempo({
    grundzeitMs: (grund ?? 0) * SEKUNDE_MS,
    zuschlagMs: (zuschlag ?? 0) * SEKUNDE_MS,
  });
}

/**
 * Die Datendatei engine/botstaerke-daten.ts (oder je Zeitklasse): Stufen, Bots, Uhrabzug.
 * `uhr`: Zeitklasse → Stufe → Abzug; fehlende Zeitklassen bekommen leere Tabellen (Typ vollständig).
 */
export function datendatei(
  werte: Map<string, number>,
  uhr: ReadonlyMap<string, ReadonlyMap<number, number>>,
): string {
  // Seit 0.2.125 die Stufen mit Zusatzfehlern („Nm“, so spielt eine Stufe in der App); Stufe 10
  // ist die volle Engine ohne Zusatzfehler (rein gemessen, „10-9m“ usw.).
  const stufen = STUFEN_NUMMERN.map(
    (n) =>
      `  ${n}: ${Math.round(werte.get(n === STUFEN_NUMMERN.at(-1) ? "stufe10" : `stufe${n}m`) ?? Number.NaN)},`,
  );
  const zahl = (k: string) => werte.get(k) ?? werte.get(BOTMESSNAMEN[k] ?? "");
  const bots = GEGNER.map((g) => `  "${g.kennung}": ${Math.round(zahl(g.kennung) ?? Number.NaN)},`);
  return [
    "/**",
    " * Elo-Zahl der Stufen und der vorgefertigten Bots (erzeugt vom Messlauf",
    ` * engine/botstaerke.messung.ts am ${new Date().toISOString().slice(0, 10)}, nicht von Hand ändern).`,
    " *",
    " * Rolle im Gesamtbild: Daten für engine/botstaerke.ts. Elo-Leiter aus den Ergebnissen der",
    " * Bot-Messung, verankert an Stufen, die gegen sich selbst spielten, über die Rechnung von",
    " * „Deine Spielstärke“. Herleitung und Unsicherheit: docs/ENTSCHEIDUNGEN.md, „Elo-Zahl der Bots“.",
    " * Abhängigkeiten: engine/stufen.ts (Typ).",
    " */",
    'import type { Wertungstempo } from "../spiel/elomodell";',
    'import type { Stufennummer } from "./stufen";',
    "",
    "export const STUFEN_STAERKE: Readonly<Record<Stufennummer, number>> = {",
    ...stufen,
    "};",
    "",
    "export const BOT_STAERKE: Readonly<Record<string, number>> = {",
    ...bots,
    "};",
    "",
    "/**",
    " * Was die Uhr je Zeitklasse (Blitz 3+2, Schnellschach 10+0, Klassisch 30+20 gemessen) und Stufe",
    " * kostet (Elo, meist negativ; seit 0.2.117, seit 0.2.125 je Zeitklasse statt je Bedenkzeit).",
    " */",
    "export const UHR_ABZUG: Readonly<Record<Wertungstempo, Readonly<Record<number, number>>>> = {",
    ...WERTUNGSTEMPI.map((tempo) => {
      const je =
        [...uhr].find(([t]) => zeitklasseVon(t) === tempo)?.[1] ?? new Map<number, number>();
      const eintraege = [...je]
        .sort((x, y) => x[0] - y[0])
        .map(([n, w]) => `${n}: ${Math.round(w)}`)
        .join(", ");
      return `  ${tempo}: { ${eintraege} },`;
    }),
    "};",
    "",
  ].join("\n");
}
