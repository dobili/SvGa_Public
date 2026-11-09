/** Tests für Schach960: Startstellungen nach Scharnagl, Engine-Modus, Rochade in UCI. */
import { describe, expect, it } from "vitest";
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { parseSquare } from "chessops/util";
import {
  brauchtChess960,
  grundreihe960,
  NUMMER_GRUNDSTELLUNG,
  rochadeUci,
  startFen960,
  zufallsnummer960,
} from "./chess960";
import { sanZuUci, uciZuSan } from "../spiel/zuege";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function stellung(fen: string): Chess {
  return Chess.fromSetup(parseFen(fen).unwrap()).unwrap();
}

describe("Startstellungen nach Scharnagl", () => {
  it("518 ist die Grundstellung, 0 beginnt mit zwei Läufern", () => {
    expect(grundreihe960(NUMMER_GRUNDSTELLUNG)).toBe("RNBQKBNR");
    expect(grundreihe960(0)).toBe("BBQNNRKR");
    expect(grundreihe960(959)).toBe("RKRNNQBB");
  });

  it("alle 960 sind verschieden und regelgerecht", () => {
    const reihen = new Set<string>();
    for (let n = 0; n < 960; n++) {
      const reihe = grundreihe960(n);
      reihen.add(reihe);
      const laeufer = [...reihe].flatMap((s, i) => (s === "B" ? [i % 2] : []));
      expect(laeufer.sort()).toEqual([0, 1]);
      expect(reihe.indexOf("R")).toBeLessThan(reihe.indexOf("K"));
      expect(reihe.lastIndexOf("R")).toBeGreaterThan(reihe.indexOf("K"));
      expect(() => stellung(startFen960(n))).not.toThrow();
    }
    expect(reihen.size).toBe(960);
  });

  it("Zufallsnummer bleibt im Bereich", () => {
    expect(zufallsnummer960(() => 0)).toBe(0);
    expect(zufallsnummer960(() => 0.9999)).toBe(959);
  });
});

describe("Engine-Modus und Rochade", () => {
  it("gewöhnliches Schach braucht den Modus nie", () => {
    expect(brauchtChess960(GRUNDSTELLUNG)).toBe(false);
    expect(brauchtChess960(startFen960(NUMMER_GRUNDSTELLUNG))).toBe(false);
    expect(brauchtChess960("8/8/8/8/8/8/8/K6k w - - 0 1")).toBe(false);
  });

  it("Schach960 mit König außerhalb von e braucht ihn", () => {
    expect(brauchtChess960(startFen960(0))).toBe(true);
  });

  it("Rochade: gewöhnlich e1g1, im Schach960 König auf Turm", () => {
    const normal = stellung("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
    const zug = { from: parseSquare("e1") ?? 0, to: parseSquare("h1") ?? 0 };
    expect(rochadeUci(normal, zug)).toBe("e1g1");
    const fen960 = "1r4kr/8/8/8/8/8/8/1R4KR w HBhb - 0 1";
    const kurz = { from: parseSquare("g1") ?? 0, to: parseSquare("h1") ?? 0 };
    expect(rochadeUci(stellung(fen960), kurz)).toBe("g1h1");
    expect(sanZuUci(fen960, "O-O-O")).toBe("g1b1");
    expect(uciZuSan(fen960, "g1b1")).toBe("O-O-O");
    expect(sanZuUci("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", "O-O")).toBe("e1g1");
  });
});

describe("Eingabe am Brett im Schach960", () => {
  it("der König tippt zur Rochade den eigenen Turm an", async () => {
    const { legaleZiele, spieleZug } = await import("./weiterspielen");
    const fen960 = "1r4kr/8/8/8/8/8/8/1R4KR w HBhb - 0 1";
    expect(legaleZiele(fen960, "g1")).toContain("h1");
    const kurz = spieleZug(fen960, "g1", "h1");
    expect(kurz.art === "gespielt" && kurz.san).toBe("O-O");
    // Gewöhnliches Schach bleibt beim Antippen des Zielfelds g1.
    const normal = spieleZug("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", "e1", "g1");
    expect(normal.art === "gespielt" && normal.san).toBe("O-O");
    expect(legaleZiele("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", "e1")).toContain("g1");
  });
});
