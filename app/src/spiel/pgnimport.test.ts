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

  it("deutsche Notation wird übersetzt, nicht als Bauernzug gelesen (Fehlertest 1.11.2026)", () => {
    const e = partieAusPgn("1. e4 e5 2. Sf3 Sc6 3. Lc4 Lc5 4. O-O Dh4 1-0", "white", "d", JETZT);
    if (!e.ok) throw new Error("nicht eingelesen");
    expect(e.partie.zuege.map((z) => z.san)).toEqual([
      "e4",
      "e5",
      "Nf3",
      "Nc6",
      "Bc4",
      "Bc5",
      "O-O",
      "Qh4",
    ]);
    const umwandlung = partieAusPgn(
      '[FEN "8/P6k/8/8/8/8/8/K7 w - - 0 1"]\n\n1. a8=D 1-0',
      "white",
      "u",
      JETZT,
    );
    if (!umwandlung.ok) throw new Error("nicht eingelesen");
    expect(umwandlung.partie.zuege[0]?.san).toBe("a8=Q");
    const figurinen = partieAusPgn("1. e4 e5 2. ♘f3 ♞c6 1-0", "white", "f", JETZT);
    if (!figurinen.ok) throw new Error("nicht eingelesen");
    expect(figurinen.partie.zuege.map((z) => z.san)).toEqual(["e4", "e5", "Nf3", "Nc6"]);
    // Unbekannte Figurenbuchstaben bleiben ein Fehler statt ein stiller Bauernzug.
    expect(partieAusPgn("1. e4 e5 2. Xf3 1-0", "white", "x", JETZT)).toMatchObject({
      ok: false,
      fehler: { art: "zug", zug: "Xf3", nummer: 2 },
    });
  });

  it("Kommentare, Uhrzeiten von chess.com, Zeichen und Varianten von Lichess fallen weg", () => {
    const pgn =
      "1. e4 {[%clk 0:02:59.9]} 1... e5 {[%clk 0:02:58]} 2. Nf3!? (2. f4 exf4) 2... Nc6 $1 1-0";
    const e = partieAusPgn(pgn, "white", "k", JETZT);
    if (!e.ok) throw new Error("nicht eingelesen");
    expect(e.partie.zuege.map((z) => z.san)).toEqual(["e4", "e5", "Nf3", "Nc6"]);
  });

  it("Schachvarianten werden abgelehnt", () => {
    const varianten = [
      '[Variant "Crazyhouse"]\n\n1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. P@d5 1-0',
      '[Variant "Atomic"]\n\n1. e4 e5 1-0',
      '[Variant "Chess960"]\n[FEN "bbqnnrkr/pppppppp/8/8/8/8/PPPPPPPP/BBQNNRKR w HFhf - 0 1"]\n\n1. e4 e5 1-0',
    ];
    for (const pgn of varianten) {
      expect(partieAusPgn(pgn, "white", "v", JETZT)).toEqual({
        ok: false,
        fehler: { art: "variante" },
      });
    }
    // „From Position“ von Lichess ist normales Schach ab eigener Stellung.
    const ab = partieAusPgn(
      '[Variant "From Position"]\n[FEN "8/P6k/8/8/8/8/8/K7 w - - 0 1"]\n\n1. a8=Q 1-0',
      "white",
      "f",
      JETZT,
    );
    expect(ab.ok).toBe(true);
  });
});
