/** Tests des Joysticks (joystick.ts, 26.11.2026): Sektoren, Totzone, Blick, Gangart. */
import { describe, expect, it } from "vitest";
import { DAUMENRADIUS_PX, joystickLage, RUHE, sektorZu, TOTZONE } from "./joystick";

const R = DAUMENRADIUS_PX;

describe("joystickLage", () => {
  it("acht Sektoren: gerade und schräg", () => {
    expect(joystickLage(30, 0, RUHE).richtung).toBe("rechts");
    expect(joystickLage(0, -30, RUHE).richtung).toBe("oben");
    expect(joystickLage(20, -20, RUHE).richtung).toBe("rechtsOben");
    expect(joystickLage(-20, 20, RUHE).richtung).toBe("linksUnten");
  });

  it("Totzone: kein Laufen, Knopf folgt trotzdem", () => {
    const lage = joystickLage(R * TOTZONE * 0.9, 0, RUHE);
    expect(lage.richtung).toBeNull();
    expect(lage.knopf.x).toBeCloseTo(R * TOTZONE * 0.9);
  });

  it("Knopf bleibt am Ring, großer Ausschlag rennt, kleiner geht", () => {
    const weit = joystickLage(3 * R, 0, RUHE);
    expect(weit.knopf.x).toBeCloseTo(R);
    expect(weit.ausschlag).toBe(1);
    expect(weit.gangart).toBe("rennen");
    expect(joystickLage(R * 0.5, 0, weit).gangart).toBe("gehen");
  });

  it("Blick: vorherrschende Hauptrichtung, schräg mit Hysterese", () => {
    expect(joystickLage(30, -12, RUHE).blick).toBe("rechts");
    const schraeg = joystickLage(25, -22, { ...RUHE, blick: "oben", richtung: "oben" });
    expect(schraeg.richtung).toBe("rechtsOben");
    expect(schraeg.blick).toBe("oben");
  });
});

describe("sektorZu", () => {
  it("hält die bisherige Richtung knapp über der Grenze", () => {
    expect(sektorZu(20, "rechtsOben")).toBe("rechtsOben");
    expect(sektorZu(20, null)).toBe("rechts");
    expect(sektorZu(10, "rechtsOben")).toBe("rechts");
    expect(sektorZu(350, null)).toBe("rechts");
    expect(sektorZu(330, null)).toBe("rechtsUnten");
  });
});
