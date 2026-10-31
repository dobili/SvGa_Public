/** Tests der Begründungen im Trainer „Gangarten“ (Nebenchat, 30.10.2026). */
import { describe, expect, it } from "vitest";
import { gangartbegruendungen } from "./gangartbegruendung";

/** Weiß am Zug; der Springer c3 ist durch den Läufer b4 an den König e1 gefesselt. */
const FESSELUNG = "4k3/8/8/8/1b6/2N5/8/4K3 w - - 0 1";
/** Weiß am Zug, Turm a1, eigener Bauer a3 davor, schwarzer Springer e1. */
const TURM = "4k3/8/8/8/8/P7/8/R3n1K1 w - - 0 1";

describe("Gangarten: Begründungen", () => {
  it("gefesselter Springer: jedes Feld verboten, mit Grund", () => {
    const [satz] = gangartbegruendungen(FESSELUNG, "c3", [], ["d5"]);
    expect(satz).toContain("gefesselt");
  });

  it("Turm: Gangart, versperrter Weg, eigene Figur, übersehener Schlag", () => {
    const saetze = gangartbegruendungen(TURM, "a1", ["e1"], ["b2", "a5", "a3"]);
    expect(saetze[0]).toContain("schlagen");
    expect(saetze[1]).toContain("So zieht die Figur nicht");
    expect(saetze[2]).toContain("versperrt");
    expect(saetze[3]).toContain("eigene Figur");
  });

  it("König darf nicht ins Schach, Bauer schlägt nicht ins Leere", () => {
    const fen = "4k3/8/8/8/8/8/4P3/r3K3 w - - 0 1";
    expect(gangartbegruendungen(fen, "e1", [], ["d1"])[0]).toContain("Schach");
    expect(gangartbegruendungen(fen, "e2", [], ["d3"])[0]).toContain("Schräg");
  });
});
