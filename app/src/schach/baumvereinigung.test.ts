/** Tests für das Vereinen und Begrenzen von Zugbäumen (Variationsbrowser, Stufe 4). */
import { describe, expect, it } from "vitest";
import { HOECHSTENS_FORTSETZUNGEN, type Variationsknoten } from "../training/variationen";
import { linieAlsKnoten } from "../training/variationsquellen";
import {
  begrenzt,
  eingehaengt,
  schluesselNach,
  stellungsfunde,
  vereinige,
} from "./baumvereinigung";
import { knotenzahl } from "./variationsbaum";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const linie = (text: string, herkunft?: "buch" | "partie") =>
  linieAlsKnoten(GRUND, text.split(" "), herkunft).knoten;

describe("vereinige", () => {
  it("legt gleiche Züge zusammen und hängt neue hinten an", () => {
    const baum = vereinige(linie("e4 e5 Nf3"), linie("e4 c5"));
    expect(baum).toHaveLength(1);
    expect(baum[0]?.weiter.map((k) => k.zug)).toEqual(["e5", "c5"]);
    expect(knotenzahl(baum)).toBe(4);
  });

  it("behält Herkunft und Zeichen des ersten Baums, übernimmt fehlende Zeichen", () => {
    const buch: Variationsknoten[] = [{ zug: "e4", herkunft: "buch", weiter: [] }];
    const praxis: Variationsknoten[] = [
      { zug: "e4", herkunft: "partie", zeichen: "!", weiter: [] },
    ];
    const baum = vereinige(buch, praxis);
    expect(baum[0]).toMatchObject({ herkunft: "buch", zeichen: "!" });
  });
});

describe("eingehaengt", () => {
  it("hängt Fortsetzungen am Ende des Pfades ein", () => {
    const baum = eingehaengt(linie("e4 e5 Nf3"), ["e4", "e5"], [{ zug: "Bc4", weiter: [] }]);
    expect(baum[0]?.weiter[0]?.weiter.map((k) => k.zug)).toEqual(["Nf3", "Bc4"]);
  });
});

describe("stellungsfunde", () => {
  it("findet eine Stellung auch über eine Zugumstellung", () => {
    // Regel: Kapitel 2, „Zugumstellungen“: 1. Sf3 Sf6 2. d4 und 1. d4 Sf6 2. Sf3 sind dieselbe Stellung.
    const schluessel = schluesselNach(GRUND, ["d4", "Nf6", "Nf3"]);
    expect(schluessel).not.toBeNull();
    const funde = stellungsfunde(GRUND, linie("Nf3 Nf6 d4 e6 c4"), schluessel ?? "");
    expect(funde).toHaveLength(1);
    expect(funde[0]?.pfad).toEqual(["Nf3", "Nf6", "d4"]);
    expect(funde[0]?.weiter.map((k) => k.zug)).toEqual(["e6"]);
  });

  it("ein regelwidriger Pfad hat keinen Schlüssel", () => {
    expect(schluesselNach(GRUND, ["e5"])).toBeNull();
  });
});

describe("begrenzt", () => {
  it("lässt kleine Bäume, wie sie sind", () => {
    const baum = linie("e4 e5 Nf3 Nc6");
    expect(begrenzt(baum)).toEqual({ zuege: baum, vorher: 4, gekuerzt: false });
  });

  it("kürzt von hinten (Breitensuche) und meldet es", () => {
    const baum = vereinige(linie("e4 e5 Nf3 Nc6 Bb5 a6"), linie("d4 d5 c4"));
    const ergebnis = begrenzt(baum, 5);
    expect(ergebnis.gekuerzt).toBe(true);
    expect(ergebnis.vorher).toBe(9);
    expect(knotenzahl(ergebnis.zuege)).toBe(5);
    // Die ersten Züge beider Linien bleiben, späte Züge fallen.
    expect(ergebnis.zuege.map((k) => k.zug)).toEqual(["e4", "d4"]);
  });

  it("mehr als 30 Fortsetzungen gelten als gekürzt", () => {
    const viele = Array.from({ length: HOECHSTENS_FORTSETZUNGEN + 1 }, (_, i) => ({
      zug: `z${i}`,
      weiter: [],
    }));
    const ergebnis = begrenzt(viele);
    expect(ergebnis.gekuerzt).toBe(true);
    expect(ergebnis.zuege).toHaveLength(HOECHSTENS_FORTSETZUNGEN);
  });
});
