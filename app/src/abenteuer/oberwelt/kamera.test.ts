/** Tests der Kameragrenzen (oberwelt/kamera.ts). */
import { describe, expect, it } from "vitest";
import { kameragrenzen } from "./kamera";

describe("kameragrenzen", () => {
  it("nimmt die Karte, wenn sie größer als die Ansicht ist", () => {
    expect(kameragrenzen(896, 528, 130, 240)).toEqual({ x: 0, y: 0, breite: 896, hoehe: 528 });
  });

  it("legt eine kleine Karte mittig in die Ansicht", () => {
    expect(kameragrenzen(224, 176, 280, 120)).toEqual({ x: -28, y: 0, breite: 280, hoehe: 176 });
  });
});
