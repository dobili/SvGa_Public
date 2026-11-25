/** Tests des Zeitraffers (regeln/zeitraffer.ts): Gestirn, Himmel, Sterne, Zeiger. */
import { describe, expect, it } from "vitest";
import { himmelsfarbe, rafferbild } from "./zeitraffer";

const uhr = (h: number, m = 0) => h * 60 + m;

describe("rafferbild", () => {
  it("Anfang und Ende stimmen mit den Uhrzeiten überein", () => {
    expect(rafferbild(uhr(14), uhr(22), 0).uhrzeit).toBe("14:00");
    const ende = rafferbild(uhr(14), uhr(22), 1);
    expect(ende.uhrzeit).toBe("22:00");
    expect(ende.gestirn).toBe("mond");
    expect(ende.sterne).toBe(1);
    expect(ende.bahn).toBeCloseTo(0.2);
  });
  it("Mittags steht die Sonne oben, ohne Sterne, Himmel blau", () => {
    const b = rafferbild(uhr(13), uhr(13), 0);
    expect(b.gestirn).toBe("sonne");
    expect(b.bahn).toBeCloseTo(0.5);
    expect(b.sterne).toBe(0);
    expect(b.himmel).toBe("#5b86c4");
  });
  it("Schlafen über Mitternacht bis 7 Uhr am nächsten Tag", () => {
    const ende = rafferbild(uhr(23, 30), uhr(24 + 7), 1);
    expect(ende.uhrzeit).toBe("07:00");
    expect(ende.gestirn).toBe("sonne");
    expect(ende.zeigerMinute).toBeCloseTo(0);
    expect(ende.zeigerStunde).toBeCloseTo(210);
  });
  it("Der Minutenzeiger endet auf der Zielminute, auch bei langem Warten", () => {
    expect(rafferbild(uhr(8, 15), uhr(24 + 7), 1).zeigerMinute).toBeCloseTo(0);
    expect(rafferbild(uhr(8, 15), uhr(24 + 7), 0).zeigerMinute).toBeCloseTo(90);
  });
  it("Himmelsfarben: Nacht navy, Abend gold", () => {
    expect(himmelsfarbe(23)).toBe("#0b1424");
    expect(himmelsfarbe(19)).toBe("#c9a227");
  });
});
