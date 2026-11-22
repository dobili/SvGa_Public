/** Tests der Ruheplätze (ruheplatz.ts): Bank zum Ausruhen, Bett des Helden zum Schlafen. */
import { describe, expect, it } from "vitest";
import type { Moebel } from "./moebel";
import { ruheplatz, ZIMMER_DES_HELDEN } from "./ruheplatz";

const K = 16;
const moebel = (art: string, x: number, y: number, breite = 32, hoehe = 16): Moebel => ({
  name: art,
  x: x * K,
  y: y * K,
  angabe: { quelle: "", breite, hoehe, art },
  adresse: "",
  schluessel: "",
});

describe("ruheplatz", () => {
  it("Bank vor dem Helden: ausruhen", () => {
    const held = { x: 5, y: 6, richtung: "oben" as const };
    expect(ruheplatz([moebel("bank", 5, 5)], "mapleFalls.park", held, K)).toBe("ausruhen");
  });

  it("Bett nur im Zimmer des Helden: schlafen", () => {
    const held = { x: 3, y: 4, richtung: "links" as const };
    const bett = moebel("bett", 1, 3, 32, 32);
    expect(ruheplatz([bett], ZIMMER_DES_HELDEN, held, K)).toBe("schlafen");
    expect(ruheplatz([bett], "desertSprings.motel", held, K)).toBeNull();
  });

  it("nichts in der Nähe", () => {
    const held = { x: 10, y: 10, richtung: "unten" as const };
    expect(ruheplatz([moebel("bank", 1, 1), moebel("tisch", 10, 11)], "x", held, K)).toBeNull();
  });
});
