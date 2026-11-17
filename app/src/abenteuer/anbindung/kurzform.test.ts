// Kurze Partieformen in der Anbindung: Start nach einer Eröffnung, Speichern und Lesen der Form,
// Ausgang beim Endspiel „Remis halten“, Texte des Einstiegs.
import { describe, expect, it } from "vitest";
import { abenteuerteil } from "../../speicher/abenteuerteilLesen";
import { neuePartie, type Partieeinstellung } from "../../spiel/partie";
import { verlaufAlsText } from "./kurzformtexte";
import { ausgangAus } from "./partieergebnis";
import { GRUNDSTELLUNG, startFenAus } from "./partiestart";

const BASIS: Partieeinstellung = {
  startFen: GRUNDSTELLUNG,
  eigeneFarbe: "white",
  stufe: 3,
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
  uhr: null,
  ruecknahmeErlaubt: false,
  abbildung: null,
  gegner: "engine",
  bot: null,
  botName: "Mags",
  stilname: "angreifer",
  hilfen: { symbole: false, werkzeuge: false },
  gewertet: false,
  eroeffnung: null,
};

describe("Eröffnung fremd (R13c)", () => {
  it("startet nach den Zügen der Eröffnung", () => {
    const fen = startFenAus({ art: "eroeffnung", zuege: ["e4", "c6", "d4", "d5"] });
    expect(fen).toBe("rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3");
  });

  it("zeigt den Verlauf in der Notation des Buches", () => {
    expect(verlaufAlsText(["e4", "c6", "Nf3", "d5"], "de")).toBe("1. e4 c6 2. Sf3 d5");
    expect(verlaufAlsText(["e4", "c6", "Nf3", "d5", "Nc3"], "de", 2)).toBe("… 2... d5 3. Sc3");
  });
});

describe("Kurzform im Spielstand", () => {
  it("bleibt beim Lesen erhalten, kaputte Teile fallen weg", () => {
    const kurzform = { art: "endspiel", zuege: 12, ziel: "remis" } as const;
    expect(abenteuerteil({ kennung: "a.b#1", kurzform })).toEqual({
      abenteuer: { kennung: "a.b#1", kurzform },
    });
    expect(abenteuerteil({ kennung: "a.b#1", kurzform: { art: "x", zuege: 3 } })).toEqual({
      abenteuer: { kennung: "a.b#1" },
    });
  });

  it("wertet ein Patt beim Endspiel „Remis halten“ als Sieg", () => {
    const einstellung: Partieeinstellung = {
      ...BASIS,
      startFen: "8/8/4k3/8/8/4K3/4P3/8 b - - 0 1",
      eigeneFarbe: "black",
      abenteuer: { kennung: "a.b#1", kurzform: { art: "endspiel", zuege: 10, ziel: "remis" } },
    };
    const partie = neuePartie(einstellung, "p", "2026-11-17T20:00:00Z");
    if (!partie) throw new Error("Stellung nicht spielbar?");
    expect(ausgangAus({ ...partie, ende: { art: "patt" } })).toBe("sieg");
    expect(ausgangAus({ ...partie, ende: { art: "zielRemis" } })).toBe("sieg");
    expect(ausgangAus({ ...partie, ende: { art: "ziel", sieger: "white" } })).toBe("niederlage");
  });
});
