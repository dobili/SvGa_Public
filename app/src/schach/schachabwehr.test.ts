/**
 * Referenztests für die Abwehrzüge: Abb. 12.3 (Schach durch 3. Dd3+) und Abb. 12.4 (Weiß droht
 * Dxf7#), dazu König im Freien an Abb. 12.3 und Abb. 12.1.
 */
import { parseSan } from "chessops/san";
import { describe, expect, it } from "vitest";
import { stellungVon } from "./buchabbildungen.testhilfe";
import { koenigImFreien } from "./koenigImFreien";
import { abwehrzuege, besteMattabwehr, mattAbwehrende } from "./schachabwehr";
import { feldname } from "./stellung";

function regelnVon(nummer: string) {
  const regeln = stellungVon(nummer).regeln;
  if (!regeln) throw new Error(`Abb. ${nummer} ohne Regeln`);
  return regeln;
}

describe("Abwehrzüge", () => {
  it("Abb. 12.3: drei Königszüge und f5 (wegziehen vor dazwischenstellen)", () => {
    const zuege = abwehrzuege(regelnVon("12.3"));
    expect(zuege.map((z) => [z.san, z.art])).toEqual([
      ["Kxg5", "wegziehen"],
      ["Kh5", "wegziehen"],
      ["Kh6", "wegziehen"],
      ["f5", "dazwischenstellen"],
    ]);
  });

  it("ohne Schach keine Abwehrzüge (Abb. 12.1)", () => {
    expect(abwehrzuege(regelnVon("12.1"))).toEqual([]);
  });

  it("Abb. 12.4: b5 wehrt Dxf7# nicht ab, Sf6 schon; die beste Abwehr ist Sf6 (Kapitel 11)", () => {
    const regeln = regelnVon("12.4");
    const abwehrend = mattAbwehrende(regeln).map((z) => feldname(z.to));
    expect(abwehrend).toContain("f6");
    expect(abwehrend).not.toContain("b5");
    expect(besteMattabwehr(regeln, new Set())?.san).toBe("Nf6");
  });
});

describe("König im Freien", () => {
  it("Abb. 12.3 nach 3... f5: f6, f7 und h7 angegriffen", () => {
    const regeln = regelnVon("12.3").clone();
    const f5 = parseSan(regeln, "f5");
    if (!f5) throw new Error("f5 geht nicht");
    regeln.play(f5);
    const danach = { fen: "", brett: regeln.board, amZug: regeln.turn, regeln };
    expect(koenigImFreien(danach, "black")?.map(feldname)).toEqual(["f6", "f7", "h7"]);
  });

  it("Abb. 12.1: Der weiße König g1 hinter f2, g2, h2 steht nicht im Freien", () => {
    expect(koenigImFreien(stellungVon("12.1"), "white")).toBeNull();
  });
});
