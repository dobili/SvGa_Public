/**
 * Tests für die eigenen Pfeile und Rahmen einer Variante: Nummern je Farbe, Setzen, Wegnehmen,
 * Umfärben, Texte je Nummer, Radierer, Grenze, Legende.
 */
import { describe, expect, it } from "vitest";
import { MARKEN_HOECHSTENS } from "./variationen";
import {
  alsMarkierungen,
  farbenIn,
  mitLegendentext,
  mitMarke,
  mitNummerAus,
  mitNummerntext,
  nummerierteMarken,
  ohneMarken,
} from "./variationsmarken";

describe("Nummern je Farbe", () => {
  it("zählt jede Farbe für sich, über Pfeile und Felder hinweg", () => {
    const liste = nummerierteMarken(["Ge2e4", "Rd1h5", "Ge8", "Rf7"]);
    expect(liste.map((m) => m.schluessel)).toEqual(["G1", "R1", "G2", "R2"]);
    expect(liste[2]).toMatchObject({ farbe: "gold", von: "e8", nach: null, nummer: 2 });
  });

  it("übergeht Unlesbares und gibt Markierungen für das Brett", () => {
    expect(nummerierteMarken(["Xe2e4", "Ge9", "Se4"]).map((m) => m.schluessel)).toEqual(["S1"]);
    expect(alsMarkierungen(["Ge2e4", "Se8"])).toEqual([
      { typ: "pfeil", farbe: "gold", von: "e2", nach: "e4" },
      { typ: "feld", farbe: "grau", feld: "e8" },
    ]);
    expect(farbenIn(["Bd4", "Ge2e4", "Bd5"])).toEqual(["gold", "blau"]);
  });
});

describe("Setzen und Wegnehmen", () => {
  it("setzt Pfeil und Rahmen und nimmt sie beim zweiten Mal weg", () => {
    const eins = mitMarke({}, "gold", "e2", "e4");
    expect(eins).toEqual({ art: "gesetzt", daten: { marken: ["Ge2e4"] } });
    if (eins.art === "voll") throw new Error("voll");
    const zwei = mitMarke(eins.daten, "rot", "e8", null);
    if (zwei.art === "voll") throw new Error("voll");
    expect(zwei.daten.marken).toEqual(["Ge2e4", "Re8"]);
    const weg = mitMarke(zwei.daten, "gold", "e2", "e4");
    expect(weg).toEqual({ art: "entfernt", daten: { marken: ["Re8"] } });
  });

  it("ein Pfeil auf das eigene Feld ist ein Rahmen", () => {
    const ergebnis = mitMarke({}, "blau", "d4", "d4");
    expect(ergebnis.art === "gesetzt" && ergebnis.daten.marken).toEqual(["Bd4"]);
  });

  it("färbt um: andere Farbe auf denselben Feldern bekommt die nächste Nummer", () => {
    const ergebnis = mitMarke({ marken: ["Rd1h5", "Gd4", "Rf7"] }, "gold", "d1", "h5");
    expect(ergebnis.art === "gesetzt" && ergebnis.daten.marken).toEqual(["Gd4", "Rf7", "Gd1h5"]);
  });

});

describe("Wegnehmen mit Texten, Grenze, Radierer", () => {
  it("Texte rücken beim Wegnehmen mit, der Text der weggenommenen Marke fällt weg", () => {
    const daten = {
      kommentar: "bleibt",
      marken: ["Rd1h5", "Gd4", "Rf7", "Re8"],
      nummerntexte: { R1: "Angriff", R2: "Ziel", R3: "König", G1: "Zentrum" },
    };
    const ergebnis = mitMarke(daten, "rot", "d1", "h5");
    expect(ergebnis).toEqual({
      art: "entfernt",
      daten: {
        kommentar: "bleibt",
        marken: ["Gd4", "Rf7", "Re8"],
        nummerntexte: { R1: "Ziel", R2: "König", G1: "Zentrum" },
      },
    });
  });

  it("meldet die Grenze, statt still zu löschen", () => {
    const voll = Array.from({ length: MARKEN_HOECHSTENS }, (_, i) =>
      `G${"abcdefgh"[i % 8]}${Math.floor(i / 8) + 1}`,
    );
    expect(mitMarke({ marken: voll }, "rot", "h8", null)).toEqual({ art: "voll" });
    // Wegnehmen geht an der Grenze weiterhin.
    expect(mitMarke({ marken: voll }, "gold", "a1", null).art).toBe("entfernt");
  });

  it("der Radierer leert Marken und Texte, Kommentar und Werte bleiben", () => {
    const daten = { kommentar: "k", w: 35, marken: ["Ge4"], nummerntexte: { G1: "x" } };
    expect(ohneMarken(daten)).toEqual({ kommentar: "k", w: 35 });
  });
});

describe("Texte", () => {
  it("setzt, kürzt und entfernt Texte je Nummer", () => {
    const mit = mitNummerntext({ marken: ["Re8"] }, "R1", "x".repeat(80));
    expect(mit.nummerntexte?.R1).toHaveLength(60);
    expect(mitNummerntext(mit, "R1", "")).toEqual({ marken: ["Re8"] });
  });

  it("setzt und entfernt Texte der Legende je Farbe", () => {
    const legende = mitLegendentext({}, "rot", "Falle");
    expect(legende).toEqual({ rot: "Falle" });
    expect(mitLegendentext(legende, "rot", "")).toEqual({});
  });
});

describe("Marken ohne Nummer (Format 9, Wunsch des Autors 1.11.2026)", () => {
  const BEREICH = ["Gd4", "Ge4", "Gd5", "Rd1h5"];

  it("überspringt einzelne Marken und ganze Farben beim Zählen", () => {
    const einzeln = nummerierteMarken(BEREICH, { ohneNummer: ["Ge4"] });
    expect(einzeln.map((m) => m.nummer)).toEqual([1, 0, 2, 1]);
    expect(einzeln[1]?.schluessel).toBe("");
    const farbe = nummerierteMarken(BEREICH, { farbenAus: ["gold"] });
    expect(farbe.map((m) => m.nummer)).toEqual([0, 0, 0, 1]);
  });

  it("schaltet die Nummer einer Marke aus und an; die Texte der folgenden wandern mit", () => {
    const daten = { marken: BEREICH, nummerntexte: { G2: "zweites", G3: "Zentrum" } };
    const aus = mitNummerAus(daten, "Ge4", true);
    expect(aus.ohneNummer).toEqual(["Ge4"]);
    expect(aus.nummerntexte).toEqual({ G2: "Zentrum" });
    const an = mitNummerAus(aus, "Ge4", false);
    expect(an.ohneNummer).toBeUndefined();
    expect(an.nummerntexte).toEqual({ G3: "Zentrum" });
  });

  it("vergisst „ohne Nummer“, wenn die Marke weggenommen wird", () => {
    const daten = { marken: ["Gd4", "Ge4"], ohneNummer: ["Ge4"] };
    const ergebnis = mitMarke(daten, "gold", "e4", null);
    expect(ergebnis.art === "entfernt" && ergebnis.daten).toEqual({ marken: ["Gd4"] });
  });
});
