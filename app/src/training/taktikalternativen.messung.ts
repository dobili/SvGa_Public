/**
 * Messlauf: Gibt es in den Aufgaben des Taktiktrainers Züge, die genauso gut sind wie der Zug der
 * Lösung? Frage des Autors (6.11.2026): „Alle zulässigen Lösungen akzeptieren.“
 *
 * Rolle im Gesamtbild: Läuft nicht in „npm run pruefen“, sondern über `npm run
 * messen:alternativen` (Stockfish lite, ein Kern, feste Tiefe; für alle 1674 Aufgaben etwa eine
 * Stunde). An jedem Zug des Lesers rechnet die Engine die drei besten Züge. Gleichwertig heißt:
 * bei einer Mattlösung ein anderes Matt in nicht mehr Zügen, sonst höchstens GLEICHWERTIG_BIS
 * schlechter (wie pipeline/trainer/uebungen.py) oder beide über DECKEL Bauern. Matt in einem Zug
 * und die Züge unter „akzeptiert“ nimmt der Trainer schon an; sie zählen nicht. Das Ergebnis
 * schreibt der Lauf nach ALTERNATIVEN_ZIEL (Standard: Arbeitsordner der Pipeline, nur lokal).
 * Gemessen 6.11.2026 (Tiefe 14): siehe docs/ENTSCHEIDUNGEN.md.
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, spiel/zuege.ts, training/zusatzaufgaben.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { it } from "vitest";
import type { Taktikaufgabe, Taktikdaten } from "../daten/trainerdaten";
import type { EngineDienst } from "../engine/engineDienst";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import type { Wert } from "../engine/uci";
import { fenNach, uciZuSan } from "../spiel/zuege";
import { alsZusatzaufgabe, zusatzeintraegeAus } from "./zusatzaufgaben";

const TAKTIK = resolve(__dirname, "../../../inhalte/de/trainer/taktik.json");
const ZUSATZ = resolve(__dirname, "../../public/daten/zusatzaufgaben.json");
const ZIEL =
  process.env.ALTERNATIVEN_ZIEL ?? resolve(__dirname, "../../../buch/arbeit/alternativen.json");
const TIEFE = Number(process.env.ALTERNATIVEN_TIEFE ?? "14");
const FRIST_MS = 60_000;
const VARIANTEN = 3;
/** Höchstens so viel schlechter gilt als gleichwertig (Bauern, wie die Pipeline). */
const GLEICHWERTIG_BIS = 0.3;
/** Ab hier gilt eine Stellung als klar gewonnen; darüber zählt kein Unterschied. */
const DECKEL = 6;

/** Wert aus Sicht der Seite am Zug: Mattzahl (positiv: sie setzt matt) oder Bauern. */
interface Sicht {
  readonly san: string;
  readonly matt: number | null;
  readonly bauern: number;
}

function sicht(fen: string, uci: string, wert: Wert, weiss: boolean): Sicht {
  const san = uciZuSan(fen, uci) ?? uci;
  if (wert.art === "matt") return { san, matt: weiss ? wert.zuege : -wert.zuege, bauern: 0 };
  return { san, matt: null, bauern: weiss ? wert.bauern : -wert.bauern };
}

/** Ist die Alternative so gut wie der Zug der Lösung? */
function gleichwertig(loesung: Sicht, anders: Sicht): boolean {
  if (anders.san.endsWith("#")) return false;
  if (loesung.matt !== null && loesung.matt > 0)
    return anders.matt !== null && anders.matt > 0 && anders.matt <= loesung.matt;
  if (anders.matt !== null) return anders.matt > 0;
  const beide = loesung.bauern >= DECKEL && anders.bauern >= DECKEL;
  return beide || loesung.bauern - anders.bauern <= GLEICHWERTIG_BIS;
}

interface Fund {
  readonly id: string;
  readonly halbzug: number;
  readonly loesung: Sicht;
  readonly anders: Sicht;
}

/** Die gleichwertigen Züge an jedem Zug des Lesers einer Aufgabe. */
async function funde(dienst: EngineDienst, a: Taktikaufgabe): Promise<Fund[]> {
  const gefunden: Fund[] = [];
  let fen = a.fen;
  for (const [i, zug] of a.loesung.entries()) {
    if (i % 2 === 0) {
      const weiss = fen.split(" ")[1] !== "b";
      const stand = fen;
      const b = await dienst.bewerte(fen, FRIST_MS, VARIANTEN, { art: "tiefe", tiefe: TIEFE });
      const v = b.varianten.map((x) => sicht(stand, x.zuege[0] ?? "", x.wert, weiss));
      const eigen = v.find((x) => x.san === zug) ?? v[0];
      const akzeptiert = i === 0 ? a.akzeptiert : [];
      for (const anders of v.filter((x) => x.san !== zug && !akzeptiert.includes(x.san)))
        if (eigen && gleichwertig(eigen, anders))
          gefunden.push({ id: a.id, halbzug: i, loesung: eigen, anders });
    }
    const weiter = fenNach(fen, zug);
    if (!weiter) break;
    fen = weiter;
  }
  return gefunden;
}

function alleAufgaben(): Taktikaufgabe[] {
  const daten = JSON.parse(readFileSync(TAKTIK, "utf8")) as Taktikdaten;
  const zusatz = zusatzeintraegeAus(JSON.parse(readFileSync(ZUSATZ, "utf8"))) ?? [];
  return [...daten.aufgaben, ...zusatz.flatMap((e) => alsZusatzaufgabe(e)?.aufgabe ?? [])];
}

it("gleichwertige Lösungszüge im Taktiktrainer", async () => {
  const dienst = nodeEngine();
  const aufgaben = alleAufgaben();
  const alle: Fund[] = [];
  for (const a of aufgaben) alle.push(...(await funde(dienst, a)));
  dienst.beendeEngine();
  mkdirSync(dirname(ZIEL), { recursive: true });
  writeFileSync(ZIEL, JSON.stringify({ tiefe: TIEFE, aufgaben: aufgaben.length, funde: alle }));
  const mitFund = new Set(alle.map((f) => f.id)).size;
  console.log(`${aufgaben.length} Aufgaben, ${mitFund} mit gleichwertigem Zug → ${ZIEL}`);
});
