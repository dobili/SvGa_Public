/**
 * Tests zu ton/puffervorrat.ts: Budget der dekodierten Tonpuffer. Der älteste Zugriff fliegt zuerst,
 * der zuletzt verlangte bleibt, fehlende Dateien (null) zählen nicht.
 */
import { describe, expect, it } from "vitest";
import { pufferBytes, Puffervorrat, type Puffermass } from "./puffervorrat";

const MB = 1024 * 1024;
/** Ein Puffer mit so vielen MB (Mono, 4 Bytes je Wert). */
const puffer = (mb: number): Puffermass => ({ length: (mb * MB) / 4, numberOfChannels: 1 });
const takt = () => new Promise<void>((fertig) => setTimeout(fertig, 0));

describe("Puffervorrat", () => {
  it("rechnet Bytes wie Web Audio: 49 s, 48 kHz, Stereo, 32 Bit", () => {
    expect(pufferBytes({ length: 49 * 48000, numberOfChannels: 2 })).toBe(18_816_000);
  });

  it("sortiert die ältesten aus, sobald das Budget überschritten ist", async () => {
    const v = new Puffervorrat<Puffermass>((p) => p, 100 * MB);
    v.lege("musik:a", Promise.resolve(puffer(40)));
    v.lege("musik:b", Promise.resolve(puffer(40)));
    await takt();
    // a wird wieder gehört: b ist jetzt der älteste Zugriff.
    expect(v.hole("musik:a")).toBeDefined();
    v.lege("musik:c", Promise.resolve(puffer(40)));
    await takt();
    expect(v.hole("musik:b")).toBeUndefined();
    expect(v.hole("musik:a")).toBeDefined();
    expect(v.hole("musik:c")).toBeDefined();
    expect(v.belegt()).toBe(80 * MB);
  });

  it("behält ein einzelnes Stück, das allein größer als das Budget ist", async () => {
    const v = new Puffervorrat<Puffermass>((p) => p, 50 * MB);
    v.lege("musik:a", Promise.resolve(puffer(20)));
    v.lege("musik:lang", Promise.resolve(puffer(86)));
    await takt();
    expect(v.hole("musik:lang")).toBeDefined();
    expect(v.hole("musik:a")).toBeUndefined();
  });

  it("zählt fehlende Dateien nicht und vergisst auf Wunsch", async () => {
    const v = new Puffervorrat<Puffermass | null>((p) => p, 10 * MB);
    v.lege("klang:fehlt", Promise.resolve(null));
    await takt();
    expect(v.belegt()).toBe(0);
    expect(v.hole("klang:fehlt")).toBeDefined();
    v.vergiss("klang:fehlt");
    expect(v.hole("klang:fehlt")).toBeUndefined();
  });
});
