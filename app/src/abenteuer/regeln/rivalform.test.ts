/** Tests zu regeln/rivalform.ts: beide Fassungen haben dieselben Platzhalter. */
import { afterEach, describe, expect, it } from "vitest";
import { tSpiel, verbindeTextformen } from "../texte/texte";
import { rivalformen, rivalinbogen, rivalinGewaehlt, rivalinsprecher } from "./rivalform";

describe("rivalform", () => {
  it("liest die Wahl aus den Dialogvariablen", () => {
    expect(rivalinGewaehlt({ rivalin: true })).toBe(true);
    expect(rivalinGewaehlt({})).toBe(false);
  });

  it("gibt beiden Fassungen dieselben Platzhalter", () => {
    expect(Object.keys(rivalformen(true)).sort()).toEqual(Object.keys(rivalformen(false)).sort());
    expect(rivalformen(true).rivale).toBe("Victoria");
    expect(`${rivalformen(true).rv_sein}e`).toBe("ihre");
    expect(`${rivalformen(false).rv_sein}e`).toBe("seine");
  });

  it("nennt den Bogen der Rivalin nur zu Victors Bögen", () => {
    expect(rivalinbogen("figuren/victor.png", true)).toBe("figuren/victoria.png");
    expect(rivalinbogen("figuren/victor-pullover.png", true)).toBe("figuren/victoria-pullover.png");
    expect(rivalinbogen("figuren/victor.png", false)).toBeNull();
    expect(rivalinbogen("figuren/juno.png", true)).toBeNull();
  });

  it("sucht in der Rivalin-Fassung nur Victorias Porträt (ohne Bild: nur der Name)", () => {
    expect(rivalinsprecher("victor", true)).toBe("victoria");
    expect(rivalinsprecher("victor", false)).toBeNull();
    expect(rivalinsprecher("juno", true)).toBeNull();
  });

  afterEach(() => verbindeTextformen(() => rivalformen(false)));

  it("füllt Spieltexte nach der Wahl", () => {
    expect(tSpiel("quest.meisterschaft.schritt6")).toBe("Das Finale gegen Victor spielen.");
    verbindeTextformen(() => rivalformen(true));
    expect(tSpiel("quest.meisterschaft.schritt6")).toBe("Das Finale gegen Victoria spielen.");
    expect(tSpiel("quest.summitEndspiel.schritt6")).toContain("mit ihr spielen");
    expect(tSpiel("figur.victor.name")).toBe("Victoria Hale");
  });
});
