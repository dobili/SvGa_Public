/** Tests für das Urteil über den letzten Zug (Engine-Karte seit 0.2.31). */
import { describe, expect, it } from "vitest";
import { letzterZugAus, urteilUeberLetztenZug, wertNachDemZug } from "./letzterzug";
import type { Variante } from "./uci";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function variante(nummer: number, zug: string, bauern: number): Variante {
  return { nummer, wert: { art: "bauern", bauern }, zuege: [zug] };
}

describe("Urteil über den letzten Zug", () => {
  const vorher = [variante(1, "a2a3", 0.3), variante(2, "f1e2", 0.2), variante(3, "h2h3", 0.1)];

  it("bester Zug ohne Zeichen, wenn es gleichwertige andere gibt", () => {
    const urteil = urteilUeberLetztenZug(vorher, 0.3, "a2a3", true);
    expect(urteil).toMatchObject({ zeichen: null, warBester: true, besterZug: "a2a3" });
  });

  it("Zug außerhalb der Varianten: Verlust aus dem Wert danach (Konzept 8.3)", () => {
    expect(urteilUeberLetztenZug(vorher, -0.4, "f1d3", true)?.zeichen).toBe("?!");
    expect(urteilUeberLetztenZug(vorher, -1.0, "f1d3", true)?.zeichen).toBe("?");
    expect(urteilUeberLetztenZug(vorher, -3.0, "f1d3", true)?.zeichen).toBe("??");
  });

  it("Schwarz zieht: Werte aus Sicht von Weiß werden umgedreht", () => {
    const schwarz = [variante(1, "d8b6", -0.5), variante(2, "g8f6", -0.4)];
    const urteil = urteilUeberLetztenZug(schwarz, 1.0, "f8d6", false);
    expect(urteil?.verlust).toBeCloseTo(1.5);
    expect(urteil?.zeichen).toBe("?");
  });

  it("„!“ für den einzigen guten Zug", () => {
    const einziger = [variante(1, "d1h5", 2.0), variante(2, "g1f3", 0.1)];
    expect(urteilUeberLetztenZug(einziger, 2.0, "d1h5", true)?.zeichen).toBe("!");
  });

  it("Matt nach dem Zug: Endwert ohne Varianten", () => {
    const matt = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(wertNachDemZug([], matt)).toBeLessThan(0);
  });
});

describe("letzter Zug aus dem Verlauf", () => {
  it("Stellung davor und UCI, auch bei der Rochade", () => {
    expect(letzterZugAus(GRUNDSTELLUNG, ["e4", "e5", "Nf3"])?.uci).toBe("g1f3");
    const rochade = letzterZugAus(GRUNDSTELLUNG, ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "O-O"]);
    expect(rochade?.uci).toBe("e1g1");
    expect(letzterZugAus(GRUNDSTELLUNG, [])).toBeNull();
  });
});
