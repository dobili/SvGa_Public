/** Tests für kartenfassung.ts: Zustände einer Karte nach Bedingungen (Runde 6 und 8). */
import { describe, expect, it } from "vitest";
import { kartenfassung, zustandsname } from "./kartenfassung";

const MUSIKHAUS = {
  datei: "karten/port-delacroix-musikhaus.json",
  zustaende: { musikhausOffen: "karten/port-delacroix-musikhaus-neu.json" },
};
const PARK = {
  datei: "karten/maple-falls-park.json",
  zustaende: {
    "nadelMapleFalls < 1": "karten/maple-falls-park-steg-gesperrt.json",
    "szene13Gesehen und nicht szene14Gesehen": "karten/maple-falls-park-schulbus.json",
  },
};

describe("kartenfassung", () => {
  it("nimmt die Grundkarte, solange keine Bedingung gilt", () => {
    expect(kartenfassung(MUSIKHAUS, {})).toEqual({ datei: MUSIKHAUS.datei, zustand: null });
    expect(kartenfassung(MUSIKHAUS, { musikhausOffen: false }).zustand).toBeNull();
  });

  it("nimmt den Zustand, wenn seine Bedingung gilt; Name aus der Datei", () => {
    expect(kartenfassung(MUSIKHAUS, { musikhausOffen: true })).toEqual({
      datei: "karten/port-delacroix-musikhaus-neu.json",
      zustand: "neu",
    });
  });

  it("der letzte passende Zustand gilt", () => {
    expect(kartenfassung(PARK, {}).zustand).toBe("steg-gesperrt");
    expect(kartenfassung(PARK, { szene13Gesehen: true }).zustand).toBe("schulbus");
    expect(kartenfassung(PARK, { nadelMapleFalls: 1 }).zustand).toBeNull();
  });

  it("kommt ohne zustaende aus", () => {
    expect(kartenfassung({ datei: "karten/x.json" }, { egal: true }).datei).toBe("karten/x.json");
  });
});

describe("zustandsname", () => {
  it("Teil hinter der Basis, sonst der ganze Stamm", () => {
    expect(
      zustandsname(
        "karten/weg-desert-summit-diner-neon.json",
        "karten/weg-desert-summit-diner.json",
      ),
    ).toBe("neon");
    expect(zustandsname("karten/anderes.json", "karten/weg-desert-summit-diner.json")).toBe(
      "anderes",
    );
  });
});
