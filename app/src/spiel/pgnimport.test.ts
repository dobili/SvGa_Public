/** Tests des PGN-Imports (R23): Züge, Ende aus Stellung und Kopfzeilen, Namen, Datum, Fehler. */
import { describe, expect, it } from "vitest";
import { ergebnisFuerLeser } from "./partienfilter";
import { partieAusPgn } from "./pgnimport";

const JETZT = new Date("2026-10-19T20:00:00.000Z");
const NARRENMATT = `[White "Anna"]
[Black "Ben"]
[Date "2026.10.18"]
[Result "0-1"]

1. f3 e5 2. g4 Qh4# 0-1`;

describe("partieAusPgn", () => {
  it("Narrenmatt: vier Halbzüge, Matt erkannt, Namen und Datum aus den Kopfzeilen", () => {
    const e = partieAusPgn(NARRENMATT, "white", "i-1", JETZT);
    if (!e.ok) throw new Error("nicht eingelesen");
    expect(e.partie.zuege.map((z) => z.san)).toEqual(["f3", "e5", "g4", "Qh4#"]);
    expect(e.partie.ende).toEqual({ art: "matt", sieger: "black" });
    expect(e.partie.einstellung.importiert).toEqual({ weiss: "Anna", schwarz: "Ben" });
    expect(e.partie.einstellung.gewertet).toBe(false);
    expect(e.partie.begonnen.startsWith("2026-10-18")).toBe(true);
    expect(ergebnisFuerLeser(e.partie)).toBe("verloren");
  });

  it("Ergebnis aus den Kopfzeilen: Zeit, Aufgabe, Remis durch Vereinbarung", () => {
    const zeit = partieAusPgn(
      '[Result "1-0"]\n[Termination "Time forfeit"]\n\n1. e4 e5 1-0',
      "black",
      "i-2",
      JETZT,
    );
    expect(zeit.ok && zeit.partie.ende).toEqual({ art: "zeit", sieger: "white" });
    const aufgabe = partieAusPgn('[Result "0-1"]\n\n1. d4 d5 0-1', "white", "i-3", JETZT);
    expect(aufgabe.ok && aufgabe.partie.ende).toEqual({ art: "aufgabe", sieger: "black" });
    const remis = partieAusPgn('[Result "1/2-1/2"]\n\n1. e4 e5 1/2-1/2', "white", "i-4", JETZT);
    expect(remis.ok && remis.partie.ende).toEqual({ art: "vereinbart" });
  });

  it("lehnt leere, falsche und unbeendete Partien mit Grund ab", () => {
    expect(partieAusPgn("  ", "white", "x", JETZT)).toEqual({ ok: false, fehler: { art: "leer" } });
    expect(partieAusPgn("1. e4 e5 2. Ke3 *", "white", "x", JETZT)).toMatchObject({
      ok: false,
      fehler: { art: "zug", zug: "Ke3", nummer: 2 },
    });
    expect(partieAusPgn("1. e4 e5 *", "white", "x", JETZT)).toMatchObject({
      ok: false,
      fehler: { art: "ohneErgebnis" },
    });
  });

  it("ohne Kopfzeilen: Platzhalter-Namen, Datum jetzt", () => {
    const e = partieAusPgn("1. e4 e5 1-0", "white", "i-5", JETZT);
    if (!e.ok) throw new Error("nicht eingelesen");
    expect(e.partie.einstellung.importiert).toEqual({ weiss: "?", schwarz: "?" });
    expect(e.partie.begonnen).toBe(JETZT.toISOString());
  });
});
