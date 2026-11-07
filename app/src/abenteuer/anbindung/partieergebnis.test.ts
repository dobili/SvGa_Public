// Partie der App → Partieergebnis des Abenteuers (Schritt 5: Ausgang, PGN, Momente des Bots).
import { describe, expect, it } from "vitest";
import { neuePartie, ziehe, type Partie, type Partieeinstellung } from "../../spiel/partie";
import { GRUNDSTELLUNG } from "./partiestart";
import { ausgangAus, momenteAus, partieergebnisAus } from "./partieergebnis";

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
  botName: "Ambrose",
  stilname: "angreifer",
  hilfen: { symbole: false, werkzeuge: false },
  gewertet: false,
  eroeffnung: null,
};
const EINSTELLUNG: Partieeinstellung = {
  ...BASIS,
  abenteuer: { kennung: "mapleFalls.ersteLektion#1" },
};

const JETZT = new Date("2026-11-07T20:00:00Z");

/** Das Narrenmatt: Weiß verliert in zwei Zügen; der Bot (Schwarz) zieht ohne Fehler. */
function narrenmatt(): Partie {
  let partie = neuePartie(EINSTELLUNG, "p-test", "2026-11-07T19:55:00Z");
  if (!partie) throw new Error("Grundstellung nicht spielbar?");
  for (const [san, von] of [
    ["f3", "leser"],
    ["e5", "engine"],
    ["g4", "leser"],
    ["Qh4#", "engine"],
  ] as const) {
    const weiter = ziehe(partie, {
      san,
      von,
      quelle: von === "leser" ? "leser" : "engine",
      fehler: null,
      verlust: 0,
    });
    if (!weiter) throw new Error(`Zug ${san} nicht legal`);
    partie = weiter;
  }
  return partie;
}

describe("ausgangAus", () => {
  it("liest den Ausgang aus Sicht des Lesers", () => {
    const partie = narrenmatt();
    expect(partie.ende).toEqual({ art: "matt", sieger: "black" });
    expect(ausgangAus(partie)).toBe("niederlage");
    expect(ausgangAus({ ...partie, einstellung: { ...EINSTELLUNG, eigeneFarbe: "black" } })).toBe(
      "sieg",
    );
    expect(ausgangAus({ ...partie, ende: { art: "patt" } })).toBe("remis");
    expect(ausgangAus({ ...partie, ende: null })).toBe("abgebrochen");
  });
});

describe("momenteAus und partieergebnisAus", () => {
  it("nimmt die zwei größten absichtlichen Fehler des Bots in Partiereihenfolge", () => {
    const partie = narrenmatt();
    const zuege = partie.zuege.map((zug, i) =>
      zug.von === "engine"
        ? { ...zug, fehler: "ungenau" as const, verlust: i === 1 ? 0.8 : 2.5 }
        : zug,
    );
    const momente = momenteAus({ ...partie, zuege });
    expect(momente.map((m) => [m.halbzug, m.gespielt, m.klasse, m.wessen])).toEqual([
      [1, "e5", "fehler", "gegner"],
      [3, "Qh4#", "fehler", "gegner"],
    ]);
    expect(momente[0]?.fen).toContain("b KQkq");
    expect(momente[0]?.phase).toBe("eroeffnung");
  });

  it("liefert null für laufende Partien und Partien ohne Abenteuer", () => {
    const partie = narrenmatt();
    expect(partieergebnisAus({ ...partie, ende: null }, [], "Kim", JETZT)).toBeNull();
    expect(partieergebnisAus({ ...partie, einstellung: BASIS }, [], "Kim", JETZT)).toBeNull();
  });

  it("übernimmt Kennung, Ausgang, PGN, Halbzüge, Karten und Dauer", () => {
    const karten = [{ kennung: "fingerzeig", stufe: "leicht" as const, halbzug: 2 }];
    const ergebnis = partieergebnisAus(narrenmatt(), karten, "Kim", JETZT);
    expect(ergebnis).toMatchObject({
      kennung: "mapleFalls.ersteLektion#1",
      appPartieId: "p-test",
      ausgang: "niederlage",
      halbzuege: 4,
      sekunden: 300,
      gespielteKarten: karten,
      ruecknahmen: 0,
      momente: [],
      kipppunkt: null,
      beendet: "2026-11-07T20:00:00.000Z",
    });
    expect(ergebnis?.pgn).toContain('[White "Kim"]');
    expect(ergebnis?.pgn).toContain('[Black "Ambrose"]');
    expect(ergebnis?.pgn).toContain("Qh4#");
  });
});
