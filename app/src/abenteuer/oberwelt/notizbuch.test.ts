// Mamas Turnierheft (docs/spiel/11, I4): die letzten Partien mit höchstens drei Momenten.
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Partieergebnis, Schluesselmoment } from "../schnittstelle/partie";
import { notizen } from "./notizbuch";

function moment(halbzug: number, verlust: number): Schluesselmoment {
  return {
    halbzug,
    fen: "",
    gespielt: `Z${halbzug}`,
    besser: "Lb5",
    klasse: "fehler",
    verlust,
    buchbezug: null,
    wessen: "leser",
  } as Schluesselmoment;
}

describe("Turnierheft", () => {
  it("zeigt die neueste Partie zuerst und die drei größten Momente in Zugfolge", () => {
    const stand = leererAbenteuerstand(new Date("2026-11-08T05:00:00Z"), "Kim", null, false);
    const ergebnis = {
      ausgang: "niederlage",
      momente: [moment(4, 0.5), moment(9, 3), moment(20, 1.2), moment(30, 2)],
    } as unknown as Partieergebnis;
    const mit = {
      ...stand,
      protokoll: [{ ergebnis, ort: "mapleFalls", gegner: "mapleFalls.coachDelgado" }],
    };
    const [n] = notizen(mit, []);
    expect(n?.titel).toContain("verloren");
    expect(n?.momente).toEqual([
      "Zug 5…: Z9, besser war Lb5",
      "Zug 11.: Z20, besser war Lb5",
      "Zug 16.: Z30, besser war Lb5",
    ]);
  });
});
