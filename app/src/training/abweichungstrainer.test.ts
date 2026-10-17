/** Tests des Abweichungsmodus (Kapitel 2 und 3): Abweichstellen, Abweichzug, Urteil. */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { abweichungsrunde, abweichzug, antwortklasse } from "./abweichungstrainer";
import { eroeffnungenAus } from "./repertoiretrainer";
import { festerZufall } from "./zufall";

const spanisch = eroeffnungenAus(ladeKapitel(2)).find((e) => e.titel.includes("Spanische"));

describe("Abweichungsmodus", () => {
  it("Aufgaben: Buchzüge bis zu einer Stelle, an der die Gegenseite am Zug ist", () => {
    if (!spanisch) throw new Error("Spanische Partie fehlt");
    for (const seite of ["white", "black"] as const) {
      const runde = abweichungsrunde(spanisch, seite, 3, festerZufall(2));
      expect(runde.length).toBeGreaterThan(0);
      for (const a of runde) {
        const weissAmZug = a.buchzuege.length % 2 === 0;
        expect(weissAmZug, a.buchzuege.join(" ")).toBe(seite === "black");
        expect(a.buchzuege.length).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it("der Abweichzug ist der beste Kandidat außerhalb des Buches", () => {
    expect(abweichzug(["b8c6", "g8f6"], ["b8c6"])).toBe("g8f6");
    expect(abweichzug(["b8c6"], ["b8c6"])).toBeNull();
  });

  it("Urteil: gut bis 0,5, ungenau bis 1,2, sonst Fehler", () => {
    expect(antwortklasse(0.4)).toBe("gut");
    expect(antwortklasse(1)).toBe("ungenau");
    expect(antwortklasse(2)).toBe("fehler");
  });
});
