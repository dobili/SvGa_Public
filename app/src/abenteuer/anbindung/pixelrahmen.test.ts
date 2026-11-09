/** Tests der CSS-Variablen für die Pixelrahmen (Entscheidung G2). */
import { describe, expect, it } from "vitest";
import { rahmenvariablen } from "./pixelrahmen";

describe("Pixelrahmen", () => {
  it("baut Variablen nur für Rahmen mit Bild", () => {
    const variablen = rahmenvariablen(
      {
        fenster: { datei: "ui/fenster.svg", schnitt: 8, breite: 16 },
        knopf: { datei: "ui/knopf.svg", schnitt: 8, breite: 8 },
      },
      { fenster: "blob:x" },
    );
    expect(variablen).toEqual({
      "--rahmen-fenster-bild": 'url("blob:x")',
      "--rahmen-fenster-schnitt": "8",
      "--rahmen-fenster-breite": "16px",
    });
  });
});
