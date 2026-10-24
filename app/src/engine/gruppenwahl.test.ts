/** Tests des Gruppenzugs (engine/gruppenwahl.ts): eine Analyse, Wahl je Bot, Abstimmung. */
import { describe, expect, it } from "vitest";
import type { Bewertung, Staerke } from "./engineDienst";
import { abstimmung, gruppenzug, type Gruppenmitglied } from "./gruppenwahl";
import { RUHIGER_VERLAUF } from "./menschlich";
import type { Spielbewerter } from "./spielbewerter";
import { stufe } from "./stufen";
import type { Variante } from "./uci";
import { STANDARDPROFIL } from "./zugwahl";

/** Abb. 1.13 (nach 2. Dh5), Schwarz am Zug. */
const FEN = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";

function variante(nummer: number, bauernWeiss: number, zuege: string[]): Variante {
  return { nummer, wert: { art: "bauern", bauern: bauernWeiss }, zuege };
}

/** Kandidaten aus Sicht von Weiß: Sc6 gut, La3 lässt den Läufer hängen, g6 verliert einen Turm. */
const KANDIDATEN = [
  variante(1, 0.3, ["b8c6", "f1c4"]),
  variante(2, 0.5, ["d7d6", "f1c4"]),
  variante(3, 3.2, ["f8a3", "b2a3"]),
  variante(4, 6.0, ["g7g6", "h5e5"]),
];

/** Eine nachgestellte Engine, die zählt, wie oft sie gefragt wird. */
function bewerter() {
  const aufrufe: { varianten: number; staerke?: Staerke }[] = [];
  const b: Spielbewerter = {
    bewerte: (_fen, _ms, anzahl, staerke, nurZuege = []) => {
      aufrufe.push({ varianten: anzahl, staerke });
      const gewaehlt =
        nurZuege.length > 0
          ? KANDIDATEN.filter((v) => nurZuege.includes(v.zuege[0] ?? ""))
          : KANDIDATEN;
      const ergebnis: Bewertung = {
        varianten: gewaehlt,
        tiefe: 10,
        knotenJeSekunde: 0,
        rechenzeitMs: 0,
        startzeitMs: 0,
        besterZug: "b8c6",
      };
      return Promise.resolve(ergebnis);
    },
  };
  return { b, aufrufe };
}

/** Zufall, der nacheinander die gegebenen Zahlen liefert, danach 0. */
function folge(...zahlen: number[]): () => number {
  let i = 0;
  return () => zahlen[i++] ?? 0;
}

function mitglied(nummer: 1 | 2 | 3): Gruppenmitglied {
  return { stufe: stufe(nummer), profil: { ...STANDARDPROFIL, tempo: "rapid" } };
}

describe("Gruppenzug", () => {
  it("ohne Mitglieder kein Zug", async () => {
    expect(await gruppenzug(bewerter().b, FEN, [], folge(), RUHIGER_VERLAUF)).toBeNull();
  });

  it("Abstimmung: Mehrheit gewinnt, bei Gleichstand der kleinste Verlust", () => {
    const zug = (uci: string, verlust: number) => ({
      uci,
      quelle: "engine" as const,
      fehler: null,
      verlust,
    });
    // Sechs verschiedene Wünsche, zwei sind sich einig: deren Zug, auch wenn er schlechter ist.
    const einig = [
      zug("a", 0),
      zug("b", 0.1),
      zug("c", 0.2),
      zug("d", 0.3),
      zug("e", 0.4),
      zug("f", 0.5),
      zug("g7g6", 6),
      zug("g7g6", 6),
    ];
    expect(abstimmung(einig)?.uci).toBe("g7g6");
    // Gleichstand 2 : 2: der Zug mit dem kleinsten Verlust unter den gleichauf liegenden.
    const patt = [zug("d7d6", 0.2), zug("d7d6", 0.2), zug("b8c6", 0), zug("b8c6", 0), zug("x", 9)];
    expect(abstimmung(patt)?.uci).toBe("b8c6");
    expect(abstimmung([])).toBeNull();
  });

  it("die Engine rechnet einmal für alle Mitglieder, die Gruppe spielt den Mehrheitszug", async () => {
    const { b, aufrufe } = bewerter();
    const gruppe = [mitglied(1), mitglied(2), mitglied(3), mitglied(1)];
    // Ein Mitglied greift (0,999) zum unwahrscheinlichsten Zug, drei zum wahrscheinlichsten: 3 : 1.
    const wahl = await gruppenzug(b, FEN, gruppe, folge(0.999, 0, 0, 0), RUHIGER_VERLAUF);
    expect(wahl).not.toBeNull();
    expect(["b8c6", "d7d6"]).toContain(wahl?.uci);
    expect(wahl?.verlust).toBeLessThan(0.5);
    // Höchstens zwei Anfragen (Kandidaten und gezielte Fehlersuche), nicht eine je Mitglied.
    expect(aufrufe.length).toBeLessThanOrEqual(2);
  });
});
