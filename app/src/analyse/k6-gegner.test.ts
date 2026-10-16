/**
 * Referenztests für k6-gegner (ohne Engine) an Kapitel 6, Planfrage 2 (Abb. 6.12, 6.13, 6.20).
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { gegnerplan } from "./k6-gegner";

function zeilen(nummer: string, farbe: "white" | "black", kennung: string): readonly string[] {
  return (
    gegnerplan(stellungVon(nummer), farbe).befunde.find((b) => b.kennung === kennung)?.zeilen ?? []
  );
}

describe("k6-gegner", () => {
  it("Abb. 6.20 (Königsindisch), Weiß: Schwarz will ...f5 gegen e4, Weiß muss e4 sichern", () => {
    const e = gegnerplan(stellungVon("6.20"), "white");
    expect(zeilen("6.20", "white", "plan")).toEqual([
      "Schwarz will mit f7–f5 die Basis e4 angreifen",
    ]);
    expect(zeilen("6.20", "white", "sichern")[0]).toBe("Sichern: e4");
    expect(e.fazit).toBe("Schwarz will mit f7–f5 die Basis e4 angreifen. Sichere e4.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "rot", von: "f7", nach: "f5" });
    expect(zeilen("6.20", "white", "mittel")[0]).toBe(
      "1. Verteidiger heranholen: Lc1 und Dd1 erreichen den Sektor um deinen König mit einem Zug",
    );
  });

  it("Abb. 6.13 (Lxh7+ droht), Schwarz: der Angriff läuft, h7 deckt nur der König, Dame tauschen", () => {
    const e = gegnerplan(stellungVon("6.13"), "black");
    expect(e.befunde.find((b) => b.kennung === "mittel")?.titel).toBe(
      "Der Angriff läuft: die fünf Verteidigungsmittel",
    );
    expect(zeilen("6.13", "black", "sichern")[0]).toBe("Sichern: e6 und h7");
    const mittel = zeilen("6.13", "black", "mittel");
    expect(mittel[1]).toBe(
      "2. Linie schließen oder Feld decken: nur der König deckt h7; offene Linien zu ihm: keine",
    );
    expect(mittel[3]).toBe(
      "4. Angreifer abtauschen: im Sektor stehen Sf3, Ld3 und Dd1, vor allem die Dame d1",
    );
  });

  it("Abb. 6.12 (Damenindisch), Weiß: kein Angriff, der Gegenschlag d4–d5 steht bereit", () => {
    expect(
      gegnerplan(stellungVon("6.12"), "white").befunde.find((b) => b.kennung === "mittel")?.titel,
    ).toBe("Die fünf Verteidigungsmittel (für später)");
    expect(zeilen("6.12", "white", "mittel")[2]).toBe(
      "3. Im Zentrum zurückschlagen: dein Hebel d4–d5 (3 gegen 3 auf dem Zielfeld)",
    );
  });

  // C1.16: In unruhigen Stellungen sagt Gegner? nur, dass erst das Schach beantwortet wird.
  it("im Schach (Abb. 5.12 und 6.32): erst das Schach, Planfragen nur in ruhigen Stellungen", () => {
    expect(zeilen("5.12", "white", "unruhe")).toEqual([
      "Weiß steht im Schach: Erst das Schach beantworten; Planfragen gelten in ruhigen Stellungen.",
    ]);
    const e = gegnerplan(stellungVon("6.32"), "black");
    expect(e.befunde.map((b) => b.kennung)).toEqual(["unruhe"]);
    expect(e.fazit).toBe(
      "Schwarz steht im Schach: Erst das Schach beantworten; Planfragen gelten in ruhigen Stellungen.",
    );
  });
});
