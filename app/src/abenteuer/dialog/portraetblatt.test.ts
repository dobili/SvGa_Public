/** Tests für portraetblatt.ts: Felder der Porträtblätter aus inhalte/abenteuer/portraetblatt.json. */
import { describe, expect, it } from "vitest";
import aufbauDatei from "../../../../inhalte/abenteuer/portraetblatt.json";
import { blattfeld, blattpfad, type Blattaufbau } from "./portraetblatt";

const AUFBAU = aufbauDatei as unknown as Blattaufbau;

describe("Porträtblatt", () => {
  it("findet das Feld über Stimmung und Fassung", () => {
    expect(blattfeld(AUFBAU, null)).toEqual({ spalte: 0, zeile: 0 });
    expect(blattfeld(AUFBAU, "froh")).toEqual({ spalte: 1, zeile: 0 });
    expect(blattfeld(AUFBAU, "bitter")).toEqual({ spalte: 1, zeile: 1 });
    expect(blattfeld(AUFBAU, "lacht")).toEqual({ spalte: 2, zeile: 1 });
    expect(blattfeld(AUFBAU, "ueberrascht")).toEqual({ spalte: 0, zeile: 1 });
    expect(blattfeld(AUFBAU, "unbekannt")).toEqual({ spalte: 0, zeile: 0 });
  });

  it("ordnet jede Stimmung der Dialoge einer vorhandenen Fassung zu", () => {
    for (const fassung of Object.values(AUFBAU.stimmungen)) {
      expect(AUFBAU.fassungen[fassung], fassung).toBeDefined();
    }
  });

  it("bildet den Pfad des Blatts", () => {
    expect(blattpfad("coachDelgado", "froh")).toBe("portraets/blatt/coach-delgado.png");
    expect(blattpfad("ambrose", "jung")).toBe("portraets/blatt/ambrose-jung.png");
  });
});
