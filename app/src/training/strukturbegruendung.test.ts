/**
 * Tests der Begründungen im Strukturerkenner und der geprüften Aufgaben (Nebenchat, 30.10.2026):
 * keine reinen Bauernstellungen, keine Stellung im Schach, Abb. 5.28 (Spannung) ist keine
 * Kettenaufgabe mehr, und passende Pläne erscheinen nie als falsche Antwort.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Strukturaufgabe, Strukturdaten } from "../daten/trainerdaten";
import { fehlendeRueckstandsbedingungen } from "../schach/bauernschwaechen";
import { feldAusName, stellungAusFen } from "../schach/stellung";
import { bauernbegruendungen } from "./strukturbegruendung";
import { planwahl } from "./strukturtrainer";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../../inhalte/de/trainer/struktur.json", import.meta.url);
const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Strukturdaten;
/** Die Stellung, die der Autor meldete: f7 ist nicht rückständig (Spanisch, Schluss in Kap. 2). */
const SPANISCH = "r4rk1/2qbbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBN1PP1/R2QR1K1 w - - 2 17";
const WIEDERHOLUNGEN = 20;

function aufgabeMit(fen: string): Strukturaufgabe {
  const vorlage = daten.aufgaben[0];
  if (!vorlage) throw new Error("keine Aufgaben");
  return { ...vorlage, fen };
}

describe("Strukturerkenner: geprüfte Aufgaben", () => {
  it("jede Aufgabe hat Figuren und keine Seite im Schach", () => {
    const schlecht = daten.aufgaben.filter((a) => {
      const s = stellungAusFen(a.fen);
      if (!s.ok) return true;
      const figuren = [...s.wert.brett.occupied].filter((f) => {
        const r = s.wert.brett.get(f)?.role;
        return r !== "pawn" && r !== "king";
      });
      return figuren.length === 0 || s.wert.regeln?.isCheck() === true;
    });
    expect(schlecht.map((a) => a.id)).toEqual([]);
  });

  it("Abb. 5.28 und 5.7 sind keine Aufgaben mehr (Spannung, Gegenbeispiel des Buches)", () => {
    const ids = daten.aufgaben.map((a) => a.id);
    expect(ids).not.toContain("struktur-b-5.28");
    expect(ids).not.toContain("struktur-b-5.7");
  });

  it("passende Pläne erscheinen nie als falsche Antwort", () => {
    for (const a of daten.aufgaben.filter((x) => (x.auchPassend ?? []).length > 0)) {
      for (let i = 0; i < WIEDERHOLUNGEN; i += 1) {
        const wahl = planwahl(a, festerZufall(i));
        expect(wahl.filter((p) => a.auchPassend?.includes(p))).toEqual([]);
      }
    }
  });
});

describe("Strukturerkenner: Begründungen", () => {
  it("f7 scheitert an allen vier Bedingungen für rückständig", () => {
    const s = stellungAusFen(SPANISCH);
    const f7 = feldAusName("f7");
    if (!s.ok || f7 === null) throw new Error("Stellung");
    expect(fehlendeRueckstandsbedingungen(s.wert.brett, f7, "black")).toEqual([
      "nachbarnVorn",
      "nichtZuDecken",
      "feldDavorKontrolliert",
      "halboffeneLinie",
    ]);
  });

  it("nennt zu f7 den Grund und zu einem leeren Feld „kein Bauer“", () => {
    const saetze = bauernbegruendungen(aufgabeMit(SPANISCH), [], ["f7", "e6"]);
    expect(saetze[0]).toContain("f7 ist nicht schwach");
    expect(saetze[0]).toContain("Deckungstest bestanden");
    expect(saetze[1]).toContain("kein Bauer");
  });

  it("nennt bei einem übersehenen Doppelbauern die Art", () => {
    const doppelt = "r1bqk2r/pppp1ppp/2n2n2/8/2P5/2P2N2/P3PPPP/R1BQKB1R w KQkq - 0 1";
    expect(bauernbegruendungen(aufgabeMit(doppelt), ["c3"], []).join(" ")).toContain("Doppelbauer");
  });
});
