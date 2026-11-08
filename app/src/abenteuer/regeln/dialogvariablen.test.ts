// Dialogvariablen aus Ergebnissen: Namen wie in den Ink-Dateien der Helfer.
import { describe, expect, it } from "vitest";
import {
  variablenNachBesuch,
  variablenNachNadel,
  variablenNachPartie,
  variablenNachRunde,
} from "./dialogvariablen";

describe("Dialogvariablen aus Ergebnissen", () => {
  it("bildet die Langform mit Ort aus der Kennung der Begegnung", () => {
    expect(variablenNachPartie("mapleFalls.clubkampf", "sieg")).toEqual({
      ausgangMapleFallsClubkampf: "sieg",
    });
    expect(variablenNachPartie("cedarCreek.rosaDuell", "niederlage")).toEqual({
      ausgangCedarCreekRosaDuell: "niederlage",
    });
  });

  it("merkt bestandene Runden unter dem Namen der Runde", () => {
    expect(variablenNachRunde("mapleFalls.reiheSam", true)).toEqual({ reiheSamBestanden: true });
    expect(variablenNachRunde("mapleFalls.reiheSam", false)).toEqual({});
  });

  it("merkt den ersten Besuch eines Ortes", () => {
    expect(variablenNachBesuch("cedarCreek")).toEqual({ besuchtCedarCreek: true });
  });

  it("zählt die Nadel von 0 bis 3", () => {
    expect(variablenNachNadel("mapleFalls", null)).toEqual({ nadelMapleFalls: 0 });
    expect(variablenNachNadel("cedarCreek", "gold")).toEqual({ nadelCedarCreek: 3 });
  });
});
