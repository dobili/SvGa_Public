/** Tests für tonangaben.ts: Tabellen einmaliger Stücke und Anhebung leiser Geräusche. */
import { describe, expect, it } from "vitest";
import {
  anhebungAus,
  einmaligAus,
  ladeTonangaben,
  stammVon,
  verstaerkung,
  type Bytesladen,
} from "./tonangaben";

/** Ein Laden aus erfundenen Dateien (Text), wie das Paket es liefern würde. */
function ausDateien(dateien: Record<string, string>): Bytesladen {
  return async (pfad) => {
    const text = dateien[pfad];
    return text === undefined ? null : new TextEncoder().encode(text).buffer;
  };
}

describe("Tonangaben", () => {
  it("führt Dateien unter ihrem Namen ohne Ordner und Endung", () => {
    expect(stammVon("musik/ambrose.walzer.m4a")).toBe("ambrose.walzer");
    expect(stammVon("klang/kerze.ogg")).toBe("kerze");
  });

  it("rechnet Dezibel in Verstärkung um, höchstens 8 dB, nie leiser", () => {
    expect(verstaerkung(0)).toBe(1);
    expect(verstaerkung(6)).toBeCloseTo(1.995, 2);
    expect(verstaerkung(20)).toBeCloseTo(verstaerkung(8));
    expect(verstaerkung(-5)).toBe(1);
  });

  it("nimmt nur gültige Einträge", () => {
    expect([...einmaligAus(["abspann", 3, "victor"])]).toEqual(["abspann", "victor"]);
    expect(einmaligAus({ abspann: true }).size).toBe(0);
    expect([...anhebungAus({ kerze: 8, uhr: "laut", feder: Number.NaN })]).toEqual([["kerze", 8]]);
    expect(anhebungAus(["kerze"]).size).toBe(0);
  });

  it("lädt beide Tabellen aus dem Paket", async () => {
    const angaben = await ladeTonangaben(
      ausDateien({
        "musik/einmal.json": '["ambrose.walzer", "abspann"]',
        "klang/pegel.json": '{"kerze": 8, "regen_blech": 3.7}',
      }),
    );
    expect(angaben.einmalig.has("ambrose.walzer")).toBe(true);
    expect(angaben.anhebungDb.get("regen_blech")).toBe(3.7);
  });

  it("bleibt leer ohne Tabellen oder mit kaputten", async () => {
    const ohne = await ladeTonangaben(ausDateien({}));
    expect(ohne.einmalig.size + ohne.anhebungDb.size).toBe(0);
    const warnung = console.warn;
    console.warn = () => undefined;
    try {
      const kaputt = await ladeTonangaben(ausDateien({ "musik/einmal.json": "[abspann" }));
      expect(kaputt.einmalig.size).toBe(0);
    } finally {
      console.warn = warnung;
    }
  });
});
