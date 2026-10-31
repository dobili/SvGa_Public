/** Tests der Stufen in Zielbilanz, LAP, Denkroutine und Feld finden (Nebenchat, Punkt B2). */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import { denkaufgabe } from "./denkroutinetrainer";
import { feldrunde } from "./koordinatentrainer";
import { lapaufgabe } from "./planbilanztrainer";
import { denkstufe, lapstufe, rundeNachStufe, TRAINERSTUFEN, zielbilanzstufe } from "./stufen";
import { zielbilanzaufgabe } from "./zielbilanztrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const RUNDE = 16;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));

describe("Stufen", () => {
  it("messen, was schwer ist", () => {
    expect(zielbilanzstufe(0)).toBe("leicht");
    expect(zielbilanzstufe(2)).toBe("mittel");
    expect(zielbilanzstufe(3)).toBe("schwer");
    expect(lapstufe(true, 0)).toBe("leicht");
    expect(lapstufe(false, 1)).toBe("mittel");
    expect(lapstufe(false, 0)).toBe("schwer");
    expect(denkstufe(20)).toBe("leicht");
    expect(denkstufe(45)).toBe("schwer");
  });

  it("eine Runde nimmt zuerst die gewählte Stufe und füllt mit der nächsten auf", () => {
    const aufgaben = [
      { id: 1, stufe: "leicht" as const },
      { id: 2, stufe: "schwer" as const },
      { id: 3, stufe: "mittel" as const },
    ];
    const runde = rundeNachStufe(aufgaben, "schwer", 2, festerZufall(1));
    expect(runde.map((a) => a.id)).toEqual([2, 3]);
  });

  it("Feld finden: leicht nur Weiß, schwer gemischt mit Hinweis bei jedem Wechsel", () => {
    expect(feldrunde(RUNDE, festerZufall(1), "leicht").every((a) => !a.gedreht)).toBe(true);
    const schwer = feldrunde(RUNDE, festerZufall(2), "schwer");
    expect(schwer.some((a) => a.gedreht) && schwer.some((a) => !a.gedreht)).toBe(true);
    schwer.forEach((a, i) => {
      if (i > 0) expect(a.wechsel).toBe(a.gedreht !== schwer[i - 1]?.gedreht);
    });
  });

  it("jede Stufe kommt an den Buchstellungen vor", () => {
    for (const liste of [
      stellungen.flatMap((b) => zielbilanzaufgabe(b) ?? []),
      stellungen.flatMap((b) => lapaufgabe(b) ?? []),
      stellungen.flatMap((b) => denkaufgabe(b) ?? []),
    ]) {
      for (const stufe of TRAINERSTUFEN) expect(liste.some((a) => a.stufe === stufe)).toBe(true);
    }
  });
});
