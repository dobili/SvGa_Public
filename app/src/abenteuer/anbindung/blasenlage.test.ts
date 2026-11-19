/**
 * Tests für blasenlage.ts: Die Sprechblase berührt das Brett nie (Wunsch des Autors, 19.11.2026).
 */
import { describe, expect, it } from "vitest";
import { BLASENABSTAND, brettfreieLage } from "./blasenlage";

const FENSTER = 667;
// Hochformat wie iPhone SE: Brett von 150 bis 525, volle Breite.
const BRETT = { top: 150, bottom: 525, left: 0, right: 375 };

function blase(top: number, hoehe: number) {
  return { top, bottom: top + hoehe, left: 12, right: 363 };
}

describe("brettfreieLage", () => {
  it("lässt eine Blase, die das Brett nicht schneidet, wie sie ist", () => {
    expect(brettfreieLage(blase(12, 100), BRETT, FENSTER, "oben")).toBeNull();
  });

  it("lässt die Blase neben dem Brett im Querformat in Ruhe", () => {
    const quer = { top: 0, bottom: 300, left: 400, right: 700 };
    expect(brettfreieLage(quer, BRETT, FENSTER, "unten")).toBeNull();
  });

  it("rückt eine untere Blase über das Brett, wenn darunter kein Platz ist", () => {
    // Unter dem Brett 142 − 16 = 126 frei, die Blase ist 130 hoch; darüber 134.
    expect(brettfreieLage(blase(FENSTER - 150, 130), BRETT, FENSTER, "unten")).toEqual({
      bottom: FENSTER - BRETT.top + BLASENABSTAND,
    });
  });

  it("schmiegt eine obere Blase über das Brett, wenn sie dort noch passt", () => {
    const tiefer = { ...BRETT, top: 200 };
    expect(brettfreieLage(blase(60, 150), tiefer, FENSTER, "oben")).toEqual({
      bottom: FENSTER - tiefer.top + BLASENABSTAND,
    });
  });

  it("legt eine zu hohe obere Blase unter das Brett", () => {
    expect(brettfreieLage(blase(12, 140), { ...BRETT, bottom: 450 }, FENSTER, "oben")).toEqual({
      top: 450 + BLASENABSTAND,
    });
  });

  it("macht eine Blase, die nirgends passt, in der größeren Lücke rollbar", () => {
    expect(brettfreieLage(blase(12, 300), BRETT, FENSTER, "oben")).toEqual({
      bottom: FENSTER - BRETT.top + BLASENABSTAND,
      maxHeight: BRETT.top - 2 * BLASENABSTAND,
    });
  });
});
