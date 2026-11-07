/**
 * Tests der Finde-Kategorien der Taktik (F1 bis F5) und der Auswahl nach Priorität, an
 * Buchabbildungen des Kapitels 7 und an kurzen Eröffnungsstellungen. Je Kategorie mindestens ein
 * Treffer und ein Nichttreffer (Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 3.2).
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { alleFindeKategorien, findeKategorie, FINDE_SCHWELLEN } from "./findekategorien";
import { eingabe, fenNachSan, GRUNDSTELLUNG } from "./findekategorien.testhilfe";

const fen = (abb: string) => stellungVon(abb).fen;
/** Werte, wenn der beste Zug mattsetzt: Matt in 2 laut Engine (100 minus 2). */
const MATT_IN_ZWEI = { vorher: 98, best: 98, gespielt: 0.5 };

describe("F1 Matt war möglich", () => {
  it("Abb. 7.46 (Opernpartie): 16. Db8+ Sxb8 17. Td8# → Matt in 2", () => {
    const fall = { fen: fen("7.46"), best: ["Qb8+", "Nxb8", "Rd8#"], gespielt: ["Kb1", "Qxb3"] };
    const treffer = findeKategorie(eingabe({ ...fall, werte: MATT_IN_ZWEI }));
    expect(treffer?.kennung).toBe("F1");
    expect(treffer?.details).toMatchObject({ zug: "Qb8+", mattIn: 2 });
  });

  it("gekürzte Variante: Die Mattsuche beweist das Matt selbst", () => {
    const fall = { fen: fen("7.46"), best: ["Qb8+"], gespielt: ["Kb1", "Qxb3"] };
    const treffer = findeKategorie(eingabe({ ...fall, werte: MATT_IN_ZWEI }));
    expect(treffer).toMatchObject({ kennung: "F1", details: { mattIn: 2 } });
  });

  it("Abb. 7.17: Txh7+ Kxh7 Dg7# mit dem Mattbild", () => {
    const fall = { fen: fen("7.17"), best: ["Rxh7+", "Kxh7", "Qg7#"], gespielt: ["Rg8+", "Rxg8"] };
    const treffer = findeKategorie(eingabe({ ...fall, werte: MATT_IN_ZWEI }));
    expect(treffer?.kennung).toBe("F1");
    expect(treffer?.details.mattbild).toBeDefined();
  });

  it("kein Matt in der Stellung (Abb. 7.47, Gabel): kein F1", () => {
    const fall = { fen: fen("7.47"), best: ["Nc7+", "Kd8", "Nxa8"], gespielt: ["a3", "d6"] };
    const kennungen = alleFindeKategorien(eingabe(fall)).map((t) => t.kennung);
    expect(kennungen).not.toContain("F1");
  });

  it("setzt auch der gespielte Zug matt (laut Engine), gibt es nichts zu finden", () => {
    const fall = { fen: fen("7.46"), best: ["Qb8+", "Nxb8", "Rd8#"], gespielt: ["Kb1", "Qxb3"] };
    const werte = { vorher: 98, best: 98, gespielt: 96 };
    expect(findeKategorie(eingabe({ ...fall, werte }))?.kennung).not.toBe("F1");
  });
});

describe("F2 Rettung durch Dauerschach oder Patt", () => {
  const RETTUNG = { vorher: 0, best: 0, gespielt: -8 };

  it("Abb. 7.27: Schwarz mit Turm und Bauer weniger, 1... De1+ 2. Kg2 De2+ → Dauerschach", () => {
    const fall = {
      fen: fen("7.27"),
      best: ["Qe1+", "Kg2", "Qe2+", "Kg1", "Qe1+"],
      gespielt: ["h6", "Qc8+", "Kh7"],
      werte: RETTUNG,
    };
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F2",
      details: { zug: "Qe1+", motiv: "dauerschach" },
    });
  });

  it("Abb. 7.29: 1. Dg8+ Kxg8 setzt Weiß patt", () => {
    const fall = {
      fen: fen("7.29"),
      best: ["Qg8+", "Kxg8"],
      gespielt: ["Qd8", "Qb1+"],
      werte: RETTUNG,
    };
    expect(findeKategorie(eingabe(fall))?.details.motiv).toBe("patt");
  });

  it("ohne Rückstand ist eine Schachserie keine Rettung (Abb. 7.47)", () => {
    const fall = { fen: fen("7.47"), best: ["Nc7+", "Kd8", "Nxa8"], gespielt: ["a3", "d6"] };
    const kennungen = alleFindeKategorien(eingabe(fall)).map((t) => t.kennung);
    expect(kennungen).not.toContain("F2");
  });
});

describe("F3 Motiv im besseren Zug", () => {
  it("Abb. 7.47: 1. Sc7+ Kd8 2. Sxa8 ist eine Gabel und gewinnt den Turm", () => {
    const fall = { fen: fen("7.47"), best: ["Nc7+", "Kd8", "Nxa8"], gespielt: ["a3", "d6"] };
    const treffer = findeKategorie(eingabe(fall));
    expect(treffer).toMatchObject({ kennung: "F3", details: { motiv: "gabel", feld: "c7" } });
    expect(treffer?.details.gewinn).toBe(5);
  });

  it("Abb. 7.6: 1... Th1+ 2. Kd2 Txa1 ist ein Spieß", () => {
    const fall = { fen: fen("7.6"), best: ["Rh1+", "Kd2", "Rxa1"], gespielt: ["Kf6", "Ra6+"] };
    expect(findeKategorie(eingabe(fall))?.details.motiv).toBe("spiess");
  });

  it("gewinnt die Folge nur einen Bauern, ist es kein Motiv-Hinweis", () => {
    const fall = {
      fen: "6k1/1p4pp/8/8/8/8/6PP/3Q2K1 w - - 0 1",
      best: ["Qd5+", "Kh8", "Qxb7"],
      gespielt: ["h3", "b5"],
    };
    expect(findeKategorie(eingabe(fall))?.kennung).not.toBe("F3");
  });

  it("gewinnt der gespielte Zug ebenso viel, gibt es keinen Hinweis", () => {
    const fall = {
      fen: fen("7.47"),
      best: ["Nc7+", "Kd8", "Nxa8"],
      gespielt: ["Nd6+", "Kf8", "Nxc8"],
    };
    const kennungen = alleFindeKategorien(eingabe(fall)).map((t) => t.kennung);
    expect(kennungen).not.toContain("F3");
  });
});

describe("F4 Guter Schlag ausgelassen", () => {
  const NACH_DG5 = fenNachSan(GRUNDSTELLUNG, ["e4", "e5", "Nf3", "Qg5"]);

  it("nach 1. e4 e5 2. Sf3 Dg5? schlägt 3. Sxg5 die Dame", () => {
    const fall = { fen: NACH_DG5, best: ["Nxg5"], gespielt: ["d4", "Qxg2"] };
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F4",
      details: { zug: "Nxg5", feld: "g5", gewinn: 9 },
    });
  });

  it("nicht zurückgeschlagen: 4. Lxc6, dann 4... Sxe4 statt 4... dxc6", () => {
    const davor = fenNachSan(GRUNDSTELLUNG, ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"]);
    const fall = {
      fen: fenNachSan(davor, ["Bxc6"]),
      fenDavor: davor,
      best: ["dxc6"],
      gespielt: ["Nxe4", "Bxd7+"],
      werte: { vorher: 0, best: 0, gespielt: -2.5 },
    };
    expect(findeKategorie(eingabe(fall))?.details).toMatchObject({
      zurueckschlagen: true,
      gewinn: 3,
    });
  });

  it("schlägt der gespielte Zug auf demselben Feld, ist es kein ausgelassener Schlag", () => {
    const davor = fenNachSan(GRUNDSTELLUNG, ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"]);
    const fall = {
      fen: fenNachSan(davor, ["Bxc6"]),
      best: ["dxc6"],
      gespielt: ["bxc6"],
      werte: { vorher: 0, best: 0, gespielt: -0.6 },
    };
    expect(alleFindeKategorien(eingabe(fall)).map((t) => t.kennung)).not.toContain("F4");
  });
});

describe("F5 Schach, Schlag oder Drohung zuerst", () => {
  const STELLUNG = "6k1/1p4pp/8/8/8/8/6PP/3Q2K1 w - - 0 1";

  it("1. Dd5+ Kh8 2. Dxb7 gewinnt den Bauern, gespielt war der ruhige Zug h3", () => {
    const fall = { fen: STELLUNG, best: ["Qd5+", "Kh8", "Qxb7"], gespielt: ["h3", "b5"] };
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F5",
      details: { zug: "Qd5+", feld: "d5", art: "schach", gewinn: 1 },
    });
  });

  it("war der gespielte Zug selbst ein Schach, gibt es keinen Röntgen-Hinweis", () => {
    const fall = { fen: STELLUNG, best: ["Qd5+", "Kh8", "Qxb7"], gespielt: ["Qd8+", "Kf7"] };
    expect(findeKategorie(eingabe(fall))).toBeNull();
  });
});

describe("Grundbedingungen und Auswahl", () => {
  const fall = { fen: fen("7.47"), best: ["Nc7+", "Kd8", "Nxa8"], gespielt: ["a3", "d6"] };

  it("unter einem halben Bauern Verlust: keine Kategorie", () => {
    const werte = { vorher: 3, best: 3, gespielt: 2.7 };
    expect(findeKategorie(eingabe({ ...fall, werte }))).toBeNull();
  });

  it("gespielter gleich bester Zug: keine Kategorie", () => {
    expect(findeKategorie(eingabe({ ...fall, gespielt: ["Nc7+"] }))).toBeNull();
  });

  it("alle Treffer in der Reihenfolge der Priorität: Gabel (F3) vor Schach (F5)", () => {
    const kennungen = alleFindeKategorien(eingabe(fall)).map((t) => t.kennung);
    expect(kennungen).toEqual(["F3", "F5"]);
  });

  it("die Schwellen lassen sich für den Messlauf ändern", () => {
    const streng = { ...FINDE_SCHWELLEN, motivGewinnAb: 6 };
    expect(findeKategorie(eingabe(fall), streng)?.kennung).toBe("F5");
  });
});
