/**
 * Referenztests für k12-sicherheitsblick an Abb. 12.1 (1. Lxh7+), Übung 12.6 (1. Txd5? gegen
 * 1. g3), Abb. 8.6 (Df7?? setzt patt), Abb. 12.3 (3... f5, König im Freien) und einem eigenen Zug.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { stellungAusFen } from "../schach/stellung";
import { sicherheitsblick, sicherheitswarnung } from "./k12-sicherheitsblick";

function blick(nummer: string, zug?: string) {
  const s = stellungVon(nummer);
  return sicherheitsblick(s, s.amZug, zug);
}

describe("k12-sicherheitsblick", () => {
  it("Abb. 12.1, 1. Lxh7+: Der Läufer kann geschlagen werden, der König steht sicher", () => {
    const e = blick("12.1", "Bxh7+");
    expect(e.ueberschrift).toBe("Sicherheitsblick: Lxh7+");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Der König hat danach ein freies Nachbarfeld: h1.",
      "Der Gegner hat kein Schach: sicher.",
    ]);
    expect(e.befunde[1]?.zeilen).toEqual([
      "Ja: Kxh7 gewinnt den Läufer. Opfer oder Versehen? Rechne die Antwort zu Ende.",
    ]);
    expect(e.befunde[2]?.zeilen).toEqual(["Kein Schach möglich."]);
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "rot", von: "g8", nach: "h7" });
  });

  it("Übung 12.6: 1. Txd5? erlaubt Lxh2+, 1. g3 ergibt nichts", () => {
    const e = blick("12.6", "Rxd5");
    expect(e.befunde[2]?.zeilen).toEqual(["Schach: Lxh2+ (rote Pfeile)."]);
    expect(e.fazit).toBe("Txd5 erlaubt ein Schach: rechne es zu Ende.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "rot", von: "d6", nach: "h2" });
    const g3 = blick("12.6", "g3");
    expect(g3.befunde[1]?.zeilen).toEqual([
      "Er kann schlagen (Lxg3), aber die Abtauschbilanz ist −2: gedeckt.",
    ]);
    expect(g3.fazit).toBe("g3: Der Sicherheitsblick ergibt nichts.");
  });

  it("Abb. 8.6: Df7?? setzt patt (Präzisierung aus Kapitel 10)", () => {
    const e = blick("8.6", "Qf7");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Vorsicht: Der Zug setzt den Gegner patt (Kapitel 10, Prüfung 3).",
    ]);
    expect(e.fazit).toBe("Df7?? setzt patt.");
    expect(blick("8.6", "Qg7#").fazit).toBe("Dg7# setzt matt.");
  });

  it("Abb. 12.3, 3... f5 (C1.29): König im Freien statt „3 freie Nachbarfelder“", () => {
    const e = blick("12.3", "f5");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Nein: König im Freien. Er steht ohne Bauernschild, und der Gegner greift die Nachbarfelder f6, f7 und h7 an (rote Felder).",
      "Der König hat danach 3 freie Nachbarfelder: g5, h5 und h6.",
      "Der Gegner hat ein Schach, siehe Frage 3.",
    ]);
    expect(e.fazit).toBe(
      "f5: Der König steht danach im Freien. Rechne die Schachs und Angriffe des Gegners zu Ende.",
    );
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "f7" });
  });

  it("ohne Zug ein Hinweis", () => {
    expect(blick("12.1").befunde[0]?.kennung).toBe("hinweis");
  });
});

describe("Sicherheitswarnung im Spiel", () => {
  it("Narrenmatt: 2. g4?? erlaubt Dh4#", () => {
    const s = stellungAusFen("rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2");
    if (!s.ok) throw new Error(s.fehler);
    expect(sicherheitswarnung(s.wert, "white", "g4")?.art).toBe("matt");
    expect(sicherheitswarnung(s.wert, "white", "e4")).toBeNull();
  });

  it("Abb. 12.1, 1. Lxh7+: die Figur geht verloren (Opfer oder Versehen?)", () => {
    const s = stellungVon("12.1");
    expect(sicherheitswarnung(s, s.amZug, "Bxh7+")?.art).toBe("figur");
  });

  it("Übung 12.6, 1. Txd5: nur ein Schach, keine Warnung", () => {
    const s = stellungVon("12.6");
    expect(sicherheitswarnung(s, s.amZug, "Rxd5")).toBeNull();
  });
});
