/**
 * Tests für raumregie.ts mit erfundener Uhr: Anschwellen beim Betreten, kein Anschwellen auf Wegen
 * mit demselben Geräusch, höchstens ein Wert je 100 ms, und der Gang durch den Park von Maple Falls
 * zum Wasserfall mit Pegelprotokoll (Quellen aus der echten Karte).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { geraeuschquellenAus, raumpegel, TAKT_MS } from "./geraeuschraum";
import { artVon, Raumregie, type Raumuhr } from "./raumregie";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const GRUND = raumpegel(0, 0);

/** Eine Uhr, die nur auf Befehl weiterläuft; Wecker feuern beim Vorstellen. */
function testuhr() {
  let jetzt = 0;
  let wecker: { zeit: number; arbeit: () => void }[] = [];
  const uhr: Raumuhr = {
    jetzt: () => jetzt,
    spaeter: (arbeit, ms) => wecker.push({ zeit: jetzt + ms, arbeit }),
  };
  const vor = (ms: number) => {
    const ende = jetzt + ms;
    for (;;) {
      const naechster = wecker.filter((w) => w.zeit <= ende).sort((a, b) => a.zeit - b.zeit)[0];
      if (!naechster) break;
      wecker = wecker.filter((w) => w !== naechster);
      jetzt = naechster.zeit;
      naechster.arbeit();
    }
    jetzt = ende;
  };
  return { uhr, vor };
}

function regie() {
  const protokoll: number[] = [];
  const { uhr, vor } = testuhr();
  return { raum: new Raumregie((f) => protokoll.push(f), uhr), protokoll, vor };
}

describe("Raumregie", () => {
  it("schwillt beim Betreten an und sinkt nach gut 6 s auf den Grundpegel", () => {
    const { raum, protokoll, vor } = regie();
    raum.betreten("bach", []);
    expect(protokoll.at(-1)).toBe(1);
    vor(3000);
    expect(raum.pegel).toBe(1);
    vor(2000);
    expect(raum.pegel ?? 0).toBeLessThan(1);
    expect(raum.pegel ?? 0).toBeGreaterThan(GRUND);
    vor(2000);
    expect(raum.pegel).toBeCloseTo(GRUND, 6);
    // Weich: zwischen zwei Takten kein großer Sprung.
    for (let i = 1; i < protokoll.length; i++) {
      expect(Math.abs((protokoll[i] ?? 0) - (protokoll[i - 1] ?? 0))).toBeLessThan(0.1);
    }
  });

  it("auf einem Weg mit demselben Geräusch kein neues Anschwellen", () => {
    const { raum, vor } = regie();
    raum.betreten("wasserfall", []);
    vor(8000);
    raum.betreten("wasserfall", []);
    expect(raum.pegel).toBeCloseTo(GRUND, 6);
    raum.betreten("bach", []);
    vor(TAKT_MS);
    expect(raum.pegel).toBe(1);
  });

  it("rechnet beim Gehen höchstens alle 100 ms neu", () => {
    const { raum, protokoll, vor } = regie();
    raum.betreten("fluss", [{ art: "fluss", felder: [[0, 0, 1, 1]] }]);
    vor(8000);
    const vorher = protokoll.length;
    for (let x = 12; x >= 0; x--) raum.heldBei(x, 0);
    expect(protokoll.length - vorher).toBeLessThanOrEqual(1);
    vor(TAKT_MS);
    expect(raum.pegel).toBe(1);
  });
});

describe("Gang durch den Park von Maple Falls zum Wasserfall", () => {
  it("wird mit jedem Schritt lauter, nie leiser (Pegelprotokoll)", () => {
    const karte: unknown = JSON.parse(
      readFileSync(new URL("karten/maple-falls-park.json", INHALTE), "utf8"),
    );
    const quellen = geraeuschquellenAus(karte as object);
    expect(quellen.map((q) => q.art)).toEqual(["wasserfall"]);
    const { raum, vor } = regie();
    // Vom Aussen her ist es dasselbe Geräusch: kein Anschwellen, gleich der Ort zählt.
    raum.betreten("wasserfall", []);
    vor(8000);
    raum.betreten(artVon("klang/wasserfall.m4a"), quellen);
    const weg = [
      ...Array.from({ length: 30 }, (_, i) => [1 + i, 16] as const),
      ...Array.from({ length: 11 }, (_, i) => [31, 15 - i] as const),
    ];
    const protokoll: string[] = [];
    let vorher = 0;
    for (const [x, y] of weg) {
      raum.heldBei(x, y);
      vor(TAKT_MS * 3);
      const pegel = raum.pegel ?? 0;
      protokoll.push(`${x},${y}: ${(20 * Math.log10(pegel)).toFixed(1)} dB`);
      expect(pegel).toBeGreaterThanOrEqual(vorher);
      vorher = pegel;
    }
    expect(protokoll[0]).toBe("1,16: -11.0 dB");
    expect(protokoll.at(-1)).toBe("31,5: 0.0 dB");
  });
});
