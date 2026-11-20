/**
 * Tests zu autor/autorgeraet.ts und testknoepfeAn (abenteuer/anbindung/testende.ts): Die Testleiste
 * des Spiels erscheint in der Fassung des Autors nur, wenn auf dem Gerät die Aufgabenseite geöffnet
 * wurde (Entscheidung F2, 20.11.2026).
 */
import { afterEach, describe, expect, it, vi } from "vitest";

/** Ein Gerätespeicher wie im Browser. */
function stelleGeraetBereit(): Map<string, string> {
  const inhalt = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => inhalt.get(k) ?? null,
      setItem: (k: string, v: string) => inhalt.set(k, v),
      removeItem: (k: string) => inhalt.delete(k),
    },
  });
  return inhalt;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("Gerät des Autors", () => {
  it("ist erst nach dem Öffnen der Aufgabenseite gesetzt, dann zeigt das Spiel die Testknöpfe", async () => {
    const inhalt = stelleGeraetBereit();
    const { istAutorgeraet, merkeAutorgeraet } = await import("./autorgeraet");
    const { testknoepfeAn } = await import("../abenteuer/anbindung/testende");
    expect(istAutorgeraet()).toBe(false);
    expect(testknoepfeAn()).toBe(false);
    merkeAutorgeraet();
    expect(inhalt.get("svga.autorgeraet")).toBe("ja");
    expect(istAutorgeraet()).toBe(true);
    expect(testknoepfeAn()).toBe(true);
  });

  it("ohne lesbaren Gerätespeicher: kein Gerät des Autors", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("gesperrt");
        },
      },
    });
    const { istAutorgeraet } = await import("./autorgeraet");
    expect(istAutorgeraet()).toBe(false);
  });
});
