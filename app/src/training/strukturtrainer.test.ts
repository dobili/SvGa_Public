/** Tests des Strukturerkenners an allen Aufgaben aus inhalte/de/trainer/struktur.json. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Strukturdaten } from "../daten/trainerdaten";
import de from "../i18n/de.json";
import { PLAENE_ZUR_WAHL, planwahl, schwacheBauern, strukturrunde } from "./strukturtrainer";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../../inhalte/de/trainer/struktur.json", import.meta.url);
const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Strukturdaten;
const texte: Record<string, string> = de;

describe("Strukturerkenner", () => {
  it("jeder Plan und jede Struktur hat einen Satz in de.json", () => {
    const fehlend = daten.aufgaben.flatMap((a) =>
      [`struktur.plan.${a.plan}`, `struktur.art.${a.struktur}`].filter((k) => !texte[k]),
    );
    expect([...new Set(fehlend)]).toEqual([]);
  });

  it("Abb. 5.16: a3 isoliert, c3 und c4 doppelt", () => {
    const aufgabe = daten.aufgaben.find((a) => a.id === "struktur-b-5.16");
    if (!aufgabe) throw new Error("struktur-b-5.16 fehlt");
    expect(schwacheBauern(aufgabe)).toEqual(["a3", "c3", "c4"]);
  });

  it("die Wahl enthält den richtigen Plan und keinen aus derselben Familie", () => {
    for (const aufgabe of daten.aufgaben) {
      const wahl = planwahl(aufgabe, festerZufall(4));
      expect(wahl).toHaveLength(PLAENE_ZUR_WAHL);
      expect(wahl).toContain(aufgabe.plan);
      if (aufgabe.plan === "kettenbasisAngreifen") expect(wahl).not.toContain("fluegelDerKette");
    }
  });

  it("eine Runde hat acht Aufgaben nahe an der Stufe", () => {
    const runde = strukturrunde(daten.aufgaben, 3, 8, festerZufall(5));
    expect(runde).toHaveLength(8);
    expect(runde.every((a) => Math.abs(a.schwierigkeit - 3) <= 1)).toBe(true);
  });
});
