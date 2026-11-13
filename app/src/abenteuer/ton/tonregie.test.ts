/** Tests für tonregie.ts: Regie mit einem Mitschreiber statt Web Audio (Atmosphäre T1, T2). */
import { describe, expect, it } from "vitest";
import { tagsAus } from "../dialog/geschichte";
import { Tonregie, type Spielwerk } from "./tonregie";
import { STANDARD_ABENTEUERTON } from "./tonplan";

/** Schreibt mit, was gespielt würde. */
function mitschreiber() {
  const protokoll: string[] = [];
  /** Klangquelle und Nähe (T28) getrennt, damit die Musikprotokolle kurz bleiben. */
  const quelle: string[] = [];
  const werk: Spielwerk = {
    setzePegel: (m, g) => protokoll.push(`pegel ${m} ${g}`),
    spieleSchleife: async (spur, angabe) => {
      (spur === "quelle" ? quelle : protokoll).push(`${spur} ${angabe ?? "aus"}`);
    },
    setzeNaehe: (anteil) => quelle.push(`naehe ${anteil}`),
    spieleEinmal: async (angabe) => {
      protokoll.push(`klang ${angabe}`);
    },
    stoppeAlles: () => protokoll.push("stopp"),
  };
  return { protokoll, quelle, werk };
}

describe("Tonregie", () => {
  it("spielt Karte, Szene und Klang, solange der Ton an ist", () => {
    const { protokoll, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("musik/dachboden.ogg", "wind");
    regie.dialogzeile(tagsAus(["musik:aus", "klang:glocke"]));
    regie.dialogBeendet();
    expect(protokoll).toEqual([
      "pegel 0.6 0.8",
      "musik aus",
      "geraeusch aus",
      "musik musik/dachboden.ogg",
      "geraeusch wind",
      "klang glocke",
      "musik aus",
      "geraeusch wind",
      "musik musik/dachboden.ogg",
      "geraeusch wind",
    ]);
  });

  it("stumm: nichts spielt, die Lage bleibt für später", () => {
    const { protokoll, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin({ ...STANDARD_ABENTEUERTON, stumm: true }, true);
    regie.karteBetreten("maple-falls");
    regie.dialogzeile(tagsAus(["klang:pfiff"]));
    expect(protokoll.filter((z) => !z.endsWith(" aus") && !z.startsWith("pegel"))).toEqual([]);
    expect(regie.soll.musik).toBe("maple-falls");
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    expect(protokoll.at(-2)).toBe("musik maple-falls");
  });

  it("Klangquelle: lauter in der Nähe, still außer Reichweite (T28)", () => {
    const { quelle, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("stadt", null, [{ musik: "rosie", x: 20, y: 10, reichweite: 20 }]);
    regie.heldBei(35, 10);
    expect(quelle.slice(-2)).toEqual(["quelle rosie", "naehe 0.5"]);
    regie.heldBei(60, 10);
    expect(quelle.slice(-2)).toEqual(["quelle aus", "naehe 0"]);
  });

  it("ohne Web Audio geschieht nichts und nichts geht kaputt", () => {
    const regie = new Tonregie(() => null);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("x", "y");
    regie.dialogzeile(tagsAus(["musik:z", "klang:k"]));
    regie.verlassen();
    expect(regie.soll).toEqual({ musik: null, geraeusch: null });
  });
});
