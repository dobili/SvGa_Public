/**
 * Tests für regeln/geist.ts: geisterhafte Figuren (Wunsch des Autors, 13.11.2026). Ambrose ist in
 * orte.json als Geist eingetragen; auf der Karte und im Porträt leicht durchsichtig, in Erinnerungen
 * nicht, und `#geist`/`#erscheint` gehen vor.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Ortdaten } from "../daten/laden";
import { erscheinungDesPortraets, geisterDerKarte, geistsprecher } from "./geist";

const orte = (
  JSON.parse(
    readFileSync(new URL("../../../../inhalte/abenteuer/orte.json", import.meta.url), "utf8"),
  ) as { orte: Ortdaten[] }
).orte;

describe("geisterhafte Figuren", () => {
  it("Ambrose ist in orte.json ein Geist, die übrigen Figuren nicht", () => {
    expect([...geistsprecher(orte)]).toEqual(["ambrose"]);
  });

  it("die Eigenschaft gilt für jede Figur, nicht nur für den Namen", () => {
    const ort = {
      kennung: "testort",
      figuren: [
        {
          kennung: "testort.nebel",
          name: "x",
          sprite: "figuren/x.png",
          dialog: "a.b",
          geist: true,
        },
        { kennung: "testort.ambrose", name: "x", sprite: "figuren/x.png", dialog: "a.b" },
      ],
    } as unknown as Ortdaten;
    expect([...geistsprecher([ort])]).toEqual(["nebel"]);
  });

  it("auf der Karte: nur Figuren mit geist, in einer Erinnerung keine", () => {
    const istGeist = (name: string) => name === "ambrose";
    expect([...geisterDerKarte(["juno", "ambrose"], istGeist, false)]).toEqual(["ambrose"]);
    expect(geisterDerKarte(["juno", "ambrose"], istGeist, true).size).toBe(0);
  });

  it("Porträt: Marken gehen vor, sonst leicht durchsichtig außer in der Erinnerung", () => {
    const geister = new Set(["ambrose"]);
    expect(erscheinungDesPortraets({}, "ambrose", geister, false)).toBe("geisterhaft");
    expect(erscheinungDesPortraets({}, "ambrose", geister, true)).toBeUndefined();
    // Ein Tag ohne Wert („#geist“) hat den Wert „ja“ (dialog/geschichte.ts, tagsAus).
    expect(erscheinungDesPortraets({ geist: "ja" }, "ambrose", geister, true)).toBe("geist");
    expect(erscheinungDesPortraets({ erscheint: "ja" }, "ambrose", geister, false)).toBe(
      "erscheint",
    );
    expect(erscheinungDesPortraets({}, "juno", geister, false)).toBeUndefined();
  });
});
