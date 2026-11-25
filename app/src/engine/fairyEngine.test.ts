/**
 * Tests der Anbindung an Fairy-Stockfish (engine/fairyEngine.ts) mit einem erfundenen Worker:
 * Lesen der Ausgabe, Reihenfolge der Vorbereitung, Reihe der Aufträge.
 */
import { describe, expect, it } from "vitest";
import { FairyEngine, kandidatenAus, perftZuege, type Fairyworker } from "./fairyEngine";

/** Ein Worker, der auf die bekannten Befehle antwortet und alles mitschreibt. */
function probeworker(): { worker: Fairyworker; gesendet: unknown[] } {
  const gesendet: unknown[] = [];
  const worker: Fairyworker = {
    onmessage: null,
    postMessage(nachricht) {
      gesendet.push(nachricht);
      const antworte = (zeilen: string[]) =>
        queueMicrotask(() => zeilen.forEach((z) => worker.onmessage?.({ data: z })));
      if (nachricht === "uci") antworte(["id name Fairy-Stockfish", "uciok"]);
      if (nachricht === "isready") antworte(["readyok"]);
      if (nachricht === "go perft 1") antworte(["e2e4: 1", "d2d4: 1", "", "Nodes searched: 2"]);
      if (typeof nachricht === "string" && nachricht.startsWith("go movetime")) {
        antworte([
          "info depth 3 multipv 1 score cp 20 pv d2d4",
          "info depth 4 multipv 1 score cp 35 pv e2e4 e7e5",
          "info depth 4 multipv 2 score mate -3 pv a2a3",
          "bestmove e2e4 ponder e7e5",
        ]);
      }
    },
  };
  return { worker, gesendet };
}

const DREISCHACH = { engine: "fairy", uciVariante: "3check" } as const;
const DRACHE = { engine: "fairy", uciVariante: "drache", ini: "[drache:chess]" } as const;

describe("Fairy-Stockfish", () => {
  it("liest je MultiPV den letzten Wert und Zug", () => {
    const zeilen = ["info depth 1 score cp 5 pv g1f3", "info depth 2 multipv 1 score cp 9 pv e2e4"];
    expect(kandidatenAus(zeilen, 2)).toEqual([{ zug: "e2e4", wert: { cp: 9 } }]);
    expect(kandidatenAus(["info multipv 1 score mate 2 pv h5f7"], 1)).toEqual([
      { zug: "h5f7", wert: { matt: 2 } },
    ]);
  });

  it("liest legale Züge aus perft", () => {
    expect(perftZuege(["a2a3: 1", "P@e4: 1", "Nodes searched: 2"])).toEqual(["a2a3", "P@e4"]);
  });

  it("bereitet die Variante einmal vor und rechnet Kandidaten", async () => {
    const { worker, gesendet } = probeworker();
    const engine = new FairyEngine(() => worker);
    const anfrage = { fen: "startpos", engine: DREISCHACH, ms: 10, kandidaten: 2 };
    const kandidaten = await engine.analysiere(anfrage);
    expect(kandidaten).toEqual([
      { zug: "e2e4", wert: { cp: 35 } },
      { zug: "a2a3", wert: { matt: -3 } },
    ]);
    expect(gesendet.slice(0, 4)).toEqual([
      "uci",
      "setoption name UCI_Variant value 3check",
      "ucinewgame",
      "isready",
    ]);
    await engine.legaleZuege("startpos", DREISCHACH);
    expect(gesendet.filter((g) => g === "uci" || g === "ucinewgame")).toHaveLength(2);
  });

  it("legt die variants.ini ab und hält die Reihe ein", async () => {
    const { worker, gesendet } = probeworker();
    const engine = new FairyEngine(() => worker);
    const [zuege] = await Promise.all([
      engine.legaleZuege("x", DRACHE),
      engine.analysiere({ fen: "x", engine: DREISCHACH, ms: 10, kandidaten: 1 }),
    ]);
    expect(zuege).toEqual(["e2e4", "d2d4"]);
    expect(gesendet[1]).toEqual({ datei: "/varianten.ini", inhalt: "[drache:chess]" });
    const perft = gesendet.indexOf("go perft 1");
    expect(gesendet.indexOf("setoption name UCI_Variant value 3check")).toBeGreaterThan(perft);
  });
});
