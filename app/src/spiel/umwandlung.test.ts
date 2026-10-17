/** Tests der Steinprüfung für aufgebaute Stellungen (Rückfrage S12). */
import { describe, expect, it } from "vitest";
import { ladbar, spielbar } from "./partie";

describe("Steine durch Umwandlung möglich (S12)", () => {
  it("zwei weiße Damen bei acht weißen Bauern: nicht spielbar, gespeichert aber ladbar", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNQQKBNR b KQkq - 0 1";
    expect(spielbar(fen)).toBe(false);
    expect(ladbar(fen)).toBe(true);
  });

  it("zwei weiße Damen bei sieben Bauern oder ohne Bauern: spielbar", () => {
    expect(spielbar("rnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/RNQQKBNR b Kkq - 0 1")).toBe(true);
    expect(spielbar("4k3/8/8/8/8/8/8/QQ2K3 b - - 0 1")).toBe(true);
  });

  it("drei Springer und acht Bauern für Schwarz: nicht spielbar", () => {
    expect(spielbar("rnbqkbnr/pppppppp/2n5/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toBe(false);
  });
});
