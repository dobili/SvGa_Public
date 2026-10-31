/**
 * Tests für den Ablauf einer Trainerrunde: „Aufgabe wiederholen“ setzt die Aufgabe zurück, zählt
 * aber nicht noch einmal (Wunsch des Autors, 19.10.2026). Dazu die Folge richtiger Antworten
 * der Kombo (Gamifizierung P10).
 */
import { describe, expect, it } from "vitest";
import { rundenschritt, type Zustand } from "./useRunde";

const START: Zustand = {
  index: 0,
  richtig: 0,
  folge: 0,
  ergebnis: null,
  gezaehlt: false,
  versuch: 0,
  fertig: false,
  beginn: 0,
  ende: null,
};

describe("Trainerrunde", () => {
  it("wiederholt eine Aufgabe, ohne sie noch einmal zu zählen", () => {
    let z = rundenschritt(START, { art: "beantworte", richtig: false });
    expect(z.richtig).toBe(0);
    z = rundenschritt(z, { art: "wiederhole" });
    expect(z.ergebnis).toBeNull();
    expect(z.versuch).toBe(1);
    z = rundenschritt(z, { art: "beantworte", richtig: true });
    expect(z.ergebnis).toBe(true);
    expect(z.richtig).toBe(0);
    z = rundenschritt(z, { art: "weiter", anzahl: 2, jetzt: 1 });
    expect(z.index).toBe(1);
    expect(z.versuch).toBe(0);
    z = rundenschritt(z, { art: "beantworte", richtig: true });
    expect(z.richtig).toBe(1);
  });

  it("zählt richtige Antworten in Folge; ein Fehler beendet die Kombo, Wiederholen ändert nichts", () => {
    const antworte = (z: Zustand, richtig: boolean) =>
      rundenschritt(rundenschritt(z, { art: "beantworte", richtig }), {
        art: "weiter",
        anzahl: 10,
        jetzt: 1,
      });
    let z = antworte(antworte(antworte(START, true), true), true);
    expect(z.folge).toBe(3);
    z = rundenschritt(z, { art: "beantworte", richtig: false });
    expect(z.folge).toBe(0);
    z = rundenschritt(z, { art: "wiederhole" });
    z = rundenschritt(z, { art: "beantworte", richtig: true });
    expect(z.folge).toBe(0);
  });
});
