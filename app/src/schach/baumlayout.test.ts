/**
 * Tests für die Lage der Züge auf der Karte (Mindmap) und für die Abzweig-Karten.
 * Beispiel ist die Petroff-Falle wie Abb. 2.40: 1. e4 e5 2. Sf3 Sf6 3. Sxe5 mit 3... d6 (Haupt),
 * 3... Sxe4?! 4. De2 mit 4... De7 und 4... Sf6, dazu ein eigenes 3... Sc6.
 */
import { describe, expect, it } from "vitest";
import type { Variationsknoten } from "../training/variationen";
import { abzweigkarten } from "./abzweigkarten";
import { kartenlayout, knotenstelle } from "./baumlayout";
import type { Zugbaum } from "./variationsbaum";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine Kette von Buchzügen; ``weiter`` hängt am letzten. */
function kette(zuege: readonly string[], weiter: Variationsknoten[] = []): Variationsknoten[] {
  return zuege.reduceRight<Variationsknoten[]>(
    (rest, zug) => [{ zug, herkunft: "buch", weiter: rest }],
    weiter,
  );
}

const PETROFF: Zugbaum = {
  startFen: GRUND,
  zuege: kette(
    ["e4", "e5", "Nf3", "Nf6", "Nxe5"],
    [
      ...kette(["d6", "Nf3", "Nxe4"]),
      {
        zug: "Nxe4",
        zeichen: "?!",
        kommentar: "gierig",
        weiter: kette(["Qe2"], [...kette(["Qe7", "Qxe4"]), ...kette(["Nf6"])]),
      },
      { zug: "Nc6", weiter: [] },
    ],
  ),
};

describe("Karte (Mindmap)", () => {
  const karte = kartenlayout(PETROFF, "de", "Start");

  it("legt die Hauptvariante in Zeile 0, eine Spalte je Halbzug", () => {
    const haupt = karte.knoten.filter((k) => k.zeile === 0).map((k) => k.text);
    expect(haupt).toEqual([
      "Start",
      "1. e4",
      "e5",
      "2. Sf3",
      "Sf6",
      "3. Sxe5",
      "d6",
      "4. Sf3",
      "Sxe4",
    ]);
    expect(karte.knoten.filter((k) => k.zeile === 0).every((k) => k.haupt)).toBe(true);
    expect(karte.knoten[0]).toMatchObject({ pfad: [], spalte: 0, herkunft: null, abzweige: 0 });
  });

  it("legt jeden Ast unter alles Bisherige, mit Nummer am Anfang der Zeile", () => {
    const sxe4 = karte.knoten[knotenstelle(karte, ["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nxe4"])];
    expect(sxe4).toMatchObject({ text: "3... Sxe4?!", spalte: 6, zeile: 1, haupt: false });
    expect(sxe4?.kommentiert).toBe(true);
    const sf6 = karte.knoten.find((k) => k.text === "4... Sf6");
    expect(sf6).toMatchObject({ spalte: 8, zeile: 2 });
    const sc6 = karte.knoten.find((k) => k.text === "3... Sc6");
    expect(sc6).toMatchObject({ spalte: 6, zeile: 3, herkunft: undefined });
    expect(karte.zeilen).toBe(4);
    expect(karte.spalten).toBe(10);
  });
});

describe("Karte: Linien und Suche", () => {
  const karte = kartenlayout(PETROFF, "de", "Start");

  it("verbindet jeden Zug mit der Stellung davor; nur die Hauptvariante ist hervorgehoben", () => {
    expect(karte.kanten).toHaveLength(karte.knoten.length - 1);
    const hauptkanten = karte.kanten.filter((k) => k.haupt).length;
    expect(hauptkanten).toBe(8);
    const nxe5 = knotenstelle(karte, ["e4", "e5", "Nf3", "Nf6", "Nxe5"]);
    expect(karte.knoten[nxe5]?.abzweige).toBe(3);
  });

  it("findet Knoten nach Pfad; Fremdes ergibt die Startstellung", () => {
    expect(knotenstelle(karte, ["e4"])).toBe(1);
    expect(knotenstelle(karte, ["d4"])).toBe(0);
  });

  it("eine leere Variante ist nur die Startstellung", () => {
    const leer = kartenlayout({ startFen: GRUND, zuege: [] }, "en", "Start");
    expect(leer).toMatchObject({ spalten: 1, zeilen: 1, kanten: [] });
  });
});

describe("Abzweig-Karten", () => {
  it("zeigt je Abzweig den Zug davor, den Ast und die Fortsetzungen", () => {
    const karten = abzweigkarten(PETROFF, "de");
    expect(karten).toHaveLength(2);
    expect(karten[0]).toMatchObject({ nach: "3. Sxe5", in: null, tiefe: 0 });
    expect(karten[0]?.fortsetzungen.map((f) => f.text)).toEqual([
      "3... d6",
      "3... Sxe4?!",
      "3... Sc6",
    ]);
    expect(karten[0]?.fortsetzungen[1]).toMatchObject({
      zuege: 5,
      abzweige: 1,
      herkunft: undefined,
    });
    expect(karten[0]?.fortsetzungen[0]).toMatchObject({ zuege: 3, abzweige: 0, herkunft: "buch" });
    expect(karten[1]).toMatchObject({ nach: "4. De2", in: "3... Sxe4?!", tiefe: 1 });
  });

  it("an der Startstellung heißt es nicht „nach …“", () => {
    const karten = abzweigkarten(
      { startFen: GRUND, zuege: [...kette(["e4"]), ...kette(["d4"])] },
      "en",
    );
    expect(karten[0]).toMatchObject({ nach: null, in: null, tiefe: 0 });
    expect(karten[0]?.fortsetzungen.map((f) => f.text)).toEqual(["1. e4", "1. d4"]);
  });
});
