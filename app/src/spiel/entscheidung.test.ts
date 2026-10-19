/**
 * Tests des Entscheidungspunkts (spiel/entscheidung.ts): Es zählen die Halbzüge bis zu der
 * Stellung, ab der eine Seite bis zum Ende mindestens 90 % Gewinnchance behält.
 */
import { describe, expect, it } from "vitest";
import { gewerteteHalbzuege } from "./entscheidung";

describe("Entscheidungspunkt", () => {
  it("zählt bis zu dem Zug, der in die dauerhaft gewonnene Stellung führt", () => {
    expect(gewerteteHalbzuege([50, 55, 60, 92, 95, 97])).toBe(3);
  });

  it("rückt nach hinten, wenn die Chance noch einmal unter 90 % fällt", () => {
    expect(gewerteteHalbzuege([50, 60, 92, 85, 93, 96])).toBe(4);
  });

  it("erkennt auch eine für Schwarz entschiedene Partie", () => {
    expect(gewerteteHalbzuege([50, 45, 30, 8, 5, 3])).toBe(3);
  });

  it("zählt alle Halbzüge, wenn die Partie offen endet", () => {
    expect(gewerteteHalbzuege([50, 60, 40, 55])).toBe(3);
  });

  it("zählt alle Halbzüge, wenn schon die Startstellung entschieden ist", () => {
    expect(gewerteteHalbzuege([95, 96, 97, 98])).toBe(3);
  });

  it("kommt ohne Züge aus", () => {
    expect(gewerteteHalbzuege([])).toBe(0);
    expect(gewerteteHalbzuege([50])).toBe(0);
  });
});
