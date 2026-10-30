/** Tests der Ringe, die zu Orden werden: Übungen, Teile des Buches, Bündel der Bots. */
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { KEINE_BESIEGTEN } from "../../../speicher/besiegt";
import { leereDaten } from "../../../speicher/format";
import {
  BOTBUENDEL,
  botsDesBuendels,
  buendelanteil,
  teilanteil,
  uebungsanteil,
} from "./ringrechnung";

const fortschritt = leereDaten(new Date("2026-10-30T10:00:00Z")).fortschritt;
const KAPITEL = [
  { kapitel: 0, abbildungen: ["0.1", "0.2"] },
  { kapitel: 1, abbildungen: ["1.1"] },
  { kapitel: 2, abbildungen: ["2.1"] },
];

describe("Ringe für Orden", () => {
  it("Übungen: alle 86 des Buches, gelöste zählen", () => {
    const alle = Object.values(UEBUNGEN_JE_KAPITEL).flat();
    expect(uebungsanteil(fortschritt)).toEqual({ erreicht: 0, gesamt: alle.length });
    const eine = {
      ...fortschritt,
      uebungen: {
        "ueb:droh-ignorieren": { kapitel: 1, versuche: 1, geloest: true, zuletzt: "x" },
        "ueb:zaehlen-vorstoss": { kapitel: 1, versuche: 2, geloest: false, zuletzt: "x" },
      },
    };
    expect(uebungsanteil(eine).erreicht).toBe(1);
  });

  it("Teil Grundlagen: Abbildungen und Übungen der Kapitel 0 und 1", () => {
    const uebungen = (UEBUNGEN_JE_KAPITEL[0] ?? []).length + (UEBUNGEN_JE_KAPITEL[1] ?? []).length;
    const gesehen = { ...fortschritt, gesehen: { "0.1": "x", "1.1": "x", "2.1": "x" } };
    expect(teilanteil("grundlagen", KAPITEL, gesehen)).toEqual({
      erreicht: 2,
      gesamt: 3 + uebungen,
    });
  });

  it("Bündel: jeder vorgefertigte Bot (ohne Spaß-Bots) in genau einem Bündel", () => {
    const alle = BOTBUENDEL.flatMap((b) => botsDesBuendels(b.kennung));
    expect(new Set(alle).size).toBe(alle.length);
    for (const b of BOTBUENDEL) expect(botsDesBuendels(b.kennung).length).toBeGreaterThan(0);
  });

  it("Bündel: „einmal“ zählt jede Zeitart, „alle Zeitarten“ erst alle drei", () => {
    const bots = ["a", "b"];
    const besiegt = { ...KEINE_BESIEGTEN, blitz: ["a"], classical: ["a", "b"], rapid: ["a"] };
    expect(buendelanteil(besiegt, bots, "einmal")).toEqual({ erreicht: 2, gesamt: 2 });
    expect(buendelanteil(besiegt, bots, "alleZeitarten")).toEqual({ erreicht: 1, gesamt: 2 });
  });
});
