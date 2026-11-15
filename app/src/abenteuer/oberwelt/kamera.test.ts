/** Tests der Kameragrenzen (oberwelt/kamera.ts). */
import { describe, expect, it } from "vitest";
import { kameragrenzen, verdeckteHoehe } from "./kamera";

describe("kameragrenzen", () => {
  it("nimmt die Karte, wenn sie größer als die Ansicht ist", () => {
    expect(kameragrenzen(896, 528, 130, 240)).toEqual({ x: 0, y: 0, breite: 896, hoehe: 528 });
  });

  it("legt eine kleine Karte mittig in die Ansicht", () => {
    expect(kameragrenzen(224, 176, 280, 120)).toEqual({ x: -28, y: 0, breite: 280, hoehe: 176 });
  });

  it("lässt im Hochformat Platz unter der Karte für die Knöpfe", () => {
    expect(kameragrenzen(896, 528, 130, 281, 80)).toEqual({ x: 0, y: 0, breite: 896, hoehe: 608 });
  });

  it("legt einen kleinen Raum mittig in die freie Fläche über den Knöpfen", () => {
    expect(kameragrenzen(224, 176, 130, 281, 80)).toEqual({
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
