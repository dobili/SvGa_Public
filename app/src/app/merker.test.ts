/**
 * Tests der Merker: Beobachter erfahren jede Änderung, auch wenn der Gerätespeicher fehlt
 * (Abzeichen nach der Tagesaufgabe, Prüfung der Arbeitschats vom 30.10.2026).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { beobachteMerker, entferneMerker, schreibeMerker } from "./merker";

describe("Merker", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("meldet Schreiben und Entfernen mit dem Namen, bis zum Abmelden", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const namen: string[] = [];
    const abmelden = beobachteMerker((name) => namen.push(name));
    schreibeMerker("tagesserie", "{}");
    entferneMerker("tagesserie");
    abmelden();
    schreibeMerker("tagesserie", "{}");
    expect(namen).toEqual(["tagesserie", "tagesserie"]);
  });
});
