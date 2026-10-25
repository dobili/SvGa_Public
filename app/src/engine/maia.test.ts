/** Tests der Maia-Vorbereitung (engine/maia.ts) ohne Netz; der Abgleich mit dem Netz steht in maia.messung.ts. */
import { describe, expect, it } from "vitest";
import {
  BRETTLAENGE,
  eloKlasse,
  gespiegelt,
  gespiegelterZug,
  halbzugAus,
  maiaEingabe,
  maiawerte,
  wahrscheinlichkeitenAus,
  type Maialaufzeit,
} from "./maia";
import { MAIA_ZUEGE } from "./maia-zuege-daten";

const ITALIENISCH = "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5";

describe("Maia: Vorbereitung wie maia2.inference", () => {
  it("Zugliste und Klassen der Wertung", () => {
    expect(MAIA_ZUEGE).toHaveLength(1880);
    expect([
      eloKlasse(400),
      eloKlasse(1099),
      eloKlasse(1100),
      eloKlasse(1550),
      eloKlasse(2000),
      eloKlasse(2800),
    ]).toEqual([0, 0, 1, 5, 10, 10]);
  });
  it("Halbzug aus der FEN", () => {
    expect(halbzugAus(ITALIENISCH)).toBe(8);
    expect(halbzugAus("4k3/8/8/8/8/8/4P3/4K3 b - - 0 1")).toBe(1);
  });
  it("spiegelt Stellung und Züge wie python-chess", () => {
    expect(gespiegelt("4k3/8/8/8/8/8/4P3/4K3 b - - 0 1")).toBe("4k3/4p3/8/8/8/8/8/4K3 w - - 0 1");
    expect(gespiegelt("r3k2r/8/8/3pP3/8/8/8/R3K2R w Kq d6 0 1")).toBe(
      "r3k2r/8/8/8/3Pp3/8/8/R3K2R b Qk d3 0 1",
    );
    expect(gespiegelterZug("e7e8q")).toBe("e2e1q");
  });
  it("legale Züge: Rochade als Königszug, Umwandlung viermal, Schwarz zurückgespiegelt", () => {
    const rochade = maiaEingabe(ITALIENISCH);
    expect(rochade?.zuege.map((z) => z.uci)).toContain("e1g1");
    expect(rochade?.brett).toHaveLength(BRETTLAENGE);
    const umwandlung = maiaEingabe("8/4P3/8/8/8/8/k7/4K3 w - - 0 60");
    expect(umwandlung?.zuege.filter((z) => z.uci.startsWith("e7e8"))).toHaveLength(4);
    const schwarz = maiaEingabe("4k3/8/8/8/8/8/4P3/4K3 b - - 0 40");
    expect(schwarz?.zuege.map((z) => z.uci).sort()).toEqual([
      "e8d7",
      "e8d8",
      "e8e7",
      "e8f7",
      "e8f8",
    ]);
  });
  it("Wahrscheinlichkeiten summieren zu 1, vor Halbzug 10 keine Werte", async () => {
    const eingabe = maiaEingabe(ITALIENISCH);
    if (!eingabe) throw new Error("keine Eingabe");
    const p = wahrscheinlichkeitenAus(new Float32Array(MAIA_ZUEGE.length), eingabe);
    expect([...p.values()].reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    const laufzeit: Maialaufzeit = {
      rechne: () => Promise.resolve(new Float32Array(MAIA_ZUEGE.length)),
    };
    expect(await maiawerte(laufzeit, ITALIENISCH, 1500, 1500, "rapid")).toBeNull();
    const spaeter = ITALIENISCH.replace(" 6 5", " 6 12");
    expect((await maiawerte(laufzeit, spaeter, 1500, 1500, "blitz"))?.size).toBe(
      eingabe.zuege.length,
    );
  });
});
