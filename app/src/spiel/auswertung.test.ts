/** Tests der Auswertung: Zeichen nach Verlust, erste klare Abweichung, Protokoll der Engine. */
import { describe, expect, it } from "vitest";
import {
  endwert,
  enginefehler,
  ersteAbweichung,
  zeichenFuer,
  zugnummer,
  zugurteile,
} from "./auswertung";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "./partie";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function enginezug(san: string, fehler: Partiezug["fehler"] = null): Partiezug {
  return { san, von: "engine", quelle: fehler ? "fehler" : "engine", fehler, verlust: 1 };
}

/** 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6?? 4. Dxf7#: Leser Weiß, Sf6 ein Fehler der Engine. */
function partie(): Partie {
  const start = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
    },
    "p",
    "2026-10-15T08:00:00.000Z",
  );
  const zuege = [
    leserzug("e4"),
    enginezug("e5"),
    leserzug("Qh5"),
    enginezug("Nc6"),
    leserzug("Bc4"),
    enginezug("Nf6", "drohungIgnoriert"),
    leserzug("Qxf7#"),
  ];
  const fertig = zuege.reduce<Partie | null>((p, z) => (p ? ziehe(p, z) : null), start);
  if (!fertig) throw new Error("Zug geht nicht");
  return fertig;
}

describe("Auswertung", () => {
  it("Zeichen nach den Grenzen aus Konzept 8.3", () => {
    expect(zeichenFuer(0.4)).toBeNull();
    expect(zeichenFuer(0.5)).toBe("?!");
    expect(zeichenFuer(1.2)).toBe("?");
    expect(zeichenFuer(3)).toBe("??");
  });

  it("Matt und Patt ohne Engine", () => {
    expect(endwert("k7/P7/1K6/8/8/8/8/8 b - - 0 1")).toBe(0);
    expect(endwert("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3")).toBe(-10);
    expect(endwert(GRUNDSTELLUNG)).toBeNull();
  });

  it("Verlust aus Sicht der ziehenden Seite, Matt begrenzt", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -0.3, -0.2, -0.3, 99, 10];
    const urteile = zugurteile(p, werte);
    expect(urteile.map((u) => u.zeichen)).toEqual([null, null, "?!", null, null, "??", null]);
    expect(urteile[5]?.verlust).toBeCloseTo(10.3);
    expect(zugurteile(p, [0])).toEqual([]);
  });

  it("erste klare Abweichung nur bei Zügen des Lesers", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -1.2, -1.2, -0.3, 99, 10];
    const urteile = zugurteile(p, werte);
    expect(ersteAbweichung(p, urteile)?.index).toBe(2);
    expect(ersteAbweichung(p, zugurteile(p, [0, 0, 0, 0, 0, 0, 0, 0]))).toBeNull();
  });

  it("Protokoll der Engine mit Zugnummer", () => {
    expect(enginefehler(partie())).toEqual([
      { index: 5, nummer: "3...", fehler: "drohungIgnoriert" },
    ]);
    expect(zugnummer(partie(), 6)).toBe("4.");
  });
});
