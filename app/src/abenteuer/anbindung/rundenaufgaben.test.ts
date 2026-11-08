// Zusammenstellung einer Aufgabenrunde (Regelwerk R30, R31) mit nachgebauten Trainerdaten.
import { describe, expect, it } from "vitest";
import type { Taktikaufgabe } from "../../daten/trainerdaten";
import type { Zusatzaufgabe } from "../../training/zusatzaufgaben";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import { rundenaufgaben } from "./rundenaufgaben";

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
