/** Tests der Fehlerarten je Phase an kleinen Stellungen; Reihenfolge über fehlerartIn. */
import { describe, expect, it } from "vitest";
import { fehlerartIn, lageVon, type Lage } from "./fehlerart";

function lage(fen: string): Lage {
  const l = lageVon(fen);
  if (!l) throw new Error(`Stellung nicht lesbar: ${fen}`);
  return l;
}

/** Italienisch nach 3... Lc5, Weiß am Zug: Springer b1 und Läufer c1 zu Hause. */
const ITALIENISCH = "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";
/** Sizilianer, vergifteter Bauer: Schwarz am Zug nach 8. Dd2. */
const VERGIFTET = "rnb1kb1r/1p3ppp/pq1ppn2/6B1/3NPP2/2N5/PPPQ2PP/R3KB1R b KQkq - 1 8";
/** Beide rochiert, je ein Läufer zu Hause: Mittelspiel, Weiß am Zug. */
const ROCHIERT = "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 6 6";
/** König und Bauer gegen König, Weiß am Zug. */
const BAUERNENDSPIEL = "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1";
/** Dame gegen nichts: Df7 setzt patt. */
const PATTFALLE = "7k/4Q3/6K1/8/8/8/8/8 w - - 0 1";
/** Weiß liegt einen Turm zurück; Sxd5 exd5 wäre ein gleicher Abtausch. */
const RUECKSTAND = "r3k3/8/4p3/3n4/8/2N5/8/4K3 w - - 0 1";

describe("Fehlerarten je Phase", () => {
  it("Tempoverlust: 4. Lb3 zieht den Läufer zum zweiten Mal, zwei Figuren zu Hause", () => {
    expect(lage(ITALIENISCH).phase).toBe("eroeffnung");
    expect(fehlerartIn(lage(ITALIENISCH), "c4b3", [], 0.4)).toBe("tempoverlust");
    // Eine Entwicklung ist kein Tempoverlust.
    expect(fehlerartIn(lage(ITALIENISCH), "b1c3", [], 0)).toBe("ungenau");
  });

  it("Bauernraub: 8... Dxb2 nimmt den vergifteten Bauern", () => {
    expect(fehlerartIn(lage(VERGIFTET), "b6b2", [], 0.3)).toBe("bauernraub");
  });

  it("Königsschild: g2–g4 vor dem rochierten König im Mittelspiel", () => {
    expect(lage(ROCHIERT).phase).toBe("mittelspiel");
    expect(fehlerartIn(lage(ROCHIERT), "g2g4", [], 0.6)).toBe("koenigsschild");
    expect(fehlerartIn(lage(ROCHIERT), "a2a3", [], 0.1)).toBe("ungenau");
  });

  it("Endspiel: passiver König vor Bauernvorstoß, Patt gesetzt, falscher Abtausch", () => {
    expect(lage(BAUERNENDSPIEL).phase).toBe("endspiel");
    expect(fehlerartIn(lage(BAUERNENDSPIEL), "e2e3", [], 0.6, "e1d2")).toBe("koenigPassiv");
    expect(fehlerartIn(lage(BAUERNENDSPIEL), "e2e4", [], 0.6, "e2e3")).toBe("bauernvorstoss");
    expect(fehlerartIn(lage(BAUERNENDSPIEL), "e2e3", [], 0, "e2e3")).toBe("ungenau");
    expect(fehlerartIn(lage(PATTFALLE), "e7f7", [], 9)).toBe("pattGesetzt");
    expect(fehlerartIn(lage(RUECKSTAND), "c3d5", [], 0.5)).toBe("falscherAbtausch");
    // Ist der beste Zug derselbe Schlag (Zurückschlagen), ist es kein Tauschentschluss
    expect(fehlerartIn(lage(RUECKSTAND), "c3d5", [], 0.5, "c3d5")).not.toBe("falscherAbtausch");
    // König passiv: Weiß zieht den König vom Zentrum weg (Kapitel 8, Regel 1)
    const aktiv = "8/8/8/4k3/8/4K3/4P3/8 w - - 0 1";
    expect(fehlerartIn(lage(aktiv), "e3d2", [], 0.6, "e3f3")).toBe("koenigPassiv");
    expect(fehlerartIn(lage(BAUERNENDSPIEL), "e2e3", [], 0.2, "e1d2")).not.toBe("koenigPassiv");
  });
});
