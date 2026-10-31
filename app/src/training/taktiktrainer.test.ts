/**
 * Tests des Taktiktrainers an allen Aufgaben aus inhalte/de/trainer/taktik.json: Jede Lösung ist
 * spielbar und führt Zug für Zug zu „gelöst“, die Runden passen zu Thema und Stufe.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Taktikdaten } from "../daten/trainerdaten";
import {
  alsZugaufgabe,
  anzahlJeThema,
  pruefeTaktikzug,
  taktikrunde,
  vorgewaehltesThema,
} from "./taktiktrainer";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../../inhalte/de/trainer/taktik.json", import.meta.url);
const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Taktikdaten;
const RUNDE = 8;

/** Spielt die Lösung einer Aufgabe so, wie der Leser sie zieht. */
function loese(aufgabe: (typeof daten.aufgaben)[number]): string {
  const zugaufgabe = alsZugaufgabe(aufgabe);
  if (!zugaufgabe) return "nicht spielbar";
  const bisher: string[] = [];
  const linie = zugaufgabe.linien[0] ?? [];
  for (let i = 0; i < linie.length; i += 2) {
    const ergebnis = pruefeTaktikzug(zugaufgabe, bisher, linie[i] ?? "");
    if (ergebnis.art !== "weiter") return ergebnis.art;
    bisher.push(linie[i] ?? "", ergebnis.antwort);
  }
  return "offen";
}

describe("Taktiktrainer", () => {
  it("jede Lösung ist spielbar und endet mit „gelöst“", () => {
    const nichtGeloest = daten.aufgaben.filter((a) => loese(a) !== "geloest").map((a) => a.id);
    expect(nichtGeloest).toEqual([]);
  });

  it("Abb. 7.6: Spieß Th1+ gewinnt den Turm a1; ein anderer Zug ist falsch", () => {
    const aufgabe = daten.aufgaben.find((a) => a.id === "taktik-b-7.6");
    const zugaufgabe = aufgabe ? alsZugaufgabe(aufgabe) : null;
    if (!zugaufgabe) throw new Error("taktik-b-7.6 fehlt");
    expect(pruefeTaktikzug(zugaufgabe, [], "Rh1+")).toEqual({ art: "weiter", antwort: "Kd2" });
    expect(pruefeTaktikzug(zugaufgabe, [], "Rh2").art).toBe("falsch");
  });

  it("ein Matt löst die Aufgabe immer", () => {
    const zugaufgabe = { art: "zug" as const, fen: "", linien: [["Qd8+", "Kxd8"]] };
    expect(pruefeTaktikzug(zugaufgabe, [], "Qh7#").art).toBe("geloest");
  });

  it("Runden passen zum Thema und liegen nahe an der Stufe", () => {
    const anzahl = anzahlJeThema(daten.aufgaben);
    expect(anzahl.get("gemischt")).toBe(daten.aufgaben.length);
    expect(anzahl.get("spiess")).toBeGreaterThan(RUNDE);
    const spiess = taktikrunde(
      daten.aufgaben,
      { thema: "spiess", stufe: 2 },
      RUNDE,
      festerZufall(1),
    );
    expect(spiess).toHaveLength(RUNDE);
    expect(spiess.every((a) => a.motiv === "spiess")).toBe(true);
    expect(spiess.every((a) => Math.abs(a.schwierigkeit - 2) <= 1)).toBe(true);
    const matt = taktikrunde(
      daten.aufgaben,
      { thema: "mattbilder", stufe: null },
      RUNDE,
      festerZufall(2),
    );
    expect(matt.every((a) => a.mattbild !== null)).toBe(true);
  });
});

describe("vorgewaehltesThema", () => {
  const anzahl = new Map([
    ["gemischt", 50],
    ["fesselung", 12],
    ["umwandlung", 0],
  ] as const);

  it("wählt das Motiv, mit dem der Trainer geöffnet wurde", () => {
    expect(vorgewaehltesThema("fesselung", anzahl)).toBe("fesselung");
  });

  it("bleibt bei „gemischt“ ohne Thema, bei unbekanntem Thema oder ohne Aufgaben", () => {
    expect(vorgewaehltesThema(null, anzahl)).toBe("gemischt");
    expect(vorgewaehltesThema("gabel", anzahl)).toBe("gemischt");
    expect(vorgewaehltesThema("umwandlung", anzahl)).toBe("gemischt");
  });
});
