/**
 * Test: Erinnerung nach einer Pause einmal je Sitzung und Spielstand (useWiedereinstieg.ts).
 * Warum: Mit dem Hauptmenü (27.11.2026) lädt der Leser andere Spielstände in derselben Sitzung;
 * bis dahin galt die Prüfung nach dem ersten Stand für alle als erledigt, und ein lange ruhender
 * Stand kam ohne „Willkommen zurück“.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { neueSitzungFuerTests, pruefungFaellig } from "./useWiedereinstieg";

describe("pruefungFaellig", () => {
  beforeEach(neueSitzungFuerTests);

  it("prüft je Spielstand einmal, einen anderen Stand neu", () => {
    const kim = { begonnen: "2026-11-08T05:00:00.000Z" };
    const alex = { begonnen: "2026-11-20T05:00:00.000Z" };
    expect(pruefungFaellig(kim)).toBe(true);
    expect(pruefungFaellig(kim)).toBe(false);
    expect(pruefungFaellig(alex)).toBe(true);
    expect(pruefungFaellig(alex)).toBe(false);
  });
});
