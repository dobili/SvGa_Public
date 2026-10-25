/**
 * Tests der eigenen Baukasten-Varianten: Grundform und Einsetzen in die Gruppe des Personas-SVG.
 */
import { describe, expect, it } from "vitest";
import { EIGENE_TEILE, grundform, mitEigenenTeilen } from "./eigeneTeile";
import { baueSvg, MERKMALE, START_MERKMALE } from "./merkmale";

const FARBEN = { haar: "8d5524", kleidung: "456dff" };

describe("eigene Teile", () => {
  it("gibt DiceBear die Grundform, Personas-Werte bleiben", () => {
    expect(grundform("augen", "roundGlasses")).toBe("open");
    expect(grundform("augen", "wink")).toBe("wink");
  });

  it("ersetzt nur den Inhalt der Gruppe, auch mit verschachtelten Gruppen", () => {
    const svg =
      '<svg><g transform="translate(20 24)"><g><path d="alt"/></g></g><g transform="translate(23 36)"><x/></g></svg>';
    const aus = mitEigenenTeilen(svg, { augen: "narrow" }, FARBEN);
    expect(aus).not.toContain("alt");
    expect(aus).toContain('<g transform="translate(23 36)"><x/></g></svg>');
    expect(aus.match(/<g[\s>]/g)?.length).toBe(aus.match(/<\/g>/g)?.length);
  });

  it("jede eigene Variante steht in den Merkmalen und baut ein SVG mit ihrer Farbe", async () => {
    for (const [feld, teile] of Object.entries(EIGENE_TEILE)) {
      for (const wert of Object.keys(teile)) {
        expect(MERKMALE[feld as keyof typeof EIGENE_TEILE]).toContain(wert);
      }
    }
    const svg = await baueSvg({ ...START_MERKMALE, bart: "longBeard", haarfarbe: "8d5524" });
    expect(svg).toContain('fill-rule="evenodd"');
    expect(svg).toContain("#8d5524");
  });
});
