/**
 * Tests des Nachlaufs der Auswertung (Wunsch des Autors, 26.11.2026: „Besprechen“ im Tagebuch
 * sofort bereit): startet nur für beendete, noch nicht ausgewertete Partien, nie doppelt, und hält
 * an, wenn eine neue Partie beginnt.
 */
import { describe, expect, it, vi } from "vitest";
import type { Partie } from "../../../spiel/partie";

const { werteAus } = vi.hoisted(() => ({
  werteAus: vi.fn(async (_partie: unknown, lauf: { laeuft: () => boolean }) => {
    await new Promise((fertig) => setTimeout(fertig, 20));
    return lauf.laeuft();
  }),
}));

vi.mock(import("./useAuswertung"), async (original) => ({
  ...(await original()),
  werteAus,
}));

const { nachlaufAktiv, starteNachlauf, stoppeNachlaeufe } = await import("./nachlauf");

/** Kleinste Partie für den Nachlauf: nur Kennung und Ende zählen. */
function partie(id: string, beendet: boolean): Partie {
  return { id, ende: beendet ? { ergebnis: "1-0" } : null } as unknown as Partie;
}

describe("Nachlauf der Auswertung", () => {
  it("rechnet eine beendete Partie zu Ende und meldet sich danach ab", async () => {
    const lauf = starteNachlauf(partie("n1", true), false);
    expect(nachlaufAktiv("n1")).toBe(true);
    expect(await lauf).toBe(true);
    expect(nachlaufAktiv("n1")).toBe(false);
  });

  it("startet nicht für laufende oder schon ausgewertete Partien", async () => {
    const vorher = werteAus.mock.calls.length;
    expect(await starteNachlauf(partie("n2", false), false)).toBe(false);
    expect(await starteNachlauf(partie("n3", true), true)).toBe(false);
    expect(werteAus.mock.calls.length).toBe(vorher);
  });

  it("startet dieselbe Partie nicht zweimal", async () => {
    const vorher = werteAus.mock.calls.length;
    const erster = starteNachlauf(partie("n4", true), false);
    expect(await starteNachlauf(partie("n4", true), false)).toBe(false);
    await erster;
    expect(werteAus.mock.calls.length).toBe(vorher + 1);
  });

  it("hält an, wenn eine neue Partie beginnt", async () => {
    const lauf = starteNachlauf(partie("n5", true), false);
    stoppeNachlaeufe("neu");
    expect(nachlaufAktiv("n5")).toBe(false);
    expect(await lauf).toBe(false);
  });
});
