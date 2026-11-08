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
  it("rundet auf die nächste Stufe, Eichpunkt in der Mitte (R6)", () => {
    expect(stufeZu(100)).toBe(1);
    expect(stufeZu(449)).toBe(1);
    expect(stufeZu(450)).toBe(2);
    expect(stufeZu(1020)).toBe(3);
    expect(stufeZu(1050)).toBe(4);
    expect(stufeZu(5000)).toBe(10);
  });

  it("spielt unter dem Eichpunkt fehlerhafter, darüber genauer", () => {
    expect(haeufigkeitZu(750)).toBeCloseTo(1.4, 2);
    expect(haeufigkeitZu(900)).toBeCloseTo(1, 2);
    expect(haeufigkeitZu(1020)).toBeCloseTo(0.76, 2);
    expect(haeufigkeitZu(1049)).toBeCloseTo(0.72, 2);
  });
});

describe("gerechneteStaerke", () => {
  it("Clubchef 1 bei Eingangswertung 800: Stufe 3, Endspiel eine Stufe schwächer (R6, R7)", () => {
    const staerke = gerechneteStaerke(
      { staerke: { art: "eingang", versatz: 220 }, phasenversatz: { endspiel: -1 } },
      { haeufigkeitsfaktor: 1, ueberheblich: 1 },
      { aktuell: 800, eingang: 800 },
    );
    expect(staerke).toEqual({
      zielElo: 1020,
      stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 2 },
      haeufigkeit: 0.76,
    });
  });

  it("abgelenkt und überheblich erhöhen die Häufigkeit, zusammen höchstens Faktor 2 (R8, R9)", () => {
    const grund = { staerke: { art: "eingang" as const, versatz: 220 } };
    const wertung = { aktuell: 800, eingang: 800 };
    expect(
      gerechneteStaerke(grund, { haeufigkeitsfaktor: 1.4, ueberheblich: 1 }, wertung).haeufigkeit,
    ).toBeCloseTo(1.07, 2);
    expect(
      gerechneteStaerke(grund, { haeufigkeitsfaktor: 1, ueberheblich: 1.3 }, wertung).haeufigkeit,
    ).toBeCloseTo(0.99, 2);
    expect(
      gerechneteStaerke(grund, { haeufigkeitsfaktor: 1.5, ueberheblich: 1.6 }, wertung).haeufigkeit,
    ).toBeCloseTo(1.53, 2);
  });

  it("bleibt in den Grenzen 1 bis 10, über dem Mindest-Elo und zwischen 0,5 und 2,5", () => {
    const schwach = gerechneteStaerke(
      { staerke: { art: "aktuell", versatz: -500 } },
      { haeufigkeitsfaktor: 2, ueberheblich: 1 },
      { aktuell: 400, eingang: 400 },
    );
    expect(schwach.zielElo).toBe(300);
    expect(schwach.stufenJePhase.eroeffnung).toBe(1);
    expect(schwach.haeufigkeit).toBe(2);
    const stark = gerechneteStaerke(
      { staerke: { art: "fest", elo: 3100 }, phasenversatz: { eroeffnung: 2 } },
      { haeufigkeitsfaktor: 1, ueberheblich: 1 },
      { aktuell: null, eingang: null },
    );
    expect(stark.stufenJePhase.eroeffnung).toBe(10);
    // 3100 liegt 100 über dem Eichpunkt 3000 der Stufe 10.
    expect(stark.haeufigkeit).toBeCloseTo(0.8, 2);
    const extrem = gerechneteStaerke(
      { staerke: { art: "fest", elo: 3100 } },
      { haeufigkeitsfaktor: 0.1, ueberheblich: 1 },
      { aktuell: null, eingang: null },
    );
    expect(extrem.haeufigkeit).toBe(0.5);
  });

  it("legt im zweiten Durchlauf 300 auf die Zielstärke (R10)", () => {
    const staerke = gerechneteStaerke(
      { staerke: { art: "aktuell", versatz: -100 } },
      { haeufigkeitsfaktor: 1, ueberheblich: 1 },
      { aktuell: 800, eingang: 800 },
      300,
    );
    expect(staerke.zielElo).toBe(1000);
  });
});
