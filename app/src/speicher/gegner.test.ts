/** Tests der eigenen Gegner im Speicher (0.2.42): lesen, anlegen, ersetzen, löschen, Grenze. */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../engine/fehlerart";
import type { EigenerGegner } from "../engine/gegner";
import {
  fehlerartenAus,
  eigeneGegnerAus,
  eigenerGegnerAus,
  MAX_EIGENE_GEGNER,
  mitEigenemGegner,
  ohneEigenenGegner,
} from "./gegner";

const RAMBO: EigenerGegner = {
  kennung: "eigen-1",
  name: "Rambo",
  stufenJePhase: { eroeffnung: 3, mittelspiel: 4, endspiel: 3 },
  fehlerarten: ["figurHaengen", "bauernraub"],
  stil: 2,
  blindeFlecken: ["rueckzug"],
};

describe("Eigene Gegner", () => {
  it("liest Rohdaten Feld für Feld; Unpassendes bekommt die Vorgabe", () => {
    expect(eigenerGegnerAus(JSON.parse(JSON.stringify(RAMBO)))).toEqual(RAMBO);
    expect(eigenerGegnerAus({ kennung: "x", name: "   " })).toBeNull();
    expect(eigenerGegnerAus({ name: "ohne Kennung" })).toBeNull();
    const krumm = eigenerGegnerAus({
      kennung: "k",
      name: "Krumm",
      stufenJePhase: { eroeffnung: 11, mittelspiel: "4" },
      fehlerarten: ["unsinn", "koenigPassiv"],
      stil: 7.6,
    });
    expect(krumm).toEqual({
      kennung: "k",
      name: "Krumm",
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      fehlerarten: ["koenigPassiv"],
      stil: 2,
      blindeFlecken: [],
    });
    expect(eigenerGegnerAus({ kennung: "a", name: "Alle" })?.fehlerarten).toEqual(FEHLERARTEN);
    expect(eigeneGegnerAus("unsinn")).toEqual([]);
  });

  it("legt an, ersetzt nach Kennung, löscht, und hält die Grenze", () => {
    let liste = mitEigenemGegner([], RAMBO);
    liste = mitEigenemGegner(liste, { ...RAMBO, kennung: "eigen-2", name: "Lotte" });
    expect(liste.map((g) => g.name)).toEqual(["Rambo", "Lotte"]);
    liste = mitEigenemGegner(liste, { ...RAMBO, name: "Rambo II" });
    expect(liste.map((g) => g.name)).toEqual(["Rambo II", "Lotte"]);
    expect(ohneEigenenGegner(liste, "eigen-1").map((g) => g.name)).toEqual(["Lotte"]);
    let voll: readonly EigenerGegner[] = [];
    for (let i = 0; i < MAX_EIGENE_GEGNER + 2; i += 1) {
      voll = mitEigenemGegner(voll, { ...RAMBO, kennung: `eigen-${i}` });
    }
    expect(voll).toHaveLength(MAX_EIGENE_GEGNER);
  });
});

describe("Fehlerarten aus dem Speicher (0.2.118)", () => {
  const NEU = ["bauerEingestellt", "schlagVerpasst", "bauernzugOhneNot", "koenigszugOhneNot"];
  const ALT = FEHLERARTEN.filter((a) => !NEU.includes(a));
  it("eine vollständige alte Liste bekommt die neuen Arten dazu", () => {
    expect(fehlerartenAus(ALT)).toEqual(FEHLERARTEN);
  });
  it("eine abgehakte alte Liste bleibt, wie der Leser sie wollte", () => {
    const ohne = ALT.filter((a) => a !== "figurHaengen");
    expect(fehlerartenAus(ohne)).toEqual(ohne);
  });
});
