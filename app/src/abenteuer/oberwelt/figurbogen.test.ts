/** Tests für figurbogen.ts: PixelLab-Bogen vor LimeZu. */
import { describe, expect, it } from "vitest";
import { figurenbildAdresse, grosspfad, istGrossbogen } from "./figurbogen";

describe("Figurenbogen", () => {
  it("nimmt den PixelLab-Bogen, wenn es ihn gibt, und merkt sich die Rahmengröße", async () => {
    const vorhanden = new Set(["figuren32/juno.png", "figuren/sam.png"]);
    const lies = (p: string) => Promise.resolve(vorhanden.has(p) ? `blob:${p}` : null);
    const juno = await figurenbildAdresse("figuren/juno.png", lies);
    const sam = await figurenbildAdresse("figuren/sam.png", lies);
    expect(juno).toBe("blob:figuren32/juno.png");
    expect(istGrossbogen(juno ?? "")).toBe(true);
    expect(sam).toBe("blob:figuren/sam.png");
    expect(istGrossbogen(sam ?? "")).toBe(false);
    expect(grosspfad("figuren/held-0.png")).toBe("figuren32/held-0.png");
  });
});
