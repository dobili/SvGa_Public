/** Tests für das Trainerverzeichnis: jedes Kapitel hat mindestens einen Trainer (Pflichtenheft 7). */
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import { TRAINER, trainerZuKapitel } from "./trainer";

describe("Trainer", () => {
  it("jedes Kapitel 0 bis 12 hat mindestens einen Trainer", () => {
    const ohne = Array.from({ length: 13 }, (_, k) => k).filter(
      (k) => trainerZuKapitel(k).length === 0,
    );
    expect(ohne).toEqual([]);
  });

  it("jeder Trainer hat Name und Ablauf in de.json", () => {
    const texte: Record<string, string> = de;
    const fehlend = TRAINER.flatMap((tr) =>
      [`trainer.${tr.kennung}.name`, `trainer.${tr.kennung}.ablauf`].filter((s) => !texte[s]),
    );
    expect(fehlend).toEqual([]);
  });
});
