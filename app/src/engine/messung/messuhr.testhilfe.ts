/**
 * Virtuelle Uhr der Stufenmessung im Notmodus: Stand je Seite, Vorzug spielen, weiter planen.
 *
 * Rolle im Gesamtbild: Teil von engine/stufen.messung.ts, ausgelagert (Dateigröße). Dieselben
 * Regeln wie in der App (spiel/notmodus.ts, ui/komponenten/botzug.ts), nur mit simulierter statt
 * echter Zeit: Ein Vorzug kostet eine Zehntelsekunde, die Planung kostet nichts.
 * Abhängigkeiten: spiel/notmodus.ts, spiel/partie.ts, spiel/zuege.ts, engine/engineDienst.ts.
 */
import type { EngineDienst } from "../engineDienst";
import type { Stufennummer } from "../stufen";
import {
  bleibtImNotmodus,
  planeVorzuege,
  VORZUG_MS,
  waehleVorzug,
  type Vorzug,
} from "../../spiel/notmodus";
import { stellungen, zeitUeberschritten, ziehe, type Partie } from "../../spiel/partie";
import { uciZuSan } from "../../spiel/zuege";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Virtuelle Uhr und letzte Stufe einer Seite; im Notmodus die vorbereiteten Vorzüge. */
export interface Seitenstand {
  rest: number | null;
  verbraucht: number;
  letzte: Stufennummer | null;
  vorzuege: Vorzug[] | null;
  notmodusZuege: number;
}

/** Plant nach einem Zug im Notmodus weiter oder verlässt ihn (wie ui/komponenten/botzug.ts). */
export async function planeWeiter(
  engine: EngineDienst,
  weiter: Partie,
  stand: Seitenstand,
  waehle: (fen: string, restMs: number) => Promise<string | null>,
): Promise<void> {
  const rest = stand.rest ?? 0;
  const fen = stellungen(weiter).at(-1) ?? GRUNDSTELLUNG;
  stand.vorzuege =
    weiter.ende === null && bleibtImNotmodus(rest)
      ? await planeVorzuege(engine, fen, (f) => waehle(f, rest))
      : null;
}

/** Ein Vorzug im Notmodus (spiel/notmodus.ts): eine Zehntelsekunde, oder die Zeit ist um. */
export async function vorzugMitUhr(
  engine: EngineDienst,
  lauf: Partie,
  zuschlagMs: number,
  stand: Seitenstand,
  waehle: (fen: string, restMs: number) => Promise<string | null>,
): Promise<Partie> {
  const fen = stellungen(lauf).at(-1) ?? GRUNDSTELLUNG;
  const farbe = fen.split(" ")[1] === "w" ? "white" : "black";
  const uci = await waehleVorzug(engine, fen, stand.vorzuege ?? []);
  const san = uci ? uciZuSan(fen, uci) : null;
  const rest = stand.rest ?? 0;
  if (!san || rest <= VORZUG_MS) {
    stand.verbraucht += rest;
    return zeitUeberschritten(lauf, farbe);
  }
  stand.verbraucht += VORZUG_MS;
  stand.rest = rest - VORZUG_MS + zuschlagMs;
  stand.notmodusZuege += 1;
  const weiter = ziehe(lauf, { san, von: "engine", quelle: "engine", fehler: null, verlust: 0 });
  if (!weiter) throw new Error(`Vorzug geht nicht: ${san} in ${fen}`);
  await planeWeiter(engine, weiter, stand, waehle);
  return weiter;
}
