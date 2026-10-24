/** Tests des Wahlschritts (0.2.121): Übersetzung der Stellschrauben, Höchstverlust, Ziehen. */
import { describe, expect, it } from "vitest";
import { lageVon } from "./fehlerart";
import { WIE_MENSCHEN } from "./menschenwahl";
import { wahrscheinlichkeiten, type Wahlkandidat } from "./wahlmodell";
import { verschiebungAus, waehleMenschlich } from "./wahlschritt";

const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
const SC6: Wahlkandidat = { uci: "b8c6", verlust: 0, antwort: ["f1c4"], art: null };
const SF6: Wahlkandidat = {
  uci: "g8f6",
  verlust: 3,
  antwort: ["h5e5", "f8e7"],
  art: "drohungIgnoriert",
};
const G6: Wahlkandidat = { uci: "g7g6", verlust: 6, antwort: ["h5e5"], art: "drohungIgnoriert" };
const SCHRITT = { tempo: "rapid" as const, wertung: 600, temperatur: 1, stil: 0 };

function lage() {
  const l = lageVon(NACH_DH5);
  if (!l) throw new Error("Stellung");
  return l;
}

describe("Wahlschritt", () => {
  it("übersetzt Gewichte: 3 → ln 3, 0 → −∞, Fleck 3 → blinder, Stil +2 → aggressiv", () => {
    const v = verschiebungAus(
      { ...WIE_MENSCHEN, gewichte: { verfruehteDame: 3, bauernraub: 0, springer: 3 } },
      2,
    );
    expect(v.arten.verfruehteDame).toBeCloseTo(Math.log(3), 6);
    expect(v.arten.bauernraub).toBe(Number.NEGATIVE_INFINITY);
    expect(v.arten.figurHaengen).toBe(0);
    expect(v.flecken.springer).toBeCloseTo(-1, 6);
    expect(v.flecken.rueckzug).toBe(-0);
    expect(v.stil.schlag).toBeCloseTo(0.5, 6);
    expect(v.stil.rueckzug).toBeCloseTo(-0.5, 6);
  });

  it("ein dreifaches Gewicht macht die Art wahrscheinlicher, ein Höchstverlust schließt aus", () => {
    const l = lage();
    const normal = wahrscheinlichkeiten(l, NACH_DH5, [SC6, SF6], "b8c6", "rapid", 600);
    const oft = wahrscheinlichkeiten(
      l,
      NACH_DH5,
      [SC6, SF6],
      "b8c6",
      "rapid",
      600,
      verschiebungAus({ ...WIE_MENSCHEN, gewichte: { drohungIgnoriert: 3 } }, 0),
    );
    expect(oft[1]).toBeGreaterThan(normal[1] ?? 0);
    const werte = { ...WIE_MENSCHEN, hoechstverlust: { drohungIgnoriert: 1 } };
    const wahl = waehleMenschlich(l, NACH_DH5, [SC6, SF6, G6], "b8c6", SCHRITT, werte, () => 0.999);
    expect(wahl?.uci).toBe("b8c6");
  });

  it("zieht einen Fehler mit Art und Herkunft „fehler“, den besten mit „engine“", () => {
    const l = lage();
    const fehler = waehleMenschlich(
      l,
      NACH_DH5,
      [SC6, SF6, G6],
      "b8c6",
      SCHRITT,
      WIE_MENSCHEN,
      () => 0.999,
    );
    expect(fehler).toMatchObject({
      uci: "g7g6",
      quelle: "fehler",
      fehler: "drohungIgnoriert",
      verlust: 6,
      breite: 1,
    });
    const bester = waehleMenschlich(
      l,
      NACH_DH5,
      [SC6, SF6, G6],
      "b8c6",
      SCHRITT,
      WIE_MENSCHEN,
      () => 0,
    );
    expect(bester).toMatchObject({ uci: "b8c6", quelle: "engine", fehler: null });
    expect(waehleMenschlich(l, NACH_DH5, [], "b8c6", SCHRITT, WIE_MENSCHEN, () => 0)).toBeNull();
  });
});
