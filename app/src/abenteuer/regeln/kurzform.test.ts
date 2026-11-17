// Kurze Partieformen (Regelwerk R13, R13a, R13b): Zugzählung, Fälligkeit und Ausgang nach Wert.
import { describe, expect, it } from "vitest";
import type { Partiezug } from "../../spiel/partie";
import {
  ausgangDerKurzform,
  ausgangNachWert,
  eigeneZuege,
  kurzformAus,
  kurzformEnde,
  restzuege,
  wertungFaellig,
  type Kurzform,
} from "./kurzform";

function zug(von: Partiezug["von"]): Partiezug {
  return { san: "e4", von, quelle: von === "leser" ? "leser" : "engine", fehler: null, verlust: 0 };
}

/** Abwechselnde Züge, Leser zuerst. */
function zuege(anzahl: number): Partiezug[] {
  return Array.from({ length: anzahl }, (_, i) => zug(i % 2 === 0 ? "leser" : "engine"));
}

const DUELL: Kurzform = { art: "stellungsduell", zuege: 3, mindestvorteil: 1 };
const GEWINNEN: Kurzform = { art: "endspiel", zuege: 3, ziel: "sieg" };
const HALTEN: Kurzform = { art: "endspiel", zuege: 3, ziel: "remis" };

describe("kurzformAus", () => {
  it("übernimmt Duell, Vorteil und Endspiel, nicht die ganze Partie", () => {
    expect(kurzformAus({ art: "vorteil", zuege: 10, mindestvorteil: 1 })).toEqual({
      art: "vorteil",
      zuege: 10,
      mindestvorteil: 1,
    });
    expect(kurzformAus({ art: "endspiel", zuege: 12, ziel: "remis" })).toEqual({
      art: "endspiel",
      zuege: 12,
      ziel: "remis",
    });
    expect(kurzformAus({ art: "partie" })).toBeNull();
  });
});

describe("Zugzählung und Fälligkeit", () => {
  it("zählt nur die Züge des Lesers", () => {
    expect(eigeneZuege({ zuege: zuege(5) })).toBe(3);
    expect(restzuege({ zuege: zuege(2) }, DUELL)).toBe(2);
    expect(restzuege({ zuege: zuege(9) }, DUELL)).toBe(0);
  });

  it("ist fällig, wenn der Gegner nach dem letzten eigenen Zug geantwortet hat", () => {
    expect(wertungFaellig({ zuege: zuege(5), ende: null }, DUELL)).toBe(false);
    expect(wertungFaellig({ zuege: zuege(6), ende: null }, DUELL)).toBe(true);
    expect(wertungFaellig({ zuege: zuege(6), ende: { art: "patt" } }, DUELL)).toBe(false);
  });
});

describe("Ausgang nach dem Wert", () => {
  it("Duell und Vorteil: Mindestvorteil Sieg, darunter ab null Remis, sonst Niederlage", () => {
    expect(ausgangNachWert(DUELL, 1.2)).toBe("sieg");
    expect(ausgangNachWert(DUELL, 0.4)).toBe("remis");
    expect(ausgangNachWert(DUELL, -0.2)).toBe("niederlage");
  });

  it("Endspiel gewinnen und Remis halten", () => {
    expect(ausgangNachWert(GEWINNEN, 4)).toBe("sieg");
    expect(ausgangNachWert(GEWINNEN, 0.5)).toBe("remis");
    expect(ausgangNachWert(GEWINNEN, -3)).toBe("niederlage");
    expect(ausgangNachWert(HALTEN, -1)).toBe("sieg");
    expect(ausgangNachWert(HALTEN, -2)).toBe("niederlage");
  });

  it("schreibt das Ende mit dem richtigen Sieger", () => {
    expect(kurzformEnde(DUELL, 2, "black")).toEqual({ art: "ziel", sieger: "black" });
    expect(kurzformEnde(DUELL, -1, "black")).toEqual({ art: "ziel", sieger: "white" });
    expect(kurzformEnde(DUELL, 0.5, "white")).toEqual({ art: "zielRemis" });
  });

  it("wertet ein Remis nach den Regeln beim Halten als Sieg", () => {
    expect(ausgangDerKurzform(HALTEN, { art: "patt" })).toBe("sieg");
    expect(ausgangDerKurzform(HALTEN, { art: "vereinbart" })).toBeNull();
    expect(ausgangDerKurzform(HALTEN, { art: "matt", sieger: "white" })).toBeNull();
    expect(ausgangDerKurzform(GEWINNEN, { art: "patt" })).toBeNull();
    expect(ausgangDerKurzform(undefined, { art: "patt" })).toBeNull();
  });
});
