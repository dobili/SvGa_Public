/** Test der Rückkehr-Regel der Startanimation: nur Touch-Geräte, nur nach 30 Minuten. */
import { describe, expect, it } from "vitest";
import { RUECKKEHR_AB_MS, rueckkehrFaellig } from "./startanimationRegel";

describe("Startanimation bei der Rückkehr aus dem Hintergrund", () => {
  it("läuft auf dem Handy nach mindestens 30 Minuten, sonst nicht", () => {
    const jetzt = 10_000_000;
    expect(rueckkehrFaellig(jetzt - RUECKKEHR_AB_MS, jetzt, true, true)).toBe(true);
    expect(rueckkehrFaellig(jetzt - RUECKKEHR_AB_MS + 1000, jetzt, true, true)).toBe(false);
    expect(rueckkehrFaellig(null, jetzt, true, true)).toBe(false);
    expect(rueckkehrFaellig(jetzt - 2 * RUECKKEHR_AB_MS, jetzt, true, false)).toBe(false);
    // Am Rechner (feiner Zeiger) nie: Dort wechselt man zwischen Fenstern hin und her.
    expect(rueckkehrFaellig(jetzt - 2 * RUECKKEHR_AB_MS, jetzt, false, true)).toBe(false);
  });
});
