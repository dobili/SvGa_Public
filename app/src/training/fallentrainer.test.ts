/** Tests von „Falle oder Köder“ an allen Aufgaben aus inhalte/de/trainer/falle.json. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Fallendaten } from "../daten/trainerdaten";
import { fenNachZuegen } from "../schach/weiterspielen";
import { fallenrunde, pruefeEntscheidung } from "./fallentrainer";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../../inhalte/de/trainer/falle.json", import.meta.url);
const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Fallendaten;
const RUNDE = 8;

describe("Falle oder Köder", () => {
  it("jedes Angebot ist der erste Zug der Fortsetzung und in der Stellung spielbar", () => {
    const kaputt = daten.aufgaben.filter(
      (a) => a.fortsetzung[0] !== a.angebot || fenNachZuegen(a.fen, a.fortsetzung) === null,
    );
    expect(kaputt.map((a) => a.id)).toEqual([]);
  });

  it("Klammerfalle (Abb. 4.2): nicht nehmen ist richtig", () => {
    const klammer = daten.aufgaben.find((a) => a.id === "falle-b-4.2");
    if (!klammer) throw new Error("falle-b-4.2 fehlt");
    expect(pruefeEntscheidung(klammer, false)).toBe(true);
    expect(pruefeEntscheidung(klammer, true)).toBe(false);
  });

  it("eine Runde mischt Fallen und Geschenke nahe an der Stufe", () => {
    const runde = fallenrunde(daten.aufgaben, 2, RUNDE, festerZufall(3));
    expect(runde).toHaveLength(RUNDE);
    expect(runde.filter((a) => a.antwort === "falle")).toHaveLength(RUNDE / 2);
    expect(runde.every((a) => Math.abs(a.schwierigkeit - 2) <= 1)).toBe(true);
  });
});
