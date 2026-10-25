/** Tests der Prüfkandidaten für Bauern- und Königszüge ohne Not und eingestellte Bauern (Plan C). */
import { describe, expect, it } from "vitest";
import { lageVon } from "./fehlerart";
import { gezielteKandidaten } from "./pruefkandidaten";

const ALLE = new Set(["bauernzugOhneNot", "koenigszugOhneNot", "bauerEingestellt"] as const);

describe("Prüfkandidaten (Plan C)", () => {
  it("ruhige Randbauern und Königszüge im Mittelspiel, je höchstens zwei", () => {
    const lage = lageVon("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3");
    if (!lage) throw new Error("keine Lage");
    const zuege = gezielteKandidaten(lage, ALLE, new Set());
    expect(zuege).toContain("a2a3");
    expect(zuege).toContain("e1e2");
    expect(zuege.length).toBeLessThanOrEqual(6);
  });
  it("nur aktive Arten, keine schon bewerteten, im Schach keine", () => {
    const lage = lageVon("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3");
    if (!lage) throw new Error("keine Lage");
    expect(gezielteKandidaten(lage, new Set(), new Set())).toEqual([]);
    expect(gezielteKandidaten(lage, ALLE, new Set(["a2a3"]))).not.toContain("a2a3");
    const schach = lageVon("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3");
    expect(schach ? gezielteKandidaten(schach, ALLE, new Set()) : null).toEqual([]);
  });
  it("Bauer eingestellt: ein Zug, nach dem ein eigener Bauer mit Gewinn geschlagen werden kann", () => {
    // Weiß: Sc3 deckt e4; Sc3-b5 lässt den Bauern e4 ungedeckt vor dem Springer f6.
    const lage = lageVon("rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3");
    if (!lage) throw new Error("keine Lage");
    const zuege = gezielteKandidaten(lage, new Set(["bauerEingestellt"] as const), new Set());
    expect(zuege.length).toBeGreaterThan(0);
    expect(zuege.length).toBeLessThanOrEqual(2);
  });
});
