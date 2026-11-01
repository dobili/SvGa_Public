/**
 * Tests für den Wert der Ansichten „variante“ und „variante-abfrage“ (Quellen der Stufe 4) und
 * für die Übung als Entwurf an den echten Buchdaten.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Kapitel } from "../../../daten/laden";
import { fortsetzungenAm } from "../../../schach/variationsbaum";
import { ausUebung } from "./uebungsentwurf";
import { abfrageAnsicht, abfrageAus, alsWert, wertAus, type Entwurfsquelle } from "./variantenwert";

const FEN = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";

describe("Wert der Ansicht: Quellen der Stufe 4", () => {
  const quellen: Entwurfsquelle[] = [
    { art: "eroeffnung", schluessel: "k02-a1", buch: true, praxis: false, band: 4 },
    {
      art: "eroeffnung",
      schluessel: "lichess:King's Pawn: Test",
      buch: false,
      praxis: true,
      band: 0,
    },
    { art: "uebung", kapitel: 2, id: "ueb:k2-italienisch-sg5" },
    { art: "linie", titel: "Taktik: Gabel", fen: FEN, zuege: ["Bc4", "Nf6"] },
    { art: "linie", titel: "Ohne Züge", fen: FEN, zuege: [] },
  ];
  it.each(quellen)("hin und zurück: %o", (quelle) => {
    expect(wertAus(alsWert(quelle))).toEqual({ art: "neu", quelle });
  });
});

describe("Wert der Abfrage", () => {
  it("eine Variante mit Pfad und ein Eintrag", () => {
    const einzeln = abfrageAnsicht({ art: "variante", id: "var-1-abc", pfad: ["e4", "e5"] });
    expect(abfrageAus(einzeln.bildschirm === "zusatz" ? (einzeln.wert ?? null) : null)).toEqual({
      art: "variante",
      id: "var-1-abc",
      pfad: ["e4", "e5"],
    });
    const eintrag = abfrageAnsicht({ art: "sammlung", id: "s-1" });
    expect(abfrageAus(eintrag.bildschirm === "zusatz" ? (eintrag.wert ?? null) : null)).toEqual({
      art: "sammlung",
      id: "s-1",
    });
    expect(abfrageAus("unsinn")).toBeNull();
  });
});

describe("Übung als Entwurf (erst nach dem Lösen)", () => {
  const ordner = new URL("../../../../public/daten/de/a1/", import.meta.url);
  const kapitel2 = JSON.parse(readFileSync(new URL("kap02.json", ordner), "utf8")) as Kapitel;

  it("Übung 8: Buchbaum, geöffnet an der Aufgabe, die Lösung 4... Dxg5 dahinter", () => {
    const v = ausUebung(kapitel2, "ueb:k2-italienisch-sg5", new Date());
    expect(v?.quelle).toEqual({ art: "abbildung", nummer: "2.148" });
    expect(v?.startpfad.at(-1)).toBe("Ng5");
    const weiter = v ? fortsetzungenAm(v, v.startpfad).map((k) => k.zug) : [];
    expect(weiter).toContain("Qxg5");
  });

  it("unbekannte Übung → null", () => {
    expect(ausUebung(kapitel2, "ueb:gibt-es-nicht", new Date())).toBeNull();
  });
});
