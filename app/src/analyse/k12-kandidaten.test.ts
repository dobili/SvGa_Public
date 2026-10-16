/**
 * Referenztests für k12-kandidaten (Schritte 2 bis 4) an Abb. 12.1 bis 12.4, 1.15, 7.12, 7.14,
 * 8.27 und Übung 12.6; dazu die Befunde C1.28 (Matt scheidet aus) und C1.29 (Abwehrzüge im Schach).
 */
import { describe, expect, it } from "vitest";
import { naechsterBuchzug, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { kandidaten } from "./k12-kandidaten";

function ergebnis(nummer: string) {
  const s = stellungVon(nummer);
  return kandidaten(s, s.amZug, naechsterBuchzug(nummer) ?? undefined);
}

describe("k12-kandidaten", () => {
  it("Abb. 12.1: 1. Lxh7+ ist der erste Kandidat (Schach), die stärkste Antwort Kxh7", () => {
    const e = ergebnis("12.1");
    expect(e.befunde[0]?.zeilen[0]).toBe("1. Lxh7+ (Schach)");
    expect(e.befunde[1]?.zeilen[0]).toBe(
      "Auf Lxh7+: Kxh7 (Schlag mit Gewinn); Material danach −2.",
    );
    expect(e.markierungen[0]).toEqual({ typ: "pfeil", farbe: "gold", von: "d3", nach: "h7" });
    expect(e.markierungen.at(-1)).toEqual({ typ: "pfeil", farbe: "rot", von: "g8", nach: "h7" });
  });

  it("Übung 12.6: Der Buchzug g3 ist der ruhige Kandidat; Txd5 erlaubt Lxh2+", () => {
    const e = ergebnis("12.6");
    expect(e.befunde[0]?.zeilen[0]).toBe("1. g3 (ruhiger Zug, der Buchzug)");
    expect(e.befunde[0]?.zeilen[1]).toBe("2. Txd5 (Schlag)");
    expect(e.befunde[1]?.zeilen[1]).toBe("Auf Txd5: Lxh2+ (Schach); Material danach 0.");
    expect(e.befunde[2]?.zeilen[0]).toBe(
      "Gegen die stärkste Antwort schneidet g3 am besten ab (0).",
    );
  });

  it("Abb. 7.14: Schachs zuerst (Te8+, Th8+), dann Züge mit neuer Drohung", () => {
    const e = ergebnis("7.14");
    expect(e.befunde[0]?.zeilen.slice(0, 2)).toEqual(["1. Te8+ (Schach)", "2. Th8+ (Schach)"]);
    expect(e.fazit).toBe("Weiß: 4 Kandidaten gesammelt.");
  });

  it("Abb. 8.27: ohne erzwingende Züge nur der Buchzug und das Werkzeug der Phase", () => {
    const e = ergebnis("8.27");
    expect(e.befunde[0]?.zeilen[0]).toBe("1. Kc4 (ruhiger Zug, der Buchzug)");
    expect(e.befunde[0]?.zeilen[1]).toMatch(
      /^Zwingt nichts: den besten ruhigen Zug mit dem Werkzeug der Phase suchen – Die sechs Endspielregeln/,
    );
  });

  it("Abb. 12.2 (Schwarz im Schach): die vier Königszüge sind die Kandidaten, Kg6 zuerst", () => {
    const e = ergebnis("12.2");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Schwarz steht im Schach. Die Kandidaten sind alle Abwehrzüge (König wegziehen, Angreifer schlagen, dazwischenstellen), jeder mit der stärksten Antwort:",
      "1. Kg6 (Abwehr: König wegziehen, der Buchzug)",
      "2. Kh6 (Abwehr: König wegziehen)",
      "3. Kg8 (Abwehr: König wegziehen)",
      "4. Kh8 (Abwehr: König wegziehen)",
    ]);
    expect(e.befunde[1]?.zeilen).toHaveLength(4);
    expect(e.fazit).toBe("Schwarz steht im Schach: 4 Abwehrzüge als Kandidaten.");
  });

  it("Abb. 12.3 (C1.29): auf 3... f5 findet die App 4. Sxe6 mit Gabel gegen Dame und Turm", () => {
    const e = ergebnis("12.3");
    expect(e.befunde[0]?.zeilen.slice(1)).toEqual([
      "1. f5 (Abwehr: dazwischenstellen, der Buchzug)",
      "2. Kxg5 (Abwehr: König wegziehen)",
      "3. Kh5 (Abwehr: König wegziehen)",
      "4. Kh6 (Abwehr: König wegziehen)",
    ]);
    expect(e.befunde[1]?.zeilen[0]).toBe(
      "Auf f5: Sxe6 (Schlag mit Gewinn), danach Gabel gegen Dame c7 und Turm f8; Material danach +1, der König steht im Freien.",
    );
    expect(e.befunde[1]?.zeilen[1]).toBe(
      "Auf Kxg5: f4+ (Schach); Material danach +5, der König steht im Freien.",
    );
    expect(e.befunde[2]?.zeilen[0]).toBe(
      "Gegen die stärkste Antwort schneidet Kxg5 nach Material am besten ab (+5), aber der König steht danach im Freien: Rechne den Angriff zu Ende.",
    );
    // Rot wie der graue Pfeil des Buches: Nach 3... f5 folgt 4. Sxe6.
    expect(e.markierungen.at(-1)).toEqual({ typ: "pfeil", farbe: "rot", von: "g5", nach: "e6" });
  });

  it("Abb. 12.4 (C1.28): b5 scheidet aus (Dxf7#), Sf6 wehrt das Matt ab wie in Kapitel 11", () => {
    const e = ergebnis("12.4");
    expect(e.befunde[0]?.zeilen[4]).toBe("5. Sf6 (wehrt das drohende Matt ab)");
    expect(e.befunde[1]?.zeilen[2]).toBe("Auf b5: Dxf7# (Matt) – scheidet aus: Matt.");
    expect(e.befunde[2]?.zeilen[0]).toBe(
      "Gegen die stärkste Antwort schneidet Sf6 am besten ab (0).",
    );
  });

  it("Abb. 1.15: Sb4 und Sd4 scheiden aus (Dxf7#), der Buchzug g6 schneidet am besten ab", () => {
    const e = ergebnis("1.15");
    expect(e.befunde[1]?.zeilen[1]).toBe("Auf Sb4: Dxf7# (Matt) – scheidet aus: Matt.");
    expect(e.befunde[2]?.zeilen[0]).toBe(
      "Gegen die stärkste Antwort schneidet g6 am besten ab (−1).",
    );
  });

  it("Abb. 7.12: Jede Abwehr wird mit Matt beantwortet (Te8#)", () => {
    const e = ergebnis("7.12");
    expect(e.befunde[2]?.zeilen[0]).toBe(
      "Jede Abwehr wird mit Matt beantwortet: Gegen dieses Schach gibt es keine Rettung mehr.",
    );
  });
});
