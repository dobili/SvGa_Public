/**
 * Tests für die Startstellung einer Begegnung, besonders Schach960 (docs/spiel/10, V1), und für
 * den Auftrag einer Aufgabenrunde (Kulisse beim Lebendschach, Weg 9).
 */
import { describe, expect, it } from "vitest";
import orte from "../../../../inhalte/abenteuer/orte.json";
import runden from "../../../../inhalte/abenteuer/runden.json";
import { startFen960 } from "../../schach/chess960";
import type { Begegnungsdaten, Spieldaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { auftragFuerRunde, startstellungDer } from "./auftraege";

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

describe("Auftrag einer Aufgabenrunde", () => {
  const daten = { runden: runden.runden, orte: orte.orte } as unknown as Spieldaten;
  const stand = { runden: [], wertung: null } as unknown as Abenteuerstand;

  it("Lebendschach bringt die Lichtung unter den Mammutbäumen als Kulisse mit", () => {
    const auftrag = auftragFuerRunde("wegCrossroadsPinewood.lebendschach", daten, stand);
    expect(auftrag?.kulisse).toBe("wegCrossroadsPinewood.riesenbaeume");
  });

  it("jede Kulisse einer Runde ist eine Karte aus orte.json", () => {
    const karten = new Set(orte.orte.flatMap((o) => o.karten.map((k) => k.kennung)));
    for (const r of runden.runden) {
      if ("kulisse" in r && r.kulisse) expect(karten.has(r.kulisse), r.kennung).toBe(true);
    }
  });

  it("gewöhnliche Runden haben keine Kulisse", () => {
    const auftrag = auftragFuerRunde("wegCrossroadsPinewood.lebendschach", daten, stand);
    const andere = runden.runden.find((r) => r.ort === "mapleFalls");
    expect(auftrag).not.toBeNull();
    expect(andere && auftragFuerRunde(andere.kennung, daten, stand)?.kulisse).toBeUndefined();
  });
});
