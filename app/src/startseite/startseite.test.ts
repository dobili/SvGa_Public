/** Tests der Anleitungswahl auf der Startseite (Konzept 11.1, Entscheidung 15.10.2026). */
import { describe, expect, it, vi } from "vitest";

// Die Startseite hängt Verhalten an das HTML; in Node gibt es kein Dokument, nur die Wahl zählt.
vi.mock("../app/offlineKern", () => ({
  abonniereOffline: vi.fn(),
  offlineStand: vi.fn(),
  starteOffline: vi.fn(),
}));

const { anleitungFuer } = await import("./startseite");

describe("Anleitung je Gerät", () => {
  it("iPhone: Schritte über „Teilen“, auch ohne Installationsdialog", () => {
    expect(anleitungFuer("iphone", false, false)).toBe("iphone");
  });

  it("Android mit und ohne Dialog: der Knopf (mit Hinweis aufs Browsermenü)", () => {
    expect(anleitungFuer("android", true, false)).toBe("knopf");
    expect(anleitungFuer("android", false, false)).toBe("knopf");
  });

  it("Mac mit Safari, unbekannter Browser, schon installiert", () => {
    expect(anleitungFuer("mac-safari", false, false)).toBe("mac");
    expect(anleitungFuer("anderer", false, false)).toBe("andere");
    expect(anleitungFuer("anderer", true, false)).toBe("knopf");
    expect(anleitungFuer("chromium", true, true)).toBe("installiert");
  });
});
