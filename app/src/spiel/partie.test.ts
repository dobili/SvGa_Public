/**
 * Tests der Partie gegen die Engine: Züge, Rücknahme, Partieende und PGN.
 * Stellungen: Grundstellung, Abb. 1.26 (Kapitel 1), Narrenmatt, Endspiele aus Kapitel 8 und 9.
 */
import { describe, expect, it } from "vitest";
import { partieendeDurchZeit, partieendeNach, pgnErgebnis } from "./ergebnis";
import {
  aktuelleFen,
  amZug,
  gibAuf,
  leserAmZug,
  leserzug,
  neuePartie,
  nimmZurueck,
  stellungen,
  ziehe,
  type Partie,
  type Partieeinstellung,
  type Partiezug,
} from "./partie";
import { alsPgn } from "./pgn";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ABB_1_26 = "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6";
const BEGINN = "2026-10-15T08:00:00.000Z";

const EINSTELLUNG: Partieeinstellung = {
  startFen: GRUNDSTELLUNG,
  eigeneFarbe: "white",
  stufe: 1,
  uhr: null,
  ruecknahmeErlaubt: true,
  abbildung: null,
  eroeffnung: null,
  stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
  gegner: "engine",
  bot: null,
  hilfen: { symbole: true, werkzeuge: true },
  gewertet: true,
};

function enginezug(san: string, extra: Partial<Partiezug> = {}): Partiezug {
  return { san, von: "engine", quelle: "engine", fehler: null, verlust: 0, ...extra };
}

function partie(einstellung: Partial<Partieeinstellung> = {}): Partie {
  const neu = neuePartie({ ...EINSTELLUNG, ...einstellung }, "p1", BEGINN);
  if (!neu) throw new Error("Startstellung nicht spielbar");
  return neu;
}

/** Spielt abwechselnd Leser- und Engine-Züge, beginnend mit der Seite am Zug. */
function spiele(start: Partie, ...sans: string[]): Partie {
  return sans.reduce((p, san) => {
    const zug = leserAmZug(p) ? leserzug(san) : enginezug(san);
    const weiter = ziehe(p, zug);
    if (!weiter) throw new Error(`Zug geht nicht: ${san}`);
    return weiter;
  }, start);
}

describe("Partie", () => {
  it("beginnt an jeder spielbaren Stellung, nicht an Lehrbildern ohne König", () => {
    expect(amZug(partie({ startFen: ABB_1_26 }))).toBe("white");
    expect(
      neuePartie({ ...EINSTELLUNG, startFen: "8/8/8/8/8/8/4P3/8 w - - 0 1" }, "x", BEGINN),
    ).toBeNull();
  });

  it("Leser und Engine ziehen abwechselnd; illegale Züge werden abgelehnt", () => {
    const p = spiele(partie(), "e4", "e5", "Nf3");
    expect(stellungen(p)).toHaveLength(4);
    expect(leserAmZug(p)).toBe(false);
    expect(ziehe(p, enginezug("Ke7e6"))).toBeNull();
  });

  it("Rücknahme nimmt den eigenen Zug samt Antwort zurück", () => {
    const p = spiele(partie(), "e4", "e5", "Nf3", "Nc6");
    const zurueck = nimmZurueck(p);
    expect(zurueck?.zuege.map((z) => z.san)).toEqual(["e4", "e5"]);
    expect(zurueck?.ruecknahmen).toBe(1);
    expect(zurueck && leserAmZug(zurueck)).toBe(true);
  });

  it("Rücknahme, während die Engine noch rechnet: nur der eigene Zug", () => {
    const p = spiele(partie(), "e4", "e5", "Nf3");
    expect(nimmZurueck(p)?.zuege).toHaveLength(2);
  });

  it("Rücknahme abgeschaltet oder ohne eigenen Zug: null", () => {
    expect(nimmZurueck(spiele(partie({ ruecknahmeErlaubt: false }), "e4", "e5"))).toBeNull();
    expect(nimmZurueck(partie({ eigeneFarbe: "black" }))).toBeNull();
  });

  it("Narrenmatt: Schwarz gewinnt, die Partie nimmt keine Züge mehr an", () => {
    const p = spiele(partie(), "f3", "e5", "g4", "Qh4#");
    expect(p.ende).toEqual({ art: "matt", sieger: "black" });
    expect(ziehe(p, leserzug("a3"))).toBeNull();
    expect(nimmZurueck(p)?.ende).toBeNull();
  });

  it("Aufgabe", () => {
    const p = gibAuf(spiele(partie(), "e4"));
    expect(p.ende).toEqual({ art: "aufgabe", sieger: "black" });
  });
});

describe("Partieende", () => {
  it("Patt (Kapitel 8, König und Bauer gegen König)", () => {
    expect(partieendeNach(["k7/P7/1K6/8/8/8/8/8 b - - 0 1"])).toEqual({ art: "patt" });
  });

  it("zu wenig Material und 50-Züge-Regel", () => {
    expect(partieendeNach(["8/8/4k3/8/8/3NK3/8/8 w - - 0 60"])).toEqual({ art: "material" });
    expect(partieendeNach(["8/8/4k3/8/8/3RK3/8/8 w - - 100 90"])).toEqual({ art: "fuenfzigZuege" });
  });

  it("dreifache Wiederholung", () => {
    const p = spiele(partie(), "Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8");
    expect(p.ende).toEqual({ art: "wiederholung" });
  });

  it("Zeit: verloren, außer der Gegner kann nicht mehr mattsetzen", () => {
    expect(partieendeDurchZeit(GRUNDSTELLUNG, "white")).toEqual({ art: "zeit", sieger: "black" });
    expect(partieendeDurchZeit("8/8/4k3/8/8/3RK3/8/8 w - - 0 1", "white")).toEqual({
      art: "zeitRemis",
    });
    expect(pgnErgebnis({ art: "zeitRemis" })).toBe("1/2-1/2");
  });
});

describe("PGN", () => {
  const KOPF = { ereignis: "Partie gegen die Engine, Stufe 1", leser: "Du", engine: "Engine" };

  it("Grundstellung: Kopf mit sieben Angaben, Züge mit Nummern, Ergebnis", () => {
    const p = spiele(partie({ eigeneFarbe: "black" }), "f3", "e5", "g4", "Qh4#");
    const pgn = alsPgn(p, KOPF);
    expect(pgn).toContain('[Date "2026.10.15"]');
    expect(pgn).toContain('[White "Engine"]');
    expect(pgn).toContain('[Result "0-1"]');
    expect(pgn).not.toContain("SetUp");
    expect(pgn.trim().endsWith("1. f3 e5 2. g4 Qh4# 0-1")).toBe(true);
  });

  it("eigene Startstellung mit Schwarz am Zug und Kommentar zum Engine-Fehler", () => {
    const p = spiele(partie({ startFen: ABB_1_26 }), "a3", "c4");
    const pgn = alsPgn(p, KOPF, new Map([[0, "Gut"]]), new Map([[1, "?!"]]));
    expect(pgn).toContain(`[FEN "${ABB_1_26}"]`);
    expect(pgn.trim().endsWith("6. a3 {Gut} 6... c4?! *")).toBe(true);
    expect(aktuelleFen(p).split(" ")[1]).toBe("w");
  });
});
