/**
 * Tests für die Engine-Folgen „Besser war …“ und „So wird bestraft“ im Baum einer Partie.
 */
import { describe, expect, it } from "vitest";
import { fortsetzungenAm, knotenAm } from "../schach/variationsbaum";
import { mitEngineFolgen, type Partieauswertung } from "./enginefolgen";
import { ausPartie } from "./variationsquellen";

const JETZT = new Date("2026-11-01T10:00:00.000Z");
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ZUEGE = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6"];
const TEXTE = { besser: "Besser war", strafe: "So wird bestraft" };

const AUSWERTUNG: Partieauswertung = {
  startFen: GRUND,
  zuege: ZUEGE,
  eigeneFarbe: "black",
  // 2. Dh5 ist ein Fehler von Weiß (Gegner, keine Folge); 3... Sf6?? ein Patzer des Lesers.
  klassen: ["bester", "bester", "fehler", "gut", "gut", "patzer"],
  beste: ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g7g6", "h5f7"],
  varianten: [[], [], [], [], [], ["g7g6", "h5f3", "g8f6"], ["h5f7"]],
};

function baum() {
  const v = ausPartie({ id: "p", startFen: GRUND, zuege: ZUEGE }, 0, "Partie", JETZT);
  if (!v) throw new Error("Partie");
  return v;
}

describe("Engine-Folgen", () => {
  it("legt am Patzer des Lesers Besser-Folge und Strafe mit Kommentar an", () => {
    const v = baum();
    const { zuege, gekuerzt } = mitEngineFolgen(v, AUSWERTUNG, TEXTE);
    const neu = { ...v, zuege };
    expect(gekuerzt).toBe(false);
    const vorher = ZUEGE.slice(0, 5);
    expect(fortsetzungenAm(neu, vorher).map((k) => k.zug)).toEqual(["Nf6", "g6"]);
    expect(knotenAm(neu, [...vorher, "g6"])).toMatchObject({
      herkunft: "engine",
      kommentar: "Besser war",
    });
    expect(knotenAm(neu, [...vorher, "g6", "Qf3", "Nf6"])?.herkunft).toBe("engine");
    expect(knotenAm(neu, [...ZUEGE, "Qxf7#"])).toMatchObject({
      herkunft: "engine",
      kommentar: "So wird bestraft",
    });
    // Am Fehler des Gegners (2. Dh5) entsteht nichts.
    expect(fortsetzungenAm(neu, ZUEGE.slice(0, 2)).map((k) => k.zug)).toEqual(["Qh5"]);
  });

  it("nimmt ohne gespeicherte Folge nur den besten Zug und zeigt beim verpassten Gewinn keine Strafe", () => {
    const v = baum();
    const ohneVarianten = {
      ...AUSWERTUNG,
      klassen: ["bester", "bester", "fehler", "gut", "gut", "verpasst"] as const,
      varianten: [],
    };
    const neu = { ...v, zuege: mitEngineFolgen(v, ohneVarianten, TEXTE).zuege };
    expect(knotenAm(neu, [...ZUEGE.slice(0, 5), "g6"])?.weiter).toEqual([]);
    expect(fortsetzungenAm(neu, ZUEGE)).toEqual([]);
  });

  it("lässt den Baum ohne Auswertung gleich", () => {
    const v = baum();
    const leer = { ...AUSWERTUNG, klassen: [], beste: [], varianten: [] };
    expect(mitEngineFolgen(v, leer, TEXTE).zuege).toBe(v.zuege);
  });
});
