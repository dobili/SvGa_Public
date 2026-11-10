/** Tests für finchjagd.ts: 16 Kästchen der Sammelkarte, Felder nach dem Fund (Runde 6). */
import { describe, expect, it } from "vitest";
import { FINCH_FIGUREN, finchKarte, finchKarteSichtbar } from "./finchjagd";

describe("Finch-Jagd", () => {
  it("hat 16 Figuren: König, Dame, je zwei Türme, Läufer, Springer, acht Bauern", () => {
    expect(FINCH_FIGUREN).toHaveLength(16);
    expect(FINCH_FIGUREN.filter((f) => f.figur === "P")).toHaveLength(8);
    expect(new Set(FINCH_FIGUREN.map((f) => f.fund)).size).toBe(16);
  });

  it("zeigt Felder erst nach dem Fund", () => {
    const daten = [
      { kennung: "finchLaeuferA", feld: "c4" },
      { kennung: "finchDame", feld: "d1" },
    ];
    const karte = finchKarte([{ kennung: "finchLaeuferA" }], daten);
    expect(karte.find((k) => k.fund === "finchLaeuferA")).toMatchObject({
      gefunden: true,
      feld: "c4",
    });
    expect(karte.find((k) => k.fund === "finchDame")).toMatchObject({
      gefunden: false,
      feld: null,
    });
    expect(karte.filter((k) => k.gefunden)).toHaveLength(1);
  });

  it("ist sichtbar ab Odettes Karte oder dem ersten Fund", () => {
    expect(finchKarteSichtbar([], {})).toBe(false);
    expect(finchKarteSichtbar([], { finchKarte: true })).toBe(true);
    expect(finchKarteSichtbar([{ kennung: "finchBauerA" }], {})).toBe(true);
  });
});
