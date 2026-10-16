/**
 * Tests der Drohungen und erzwingenden Züge an Kapitel 1 und 7.
 * Regel: Konzept 7.2 „Drohungen technisch“, Kapitel 1 Schach-Röntgen-Regel.
 */
import { describe, expect, it } from "vitest";
import type { Chess } from "chessops/chess";
import { makeUci } from "chessops/util";
import { alleAbbildungen, stellungVon } from "./buchabbildungen.testhilfe";
import { drohendeZuege, drohungenVon, erzwingendeZuege, nullzug, schachs } from "./drohungen";
import { stellungAusFen } from "./stellung";

function regeln(nummer: string): Chess {
  const { regeln: r } = stellungVon(nummer);
  if (!r) throw new Error(`Abb. ${nummer} ohne Regeln`);
  return r;
}

describe("erzwingendeZuege", () => {
  it("Abb. 1.23: das Schach Sf6+ und der schlichte Abtausch Sxc5 (Bilanz 0)", () => {
    const e = erzwingendeZuege(regeln("1.23"));
    expect(e.schachs.map((z) => z.san)).toContain("Nf6+");
    const sxc5 = e.schlaege.find((z) => z.san === "Nxc5");
    expect(sxc5?.bilanz).toBe(0);
  });

  it("Abb. 1.34: Weiß hat Matt in einem Zug mit Dxh7#", () => {
    const e = erzwingendeZuege(regeln("1.34"));
    expect(e.schachs.filter((z) => z.matt).map((z) => z.san)).toEqual(["Qxh7#"]);
  });

  it("Abb. 1.28: Sxd4 gewinnt laut Zählung einen Bauern", () => {
    const e = erzwingendeZuege(regeln("1.28"));
    expect(e.schlaege[0]?.san).toBe("Nxd4");
    expect(e.schlaege[0]?.bilanz).toBe(1);
  });
});

describe("drohungenVon", () => {
  it("Abb. 1.34: Schwarz droht Sxd3 (die Dame, Bilanz +6); Dxg5 ist keine Drohung (Lc1 deckt)", () => {
    const drohungen = drohungenVon(regeln("1.34"), "black") ?? [];
    const sxd3 = drohungen.find((d) => d.art === "material" && d.zug.san === "Nxd3");
    expect(sxd3?.art === "material" && sxd3.zug.bilanz).toBe(6);
    expect(drohungen.some((d) => d.zug.san === "Qxg5")).toBe(false);
  });

  it("Abb. 1.30: die Drohung gegen d4 ist echt (Sxd4, +1)", () => {
    const drohungen = drohungenVon(regeln("1.30"), "black") ?? [];
    expect(drohungen.map((d) => d.zug.san)).toContain("Nxd4");
  });

  it("Abb. 1.24: Schwarz steht im Schach, die Frage nach weißen Drohungen entfällt", () => {
    expect(drohungenVon(regeln("1.24"), "white")).toBeNull();
  });

  it("Abb. 1.24, wäre Weiß am Zug: Sxd5 gewinnt die Dame", () => {
    const weiss = nullzug(regeln("1.24"), "white");
    expect(weiss.turn).toBe("white");
  });
});

describe("drohendeZuege", () => {
  it("Abb. 7.8: 1. g5! greift den Springer an und droht gxf6", () => {
    const drohende = drohendeZuege(regeln("7.8"));
    const g5 = drohende.find((z) => z.san === "g5");
    expect(g5?.drohungen.map((d) => d.zug.san)).toContain("gxf6");
  });

  it("zählt nur neue Drohungen: Abb. 1.30, Weiß am Zug, 8. Sc3?! droht nichts Neues gegen d4", () => {
    const drohende = drohendeZuege(regeln("1.30"));
    const sc3 = drohende.find((z) => z.san === "Nc3");
    expect(sc3?.drohungen.some((d) => d.zug.nach === 27)).toBeFalsy();
  });
});

describe("Vorprüfung der Schachs", () => {
  it("lässt auf keiner Abbildung des Buches ein Schach aus (Vergleich mit dem vollen Lauf)", () => {
    for (const abbildung of alleAbbildungen()) {
      const stellung = stellungAusFen(abbildung.fen);
      if (!stellung.ok || !stellung.wert.regeln) continue;
      const r = stellung.wert.regeln;
      const erwartet: string[] = [];
      for (const [von, ziele] of r.allDests()) {
        for (const nach of ziele) {
          const kopie = r.clone();
          kopie.play({ from: von, to: nach });
          if (kopie.isCheck()) erwartet.push(makeUci({ from: von, to: nach }));
        }
      }
      expect(
        schachs(r)
          .map((z) => z.uci)
          .sort(),
        `Abb. ${abbildung.id}`,
      ).toEqual(erwartet.sort());
    }
  });
});
