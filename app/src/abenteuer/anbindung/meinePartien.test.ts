/**
 * Tests der Liste „Meine Partien“ im Clubtagebuch (meinePartien.ts).
 */
import { describe, expect, it } from "vitest";
import type { Partie } from "../../spiel/partie";
import type { Partieeintrag } from "../../speicher/partien";
import { meinePartien } from "./meinePartien";

/** Ein Listeneintrag der App mit den Feldern, die die Liste liest. */
function eintrag(id: string, teile: Partial<Partie> & { abenteuer?: boolean }): Partieeintrag {
  const partie = {
    id,
    einstellung: {
      eigeneFarbe: "white",
      botName: "Skater Jo",
      ...(teile.abenteuer === false ? {} : { abenteuer: { kennung: id } }),
    },
    zuege: Array.from({ length: 47 }, () => ({})),
    ende: { art: "matt", sieger: "white" },
    ...teile,
  };
  return { partie } as unknown as Partieeintrag;
}

describe("meinePartien", () => {
  it("zeigt Gegner, Ausgang und ganze Züge", () => {
    expect(meinePartien({ partien: [eintrag("a", {})] })).toEqual([
      { id: "a", gegner: "Skater Jo", ausgang: "sieg", zuege: 24 },
    ]);
  });

  it("lässt freie Partien der App und laufende Partien weg", () => {
    const partien = [eintrag("frei", { abenteuer: false }), eintrag("offen", { ende: null })];
    expect(meinePartien({ partien })).toEqual([]);
  });

  it("behält die Reihenfolge der App (neueste zuerst) und kürzt auf die Höchstzahl", () => {
    const partien = ["c", "b", "a"].map((id) => eintrag(id, {}));
    expect(meinePartien({ partien }, 2).map((z) => z.id)).toEqual(["c", "b"]);
  });
});
