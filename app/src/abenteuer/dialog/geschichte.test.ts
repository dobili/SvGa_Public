/**
 * Tests für geschichte.ts: Externe Funktionen der Runde 6 lösen ihre Wirkung aus
 * (zeigeVorfuehrung für Odette am Leuchtturm, beginneSimultan, beginneGedaechtnis, setzeToenung).
 */
import { Compiler } from "inkjs/compiler/Compiler";
import { describe, expect, it } from "vitest";
import { Geschichte, type Wirkungen } from "./geschichte";

const INK = `
EXTERNAL zeigeVorfuehrung(kennung)
EXTERNAL beginneSimultan(kennung)
EXTERNAL beginneGedaechtnis(kennung)
EXTERNAL setzeToenung(name)
=== start ===
Odette lächelt. #sprecher:odette
~ zeigeVorfuehrung("finchFalle")
~ beginneSimultan("wegGhostCapital.simultan")
~ beginneGedaechtnis("wegDelacroixDesert.seilschaft")
~ setzeToenung("nebel")
-> END
`;

function wirkungen(aufrufe: string[]): Wirkungen {
  const merke = (name: string) => (k: string) => {
    aufrufe.push(`${name}:${k}`);
  };
  const nichts = () => undefined;
  return {
    gibKarte: nichts,
    setzeSzene: nichts,
    beginnePartie: nichts,
    beginneAufgaben: nichts,
    setzeZustand: nichts,
    schalteSteckbrief: nichts,
    oeffneLaden: nichts,
    gibFund: nichts,
    reise: nichts,
    zeigeVorfuehrung: merke("vorfuehrung"),
    beginneSimultan: merke("simultan"),
    beginneGedaechtnis: merke("gedaechtnis"),
    setzeToenung: merke("toenung"),
  };
}

describe("Geschichte: Wirkungen der Runde 6", () => {
  it("ruft zeigeVorfuehrung, beginneSimultan, beginneGedaechtnis und setzeToenung", () => {
    const json = new Compiler(INK).Compile().ToJson() ?? "";
    const aufrufe: string[] = [];
    const g = new Geschichte(json, wirkungen(aufrufe), {}, "Kim");
    g.starte("start");
    for (let i = 0; i < 10 && g.weiter().art !== "ende"; i++);
    expect(aufrufe).toEqual([
      "vorfuehrung:finchFalle",
      "simultan:wegGhostCapital.simultan",
      "gedaechtnis:wegDelacroixDesert.seilschaft",
      "toenung:nebel",
    ]);
  });
});
