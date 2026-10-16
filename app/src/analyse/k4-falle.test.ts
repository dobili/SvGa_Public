/**
 * Tests für das Werkzeug k4-falle (ohne Engine): Angebot und Verweis auf den Fallencheck im Buch.
 */
import { describe, expect, it } from "vitest";
import {
  ladeKapitel,
  naechsterBuchzug,
  stellungAus,
  stellungVon,
} from "../schach/buchabbildungen.testhilfe";
import { angebot, falle } from "./k4-falle";

const FALLENCHECKS = ladeKapitel(4).fallenchecks;

describe("k4-falle", () => {
  it("Abb. 4.11: Das Angebot ist der nächste Buchzug Lxf3", () => {
    const a = angebot(stellungVon("4.11"), naechsterBuchzug("4.11") ?? undefined);
    expect(a).toMatchObject({ san: "Bxf3", uci: "g4f3", herkunft: "buchzug" });
  });

  it("ohne geplanten Schlag: der Schlag mit dem größten Gewinn (W5)", () => {
    const a = angebot(stellungVon("4.11"));
    expect(a).toMatchObject({ san: "Bxf3", herkunft: "geschenk", bilanz: 6 });
  });

  it("Abb. 4.2: Verweis auf den Fallencheck im Buch statt des Buchtextes (0.2.27)", () => {
    const check = FALLENCHECKS.find((f) => f.stopp === "4.2");
    const ergebnis = falle(stellungVon("4.2"), naechsterBuchzug("4.2") ?? undefined, check);
    const buch = ergebnis.befunde.find((b) => b.kennung === "buch");
    expect(buch?.titel).toBe("Fallencheck im Buch");
    expect(buch?.zeilen).toEqual([
      "Vergleiche mit dem Fallencheck „Klammerfalle“ im Buch bei Abb. 4.2.",
    ]);
    expect(ergebnis.fazit).toBe("Ob cxb5 eine Falle ist, prüft die Engine unten.");
  });

  it("jeder Fallencheck des Buches hat einen Stopp-Moment, der eine Abbildung ist", () => {
    expect(FALLENCHECKS).toHaveLength(14);
    for (const check of FALLENCHECKS) {
      expect(check.stopp, check.name).not.toBeNull();
      expect(() => stellungVon(check.stopp ?? "")).not.toThrow();
    }
  });

  it("kein Material im Angebot", () => {
    const ergebnis = falle(stellungAus("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
    expect(ergebnis.fazit).toBe("Kein Material im Angebot, also auch kein Köder.");
  });
});
