/**
 * Tests der Zeitklasse aus der Bedenkzeit (R51), nach der Regel von Lichess.
 */
import { describe, expect, it } from "vitest";
import { zeitklasse } from "./zeitklasse";

const MINUTE = 60_000;
const SEKUNDE = 1000;
const uhr = (minuten: number, sekunden: number) => ({
  grundzeitMs: minuten * MINUTE,
  zuschlagMs: sekunden * SEKUNDE,
});

describe("zeitklasse", () => {
  it("die Vorgaben der App landen in den erwarteten Klassen", () => {
    expect(zeitklasse(uhr(1, 0))).toBe("bullet");
    expect(zeitklasse(uhr(3, 0))).toBe("blitz");
    expect(zeitklasse(uhr(3, 2))).toBe("blitz");
    expect(zeitklasse(uhr(5, 3))).toBe("blitz");
    expect(zeitklasse(uhr(10, 0))).toBe("schnell");
    expect(zeitklasse(uhr(15, 10))).toBe("schnell");
    expect(zeitklasse(uhr(30, 20))).toBe("klassisch");
    expect(zeitklasse(uhr(60, 0))).toBe("klassisch");
  });

  it("ohne Uhr keine Klasse", () => {
    expect(zeitklasse(null)).toBeNull();
    expect(zeitklasse(undefined)).toBeNull();
  });
});
