/** Tests für regeln/stellungsmerkmale.ts und die Merkmale opposition und gabel der Partiemomente. */
import { describe, expect, it } from "vitest";
import { parseSquare } from "chessops/util";
import { stellungAusFen } from "../../schach/stellung";
import { merkmalTrifft, type Partieverlauf } from "./partiemomente";
import { inOpposition, istGabel } from "./stellungsmerkmale";

function brett(fen: string) {
  const s = stellungAusFen(fen);
  if (!s.ok) throw new Error(s.fehler);
  return s.wert.brett;
}

function feld(name: string) {
  const f = parseSquare(name);
  if (f === undefined) throw new Error(name);
  return f;
}

describe("inOpposition (Kapitel 8)", () => {
  it("erkennt Linie, Reihe und Diagonale mit einem Feld Abstand", () => {
    expect(inOpposition(brett("8/8/4k3/8/4K3/8/8/8 w - - 0 1"))).toBe(true);
    expect(inOpposition(brett("8/8/6k1/8/4K3/8/8/8 w - - 0 1"))).toBe(true);
    expect(inOpposition(brett("8/8/5k2/8/4K3/8/8/8 w - - 0 1"))).toBe(false);
  });
});

describe("istGabel (Kapitel 1)", () => {
  it("Springer gegen König und Turm ist eine Gabel, gegen zwei gedeckte Bauern nicht", () => {
    expect(istGabel(brett("r3k3/2N5/8/8/8/8/8/4K3 b - - 0 1"), feld("c7"))).toBe(true);
    expect(istGabel(brett("4k3/2p5/1p1p4/8/2N5/8/8/4K3 w - - 0 1"), feld("c4"))).toBe(false);
  });
});

describe("Merkmale im Verlauf", () => {
  it("opposition und gabel lösen mit dem Halbzug aus, der sie schafft", () => {
    const opposition: Partieverlauf = {
      fens: ["8/8/4k3/8/8/4K3/8/8 w - - 0 1", "8/8/4k3/8/4K3/8/8/8 b - - 1 1"],
      vomHelden: [true],
      held: "white",
    };
    expect(merkmalTrifft("opposition", opposition, 1)).toBe(true);
    const gabel: Partieverlauf = {
      fens: ["r3k3/8/1N6/8/8/8/8/4K3 w - - 0 1", "r3k3/2N5/8/8/8/8/8/4K3 b - - 1 1"],
      vomHelden: [true],
      held: "white",
    };
    expect(merkmalTrifft("gabel", gabel, 1)).toBe(true);
    expect(merkmalTrifft("opposition", gabel, 1)).toBe(false);
    // Seite: Der Held (Weiß) hat gezogen, also „Gegeben“, nicht „Gegen“.
    expect(merkmalTrifft("gabelGegeben", gabel, 1)).toBe(true);
    expect(merkmalTrifft("gabelGegen", gabel, 1)).toBe(false);
    expect(merkmalTrifft("oppositionGegeben", opposition, 1)).toBe(true);
    expect(merkmalTrifft("oppositionGegen", opposition, 1)).toBe(false);
  });
});
