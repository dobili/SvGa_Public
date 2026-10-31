/**
 * Tests der Karte „Deine Erfolge“ (Profil neu, Entwurf C): Orden aus Ringen, zuletzt verdientes
 * Stück aus „verdient“, die nächsten Stücke nach dem kleinsten Rest, Regale als Liste, Fortschritt
 * zählbarer Abzeichen.
 */
import { Bot, LayoutGrid } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ABZEICHEN } from "../fortschritt/abzeichen";
import { zielanteil } from "../fortschritt/abzeichenanteil";
import {
  ERFOLGSREGALE,
  naechsteStuecke,
  ordenAusRing,
  zuletztVerdient,
  type Erfolgsstueck,
} from "./erfolgsstuecke";

/** Ein Stück zum Rechnen. Beispiel: stueck("partien50", 41, 50). */
function stueck(kennung: string, erreicht: number, gesamt: number): Erfolgsstueck {
  return {
    art: "abzeichen",
    kennung,
    name: kennung,
    bedingung: "",
    symbol: Bot,
    anteil: { erreicht, gesamt },
    verdient: erreicht >= gesamt,
    ring: null,
  };
}

describe("Stücke der Karte „Deine Erfolge“", () => {
  it("macht aus einem Ring einen Orden mit Kennung, Bedingung und Stand", () => {
    const orden = ordenAusRing({
      name: "Übungen gelöst",
      symbol: LayoutGrid,
      anteil: { erreicht: 86, gesamt: 86 },
      testid: "ich-uebungen",
    });
    expect(orden).toMatchObject({ art: "orden", kennung: "uebungen", verdient: true });
    const teil = ordenAusRing({
      name: "Teil Endspiel: alle Abbildungen angesehen und alle Übungen gelöst",
      legende: "Endspiel",
      symbol: LayoutGrid,
      anteil: { erreicht: 3, gesamt: 178 },
      testid: "ich-teil-endspiel",
    });
    expect(teil).toMatchObject({ kennung: "teil-endspiel", name: "Endspiel", verdient: false });
  });

  it("nimmt als Glanzstück das zuletzt verdiente Stück mit Datum", () => {
    const a = stueck("warum", 10, 10);
    const b = { ...stueck("teil-endspiel", 1, 1), art: "orden" as const };
    const verdient = {
      "abzeichen:warum": "2026-10-29T10:00:00.000Z",
      "orden:teil-endspiel": "2026-10-30T10:00:00.000Z",
      "rekord:taktikZeit": "2026-10-31T10:00:00.000Z",
    };
    expect(zuletztVerdient([a, b], verdient)).toEqual({
      stueck: b,
      datum: verdient["orden:teil-endspiel"],
    });
    expect(zuletztVerdient([a, b], {})).toBeNull();
  });

  it("zeigt unter „Als Nächstes“ die Stücke mit dem kleinsten Rest, höchstens vier", () => {
    const naechste = naechsteStuecke([
      stueck("partien100", 41, 100),
      stueck("partien50", 41, 50),
      stueck("woche", 3, 4),
      stueck("fertig", 2, 2),
      stueck("erstePartie", 0, 1),
      stueck("dreiRekorde", 2, 3),
      { ...stueck("ohneZahl", 0, 1), anteil: null },
    ]);
    expect(naechste.map((s) => s.kennung)).toEqual([
      "partien50",
      "woche",
      "dreiRekorde",
      "partien100",
    ]);
  });

  it("hat die Regale Buch, Teile, Bots, Abzeichen als Liste", () => {
    expect(ERFOLGSREGALE.map((r) => r.kennung)).toEqual(["buch", "teile", "bots", "abzeichen"]);
  });

  it("zählt den Fortschritt der Partien-Abzeichen bis zum Ziel", () => {
    expect(zielanteil(41, 50)).toEqual({ erreicht: 41, gesamt: 50 });
    expect(zielanteil(60, 50)).toEqual({ erreicht: 50, gesamt: 50 });
    const zaehlbar = ABZEICHEN.filter((a) => a.fortschritt).map((a) => a.kennung);
    expect(zaehlbar).toEqual(expect.arrayContaining(["partien50", "woche", "dreiRekorde"]));
    expect(zaehlbar).not.toContain("brillant");
  });
});
