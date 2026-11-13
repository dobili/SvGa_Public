// Steckbriefzeilen und Lupe des Uhrmachers (docs/spiel/11, I1).
import { describe, expect, it } from "vitest";
import gegnerdatei from "../../../../inhalte/abenteuer/gegner.json";
import type { Gegnerdaten } from "../daten/laden";
import { lupenzeilen, steckbriefzeile } from "./steckbrieftext";

const GEGNER = gegnerdatei.gegner as unknown as Gegnerdaten[];

describe("Steckbrief", () => {
  it("jede Zeile aller Gegner wird ein Satz ohne Platzhalter", () => {
    for (const g of GEGNER) {
      for (const z of g.steckbrief) {
        const text = steckbriefzeile(z);
        expect(text, `${g.kennung} ${z.wert}`).not.toMatch(/^steckbrief\.|\{/);
      }
    }
  });

  it("zeigt den freien Satz über Mrs. Okafor", () => {
    expect(steckbriefzeile({ art: "text", wert: "steckbrief.okafor.lagos" })).toContain("Lagos");
  });

  it("die Lupe nennt bei Rosa die Sprüche, die verpuffen", () => {
    const rosa = GEGNER.find((g) => g.kennung === "cedarCreek.rosa");
    if (!rosa) throw new Error("Rosa fehlt");
    expect(lupenzeilen(rosa).at(-1)).toContain("Großes Maul");
  });
});
