/** Tests der Kameragrenzen (oberwelt/kamera.ts). */
import { describe, expect, it } from "vitest";
import {
  bedienungQuer,
  KOPF_LUFT,
  kameragrenzen,
  verdeckteHoehe,
  verdeckteRaender,
} from "./kamera";

const unten = (n: number) => ({ oben: 0, unten: n, links: 0, rechts: 0 });

describe("kameragrenzen", () => {
  it("nimmt die Karte, wenn sie größer als die Ansicht ist", () => {
    expect(kameragrenzen(896, 528, 130, 240)).toEqual({ x: 0, y: 0, breite: 896, hoehe: 528 });
  });

  it("legt eine kleine Karte mittig in die Ansicht", () => {
    expect(kameragrenzen(224, 176, 280, 120)).toEqual({ x: -28, y: 0, breite: 280, hoehe: 176 });
  });

  it("lässt im Hochformat Platz unter der Karte für die Knöpfe", () => {
    expect(kameragrenzen(896, 528, 130, 281, unten(80))).toEqual({
      x: 0,
      y: 0,
      breite: 896,
      hoehe: 608,
    });
  });

  it("legt einen kleinen Raum mittig in die freie Fläche über den Knöpfen", () => {
    expect(kameragrenzen(224, 176, 130, 281, unten(80))).toEqual({
      x: 0,
      y: -12,
      breite: 224,
      hoehe: 281,
    });
  });
});

describe("verdeckteHoehe", () => {
  it("zählt die Knöpfe nur im Hochformat", () => {
    expect(verdeckteHoehe(130, 281, 3)).toBe(80);
    expect(verdeckteHoehe(281, 130, 3)).toBe(0);
  });

  it("nimmt bei niedriger Ansicht höchstens ein Drittel", () => {
    expect(verdeckteHoehe(100, 150, 3)).toBe(50);
  });
});

describe("verdeckte Ränder (Spieltest Variante B, F3 und F4)", () => {
  it("Hochformat: unten die Knöpfe, oben die Münzen", () => {
    expect(verdeckteRaender(140, 267, 3)).toEqual({ oben: 19, unten: 80, links: 0, rechts: 0 });
  });

  it("Querformat: links Steuerkreuz, rechts Knopfspalte, oben Münzen, unten frei", () => {
    expect(verdeckteRaender(267, 140, 3)).toEqual({ oben: 19, unten: 0, links: 61, rechts: 32 });
  });

  it("quer wie bedienung.css nur bis 600 Pixel Höhe", () => {
    expect(bedienungQuer(267, 140, 3)).toBe(true);
    expect(bedienungQuer(427, 267, 3)).toBe(false);
    expect(verdeckteRaender(427, 267, 3).unten).toBe(80);
  });

  it("oben mindestens die Kopfluft, seitlich höchstens ein Viertel der Breite", () => {
    expect(verdeckteRaender(140, 267, 12).oben).toBe(KOPF_LUFT);
    expect(verdeckteRaender(160, 100, 1).links).toBe(40);
  });

  it("grosse Karte quer: Grenzen um die verdeckten Ränder erweitert", () => {
    const r = { oben: 19, unten: 0, links: 61, rechts: 32 };
    expect(kameragrenzen(896, 528, 267, 140, r)).toEqual({
      x: -61,
      y: -19,
      breite: 989,
      hoehe: 547,
    });
  });

  it("kleiner Raum quer: mittig in der freien Fläche zwischen den Rändern", () => {
    const r = { oben: 19, unten: 0, links: 61, rechts: 32 };
    // Frei 174 breit, Raum 112: 31 Luft links in der freien Fläche, dazu 61 verdeckt.
    expect(kameragrenzen(112, 96, 267, 140, r)).toEqual({
      x: -92,
      y: -31,
      breite: 267,
      hoehe: 140,
    });
  });
});
