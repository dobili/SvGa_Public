/**
 * Tests für Pfeile, Rahmen, Nummerntexte und Legende im PGN: Befehle „%cal“, „%csl“, „%svga“,
 * Farben bei Lichess, Zeilen „Rot 2: …“ und „Legende Rot: …“, Hin und zurück über die ganze PGN.
 */
import { describe, expect, it } from "vitest";
import type { Formwoerter } from "./variationsformen";
import {
  formenAusKommentar,
  formenbefehle,
  kommentarMitFormen,
  legendeAusKommentar,
  legendenzeilen,
} from "./variationsformen";
import { deutscheFormwoerter } from "./formwoerter";
import { variationAlsPgn, variationAusPgn } from "./variationspgn";

const DE = deutscheFormwoerter();
const EN: Formwoerter = {
  farbe: { gold: "Gold", rot: "Red", grau: "Grey", gruen: "Green", blau: "Blue" },
  legende: "Legend",
};
const JETZT = new Date("2026-11-01T10:00:00.000Z");

describe("Befehle", () => {
  it("bildet die Farben auf Lichess ab und hält die genaue Farbe in %svga", () => {
    expect(formenbefehle(["Ge2e4", "Se8", "Rd1h5", "Nc3", "Bf1b5"])).toBe(
      "[%csl Be8,Gc3] [%cal Ye2e4,Rd1h5,Bf1b5] [%svga Ge2e4,Se8,Rd1h5,Nc3,Bf1b5]",
    );
    expect(formenbefehle(undefined)).toBe("");
  });

  it("schreibt Kommentar, Nummerntexte als Zeilen und die Befehle", () => {
    const daten = { kommentar: "Falle", marken: ["Rd1h5", "Re8"], nummerntexte: { R2: "König" } };
    expect(kommentarMitFormen(daten, DE)).toBe(
      "Falle\nRot 2: König [%csl Re8] [%cal Rd1h5] [%svga Rd1h5,Re8]",
    );
    expect(kommentarMitFormen({}, DE)).toBe("");
  });
});

describe("Lesen", () => {
  it("bevorzugt %svga (genaue Farben und Reihenfolge)", () => {
    const daten = formenAusKommentar("Text [%csl Be8] [%cal Ye2e4] [%svga Se8,Ge2e4]", [DE]);
    expect(daten).toEqual({ kommentar: "Text", marken: ["Se8", "Ge2e4"] });
  });

  it("liest Lichess-Formen ohne %svga: Gelb wird Gold, Grün bleibt Grün", () => {
    const daten = formenAusKommentar("[%cal Ge2e4,Yd2d4] [%csl Rf7]", [DE]);
    expect(daten.marken).toEqual(["Ne2e4", "Gd2d4", "Rf7"]);
  });

  it("macht Zeilen zu Nummerntexten, nur für vorhandene Nummern, in jeder bekannten Sprache", () => {
    const text = "Idee\nRed 1: attack\nRot 3: gibt es nicht [%svga Rd1h5]";
    const daten = formenAusKommentar(text, [EN, DE]);
    expect(daten).toEqual({
      kommentar: "Idee\nRot 3: gibt es nicht",
      marken: ["Rd1h5"],
      nummerntexte: { R1: "attack" },
    });
  });

  it("trennt die Legende aus dem Kommentar zur Variante", () => {
    const zeilen = legendenzeilen({ rot: "Falle", gold: "Fesselung" }, DE);
    expect(zeilen).toEqual(["Legende Gold: Fesselung", "Legende Rot: Falle"]);
    const gelesen = legendeAusKommentar(["Mein Plan", ...zeilen].join("\n"), [DE]);
    expect(gelesen).toEqual({ text: "Mein Plan", legende: { gold: "Fesselung", rot: "Falle" } });
  });
});

describe("Hin und zurück über die ganze PGN", () => {
  it("behält Marken, Nummerntexte, Legende und Startmarken", () => {
    const pgn =
      "{ Kommentar } { [%csl Gd4] } 1. e4 { Zentrum [%cal Ge2e4] } e5 2. Nf3 Nc6 3. Bc4 *";
    const ergebnis = variationAusPgn(pgn, "Import", JETZT, [DE]);
    if (!ergebnis.ok) throw new Error(ergebnis.fehler.art);
    const v = ergebnis.variation;
    expect(v.start.marken).toEqual(["Nd4"]);
    expect(v.zuege[0]).toMatchObject({ zug: "e4", kommentar: "Zentrum", marken: ["Ne2e4"] });
    const erster = v.zuege[0];
    if (!erster) throw new Error("Zug");
    const reich = {
      ...v,
      legende: { gold: "Fesselung auf der e-Linie", rot: "Falle" },
      start: { marken: ["Gd4", "Re5"], nummerntexte: { R1: "Ziel" } },
      zuege: [{ ...erster, marken: ["Rd1h5", "Ge2e4"], nummerntexte: { R1: "später Dh5" } }],
    };
    const text = variationAlsPgn(reich, DE);
    expect(text).toContain("Legende Rot: Falle");
    const zurueck = variationAusPgn(text, "Import", JETZT, [DE]);
    if (!zurueck.ok) throw new Error(zurueck.fehler.art);
    expect(zurueck.variation.kommentar).toBe("Kommentar");
    expect(zurueck.variation.legende).toEqual(reich.legende);
    expect(zurueck.variation.start).toEqual(reich.start);
    expect(zurueck.variation.zuege[0]).toMatchObject({
      kommentar: "Zentrum",
      marken: ["Rd1h5", "Ge2e4"],
      nummerntexte: { R1: "später Dh5" },
    });
  });
});
