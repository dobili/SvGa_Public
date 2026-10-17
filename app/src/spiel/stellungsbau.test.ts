/** Tests des Stellungsaufbaus (0.2.41): setzen, entfernen, Rochaderechte, Seite am Zug. */
import { describe, expect, it } from "vitest";
import { spielbar } from "./partie";
import { amZugVon, GRUNDSTELLUNG, LEERES_BRETT, mitAmZug, setzeStein } from "./stellungsbau";

describe("Stellungsaufbau", () => {
  it("setzt und entfernt Steine; ein zweiter Tipp mit demselben Stein räumt das Feld", () => {
    const mitKoenig = setzeStein(LEERES_BRETT, "e1", "K");
    expect(mitKoenig).toBe("8/8/8/8/8/8/8/4K3 w - - 0 1");
    expect(setzeStein(mitKoenig, "e1", "K")).toBe(LEERES_BRETT);
    expect(setzeStein(mitKoenig, "e1", "q")).toBe("8/8/8/8/8/8/8/4q3 w - - 0 1");
    expect(setzeStein(mitKoenig, "e1", null)).toBe(LEERES_BRETT);
    expect(setzeStein(mitKoenig, "z9", "K")).toBe(mitKoenig);
  });

  it("Rochaderechte folgen den Steinen; Seite am Zug wählbar", () => {
    const ohneTurm = setzeStein(GRUNDSTELLUNG, "h1", null);
    expect(ohneTurm).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN1 w Qkq - 0 1");
    const schwarz = mitAmZug(ohneTurm, "black");
    expect(schwarz.split(" ")[1]).toBe("b");
    expect(amZugVon(schwarz)).toBe("black");
    expect(amZugVon("unsinn")).toBe("white");
  });

  it("beliebig viele Steine sind erlaubt; spielbar prüft erst die Partie", () => {
    let fen = LEERES_BRETT;
    for (const feld of ["a1", "b1", "c1"]) fen = setzeStein(fen, feld, "Q");
    expect(fen).toBe("8/8/8/8/8/8/8/QQQ5 w - - 0 1");
    expect(spielbar(fen)).toBe(false);
    const mitKoenigen = setzeStein(setzeStein(fen, "e1", "K"), "e8", "k");
    expect(spielbar(mitKoenigen)).toBe(true);
  });
});
