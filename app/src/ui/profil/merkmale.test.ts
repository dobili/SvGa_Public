/** Tests des Porträt-Baukastens: Vervollständigen, Zufall, Bauen des SVG. */
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

// Paket H der Ideensammlung (30.10.2026): Die fertigen Porträts (skripte/erzeuge-portraetwahl.mjs,
// skripte/erzeuge-gegnerbilder.mjs) lassen Nase, Körper und Kleidungsfarbe von DiceBear wählen.
// Jeder Wert, den sie dabei bekommen können, muss im Baukasten stehen, damit man jedes fertige
// Porträt nachbauen kann.
describe("Baukasten deckt die fertigen Porträts ab", () => {
  it("jede Grundform von Personas steht im Baukasten", async () => {
    const { schema } = await import("@dicebear/personas");
    const grund = (feld: string): readonly string[] => {
      const eigenschaft = (schema.properties as Record<string, { default?: unknown }>)[feld];
      return Array.isArray(eigenschaft?.default) ? (eigenschaft.default as string[]) : [];
    };
    const paare: [string, readonly string[]][] = [
      ["nose", MERKMALE.nase],
      ["body", MERKMALE.koerper],
      ["clothingColor", MERKMALE.kleidung],
      ["hair", MERKMALE.haar],
      ["eyes", MERKMALE.augen],
      ["facialHair", MERKMALE.bart],
    ];
    for (const [feld, baukasten] of paare) {
      expect(grund(feld).length, feld).toBeGreaterThan(0);
      for (const wert of grund(feld)) expect(baukasten, `${feld}: ${wert}`).toContain(wert);
    }
  });

  it("die Münder der fertigen Porträts stehen im Baukasten (fest gewählt, kein Schnuller)", () => {
    for (const mund of ["smile", "bigSmile", "smirk", "lips"])
      expect(MERKMALE.mund).toContain(mund);
  });

  it("Haut- und Haarfarben der Porträts und Bots stehen im Baukasten", () => {
    // Aus skripte/erzeuge-portraetwahl.mjs (HAUT, HAAR) und erzeuge-gegnerbilder.mjs
    for (const haut of ["eeb4a4", "e7a391", "e5a07e", "d78774", "b16a5b", "92594b", "623d36"]) {
      expect(MERKMALE.haut).toContain(haut);
    }
    for (const haar of ["362c47", "6c4545", "f27d65", "f29c65", "dee1f5"]) {
      expect(MERKMALE.haarfarbe).toContain(haar);
    }
  });
});
