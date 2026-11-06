/**
 * Tests der Hintergrund-Auswertung (Meldung des Autors, 6.11.2026): Eine Stellung, die beim
 * nächsten Zug noch rechnet, wird nicht verworfen und nicht doppelt gerechnet.
 */
import { describe, expect, it, vi } from "vitest";

const { bewerte } = vi.hoisted(() => ({
  bewerte: vi.fn(async () => {
    await new Promise((fertig) => setTimeout(fertig, 20));
    return { besterZug: "e2e4", varianten: [{ wert: { art: "cp", wert: 30 }, zuege: ["e2e4"] }] };
  }),
}));

vi.mock(import("../../../engine/engineDienst"), async (original) => ({
  ...(await original()),
  auswertungsEngine: { bewerte, beschaeftigt: () => false } as never,
}));

const { ergebnisFuer } = await import("./useAuswertung");
const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("Hintergrund-Auswertung", () => {
  it("hängt eine neue Runde an die laufende Rechnung derselben Stellung an", async () => {
    let alteRundeLaeuft = true;
    const alt = ergebnisFuer("p1", FEN, () => alteRundeLaeuft, 1000);
    alteRundeLaeuft = false; // der nächste Zug beendet die alte Runde
    const neu = ergebnisFuer("p1", FEN, () => true, 1000);
    const [a, b] = await Promise.all([alt, neu]);
    expect(bewerte).toHaveBeenCalledTimes(1);
    expect(b?.bester).toBe("e2e4");
    expect(a).toEqual(b);
  });

  it("nimmt ein fertiges Ergebnis aus dem Zwischenspeicher", async () => {
    const vorher = bewerte.mock.calls.length;
    await ergebnisFuer("p1", FEN, () => true, 1000);
    expect(bewerte.mock.calls.length).toBe(vorher);
  });
});
