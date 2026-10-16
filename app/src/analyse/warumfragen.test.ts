/** Tests für die Warum-Fragen einer Abbildung (AP 14, seit 0.2.27 ohne Einschätzungen). */
import { describe, expect, it } from "vitest";
import { istRichtig, warumFragen, type Vorbereitet } from "./warumfragen";

const VORBEREITET: Vorbereitet = {
  status: "entwurf",
  fragen: [
    { zug: "6. Ld3", frage: "Warum?", antworten: ["x", "y"], richtig: 1, erklaerung: "Weil y." },
  ],
};

describe("Warum-Fragen", () => {
  it("liefert die Warum-Fragen und prüft die Antwort", () => {
    const [frage] = warumFragen(VORBEREITET);
    expect(frage && istRichtig(frage, 1)).toBe(true);
    expect(frage && istRichtig(frage, 0)).toBe(false);
    expect(warumFragen(undefined)).toEqual([]);
  });
});
