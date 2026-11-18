/**
 * Tests der Bots und Paarungen für die Vorratspartien (vorratsbots.ts).
 * Warum: Jeder Bot muss in der App vorkommen, menschlich spielen (keine Zufallszüge) und je Band
 * sollen verschiedene Stile gegeneinander spielen.
 */
import { describe, expect, it } from "vitest";
import { GEGNER } from "../engine/gegner";
import { VORRATSBOTS, vorratspaarungen, type Vorratsband } from "./vorratsbots";

const stilVon = (bot: string) => GEGNER.find((g) => g.kennung === bot)?.stilname ?? "?";

describe("Vorratsbots", () => {
  it("jeder Bot ist ein Bot der App ohne Zufallszüge", () => {
    for (const bots of Object.values(VORRATSBOTS)) {
      for (const bot of bots) {
        const g = GEGNER.find((x) => x.kennung === bot);
        expect(g, bot).toBeDefined();
        expect(g?.zufallszuege ?? 0, bot).toBe(0);
      }
    }
  });

  it("je Band mindestens vier Stile", () => {
    for (const bots of Object.values(VORRATSBOTS)) {
      expect(new Set(bots.map(stilVon)).size).toBeGreaterThanOrEqual(4);
    }
  });

  it("Paarungen: verschiedene Bots, Farben im Wechsel, alle Paare vor einer Wiederholung", () => {
    const band: Vorratsband = "band3";
    const p = vorratspaarungen(band, 24, 0, stilVon);
    expect(p).toHaveLength(24);
    expect(p.every((x) => x.weiss.bot !== x.schwarz.bot)).toBe(true);
    const erste = new Set(p.slice(0, 15).map((x) => [x.weiss.bot, x.schwarz.bot].sort().join("-")));
    expect(erste.size).toBe(15);
    expect(p[0]?.weiss.bot).toBe(p[15]?.schwarz.bot);
    expect(p[0]?.weiss.stil).toBe(stilVon(p[0]?.weiss.bot ?? ""));
  });
});
