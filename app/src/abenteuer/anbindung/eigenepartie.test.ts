// Eigene Variantenpartien (Tandem, Ente, Nebel): Erkennung, Ende aus dem Ergebnis, Halbzüge.
import { describe, expect, it } from "vitest";
import { neuePartie, type Partie, type Partieeinstellung } from "../../spiel/partie";
import "../../spiel/varianten/alle";
import { chessopsRegeln } from "../../spiel/varianten/regelschicht";
import { registriereVariante } from "../../spiel/varianten/variante";
import { endeAusErgebnis, eigenerAblauf } from "./eigenepartie";
import { GRUNDSTELLUNG } from "./partiestart";
import { partieergebnisAus } from "./partieergebnis";
import { registriereVariantenpartie } from "./variantenpartien";

const KENNUNG = "probeEigen";
registriereVariante({
  kennung: KENNUNG,
  art: "sonderform",
  name: "variante.probeEigen.name",
  regeln: chessopsRegeln("chess", KENNUNG),
  engine: { engine: "stockfish" },
  ablauf: "eigene_partie",
});

const EINSTELLUNG: Partieeinstellung = {
  startFen: GRUNDSTELLUNG,
  eigeneFarbe: "black",
  stufe: 3,
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
  uhr: null,
  ruecknahmeErlaubt: false,
  abbildung: null,
  gegner: "engine",
  bot: null,
  botName: "Theron",
  stilname: "angreifer",
  hilfen: { symbole: false, werkzeuge: false },
  gewertet: false,
  eroeffnung: null,
  abenteuer: { kennung: "crossroads.probe#1", variante: KENNUNG },
};

function partie(): Partie {
  const p = neuePartie(EINSTELLUNG, "p-eigen", "2026-11-26T10:00:00Z");
  if (!p) throw new Error("Grundstellung nicht spielbar?");
  return p;
}

describe("eigene Variantenpartie", () => {
  it("erkennt den eigenen Ablauf, mit und ohne angemeldete Komponente", () => {
    expect(eigenerAblauf(partie())).toBe("fehlt");
    registriereVariantenpartie(KENNUNG, () => null);
    expect(eigenerAblauf(partie())).toBe("komponente");
    const gewoehnlich = { ...partie(), einstellung: { ...EINSTELLUNG, abenteuer: undefined } };
    expect(eigenerAblauf(gewoehnlich)).toBeNull();
  });

  it("schreibt Sieg, Niederlage, Remis und Abbruch aus Sicht des Lesers (Schwarz)", () => {
    const p = partie();
    expect(endeAusErgebnis(p, { ausgang: "sieg", halbzuege: 37 }).ende).toEqual({
      art: "variante",
      sieger: "black",
      grund: "variante.probeEigen.ende",
      halbzuege: 37,
    });
    const verloren = endeAusErgebnis(p, { ausgang: "niederlage", halbzuege: 4 }).ende;
    expect(verloren && "sieger" in verloren ? verloren.sieger : null).toBe("white");
    expect(endeAusErgebnis(p, { ausgang: "remis", halbzuege: 2 }).ende?.art).toBe("varianteRemis");
    expect(endeAusErgebnis(p, { ausgang: "abgebrochen", halbzuege: 0 }).ende).toEqual({
      art: "aufgabe",
      sieger: "white",
    });
  });

  it("das Ergebnis für die Oberwelt zählt die Halbzüge der Komponente", () => {
    const beendet = endeAusErgebnis(partie(), { ausgang: "sieg", halbzuege: 37 });
    const ergebnis = partieergebnisAus(beendet, [], "Kim", new Date("2026-11-26T10:20:00Z"));
    expect(ergebnis?.ausgang).toBe("sieg");
    expect(ergebnis?.halbzuege).toBe(37);
  });
});
