/**
 * Messlauf „Menschenprofil“: jede Stellung aus Menschenpartien mit der Engine auswerten.
 *
 * Rolle im Gesamtbild: Schritt 1 des Plans „menschlichere Bots und Uhr der Bots“ (vom Autor
 * freigegeben am 20.10.2026). Die Partien sammelt pipeline/menschenprofil/sammeln.py aus der
 * Lichess-Datenbank (mit Uhrzeit je Zug). Für jede Stellung hält dieser Lauf fest:
 * - die besten Züge der Engine (MultiPV) mit Wert, Fehlerart und blinden Flecken,
 * - die typischen Fehlerzüge der Stellung nach den Werkzeugen des Buches (bis zu drei je Art),
 *   gezielt bewertet („searchmoves“): das sind die Gelegenheiten für jede Fehlerart,
 * - den gespielten Zug mit Wert, Fehlerart und blinden Flecken,
 * - Wertung, Tempo, Restzeit und verbrauchte Zeit.
 * Daraus rechnet der nächste Schritt je Wertungsband, wie oft Menschen eine Gelegenheit zu einem
 * Fehler nutzen, wie lange sie nachdenken und wie Zeitnot wirkt. Werte in Bauerneinheiten aus Sicht
 * der Seite am Zug. Rohdaten nur lokal (MENSCHENPROFIL_ORDNER, Vorgabe ../buch/arbeit/menschenprofil).
 * Umgebung: ENGINE_PFAD (native Stockfish-Datei), TIEFE (Vorgabe 12), LAUF und LAEUFE (Aufteilung
 * auf mehrere Prozesse), MINUTEN (Zeitgrenze). Fortsetzbar: fertige Partien stehen in
 * `fertig-<LAUF>.txt` und werden übersprungen.
 * Aufruf (im Ordner app/): LAUF=0 LAEUFE=4 npx vitest run --config vitest.messung.config.ts
 *   src/engine/menschenprofil.messung.ts
 * Abhängigkeiten: engine/fehlerart.ts, engine/fehlersuche.ts, engine/blindeFlecken.ts,
 * engine/nativeEngine.testhilfe.ts, spiel/zuege.ts.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fenNach, sanZuUci } from "../spiel/zuege";
import { fleckeVon } from "./blindeFlecken";
import type { Bewertung } from "./engineDienst";
import { alleZuege, fehlerartIn, lageVon, type Fehlerart, type Lage } from "./fehlerart";
import { typischeFehlerzuege } from "./fehlersuche";
import { nativeEngine } from "./nativeEngine.testhilfe";
import { wertFuer } from "./spielbewerter";

const ORDNER =
  process.env.MENSCHENPROFIL_ORDNER ??
  join(process.cwd(), "..", "buch", "arbeit", "menschenprofil");
const ENGINE_PFAD =
  process.env.ENGINE_PFAD ??
  join(
    process.cwd(),
    "..",
    "buch",
    "arbeit",
    "werkzeug",
    "stockfish",
    "stockfish-ubuntu-x86-64-avx2",
  );
const TIEFE = Number(process.env.TIEFE ?? "12");
const LAUF = Number(process.env.LAUF ?? "0");
const LAEUFE = Number(process.env.LAEUFE ?? "1");
const MINUTEN = Number(process.env.MINUTEN ?? "100000");
const MS_JE_MINUTE = 60_000;
/** Die Tiefe begrenzt; die Rechenzeit ist nur ein Notanker. */
const RECHENZEIT_MS = 60_000;
const VARIANTEN = 6;
const JE_ART = 3;
const HUNDERTSTEL_JE_SEKUNDE = 100;
const STELLEN = 100;
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

interface Partie {
  kennung: string;
  tempo: string;
  start: number;
  zuschlag: number;
  weiss: number;
  schwarz: number;
  zuege: string[];
  uhren: number[];
}

/** Ein bewerteter Zug: UCI, Wert danach (Sicht der Seite am Zug), Fehlerart, blinde Flecken. */
type Zugwert = [string, number, Fehlerart, string[]];

function gerundet(x: number): number {
  return Math.round(x * STELLEN) / STELLEN;
}

/** Bis zu drei typische Fehlerzüge je Art (Anfang, Mitte, Ende der Liste, ohne Zufall). */
function gelegenheiten(lage: Lage, schon: ReadonlySet<string>): string[] {
  const jeArt = new Map<Fehlerart, string[]>();
  for (const k of typischeFehlerzuege(lage)) {
    if (!schon.has(k.uci)) jeArt.set(k.art, [...(jeArt.get(k.art) ?? []), k.uci]);
  }
  return [...jeArt.values()].flatMap((liste) => {
    const stellen = [0, Math.floor(liste.length / 2), liste.length - 1];
    return [...new Set(stellen.map((i) => liste[i] as string))].slice(0, JE_ART);
  });
}

/** Die Varianten einer Bewertung als Zugwerte (Wert, Art mit Verlust gegen den besten Wert). */
function zugwerte(
  fen: string,
  lage: Lage,
  b: Bewertung,
  bestwert: number,
  bester: string | null,
): Zugwert[] {
  const weiss = fen.split(" ")[1] === "w";
  return b.varianten.flatMap((v) => {
    const uci = v.zuege[0];
    if (!uci) return [];
    const wert = wertFuer(v.wert, weiss);
    const art = fehlerartIn(lage, uci, v.zuege.slice(1), bestwert - wert, bester);
    return [[uci, gerundet(wert), art, fleckeVon(fen, uci)] as Zugwert];
  });
}

const engine = nativeEngine(ENGINE_PFAD);

/** Wertet eine Stellung aus: Kandidaten der Engine, Gelegenheiten, gespielter Zug. */
async function stellung(fen: string, gespielt: string) {
  const lage = lageVon(fen);
  if (!lage) return null;
  const staerke = { art: "tiefe", tiefe: TIEFE } as const;
  const beste = await engine.bewerte(fen, RECHENZEIT_MS, VARIANTEN, staerke);
  const weiss = fen.split(" ")[1] === "w";
  const erste = beste.varianten[0];
  if (!erste) return null;
  const bestwert = wertFuer(erste.wert, weiss);
  const k = zugwerte(fen, lage, beste, bestwert, beste.besterZug);
  const schon = new Set(k.map((z) => z[0]));
  const extra = gelegenheiten(lage, schon);
  if (!schon.has(gespielt) && !extra.includes(gespielt)) extra.push(gespielt);
  const gezielt =
    extra.length > 0 ? await engine.bewerte(fen, RECHENZEIT_MS, 1, staerke, extra) : null;
  const x = gezielt ? zugwerte(fen, lage, gezielt, bestwert, beste.besterZug) : [];
  return { ph: lage.phase, n: alleZuege(lage).length, sc: lage.regeln.isCheck(), k, x };
}

/** Alle Stellungen einer Partie, je eine Zeile. */
async function partie(p: Partie, ziel: string): Promise<void> {
  let fen = GRUNDSTELLUNG;
  for (let i = 0; i < p.zuege.length; i += 1) {
    const san = p.zuege[i] as string;
    const uci = sanZuUci(fen, san);
    if (!uci) return;
    const weiss = i % 2 === 0;
    const vorher = i >= 2 ? (p.uhren[i - 2] as number) : p.start * HUNDERTSTEL_JE_SEKUNDE;
    const nachher = p.uhren[i] as number;
    const daten = await stellung(fen, uci);
    if (daten) {
      const zeile = {
        g: p.kennung,
        p: i,
        t: p.tempo,
        s: p.start,
        z: p.zuschlag,
        w: weiss ? p.weiss : p.schwarz,
        o: weiss ? p.schwarz : p.weiss,
        u: vorher,
        v: i >= 2 ? vorher - nachher + p.zuschlag * HUNDERTSTEL_JE_SEKUNDE : null,
        f: fen,
        m: uci,
        ...daten,
      };
      appendFileSync(ziel, JSON.stringify(zeile) + "\n");
    }
    const naechste = fenNach(fen, san);
    if (!naechste) return;
    fen = naechste;
  }
}

describe("Menschenprofil", () => {
  it("wertet die Stellungen der gesammelten Partien aus", async () => {
    const quelle = join(ORDNER, "partien.jsonl");
    expect(existsSync(quelle)).toBe(true);
    const fertigDatei = join(ORDNER, `fertig-${LAUF}.txt`);
    const fertig = new Set(
      existsSync(fertigDatei) ? readFileSync(fertigDatei, "utf8").split("\n") : [],
    );
    const ziel = join(ORDNER, `stellungen-${LAUF}.jsonl`);
    const ende = Date.now() + MINUTEN * MS_JE_MINUTE;
    const alle = readFileSync(quelle, "utf8")
      .split("\n")
      .filter((z) => z.trim());
    let gemacht = 0;
    for (let i = LAUF; i < alle.length && Date.now() < ende; i += LAEUFE) {
      const p = JSON.parse(alle[i] as string) as Partie;
      if (fertig.has(p.kennung)) continue;
      await partie(p, ziel);
      appendFileSync(fertigDatei, p.kennung + "\n");
      gemacht += 1;
    }
    engine.beendeEngine();
    console.log(`Lauf ${LAUF}: ${gemacht} Partien ausgewertet`);
  });
});
