/**
 * Tests der Anleitungswahl auf der Startseite (Konzept 11.1, Entscheidung 15.10.2026); seit V5 auch,
 * dass das kleine Skript im Installationsteil (Wahl vor dem ersten Zeichnen) dasselbe wählt.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { geraet } from "../app/geraet";

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

/** Das Skript im Installationsteil, das die erste Anleitung wählt (V5). */
function wahlskript(): string {
  const html = readFileSync(new URL("./teile/installationsteil.html", import.meta.url), "utf8");
  const skripte = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1] ?? "");
  const skript = skripte.find((text) => text.includes("data-anleitung"));
  if (!skript) throw new Error("Wahlskript fehlt im Installationsteil");
  return skript;
}

/** Führt das Skript mit einer Browserkennung aus und liefert die sichtbare Anleitung. */
function waehltSkript(kennung: string, beruehrungspunkte: number): string[] {
  const sichtbar: string[] = [];
  const bloecke = ["knopf", "iphone", "mac", "andere", "installiert"].map((art) => ({
    getAttribute: () => art,
    classList: { toggle: (_name: string, an: boolean) => an && sichtbar.push(art) },
  }));
  const dokument = { querySelectorAll: () => bloecke, querySelector: () => null };
  const navigator = { userAgent: kennung, maxTouchPoints: beruehrungspunkte, serviceWorker: {} };
  new Function("navigator", "document", wahlskript())(navigator, dokument);
  return sichtbar;
}

describe("Wahl vor dem ersten Zeichnen (V5)", () => {
  const KENNUNGEN: readonly [string, number][] = [
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1", 5],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15", 5],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15", 0],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/130.0 Safari/537.36", 0],
    ["Mozilla/5.0 (Linux; Android 14; Pixel 7) Chrome/130.0 Mobile Safari/537.36", 5],
    ["Mozilla/5.0 (Android 14; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0", 5],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36 Edg/130.0", 0],
    ["Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0", 0],
  ];

  it.each(KENNUNGEN)("wählt wie anleitungFuer ohne Installationsdialog: %s", (kennung, punkte) => {
    expect(waehltSkript(kennung, punkte)).toEqual([
      anleitungFuer(geraet(kennung, punkte), false, false),
    ]);
  });
});
