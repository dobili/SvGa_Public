/** Tests für den gemeinsamen Umriss markierter Felder (R36). */
import { describe, expect, it } from "vitest";
import { FELD } from "./masse";
import { umrisse } from "./umriss";

const EINZUG = 50;

describe("Umriss markierter Felder", () => {
  it("rahmt ein einzelnes Feld wie bisher, ganz im Feld", () => {
    // a8 liegt normal oben links: Ecke (0, 0).
    expect(umrisse(["a8"], false, EINZUG)).toEqual([
      [
        { x: EINZUG, y: EINZUG },
        { x: FELD - EINZUG, y: EINZUG },
        { x: FELD - EINZUG, y: FELD - EINZUG },
        { x: EINZUG, y: FELD - EINZUG },
      ],
    ]);
  });

  it("macht aus dem Zentrum d4, e4, d5, e5 einen Rahmen mit vier Ecken", () => {
    const zuege = umrisse(["d4", "e4", "d5", "e5", "e5"], false, EINZUG);
    expect(zuege).toHaveLength(1);
    expect(zuege[0]).toEqual([
      { x: 3 * FELD + EINZUG, y: 3 * FELD + EINZUG },
      { x: 5 * FELD - EINZUG, y: 3 * FELD + EINZUG },
      { x: 5 * FELD - EINZUG, y: 5 * FELD - EINZUG },
      { x: 3 * FELD + EINZUG, y: 5 * FELD - EINZUG },
    ]);
  });

  it("folgt einem L mit sechs Ecken, die innere Ecke ebenfalls nach innen versetzt", () => {
    // a8, b8 und a7: oben zwei Felder, links darunter eines.
    const [zug] = umrisse(["a8", "b8", "a7"], false, EINZUG);
    expect(zug).toHaveLength(6);
    expect(zug).toContainEqual({ x: FELD - EINZUG, y: FELD - EINZUG });
  });

  it("lässt Felder getrennt, die sich nur an einer Ecke berühren", () => {
    expect(umrisse(["a8", "b7"], false, EINZUG)).toHaveLength(2);
    expect(umrisse(["a8", "b7", "zz"], true, EINZUG)).toHaveLength(2);
  });

  it("gibt einem Ring um ein freies Feld einen äußeren und einen inneren Zug", () => {
    const ring = ["c3", "d3", "e3", "c4", "e4", "c5", "d5", "e5"];
    expect(umrisse(ring, false, EINZUG)).toHaveLength(2);
  });
});
