/**
 * Tests der Karte „Deine Wertung“ (Profil neu, 31.10.2026): Kacheln je Zeitklasse mit Schätzung
 * für Zeitklassen ohne Partie, Zahl und Kurve im selben Maßstab, Phasen als Eindruck bis zehn
 * Partien.
 */
import { describe, expect, it } from "vitest";
import { wertungInZeitklasse } from "../../../engine/zeitklassenabstand";
import type { Wertungstempo } from "../../../spiel/elomodell";
import { umgerechnet } from "../../../spiel/umrechnung";
import type { Wertungspunkt } from "../../../spiel/wertung";
import { phaseneindruecke } from "./phaseneindruck";
import {
  kurveImMassstab,
  schnellschachAus,
  startklasse,
  wertungskacheln,
  zahlInMassstab,
} from "./wertungskacheln";

/** Ein Punkt des Verlaufs. Beispiel: punkt("p1", "rapid", 1500). */
function punkt(partieId: string, tempo: Wertungstempo, wertung: number): Wertungspunkt {
  return {
    partieId,
    zeit: "2026-10-30T10:00:00.000Z",
    gegner: 1500,
    ergebnis: 1,
    wertung,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
    tempo,
  };
}

describe("Kacheln der Wertung", () => {
  it("zeigt gespielte Zeitklassen echt und schätzt die übrigen aus Schnellschach", () => {
    const kacheln = wertungskacheln([punkt("a", "rapid", 1480), punkt("b", "rapid", 1500)]);
    expect(kacheln.map((k) => k.tempo)).toEqual(["blitz", "rapid", "classical"]);
    expect(kacheln[1]).toEqual({
      tempo: "rapid",
      wert: 1500,
      partien: 2,
      geschaetzt: false,
      vorlaeufig: true,
    });
    expect(kacheln[0]?.geschaetzt).toBe(true);
    expect(kacheln[0]?.wert).toBe(Math.round(wertungInZeitklasse(1500, "blitz")));
    expect(kacheln[2]?.wert).toBe(Math.round(wertungInZeitklasse(1500, "classical")));
    // Derselbe Mensch: Blitz unter Schnellschach unter Klassisch.
    expect((kacheln[0]?.wert ?? 0) < 1500 && 1500 < (kacheln[2]?.wert ?? 0)).toBe(true);
  });

  it("schätzt ohne Schnellschach aus der meistgespielten Zeitklasse (Umkehrung)", () => {
    const blitz = Math.round(wertungInZeitklasse(1500, "blitz"));
    expect(Math.round(schnellschachAus(blitz, "blitz"))).toBeGreaterThanOrEqual(1499);
    expect(Math.round(schnellschachAus(blitz, "blitz"))).toBeLessThanOrEqual(1501);
    const kacheln = wertungskacheln([punkt("a", "blitz", blitz)]);
    expect(kacheln[1]?.geschaetzt).toBe(true);
    expect(Math.abs((kacheln[1]?.wert ?? 0) - 1500)).toBeLessThanOrEqual(1);
  });

  it("hat ohne gewertete Partie keine Zahlen", () => {
    expect(wertungskacheln([]).every((k) => k.wert === null && k.geschaetzt)).toBe(true);
  });

  it("hebt die Zeitklasse der letzten Partie hervor, eine Wahl gilt", () => {
    const punkte = [punkt("a", "rapid", 1500), punkt("b", "blitz", 1300)];
    expect(startklasse(punkte, null)).toBe("blitz");
    expect(startklasse(punkte, "classical")).toBe("classical");
    expect(startklasse([], null)).toBe("rapid");
  });
});

describe("Zahl und Kurve im selben Maßstab", () => {
  it("rechnet die Kurve wie die Zahl um und lässt Punkte außerhalb der Tabelle weg", () => {
    const punkte = [punkt("a", "rapid", 1660), punkt("b", "rapid", 1680)];
    const kurve = kurveImMassstab(punkte, "rapid", "chesscom");
    expect(kurve.map((p) => p.wertung)).toEqual([
      umgerechnet("rapid", 1660, "chesscom")?.mitte,
      umgerechnet("rapid", 1680, "chesscom")?.mitte,
    ]);
    expect(kurve.at(-1)?.wertung).toBe(zahlInMassstab("rapid", 1680, "chesscom"));
    expect(kurveImMassstab([punkt("c", "classical", 1500)], "classical", "fide")).toEqual([]);
    expect(zahlInMassstab("rapid", 1680, "lichess")).toBe(1680);
  });
});

describe("Phasen als Balken", () => {
  it("hat ohne ausgewertete Partie keine Zahlen", () => {
    const phasen = phaseneindruecke([punkt("a", "rapid", 1500)], [], "rapid");
    expect(phasen.map((p) => p.phase)).toEqual(["eroeffnung", "mittelspiel", "endspiel"]);
    expect(phasen.every((p) => p.mitte === null && !p.genau)).toBe(true);
  });
});
