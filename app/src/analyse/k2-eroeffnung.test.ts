/**
 * Referenztests für das Werkzeug k2-eroeffnung mit dem Index aus den Buchvarianten der Kapitel 2
 * und 3 (Stellungsvergleich, auch nach Zugumstellung; Abschnitt 2.12).
 */
import { readFileSync } from "node:fs";
import { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { eroeffnungsnamenAus } from "../schach/eroeffnungsnamen";
import { eroeffnung, KURZFASSUNGEN } from "./k2-eroeffnung";
import type { Werkzeugergebnis } from "./werkzeug";

const INDEX = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);

/** Die Stellung nach einer Zugfolge ab der Grundstellung (englische Kurznotation). */
function nach(...zuege: string[]) {
  const pos = Chess.default();
  for (const san of zuege) {
    const zug = parseSan(pos, san);
    if (!zug) throw new Error(`Zug geht nicht: ${san}`);
    pos.play(zug);
  }
  return stellungAus(makeFen(pos.toSetup()));
}

function titel(auswertung: Werkzeugergebnis): string | undefined {
  return auswertung.befunde[0]?.titel;
}

describe("k2-eroeffnung", () => {
  it("Abb. 2.2 (nach 3. Lb5): Spanische Partie, Hauptvariante, Kurzfassung und Sprung", () => {
    const auswertung = eroeffnung(stellungVon("2.2"), INDEX);
    expect(titel(auswertung)).toBe("Spanische Partie");
    expect(auswertung.befunde[0]?.zeilen).toEqual([
      "Hauptvariante (Abschnitt 2.2)",
      "Im Buch nach 1. e4 e5 2. Sf3 Sc6 3. Lb5",
    ]);
    expect(auswertung.befunde[0]?.sprung?.abbildung).toBe("2.1");
    // Seit 0.2.27 kein Steckbrief-Text mehr, sondern eigene Kurzfassung und Verweis.
    expect(auswertung.befunde[1]?.titel).toBe("Steckbrief in Kürze");
    expect(auswertung.befunde[1]?.zeilen).toEqual([
      expect.stringMatching(/^Weiß greift mit dem Läufer b5/),
      "Den ganzen Steckbrief findest du im Buch, Abschnitt 2.2.",
    ]);
  });

  it("jeder Steckbrief des Buches hat eine eigene Kurzfassung", () => {
    const namen = ladeKapitel(2).steckbriefe.map((s) => s.name);
    expect(namen.length).toBeGreaterThan(0);
    for (const name of namen) expect(KURZFASSUNGEN[name], name).toBeDefined();
  });

  it("erkennt die Spanische Partie auch nach Zugumstellung (1. Sf3 Sc6 2. e4 e5 3. Lb5)", () => {
    expect(titel(eroeffnung(nach("Nf3", "Nc6", "e4", "e5", "Bb5"), INDEX))).toBe(
      "Spanische Partie",
    );
  });

  it("nach 1. e4 e5 2. Sf3 Sc6 ist die Eröffnung noch offen", () => {
    const auswertung = eroeffnung(nach("e4", "e5", "Nf3", "Nc6"), INDEX);
    expect(titel(auswertung)).toBe("Noch offen");
    expect(auswertung.befunde[0]?.zeilen).toEqual(
      expect.arrayContaining(["Spanische Partie", "Italienische Partie", "Schottische Partie"]),
    );
  });

  it("Gambits aus Kapitel 3: 1. e4 e5 2. f4 ist das Königsgambit", () => {
    expect(titel(eroeffnung(nach("e4", "e5", "f4"), INDEX))).toBe("Königsgambit");
  });

  it("Dänisches Gambit mit richtiger Endung", () => {
    expect(titel(eroeffnung(nach("e4", "e5", "d4", "exd4", "c3"), INDEX))).toBe("Dänisches Gambit");
  });

  it("Kapitel 2 geht vor: nach 1. e4 e5 2. Sf3 Sf6 Russische Verteidigung, nicht Stafford", () => {
    expect(titel(eroeffnung(nach("e4", "e5", "Nf3", "Nf6"), INDEX))).toBe(
      "Russische Verteidigung (Petroff)",
    );
  });

  it("keine Buchstellung und Laden", () => {
    expect(eroeffnung(nach("a4"), INDEX).fazit).toBe(
      "Diese Stellung steht in keiner Zugfolge der Kapitel 2 und 3.",
    );
    expect(eroeffnung(nach("e4"), undefined).fazit).toMatch(/werden geladen/);
  });
});

describe("k2-eroeffnung außerhalb des Buches (Lichess-Liste, seit 0.2.32)", () => {
  const liste = JSON.parse(
    readFileSync(
      new URL("../../public/daten/de/eroeffnungen-lichess.json", import.meta.url),
      "utf8",
    ),
  ) as Eroeffnungsliste;
  const MIT_LISTE = baueEroeffnungsindex(
    [ladeKapitel(2), ladeKapitel(3)],
    eroeffnungsnamenAus(liste),
  );
  const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  it("nennt eine Eröffnung, die nicht im Buch steht, mit deutschem Familiennamen", () => {
    const zuege = ["b4"];
    const auswertung = eroeffnung(nach(...zuege), MIT_LISTE, { startFen: GRUND, zuege });
    expect(titel(auswertung)).toBe("Nicht im Buch");
    expect(auswertung.befunde[0]?.zeilen[0]).toMatch(/^Bekannt als Polnische Eröffnung/);
    expect(auswertung.fazit).toMatch(/^Nicht im Buch – bekannt als Polnische Eröffnung/);
  });

  it("nach dem Verlassen der bekannten Wege: die letzte benannte Stellung davor", () => {
    const zuege = ["b4", "e5", "Bb2", "Bxb4", "Bxe5", "Nf6", "h4", "h5"];
    const auswertung = eroeffnung(nach(...zuege), MIT_LISTE, { startFen: GRUND, zuege });
    expect(auswertung.befunde[0]?.zeilen[0]).toMatch(/^Zuletzt bekannt als Polnische Eröffnung/);
  });

  it("Buchstellungen gehen vor: Spanische Partie bleibt Spanische Partie", () => {
    const zuege = ["e4", "e5", "Nf3", "Nc6", "Bb5"];
    const auswertung = eroeffnung(nach(...zuege), MIT_LISTE, { startFen: GRUND, zuege });
    expect(titel(auswertung)).toBe("Spanische Partie");
  });
});
