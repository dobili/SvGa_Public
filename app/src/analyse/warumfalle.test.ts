/**
 * Tests der Warum-Kategorie W1 „Falle aus dem Buch“ an den Fallenchecks des Kapitels 4:
 * Treffer am Stopp-Moment und in der Zugfolge des Buches, Nichttreffer bei anderem Zug oder
 * anderer Stellung.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { alsUci, fenNachSan } from "./findekategorien.testhilfe";
import { baueFallenindex, warumFalle } from "./warumfalle";

const INDEX = baueFallenindex(ladeKapitel(4));

/** Der Zug (SAN, englisch) in einer Stellung als UCI. */
function uci(fen: string, san: string): string {
  return alsUci(fen, [san])[0] ?? "";
}

describe("W1 Falle aus dem Buch", () => {
  it("Abb. 4.13: 6. Sxd5?? ist die Elefantenfalle", () => {
    const fen = stellungVon("4.13").fen;
    expect(warumFalle(fen, uci(fen, "Nxd5"), INDEX)).toEqual({
      kennung: "W1",
      details: { falle: "Elefantenfalle", stopp: "4.13", zug: "Nxd5" },
    });
  });

  it("Abb. 4.10: auch der zweite Fehlzug der Halosar-Falle (8... Lxf3??) aus der Zugfolge", () => {
    const nachLg4 = fenNachSan(stellungVon("4.10").fen, ["Bg4", "Nb5"]);
    const treffer = warumFalle(nachLg4, uci(nachLg4, "Bxf3"), INDEX);
    expect(treffer?.details.falle).toBe("Halosar-Falle");
  });

  it("Zugzähler zählen nicht, nur Figuren, Zugrecht und Rochade", () => {
    const fen = stellungVon("4.13").fen.replace(/ 0 6$/, " 3 14");
    expect(warumFalle(fen, uci(fen, "Nxd5"), INDEX)?.kennung).toBe("W1");
  });

  it("ein anderer Zug am Stopp-Moment ist keine Falle (6. e3)", () => {
    const fen = stellungVon("4.13").fen;
    expect(warumFalle(fen, uci(fen, "e3"), INDEX)).toBeNull();
  });

  it("derselbe Zug in einer anderen Stellung ist keine Falle (Grundstellung, 1. e4)", () => {
    const grund = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(warumFalle(grund, "e2e4", INDEX)).toBeNull();
  });

  it("jeder Fallencheck mit Stopp-Moment trägt mindestens einen Fehlzug ein", () => {
    const fallen = new Set([...INDEX.fehlzuege.values()].map((d) => d.falle));
    const mitStopp = ladeKapitel(4).fallenchecks.filter((c) => c.stopp !== null);
    for (const check of mitStopp) expect(fallen).toContain(check.name);
  });
});
