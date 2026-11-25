/**
 * Tests der gezeigten Folge aus dem gespeicherten Eintrag (besprechungsfolge.ts): Schäfermatt,
 * Schwarz ist der Held, 3... Sf6?? ist der Patzer, besser war 3... De7.
 */
import { describe, expect, it } from "vitest";
import type { Partieeintrag } from "../../speicher/partien";
import { zeigefolge } from "./besprechungsfolge";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ZUEGE = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"];
const BESTE = ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "d8e7", "h5f7", ""];
const VARIANTEN = [[], [], [], [], ["f1c4", "g8f6"], ["d8e7", "g1f3", "g8f6"], ["h5f7"], []];

/** Der Eintrag mit den Feldern, die die Folge liest. */
function eintrag(): Partieeintrag {
  return {
    partie: {
      id: "folge",
      einstellung: { startFen: GRUNDSTELLUNG, eigeneFarbe: "black" },
      zuege: ZUEGE.map((san) => ({ san })),
    },
    werte: [],
    beste: BESTE,
    abstaende: [],
    varianten: VARIANTEN,
  } as unknown as Partieeintrag;
}

describe("zeigefolge", () => {
  it("zeigt beim Patzer den besseren Weg, so lang wie die Stufe erlaubt", () => {
    const stufe1 = zeigefolge(eintrag(), { index: 5, kategorie: "patzer" }, 1);
    expect(stufe1?.besser).toBe(true);
    expect(stufe1?.schritte.map((s) => s.zug)).toEqual(["De7"]);
    expect(stufe1?.schritte[0]).toMatchObject({ von: "d8", nach: "e7" });
    const stufe3 = zeigefolge(eintrag(), { index: 5, kategorie: "patzer" }, 3);
    expect(stufe3?.schritte.map((s) => s.zug)).toEqual(["De7", "Sf3", "Sf6"]);
  });

  it("zeigt beim Fehler des Gegners die beste Antwort des Helden", () => {
    const folge = zeigefolge(eintrag(), { index: 4, kategorie: "gegnerfehler" }, 2);
    expect(folge?.schritte[0]?.zug).toBe("De7");
  });

  it("brillant erst ab Stufe 2 und nur mit der Folge des gespielten Zuges; Theorie nie", () => {
    const brillant = { index: 6, kategorie: "brillant" } as const;
    expect(zeigefolge(eintrag(), brillant, 1)).toBeNull();
    const folge = zeigefolge(eintrag(), brillant, 2);
    expect(folge?.besser).toBe(false);
    expect(folge?.schritte.map((s) => s.zug)).toEqual(["Dxf7#"]);
    expect(zeigefolge(eintrag(), { index: 4, kategorie: "theorie" }, 3)).toBeNull();
  });

  it("zeigt nichts, wenn der beste Zug der gespielte war", () => {
    expect(zeigefolge(eintrag(), { index: 4, kategorie: "fehler" }, 2)).toBeNull();
  });
});
