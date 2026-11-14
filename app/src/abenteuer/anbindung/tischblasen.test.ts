/** Tests der Sprechblasen am Brett (docs/spiel/29): Warteschlange und Vorrang. */
import { describe, expect, it } from "vitest";
import { LEERE_BLASEN, lesedauer, mitZeile, ohneErste, type Blasenzeile } from "./tischblasen";

function zeile(
  schluessel: string,
  lage: "oben" | "unten",
  vorrang: "geschrieben" | "tisch",
): Blasenzeile {
  return {
    schluessel,
    lage,
    vorrang,
    sprecher: null,
    name: null,
    text: "Hallo",
    stimmung: null,
    geist: false,
    testid: "t",
  };
}

describe("Sprechblasen", () => {
  it("Geschriebenes verdrängt das Tischgespräch in beiden Lagen", () => {
    let stand = mitZeile(LEERE_BLASEN, zeile("t1", "oben", "tisch"));
    stand = mitZeile(stand, zeile("t2", "unten", "tisch"));
    stand = mitZeile(stand, zeile("m1", "oben", "geschrieben"));
    expect(stand.oben.map((z) => z.schluessel)).toEqual(["m1"]);
    expect(stand.unten).toEqual([]);
  });

  it("solange Geschriebenes steht, schweigt das Tischgespräch", () => {
    const stand = mitZeile(LEERE_BLASEN, zeile("m1", "unten", "geschrieben"));
    expect(mitZeile(stand, zeile("t1", "oben", "tisch"))).toBe(stand);
  });

  it("reiht geschriebene Zeilen ein und lässt keine doppelt hinein", () => {
    let stand = mitZeile(LEERE_BLASEN, zeile("a", "unten", "geschrieben"));
    stand = mitZeile(stand, zeile("b", "unten", "geschrieben"));
    stand = mitZeile(stand, zeile("a", "unten", "geschrieben"));
    expect(stand.unten.map((z) => z.schluessel)).toEqual(["a", "b"]);
    stand = ohneErste(stand, "unten", "a");
    expect(stand.unten.map((z) => z.schluessel)).toEqual(["b"]);
    expect(ohneErste(stand, "unten", "x")).toBe(stand);
  });

  it("lässt längere Zeilen länger stehen, mit Obergrenze", () => {
    expect(lesedauer("kurz")).toBeLessThan(lesedauer("ein deutlich längerer Satz am Brett"));
    expect(lesedauer("x".repeat(1000))).toBe(9000);
  });
});
