// Partieauftrag → Partieeinstellung (docs/spiel/04_Architektur.md, Abschnitt 3, Schritt 3).
import { describe, expect, it } from "vitest";
import type { Gegnerprofil } from "../schnittstelle/gegnerprofil";
import type { Partieauftrag } from "../schnittstelle/partie";
import { GRUNDSTELLUNG, eroeffnungAus, farbeAus, partieeinstellungAus } from "./partiestart";

const AMBROSE: Gegnerprofil = {
  kennung: "mapleFalls.ambrose",
  name: "figur.ambrose.name",
  rolle: "story",
  portraet: "portraets/ambrose.webp",
  staerke: { art: "aktuell", versatz: 0 },
  gewichte: { ungenau: 1.2 },
  stil: "angreifer",
  eroeffnung: {
    art: "fest",
    eroeffnungen: ["praxis:King's Gambit", "praxis:Italian Game"],
    abweichung: 30,
  },
  steckbrief: [],
};

const AUFTRAG: Partieauftrag = {
  kennung: "mapleFalls.ersteLektion#1",
  begegnung: "mapleFalls.ersteLektion",
  profil: AMBROSE,
  zustand: { haeufigkeitsfaktor: 1, grund: null, analysiert: false },
  staerke: {
    zielElo: 800,
    stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
    haeufigkeit: 1.17,
  },
  farbe: "white",
  format: { art: "partie" },
  startstellung: { art: "grundstellung" },
  deck: { karten: [] },
  kartenErlaubt: false,
  zaehltFuerApp: true,
  uhr: null,
};

describe("partieeinstellungAus", () => {
  it("spielt den Story-Gegner als eigene Stufe mit Stil, ohne Hilfen, ungewertet", () => {
    const e = partieeinstellungAus(AUFTRAG, true, () => 0);
    expect(e.startFen).toBe(GRUNDSTELLUNG);
    expect(e.bot).toBeNull();
    expect(e.botName).toBe("figur.ambrose.name");
    expect(e.stilname).toBe("angreifer");
    expect(e.stufenJePhase).toEqual({ eroeffnung: 3, mittelspiel: 3, endspiel: 3 });
    expect(e.haeufigkeit).toBe(1.17);
    expect(e.gewichte).toEqual({ ungenau: 1.2 });
    expect(e.eroeffnung).toBe("praxis:King's Gambit");
    expect(e.gewertet).toBe(false);
    expect(e.hilfen).toEqual({ symbole: false, werkzeuge: false });
    expect(e.ruecknahmeErlaubt).toBe(false);
    expect(e.maia).toBe(true);
    expect(e.abenteuer).toEqual({ kennung: "mapleFalls.ersteLektion#1" });
  });

  it("Konzernspieler spielen ohne Maia, Stilmischungen nehmen den ersten Stil als Namen", () => {
    const zero: Gegnerprofil = {
      ...AMBROSE,
      menschlich: false,
      stil: { positionsspieler: 120, vereinfacher: 80 },
      eroeffnung: { art: "frei" },
    };
    const e = partieeinstellungAus({ ...AUFTRAG, profil: zero }, true);
    expect(e.maia).toBeUndefined();
    expect(e.stilname).toBe("positionsspieler");
    expect(e.stilmix).toEqual({ positionsspieler: 120, vereinfacher: 80 });
    expect(e.eroeffnung).toBeNull();
  });

  it("eine Vorgabestellung hat keine Eröffnung und bleibt die FEN", () => {
    const ohneSpringer = "rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const e = partieeinstellungAus(
      { ...AUFTRAG, startstellung: { art: "fen", fen: ohneSpringer } },
      false,
    );
    expect(e.startFen).toBe(ohneSpringer);
    expect(e.eroeffnung).toBeNull();
  });

  it("Uhr nur, wenn der Auftrag eine hat (Sekunden → Millisekunden)", () => {
    const e = partieeinstellungAus({ ...AUFTRAG, uhr: { sekunden: 300, zuschlag: 2 } }, false);
    expect(e.uhr).toEqual({ grundzeitMs: 300_000, zuschlagMs: 2000 });
  });
});

describe("eroeffnungAus und farbeAus", () => {
  it("wählt mit dem Zufall eine der festen Eröffnungen", () => {
    expect(eroeffnungAus(AMBROSE, GRUNDSTELLUNG, () => 0.99)).toBe("praxis:Italian Game");
    expect(
      eroeffnungAus({ ...AMBROSE, eroeffnung: { art: "praxis" } }, GRUNDSTELLUNG, () => 0),
    ).toBe("praxis");
  });

  it("würfelt die Farbe nur bei „zufall“", () => {
    expect(farbeAus("black", () => 0)).toBe("black");
    expect(farbeAus("zufall", () => 0.2)).toBe("white");
    expect(farbeAus("zufall", () => 0.7)).toBe("black");
  });
});
