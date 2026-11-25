/** Tests für Tandem: Takt, Übergabe an den Partner, Einsetzen, Matt (tandem.ts) und Bots. */
import { describe, expect, it } from "vitest";
import type { Move } from "chessops/types";
import { parseUci } from "chessops/util";
import type { Zugbewerter } from "./botwahl";
import { amZug, heldAmZug, neueTandempartie, spieleTandemzug, type Tandempartie } from "./tandem";
import { alleZuege, tandembotZug, tandemNotzug, tandemUci } from "./tandembot";

const zug = (uci: string) => parseUci(uci) as Move;
const stil = { varianten: 3, spielraumCp: 50, zufall: () => 0 };

/** Spielt Züge der Reihe nach auf dem Brett, das gerade am Zug ist. */
function spiele(p: Tandempartie, ...zuege: string[]): Tandempartie {
  return zuege.reduce((q, z) => spieleTandemzug(q, amZug(q), zug(z)), p);
}

describe("Tandem: Regeln", () => {
  it("Takt: zwei Halbzüge auf A, dann einer auf B", () => {
    const p = neueTandempartie("white");
    expect(heldAmZug(p)).toBe(true);
    const q = spiele(p, "e2e4", "d7d5");
    expect(amZug(q)).toBe("b");
    expect(amZug(spiele(q, "g1f3"))).toBe("a");
  });

  it("was der Held schlägt, bekommt der Partner in seiner Farbe", () => {
    const p = spiele(neueTandempartie("white"), "e2e4", "d7d5", "g1f3", "e4d5");
    expect(p.b.pockets?.black.pawn).toBe(1);
    expect(p.a.pockets?.white.pawn).toBe(0);
  });

  it("der Partner setzt die Figur ein", () => {
    let p = spiele(neueTandempartie("white"), "e2e4", "d7d5", "g1f3", "e4d5", "d8d5", "e7e6");
    expect(amZug(p)).toBe("a");
    p = spiele(p, "b1c3", "d5a5", "P@e5");
    expect(p.b.board.get(36)?.role).toBe("pawn");
  });

  it("Matt auf einem Brett entscheidet für das Team", () => {
    const p = spiele(neueTandempartie("white"), "f2f3", "e7e5", "e2e4", "g2g4", "d8h4");
    expect(p.ende).toEqual({ sieger: "gegner", brett: "a", grund: "matt" });
  });
});

describe("Tandembots", () => {
  it("nehmen einen erlaubten Engine-Zug", async () => {
    const p = neueTandempartie("black");
    const bewerter: Zugbewerter = () => Promise.resolve([{ zug: "d2d4", wert: 20 }]);
    expect(tandemUci(await tandembotZug(p, "a", bewerter, stil))).toBe("d2d4");
  });

  it("ohne Engine: Notplan setzt matt, wenn es geht", () => {
    const p = spiele(neueTandempartie("white"), "f2f3", "e7e5", "e2e4", "g2g4");
    expect(tandemUci(tandemNotzug(p.a, stil))).toBe("d8h4");
  });

  it("zählen Einsetzen mit", () => {
    const p = spiele(neueTandempartie("white"), "e2e4", "d7d5", "g1f3", "e4d5", "d8d5", "e7e6");
    const q = spiele(p, "b1c3", "d5a5");
    expect(alleZuege(q.b).some((z) => "role" in z)).toBe(true);
  });
});

describe("Tandem: Randfälle", () => {
  it("Rochade (König auf Turmfeld) gibt nichts an den Partner", () => {
    const p = neueTandempartie("white", "r3k3/8/8/8/8/8/8/R3K2R[] w KQq - 0 1");
    const q = spieleTandemzug(p, "a", zug("e1h1"));
    expect(q.b.pockets?.black.rook).toBe(0);
    expect(q.a.pockets?.white.rook).toBe(0);
  });
});

describe("Tandem: Rochade in Engine-Schreibweise", () => {
  it("e1g1 wird als Rochade gespielt", () => {
    const p = neueTandempartie("white", "r3k3/8/8/8/8/8/8/R3K2R[] w KQq - 0 1");
    const q = spieleTandemzug(p, "a", zug("e1g1"));
    expect(q.a.board.get(6)?.role).toBe("king");
    expect(q.a.board.get(5)?.role).toBe("rook");
  });
});
