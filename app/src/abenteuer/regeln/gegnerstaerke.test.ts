// Gegnerstärke: Ziel-Elo, Stufe und Häufigkeit (docs/spiel/04_Architektur.md, Abschnitt 4).
import { describe, expect, it } from "vitest";
import { gerechneteStaerke, haeufigkeitZu, stufeZu, zielElo } from "./gegnerstaerke";

describe("zielElo", () => {
  it("rechnet Straße relativ zur aktuellen, Clubchef relativ zur Eingangswertung", () => {
    const wertung = { aktuell: 950, eingang: 800 };
    expect(zielElo({ art: "aktuell", versatz: -100 }, wertung)).toBe(850);
    expect(zielElo({ art: "eingang", versatz: 220 }, wertung)).toBe(1020);
    expect(zielElo({ art: "fest", elo: 1500 }, wertung)).toBe(1500);
  });

  it("nimmt ohne Wertung die Einsteigerannahme", () => {
    expect(zielElo({ art: "aktuell", versatz: 0 }, { aktuell: null, eingang: null })).toBe(600);
    expect(zielElo({ art: "eingang", versatz: 100 }, { aktuell: 700, eingang: null })).toBe(800);
  });
});

describe("stufeZu und haeufigkeitZu", () => {
  it("teilt die zehn Stufen zu je 300 Elo", () => {
    expect(stufeZu(100)).toBe(1);
    expect(stufeZu(300)).toBe(1);
    expect(stufeZu(301)).toBe(2);
    expect(stufeZu(1020)).toBe(4);
    expect(stufeZu(5000)).toBe(10);
  });

  it("spielt am Anfang einer Stufe fehlerhafter als am Ende", () => {
    expect(haeufigkeitZu(901)).toBeCloseTo(1.4, 2);
    expect(haeufigkeitZu(1050)).toBeCloseTo(1.05, 2);
    expect(haeufigkeitZu(1200)).toBeCloseTo(0.7, 2);
  });
});

describe("gerechneteStaerke", () => {
  it("Clubchef 1 bei Eingangswertung 800: Stufe 4, Endspiel eine Stufe schwächer", () => {
    const staerke = gerechneteStaerke(
      { staerke: { art: "eingang", versatz: 220 }, phasenversatz: { endspiel: -1 } },
      { haeufigkeitsfaktor: 1 },
      { aktuell: 800, eingang: 800 },
    );
    expect(staerke).toEqual({
      zielElo: 1020,
      stufenJePhase: { eroeffnung: 4, mittelspiel: 4, endspiel: 3 },
      haeufigkeit: 1.12,
    });
  });

  it("abgelenkt erhöht die Häufigkeit sichtbar, Stufen bleiben", () => {
    const staerke = gerechneteStaerke(
      { staerke: { art: "eingang", versatz: 220 } },
      { haeufigkeitsfaktor: 1.4 },
      { aktuell: 800, eingang: 800 },
    );
    expect(staerke.haeufigkeit).toBeCloseTo(1.57, 2);
    expect(staerke.stufenJePhase.mittelspiel).toBe(4);
  });

  it("bleibt in den Grenzen 1 bis 10 und über dem Mindest-Elo", () => {
    const schwach = gerechneteStaerke(
      { staerke: { art: "aktuell", versatz: -500 } },
      { haeufigkeitsfaktor: 1 },
      { aktuell: 400, eingang: 400 },
    );
    expect(schwach.zielElo).toBe(300);
    expect(schwach.stufenJePhase.eroeffnung).toBe(1);
    const stark = gerechneteStaerke(
      { staerke: { art: "fest", elo: 3100 }, phasenversatz: { eroeffnung: 2 } },
      { haeufigkeitsfaktor: 1 },
      { aktuell: null, eingang: null },
    );
    expect(stark.stufenJePhase.eroeffnung).toBe(10);
  });
});
