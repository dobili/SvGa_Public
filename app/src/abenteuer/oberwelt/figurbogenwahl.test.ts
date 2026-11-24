/**
 * Tests zu spriteZu (weltdaten.ts): Bogen einer Figur aus dem eigenen Ort, sonst aus einem anderen
 * Ort (Joggerin auf der Landstraße, Stehplatzfotos 24.11.2026).
 */
import { describe, expect, it } from "vitest";
import type { Ortdaten } from "../daten/laden";
import { spriteZu } from "./weltdaten";

/** Ein Ort mit Figuren, nur die Felder, die spriteZu liest. */
function ort(kennung: string, figuren: { kennung: string; sprite?: string }[]): Ortdaten {
  return { kennung, figuren } as unknown as Ortdaten;
}

const maple = ort("wegMapleCedar", [{ kennung: "wegMapleCedar.ada", sprite: "figuren/ada.png" }]);
const silicon = ort("wegIronwoodSilicon", [
  { kennung: "wegIronwoodSilicon.joggerin", sprite: "figuren/joggerin.png" },
]);

describe("spriteZu", () => {
  it("nimmt die Figur des eigenen Orts", () => {
    expect(spriteZu([maple, silicon], maple, "ada")).toBe("figuren/ada.png");
  });
  it("findet eine Person aus einem anderen Ort (Tagesablauf)", () => {
    expect(spriteZu([maple, silicon], maple, "joggerin")).toBe("figuren/joggerin.png");
  });
  it("ohne Figur dieses Namens: undefined", () => {
    expect(spriteZu([maple, silicon], maple, "dime")).toBeUndefined();
  });
});
