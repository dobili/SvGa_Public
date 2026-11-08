// Dialogvariablen aus Ergebnissen: Namen wie in den Ink-Dateien der Helfer.
import { describe, expect, it } from "vitest";
import {
  variablenNachBesuch,
  variablenAusBesitz,
  variablenNachFund,
  variablenNachNadel,
  variablenNachPartie,
  variablenNachRunde,
} from "./dialogvariablen";
import { leererAbenteuerstand } from "./spielstand";

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
    expect(variablenNachRunde("mapleFalls.reiheSam", true)).toEqual({
      reiheSamBestanden: true,
      mapleFallsReiheSamBestanden: true,
    });
    expect(variablenNachRunde("wegMapleCedar.tafel", true)).toMatchObject({
      wegMapleCedarTafelBestanden: true,
    });
    expect(variablenNachFund("schluessel")).toEqual({ gefundenSchluessel: true });
    expect(variablenNachRunde("mapleFalls.reiheSam", false)).toEqual({});
  });

  it("merkt den ersten Besuch eines Ortes", () => {
    expect(variablenNachBesuch("cedarCreek")).toEqual({ besuchtCedarCreek: true });
  });

  it("leitet Besitz und Münzen für Dialoge ab", () => {
    const stand = {
      ...leererAbenteuerstand(new Date("2026-11-08T12:00:00Z"), "Kim", null, false),
      muenzen: 25,
      gegenstaende: ["taschenlampe"],
      karten: [{ kennung: "zeitbonus", anzahl: 1, erhalten: "2026-11-08T12:00:00Z" }],
    };
    expect(variablenAusBesitz(stand)).toEqual({
      muenzen: 25,
      hatTaschenlampe: true,
      hatKarteZeitbonus: true,
    });
  });

  it("zählt die Nadel von 0 bis 3", () => {
    expect(variablenNachNadel("mapleFalls", null)).toEqual({ nadelMapleFalls: 0 });
    expect(variablenNachNadel("cedarCreek", "gold")).toEqual({ nadelCedarCreek: 3 });
  });
});
