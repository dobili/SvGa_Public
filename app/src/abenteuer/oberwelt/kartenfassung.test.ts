/** Tests für kartenfassung (kartenfassung.ts): zweite Fassung einer Karte nach einer Variable (Runde 6). */
import { describe, expect, it } from "vitest";
import { kartenfassung } from "./kartenfassung";

const MUSIKHAUS = {
  datei: "karten/port-delacroix-musikhaus.json",
  zustaende: { musikhausOffen: "karten/port-delacroix-musikhaus-neu.json" },
};

describe("kartenfassung", () => {
  it("nimmt die gewöhnliche Datei, solange die Variable fehlt oder falsch ist", () => {
    expect(kartenfassung(MUSIKHAUS, {})).toEqual({ datei: MUSIKHAUS.datei, zustand: null });
    expect(kartenfassung(MUSIKHAUS, { musikhausOffen: false })).toEqual({
      datei: MUSIKHAUS.datei,
      zustand: null,
    });
  });

  it("nimmt die zweite Fassung, wenn die Variable wahr ist", () => {
    expect(kartenfassung(MUSIKHAUS, { musikhausOffen: true })).toEqual({
      datei: "karten/port-delacroix-musikhaus-neu.json",
      zustand: "musikhausOffen",
    });
  });

  it("kommt ohne zustaende aus", () => {
    expect(kartenfassung({ datei: "karten/x.json" }, { egal: true }).datei).toBe("karten/x.json");
  });
});
