/**
 * Tests der ersten Trainer (AP 13 Teil 2) an allen Stellungen des Buches: Zähltrainer,
 * Schach-Röntgen-Trainer, „Koordinaten, Notation, Gangarten“. Mit fester Saat wiederholbar.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus, type Buchstellung } from "./buchstellungen";
import {
  feldrunde,
  gangartrunde,
  pruefeAusfuehrung,
  pruefeNotation,
  SONDERZUEGE,
  sonderzugaufgaben,
  zugrunde,
  type Zugaufgabe,
} from "./koordinatentrainer";
import {
  roentgenaufgabe,
  roentgenrunde,
  SCHRITTE,
  vergleicheSchritt,
} from "./roentgentrainer";
import {
  haengendeFiguren,
  haengerunde,
  pruefeFelder,
  pruefeZaehlantwort,
  zaehlfelder,
  zaehlrunde,
} from "./zaehltrainer";
import { festerZufall, mische } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));
const RUNDE = 10;

function buch(nummer: string): Buchstellung {
  return { nummer, kapitel: Number(nummer.split(".")[0]), stellung: stellungVon(nummer) };
}

describe("Zufall und Vorrat", () => {
  it("mischt mit fester Saat immer gleich und verliert nichts", () => {
    const a = mische([1, 2, 3, 4, 5], festerZufall(7));
    expect(a).toEqual(mische([1, 2, 3, 4, 5], festerZufall(7)));
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("der Vorrat enthält nur regelgerechte Stellungen, jede einmal", () => {
    expect(stellungen.length).toBeGreaterThan(300);
    expect(stellungen.every((s) => s.stellung.regeln !== null)).toBe(true);
    const bretter = stellungen.map((s) => s.stellung.fen.split(" ")[0]);
    expect(new Set(bretter).size).toBe(bretter.length);
  });
});

describe("Zähltrainer", () => {
  it("zählt d4 in Abb. 1.26 wie das Buch: drei gegen drei, Bilanz 0", () => {
    const d4 = zaehlfelder(buch("1.26")).find((a) => a.feld === "d4");
    expect(d4).toMatchObject({ angreifer: 3, verteidiger: 3, bilanz: 0 });
  });

  it("eine Runde hat zehn Aufgaben mit und ohne Gewinn", () => {
    const runde = zaehlrunde(stellungen, RUNDE, festerZufall(1));
    expect(runde).toHaveLength(RUNDE);
    expect(runde.some((a) => a.bilanz > 0)).toBe(true);
    expect(runde.some((a) => a.bilanz === 0)).toBe(true);
    expect(runde.every((a) => a.angreifer > 0 && a.verteidiger > 0)).toBe(true);
  });

  it("prüft jede der drei Zahlen", () => {
    const [a] = zaehlrunde(stellungen, 1, festerZufall(2));
    if (!a) throw new Error("keine Aufgabe");
    expect(pruefeZaehlantwort(a, a).richtig).toBe(true);
    const falsch = pruefeZaehlantwort(a, { ...a, verteidiger: a.verteidiger + 1 });
    expect(falsch).toMatchObject({ richtig: false, angreifer: true, verteidiger: false });
  });

  it("hängende Figuren: nur Figuren, die der Gegner mit Gewinn schlägt", () => {
    for (const aufgabe of haengerunde(stellungen, RUNDE, festerZufall(3))) {
      const gelesen = stellungen.find((s) => s.stellung.fen === aufgabe.fen);
      expect(gelesen).toBeDefined();
      if (gelesen) expect(aufgabe.haengend).toEqual(haengendeFiguren(gelesen.stellung));
    }
    expect(pruefeFelder(["e5"], ["e5"]).richtig).toBe(true);
    expect(pruefeFelder(["e5", "c3"], ["e5", "h7"])).toMatchObject({
      fehlend: ["c3"],
      falsch: ["h7"],
      richtig: false,
    });
  });
});

describe("Schach-Röntgen-Trainer", () => {
  it("Abb. 1.23: Sf6+ gehört zu den Schachs, Sxc5 zu den Schlägen", () => {
    const aufgabe = roentgenaufgabe(buch("1.23"));
    if (!aufgabe) throw new Error("Abb. 1.23 sollte eine Aufgabe sein");
    expect(aufgabe.schritte.schachs.verlangt).toContain("e4-f6");
    expect(aufgabe.schritte.schlaege.verlangt).toContain("e4-c5");
  });

  it("eine Runde hat Aufgaben mit zwei bis zehn Pfeilen und ohne Schach am Zug", () => {
    const runde = roentgenrunde(stellungen, RUNDE, festerZufall(4));
    expect(runde).toHaveLength(RUNDE);
    for (const aufgabe of runde) {
      const summe = SCHRITTE.reduce((n, s) => n + aufgabe.schritte[s].verlangt.length, 0);
      expect(summe).toBeGreaterThanOrEqual(2);
      expect(summe).toBeLessThanOrEqual(10);
    }
  });

  it("Schläge mit Verlust sind erlaubt, aber nicht verlangt", () => {
    const loesung = { farbe: "white" as const, verlangt: ["f3-e5"], erlaubt: ["d1-d7"] };
    expect(vergleicheSchritt(loesung, ["f3-e5", "d1-d7"]).richtig).toBe(true);
    expect(vergleicheSchritt(loesung, ["d1-d7"])).toMatchObject({ fehlend: ["f3-e5"] });
    expect(vergleicheSchritt(loesung, ["f3-e5", "a2-a3"])).toMatchObject({ falsch: ["a2-a3"] });
  });
});

describe("Koordinaten, Notation, Gangarten", () => {
  it("Felder: erst Weiß unten, dann Schwarz unten", () => {
    const runde = feldrunde(4, festerZufall(5));
    expect(runde.map((a) => a.gedreht)).toEqual([false, false, true, true]);
    expect(runde.every((a) => /^[a-h][1-8]$/.test(a.feld))).toBe(true);
  });

  it("alle Sonderzüge sind in ihrer Stellung legal, die Rochade endet auf g1 oder c1", () => {
    const aufgaben = sonderzugaufgaben();
    expect(aufgaben).toHaveLength(SONDERZUEGE.length);
    expect(aufgaben.find((a) => a.san === "O-O-O")?.nach).toBe("c1");
    expect(aufgaben.find((a) => a.san === "e8=Q+")).toBeDefined();
  });

  const sf3: Zugaufgabe = {
    nummer: null,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    san: "Nf3",
    von: "g1",
    nach: "f3",
  };

  it("Notation: deutsche Buchstaben, Schachzeichen und englische Buchstaben nur als Erinnerung", () => {
    expect(pruefeNotation(sf3, "Sf3")).toEqual({ richtig: true, schachVergessen: false, englisch: false });
    expect(pruefeNotation(sf3, "Nf3")).toEqual({ richtig: true, schachVergessen: false, englisch: true });
    expect(pruefeNotation(sf3, "f3").richtig).toBe(false);
    const schach = { ...sf3, san: "e8=Q+" };
    expect(pruefeNotation(schach, "e8=D").schachVergessen).toBe(true);
    expect(pruefeNotation(schach, "e8=D+").schachVergessen).toBe(false);
    expect(pruefeNotation({ ...sf3, san: "O-O" }, "0-0").richtig).toBe(true);
    expect(pruefeNotation({ ...sf3, san: "exf6" }, "exf6 e.p.").richtig).toBe(true);
  });

  it("Ausführen vergleicht ohne Schachzeichen", () => {
    expect(pruefeAusfuehrung({ ...sf3, san: "Qh5+" }, "Qh5+")).toBe(true);
    expect(pruefeAusfuehrung(sf3, "Nh3")).toBe(false);
  });

  it("Zugaufgaben aus dem Buch: Rochade mit dem Zielfeld des Königs", () => {
    const runde = zugrunde(stellungen, RUNDE, true, festerZufall(8));
    expect(runde).toHaveLength(RUNDE);
    for (const a of runde.filter((z) => z.san.startsWith("O-O"))) {
      expect(["g1", "c1", "g8", "c8"]).toContain(a.nach);
    }
  });

  it("Gangarten: Zielfelder sind die legalen Züge, Bauern nur ausnahmsweise", () => {
    const runde = gangartrunde(stellungen, RUNDE, festerZufall(9));
    expect(runde).toHaveLength(RUNDE);
    expect(runde.every((a) => a.ziele.length > 0)).toBe(true);
  });
});
