/** Tests der Tiere im Weg (tierweg.ts): Kollision gegen Menschen, Verscheuchen, Drängen. */
import { describe, expect, it } from "vitest";
import type { Belebung, Tierverhalten } from "./belebung";
import { neueBewegung, schritt, type Bewegung, type Umgebung } from "./belebungsbewegung";
import {
  DRAENGEN_S,
  festeFelder,
  landeplatz,
  sperreAus,
  Tierweg,
  tierVor,
  verscheuchziel,
} from "./tierweg";

const SCHRITT_S = 0.05;

function tier(verhalten: Tierverhalten, von = { x: 5, y: 5 }, bis = { x: 9, y: 5 }): Belebung {
  return {
    name: "katze",
    typ: "tier",
    feld: von,
    von,
    bis,
    wann: "immer",
    sagt: null,
    zeigt: null,
    bild: null,
    verhalten,
    sitzt: null,
  };
}

function laufe(b: Bewegung, v: Belebung, sekunden: number, u: Umgebung) {
  for (let t = 0; t < sekunden; t += SCHRITT_S) schritt(b, v, SCHRITT_S, u);
}

describe("Tiere im Weg", () => {
  it("ein Tier läuft nicht auf das Feld einer Person, es wartet und kehrt um", () => {
    const v = tier("ausweichen");
    const b = neueBewegung(v.feld);
    b.ziel = { x: 9, y: 5 };
    b.richtung = "rechts";
    // Eine Statistin sitzt auf (7, 5); der Held ist weit weg.
    const u: Umgebung = {
      held: { x: 1, y: 1 },
      frei: () => true,
      belegt: (x, y) => x === 7 && y === 5,
      zufall: () => 0,
    };
    laufe(b, v, 1, u);
    expect(b.x).toBeLessThanOrEqual(6.5);
    laufe(b, v, 2, u);
    expect(Math.round(b.x)).toBeLessThan(7);
  });

  it("Verscheuchen: 2 bis 4 Felder weg vom Helden, nur über freie Felder", () => {
    const frei = () => true;
    expect(verscheuchziel({ x: 5, y: 5 }, { x: 5, y: 4 }, frei, () => 0)).toEqual({ x: 5, y: 7 });
    expect(verscheuchziel({ x: 5, y: 5 }, { x: 5, y: 4 }, frei, () => 0.99)).toEqual({
      x: 5,
      y: 9,
    });
    // Unten eine Wand: zur Seite.
    const seitlich = verscheuchziel(
      { x: 5, y: 5 },
      { x: 5, y: 4 },
      (x) => x !== 5,
      () => 0,
    );
    expect(seitlich?.y).toBe(5);
    expect(
      verscheuchziel(
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        () => false,
        () => 0,
      ),
    ).toBeNull();
  });

  it("ein sitzendes Tier geht verscheucht trotzdem weg", () => {
    const v = tier("sitzen", { x: 4, y: 24 }, { x: 4, y: 24 });
    const darsteller = [{ v, b: neueBewegung(v.feld) }];
    const weg = new Tierweg(() => darsteller);
    const u: Umgebung = {
      held: { x: 4, y: 23 },
      frei: () => true,
      zufall: () => 0,
      heldBlick: "unten",
      heldGeht: false,
    };
    weg.nachBild(u, SCHRITT_S);
    expect(weg.tierVorHeld()?.v.name).toBe("katze");
    expect(weg.verscheuche()).toBe(true);
    laufe(darsteller[0]?.b as Bewegung, v, 2, u);
    expect(Math.round(darsteller[0]?.b.y ?? 0)).toBeGreaterThanOrEqual(26);
  });

  it("drängt der Held eine Sekunde gegen ein Tier, weicht es aus", () => {
    const v = tier("sitzen", { x: 4, y: 24 }, { x: 4, y: 24 });
    const darsteller = [{ v, b: neueBewegung(v.feld) }];
    const weg = new Tierweg(() => darsteller);
    const u: Umgebung = {
      held: { x: 4, y: 23 },
      frei: () => true,
      zufall: () => 0,
      heldBlick: "unten",
      heldGeht: true,
    };
    for (let t = 0; t < DRAENGEN_S - SCHRITT_S; t += SCHRITT_S) weg.nachBild(u, SCHRITT_S);
    expect(darsteller[0]?.b.ziel).toBeNull();
    weg.nachBild(u, 2 * SCHRITT_S);
    expect(darsteller[0]?.b.verscheucht).toBe(true);
  });

  it("eine sitzende Taube zählt als Tier vor dem Helden, eine fliegende und Schwimmer nicht", () => {
    const taube = { v: tier("fliegen", { x: 4, y: 24 }), b: neueBewegung({ x: 4, y: 24 }) };
    expect(tierVor({ x: 4, y: 23 }, "unten", [taube])).toBe(taube);
    taube.b.ziel = { x: 9, y: 24 };
    expect(tierVor({ x: 4, y: 23 }, "unten", [taube])).toBeNull();
    expect(sperreAus(taube.v, taube.b)).toBe(true);
    const ente = { v: tier("schwimmen", { x: 4, y: 24 }), b: neueBewegung({ x: 4, y: 24 }) };
    expect(tierVor({ x: 4, y: 23 }, "unten", [ente])).toBeNull();
  });

  it("Tauben landen nicht auf Juno: Ziel auf einem Menschen → nächstes freies Feld", () => {
    const juno = (x: number, y: number) => x === 54 && y === 24;
    expect(landeplatz({ x: 54, y: 24 }, true, juno, () => true)).not.toEqual({ x: 54, y: 24 });
    const v = tier("fliegen", { x: 50, y: 24 }, { x: 54, y: 24 });
    const darsteller = [{ v, b: neueBewegung(v.feld) }];
    const statistin = {
      v: { ...tier("sitzen"), typ: "statist" as const },
      b: neueBewegung({ x: 54, y: 24 }),
    };
    const weg = new Tierweg(() => [...darsteller, statistin]);
    const u: Umgebung = { held: { x: 1, y: 1 }, frei: () => true, zufall: () => 0 };
    weg.belegt(u.held);
    (darsteller[0] as { b: Bewegung }).b.ziel = { x: 54, y: 24 };
    weg.nachBild(u, SCHRITT_S);
    expect(darsteller[0]?.b.ziel).not.toEqual({ x: 54, y: 24 });
  });

  it("Sitz- und Liegestellen und Figuren sind belegt, Tische nicht", () => {
    const felder = festeFelder(
      [
        { x: 32, y: 48, angabe: { breite: 32, hoehe: 16, art: "bank" } },
        { x: 0, y: 0, angabe: { breite: 16, hoehe: 32, art: "bett" } },
        { x: 64, y: 64, angabe: { breite: 32, hoehe: 32, art: "tisch" } },
      ],
      [{ typ: "figur", x: 9, y: 9 }],
      16,
    );
    expect([...felder].sort()).toEqual(["0,0", "0,1", "2,3", "3,3", "9,9"]);
  });
});
