/** Tests der Zeitwertung nach genutzter Bedenkzeit (Idee des Autors, 19.11.2026). */
import { describe, expect, it } from "vitest";
import {
  herabgestuft,
  klasseDerBedenkzeit,
  klasseDerDauer,
  MINDESTZUEGE_ZEITWERTUNG,
  schnellere,
  zeitwertung,
  type Uhrbilanz,
} from "./zeitwertung";

const MINUTE = 60_000;
const SEKUNDE = 1000;

/** Leser mit Weiß, 20 Züge (19 Zuschläge), genutzte Zeit in Sekunden. */
function bilanz(minuten: number, zuschlag: number, genutztSek: number, zuege = 20): Uhrbilanz {
  const grundzeitMs = minuten * MINUTE;
  const zuschlagMs = zuschlag * SEKUNDE;
  const restMs = grundzeitMs + (zuege - 1) * zuschlagMs - genutztSek * SEKUNDE;
  return { grundzeitMs, zuschlagMs, eigeneZuege: zuege, begann: true, restMs };
}

describe("Zeitwertung", () => {
  it("Grenzen wie Lichess, für Einstellung und genutzte Zeit gleich", () => {
    expect(klasseDerDauer(179 * SEKUNDE)).toBe("bullet");
    expect(klasseDerDauer(180 * SEKUNDE)).toBe("blitz");
    expect(klasseDerDauer(480 * SEKUNDE)).toBe("schnell");
    expect(klasseDerDauer(1500 * SEKUNDE)).toBe("klassisch");
    expect(klasseDerBedenkzeit(3 * MINUTE, 2 * SEKUNDE)).toBe("blitz");
    expect(klasseDerBedenkzeit(10 * MINUTE, 5 * SEKUNDE)).toBe("schnell");
    expect(klasseDerBedenkzeit(15 * MINUTE, 10 * SEKUNDE)).toBe("schnell");
    expect(klasseDerBedenkzeit(60 * MINUTE, 0)).toBe("klassisch");
  });

  it("15 + 10 mit 4 s je Zug: gewertet als Bullet-Tempo, herabgestuft", () => {
    const w = zeitwertung(bilanz(15, 10, 80));
    expect(w).toEqual({
      genutztMs: 80_000,
      schnittMs: 4000,
      eingestellt: "schnell",
      gewertet: "bullet",
    });
    expect(herabgestuft(w)).toBe(true);
  });

  it("15 + 10: 10 s je Zug → Blitz, 15 s je Zug → bleibt Schnellschach", () => {
    expect(zeitwertung(bilanz(15, 10, 200))?.gewertet).toBe("blitz");
    const ruhig = zeitwertung(bilanz(15, 10, 300));
    expect(ruhig?.gewertet).toBe("schnell");
    expect(herabgestuft(ruhig)).toBe(false);
  });

  it("nur herabstufen: 3 + 2 mit der ganzen Zeit bleibt Blitz; 60 + 0 mit 30 s je Zug wird Schnellschach", () => {
    expect(zeitwertung(bilanz(3, 2, 218))?.gewertet).toBe("blitz");
    expect(zeitwertung(bilanz(60, 0, 600))?.gewertet).toBe("schnell");
    expect(schnellere("klassisch", "blitz")).toBe("blitz");
    expect(schnellere("blitz", "klassisch")).toBe("blitz");
  });

  it(`erst ab ${MINDESTZUEGE_ZEITWERTUNG} eigenen Zügen`, () => {
    expect(zeitwertung(bilanz(15, 10, 20, 19))).toBeNull();
    expect(herabgestuft(null)).toBe(false);
  });

  it("wer nicht beginnt, bekommt auch für den ersten Zug den Zuschlag", () => {
    const b = { ...bilanz(15, 10, 80), begann: false };
    // Ein Zuschlag mehr gutgeschrieben, bei gleicher Restzeit also 10 s mehr genutzt.
    expect(zeitwertung(b)?.genutztMs).toBe(90_000);
  });

  it("Zeitüberschreitung: die ganze Zeit genutzt, die Klasse bleibt", () => {
    const w = zeitwertung({ ...bilanz(15, 10, 0), restMs: 0 });
    expect(w?.gewertet).toBe("schnell");
  });
});
