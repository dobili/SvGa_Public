/** Tests des Kameraschwenks (oberwelt/schwenk.ts): Ziele, Versatz, Dauer, Fahrt, Dialogfenster. */
import { describe, expect, it } from "vitest";
import {
  fahre,
  HELD,
  raenderMitDialog,
  anteil,
  profildauer,
  schwenkprofil,
  schwenkversatz,
  schwenkziel,
  SCHWENK_KACHELN_JE_S,
  SCHWENK_MIN_MS,
  SCHWENK_RAMPE,
  type Schwenkkarte,
} from "./schwenk";

const KARTE: Schwenkkarte = {
  kachel: 16,
  ausloeser: [
    { name: "bibliothekTuer", x: 22, y: 16 },
    { name: "bibliothekTuer", x: 23, y: 16 },
  ],
  figur: (name) => (name === "jonah" ? { x: 376, y: 376 } : null),
  objekte: [{ name: "mf2Bibliothek", x: 300, y: 100, breite: 160, hoehe: 150 }],
};
const OHNE = { oben: 0, unten: 0, links: 0, rechts: 0 };

describe("schwenkziel", () => {
  it("Auslöser aus zwei Kacheln: Mitte zwischen beiden", () => {
    expect(schwenkziel("bibliothekTuer", KARTE)).toEqual({ x: 368, y: 264 });
  });
  it("Figur, Kartenobjekt, Feld, Held", () => {
    expect(schwenkziel("jonah", KARTE)).toEqual({ x: 376, y: 376 });
    expect(schwenkziel("mf2Bibliothek", KARTE)).toEqual({ x: 380, y: 212.5 });
    expect(schwenkziel("3,4", KARTE)).toEqual({ x: 56, y: 72 });
    expect(schwenkziel("held", KARTE)).toBe(HELD);
  });
  it("Unbekanntes Ziel: null", () => {
    expect(schwenkziel("kirchturm", KARTE)).toBeNull();
  });
});

describe("schwenkversatz", () => {
  it("legt das Ziel in die Mitte der freien Fläche", () => {
    const r = { ...OHNE, unten: 120 };
    expect(schwenkversatz({ x: 100, y: 100 }, { x: 300, y: 40 }, r)).toEqual({ x: -200, y: 0 });
  });
  it("Ziel = Held: nur der Grundversatz", () => {
    const r = { oben: 10, unten: 70, links: 0, rechts: 40 };
    expect(schwenkversatz({ x: 5, y: 5 }, { x: 5, y: 5 }, r)).toEqual({ x: -20, y: -30 });
  });
});

describe("Fahrt", () => {
  const K = 16;
  const sek = (kacheln: number) =>
    profildauer(schwenkprofil({ x: 0, y: 0 }, { x: kacheln * K, y: 0 }, K));
  it("Grundtempo vom Zurückgleiten abgeleitet: 3 × 2 Kacheln in 0,9 s", () => {
    expect(SCHWENK_KACHELN_JE_S).toBeCloseTo(6.67, 1);
  });
  it("12 Kacheln: Spitze Grundtempo, 3 s; 100 Kacheln: Spitze dreifach, gut 8 s; kurz: 0,8 s", () => {
    expect(sek(12)).toBeCloseTo(3000, -1);
    expect(sek(100)).toBeCloseTo(8333, -1);
    expect(sek(2)).toBe(SCHWENK_MIN_MS);
    expect(sek(0)).toBe(0);
  });
  it("weich: langsam los, gleichmäßig in der Mitte, kommt genau an", () => {
    const p = schwenkprofil({ x: 0, y: 0 }, { x: 12 * K, y: 0 }, K);
    expect(anteil(p, 0)).toBe(0);
    expect(anteil(p, p.rampeMs)).toBeCloseTo(SCHWENK_RAMPE);
    expect(anteil(p, p.rampeMs / 10)).toBeLessThan(0.01);
    expect(anteil(p, profildauer(p) / 2)).toBeCloseTo(0.5);
    expect(anteil(p, profildauer(p))).toBe(1);
    // Tempo ohne Sprung am Ende der Rampe: Schritte gleich lang davor und danach.
    const d = 10;
    const vor = anteil(p, p.rampeMs) - anteil(p, p.rampeMs - d);
    const nach = anteil(p, p.rampeMs + d) - anteil(p, p.rampeMs);
    expect(vor / nach).toBeCloseTo(1, 1);
  });
  it("fahre: Versatz entlang der Strecke, am Ende genau", () => {
    const profil = schwenkprofil({ x: 0, y: 0 }, { x: 100, y: -50 }, K);
    const start = { von: { x: 0, y: 0 }, nach: { x: 100, y: -50 }, profil, vergangenMs: 0 };
    const halb = fahre(start, profildauer(profil) / 2);
    expect(halb.da).toBe(false);
    expect(halb.versatz.x).toBeCloseTo(50);
    const ende = fahre(halb.fahrt, profildauer(profil));
    expect(ende.da).toBe(true);
    expect(ende.versatz).toEqual({ x: 100, y: -50 });
  });
});

describe("raenderMitDialog", () => {
  it("hoch: Dialog unten verdeckt", () => {
    const r = raenderMitDialog(OHNE, { links: 0, oben: 520 }, { breite: 390, hoehe: 844 }, 3);
    expect(r.unten).toBe(108);
    expect(r.rechts).toBe(0);
  });
  it("quer: Dialog als Spalte rechts", () => {
    const r = raenderMitDialog(OHNE, { links: 500, oben: 0 }, { breite: 844, hoehe: 390 }, 2);
    expect(r.rechts).toBe(172);
    expect(r.unten).toBe(0);
  });
  it("ohne Dialog bleiben die Ränder", () => {
    expect(raenderMitDialog(OHNE, null, { breite: 1, hoehe: 1 }, 1)).toBe(OHNE);
  });
});
