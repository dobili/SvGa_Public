/**
 * Referenztests für k6-lap an Kapitel 6, Planfrage 3 (Abb. 6.16, 6.17, 6.20) und der Tauschfrage.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { lap } from "./k6-lap";

function zeilen(nummer: string, farbe: "white" | "black", kennung: string): readonly string[] {
  return lap(stellungVon(nummer), farbe).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k6-lap", () => {
  it("Abb. 6.16 (Italienisch): Springer d2 mit b1 und b3, Ziel g3 über f1, der Turm f1 macht Platz", () => {
    const e = lap(stellungVon("6.16"), "white");
    expect(zeilen("6.16", "white", "zaehlung")[0]).toBe("Springer d2: 2 freie Felder (b1 und b3)");
    expect(zeilen("6.16", "white", "lap")[0]).toBe(
      "Springer d2 (2 freie Felder): Diese Figur verbesserst du zuerst.",
    );
    expect(zeilen("6.16", "white", "vorschlag")).toEqual([
      "Ziel g3: Von dort wirkt die Figur stärker in die gegnerische Hälfte",
      "Weg: d2–f1–g3",
      "Erst Platz machen: Turm f1",
    ]);
    expect(e.fazit).toBe("Verbessere Springer d2: nach g3 über f1.");
    expect(e.markierungen).toEqual([
      { typ: "feld", farbe: "rot", feld: "d2" },
      { typ: "pfeil", farbe: "gold", von: "d2", nach: "f1" },
      { typ: "pfeil", farbe: "gold", von: "f1", nach: "g3" },
      { typ: "feld", farbe: "grau", feld: "f1" },
    ]);
  });

  it("Abb. 6.20 (Königsindisch): die Läufer c1 und c8 stehen noch zu Hause", () => {
    expect(zeilen("6.20", "white", "zaehlung")[0]).toContain("Läufer c1: 5 freie Felder");
    expect(zeilen("6.20", "white", "zaehlung")[0]).toContain("noch zu Hause");
    // Das Buch spielt 13. Le3; die App schlägt e3 vor.
    expect(lap(stellungVon("6.20"), "white").fazit).toBe("Verbessere Läufer c1: nach e3.");
    expect(zeilen("6.20", "black", "lap")[0]).toContain("Läufer c8");
  });

  it("Abb. 6.17: der Turm e8 gehört auf die offene d-Linie", () => {
    expect(zeilen("6.17", "black", "vorschlag")[0]).toBe("Ziel d8: die d-Linie");
    // Weiß hat beide Türme schon auf der d-Linie verdoppelt.
    expect(zeilen("6.17", "white", "vorschlag")[0]).toContain("steht gut");
  });

  // C1.15: „Erst die Linie besetzen, dann verdoppeln, dann eindringen“; es folgt 1. Td7 (Abb. 6.18).
  it("Abb. 6.17: Der vordere Turm d2 dringt nach d7 ein, der Turm d1 deckt ihn", () => {
    const e = lap(stellungVon("6.17"), "white");
    expect(zeilen("6.17", "white", "eindringen")).toEqual([
      "Die Türme stehen verdoppelt auf der offenen d-Linie: Turm d2 dringt nach d7 auf die 7. Reihe ein, Turm d1 deckt ihn",
    ]);
    expect(e.fazit).toBe(
      "Dringe mit Turm d2 nach d7 ein: Die Türme stehen verdoppelt auf der offenen d-Linie, d7 ist sicher.",
    );
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "d2", nach: "d7" });
    // Schwarz hat seine Türme noch nicht verdoppelt: kein Eindringen.
    expect(zeilen("6.17", "black", "eindringen")).toEqual([]);
  });

  // C1.16: Im Schach kein Planvorschlag (Abb. 6.32: nach 31. Sxf7+ war „Springer a5 nach e4“ falsch).
  it("Abb. 6.32: Schwarz steht im Schach, also nur der Hinweis", () => {
    const e = lap(stellungVon("6.32"), "black");
    expect(e.befunde.map((b) => b.kennung)).toEqual(["unruhe"]);
    expect(e.fazit).toBe(
      "Schwarz steht im Schach: Erst das Schach beantworten; Planfragen gelten in ruhigen Stellungen.",
    );
    expect(e.markierungen).toEqual([]);
  });

  it("Abb. 6.23: Die Dame d8 ist angegriffen (Springer e6), also erst die Drohung", () => {
    expect(lap(stellungVon("6.23"), "black").fazit).toBe(
      "Die Dame von Schwarz ist angegriffen: Erst die Drohung beantworten; Planfragen gelten in ruhigen Stellungen.",
    );
  });

  it("Tauschfrage: die aktivste Figur des Gegners und die Raumregel (Abb. 6.20)", () => {
    expect(zeilen("6.20", "white", "tausch")).toEqual([
      "Aktivste Figur des Gegners: Springer f6 (6 Felder). Kannst du genau sie abtauschen?",
      "Du hast mehr Raum: Behalte deine Figuren.",
    ]);
  });

  it("Lehrbild ohne Figuren (Abb. 6.8): nur der Hinweis", () => {
    expect(lap(stellungVon("6.8"), "white").fazit).toBe("Keine Figur außer König und Bauern.");
  });
});
