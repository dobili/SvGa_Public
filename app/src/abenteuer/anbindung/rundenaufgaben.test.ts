// Zusammenstellung einer Aufgabenrunde (Regelwerk R30, R31) mit nachgebauten Trainerdaten.
import { describe, expect, it } from "vitest";
import type { Taktikaufgabe } from "../../daten/trainerdaten";
import type { Zusatzaufgabe } from "../../training/zusatzaufgaben";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import {
  buchfrage,
  figurDerLoesung,
  rundenaufgaben,
  rundenstartAus,
  zufallDerRunde,
} from "./rundenaufgaben";

const FEN = "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1";

function taktik(id: string, uebung: string | null, schwierigkeit = 2): Taktikaufgabe {
  return {
    id,
    fen: FEN,
    amZug: "w",
    loesung: ["Rd8#"],
    akzeptiert: [],
    motiv: null,
    mattbild: "grundreihe",
    schluesselfeld: "d8",
    ziel: "matt",
    schwierigkeit,
    messung: { tiefe: 4, laenge: 1, klasse: "leicht" },
    herkunft: uebung
      ? { quelle: "buch", abbildung: "1.40", uebung }
      : { quelle: "buch", abbildung: "7.1" },
  };
}

function zusatz(id: string, thema: Zusatzaufgabe["thema"], schwierigkeit = 2): Zusatzaufgabe {
  return { aufgabe: taktik(id, null, schwierigkeit), thema, vorher: { fen: FEN, zug: "Kh8" } };
}

const AUFTRAG: Aufgabenauftrag = {
  kennung: "mapleFalls.reiheSam#1",
  runde: "mapleFalls.reiheSam",
  steller: "figur.sam.name",
  kapitel: 0,
  buchuebungen: ["ueb:droh-ignorieren", "ueb:fehlt"],
  themen: ["haengend", "matt1", "zaehlen"],
  anzahl: 4,
  schwierigkeit: 2,
  versuch: 1,
  zaehltFuerApp: true,
};

describe("rundenaufgaben", () => {
  it("stellt Buchübungen voran und wechselt die Themen ab; Unbekanntes fällt weg", () => {
    const taktikdaten = [taktik("t1", "ueb:droh-ignorieren"), taktik("t2", null)];
    const zusaetze = [
      zusatz("h1", "haengend"),
      zusatz("h2", "haengend"),
      zusatz("h3", "haengend"),
      zusatz("m1", "matt1"),
      zusatz("m2", "matt1"),
    ];
    // Fester Zufall: die Reihenfolge der Auswahl bleibt wie in den Daten.
    const liste = rundenaufgaben(AUFTRAG, taktikdaten, zusaetze, () => 0);
    expect(liste).toHaveLength(5);
    expect(liste[0]).toMatchObject({ art: "taktik", motivAbfragen: false });
    const kennungen = liste
      .slice(1)
      .map((a) => (a.art === "zusatz" ? a.aufgabe.aufgabe.id : a.aufgabe.id));
    expect(kennungen).toHaveLength(4);
    expect(kennungen.filter((k) => k.startsWith("h"))).toHaveLength(2);
    expect(kennungen.filter((k) => k.startsWith("m"))).toHaveLength(2);
  });

  it("liefert ohne passende Daten nur die gefundenen Buchübungen", () => {
    expect(rundenaufgaben(AUFTRAG, [], [], () => 0)).toEqual([]);
    expect(
      rundenaufgaben({ ...AUFTRAG, themen: [] }, [taktik("t1", "ueb:droh-ignorieren")], []),
    ).toHaveLength(1);
  });
});

/** Springergabel aus dem Spieltest (Sf5+ Ke4 Sxh4): Springer d4, König e3, Dame h4 (frei erfunden). */
const GABEL_FEN = "8/8/8/8/3N3q/4k3/8/6K1 w - - 0 1";

describe("Lilys Springer-Lektion und Einsteiger (Spieltest „einstieg“, R4)", () => {
  const lily: Aufgabenauftrag = {
    ...AUFTRAG,
    kennung: "mapleFalls.springerLily#1",
    runde: "mapleFalls.springerLily",
    buchuebungen: [],
    themen: ["doppelangriff"],
    figur: "springer",
    anzahl: 2,
    schwierigkeit: 1,
  };
  const springer = (id: string, halbzuege = 3): Zusatzaufgabe => ({
    ...zusatz(id, "doppelangriff", 1),
    aufgabe: {
      ...taktik(id, null, 1),
      fen: GABEL_FEN,
      schluesselfeld: "d4",
      loesung: ["Nf5+", "Ke4", "Nxh4", "Kf3", "Kf1"].slice(0, halbzuege) as [string, ...string[]],
    },
  });

  it("erkennt die Figur des ersten Lösungszugs", () => {
    expect(figurDerLoesung(springer("s1").aufgabe)).toBe("knight");
    expect(figurDerLoesung({ ...taktik("t", null), schluesselfeld: "d1" })).toBe("rook");
  });

  it("nimmt nur Springeraufgaben mit kurzer Lösung, solange es genug gibt", () => {
    const daten = [
      zusatz("d1", "doppelangriff", 1),
      springer("s1"),
      springer("s5", 5),
      springer("s2"),
    ];
    const ids = rundenaufgaben(lily, [], daten, () => 0).map((a) =>
      a.art === "zusatz" ? a.aufgabe.aufgabe.id : "",
    );
    expect(ids.sort()).toEqual(["s1", "s2"]);
  });

  it("füllt mit anderen Aufgaben auf, wenn die Springer nicht reichen", () => {
    const daten = [zusatz("d1", "doppelangriff", 1), springer("s1")];
    expect(rundenaufgaben(lily, [], daten, () => 0)).toHaveLength(2);
  });
});

describe("Themen falle und struktur", () => {
  it("nimmt Aufgaben aus den Trainern Falle oder Köder und Strukturen", async () => {
    const { readFileSync } = await import("node:fs");
    const lies = (datei: string) =>
      JSON.parse(
        readFileSync(new URL(`../../../public/daten/de/trainer/${datei}`, import.meta.url), "utf8"),
      ) as {
        aufgaben: never[];
      };
    const weitere = {
      fallen: lies("falle.json").aufgaben,
      strukturen: lies("struktur.json").aufgaben,
    };
    const auftrag = { ...AUFTRAG, buchuebungen: [], themen: ["falle", "struktur"], anzahl: 4 };
    const runde = rundenaufgaben(auftrag, [], [], () => 0.5, weitere);
    expect(runde.map((r) => r.art).sort()).toEqual(["falle", "falle", "struktur", "struktur"]);
  });
});

describe("Thema endspiel", () => {
  it("nimmt Aufgaben aus dem Endspieltrainer", async () => {
    const { readFileSync } = await import("node:fs");
    const daten = JSON.parse(
      readFileSync(
        new URL("../../../public/daten/de/trainer/endspiel.json", import.meta.url),
        "utf8",
      ),
    ) as { aufgaben: never[] };
    const auftrag = { ...AUFTRAG, buchuebungen: [], themen: ["endspiel"], anzahl: 3 };
    const runde = rundenaufgaben(auftrag, [], [], () => 0.5, {
      fallen: [],
      strukturen: [],
      endspiele: daten.aufgaben,
    });
    expect(runde.map((r) => r.art)).toEqual(["endspiel", "endspiel", "endspiel"]);
  });
});

describe("buchfrage", () => {
  it("gibt Abb. 1.40 ihre eigene Frage statt nur des Ziels (N2614), sonst nichts", () => {
    expect(buchfrage(taktik("t1", "ueb:droh-ignorieren"))).toContain("Springer auf b5");
    // Übungen ohne eigenen Satz (Kapitel 7) und Aufgaben ohne Übung behalten nur das Ziel.
    expect(buchfrage(taktik("t2", "ueb:taktik-a02"))).toBeNull();
    expect(buchfrage(taktik("t3", null))).toBeNull();
  });
});

describe("zufallDerRunde", () => {
  it("liefert für dieselbe Kennung dieselbe Folge, für eine neue eine andere", () => {
    const folge = (k: string) => {
      const z = zufallDerRunde(k);
      return [z(), z(), z()];
    };
    expect(folge("mapleFalls.springerLily#a1")).toEqual(folge("mapleFalls.springerLily#a1"));
    expect(folge("mapleFalls.springerLily#a1")).not.toEqual(folge("mapleFalls.springerLily#a2"));
  });
});

describe("rundenstartAus (R5)", () => {
  it("startet nach den gesicherten Antworten", () => {
    expect(rundenstartAus(null)).toBeNull();
    expect(rundenstartAus({ kennung: "r#1", ergebnisse: [], sekunden: 0 })).toBeNull();
    expect(
      rundenstartAus({ kennung: "r#1", ergebnisse: ["richtig", "falsch"], sekunden: 95 }),
    ).toEqual({ index: 2, richtig: 1, sekunden: 95 });
  });
});
