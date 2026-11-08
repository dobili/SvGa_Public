// Werkzeugkarten und Nullzug (docs/spiel/11, K1, K2, K6), ohne Engine.
import { describe, expect, it } from "vitest";
import { stellungAusFen } from "../../schach/stellung";
import { mitGegnerAmZug, waehleZaehlfeld, werkzeugkarte } from "./kartenwirkungen";

/** Weiß: Springer e5, angegriffen vom Bauern d6 und der Dame e7, nicht gedeckt. */
const HAENGT = "4k3/4q3/3p4/4N3/8/8/8/4K3 w - - 0 1";

describe("Werkzeugkarten", () => {
  it("Abzählen wählt die eigene Figur mit den meisten Angreifern", () => {
    const stellung = stellungAusFen(HAENGT);
    if (!stellung.ok) throw new Error("FEN");
    expect(waehleZaehlfeld(stellung.wert, "white")).toBe("e5");
    const anzeige = werkzeugkarte(HAENGT, "k1-zaehlen", "white");
    expect(anzeige.markierungen.length).toBeGreaterThan(0);
    expect(anzeige.text.length).toBeGreaterThan(0);
  });

  it("jede Werkzeugkarte aus karten.json liefert ein Ergebnis", async () => {
    const { default: datei } = await import("../../../../inhalte/abenteuer/karten.json");
    const start = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
    for (const karte of datei.karten) {
      const wirkung = karte.wirkung as { art: string; werkzeug?: string };
      if (wirkung.art !== "werkzeug" || !wirkung.werkzeug) continue;
      expect(werkzeugkarte(start, wirkung.werkzeug, "black").text, karte.kennung).not.toBe("");
    }
  });
});

describe("Was droht? (Nullzug)", () => {
  it("dreht das Zugrecht und löscht en passant", () => {
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2";
    expect(mitGegnerAmZug(fen)).toBe(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
    );
  });

  it("im Schach gibt es keinen Nullzug", () => {
    expect(mitGegnerAmZug("4k3/8/8/8/8/8/4r3/4K3 w - - 0 1")).toBeNull();
  });
});
