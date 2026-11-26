/** Tests für figurbogen.ts: PixelLab-Bogen vor LimeZu. */
import { describe, expect, it } from "vitest";
import figurhoehen from "./figurhoehen.json";
import {
  diagonalbeginnDerAdresse,
  figurenbildAdresse,
  grosspfad,
  hoehenfaktor,
  GROSS_HOEHE,
  hoehenfaktorDerAdresse,
  istGrossbogen,
  rahmenhoeheDerAdresse,
} from "./figurbogen";

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

  it("gibt PixelLab-Bögen ihren Höhenfaktor, LimeZu-Bögen und Figuren ohne Eintrag 1", async () => {
    const [name, faktor] = Object.entries(figurhoehen.faktoren)[0] ?? ["", 1];
    const vorhanden = new Set([`figuren32/${name}.png`, `figuren/${name}.png`, "figuren/alt.png"]);
    const lies = (p: string) => Promise.resolve(vorhanden.has(p) ? `blob:${p}` : null);
    const neu = await figurenbildAdresse(`figuren/${name}.png`, lies);
    const alt = await figurenbildAdresse("figuren/alt.png", lies);
    expect(hoehenfaktor(name)).toBe(faktor);
    expect(hoehenfaktorDerAdresse(neu ?? "")).toBe(faktor);
    expect(hoehenfaktorDerAdresse(alt ?? "")).toBe(1);
    expect(hoehenfaktor("gibt-es-nicht")).toBe(1);
  });

  it("merkt hohe Rahmen aus dem Index des Pakets (Schiffskoch 32 × 48), sonst 32", async () => {
    const vorhanden = new Set(["figuren32/schiffskoch.png", "figuren32/juno.png"]);
    const lies = (p: string) => Promise.resolve(vorhanden.has(p) ? `blob:hoch/${p}` : null);
    const index = () => Promise.resolve({ schiffskoch: 48 });
    const koch = await figurenbildAdresse("figuren/schiffskoch.png", lies, index);
    const juno = await figurenbildAdresse("figuren/juno.png", lies, index);
    expect(rahmenhoeheDerAdresse(koch ?? "")).toBe(48);
    expect(rahmenhoeheDerAdresse(juno ?? "")).toBe(GROSS_HOEHE);
    expect(rahmenhoeheDerAdresse("blob:unbekannt")).toBe(GROSS_HOEHE);
  });

  it("merkt den Anfang der Schrägen aus dem Index des Pakets, sonst keinen", async () => {
    const vorhanden = new Set(["figuren32/held-0.png", "figuren32/abe.png"]);
    const lies = (p: string) => Promise.resolve(vorhanden.has(p) ? `blob:schraeg/${p}` : null);
    const hoehen = () => Promise.resolve({});
    const schraeg = () => Promise.resolve({ "held-0": 144 });
    const held = await figurenbildAdresse("figuren/held-0.png", lies, hoehen, schraeg);
    const abe = await figurenbildAdresse("figuren/abe.png", lies, hoehen, schraeg);
    expect(diagonalbeginnDerAdresse(held ?? "")).toBe(144);
    expect(diagonalbeginnDerAdresse(abe ?? "")).toBeNull();
  });

  it("hält die Höhenfaktoren im erlaubten Bereich (nur verkleinern, höchstens × 1,1)", () => {
    for (const faktor of Object.values(figurhoehen.faktoren)) {
      expect(faktor).toBeGreaterThan(0.5);
      expect(faktor).toBeLessThanOrEqual(figurhoehen.hoechstens);
    }
  });
});
