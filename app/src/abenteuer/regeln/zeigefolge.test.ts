/**
 * Tests der Länge der gezeigten Folge je Stufe („Soll ich es dir zeigen?“, 26.11.2026).
 */
import { describe, expect, it } from "vitest";
import { zeigelaenge, type Folgehalbzug } from "./zeigefolge";

const RUHIG: Folgehalbzug = { schlag: false, matt: false };
const SCHLAG: Folgehalbzug = { schlag: true, matt: false };
const MATT: Folgehalbzug = { schlag: false, matt: true };
const SECHS = [RUHIG, RUHIG, RUHIG, RUHIG, RUHIG, RUHIG];

describe("zeigelaenge", () => {
  it("Stufe 1 zeigt nur den besseren Zug, Stufe 3 bis zu sechs Halbzüge", () => {
    expect(zeigelaenge(1, SECHS)).toBe(1);
    expect(zeigelaenge(3, SECHS)).toBe(6);
    expect(zeigelaenge(3, [RUHIG, RUHIG, RUHIG])).toBe(3);
  });

  it("Stufe 2: Zug und Antwort, bis vier Halbzüge bei Schlag oder Matt", () => {
    expect(zeigelaenge(2, SECHS)).toBe(2);
    expect(zeigelaenge(2, [RUHIG, RUHIG, SCHLAG, SCHLAG, RUHIG])).toBe(4);
    expect(zeigelaenge(2, [RUHIG, RUHIG, SCHLAG, RUHIG])).toBe(3);
    expect(zeigelaenge(2, [RUHIG, RUHIG, RUHIG, RUHIG, SCHLAG])).toBe(2);
  });

  it("ein Matt beendet die Folge, leer und Stufe 0 zeigen nichts", () => {
    expect(zeigelaenge(3, [RUHIG, RUHIG, MATT, RUHIG])).toBe(3);
    expect(zeigelaenge(2, [MATT])).toBe(1);
    expect(zeigelaenge(2, [])).toBe(0);
    expect(zeigelaenge(0, SECHS)).toBe(0);
  });
});
