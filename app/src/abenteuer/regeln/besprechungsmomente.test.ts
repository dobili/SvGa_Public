/**
 * Tests der Auswahl der Momente einer Partiebesprechung je Stufe (Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 2).
 */
import { describe, expect, it } from "vitest";
import type { Zugklasse, Zugurteil } from "../../spiel/auswertung";
import { besprechungsmomente, naechsteMomentstelle } from "./besprechungsmomente";

/** Urteile aus Klassen, Weiß (gerade Indizes) ist der Held. */
function urteile(klassen: readonly Zugklasse[]): Zugurteil[] {
  return klassen.map((klasse, index) => ({ index, klasse, verlust: 0, zeichen: null }));
}
const heldIstWeiss = (n: number) => Array.from({ length: n }, (_, i) => i % 2 === 0);

/** Eine Partie mit Theorie, einem Patzer des Gegners, Fehlern und einem brillanten Zug. */
const KLASSEN: readonly Zugklasse[] = [
  "buch", // 0 Held
  "buch", // 1
  "buch", // 2 Held
  "patzer", // 3 Gegner
  "gut", // 4 Held nutzt es
  "gut", // 5
  "ungenau", // 6 Held
  "gut", // 7
  "fehler", // 8 Held
  "fehler", // 9 Gegner
  "verpasst", // 10 Held
  "gut", // 11
  "patzer", // 12 Held
  "gut", // 13
  "brillant", // 14 Held
  "gut", // 15
  "fehler", // 16 Held
];

function grundlage(stufe: 1 | 2 | 3, theorieBekannt = false) {
  return {
    urteile: urteile(KLASSEN),
    vomHelden: heldIstWeiss(KLASSEN.length),
    stufe,
    theorieBekannt,
  };
}

describe("Momente der Besprechung je Stufe", () => {
  it("Stufe 1: knapp, nur eigene Züge, Patzer zuerst, ein Lob bleibt", () => {
    const m = besprechungsmomente(grundlage(1));
    expect(m.length).toBe(4);
    expect(m.map((x) => x.kategorie)).toEqual(["fehler", "verpasst", "patzer", "brillant"]);
    expect(m.some((x) => x.kategorie === "gegnerfehler" || x.kategorie === "ungenau")).toBe(false);
  });

  it("Stufe 2: dazu Fehler des Gegners (nicht vor einer verpassten Chance) und Theorie", () => {
    const m = besprechungsmomente(grundlage(2));
    expect(m.length).toBe(6);
    const gegner = m.filter((x) => x.kategorie === "gegnerfehler").map((x) => x.index);
    // Der Patzer bei 3 zählt; der Fehler bei 9 nicht, denn bei 10 hat der Held ihn verpasst.
    expect(gegner).toEqual([3]);
    expect(m.map((x) => x.index)).toEqual([...m.map((x) => x.index)].sort((a, b) => a - b));
  });

  it("Stufe 3: mehr Platz, auch ungenau und der Theoriemoment", () => {
    const m = besprechungsmomente(grundlage(3, true));
    expect(m.length).toBe(8);
    expect(m[0]).toEqual({ index: 2, kategorie: "theorie" });
    expect(m.some((x) => x.kategorie === "ungenau")).toBe(true);
  });

  it("ohne bekanntes Wort heißt die Theorie „bekannte Wege“", () => {
    const wenig = { ...grundlage(3), urteile: urteile(["buch", "buch", "buch", "gut"]) };
    expect(besprechungsmomente(wenig)).toEqual([{ index: 2, kategorie: "bekannt" }]);
  });

  it("Stufe 0 und eine Partie ohne Besonderes: nichts", () => {
    expect(besprechungsmomente({ ...grundlage(1), stufe: 0 })).toEqual([]);
    const ruhig = { ...grundlage(2), urteile: urteile(["gut", "gut", "bester", "gut"]) };
    expect(besprechungsmomente(ruhig)).toEqual([]);
  });
});

describe("Sprung zur nächsten Stelle", () => {
  const momente = [
    { index: 3, kategorie: "fehler" as const },
    { index: 9, kategorie: "patzer" as const },
  ];
  it("springt vor und zurück zu den Stellen nach den Momenten", () => {
    expect(naechsteMomentstelle(momente, 0, "vor")).toBe(4);
    expect(naechsteMomentstelle(momente, 4, "vor")).toBe(10);
    expect(naechsteMomentstelle(momente, 10, "vor")).toBeNull();
    expect(naechsteMomentstelle(momente, 7, "zurueck")).toBe(4);
    expect(naechsteMomentstelle(momente, 4, "zurueck")).toBeNull();
  });
});
