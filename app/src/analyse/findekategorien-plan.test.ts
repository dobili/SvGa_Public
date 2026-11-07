/**
 * Tests der Finde-Kategorien aus Buchzügen und Faustregeln (F8 Buchzug, F9 Eröffnungsziel,
 * F10 LAP) und der Laufzeit aller Kategorien zusammen (Ziel: unter 50 ms je Zug am Rechner).
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { alleFindeKategorien, findeKategorie, type Findeeingabe } from "./findekategorien";
import { eingabe, fenNachSan, GRUNDSTELLUNG, type Testfall } from "./findekategorien.testhilfe";

const INDEX = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);
const BUCH = { eroeffnungsindex: INDEX };
/** Ein halber Bauer Verlust und mehr, wie bei „ungenau“. */
const UNGENAU = { vorher: 0.3, best: 0.3, gespielt: -0.4 };
const NACH_SF3 = fenNachSan(GRUNDSTELLUNG, ["e4", "e5", "Nf3"]);
const NACH_SC6 = fenNachSan(GRUNDSTELLUNG, ["e4", "e5", "Nf3", "Nc6"]);

describe("F8 Buchzug deiner Eröffnung", () => {
  const fall: Testfall = {
    fen: NACH_SF3,
    best: ["Nc6", "Bb5"],
    gespielt: ["a6", "Nxe5"],
    werte: UNGENAU,
    phase: "eroeffnung",
  };

  it("nach 1. e4 e5 2. Sf3 spielt das Buch 2... Sc6; gespielt 2... a6", () => {
    const treffer = findeKategorie({ ...eingabe(fall), buchkontext: BUCH });
    expect(treffer?.kennung).toBe("F8");
    expect(treffer?.details.buchzug).toBe("Nc6");
    expect(treffer?.details.eroeffnung).toBeTruthy();
  });

  it("ohne Eröffnungsindex schweigt F8", () => {
    expect(alleFindeKategorien(eingabe(fall)).map((t) => t.kennung)).not.toContain("F8");
  });

  it("ein Buchzug ist kein Hinweis (nach 1. e4 stehen 1... c5 und 1... e5 im Buch)", () => {
    const nachE4 = fenNachSan(GRUNDSTELLUNG, ["e4"]);
    const buchzug = { ...fall, fen: nachE4, best: ["c5", "Nf3"], gespielt: ["e5", "Nf3"] };
    const kennungen = alleFindeKategorien({ ...eingabe(buchzug), buchkontext: BUCH });
    expect(kennungen.map((t) => t.kennung)).not.toContain("F8");
  });

  it("außerhalb des Buches (1. h4 a5) gibt es keinen Buchzug", () => {
    const fremd = fenNachSan(GRUNDSTELLUNG, ["h4", "a5"]);
    const ausserhalb = { ...fall, fen: fremd, best: ["e4"], gespielt: ["Rh3"] };
    const kennungen = alleFindeKategorien({ ...eingabe(ausserhalb), buchkontext: BUCH });
    expect(kennungen.map((t) => t.kennung)).not.toContain("F8");
  });
});

describe("F9 Eröffnungsziel", () => {
  const fall: Testfall = {
    fen: NACH_SC6,
    best: ["Bc4", "Bc5"],
    gespielt: ["h3", "Nf6"],
    werte: UNGENAU,
    phase: "eroeffnung",
  };

  it("nach 1. e4 e5 2. Sf3 Sc6: 3. Lc4 entwickelt, 3. h3 erfüllt kein Ziel", () => {
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F9",
      details: { zug: "Bc4", feld: "c4", ziel: "entwicklung" },
    });
  });

  it("die Rochade als Ziel (Italienisch nach 4. d3 Sf6)", () => {
    const italienisch = fenNachSan(NACH_SC6, ["Bc4", "Bc5", "d3", "Nf6"]);
    const rochade = { ...fall, fen: italienisch, best: ["O-O", "d6"], gespielt: ["a4", "d6"] };
    expect(findeKategorie(eingabe(rochade))?.details.ziel).toBe("rochade");
  });

  it("entwickelt auch der gespielte Zug eine Figur (3. Sc3), gibt es keinen Hinweis", () => {
    expect(findeKategorie(eingabe({ ...fall, gespielt: ["Nc3", "Nf6"] }))).toBeNull();
  });

  it("liegt der zweitbeste Zug knapp dahinter, schweigt die Faustregel", () => {
    expect(findeKategorie(eingabe({ ...fall, abstandZweitbester: 0.1 }))).toBeNull();
  });

  it("in einer unruhigen Stellung (Schwarz droht Sxe4) schweigt die Faustregel", () => {
    const unruhig = fenNachSan(NACH_SC6, ["Bc4", "Bc5", "c3", "Nf6"]);
    const fallUnruhig = { ...fall, fen: unruhig, best: ["O-O", "Nxe4"], gespielt: ["a4", "Nxe4"] };
    expect(findeKategorie(eingabe(fallUnruhig))).toBeNull();
  });
});

describe("F10 Am wenigsten aktive Figur", () => {
  const fall: Testfall = {
    fen: stellungVon("6.20").fen,
    best: ["Be3", "Nh5"],
    gespielt: ["a3", "Nh5"],
    werte: { vorher: 0.6, best: 0.6, gespielt: 0 },
    phase: "mittelspiel",
  };

  it("Abb. 6.20: Der Läufer c1 ist die LAP-Figur, 9. Le3 zieht ihn, 9. a3 nicht", () => {
    expect(findeKategorie(eingabe(fall))).toMatchObject({
      kennung: "F10",
      details: { zug: "Be3", feld: "c1", figur: "bishop" },
    });
  });

  it("zieht der gespielte Zug dieselbe Figur, gibt es keinen Hinweis", () => {
    expect(findeKategorie(eingabe({ ...fall, gespielt: ["Bd2", "Nh5"] }))).toBeNull();
  });

  it("in der Eröffnungsphase gilt F10 nicht", () => {
    expect(findeKategorie(eingabe({ ...fall, phase: "eroeffnung" }))?.kennung).not.toBe("F10");
  });
});

describe("Laufzeit", () => {
  /** Ziel aus dem Konzept (Abschnitt 1.3): alle Kategorien zusammen unter 50 ms je Zug am Rechner. */
  const HOECHSTENS_MS = 50;
  /** Jede Stellung so oft, damit einzelne Ausreißer nicht zählen. */
  const DURCHLAEUFE = 5;

  it("alle Kategorien zusammen unter 50 ms je Zug", () => {
    const faelle: Findeeingabe[] = [
      eingabe({
        fen: stellungVon("7.46").fen,
        best: ["Qb8+", "Nxb8", "Rd8#"],
        gespielt: ["Kb1", "Qxb3"],
      }),
      eingabe({
        fen: stellungVon("7.47").fen,
        best: ["Nc7+", "Kd8", "Nxa8"],
        gespielt: ["a3", "d6"],
      }),
      eingabe({
        fen: stellungVon("7.27").fen,
        best: ["Qe1+", "Kg2", "Qe2+", "Kg1", "Qe1+"],
        gespielt: ["h6", "Qc8+", "Kh7"],
      }),
      eingabe({ ...stellungVonFall("6.20"), best: ["Be3", "Nh5"], gespielt: ["a3", "Nh5"] }),
      {
        ...eingabe({
          fen: NACH_SF3,
          best: ["Nc6", "Bb5"],
          gespielt: ["a6", "Nxe5"],
          phase: "eroeffnung",
        }),
        buchkontext: BUCH,
      },
    ];
    alleFindeKategorien(faelle[0] as Findeeingabe);
    const start = performance.now();
    for (let i = 0; i < DURCHLAEUFE; i += 1) for (const f of faelle) alleFindeKategorien(f);
    const jeZug = (performance.now() - start) / (DURCHLAEUFE * faelle.length);
    expect(jeZug).toBeLessThan(HOECHSTENS_MS);
  });
});

/** Stellung einer Abbildung als Teil eines Testfalls. */
function stellungVonFall(abb: string): { fen: string } {
  return { fen: stellungVon(abb).fen };
}
