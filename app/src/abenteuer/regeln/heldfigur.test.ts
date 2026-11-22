/** Tests zu regeln/heldfigur.ts: Lesen der gewählten Figur, Ersatz für alte Stände. */
import { describe, expect, it } from "vitest";
import { ERSATZFIGUR, heldbogenpfad, heldfigurAus } from "./heldfigur";
import { abenteuerstandAus, leererAbenteuerstand } from "./spielstand";

describe("heldfigur", () => {
  it("liest die Heldin und fällt sonst auf den Helden zurück", () => {
    expect(heldfigurAus("heldin-0")).toBe("heldin-0");
    expect(heldfigurAus("held-0")).toBe("held-0");
    expect(heldfigurAus(undefined)).toBe(ERSATZFIGUR);
    expect(heldfigurAus("drache")).toBe(ERSATZFIGUR);
  });

  it("nennt den Bogen im Paket", () => {
    expect(heldbogenpfad("heldin-0")).toBe("figuren/heldin-0.png");
  });

  it("legt den Stand mit der gewählten Figur an und liest alte Stände als Held", () => {
    const neu = leererAbenteuerstand(new Date(0), "Kim", null, false, "heldin-0");
    expect(abenteuerstandAus(neu)?.held.figur).toBe("heldin-0");
    const alt = { ...neu, held: { name: "Kim", variante: 0 } };
    expect(abenteuerstandAus(alt)?.held).toEqual({ name: "Kim", figur: "held-0" });
  });
});
