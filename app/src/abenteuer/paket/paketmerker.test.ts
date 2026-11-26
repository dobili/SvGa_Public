// Merklisten bis zur nächsten Änderung am Paket (Befund 25.11.2026: Porträts mit freigegebenen
// Bildadressen nach einer neuen Paketversion).
import { describe, expect, it, vi } from "vitest";

const horcher: (() => void)[] = [];
vi.mock("./paketlader", () => ({
  beiPaketAenderung: (b: () => void) => {
    horcher.push(b);
    return () => undefined;
  },
}));

const { paketmerkliste } = await import("./paketmerker");

describe("paketmerkliste", () => {
  it("leert sich bei einer Änderung am Paket", () => {
    const liste = paketmerkliste<string>();
    liste.set("portraets/blatt/mutter.png", "blob:alt");
    for (const b of horcher) b();
    expect(liste.size).toBe(0);
  });
});
