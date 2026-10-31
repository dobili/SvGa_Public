/**
 * Referenztests für k12-erfassen (Schritt 1 der Denkroutine) an Abb. 12.1, 12.2 und 4.21.
 */
import { describe, expect, it } from "vitest";
import { stellungVon, verlaufBis } from "../schach/buchabbildungen.testhilfe";
import { erfassen } from "./k12-erfassen";

function ergebnis(nummer: string) {
  const s = stellungVon(nummer);
  const v = verlaufBis(nummer);
  return erfassen(s, s.amZug, { startFen: v.startFen, zuege: v.zuege });
}

describe("k12-erfassen", () => {
  it("Abb. 12.1 (griechisches Geschenk): keine Drohung, W1 bei Schwarz, Mittelspiel", () => {
    const e = ergebnis("12.1");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Kein Verlauf bekannt: Prüfe, was der letzte Zug von Schwarz verändert hat.",
      "Keine Drohung im nächsten Zug (kein Materialgewinn, kein Matt).",
    ]);
    expect(e.befunde[1]?.zeilen).toContain("Schwarz: W1 Ungedeckt: Dame c7, Turm a8");
    expect(e.fazit).toMatch(/^Mittelspiel/);
    expect(e.fazit).toMatch(/^Mittelspiel\. Signale auf dem Brett: W1\./);
  });

  it("Abb. 12.2 (nach 2. Sg5+): letzter Zug Sg5+, im Schach, W6 Gabelgeometrie e6", () => {
    const e = ergebnis("12.2");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Letzter Zug von Weiß: Sg5+.",
      "Du stehst im Schach: Erst das Schach abwehren.",
    ]);
    expect(e.befunde[1]?.zeilen).toContain(
      "Schwarz: W6 Gabelgeometrie: Springer g5 nach e6 trifft c7 und f8",
    );
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "grau", feld: "e6", text: "W6" });
  });

  it("Abb. 4.21 (nach 7... Sgxe5): Er droht Sd3#, roter Pfeil e5–d3", () => {
    const e = ergebnis("4.21");
    expect(e.befunde[0]?.zeilen[0]).toBe("Letzter Zug von Schwarz: Sgxe5.");
    expect(e.befunde[0]?.zeilen[1]).toBe("Er droht: Sd3# setzt matt.");
    expect(e.markierungen[0]).toEqual({ typ: "pfeil", farbe: "rot", von: "e5", nach: "d3" });
    // Seit 0.3.14 (Entscheidung 11 des Autors): Beide Könige stehen noch in der Mitte und kaum
    // etwas ist getauscht, also noch Eröffnung; es ist eine Eröffnungsfalle aus Kapitel 4 (vorher,
    // nach C1.27, Mittelspiel).
    expect(e.fazit).toMatch(/^Eröffnung/);
  });
});
