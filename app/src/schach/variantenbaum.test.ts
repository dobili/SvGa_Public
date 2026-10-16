/** Tests für das Nachspielen im Variantenbaum, mit einem kleinen Spanier wie im Testkapitel. */
import { describe, expect, it } from "vitest";
import {
  abzweigungen,
  fenNach,
  fortsetzungen,
  inNebenvariante,
  zeile,
  type Beispiel,
  type Knoten,
} from "./variantenbaum";

const k = (
  zug: string,
  weiter: Knoten[] = [],
  abbildungen: string[] = [],
  zeichen: Knoten["zeichen"] = "",
): Knoten => ({
  zug,
  zeichen,
  abbildungen,
  weiter,
});

const SPANIER: Beispiel = {
  id: "k10-a1",
  kapitel: 10,
  abschnitt: "10.1",
  titel: "Spanisch",
  startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  zuege: [
    k("e4", [
      k("e5", [
        k(
          "Nf3",
          [
            k("Nc6", [k("Bb5", [k("a6")], ["10.2"], "!")]),
            k("d6", [k("d4", [k("exd4", [k("Nxd4", [], ["10.7"])])])]),
          ],
          ["10.1"],
        ),
      ]),
    ]),
  ],
  abbildungen: [],
  status: "entwurf",
};

describe("Variantenbaum", () => {
  it("zeigt die Zeile mit deutschen Zügen, Nummern, Zeichen und Abbildungen", () => {
    const halbzuege = zeile(SPANIER, ["e4", "e5"], "de");
    expect(halbzuege.map((h) => h.text)).toEqual(["e4", "e5", "Sf3", "Sc6", "Lb5!", "a6"]);
    expect(halbzuege.map((h) => h.nummer)).toEqual([1, 1, 2, 2, 3, 3]);
    expect(halbzuege[2]?.abbildungen).toEqual(["10.1"]);
    expect(halbzuege[4]?.pfad).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
  });

  it("folgt einer Nebenvariante und bietet Abzweigungen an", () => {
    const pfad = ["e4", "e5", "Nf3"];
    expect(abzweigungen(SPANIER, pfad, "de").map((h) => `${h.nummer}... ${h.text}`)).toEqual([
      "2... d6",
    ]);
    const neben = zeile(SPANIER, [...pfad, "d6"], "de");
    expect(neben.map((h) => h.text).slice(3)).toEqual(["d6", "d4", "exd4", "Sxd4"]);
    expect(inNebenvariante(SPANIER, [...pfad, "d6"])).toBe(true);
    expect(inNebenvariante(SPANIER, [...pfad, "Nc6"])).toBe(false);
  });

  it("liefert die Stellung nach einem Pfad und erkennt unbekannte Pfade", () => {
    expect(fenNach(SPANIER, ["e4"])).toBe(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    );
    expect(fenNach(SPANIER, ["d4"])).toBeNull();
    expect(fortsetzungen(SPANIER, []).map((f) => f.zug)).toEqual(["e4"]);
  });
});
