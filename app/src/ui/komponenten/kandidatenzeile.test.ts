/**
 * Tests für die Zeilen der Engine-Rechnung bei „Erzwingende Züge“ (Vorschlag B1) an Abb. 7.14,
 * mit festen Ergebnissen statt der Engine.
 */
import { describe, expect, it } from "vitest";
import { erzwingendeKandidaten } from "../../analyse/k7-erzwingend";
import type { Kandidatenruhe } from "../../engine/kandidatenruhe";
import { stellungVon } from "../../schach/buchabbildungen.testhilfe";
import { kandidatenzeile } from "./kandidatenzeile";

const STELLUNG = stellungVon("7.14");
const [TE8, TH8, SXF7] = erzwingendeKandidaten(STELLUNG, "white");

function ergebnis(teil: Partial<Kandidatenruhe>): Kandidatenruhe {
  return {
    zug: "",
    zuege: [],
    ende: "ruhe",
    bilanz: 0,
    figur: null,
    wert: { art: "bauern", bauern: 0 },
    matt: null,
    ...teil,
  };
}

describe("kandidatenzeile (Abb. 7.14)", () => {
  it("2. Th8+: gewinnt die Dame", () => {
    const ruhe = ergebnis({
      zuege: ["h1h8", "g8h8", "g5f7", "h8g8", "f7d6"],
      bilanz: 5,
      figur: "queen",
      wert: { art: "bauern", bauern: 6.2 },
    });
    expect(TH8 && kandidatenzeile(STELLUNG, "white", TH8, ruhe)).toBe(
      "2. Th8+ Kxh8 Sxf7+ Kg8 Sxd6 – Material bis zur Ruhe: +5 (gewinnt die Dame); Engine +6,20",
    );
  });

  it("3. Sxf7: verliert einen Springer", () => {
    const ruhe = ergebnis({
      zuege: ["g5f7", "d6d1"],
      bilanz: -2,
      figur: "knight",
      wert: { art: "bauern", bauern: -1.5 },
    });
    expect(SXF7 && kandidatenzeile(STELLUNG, "white", SXF7, ruhe)).toContain(
      "– Material bis zur Ruhe: −2 (verliert einen Springer)",
    );
  });

  it("1. Te8+: Material gleich, noch nicht ruhig", () => {
    const ruhe = ergebnis({ zuege: ["e1e8", "a8e8"], ende: "offen" });
    expect(TE8 && kandidatenzeile(STELLUNG, "white", TE8, ruhe)).toBe(
      "1. Te8+ Txe8 – Material bis zur Ruhe: 0 (Material gleich, noch nicht ruhig); Engine +0,00",
    );
  });

  it("ein Matt: ohne Bilanz", () => {
    const ruhe = ergebnis({ zuege: ["h1h8"], ende: "matt", matt: "setzt" });
    expect(TH8 && kandidatenzeile(STELLUNG, "white", TH8, ruhe)).toBe("2. Th8+ – setzt matt");
  });
});
