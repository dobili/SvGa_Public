/**
 * Tests zu app/ton.ts, Entsperren des Tonerzeugers: Safari meldet nach einem Anruf oder App-Wechsel
 * „interrupted“ statt „suspended“; auch dann weckt die nächste Berührung den Ton. Läuft er schon
 * oder ist er geschlossen, geschieht nichts (iOS-Durchsicht, 20.11.2026).
 */
import { afterEach, describe, expect, it, vi } from "vitest";

/** Ein Tonerzeuger wie im Browser, mit gewähltem Zustand und gezähltem resume(). */
function stelleTonerzeugerBereit(zustand: string) {
  const resume = vi.fn(() => Promise.resolve());
  class TestErzeuger {
    state = zustand;
    resume = resume;
  }
  vi.stubGlobal("window", { AudioContext: TestErzeuger });
  return resume;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("entsperreTon", () => {
  it.each([
    ["suspended", 1],
    ["interrupted", 1],
    ["running", 0],
    ["closed", 0],
  ])("Zustand %s → resume %i-mal", async (zustand, aufrufe) => {
    const resume = stelleTonerzeugerBereit(zustand);
    const { entsperreTon } = await import("./ton");
    entsperreTon();
    expect(resume).toHaveBeenCalledTimes(aufrufe);
  });
});
