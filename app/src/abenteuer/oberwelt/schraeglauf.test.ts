/** Tests des Schräglaufens an Wänden (schraeglauf.ts, 26.11.2026). */
import { describe, expect, it } from "vitest";
import { schraegschritt } from "./schraeglauf";

const TEMPO = 56;
const WEG = 0.9;
/** Zellen von 4 Pixeln: Wand in den Zellreihen 21 und darüber (y < 88), außer der Lücke. */
const WANDZEILE = 21;
/** Lücke von Körperbreite: Zellen 24 bis 26 (x 96 bis 108). */
const LUECKE = new Set([24, 25, 26]);
const mitWand = (zx: number, zy: number): boolean => zy > WANDZEILE || LUECKE.has(zx);
const offen = (): boolean => true;

describe("schraegschritt", () => {
  it("frei: schräg mit normiertem Tempo", () => {
    const s = schraegschritt({ x: 50, y: 150 }, "rechtsOben", TEMPO, WEG, offen);
    expect(Math.hypot(s.vx, s.vy)).toBeCloseTo(TEMPO);
    expect(s.rutscht).toBeNull();
  });

  it("Wand oben: rutscht in vollem Tempo nach rechts, nicht schneller", () => {
    const s = schraegschritt({ x: 60, y: 94 }, "rechtsOben", TEMPO, WEG, mitWand);
    expect(s.rutscht).toBe("rechts");
    expect(s.vx).toBe(TEMPO);
    expect(s.vy).toBe(0);
    expect(s.einrasten).toBeNull();
  });

  it("findet die Lücke von Körperbreite auf dem Weg und rastet ein", () => {
    const s = schraegschritt({ x: 101.6, y: 94 }, "rechtsOben", TEMPO, WEG, mitWand);
    expect(s.einrasten).toEqual({ achse: "x", wert: 102 });
    const danach = schraegschritt({ x: 102, y: 94 }, "rechtsOben", TEMPO, WEG, mitWand);
    expect(danach.vy).toBeLessThan(0);
  });

  it("in der Ecke steht er", () => {
    const ecke = (zx: number, zy: number): boolean => zy > WANDZEILE && zx < 30;
    const s = schraegschritt({ x: 112, y: 94 }, "rechtsOben", TEMPO, WEG, ecke);
    expect(s).toMatchObject({ vx: 0, vy: 0 });
  });
});
