/** Tests der Zeichentiefe des Helden neben, vor und hinter festen Möbeln (heldtiefe.ts). */
import { describe, expect, it } from "vitest";
import { heldtiefe, stehtDahinter, tiefenmoebel } from "./heldtiefe";

const KACHEL = 16;
/** Ein Haus 64 × 64 auf (0, 0), gesperrt ab der zweiten Reihe; Tiefe 56 (Mitte der letzten Reihe). */
const HAUS = {
  name: "haus",
  x: 0,
  y: 0,
  tiefe: 56,
  angabe: { breite: 64, hoehe: 64, kollision: true, maske: ["....", "####", "####", "####"] },
};
/** Ein Zaunpfahl mit feiner Maske rechts unten in seiner Kachel (wie mf4ZaunSeite). */
const PFAHL = {
  name: "pfahl",
  x: 80,
  y: 32,
  tiefe: 40,
  angabe: { breite: 16, hoehe: 16, kollision: true, maske_fein: ["....", "....", "..##", "..##"] },
};
const moebel = tiefenmoebel([HAUS, PFAHL], KACHEL);
const bild = (x: number, y: number) => ({ x: x - 10, y: y - 28, breite: 20, hoehe: 38 });

describe("Zeichentiefe des Helden", () => {
  it("vor dem Haus: der Fußpunkt bleibt", () => {
    expect(heldtiefe(32, 74, bild(32, 74), moebel, KACHEL)).toEqual({
      tiefe: 74,
      widerspruch: false,
    });
  });

  it("hinter dem Haus (nördlich der Sperre): unter dem Haus", () => {
    const haus = moebel.find((m) => m.name === "haus");
    expect(haus && stehtDahinter(haus, 32, 8, KACHEL)).toBe(true);
    expect(heldtiefe(32, 8, bild(32, 8), moebel, KACHEL).tiefe).toBeLessThan(56);
  });

  it("neben dem Haus und neben dem Pfahl: über beiden", () => {
    // Rechts neben dem Haus, links neben dem Pfahl (Sperrzellen ab x 88), Fuß über beiden Tiefen.
    const t = heldtiefe(72, 36, bild(72, 36), moebel, KACHEL);
    expect(t.widerspruch).toBe(false);
    expect(t.tiefe).toBeGreaterThan(56);
  });

  it("senkt nie: Möbel unter dem Fußpunkt bleiben unten", () => {
    expect(heldtiefe(72, 60, bild(72, 60), moebel, KACHEL).tiefe).toBe(60);
  });

  it("Bäume behalten die einfache Regel (Krone über dem Stamm)", () => {
    const baum = { ...HAUS, name: "baum", angabe: { ...HAUS.angabe, art: "baum" } };
    expect(tiefenmoebel([baum], KACHEL)).toEqual([]);
  });
});
