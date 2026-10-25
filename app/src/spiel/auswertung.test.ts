/** Tests der Auswertung: Zeichen nach Verlust, erste klare Abweichung, Protokoll der Engine. */
import { describe, expect, it } from "vitest";
import {
  endwert,
  enginefehler,
  ersteAbweichung,
  klasseVon,
  zeichenFuer,
  zugnummer,
  zugurteile,
  ausreisser,
} from "./auswertung";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "./partie";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function enginezug(san: string, fehler: Partiezug["fehler"] = null): Partiezug {
  return { san, von: "engine", quelle: fehler ? "fehler" : "engine", fehler, verlust: 1 };
}

/** 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6?? 4. Dxf7#: Leser Weiß, Sf6 ein Fehler der Engine. */
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

describe("Auswertung", () => {
  it("Zeichen nach den Grenzen aus Konzept 8.3", () => {
    expect(zeichenFuer(0.4)).toBeNull();
    expect(zeichenFuer(0.5)).toBe("?!");
    expect(zeichenFuer(1.2)).toBe("?");
    expect(zeichenFuer(3)).toBe("??");
    expect(zeichenFuer(5, 5)).toBe("?!");
    expect(zeichenFuer(5, 4.9)).toBe("??");
  });

  it("„!“ für den einzigen guten Zug: bester Zug und mindestens 1,2 Abstand zum zweitbesten", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -0.3, -0.3, -0.3, 10, 10];
    const beste = ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6", "h5f7", ""];
    const abstaende = [0, 0, 0, 1.5, 1.1, 0, 5, 0];
    const zeichen = zugurteile(p, werte, beste, abstaende).map((u) => u.zeichen);
    // 2... Sc6: bester Zug mit Abstand 1,5 → „!“; 3. Lc4: Abstand 1,1 reicht nicht; 4. Dxf7# ist
    // einziger Zug, aber danach klar gewonnen: kein „!“ mehr (0.2.51).
    expect(zeichen).toEqual([null, null, "?!", "!", null, "??", null]);
    // Ohne Abstände (ältere Auswertung) gibt es kein „!“.
    expect(zugurteile(p, werte).map((u) => u.zeichen)).toEqual([
      null,
      null,
      "?!",
      null,
      null,
      "??",
      null,
    ]);
  });

  it("Matt und Patt ohne Engine", () => {
    expect(endwert("k7/P7/1K6/8/8/8/8/8 b - - 0 1")).toBe(0);
    expect(endwert("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3")).toBe(-10);
    expect(endwert(GRUNDSTELLUNG)).toBeNull();
  });

  it("Verlust aus Sicht der ziehenden Seite, Matt begrenzt", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -0.3, -0.2, -0.3, 99, 10];
    const urteile = zugurteile(p, werte);
    expect(urteile.map((u) => u.zeichen)).toEqual([null, null, "?!", null, null, "??", null]);
    expect(urteile[5]?.verlust).toBeCloseTo(10.3);
    expect(zugurteile(p, [0])).toEqual([]);
  });

  it("erste klare Abweichung nur bei Zügen des Lesers", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -1.2, -1.2, -0.3, 99, 10];
    const urteile = zugurteile(p, werte);
    expect(ersteAbweichung(p, urteile)?.index).toBe(2);
    expect(ersteAbweichung(p, zugurteile(p, [0, 0, 0, 0, 0, 0, 0, 0]))).toBeNull();
  });

  it("Protokoll der Engine mit Zugnummer", () => {
    expect(enginefehler(partie())).toEqual([
      { index: 5, nummer: "3...", fehler: "drohungIgnoriert" },
    ]);
    expect(zugnummer(partie(), 6)).toBe("4.");
  });
});

describe("Ausreißer der Auswertung (0.2.51)", () => {
  it("ein Sprung um 3, der sofort zurückspringt, ist verdächtig; ein echter Patzer nicht", () => {
    expect(ausreisser([10, 10, 2.6, 10, 10])).toEqual([2]);
    expect(ausreisser([0.3, 0.3, -6, -6.2, -7])).toEqual([]);
    expect(ausreisser([0, 2.9, 0])).toEqual([]);
    expect(ausreisser([0, 4, 8])).toEqual([]);
    expect(ausreisser([])).toEqual([]);
  });
});

describe("Zugklassen (0.2.40, wie bei chess.com)", () => {
  const ruhig = {
    warBester: false,
    einziger: false,
    opfer: false,
    vorherVerlust: 0,
    wertVorher: 0,
    abstand: 0,
    imSchach: false,
    buch: false,
  };
  it("nach Verlust: patzer, fehler, ungenau, gut, sehr gut; bester nur der Zug der Engine", () => {
    expect(klasseVon(3, ruhig)).toBe("patzer");
    expect(klasseVon(1.2, ruhig)).toBe("fehler");
    expect(klasseVon(0.5, ruhig)).toBe("ungenau");
    expect(klasseVon(0.3, ruhig)).toBe("gut");
    expect(klasseVon(0.1, ruhig)).toBe("sehrGut");
    // Gleichwertig, aber nicht der Zug der Engine: sehr gut (0.2.50, wie „exzellent“ bei chess.com).
    expect(klasseVon(0, ruhig)).toBe("sehrGut");
    expect(klasseVon(0, { ...ruhig, warBester: true })).toBe("bester");
  });

  it("verpasst vor patzer: nach 3... Sf4?? (Springer hängt, 6,3) ist 4. e3 (5,9) verpasst", () => {
    // Weiß steht nach 4. e3 (+1,1) nicht schlechter als vor 3... Sf4 (+0,7): verpasst, kein Patzer.
    expect(klasseVon(5.9, { ...ruhig, vorherVerlust: 6.3, wertVorher: 7 })).toBe("verpasst");
    // Gibt der Zug mehr zurück, als der Gegner geschenkt hat, bleibt es ein Patzer.
    expect(klasseVon(6.5, { ...ruhig, vorherVerlust: 6.3, wertVorher: 7 })).toBe("patzer");
    expect(klasseVon(1.3, { ...ruhig, vorherVerlust: 1.2 })).toBe("fehler");
  });

  it("verpasst nach einem Fehler des Gegners, stark als Strafe oder einziger Zug, brillant als Opfer", () => {
    expect(klasseVon(0.6, { ...ruhig, vorherVerlust: 1.5 })).toBe("verpasst");
    expect(klasseVon(0, { ...ruhig, warBester: true, vorherVerlust: 1.5 })).toBe("stark");
    expect(klasseVon(0, { ...ruhig, warBester: true, einziger: true })).toBe("stark");
    expect(klasseVon(0, { ...ruhig, warBester: true, opfer: true })).toBe("brillant");
    // Ein gutes Opfer bis 0,5 hinter dem besten Zug ist auch brillant (0.2.53), ab 0,5 nicht.
    expect(klasseVon(0.1, { ...ruhig, opfer: true })).toBe("brillant");
    expect(klasseVon(0.3, { ...ruhig, opfer: true })).toBe("brillant");
    expect(klasseVon(0.5, { ...ruhig, opfer: true })).toBe("ungenau");
    // Kein brillant: danach schlecht, aus dem Schach heraus, oder der zweitbeste gewinnt ohnehin.
    expect(klasseVon(0, { ...ruhig, warBester: true, opfer: true, wertVorher: -2 })).toBe("bester");
    expect(klasseVon(0, { ...ruhig, warBester: true, opfer: true, imSchach: true })).toBe("bester");
    expect(
      klasseVon(0, { ...ruhig, warBester: true, opfer: true, wertVorher: 9, abstand: 1 }),
    ).toBe("bester");
    expect(
      klasseVon(0, { ...ruhig, warBester: true, opfer: true, wertVorher: 9, abstand: 4 }),
    ).toBe("brillant");
    // Nach dem Zug klar gewonnen (ab +5): kein „stark“ mehr, auch nicht als einziger Zug (0.2.51).
    expect(klasseVon(0, { ...ruhig, warBester: true, vorherVerlust: 1.5, wertVorher: 6 })).toBe(
      "bester",
    );
    expect(klasseVon(0, { ...ruhig, warBester: true, einziger: true, wertVorher: 6 })).toBe(
      "bester",
    );
    expect(klasseVon(0, { ...ruhig, warBester: true, vorherVerlust: 1.5, wertVorher: 4 })).toBe(
      "stark",
    );
    // Auch in gewonnener Stellung bleibt ein Opfer brillant (16. Db8+!! in der Opernpartie).
    expect(klasseVon(0, { ...ruhig, warBester: true, opfer: true, wertVorher: 6 })).toBe(
      "brillant",
    );
    expect(klasseVon(0, { ...ruhig, buch: true })).toBe("buch");
  });

  it("noch klar gewonnen (ab +5 nach dem Zug): höchstens ungenau (Empfehlung K5)", () => {
    // Matt in 2 (Wert 10) zu +5: Verlust 5, aber weiter klar gewonnen.
    expect(klasseVon(5, { ...ruhig, wertVorher: 10 })).toBe("ungenau");
    // Unter 3 Verlust in klar gewonnener Stellung nur „gut“ (0.2.51, Vergleich mit chess.com).
    expect(klasseVon(1.5, { ...ruhig, wertVorher: 10, vorherVerlust: 2 })).toBe("gut");
    expect(klasseVon(3, { ...ruhig, wertVorher: 10 })).toBe("ungenau");
    // Klar verloren nach dem Zug: der einzige Zug ist nur „bester“, kein „!“.
    expect(klasseVon(0, { ...ruhig, warBester: true, einziger: true, wertVorher: -6 })).toBe(
      "bester",
    );
    // Von +10 auf +4,9 ist der Gewinn nicht mehr sicher: weiter „??“.
    expect(klasseVon(5.1, { ...ruhig, wertVorher: 10 })).toBe("patzer");
    expect(klasseVon(0.1, { ...ruhig, wertVorher: 10 })).toBe("sehrGut");
  });
});

describe("Theoriezug (Klasse „buch“, seit dem Wunsch des Autors vom 25.10.2026)", () => {
  // Partie 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6?? 4. Dxf7#; Werte so, dass nur 3... Sf6 etwas verliert.
  const werte = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 10, 10];
  const alleTheorie = [true, true, true, true, true, true, true];

  it("Theorie, solange alle Züge davor Theoriezüge waren", () => {
    const klassen = zugurteile(partie(), werte, [], [], alleTheorie).map((u) => u.klasse);
    expect(klassen.slice(0, 5)).toEqual(["buch", "buch", "buch", "buch", "buch"]);
    // 3... Sf6?? verliert: Patzer, und danach ist die Theorie vorbei (4. Dxf7# kein Theoriezug).
    expect(klassen[5]).toBe("patzer");
    expect(klassen[6]).not.toBe("buch");
  });

  it("einmal außerhalb der Theorie, bleibt es so (wie „out of book“ bei chess.com)", () => {
    const klassen = zugurteile(partie(), werte, [], [], [true, true, false, true, true]);
    expect(klassen.map((u) => u.klasse).slice(0, 5)).toEqual([
      "buch",
      "buch",
      "sehrGut",
      "sehrGut",
      "sehrGut",
    ]);
  });

  it("benannt, aber schlecht (Bongcloud 2. Ke2, Verlust ab 0,5): kein Theoriezug", () => {
    const theorie = {
      warBester: false,
      einziger: false,
      opfer: false,
      vorherVerlust: 0,
      wertVorher: 0.3,
      abstand: 0,
      imSchach: false,
      buch: true,
    };
    expect(klasseVon(0.8, theorie)).toBe("ungenau");
    expect(klasseVon(0.2, theorie)).toBe("buch");
  });

  it("ohne Angabe gibt es keine Theoriezüge (so rechnen Spielstärke und Wertung)", () => {
    expect(zugurteile(partie(), werte).some((u) => u.klasse === "buch")).toBe(false);
  });
});
