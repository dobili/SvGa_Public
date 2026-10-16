/** Tests der Schachuhr: Start, Drücken mit Zuschlag, Pause, Ablauf, Anzeige. */
import { describe, expect, it } from "vitest";
import { abgelaufen, druecke, halte, neueUhr, restzeit, starte, zeitAlsText } from "./uhr";

const MINUTE = 60_000;
const SEKUNDE = 1000;
const FUENFZEHN_ZEHN = { grundzeitMs: 15 * MINUTE, zuschlagMs: 10 * SEKUNDE };

describe("Schachuhr", () => {
  it("der erste Zug startet nur die Uhr des Gegners", () => {
    const stand = druecke(neueUhr(FUENFZEHN_ZEHN), FUENFZEHN_ZEHN, "white", 1000);
    expect(stand.laeuft).toBe("black");
    expect(restzeit(stand, "white", 5000)).toBe(15 * MINUTE);
    expect(restzeit(stand, "black", 5000)).toBe(15 * MINUTE - 4 * SEKUNDE);
  });

  it("Drücken hält die eigene Zeit an und schreibt den Zuschlag gut", () => {
    const start = starte(neueUhr(FUENFZEHN_ZEHN), "white", 0);
    const stand = druecke(start, FUENFZEHN_ZEHN, "white", 12 * SEKUNDE);
    expect(restzeit(stand, "white", 99 * SEKUNDE)).toBe(15 * MINUTE - 2 * SEKUNDE);
    expect(stand.laeuft).toBe("black");
  });

  it("Pause hält die Zeit fest, Fortsetzen zählt weiter", () => {
    const start = starte(neueUhr(FUENFZEHN_ZEHN), "white", 0);
    const pause = halte(start, 30 * SEKUNDE);
    expect(restzeit(pause, "white", 10 * MINUTE)).toBe(15 * MINUTE - 30 * SEKUNDE);
    const weiter = starte(pause, "white", 10 * MINUTE);
    expect(restzeit(weiter, "white", 10 * MINUTE + 5 * SEKUNDE)).toBe(14 * MINUTE + 25 * SEKUNDE);
  });

  it("meldet, wessen Zeit abgelaufen ist", () => {
    const start = starte(neueUhr({ grundzeitMs: MINUTE, zuschlagMs: 0 }), "black", 0);
    expect(abgelaufen(start, MINUTE - 1)).toBeNull();
    expect(abgelaufen(start, MINUTE)).toBe("black");
    expect(restzeit(start, "black", 2 * MINUTE)).toBe(0);
  });

  it("zeigt Minuten und Sekunden, knapp mit Zehnteln", () => {
    expect(zeitAlsText(15 * MINUTE)).toBe("15:00");
    expect(zeitAlsText(MINUTE + 5 * SEKUNDE)).toBe("1:05");
    expect(zeitAlsText(9 * SEKUNDE + 400)).toBe("0:09,4");
  });
});
