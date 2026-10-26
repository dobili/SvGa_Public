/**
 * Tests der Zufallszüge der Spaß-Bots: legal, gleich verteilt über die Liste,
 * Umwandlung in eine Dame, kein Zug im Matt.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { parseUci } from "chessops/util";
import { describe, expect, it } from "vitest";
import { zufallszug } from "./zufallszug";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function istLegal(fen: string, uci: string): boolean {
  const pos = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();
  const zug = parseUci(uci);
  return zug !== undefined && pos.isLegal(zug);
}

describe("Zufallszug", () => {
  it("liefert in der Grundstellung legale Züge, je nach Zufall verschiedene", () => {
    const gezogen = new Set<string>();
    for (let i = 0; i < 20; i += 1) {
      const zug = zufallszug(GRUNDSTELLUNG, () => i / 20);
      expect(zug?.quelle).toBe("fehler");
      expect(zug?.fehler).toBeNull();
      expect(istLegal(GRUNDSTELLUNG, zug?.uci ?? "")).toBe(true);
      gezogen.add(zug?.uci ?? "");
    }
    expect(gezogen.size).toBe(20);
  });

  it("wandelt einen Bauern auf der letzten Reihe in eine Dame um", () => {
    const fen = "8/P7/8/8/8/8/8/k6K w - - 0 1";
    const zuege = Array.from({ length: 10 }, (_, i) => zufallszug(fen, () => i / 10)?.uci);
    expect(zuege).toContain("a7a8q");
    for (const uci of zuege) expect(istLegal(fen, uci ?? "")).toBe(true);
  });

  it("gibt im Matt und bei unlesbarer Stellung keinen Zug", () => {
    const matt = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(zufallszug(matt, () => 0)).toBeNull();
    expect(zufallszug("kein fen", () => 0)).toBeNull();
  });
});
