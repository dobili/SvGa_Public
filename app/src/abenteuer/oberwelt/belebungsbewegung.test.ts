/**
 * Tests für belebungsbewegung.ts: Laufweg mit Pausen, Ausweichen, Folgen, stehende Tiere
 * (Dokument 16, Abschnitt 5.1).
 */
import { describe, expect, it } from "vitest";
import type { Belebung, Tierverhalten } from "./belebung";
import {
  fluchtziel,
  haeltAuf,
  neueBewegung,
  schritt,
  sperreAn,
  steht,
  type Umgebung,
} from "./belebungsbewegung";

function eintrag(typ: "statist" | "tier", verhalten: Tierverhalten = "sitzen"): Belebung {
  return {
    name: "x",
    typ,
    feld: { x: 5, y: 5 },
    von: { x: 5, y: 5 },
    bis: { x: 8, y: 5 },
    wann: "immer",
    sagt: null,
    zeigt: null,
    bild: null,
    verhalten,
    sitzt: null,
  };
}

function umgebung(held: { x: number; y: number }, frei: Umgebung["frei"] = () => true): Umgebung {
  return { held, frei, zufall: () => 0 };
}

/** Viele kleine Schritte (Sekunden). */
function laufe(b: ReturnType<typeof neueBewegung>, v: Belebung, sekunden: number, u: Umgebung) {
  for (let t = 0; t < sekunden; t += 0.05) schritt(b, v, 0.05, u);
}

describe("Statisten", () => {
  it("laufen von von nach bis und machen dort Pause", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    laufe(b, v, 2.2, umgebung({ x: 20, y: 20 }));
    expect(b.x).toBeCloseTo(8);
    expect(steht(b)).toBe(true);
    expect(b.pause).toBeGreaterThan(0);
  });

  it("warten, wenn der Held im Weg steht", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    b.richtung = "rechts";
    laufe(b, v, 1, umgebung({ x: 6, y: 5 }));
    expect(b.x).toBeCloseTo(5);
  });
});

describe("Hindernisse für den Helden", () => {
  it("Statist kehrt um, wenn der Held ihm länger im Weg steht", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    // Der Held steht auf (7, 5) mitten im Laufweg nach (8, 5): Der Statist kommt bis kurz davor,
    // wartet anderthalb Sekunden und geht dann zurück zum Anfang, statt für immer zu warten.
    laufe(b, v, 1.2, umgebung({ x: 7, y: 5 }));
    expect(b.richtung).toBe("rechts");
    expect(b.x).toBeGreaterThan(5);
    laufe(b, v, 0.8, umgebung({ x: 7, y: 5 }));
    expect(b.richtung).toBe("links");
    expect(b.x).toBeCloseTo(5, 1);
  });

  it("Statisten und Tiere am Boden halten auf, fliegende, schwimmende und folgende nicht", () => {
    expect(haeltAuf(eintrag("statist"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "sitzen"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "ausweichen"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "fliegen"))).toBe(false);
    expect(haeltAuf(eintrag("tier", "schwimmen"))).toBe(false);
    expect(haeltAuf(eintrag("tier", "folgen"))).toBe(false);
  });

  it("die Sperre ist aus, solange der Held sie berührt", () => {
    expect(sperreAn({ x: 5, y: 5 }, 6, 5)).toBe(true);
    expect(sperreAn({ x: 5.4, y: 5.6 }, 6, 6)).toBe(false);
    expect(sperreAn({ x: 5, y: 5 }, 5, 5)).toBe(false);
  });
});

describe("Tiere", () => {
  it("sitzen bleiben stehen, auch wenn der Held kommt", () => {
    const v = eintrag("tier", "sitzen");
    const b = neueBewegung(v.feld);
    laufe(b, v, 3, umgebung({ x: 5, y: 6 }));
    expect([b.x, b.y]).toEqual([5, 5]);
  });

  it("ausweichen: läuft vom nahen Helden weg", () => {
    const v = { ...eintrag("tier", "ausweichen"), bis: { x: 5, y: 5 } };
    const b = neueBewegung(v.feld);
    laufe(b, v, 2, umgebung({ x: 3, y: 5 }));
    expect(b.x).toBeCloseTo(7);
  });

  it("ausweichen: läuft nicht in Wände, sondern quer", () => {
    const b = neueBewegung({ x: 5, y: 5 });
    const nurQuer = (x: number) => x === 5;
    expect(fluchtziel(b, 2, umgebung({ x: 3, y: 5 }, nurQuer))).toEqual({ x: 5, y: 7 });
    expect(
      fluchtziel(
        b,
        2,
        umgebung({ x: 3, y: 5 }, () => false),
      ),
    ).toBeNull();
  });

  it("flitzen: schneller und weiter als ausweichen", () => {
    const v = { ...eintrag("tier", "flitzen"), bis: { x: 5, y: 5 } };
    const b = neueBewegung(v.feld);
    laufe(b, v, 1, umgebung({ x: 3, y: 5 }));
    expect(b.x).toBeCloseTo(10);
  });

  it("folgen: läuft ein paar Kacheln nach und bleibt dann stehen", () => {
    const v = eintrag("tier", "folgen");
    const b = neueBewegung(v.feld);
    const held = { x: 8, y: 5 };
    laufe(b, v, 3, umgebung(held));
    expect(b.x).toBeGreaterThan(6);
    expect(b.x).toBeLessThan(8);
    // Der Held geht weiter weg (aber nicht ganz fort): nach sechs Kacheln ist Schluss.
    for (const x of [10, 12, 14, 16]) laufe(b, v, 3, umgebung({ x, y: 5 }));
    expect(b.gefolgt).toBeGreaterThanOrEqual(6);
    const jetzt = b.x;
    laufe(b, v, 3, umgebung({ x: jetzt + 2, y: 5 }));
    expect(b.x).toBeCloseTo(jetzt);
  });
});
