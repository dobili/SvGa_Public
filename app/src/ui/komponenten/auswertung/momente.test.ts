/**
 * Tests der Momente und Abschnitte der Zeitleiste (Entwurf F2): welche Züge Momente werden, in
 * welcher Reihenfolge, und wie sie sich auf die Phasen verteilen.
 */
import { describe, expect, it } from "vitest";
import type { Zugklasse, Zugurteil } from "../../../spiel/auswertung";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "../../../spiel/partie";
import { gutGespielt, momente } from "./momente";
import { phasenabschnitte } from "./zeitleiste";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function enginezug(san: string, fehler: Partiezug["fehler"] = null): Partiezug {
  return { san, von: "engine", quelle: fehler ? "fehler" : "engine", fehler, verlust: 1 };
}

/** 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6 4. Dxf7#: Leser Weiß, Sf6 ein Fehler der Engine. */
function partie(): Partie {
  const start = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "p",
    "2026-10-15T08:00:00.000Z",
  );
  const zuege = [
    leserzug("e4"),
    enginezug("e5"),
    leserzug("Qh5"),
    enginezug("Nc6"),
    leserzug("Bc4"),
    enginezug("Nf6", "drohungIgnoriert"),
    leserzug("Qxf7#"),
  ];
  const fertig = zuege.reduce<Partie | null>((p, z) => (p ? ziehe(p, z) : null), start);
  if (!fertig) throw new Error("Zug geht nicht");
  return fertig;
}

/** Urteile aus Klassen; „?“ und „??“ wie in spiel/auswertung.ts. */
function urteile(klassen: readonly Zugklasse[]): Zugurteil[] {
  const zeichen = (k: Zugklasse) => (k === "patzer" ? "??" : k === "fehler" ? "?" : null);
  return klassen.map((klasse, index) => ({ index, verlust: 0, zeichen: zeichen(klasse), klasse }));
}

describe("Momente der Zeitleiste", () => {
  const p = partie();

  it("Theorie, Abweichung, weiterer Fehler, Fehler der Engine und Ende in Zugfolge", () => {
    const u = urteile(["buch", "buch", "fehler", "gut", "patzer", "fehler", "bester"]);
    const m = momente({ partie: p, urteile: u, seite: "white" });
    expect(m.map((x) => `${x.art}@${x.index}`)).toEqual([
      "theorie@1",
      "abweichung@2",
      "fehler@4",
      "engine@5",
      "ende@6",
    ]);
    // Die Theorie zählt die Theoriezüge der gewählten Seite.
    expect(m[0]?.zahl).toBe(1);
    expect(gutGespielt({ partie: p, urteile: u, seite: "white" })).toBe(false);
  });

  it("Seite der Engine: ihre Fehler, keine Abweichung, kein „Gut gespielt!“", () => {
    const u = urteile(["gut", "gut", "gut", "gut", "gut", "patzer", "bester"]);
    const m = momente({ partie: p, urteile: u, seite: "black" });
    expect(m.map((x) => `${x.art}@${x.index}`)).toEqual(["fehler@5", "engine@5", "ende@6"]);
    expect(gutGespielt({ partie: p, urteile: u, seite: "black" })).toBe(false);
  });

  it("Absichtliche Kleinigkeiten der Engine erscheinen nicht (nur wirkliche Fehler)", () => {
    const u = urteile(["buch", "buch", "gut", "gut", "gut", "ungenau", "bester"]);
    const m = momente({ partie: p, urteile: u, seite: "white" });
    expect(m.map((x) => x.art)).not.toContain("engine");
  });

  it("Ohne klare Abweichung: „Gut gespielt!“ für den Leser", () => {
    const u = urteile(["gut", "gut", "gut", "gut", "gut", "patzer", "bester"]);
    expect(gutGespielt({ partie: p, urteile: u, seite: "white" })).toBe(true);
    // Vor der Auswertung gibt es noch kein Urteil.
    expect(gutGespielt({ partie: p, urteile: [], seite: "white" })).toBe(false);
  });

  it("Abschnitte: kurze Partie ganz in der Eröffnung, Zug 1 bis 4", () => {
    const u = urteile(["buch", "buch", "fehler", "gut", "patzer", "fehler", "bester"]);
    const m = momente({ partie: p, urteile: u, seite: "white" });
    const phasen = Array.from({ length: 8 }, () => "eroeffnung" as const);
    const abschnitte = phasenabschnitte(p, phasen, m);
    expect(abschnitte).toHaveLength(1);
    expect(abschnitte[0]).toMatchObject({ phase: "eroeffnung", vonZug: 1, bisZug: 4 });
    expect(abschnitte[0]?.momente).toHaveLength(m.length);
  });

  it("Abschnitte: Phasenwechsel teilt Züge und Momente", () => {
    const u = urteile(["buch", "buch", "fehler", "gut", "patzer", "fehler", "bester"]);
    const m = momente({ partie: p, urteile: u, seite: "white" });
    const phasen = [
      "eroeffnung",
      "eroeffnung",
      "eroeffnung",
      "eroeffnung",
      "mittelspiel",
      "mittelspiel",
      "endspiel",
      "endspiel",
    ] as const;
    const abschnitte = phasenabschnitte(p, phasen, m);
    expect(abschnitte.map((a) => `${a.phase} ${a.vonZug}-${a.bisZug}`)).toEqual([
      "eroeffnung 1-2",
      "mittelspiel 3-3",
      "endspiel 4-4",
    ]);
    expect(abschnitte[1]?.momente.map((x) => x.art)).toEqual(["fehler", "engine"]);
  });
});
