/** Tests der schwächsten Phase aus den eigenen Partien (Wunsch des Autors, 6.11.2026). */
import { describe, expect, it, vi } from "vitest";
import { leereDaten, type Nutzerdaten } from "../speicher/format";

const { staerke } = vi.hoisted(() => ({ staerke: vi.fn() }));
vi.mock(import("../spiel/wertung"), async (original) => ({
  ...(await original()),
  staerkeLetzterPartien: staerke,
}));
const { ABSTAND_AB, MINDESTENS_PARTIEN, phasenschwaeche } = await import("./phasenschwaeche");

const JETZT = new Date("2026-11-06T10:00:00Z");
const schaetzung = (mitte: number, partien = 8) => ({ tempo: "rapid", mitte, von: 0, bis: 0, partien });

/** Frische Daten (eigene Partienliste, damit der Zwischenspeicher nicht greift). */
function daten(): Nutzerdaten {
  const d = leereDaten(JETZT);
  return { ...d, spiel: { ...d.spiel, partien: [] } };
}

describe("Schwächste Phase", () => {
  it("meldet das Endspiel, wenn es deutlich unter dem Schnitt liegt", () => {
    staerke.mockReturnValue({
      ...schaetzung(1400),
      phasen: { eroeffnung: schaetzung(1450), mittelspiel: schaetzung(1380), endspiel: schaetzung(1150) },
    });
    expect(phasenschwaeche(daten())).toEqual({ phase: "endspiel", abstand: 250, partien: 8 });
  });

  it("schweigt bei kleinem Abstand oder zu wenigen Partien", () => {
    staerke.mockReturnValue({
      ...schaetzung(1400),
      phasen: { eroeffnung: null, mittelspiel: schaetzung(1400 - ABSTAND_AB + 10), endspiel: null },
    });
    expect(phasenschwaeche(daten())).toBeNull();
    staerke.mockReturnValue({
      ...schaetzung(1400, MINDESTENS_PARTIEN - 1),
      phasen: { eroeffnung: null, mittelspiel: null, endspiel: schaetzung(1000) },
    });
    expect(phasenschwaeche(daten())).toBeNull();
  });
});
