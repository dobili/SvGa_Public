/** Tests für die großzügige Trefferfläche (R35). */
import { describe, expect, it } from "vitest";
import { feldEcke } from "./geometrie";
import { FELD } from "./masse";
import { TOLERANZ_EIGENE_FIGUR, trefferfeld } from "./treffer";

/** Punkt in einem Feld, als Anteil der Feldbreite von der linken oberen Ecke. */
function punktIn(feld: string, x: number, y: number, gedreht = false) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) throw new Error(feld);
  return { x: ecke.x + x * FELD, y: ecke.y + y * FELD };
}

describe("Trefferfeld", () => {
  const springerZiele = ["f3", "h3", "e2"];

  it("nimmt ohne Zielfelder das Feld unter dem Finger", () => {
    expect(trefferfeld(punktIn("g3", 0.05, 0.5), false, [])).toBe("g3");
  });

  it("zieht einen Tipp knapp neben einem Zielfeld zu diesem Feld (Springer g1)", () => {
    // g3 liegt rechts von f3; ein Tipp ganz links in g3 meint f3.
    expect(trefferfeld(punktIn("g3", 0.1, 0.5), false, springerZiele)).toBe("f3");
    expect(trefferfeld(punktIn("g3", 0.5, 0.5), false, springerZiele)).toBe("g3");
    // Auch gedreht: f3 liegt dann rechts von g3.
    expect(trefferfeld(punktIn("g3", 0.9, 0.5, true), true, springerZiele)).toBe("f3");
  });

  it("lehnt nur bei echter Mehrdeutigkeit zwischen zwei Zielfeldern ab", () => {
    const ziele = ["e3", "e4"];
    // Genau auf der Kante zwischen e4 (oben) und e3 (unten).
    expect(trefferfeld(punktIn("e3", 0.5, 0.01), false, ziele)).toBeNull();
    expect(trefferfeld(punktIn("e3", 0.5, 0.2), false, ziele)).toBe("e3");
    expect(trefferfeld(punktIn("e4", 0.5, 0.8), false, ziele)).toBe("e4");
  });

  it("zieht auf einer eigenen Figur weniger stark und gibt neben dem Brett nichts", () => {
    expect(trefferfeld(punktIn("g3", 0.15, 0.5), false, springerZiele, TOLERANZ_EIGENE_FIGUR)).toBe(
      "g3",
    );
    expect(trefferfeld({ x: -10, y: 10 }, false, springerZiele)).toBeNull();
  });
});
