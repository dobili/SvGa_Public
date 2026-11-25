/**
 * Tests der freien Revanche (regeln/freiestart.ts): feste Stellung bis zum ersten Sieg, danach
 * Grundstellung; Story-Gegner, Ausnahmen und wechselnde Stellungen bleiben.
 */
import { describe, expect, it } from "vitest";
import { freieRevanche } from "./freiestart";

const jo = {
  kennung: "mapleFalls.skaterJo",
  startstellung: { art: "abbildung", nummer: "1.21" },
} as const;

describe("freieRevanche", () => {
  it("Jo vor dem ersten Sieg: feste Stellung", () => {
    expect(freieRevanche(jo, "strasse", {})).toBe(false);
    expect(freieRevanche(jo, "strasse", { siegeMapleFallsSkaterJo: 0 })).toBe(false);
  });
  it("Jo nach dem ersten Sieg: Grundstellung", () => {
    expect(freieRevanche(jo, "strasse", { siegeMapleFallsSkaterJo: 1 })).toBe(true);
  });
  it("Story-Gegner bleiben bei ihrer Stellung", () => {
    const victor = {
      kennung: "mapleFalls.victor",
      startstellung: { art: "fen", fen: "8/8/8/8/8/8/8/8 w - - 0 1" },
    } as const;
    expect(freieRevanche(victor, "story", { siegeMapleFallsVictor: 3 })).toBe(false);
  });
  it("Ausnahme mit Grund (Stream) bleibt", () => {
    const stream = {
      kennung: "wegIronwoodSilicon.stream",
      startstellung: { art: "fen", fen: "x" },
    } as const;
    expect(freieRevanche(stream, "strasse", { siegeWegIronwoodSiliconStream: 2 })).toBe(false);
  });
  it("Vorrat und Varianten bleiben", () => {
    const gus = {
      kennung: "ironwood.gus",
      startstellung: { art: "vorrat", format: "stellungsduell" },
    } as const;
    expect(freieRevanche(gus, "strasse", { siegeIronwoodGus: 1 })).toBe(false);
    expect(
      freieRevanche({ ...jo, variante: "ente" }, "strasse", { siegeMapleFallsSkaterJo: 1 }),
    ).toBe(false);
  });
});
