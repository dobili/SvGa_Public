/**
 * Tests der Wischreihen im Bereich Training: Zuordnung Trainer → Teil des Buches aus TRAINER,
 * Kapitelbereich, Stand einer Trainerkarte und Bilder je Trainer.
 */
import { describe, expect, it } from "vitest";
import { TRAINER, type Trainer } from "../../../training/trainer";
import { trainerbild, TRAINERBILDER, VORGABEBILD } from "./trainerbilder";
import { kapitelbereich, trainerkartenstand, trainerreihen } from "./trainerreihen";

describe("trainerreihen", () => {
  it("ordnet jeden Trainer genau einmal dem Teil seines ersten Kapitels zu", () => {
    const reihen = trainerreihen(TRAINER);
    const alle = reihen.flatMap((r) => r.trainer.map((t) => t.kennung));
    expect(alle).toHaveLength(TRAINER.length);
    expect(new Set(alle).size).toBe(TRAINER.length);
    const grundlagen = reihen.find((r) => r.teil === "grundlagen");
    expect(grundlagen?.trainer.map((t) => t.kennung)).toEqual(["koordinaten", "roentgen", "zaehlen"]);
    const endspiel = reihen.find((r) => r.teil === "endspiel");
    expect(endspiel?.trainer.map((t) => t.kennung)).toEqual(["endspiel", "studien"]);
  });

  it("nimmt einen neuen Trainer ohne Umbau auf und lässt leere Teile weg", () => {
    const neu: Trainer = { kennung: "taktik", kapitel: [11], stufe: 3, fertig: true };
    const reihen = trainerreihen([neu]);
    expect(reihen.map((r) => r.teil)).toEqual(["praxis"]);
  });
});

describe("kapitelbereich", () => {
  it("schreibt einzelne Kapitel und Bereiche", () => {
    expect(kapitelbereich([7])).toBe("7");
    expect(kapitelbereich([2, 3])).toBe("2–3");
    expect(kapitelbereich([8, 9, 10])).toBe("8–10");
    expect(kapitelbereich([])).toBe("");
  });
});

describe("trainerkartenstand", () => {
  it("ist neu ohne Runden", () => {
    expect(trainerkartenstand("zaehlen", undefined, {})).toEqual({
      runden: 0,
      quote: null,
      rekord: null,
    });
  });

  it("rechnet die Quote und findet den Rekord des Trainers", () => {
    const stand = { durchgaenge: 3, aufgaben: 10, richtig: 8, zuletzt: "2026-10-31T10:00:00Z" };
    const rekorde = { taktikSerie: { wert: 5, datum: "2026-10-31" } };
    expect(trainerkartenstand("taktik", stand, rekorde)).toEqual({
      runden: 3,
      quote: 80,
      rekord: { kennung: "taktikSerie", wert: 5 },
    });
  });
});

describe("trainerbild", () => {
  it("hat für jeden Trainer ein Bild mit gültiger Stellung, sonst die Vorgabe", () => {
    for (const trainer of TRAINER) {
      const bild = trainerbild(trainer.kennung);
      expect(bild.fen.split(" ")[0]?.split("/")).toHaveLength(8);
    }
    expect(Object.keys(TRAINERBILDER).length).toBe(TRAINER.length);
    expect(VORGABEBILD.markierungen).toEqual([]);
  });
});
