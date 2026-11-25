/**
 * Tests für die Variantenschnittstelle: Anmelden, Regeln aus chessops (Zuglegalität, Ende je
 * Variante), Startstellungen, Zähler und Brettfelder (Auftrag des Hauptchats, 26.11.2026).
 */
import { describe, expect, it } from "vitest";
import { KOENIGSRENNEN_START, schachgebote } from "./standardvarianten";
import { alleVarianten, registriereVariante, varianteVon } from "./variante";

function regeln(kennung: string) {
  const v = varianteVon(kennung);
  if (!v) throw new Error(`Variante ${kennung} fehlt`);
  return v.regeln;
}

/** Spielt Züge in UCI ab und gibt die letzte FEN zurück. */
function spiele(kennung: string, start: string, zuege: readonly string[]): string {
  let fen = start;
  for (const uci of zuege) {
    const zug = regeln(kennung).ziehe(fen, uci);
    if (!zug) throw new Error(`${uci} nicht legal in ${fen}`);
    fen = zug.fen;
  }
  return fen;
}

describe("Anmelden", () => {
  it("kennt die acht mitgebrachten Varianten, doppelt anmelden ist ein Fehler", () => {
    expect(alleVarianten().map((v) => v.kennung)).toEqual(
      expect.arrayContaining([
        "blind",
        "gehoer",
        "schach960",
        "dreischach",
        "atomschach",
        "koenigDerHuegel",
        "koenigsrennen",
        "raeuberschach",
      ]),
    );
    const v = varianteVon("atomschach");
    expect(() => v && registriereVariante(v)).toThrow(/schon angemeldet/);
    expect(varianteVon("drache")).toBeUndefined();
  });
});

describe("Regeln und Ende", () => {
  it("Drei-Schach: das dritte Schachgebot gewinnt, der Zähler zählt mit", () => {
    const start = varianteVon("dreischach")?.startstellung?.(Math.random) ?? "";
    // 1.e4 e5 2.Lc4 Sc6 3.Lxf7+ Kxf7 4.Dh5+ g6 5.Dxg6+ … dreimal Schach durch Weiß
    const fen = spiele("dreischach", start, [
      "e2e4",
      "e7e5",
      "f1c4",
      "b8c6",
      "c4f7",
      "e8f7",
      "d1h5",
      "g7g6",
      "h5g6",
    ]);
    expect(schachgebote(fen)).toEqual({ weiss: 3, schwarz: 0 });
    expect(regeln("dreischach").ende(fen)).toEqual({
      sieger: "weiss",
      grund: "variante.dreischach.ende",
    });
  });

  it("Atomschach: Schlagen lässt die Figuren rundum explodieren, der König fliegt mit", () => {
    const fen = spiele("atomschach", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [
      "g1f3",
      "e7e6",
      "f3e5",
      "d8h4",
      "e5f7",
    ]);
    // Sxf7 explodiert neben e8: Der schwarze König ist weg.
    expect(regeln("atomschach").ende(fen)?.sieger).toBe("weiss");
  });

  it("König der Hügel: König auf e4 gewinnt; Felder des Hügels markiert", () => {
    // Der König läuft bis d3: noch nicht auf dem Hügel.
    const fen = spiele(
      "koenigDerHuegel",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      ["e2e4", "e7e5", "e1e2", "d7d6", "e2e3", "a7a6", "f2f3", "a6a5", "e3d3", "a5a4"],
    );
    expect(regeln("koenigDerHuegel").ende(fen)).toBeNull();
    const ziel = spiele("koenigDerHuegel", "8/8/8/8/8/3K4/8/k7 w - - 0 1", ["d3e4"]);
    expect(regeln("koenigDerHuegel").ende(ziel)).toEqual({
      sieger: "weiss",
      grund: "variante.koenigDerHuegel.ende",
    });
    expect(varianteVon("koenigDerHuegel")?.brett?.felder?.("")).toHaveLength(4);
  });

  it("Königsrennen: Start ohne Schach, Ankunft auf der achten Reihe gewinnt", () => {
    const zuege = regeln("koenigsrennen").legaleZuege(KOENIGSRENNEN_START);
    expect(zuege.length).toBe(21);
    const ziel = "8/7K/8/8/8/8/k7/8 w - - 0 1";
    const fen = spiele("koenigsrennen", ziel, ["h7h8"]);
    expect(regeln("koenigsrennen").ende(fen)?.grund).toBe("variante.koenigsrennen.ende");
  });

  it("Räuberschach: Schlagzwang, wer alles verliert, gewinnt", () => {
    const fen = spiele("raeuberschach", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1", [
      "e2e3",
      "b7b5",
    ]);
    // Weiß muss schlagen: Lxb5 ist der einzige Zug.
    expect(regeln("raeuberschach").legaleZuege(fen)).toEqual(["f1b5"]);
    expect(regeln("raeuberschach").ende("8/8/8/8/8/8/8/k7 w - - 0 1")?.sieger).toBe("weiss");
  });

  it("Schach960: ausgeloste Startstellung, gewöhnliche Regeln; Blind ohne Figuren", () => {
    const fen = varianteVon("schach960")?.startstellung?.(() => 0.5) ?? "";
    expect(regeln("schach960").legaleZuege(fen).length).toBeGreaterThan(15);
    expect(varianteVon("blind")?.brett?.sicht).toBe("keine_figuren");
    expect(regeln("schach960").ziehe(fen, "a1a8")).toBeNull();
  });
});

describe("Engine-Befehle", () => {
  it("eingebaute Varianten nur mit UCI_Variant, eigene mit Variantendatei davor", async () => {
    const { enginevorbereitung, VARIANTENDATEI } = await import("./enginebefehle");
    expect(enginevorbereitung({ engine: "fairy", uciVariante: "3check" })).toEqual({
      dateien: [],
      befehle: ["setoption name UCI_Variant value 3check"],
    });
    const eigen = enginevorbereitung({
      engine: "fairy",
      uciVariante: "drache",
      ini: "[drache:chess]\ncustomPiece1 = d:QN\n",
    });
    expect(eigen.dateien).toEqual([
      { pfad: VARIANTENDATEI, inhalt: "[drache:chess]\ncustomPiece1 = d:QN\n" },
    ]);
    expect(eigen.befehle).toEqual([
      `setoption name VariantPath value ${VARIANTENDATEI}`,
      "setoption name UCI_Variant value drache",
    ]);
    expect(
      enginevorbereitung(varianteVon("schach960")?.engine ?? { engine: "stockfish" }).befehle,
    ).toEqual(["setoption name UCI_Chess960 value true"]);
  });
});
