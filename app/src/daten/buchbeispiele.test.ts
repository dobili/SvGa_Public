/** Tests der Buchbeispiele: konstruierte Partien fallen weg, Buchzugfolgen bleiben. */
import { describe, expect, it } from "vitest";
import { buchbeispiele } from "./buchbeispiele";
import type { Kapitel } from "./generiert/kapitel";

type Beispiel = Kapitel["beispiele"][number];

function beispiel(id: string, status: Beispiel["status"]): Beispiel {
  const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  return {
    id,
    kapitel: 10,
    abschnitt: "10.1",
    titel: "",
    startFen: start,
    zuege: [],
    abbildungen: [],
    status,
  };
}

describe("Buchbeispiele", () => {
  it("lässt konstruierte Partien weg", () => {
    const kapitel = {
      beispiele: [
        beispiel("k10-a1", "freigegeben"),
        beispiel("k10-a21-k", "konstruiert"),
        beispiel("k10-a3", "entwurf"),
      ],
    };
    expect(buchbeispiele(kapitel).map((b) => b.id)).toEqual(["k10-a1", "k10-a3"]);
  });
});
