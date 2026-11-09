/** Tests für die Startstellung einer Begegnung, besonders Schach960 (docs/spiel/10, V1). */
import { describe, expect, it } from "vitest";
import { startFen960 } from "../../schach/chess960";
import type { Begegnungsdaten } from "../daten/laden";
import { startstellungDer } from "./auftraege";

const BEGEGNUNG: Begegnungsdaten = {
  kennung: "siliconBay.tisch960",
  gegner: "siliconBay.studentin",
  farbe: "zufall",
  format: { art: "partie" },
  startstellung: { art: "grundstellung" },
  kartenErlaubt: false,
};

describe("Startstellung einer Begegnung", () => {
  it("gewöhnliche Begegnungen behalten ihre Startstellung", () => {
    expect(startstellungDer(BEGEGNUNG)).toEqual({ art: "grundstellung" });
  });

  it("Schach960 mit fester Nummer", () => {
    const b = { ...BEGEGNUNG, variante: "schach960" as const, startnummer: 0 };
    expect(startstellungDer(b)).toEqual({ art: "fen", fen: startFen960(0) });
  });

  it("Schach960 ohne Nummer lost eine gültige Stellung aus", () => {
    const b = { ...BEGEGNUNG, variante: "schach960" as const };
    const stellung = startstellungDer(b);
    expect(stellung.art).toBe("fen");
    if (stellung.art === "fen") expect(stellung.fen).toMatch(/\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\//);
  });
});
