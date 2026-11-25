/**
 * Tests der Regeln fürs Ansprechen durch Hauptfiguren (regeln/ansprechen.ts): Kegel vor der Figur,
 * freie Sicht, einmal je Schritt und Figur, die Sperren nach Kartenwechsel, in unfreier Welt und
 * beim Rennen dicht vor der Figur.
 */
import { describe, expect, it } from "vitest";
import {
  ANGESPROCHEN,
  ANSPRECHRUHE_MS,
  ansprechGesperrt,
  ansprechschluessel,
  felderDazwischen,
  imKegel,
  nachAnsprechen,
  schonAngesprochen,
  sichtFrei,
} from "./ansprechen";
import { leererAbenteuerstand } from "./spielstand";

const JUNO = { x: 54, y: 24 };

describe("imKegel", () => {
  it("zählt 1 bis 3 Felder in Blickrichtung, 1 Feld seitlich", () => {
    expect(imKegel(JUNO, "unten", { x: 54, y: 25 })).toBe(1);
    expect(imKegel(JUNO, "unten", { x: 55, y: 26 })).toBe(2);
    expect(imKegel(JUNO, "unten", { x: 53, y: 27 })).toBe(3);
  });

  it("nicht hinter, neben oder zu weit vor der Figur", () => {
    expect(imKegel(JUNO, "unten", { x: 54, y: 23 })).toBeNull();
    expect(imKegel(JUNO, "unten", { x: 54, y: 24 })).toBeNull();
    expect(imKegel(JUNO, "unten", { x: 56, y: 25 })).toBeNull();
    expect(imKegel(JUNO, "unten", { x: 54, y: 28 })).toBeNull();
  });

  it("dreht mit der Blickrichtung", () => {
    expect(imKegel(JUNO, "links", { x: 52, y: 25 })).toBe(2);
    expect(imKegel(JUNO, "rechts", { x: 52, y: 25 })).toBeNull();
    expect(imKegel(JUNO, "oben", { x: 54, y: 21 })).toBe(3);
    expect(imKegel(JUNO, "rechts", { x: 57, y: 23 })).toBe(3);
  });
});

describe("Sicht", () => {
  it("nimmt die Felder auf der Linie ohne Anfang und Ende", () => {
    expect(felderDazwischen({ x: 0, y: 0 }, { x: 3, y: 1 })).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 1 },
    ]);
    expect(felderDazwischen({ x: 0, y: 0 }, { x: 0, y: 1 })).toEqual([]);
  });

  it("eine Wand dazwischen versperrt die Sicht, daneben nicht", () => {
    const wand = (x: number, y: number) => !(x === 54 && y === 25);
    expect(sichtFrei(JUNO, { x: 54, y: 27 }, wand)).toBe(false);
    expect(sichtFrei(JUNO, { x: 55, y: 26 }, wand)).toBe(true);
    // Das Feld des Helden selbst zählt nicht (er steht dort).
    expect(sichtFrei(JUNO, { x: 54, y: 25 }, wand)).toBe(true);
  });
});

describe("einmal je Schritt und Figur", () => {
  const leer = leererAbenteuerstand(new Date("2026-11-25T05:00:00Z"), "Kim", 600, false);
  const schluessel = ansprechschluessel("mapleFalls.ersterAbend", 0, "mutter");

  it("Schlüssel aus Quest, Schritt und Figur, in der Lücke ohne Schritt", () => {
    expect(schluessel).toBe("mapleFalls.ersterAbend#0:mutter");
    expect(ansprechschluessel("tagebuch.wasJetzt.juno", null, "juno")).toBe(
      "tagebuch.wasJetzt.juno:juno",
    );
  });

  it("merkt den Schritt und setzt `angesprochen`", () => {
    expect(schonAngesprochen(leer, schluessel)).toBe(false);
    const danach = nachAnsprechen(leer, schluessel);
    expect(schonAngesprochen(danach, schluessel)).toBe(true);
    expect(danach.dialogvariablen[ANGESPROCHEN]).toBe(true);
    // Der nächste Schritt derselben Figur ist neu.
    expect(
      schonAngesprochen(danach, ansprechschluessel("mapleFalls.ersterAbend", 1, "mutter")),
    ).toBe(false);
  });
});

describe("Sperren", () => {
  const ruhig = { frei: true, seitKarte: ANSPRECHRUHE_MS + 1, rennt: false, abstand: 2 };

  it("ruhig vorbeigehend: frei", () => {
    expect(ansprechGesperrt(ruhig)).toBe(false);
  });

  it("in den ersten 2 Sekunden nach dem Kartenwechsel gesperrt", () => {
    expect(ansprechGesperrt({ ...ruhig, seitKarte: ANSPRECHRUHE_MS - 1 })).toBe(true);
  });

  it("Dialog, Partie, Fenster oder Meldung offen: gesperrt", () => {
    expect(ansprechGesperrt({ ...ruhig, frei: false })).toBe(true);
  });

  it("rennend dicht vor der Figur gesperrt, rennend weiter weg nicht", () => {
    expect(ansprechGesperrt({ ...ruhig, rennt: true, abstand: 1 })).toBe(true);
    expect(ansprechGesperrt({ ...ruhig, rennt: true, abstand: 3 })).toBe(false);
  });
});
