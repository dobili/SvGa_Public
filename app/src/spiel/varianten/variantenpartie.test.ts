/**
 * Tests für Variantenpartien im Kern der App (spiel/partie.ts, spiel/ergebnis.ts, spiel/zuege.ts,
 * schach/weiterspielen.ts) und den vorläufigen Gegner (ui/komponenten/partie/variantenbotzug.ts).
 */
import { describe, expect, it } from "vitest";
import { legaleZiele, spieleZug } from "../../schach/weiterspielen";
import { vorlaeufigerZug, variantenstaerke } from "../../ui/komponenten/partie/variantenbotzug";
import { leserzug, stellungen, ziehe, type Partie } from "../partie";
import { DREISCHACH_START, KOENIGSRENNEN_START } from "./standardvarianten";
import { varianteVon } from "./variante";

/** Eine Partie mit Variante ohne Züge (nur, was die Regeln brauchen). */
function partieMit(variante: string, startFen: string): Partie {
  return {
    id: "probe",
    begonnen: "2026-11-26T10:00:00.000Z",
    einstellung: { startFen, eigeneFarbe: "white", abenteuer: { kennung: "probe#1", variante } },
    zuege: [],
    ruecknahmen: 0,
    uhr: null,
    ende: null,
  } as unknown as Partie;
}

/** Spielt Züge in SAN; wirft, wenn einer nicht legal ist. */
function spiele(partie: Partie, zuege: readonly string[]): Partie {
  return zuege.reduce((p, san) => {
    const neu = ziehe(p, leserzug(san));
    if (!neu) throw new Error(`${san} nicht legal`);
    return neu;
  }, partie);
}

describe("Variantenpartie im Kern", () => {
  it("Drei-Schach: dritte Schach beendet die Partie mit dem Satz der Variante", () => {
    const p = spiele(partieMit("dreischach", DREISCHACH_START), [
      "e4",
      "e5",
      "Bc4",
      "Nc6",
      "Bxf7+",
      "Kxf7",
      "Qh5+",
      "g6",
      "Qxg6+",
    ]);
    expect(p.ende).toEqual({ art: "variante", sieger: "white", grund: "variante.dreischach.ende" });
    expect(stellungen(p)).toHaveLength(10);
  });

  it("Atomschach: ein Zug, der im gewöhnlichen Schach geht, explodiert hier anders", () => {
    const p = spiele(
      partieMit("atomschach", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"),
      ["Nf3", "e6", "Ne5", "Qh4", "Nxf7"],
    );
    expect(p.ende).toMatchObject({ art: "variante", sieger: "white" });
    // Ohne Variante wäre das ein gewöhnlicher Springerschlag, keine Partie zu Ende.
    const gewoehnlich = spiele(
      partieMit("schach960", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"),
      ["Nf3", "e6", "Ne5", "Qh4", "Nxf7"],
    );
    expect(gewoehnlich.ende).toBeNull();
  });

  it("Königsrennen: Das Brett bietet keinen Zug an, der Schach gibt", () => {
    // Im gewöhnlichen Schach dürfte Weiß hier Schach geben; im Königsrennen fehlen genau diese Züge.
    const felder = ["e2", "f2", "g2", "h2", "e1", "f1", "g1", "h1"];
    const fehlend = felder.flatMap((f) => {
      const rennen = new Set(legaleZiele(KOENIGSRENNEN_START, f, "koenigsrennen"));
      return legaleZiele(KOENIGSRENNEN_START, f)
        .filter((z) => !rennen.has(z))
        .map((z) => `${f}${z}`);
    });
    expect(fehlend.length).toBeGreaterThan(0);
    for (const zug of fehlend) {
      const versuch = spieleZug(KOENIGSRENNEN_START, zug.slice(0, 2), zug.slice(2), undefined);
      expect(versuch.art === "gespielt" && versuch.san.includes("+")).toBe(true);
    }
    expect(spieleZug(KOENIGSRENNEN_START, "h2", "h3", undefined, "koenigsrennen").art).toBe(
      "gespielt",
    );
  });

  it("Räuberschach: Schlagzwang auch am Brett", () => {
    const fen = "rnbqkbnr/p1pppppp/8/1p6/8/4P3/PPPP1PPP/RNBQKBNR w - - 0 2";
    expect(spieleZug(fen, "e3", "e4", undefined, "raeuberschach").art).toBe("ungueltig");
    expect(spieleZug(fen, "f1", "b5", undefined, "raeuberschach").art).toBe("gespielt");
  });
});

describe("Vorläufiger Gegner und Stärke", () => {
  it("nimmt einen Zug, der sofort gewinnt (König auf den Hügel)", () => {
    const v = varianteVon("koenigDerHuegel");
    if (!v) throw new Error("fehlt");
    expect(vorlaeufigerZug(v, "8/8/8/8/8/3K4/8/k7 w - - 0 1", () => 0)).toMatch(/^d3(d4|e4)$/);
  });

  it("meidet einen Zug, nach dem der Gegner sofort gewinnt", () => {
    const v = varianteVon("koenigsrennen");
    if (!v) throw new Error("fehlt");
    // Schwarz am Zug, weißer König auf g7 läuft gleich nach g8: Schwarz muss g8 decken, wo es geht.
    const zug = vorlaeufigerZug(v, "8/6K1/8/8/8/8/1r6/k7 b - - 0 1", () => 0);
    expect(zug).not.toBeNull();
    const nach = v.regeln.ziehe("8/6K1/8/8/8/8/1r6/k7 b - - 0 1", zug ?? "");
    const gewinntWeiss = v.regeln.legaleZuege(nach?.fen ?? "").some((g) => {
      const f = v.regeln.ziehe(nach?.fen ?? "", g)?.fen;
      return f ? v.regeln.ende(f)?.sieger === "weiss" : false;
    });
    expect(gewinntWeiss).toBe(false);
  });

  it("Stärke: Skill Level und Tiefe wachsen mit der Elo", () => {
    expect(variantenstaerke(500)).toEqual({ skill: 0, tiefe: 2 });
    expect(variantenstaerke(1200)).toEqual({ skill: 9, tiefe: 5 });
    expect(variantenstaerke(2500)).toEqual({ skill: 20, tiefe: 9 });
  });
});
