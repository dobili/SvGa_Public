/** Tests für vorgabezug.ts: Kandidatenwahl und Buch und Bruch (Runde 6 des Abenteuers). */
import { describe, expect, it } from "vitest";
import type { Partie, Partiezug } from "./partie";
import { stufeNachBruch, vorgegebenerZug } from "./vorgabezug";

function zug(san: string, von: Partiezug["von"]): Partiezug {
  return { san, von, quelle: von === "leser" ? "leser" : "engine", fehler: null, verlust: 0 };
}

function partie(
  zuege: readonly Partiezug[],
  abenteuer: NonNullable<Partie["einstellung"]["abenteuer"]>,
): Pick<Partie, "zuege" | "einstellung"> {
  return { zuege: [...zuege], einstellung: { abenteuer } as Partie["einstellung"] };
}

const ALLES_LEGAL = () => true;

describe("Kandidatenwahl", () => {
  const p = partie([zug("e4", "leser")], { kennung: "x", kandidaten: ["e5", "f6", "Nf6"] });

  it("wählt den ersten Gegnerzug zufällig aus den Kandidaten", () => {
    expect(vorgegebenerZug(p, ALLES_LEGAL, () => 0)).toBe("e5");
    expect(vorgegebenerZug(p, ALLES_LEGAL, () => 0.99)).toBe("Nf6");
  });

  it("überspringt unmögliche Kandidaten und gilt nur für den ersten Zug", () => {
    expect(
      vorgegebenerZug(
        p,
        (z) => z !== "e5",
        () => 0,
      ),
    ).toBe("f6");
    const spaeter = partie([zug("e4", "leser"), zug("e5", "engine"), zug("Nf3", "leser")], {
      kennung: "x",
      kandidaten: ["Nc6"],
    });
    expect(vorgegebenerZug(spaeter, ALLES_LEGAL, () => 0)).toBeNull();
  });
});

describe("Buch und Bruch", () => {
  const linie = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"];

  it("folgt der Linie, solange der Leser ihr folgt", () => {
    const p = partie([zug("e4", "leser"), zug("e5", "engine"), zug("Nf3", "leser")], {
      kennung: "x",
      buchbruch: { linie, stufe: 2 },
    });
    expect(vorgegebenerZug(p, ALLES_LEGAL, Math.random)).toBe("Nc6");
    expect(stufeNachBruch(p)).toBeNull();
  });

  it("bricht nach dem Abweichen: keine Vorgabe mehr, schwache Stufe", () => {
    const p = partie([zug("e4", "leser"), zug("e5", "engine"), zug("Bc4", "leser")], {
      kennung: "x",
      buchbruch: { linie, stufe: 2 },
    });
    expect(vorgegebenerZug(p, ALLES_LEGAL, Math.random)).toBeNull();
    expect(stufeNachBruch(p)).toBe(2);
  });

  it("lässt gewöhnliche Partien unberührt", () => {
    const p = { zuege: [], einstellung: {} as Partie["einstellung"] };
    expect(vorgegebenerZug(p, ALLES_LEGAL, Math.random)).toBeNull();
    expect(stufeNachBruch(p)).toBeNull();
  });
});
