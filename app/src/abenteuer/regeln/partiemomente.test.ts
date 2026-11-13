/**
 * Prüft die Partiemomente (Atmosphäre T5, regeln/partiemomente.ts) an kurzen echten Partien.
 */
import { describe, expect, it } from "vitest";
import { fenNach } from "../../spiel/zuege";
import {
  faelligerMoment,
  merkmalTrifft,
  type Partiemoment,
  type Partieverlauf,
} from "./partiemomente";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Verlauf aus SAN-Zügen; der Held spielt Weiß. */
function verlauf(zuege: readonly string[]): Partieverlauf {
  const fens = [START];
  for (const san of zuege) fens.push(fenNach(fens[fens.length - 1] ?? "", san) ?? "");
  return { fens, vomHelden: zuege.map((_, i) => i % 2 === 0), held: "white" };
}

function moment(wenn: Partiemoment["wenn"]): Partiemoment {
  return { wenn, sprecher: "ambrose", text: "moment.test.zeile" };
}

/** Narrenmatt-Weg: 1.f3 e5 2.g4 Dh4# – der Held steht im Schach. */
const NARR = ["f3", "e5", "g4", "Qh4#"];
/** Damenverlust: 1.e4 d5 2.exd5 Dxd5 3.Df3 Dxf3 – der Held stellt die Dame ein. */
const VERLUST = ["e4", "d5", "exd5", "Qxd5", "Qf3", "Qxf3"];
/** Damentausch: 1.e4 d5 2.exd5 Dxd5 3.Df3 Dxf3 4.Sxf3 – danach keine Dame mehr. */
const TAUSCH = ["e4", "d5", "exd5", "Qxd5", "Qf3", "Qxf3", "Nxf3"];

describe("merkmalTrifft", () => {
  it("erkennt Schach gegen den Helden und Schach durch den Helden", () => {
    const v = verlauf(NARR);
    expect(merkmalTrifft("schachGegen", v, 4)).toBe(true);
    expect(merkmalTrifft("schachGegeben", v, 4)).toBe(false);
    expect(merkmalTrifft("schachGegen", v, 3)).toBe(false);
  });

  it("erkennt geschlagene Figuren des Helden", () => {
    const v = verlauf(VERLUST);
    // 2.exd5: Der Held schlägt selbst; 2...Dxd5 nimmt seinen Bauern zurück.
    expect(merkmalTrifft("geschlagen:bauer", v, 3)).toBe(false);
    expect(merkmalTrifft("geschlagen:bauer", v, 4)).toBe(true);
    // 3...Dxf3: Die Dame des Helden fällt; Schwarz behält seine, also kein Damentausch.
    expect(merkmalTrifft("geschlagen:dame", v, 6)).toBe(true);
    expect(merkmalTrifft("damenTausch", v, 6)).toBe(false);
  });

  it("erkennt den Damentausch erst, wenn die letzte Dame verschwindet", () => {
    const v = verlauf(TAUSCH);
    expect(merkmalTrifft("damenTausch", v, 6)).toBe(false);
    expect(merkmalTrifft("damenTausch", v, 7)).toBe(true);
  });

  it("löst Materialrückstand nur beim Hineinfallen aus", () => {
    const v = verlauf([...VERLUST, "a3", "e6"]);
    expect(merkmalTrifft("materialMinus3", v, 6)).toBe(true);
    expect(merkmalTrifft("materialMinus3", v, 8)).toBe(false);
    expect(merkmalTrifft("unbekannt", v, 6)).toBe(false);
  });
});

describe("faelligerMoment", () => {
  it("zeigt einen Zugmoment direkt nach dem n-ten Zug des Helden", () => {
    const m = [moment({ zug: 2 })];
    expect(faelligerMoment(m, verlauf(NARR.slice(0, 3)))).toEqual({ index: 0, halbzug: 3 });
    expect(faelligerMoment(m, verlauf(NARR))).toBeNull();
    expect(faelligerMoment(m, verlauf([]))).toBeNull();
  });

  it("zeigt jeden Moment höchstens einmal, gleichzeitige verbrauchen sich", () => {
    const m = [moment({ merkmal: "schachGegen" }), moment({ merkmal: "geschlagen:dame" })];
    const anfang = ["e4", "e5", "Qh5", "Nc6", "Qxf7+", "Kxf7"];
    // 3.Dxf7+ ist Schach durch den Helden, nicht gegen ihn; 3...Kxf7 schlägt seine Dame.
    expect(faelligerMoment(m, verlauf(anfang))).toEqual({ index: 1, halbzug: 6 });
    expect(faelligerMoment(m, verlauf([...anfang, "a3"]))).toBeNull();
    // 5...Lxf2+: erstes Schach gegen den Helden, der erste Moment kommt jetzt.
    const schach = [...anfang, "a3", "Bc5", "d3", "Bxf2+"];
    expect(faelligerMoment(m, verlauf(schach))).toEqual({ index: 0, halbzug: 10 });
    // Ein zweites Schach bringt ihn nicht wieder.
    expect(faelligerMoment(m, verlauf([...schach, "Kxf2", "Qf6", "Nf3", "Qxf3+"]))).toBeNull();
  });
});

describe("verbundene Bedingungen (T11)", () => {
  const tag = (wenn: Partiemoment["wenn"]): Partiemoment => ({ ...moment(wenn), dialog: "a.b" });

  it("verlangt alle Bedingungen zugleich", () => {
    const m = [tag({ merkmal: "schachGegen", abZug: 3 })];
    // 2...Dh4#: Schach gegen den Helden, aber erst nach zwei Zügen des Helden.
    expect(faelligerMoment(m, verlauf(NARR))).toBeNull();
    expect(faelligerMoment([tag({ merkmal: "schachGegen", abZug: 2 })], verlauf(NARR))).toEqual({
      index: 0,
      halbzug: 4,
    });
  });

  it("prüft die Uhr nur im letzten Halbzug", () => {
    const m = [tag({ uhrUnter: 240 })];
    const v = verlauf(NARR.slice(0, 3));
    expect(faelligerMoment(m, v)).toBeNull();
    expect(faelligerMoment(m, { ...v, uhrHeldMs: 250_000 })).toBeNull();
    expect(faelligerMoment(m, { ...v, uhrHeldMs: 239_000 })).toEqual({ index: 0, halbzug: 3 });
  });

  it("findet den Köder nach dem Zug des Gegners", () => {
    // Weiß stellt die Grundreihe her; nach ...Dd8-e8 liegt der Köder auf d7.
    const fens = [
      "3q2k1/3p1ppp/8/8/8/8/5PPP/3R2K1 b - - 0 1",
      "4q1k1/3p1ppp/8/8/8/8/5PPP/3R2K1 w - - 1 2",
    ];
    const v = { fens, vomHelden: [false], held: "white" as const };
    expect(faelligerMoment([tag({ merkmal: "koeder" })], v)).toEqual({ index: 0, halbzug: 1 });
  });
});
