// Erinnerungen Ambroses als Zugerraten (docs/spiel/08, F1): die drei Partien der Story-Bibel.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import runden from "../../../../inhalte/abenteuer/runden.json";
import { zusatzpartienAus } from "../../training/zusatzpartien";
import { erinnerungsaufgabe } from "./erinnerung";

const roh: unknown = JSON.parse(
  readFileSync(new URL("../../../public/daten/zusatzpartien.json", import.meta.url), "utf8"),
);
const PARTIEN = zusatzpartienAus(roh) ?? [];

describe("Erinnerungen", () => {
  it("jede Erinnerung in runden.json ergibt eine Aufgabe mit der richtigen Seite am Zug", () => {
    const erinnerungen = runden.runden.flatMap((r) =>
      "erinnerung" in r && r.erinnerung
        ? [r.erinnerung as { partie: string; abZug: number; seite: "white" | "black" }]
        : [],
    );
    expect(erinnerungen.length).toBeGreaterThanOrEqual(3);
    for (const e of erinnerungen) {
      const aufgabe = erinnerungsaufgabe(PARTIEN, e, "de");
      expect(aufgabe, e.partie).not.toBeNull();
      expect(aufgabe?.startFen.split(" ")[1]).toBe(e.seite === "white" ? "w" : "b");
      expect(aufgabe?.startFen.split(" ")[5]).toBe(String(e.abZug));
      expect(aufgabe?.linie.length).toBeGreaterThan(0);
    }
  });

  it("der Werkstatt-Flashback rät nur den Anfang der Unsterblichen, Zug 1 bis 11 (Szene 66)", () => {
    const aufgabe = erinnerungsaufgabe(
      PARTIEN,
      { partie: "klassik-unsterbliche", abZug: 1, bisZug: 11, seite: "white" },
      "de",
    );
    // 11 Züge von Weiß, dazwischen 10 von Schwarz; der letzte geratene Zug ist 11. Tg1.
    expect(aufgabe?.linie.length).toBe(21);
    expect(aufgabe?.linie.at(-1)).toBe("Rg1");
    const werkstatt = runden.runden.find((r) => r.kennung === "portDelacroix.flashbackWerkstatt");
    expect(werkstatt && "erinnerung" in werkstatt ? werkstatt.erinnerung : null).toMatchObject({
      abZug: 1,
      bisZug: 11,
    });
  });

  it("unbekannte Partie oder zu später Zug ergibt nichts", () => {
    expect(
      erinnerungsaufgabe(PARTIEN, { partie: "gibt-es-nicht", abZug: 1, seite: "white" }, "de"),
    ).toBeNull();
    expect(
      erinnerungsaufgabe(
        PARTIEN,
        { partie: "klassik-unsterbliche", abZug: 99, seite: "white" },
        "de",
      ),
    ).toBeNull();
  });
});
