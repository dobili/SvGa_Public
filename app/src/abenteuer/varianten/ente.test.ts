/** Tests für Entenschach: Regeln (ente.ts) und Bot (entenbot.ts) mit Attrappe der Engine. */
import { describe, expect, it } from "vitest";
import { parseSquare } from "chessops/util";
import type { Zugbewerter } from "./botwahl";
import {
  entenFen,
  entenfelder,
  entenzuege,
  neueEntenpartie,
  setzeEnte,
  spieleEntenzug,
  zieheFigur,
} from "./ente";
import { entenbotZug, notplan, spieleBotzug } from "./entenbot";
import { alsUci, ausUci, type Freizug } from "./freistellung";

const feld = (name: string) => parseSquare(name) as number;
const zug = (uci: string) => ausUci(uci) as Freizug;
const stil = { varianten: 3, spielraumCp: 50, zufall: () => 0 };

describe("Entenschach: Regeln", () => {
  it("erst die Figur, dann die Ente; Schreibweise wie Fairy-Stockfish", () => {
    const p = zieheFigur(neueEntenpartie(), zug("e2e4"));
    expect(p.phase).toBe("ente");
    const q = setzeEnte(p, feld("e5"));
    expect(q.zuege).toEqual(["e2e4,e4e5"]);
    expect(q.stellung.amZug).toBe("black");
  });

  it("die Ente versperrt Feld und Weg", () => {
    const p = spieleEntenzug(neueEntenpartie(), "e2e4,e4e6");
    const ziele = entenzuege(p).map(alsUci);
    expect(ziele).not.toContain("e7e6");
    expect(ziele).not.toContain("e7e5");
  });

  it("die Ente muss das Feld wechseln und darf nicht auf eine Figur", () => {
    const p = zieheFigur(spieleEntenzug(neueEntenpartie(), "e2e4,e4e5"), zug("d7d6"));
    expect(entenfelder(p)).not.toContain(feld("e5"));
    expect(entenfelder(p)).not.toContain(feld("d6"));
  });

  it("wer den König schlägt, gewinnt sofort, ohne Ente", () => {
    const p = zieheFigur(neueEntenpartie("4k3/8/8/8/8/8/4q3/4K3 b - - 0 1"), zug("e2e1"));
    expect(p.ende).toEqual({ sieger: "black", grund: "koenigGeschlagen" });
  });

  it("wer keinen Zug hat, gewinnt", () => {
    const p = zieheFigur(neueEntenpartie("k7/8/1K6/8/8/8/8/8 w - - 0 1"), zug("b6b7"));
    const q = setzeEnte(p, feld("b8"));
    expect(q.ende?.sieger).not.toBe("white");
  });

  it("FEN mit der Ente als Stern für die Engine", () => {
    const p = spieleEntenzug(neueEntenpartie(), "e2e4,e4e5");
    expect(entenFen(p).split(" ")[0]).toBe("rnbqkbnr/pppppppp/8/4*3/4P3/8/PPPP1PPP/RNBQKBNR");
  });
});

describe("Entenbot", () => {
  it("nimmt einen guten Engine-Zug, der nach unseren Regeln geht", async () => {
    const bewerter: Zugbewerter = () =>
      Promise.resolve([
        { zug: "e2e4,e4e5", wert: 30 },
        { zug: "e2e5,e5e6", wert: 900 },
      ]);
    const b = await entenbotZug(neueEntenpartie(), bewerter, stil);
    expect(alsUci(b.zug)).toBe("e2e4");
    expect(b.ente).toBe(feld("e5"));
  });

  it("ohne Engine: Notplan schlägt den wertvollsten Stein und stellt die Ente vor den Angriff", () => {
    const p = neueEntenpartie("4k3/8/8/3q4/8/8/8/R3K2R w KQ - 0 1");
    const b = notplan(p, stil);
    const nach = spieleBotzug(p, b);
    expect(nach.ende).toBeNull();
    expect(nach.stellung.brett.get(feld("e1"))?.role).toBe("king");
  });

  it("schlägt einen erreichbaren König ohne Engine", async () => {
    const p = neueEntenpartie("4k3/8/8/8/8/8/4q3/4K3 b - - 0 1");
    const nie: Zugbewerter = () => Promise.reject(new Error("nicht fragen"));
    expect(alsUci((await entenbotZug(p, nie, stil)).zug)).toBe("e2e1");
  });
});
