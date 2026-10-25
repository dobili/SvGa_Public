/** Tests des Porträt-Baukastens (0.2.140): Vervollständigen, Zufall, Bauen des SVG. */
import { describe, expect, it } from "vitest";
import de from "../../i18n/de.json";
import en from "../../i18n/en.json";
import {
  baueSvg,
  MERKMALE,
  MERKMALFELDER,
  START_MERKMALE,
  vollstaendig,
  zufaelligeMerkmale,
} from "./merkmale";

describe("Merkmale", () => {
  it("vervollständigt Unbekanntes mit dem Startwert", () => {
    const v = vollstaendig({ haar: "pigtails", augen: "laser" });
    expect(v.haar).toBe("pigtails");
    expect(v.augen).toBe(START_MERKMALE.augen);
  });

  it("Zufall wählt nur erlaubte Werte", () => {
    let n = 0;
    const m = zufaelligeMerkmale(() => (n++ % 10) / 10);
    for (const feld of MERKMALFELDER) {
      expect((MERKMALE[feld] as readonly string[]).includes(m[feld])).toBe(true);
    }
  });

  it("baut ein SVG ohne eigenen Hintergrund, mit Bart nur auf Wunsch", async () => {
    const ohne = await baueSvg(START_MERKMALE);
    expect(ohne.startsWith("<svg")).toBe(true);
    expect(ohne).not.toContain('fill="#3b4a6b"');
    const mitBart = await baueSvg({ ...START_MERKMALE, bart: "walrus" });
    expect(mitBart).not.toBe(ohne);
  });
});

describe("Namen der Merkmale", () => {
  it("jeder Wert hat einen Namen auf Deutsch und Englisch", () => {
    const fehlend: string[] = [];
    for (const feld of MERKMALFELDER) {
      for (const wert of MERKMALE[feld]) {
        const schluessel = `profil.wert.${feld}.${wert}`;
        if (!(schluessel in de) || !(schluessel in en)) fehlend.push(schluessel);
      }
    }
    expect(fehlend).toEqual([]);
  });
});
