/**
 * Referenztests für k8-opposition an Kapitel 8 (Abb. 8.19 bis 8.24, 8.28 bis 8.36, 8.53) und den
 * Übungen 8.58, 8.59. Seit C1.19 (Entscheidung des Autors vom 16.10.2026): nur Oppositionszüge,
 * die das Ergebnis halten; sonst der Hinweis, was stattdessen entscheidet.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { opposition } from "./k8-opposition";

function zuege(nummer: string): readonly string[] {
  return opposition(stellungVon(nummer)).befunde[1]?.zeilen ?? [];
}

describe("k8-opposition", () => {
  it("Abb. 8.19 (Weiß am Zug): direkte Opposition, Schwarz hat sie, Weiß muss weichen", () => {
    const e = opposition(stellungVon("8.19"));
    expect(e.befunde[0]?.zeilen[0]).toBe(
      "Direkte Opposition auf der Linie: ein Feld dazwischen (e5)",
    );
    expect(e.befunde[0]?.zeilen[1]).toBe(
      "Die Opposition hat Schwarz: Weiß ist am Zug und muss weichen.",
    );
    expect(e.fazit).toBe("Die Opposition hat Schwarz.");
    expect(zuege("8.19")[0]).toMatch(/^Kein Königszug nimmt jetzt die Opposition/);
    expect(e.markierungen).toEqual([{ typ: "feld", farbe: "grau", feld: "e5" }]);
  });

  it("Abb. 8.20: 3. Ke5 nimmt die direkte Opposition (zuerst genannt, gold)", () => {
    expect(zuege("8.20")[0]).toBe("Ke5 nimmt die direkte Opposition (e6 dazwischen)");
    expect(opposition(stellungVon("8.20")).markierungen[0]).toEqual({
      typ: "feld",
      farbe: "gold",
      feld: "e5",
    });
  });

  it("Abb. 8.23: 1. Kf3 nimmt die Fernopposition mit drei Feldern dazwischen", () => {
    expect(zuege("8.23")[0]).toBe("Kf3 nimmt die Fernopposition (f4, f5 und f6 dazwischen)");
  });

  it("Abb. 8.24: 1. Kd3 nimmt die Diagonalopposition (e4 dazwischen)", () => {
    expect(zuege("8.24")[0]).toBe("Kd3 nimmt die Diagonalopposition (e4 dazwischen)");
  });

  it("Abb. 8.28 (Schwarz am Zug): 1... Kd5 nimmt die Opposition", () => {
    expect(zuege("8.28")[0]).toMatch(/^Kd5 nimmt die direkte Opposition/);
  });

  it("Übung 8.58 und 8.59: 1... Kf6! (direkt bzw. fern)", () => {
    expect(zuege("8.58")[0]).toMatch(/^Kf6 nimmt die direkte Opposition/);
    expect(zuege("8.59")).toEqual([
      "Kf6 nimmt die Fernopposition (f5, f4 und f3 dazwischen)",
      "Exakt geprüft mit der Endspieldatenbank König und Bauer gegen König: Die App nennt nur Züge, die das Ergebnis halten.",
    ]);
    // In 8.58 nehmen auch Kd6 und Kf8 die Opposition, verlieren aber.
    expect(zuege("8.58")).toHaveLength(2);
  });

  describe("C1.19: nur Züge, die das Ergebnis halten (Endspieldatenbank)", () => {
    it.each([
      ["8.20", "Weiß kann die Opposition nehmen: Ke5."],
      ["8.23", "Weiß kann die Opposition nehmen: Kf3."],
      ["8.24", "Weiß kann die Opposition nehmen: Kd3."],
      ["8.28", "Schwarz kann die Opposition nehmen: Kd5."],
      ["8.30", "Schwarz kann die Opposition nehmen: Kd8."],
    ])("Abb. %s: %s", (nummer, fazit) => {
      expect(opposition(stellungVon(nummer)).fazit).toBe(fazit);
    });

    it("Abb. 8.23: Kf1 (fünf Felder, nur remis) fehlt, auch in den Markierungen (C2.14)", () => {
      const e = opposition(stellungVon("8.23"));
      expect(e.befunde[1]?.zeilen.join(" ")).not.toMatch(/Kf1/);
      expect(e.markierungen).toEqual([{ typ: "feld", farbe: "gold", feld: "f3" }]);
    });

    it("Abb. 8.31: Hier entscheidet das Patt (Ka6 setzt patt, roter Pfeil)", () => {
      const e = opposition(stellungVon("8.31"));
      expect(e.fazit).toBe(
        "Hier entscheidet nicht die Opposition, sondern das Patt: Ka6 setzt patt, und kein Zug gewinnt.",
      );
      expect(e.markierungen).toEqual([{ typ: "pfeil", farbe: "rot", von: "b6", nach: "a6" }]);
    });

    it("Abb. 8.36: Hier entscheidet das Quadrat (Kf6, Kf5 oder Kf4), nicht Kh5", () => {
      const e = opposition(stellungVon("8.36"));
      expect(e.fazit).toBe(
        "Hier entscheidet nicht die Opposition, sondern das Quadrat: Mit Kf6, Kf5 oder Kf4 tritt der König ins Quadrat und holt den Bauern ein.",
      );
      expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "g5", nach: "f6" });
      expect(e.markierungen).not.toContainEqual({ typ: "feld", farbe: "gold", feld: "h5" });
    });

    it("Abb. 8.53: Hier entscheidet das Reserve-Tempo h4, nicht Kb6", () => {
      const e = opposition(stellungVon("8.53"));
      expect(e.fazit).toBe(
        "Hier entscheidet nicht die Opposition, sondern das Reserve-Tempo h4: Danach muss Schwarz mit dem König ziehen und gibt einen Bauern auf.",
      );
      expect(e.markierungen).toEqual([{ typ: "pfeil", farbe: "gold", von: "h3", nach: "h4" }]);
    });

    it("Abb. 8.29: Hier entscheidet der Bauernzug e7 (Sonderfall 6. Reihe), nicht Kc6", () => {
      expect(opposition(stellungVon("8.29")).fazit).toBe(
        "Hier entscheidet nicht die Opposition, sondern der Bauernzug e7.",
      );
    });

    it("Abb. 8.35: Das Quadrat entscheidet, der Bauer läuft mit b5", () => {
      expect(opposition(stellungVon("8.35")).fazit).toBe(
        "Hier entscheidet nicht die Opposition, sondern das Quadrat: Nach b5 erreicht der gegnerische König das Quadrat nicht mehr.",
      );
    });

    it("Abb. 8.54: Jeder Oppositionszug gibt einen Bauern auf (Näherung mit mehr Bauern)", () => {
      const e = opposition(stellungVon("8.54"));
      expect(e.fazit).toMatch(/^Hier entscheidet nicht die Opposition: Jeder Königszug/);
      expect(e.befunde[1]?.art).toBe("N");
    });
  });

  it("Abb. 8.22: Opposition auf der Reihe (d7 und f7, e7 dazwischen)", () => {
    expect(opposition(stellungVon("8.22")).befunde[0]?.zeilen[0]).toBe(
      "Direkte Opposition auf der Reihe: ein Feld dazwischen (e7)",
    );
  });
});
