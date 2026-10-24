/** Tests der blinden Flecken (0.2.46): Zugarten erkennen, Übersehen mit festem Zufall. */
import { describe, expect, it } from "vitest";
import {
  blindeFehlerart,
  blindeWahl,
  fenNachUci,
  fleckeVon,
  uebersehenerFleck,
} from "./blindeFlecken";
import type { Variante } from "./uci";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Nach 1. e4 e5 2. Sf3 Sc6: Weiß am Zug, Sg1 ein Rückzug; Sxe5 wäre ein Schlag. */
const OFFEN = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
/** Nach 1. e4 e5 2. Sc3 Sc6: Dh5 ist ein langer Damenzug, kein Schlag möglich. */
const OHNE_SCHLAG = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3";
/** Läufer b1 gegen König h8: Lb1–h7 ist ein langer Zug über die Diagonale. */
const DIAGONALE = "7k/8/8/8/8/8/K7/1B6 w - - 0 1";
/** Turm e1, König g1, Springer e4: Te1–a1 ist seitlich; Sd6 deckt den Turm gegen Ke8 ab (Abzug). */
const ABZUG = "4k3/8/8/8/4N3/8/8/4R1K1 w - - 0 1";

function v(nummer: number, bauernWeiss: number, uci: string): Variante {
  return { nummer, wert: { art: "bauern", bauern: bauernWeiss }, zuege: [uci] };
}

describe("Blinde Flecken", () => {
  it("erkennt Rückzug, Springer rückwärts, langen Damenzug, Diagonale, Turm, Abzug, Bauer", () => {
    // Sxe5 wäre möglich, also ist Sg1 auch ein ruhiger Zug.
    expect(fleckeVon(OFFEN, "f3g1")).toEqual(["rueckzug", "springer", "ruhig"]);
    // Dh5 ist ein langer Damenzug und zielt durch f7 auf den König (Röntgen, 0.2.57).
    expect(fleckeVon(OHNE_SCHLAG, "d1h5")).toEqual(["dame", "roentgen"]);
    expect(fleckeVon(OHNE_SCHLAG, "f1c4")).toEqual([]);
    expect(fleckeVon(GRUNDSTELLUNG, "e2e4")).toEqual(["bauer"]);
    expect(fleckeVon(DIAGONALE, "b1h7")).toEqual(["diagonale"]);
    expect(fleckeVon(ABZUG, "e4d6")).toContain("abzug");
    expect(fleckeVon(ABZUG, "e1a1")).toEqual(["turm"]);
    expect(fleckeVon("unsinn", "e2e4")).toEqual([]);
  });

  it("ruhiger Zug: ohne Schlag und Schach, obwohl ein Schlag möglich wäre", () => {
    // Weiß kann exd5 schlagen; Sf3 ist dann ein ruhiger Zug, exd5 nicht.
    const mitSchlag = "rnbqkbnr/ppp2ppp/8/3pp3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3";
    expect(fleckeVon(mitSchlag, "g1f3")).toEqual(["ruhig"]);
    expect(fleckeVon(mitSchlag, "e4d5")).toEqual([]);
  });

  it("Rochaderecht ist kein möglicher Schlag, en passant ist ein Schlag (0.2.118)", () => {
    const rochade = "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1";
    expect(fleckeVon(rochade, "a1a2")).not.toContain("ruhig");
    expect(fleckeVon(rochade, "e1g1")).not.toContain("ruhig");
    const ep = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2";
    expect(fleckeVon(ep, "e1e2")).toContain("ruhig");
    expect(fleckeVon(ep, "e5d6")).not.toContain("bauer");
  });

  it("übersieht den besten Zug mit Wahrscheinlichkeit und wählt den nächsten anderer Art", () => {
    const kandidaten = [v(1, 0.5, "d1h5"), v(2, 0.3, "f1c4"), v(3, -3, "a2a3")];
    expect(blindeWahl(OHNE_SCHLAG, kandidaten, ["dame"], () => 0.2)).toEqual({
      uci: "f1c4",
      fehler: "blindDame",
      verlust: 0.2,
    });
    // Hoher Wurf: gesehen.
    expect(blindeWahl(OHNE_SCHLAG, kandidaten, ["dame"], () => 0.9)).toBeNull();
    // Anderer blinder Fleck: der beste Zug gehört nicht dazu.
    expect(blindeWahl(OHNE_SCHLAG, kandidaten, ["turm"], () => 0.2)).toBeNull();
    // Der Ersatz darf nicht mehr als eine Leichtfigur kosten.
    expect(
      blindeWahl(OHNE_SCHLAG, [v(1, 0.5, "d1h5"), v(2, -3, "a2a3")], ["dame"], () => 0.2),
    ).toBeNull();
    expect(uebersehenerFleck(OFFEN, "f3g1", ["springer", "rueckzug"])).toBe("springer");
    expect(blindeFehlerart("rueckzug")).toBe("blindRueckzug");
  });
});

describe("Blinde Flecken seit 0.2.57: Röntgen, Zwischenzug, Grundreihe, gegnerische Drohung", () => {
  it("Röntgen: Dame zielt durch den Springer auf den König; Zwischenzug: Schach statt Rettung", () => {
    // Weiß Kd1, Dh1; Schwarz Ke8, Se7: Dh1–e1 zielt durch e7 auf e8.
    expect(fleckeVon("4k3/4n3/8/8/8/8/8/3K3Q w - - 0 1", "h1e1")).toContain("roentgen");
    expect(fleckeVon("4k3/4n3/8/8/8/8/8/3K3Q w - - 0 1", "h1h2")).not.toContain("roentgen");
    // Läufer c4 hängt (Bauer d5); Th1–h8+ gibt Schach, statt den Läufer zu retten.
    expect(fleckeVon("4k3/8/8/3p4/2B5/8/8/4K2R w - - 0 1", "h1h8")).toContain("zwischenzug");
    expect(fleckeVon("4k3/8/8/3p4/2B5/8/8/4K2R w - - 0 1", "c4b3")).not.toContain("zwischenzug");
  });

  it("Grundreihe: Turm mit Schach auf die Grundreihe des Gegners", () => {
    const fen = "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1";
    expect(fleckeVon(fen, "a1a8")).toContain("grundreihe");
    expect(fleckeVon(fen, "a1a7")).not.toContain("grundreihe");
    expect(fenNachUci(fen, "a1a8")).toBe("R5k1/5ppp/8/8/8/8/8/6K1 b - - 1 1");
    expect(fenNachUci(fen, "a1a9")).toBeNull();
  });

  it("gegnerische Drohung übersehen: tappt in den Kandidaten, dessen Widerlegung ein blinder Zug ist", () => {
    // Weiß Ke1, Th1; Schwarz Ke8, La8. Bester Zug Kf1; Th7 wird von La8–e4 (lange Diagonale) widerlegt.
    const fen = "b3k3/8/8/8/8/8/8/4K2R w - - 0 1";
    const kandidaten = [
      { nummer: 1, wert: { art: "bauern" as const, bauern: 0.5 }, zuege: ["e1f1", "e8d7"] },
      { nummer: 2, wert: { art: "bauern" as const, bauern: -0.5 }, zuege: ["h1h7", "a8e4"] },
    ];
    expect(blindeWahl(fen, kandidaten, ["diagonale"], () => 0.1)).toEqual({
      uci: "h1h7",
      fehler: "blindDiagonale",
      verlust: 1,
    });
    // Nicht blind für Diagonalen, oder hoher Wurf: der beste Zug.
    expect(blindeWahl(fen, kandidaten, ["turm"], () => 0.1)).toBeNull();
    expect(blindeWahl(fen, kandidaten, ["diagonale"], () => 0.9)).toBeNull();
    // Kostet die Falle mehr als eine Leichtfigur, fällt sie weg.
    const teuer = [
      { nummer: 1, wert: { art: "bauern" as const, bauern: 0.5 }, zuege: ["e1f1", "e8d7"] },
      { nummer: 2, wert: { art: "bauern" as const, bauern: -4 }, zuege: ["h1h7", "a8e4"] },
    ];
    expect(blindeWahl(fen, teuer, ["diagonale"], () => 0.1)).toBeNull();
  });
});
