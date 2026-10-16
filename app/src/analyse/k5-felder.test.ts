/**
 * Referenztests für k5-felder an Kapitel 5, Leitfrage 1 (Abb. 5.6 bis 5.13) und Skelettbilanzen.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { felder } from "./k5-felder";

function zeilen(nummer: string, kennung: string): readonly string[] {
  const s = stellungVon(nummer);
  return felder(s, s.amZug).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k5-felder", () => {
  it("Abb. 5.8 (Najdorf, Weiß am Zug): d5 ist ein sicheres Feld, gestützt von e4, für Sc3", () => {
    expect(zeilen("5.8", "sichere")[0]).toBe(
      "d5: Kein gegnerischer Bauer kann es mehr angreifen, ein eigener Bauer stützt es (Vorposten); erreichbar für c3 und d1",
    );
    const s = stellungVon("5.8");
    expect(felder(s, "black").befunde[0]?.zeilen[0]).toMatch(/^d5: Kein eigener Bauer/);
    expect(felder(s, s.amZug).markierungen).toContainEqual({
      typ: "feld",
      farbe: "gold",
      feld: "d5",
    });
  });

  it("Abb. 5.6 (nach 1. e4 g6, Weiß am Zug): h6 ist Schwarz' Loch, f6 nicht", () => {
    const s = stellungVon("5.6");
    const schwarz = felder(s, "black");
    // h6 kann kein schwarzer Bauer mehr decken; Weiß kann es noch nicht nutzen (keine Figur hin).
    expect(schwarz.befunde[0]?.zeilen).toEqual(["Kein Loch, das der Gegner nutzen kann."]);
    expect(felder(s, "white").befunde[3]?.zeilen.join(" ")).not.toContain("f6");
  });

  it("Abb. 5.32 (Carlsbad): Springerfeld e5, solange Schwarz nicht ...f6 spielt", () => {
    expect(zeilen("5.32", "sichere")).toContain(
      "e5: Springerfeld, gestützt und frei von Bauernangriffen, solange der Bauer f7 nicht zieht",
    );
  });

  it("Abb. 5.12 und 5.13: Königsflügel ohne und mit Luftloch", () => {
    expect(zeilen("5.12", "koenig")).toEqual([
      "Grundreihe: kein Luftloch und kein Turm oder Dame auf der Grundreihe – Grundreihenmatt droht",
    ]);
    // C1.12: „Dieselbe Stellung mit dem Luftloch h3 … der König entkommt nach h2“. Schwarz hat
    // keinen Bauern, der h3 mit einem Hebel erreicht: also kein Haken.
    expect(zeilen("5.13", "koenig")).toEqual(["Luftloch h3: der König hat Luft auf h2"]);
  });

  it("Abb. 5.9: h3 ist Luftloch und zugleich Haken, denn der schwarze g-Bauer erreicht g4", () => {
    expect(zeilen("5.9", "koenig")).toEqual([
      "Luftloch h3: der König hat Luft auf h2",
      "Haken: h3 (vorgerückte Schildbauern, an denen der Gegner einhaken kann)",
    ]);
  });

  it("Abb. 11.34: der Bauer g6 ist der Haken vor dem schwarzen König", () => {
    const s = stellungVon("11.34");
    expect(felder(s, "black").befunde[2]?.zeilen[0]).toMatch(/^Haken: g6/);
  });

  it("vor der Rochade gibt es keinen Königsflügel (Abb. 5.3)", () => {
    expect(zeilen("5.3", "koenig")).toEqual([
      "Noch nicht rochiert: Der Schild entsteht erst mit der Rochade.",
    ]);
  });
});
