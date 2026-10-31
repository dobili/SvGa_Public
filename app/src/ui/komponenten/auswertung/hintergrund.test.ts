/** Tests: Wann die Auswertung während der Partie im Hintergrund rechnet (seit 0.3.40). */
import { describe, expect, it } from "vitest";
import { auswertungImHintergrund, KERNE_FUER_DURCHGEHEND } from "./hintergrund";

describe("auswertungImHintergrund", () => {
  it("rechnet durchgängig, wenn das Gerät genug Kerne hat", () => {
    expect(auswertungImHintergrund(true, false, 8)).toBe(true);
    expect(auswertungImHintergrund(true, false, KERNE_FUER_DURCHGEHEND)).toBe(true);
  });

  it("rechnet auf knappen Geräten nur, solange der Leser am Zug ist", () => {
    expect(auswertungImHintergrund(true, false, 2)).toBe(false);
    expect(auswertungImHintergrund(true, true, 2)).toBe(true);
    expect(auswertungImHintergrund(true, false, undefined)).toBe(false);
  });

  it("rechnet nach dem Ende nicht im Hintergrund (das übernimmt die Auswertung danach)", () => {
    expect(auswertungImHintergrund(false, true, 8)).toBe(false);
  });
});
