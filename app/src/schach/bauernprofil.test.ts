/**
 * Tests des Bauernprofils und der Bauernschwächen an Kapitel 5.
 */
import { describe, expect, it } from "vitest";
import { bauernprofil } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import { feld, stellungAus, stellungVon } from "./buchabbildungen.testhilfe";
import { feldname } from "./stellung";

const namen = (liste: readonly number[]) => liste.map(feldname);

describe("bauernprofil", () => {
  it("Abb. 5.17: Weiß hat drei Bauerninseln (a–b, d, f–h), Schwarz zwei", () => {
    const { brett } = stellungVon("5.17");
    expect(bauernprofil(brett, "white").inseln).toEqual([[0, 1], [3], [5, 6, 7]]);
    expect(bauernprofil(brett, "black").inseln).toHaveLength(2);
  });

  it("Abb. 5.6: nach ...g6 kann kein schwarzer Bauer h6 mehr decken, f6 noch (e7)", () => {
    const loecher = namen(bauernprofil(stellungVon("5.6").brett, "black").loecher);
    expect(loecher).toContain("h6");
    expect(loecher).not.toContain("f6");
  });

  it("Abb. 11.43: d4 auf der eigenen 4. Reihe ist ein starkes Feld für Weiß (P3: 4. bis 6. Reihe)", () => {
    expect(namen(bauernprofil(stellungVon("11.43").brett, "white").starkeFelder)).toContain("d4");
  });

  it("rückständig nur, wenn der Gegner das Feld davor mit einem Bauern hält (P3)", () => {
    // Weiß d3 hinter c4 und e4; Schwarz hält d4 mit c5 und e5, die d-Linie ist halboffen: R.
    const gehalten = stellungAus("4k3/8/8/2p1p3/2P1P3/3P4/8/4K3 w - - 0 1").brett;
    expect(namen(bauernschwaechen(gehalten, "white").rueckstaendige)).toEqual(["d3"]);
    // Kein schwarzer Bauer hält d4: d3 kann aufrücken, fällt nur durch den Deckungstest.
    const frei = stellungAus("4k3/p7/8/8/2P1P3/3P4/8/4K3 w - - 0 1").brett;
    expect(bauernschwaechen(frei, "white").rueckstaendige).toEqual([]);
    expect(
      bauernschwaechen(frei, "white").deckungstest.find((d) => feldname(d.feld) === "d3")?.gesund,
    ).toBe(false);
    // Ein schwarzer Bauer steht d3 auf d4 direkt gegenüber: blockiert, kein Ziel auf der Linie.
    const blockiert = stellungAus("4k3/8/8/4p3/2PpP3/3P4/8/4K3 w - - 0 1").brett;
    expect(bauernschwaechen(blockiert, "white").rueckstaendige).toEqual([]);
  });

  it("Abb. 5.8: das Loch d5 ist ein starkes Feld für Weiß; d6 ist rückständig", () => {
    const { brett } = stellungVon("5.8");
    expect(namen(bauernprofil(brett, "white").starkeFelder)).toContain("d5");
    expect(namen(bauernprofil(brett, "black").loecher)).toContain("d5");
    expect(namen(bauernschwaechen(brett, "black").rueckstaendige)).toEqual(["d6"]);
  });

  it("Abb. 5.25: weiße Kette d4–e5 ohne Stütze, schwarze Kette e6–d5 mit Stütze f7", () => {
    const { brett } = stellungVon("5.25");
    const weiss = bauernprofil(brett, "white").ketten;
    expect(weiss.map((k) => namen(k.glieder))).toEqual([["d4", "e5"]]);
    expect(weiss[0] && namen(weiss[0].basis)).toEqual(["d4"]);
    expect(weiss[0] && feldname(weiss[0].spitze)).toBe("e5");
    expect(weiss[0]?.stuetzen).toEqual([]);
    const schwarz = bauernprofil(brett, "black").ketten;
    expect(schwarz.map((k) => namen(k.glieder))).toEqual([["e6", "d5"]]);
    expect(schwarz[0] && namen(schwarz[0].stuetzen)).toEqual(["f7"]);
    // Deckungstest: d4 fällt durch (die Stütze c3 ist weg), e6 besteht (f7).
    const test = bauernschwaechen(brett, "white").deckungstest;
    expect(test.find((t) => t.feld === feld("d4"))?.gesund).toBe(false);
  });

  it("Abb. 1.26: mit dem Bauern c3 ist die Basis d4 gestützt und besteht den Deckungstest", () => {
    const { brett } = stellungVon("1.26");
    const kette = bauernprofil(brett, "white").ketten[0];
    expect(kette && namen(kette.stuetzen)).toEqual(["c3"]);
    expect(
      bauernschwaechen(brett, "white").deckungstest.find((t) => t.feld === feld("d4"))?.gesund,
    ).toBe(true);
  });

  it("offene und halboffene Linien: Abb. 5.17 (c-Linie offen, e-Linie halboffen für Weiß)", () => {
    const { brett } = stellungVon("5.17");
    const weiss = bauernprofil(brett, "white");
    expect(weiss.halboffeneLinien).toEqual([4]);
    expect(weiss.offeneLinien).toEqual([2]);
  });

  it("Grundstellung: Duos nebeneinander, d2–e2 im Zentrum", () => {
    const { brett } = stellungAus("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const duos = bauernprofil(brett, "white").duos;
    expect(duos).toHaveLength(7);
    expect(duos.filter((d) => d.imZentrum).map((d) => namen(d.felder))).toEqual([["d2", "e2"]]);
  });

  it("Abb. 5.29: reine Mehrheit 3 gegen 2 am Damenflügel, Kandidat a2", () => {
    const mehrheiten = bauernprofil(stellungVon("5.29").brett, "white").mehrheiten;
    expect(mehrheiten).toEqual([
      { fluegel: "damen", eigene: 3, gegnerische: 2, kandidat: feld("a2") },
    ]);
  });

  it("Abb. 5.30: Weiß 4 gegen 3 am Königsflügel mit Kandidat e5, Schwarz ohne Kandidat", () => {
    const { brett } = stellungVon("5.30");
    const weiss = bauernprofil(brett, "white").mehrheiten;
    expect(weiss).toEqual([
      { fluegel: "koenigs", eigene: 4, gegnerische: 3, kandidat: feld("e5") },
    ]);
    const schwarz = bauernprofil(brett, "black").mehrheiten;
    expect(schwarz).toEqual([{ fluegel: "damen", eigene: 4, gegnerische: 3, kandidat: null }]);
  });
});

describe("bauernschwaechen", () => {
  it("Abb. 5.15: Doppelbauern c7 und c6", () => {
    const schwarz = bauernschwaechen(stellungVon("5.15").brett, "black");
    expect(schwarz.doppelbauern.map(namen)).toEqual([["c7", "c6"]]);
  });

  it("Abb. 5.17: der Bauer d4 ist ein Isolani und eine Insel für sich", () => {
    expect(namen(bauernschwaechen(stellungVon("5.17").brett, "white").isolani)).toEqual(["d4"]);
  });

  it("Abb. 5.22: hängende Bauern c5 und d5", () => {
    const schwarz = bauernschwaechen(stellungVon("5.22").brett, "black");
    expect(schwarz.haengende.map(namen)).toEqual([["c5", "d5"]]);
  });

  it("Abb. 5.31: der Freibauer d5, nicht gedeckt", () => {
    const weiss = bauernschwaechen(stellungVon("5.31").brett, "white");
    expect(weiss.freibauern.map((f) => [feldname(f.feld), f.gedeckt])).toEqual([["d5", false]]);
  });

  it("Deckungstest: a7 besteht ihn (nach ...a6 deckt b7)", () => {
    const schwarz = bauernschwaechen(stellungVon("5.31").brett, "black");
    expect(schwarz.deckungstest.find((t) => t.feld === feld("a7"))?.gesund).toBe(true);
  });
});
