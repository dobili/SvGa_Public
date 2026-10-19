/** Tests für die Notation wie im Buch (Kapitel 0). */
import { describe, expect, it } from "vitest";
import { buchzugInSprache, zugfolgeAlsText } from "./notation";
import { stellungAusFen } from "./stellung";

function regeln(fen: string) {
  const stellung = stellungAusFen(fen);
  if (!stellung.ok || !stellung.wert.regeln) throw new Error("Testdaten fehlerhaft");
  return stellung.wert.regeln;
}

describe("zugfolgeAlsText", () => {
  it("schreibt deutsche Figurenbuchstaben und Zugnummern", () => {
    const start = regeln("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(zugfolgeAlsText(start, ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"], "de")).toBe(
      "1. e4 e5 2. Sf3 Sc6 3. Lb5",
    );
  });

  it("beginnt mit „...“, wenn Schwarz am Zug ist (Abb. 1.28)", () => {
    const abb128 = regeln("r1b1kbnr/pp3ppp/1qn1p3/3pP3/3P4/3B1N2/PP3PPP/RNBQK2R b KQkq - 0 7");
    expect(zugfolgeAlsText(abb128, ["c8d7", "b1c3"], "de")).toBe("7... Ld7 8. Sc3");
  });

  it("bricht bei einem ungültigen Zug ab und verändert die Stellung nicht", () => {
    const start = regeln("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(zugfolgeAlsText(start, ["e2e4", "e2e4"], "de")).toBe("1. e4");
    expect(start.turn).toBe("white");
  });

  it("begrenzt die Zahl der Halbzüge", () => {
    const start = regeln("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(zugfolgeAlsText(start, ["e2e4", "e7e5", "g1f3"], "de", 2)).toBe("1. e4 e5");
  });
});

describe("buchzugInSprache", () => {
  it("lässt deutsche Züge auf Deutsch stehen und schreibt sie englisch um", () => {
    expect(buchzugInSprache("5... Db6", "de")).toBe("5... Db6");
    expect(buchzugInSprache("5... Db6", "en")).toBe("5... Qb6");
    expect(buchzugInSprache("4. Sc3! Lc5 5. Sxd5 Txd5 6. Kf1 O-O", "en")).toBe(
      "4. Nc3! Bc5 5. Nxd5 Rxd5 6. Kf1 O-O",
    );
    expect(buchzugInSprache("8. exd8=D+", "en")).toBe("8. exd8=Q+");
  });
});
