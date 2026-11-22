/**
 * Tests für spurenmischung.ts: Mischung je Lage, Ausdünnen nach vollen Schleifen, Steigerung je
 * Sieg, Musiker nah und Pegelausgleich (Klangplan A0.1 und A0.6).
 */
import { describe, expect, it } from "vitest";
import {
  anteile,
  ausgleichDb,
  GRUNDLAGE,
  istAusgeduennt,
  mischung,
  spurpfad,
  spurtabelleAus,
  vollSchleifen,
  type Spurangabe,
} from "./spurenmischung";
import { schleifenpunkte } from "./spurenspieler";

/** Maple Falls wie im Probestück: 50 s, drei Spuren, ohne Messung. */
const MAPLE: Spurangabe = {
  form: 2205000,
  rate: 44100,
  spuren: ["grund", "melodie", "zusatz"],
  kampf: false,
  lufs: {},
};
const KAMPF: Spurangabe = { ...MAPLE, form: 1587600, kampf: true };
const GENAU = 6;

describe("Ausdünnen", () => {
  it("nach zwei bis drei vollen Schleifen eine dünne, dann wieder voll", () => {
    expect(vollSchleifen(MAPLE)).toBe(3);
    expect(vollSchleifen({ ...MAPLE, form: 64 * 44100 })).toBe(2);
    expect(vollSchleifen({ ...MAPLE, form: 20 * 44100 })).toBe(3);
    const folge = Array.from({ length: 9 }, (_, n) => istAusgeduennt(n, 3));
    expect(folge).toEqual([false, false, false, true, false, false, false, true, false]);
  });

  it("dünn heißt nur der Grund; im Innenraum dünnt es nicht zusätzlich aus", () => {
    expect(anteile(MAPLE, GRUNDLAGE, 0)).toEqual({ grund: 1, melodie: 1, zusatz: 0 });
    expect(anteile(MAPLE, GRUNDLAGE, 3)).toEqual({ grund: 1, melodie: 0, zusatz: 0 });
    expect(anteile(MAPLE, { ...GRUNDLAGE, innen: true }, 3)).toEqual({
      grund: 1,
      melodie: 1,
      zusatz: 0,
    });
  });
});

describe("Steigerung und Musiker", () => {
  it("Kampfthema: Grund, nach dem ersten Sieg Melodie, nach dem zweiten Zusatz, nie mehr", () => {
    const stufe = (siege: number) => anteile(KAMPF, { ...GRUNDLAGE, siege }, 7);
    expect(stufe(0)).toEqual({ grund: 1, melodie: 0, zusatz: 0 });
    expect(stufe(1)).toEqual({ grund: 1, melodie: 1, zusatz: 0 });
    expect(stufe(2)).toEqual({ grund: 1, melodie: 1, zusatz: 1 });
    expect(stufe(5)).toEqual(stufe(2));
  });

  it("Zusatz folgt der Nähe zum Musiker; fehlt die Spur, bleibt sie 0", () => {
    expect(anteile(MAPLE, { ...GRUNDLAGE, musikerNaehe: 0.4 }, 0).zusatz).toBe(0.4);
    const ohne = { ...MAPLE, spuren: ["grund", "melodie"] as const };
    expect(anteile(ohne, { ...GRUNDLAGE, musikerNaehe: 1 }, 0).zusatz).toBe(0);
  });
});

describe("Pegelausgleich", () => {
  it("dünne Mischungen auf das Ziel, gemessen oder nach Vorgabe, höchstens +8 dB", () => {
    const duenn = { grund: 1, melodie: 0, zusatz: 0 };
    expect(ausgleichDb(MAPLE, duenn, false)).toBe(5);
    expect(ausgleichDb({ ...MAPLE, lufs: { grund: -24.1 } }, duenn, false)).toBeCloseTo(6.1, GENAU);
    expect(ausgleichDb({ ...MAPLE, lufs: { grund: -40 } }, duenn, false)).toBe(8);
    expect(
      ausgleichDb({ ...MAPLE, lufs: { "grund+melodie": -17 } }, { ...duenn, melodie: 1 }, false),
    ).toBe(0);
  });

  it("Innenraum 2 dB leiser; die Mischung trägt den Ausgleich in jede Spur", () => {
    const voll = { grund: 1, melodie: 1, zusatz: 0 };
    expect(ausgleichDb(MAPLE, voll, true)).toBe(-2);
    const m = mischung(MAPLE, GRUNDLAGE, 3);
    expect(m.grund).toBeCloseTo(10 ** (5 / 20), GENAU);
    expect(m.melodie).toBe(0);
  });
});

describe("Tabelle und Dateien", () => {
  it("liest spuren.json und übergeht Stücke ohne Grund oder Form", () => {
    const t = spurtabelleAus({
      "maple-falls": {
        form: 2205000,
        rate: 44100,
        spuren: ["grund", "melodie", "x"],
        lufs: { grund: -24 },
      },
      kaputt: { form: 0, spuren: ["grund"] },
      ohneGrund: { form: 5, spuren: ["melodie"] },
      "maple-falls.clubkampf": { form: 9, spuren: ["grund"], kampf: true },
    });
    expect([...t.keys()]).toEqual(["maple-falls", "maple-falls.clubkampf"]);
    expect(t.get("maple-falls")?.spuren).toEqual(["grund", "melodie"]);
    expect(t.get("maple-falls.clubkampf")).toMatchObject({ kampf: true, rate: 44100 });
    expect(spurtabelleAus(null).size).toBe(0);
    expect(spurpfad("maple-falls", "grund")).toBe("musik/maple-falls.grund.m4a");
  });

  it("Schleifenpunkte: nach dem AAC-Vorlauf, wenn der Puffer ihn enthält, sonst ab 0", () => {
    const vorlauf = 2112 / 44100;
    const [a, e] = schleifenpunkte(50 + vorlauf + 0.01, MAPLE);
    expect(a).toBeCloseTo(vorlauf, GENAU);
    expect(e).toBeCloseTo(50 + vorlauf, GENAU);
    expect(schleifenpunkte(50.01, MAPLE)).toEqual([0, 50]);
    expect(schleifenpunkte(49, MAPLE)).toEqual([0, 49]);
  });
});
