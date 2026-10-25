/** Tests des Porträts eigener Bots mit Baukasten (0.2.140): lesen, schreiben, speichern. */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { eigenerGegnerAus } from "../../speicher/gegner";
import { bildVon, mitBild } from "./gegnerbildwahl";

const STUFE = 3;
const BOT: EigenerGegner = {
  kennung: "eigen-bild",
  name: "Bauklotz",
  stufenJePhase: { eroeffnung: STUFE, mittelspiel: STUFE, endspiel: STUFE },
  fehlerarten: FEHLERARTEN,
  stil: 0,
  blindeFlecken: [],
  portraet: "wahl-03",
};
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';

describe("Porträt eigener Bots", () => {
  it("liest das gewählte Porträt als Profilbild", () => {
    expect(bildVon(BOT)).toEqual({ art: "wahl", kennung: "wahl-03" });
  });

  it("ein gebautes Bild ersetzt die Kennung, kein Bild entfernt beide", () => {
    const gebaut = mitBild(BOT, { art: "bau", merkmale: { bart: "walrus" }, svg: SVG });
    expect(gebaut.portraet).toBeUndefined();
    expect(gebaut.portraetBau).toEqual({ merkmale: { bart: "walrus" }, svg: SVG });
    expect(bildVon(gebaut)?.art).toBe("bau");
    const ohne = mitBild(gebaut, null);
    expect(ohne.portraet).toBeUndefined();
    expect(ohne.portraetBau).toBeUndefined();
  });

  it("übersteht Speichern und Laden; ein Bild ohne SVG fällt weg", () => {
    const gebaut = mitBild(BOT, { art: "bau", merkmale: {}, svg: SVG });
    const geladen = eigenerGegnerAus(JSON.parse(JSON.stringify(gebaut)));
    expect(geladen?.portraetBau?.svg).toBe(SVG);
    const kaputt = eigenerGegnerAus({ ...BOT, portraetBau: { svg: "<script>" } });
    expect(kaputt?.portraetBau).toBeUndefined();
  });
});
