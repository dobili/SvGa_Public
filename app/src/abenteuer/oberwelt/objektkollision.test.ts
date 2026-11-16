/**
 * Tests für die Übersteuerung der Kollision je Objekt (Karteneditor, Wunsch des Autors, 16.11.2026):
 * Der Kartenbau (pipeline/abenteuer/objektkollision.py) schreibt `kollision` und eine eigene,
 * schon geformte `maske` an das Möbelobjekt; begehbar.ts und moebelform.ts müssen sie lesen.
 */
import { describe, expect, it } from "vitest";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { geformtAusObjekt } from "./moebelform";

const SOFA: Sperrangabe = { breite: 64, hoehe: 32, kollision: true };

function karteMit(properties: readonly { name: string; value: unknown }[]): Tiledkarte {
  return {
    width: 10,
    height: 10,
    layers: [{ objects: [{ name: "sofa", type: "moebel", x: 32, y: 32, properties }] }],
  };
}

describe("Kollision je Objekt", () => {
  it("macht ein Sofa an dieser Stelle durchgehbar", () => {
    const karte = karteMit([{ name: "kollision", value: false }]);
    const frei = begehbar(karte, sperrkacheln(karte, { sofa: SOFA }, 16));
    expect(frei(2, 3)).toBe(true);
    expect(frei(5, 3)).toBe(true);
    // Ohne Übersteuerung sperrt dasselbe Sofa seine untere Reihe.
    const normal = karteMit([]);
    expect(begehbar(normal, sperrkacheln(normal, { sofa: SOFA }, 16))(2, 3)).toBe(false);
  });

  it("nimmt die eigene Maske statt der Regel des Katalogs", () => {
    const karte = karteMit([{ name: "maske", value: "#.../...#" }]);
    expect([...sperrkacheln(karte, { sofa: SOFA }, 16)].sort()).toEqual(["2,2", "5,3"]);
  });

  it("nimmt die geformte Maske auch bei gedrehten Bildern unverändert", () => {
    const angabe = geformtAusObjekt(SOFA, [
      { name: "drehung", value: 90 },
      { name: "maske", value: ".#/../../.." },
    ]);
    expect([angabe.breite, angabe.hoehe]).toEqual([32, 64]);
    expect(angabe.maske).toEqual([".#", "..", "..", ".."]);
    expect(geformtAusObjekt(SOFA, undefined)).toBe(SOFA);
  });
});
