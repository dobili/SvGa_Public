/**
 * Tests der Endspieldatenbank König und Bauer gegen König an den Abbildungen aus Kapitel 8 und an
 * bekannten Stellungen, dazu ein Fingerabdruck der ganzen Tabelle.
 *
 * Die Zahlen des Fingerabdrucks stammen aus einem Vergleich aller 662 704 gültigen Stellungen
 * (Bauer weiß oder schwarz, beide Seiten am Zug) mit den Syzygy-Tafeln KPvK (16.10.2026, ohne
 * eine einzige Abweichung). Ändert sich die Rechnung, schlägt dieser Test an.
 */
import { Board } from "chessops/board";
import { describe, expect, it } from "vitest";
import { stellungVon } from "./buchabbildungen.testhilfe";
import { istKpk, kpkErgebnis } from "./kpk";
import { stellungAusFen } from "./stellung";

/** Ergebnis einer Abbildung. */
function ergebnisVon(nummer: string): string | null {
  const s = stellungVon(nummer);
  return kpkErgebnis(s.brett, s.amZug);
}

/** Ergebnis einer FEN. */
function ergebnisAus(fen: string): string | null {
  const s = stellungAusFen(fen);
  if (!s.ok) throw new Error(s.fehler);
  return kpkErgebnis(s.wert.brett, s.wert.amZug);
}

const FELDER = 64;
const ERSTES_BAUERNFELD = 8;
const LETZTES_BAUERNFELD = 55;

describe("KPK-Datenbank", () => {
  it.each([
    ["8.19", "remis"],
    ["8.20", "gewinn"],
    ["8.23", "gewinn"],
    ["8.24", "gewinn"],
    ["8.27", "gewinn"],
    ["8.28", "remis"],
    ["8.29", "gewinn"],
    ["8.30", "remis"],
    ["8.31", "remis"],
    ["8.35", "gewinn"],
    ["8.36", "remis"],
  ])("Abb. %s: %s wie im Buch", (nummer, erwartet) => {
    expect(ergebnisVon(nummer)).toBe(erwartet);
  });

  it("Abb. 8.19 mit Schwarz am Zug: Schwarz muss weichen, Weiß gewinnt", () => {
    expect(ergebnisAus("8/8/4k3/8/4K3/4P3/8/8 b - - 0 1")).toBe("gewinn");
  });

  it("gespiegelt: schwarzer Bauer und Bauer auf dem Königsflügel (Abb. 8.23)", () => {
    expect(ergebnisAus("8/3p2k1/8/8/8/8/5K2/8 b - - 0 1")).toBe("gewinn");
    expect(ergebnisAus("8/2k5/8/8/8/8/1K2P3/8 w - - 0 1")).toBe("gewinn");
    expect(ergebnisAus("8/2k5/8/8/8/8/1K2P3/8 b - - 0 1")).toBe("remis");
  });

  it("Randbauer: Der König in der Ecke hält remis, auch mit dem gegnerischen König davor", () => {
    expect(ergebnisAus("7k/8/6KP/8/8/8/8/8 w - - 0 1")).toBe("remis");
    expect(ergebnisAus("7k/8/8/8/8/8/7P/K7 w - - 0 1")).toBe("remis");
    // Der weiße König auf g7 beherrscht das Umwandlungsfeld: gewonnen.
    expect(ergebnisAus("8/6K1/8/k6P/8/8/8/8 b - - 0 1")).toBe("gewinn");
  });

  it("Doppelschritt: Abb. 8.63 (Bauer a2) läuft durch", () => {
    expect(ergebnisVon("8.63")).toBe("gewinn");
  });

  it("keine KPK-Stellung oder ungültig: null", () => {
    expect(ergebnisVon("8.53")).toBeNull();
    expect(istKpk(stellungVon("8.53").brett)).toBe(false);
    // Weiß am Zug, aber der schwarze König d4 steht im Schach des Bauern e3.
    expect(ergebnisAus("8/8/8/8/3k4/4P3/8/K7 w - - 0 1")).toBeNull();
  });

  it("Fingerabdruck der ganzen Tabelle (weißer Bauer) wie im Syzygy-Vergleich", () => {
    const zaehler = new Map<string, number>();
    for (let bauer = ERSTES_BAUERNFELD; bauer <= LETZTES_BAUERNFELD; bauer += 1) {
      for (let weiss = 0; weiss < FELDER; weiss += 1) {
        for (let schwarz = 0; schwarz < FELDER; schwarz += 1) {
          if (bauer === weiss || bauer === schwarz || weiss === schwarz) continue;
          const brett = Board.empty();
          brett.set(weiss, { role: "king", color: "white" });
          brett.set(schwarz, { role: "king", color: "black" });
          brett.set(bauer, { role: "pawn", color: "white" });
          for (const amZug of ["white", "black"] as const) {
            const e = kpkErgebnis(brett, amZug);
            if (e) zaehler.set(`${amZug} ${e}`, (zaehler.get(`${amZug} ${e}`) ?? 0) + 1);
          }
        }
      }
    }
    expect(Object.fromEntries(zaehler)).toEqual({
      "white gewinn": 124960,
      "white remis": 38368,
      "black gewinn": 97604,
      "black remis": 70420,
    });
  });
});
