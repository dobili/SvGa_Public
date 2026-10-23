/**
 * Tests der Fortsetzung einer festgelegten Eröffnung mit Zügen derselben Familie (R24).
 */
import { describe, expect, it } from "vitest";
import { familieVon, zuegeDerFamilie } from "./eroeffnungsfamilie";
import type { Eroeffnungsnamen } from "./eroeffnungsnamen";

/** Kleine Liste wie die von Lichess: Stellungsschlüssel → ECO und Name. */
const BEKANNTE: Eroeffnungsnamen = new Map([
  [
    "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq",
    { eco: "C68", name: "Ruy Lopez: Morphy Defense" },
  ],
  [
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq",
    { eco: "C60", name: "Ruy Lopez" },
  ],
  [
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq",
    { eco: "C50", name: "Italian Game: Classical Variation" },
  ],
]);

describe("eroeffnungsfamilie", () => {
  it("die Familie ist der Name vor dem Doppelpunkt", () => {
    expect(familieVon("Ruy Lopez: Morphy Defense")).toBe("Ruy Lopez");
    expect(familieVon("Ruy Lopez")).toBe("Ruy Lopez");
  });

  it("ohne Buchzug: nur Züge, die in dieselbe Familie führen", () => {
    // Nach 1. e4 e5 2. Sf3 Sc6 3. Lb5: a6 führt in „Ruy Lopez: Morphy Defense“.
    const fen = "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
    expect(zuegeDerFamilie(BEKANNTE, fen, "Ruy Lopez")).toEqual(["a6"]);
    expect(zuegeDerFamilie(BEKANNTE, fen, "Italian Game")).toEqual([]);
  });

  it("ungültige Stellung: keine Züge", () => {
    expect(zuegeDerFamilie(BEKANNTE, "kein fen", "Ruy Lopez")).toEqual([]);
  });
});
