/** Tests des Tischgesprächs (docs/spiel/29_Tischgespraech.md): Ereignisse, Plan, Zufall, Rätsel. */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, stellungen, ziehe, type Partie } from "../../spiel/partie";
import type { Partieverlauf } from "./partiemomente";
import { tischereignis } from "./tischereignisse";
import {
  festerZufall,
  raetselsprecher,
  temperamentVon,
  TISCHREGELN,
  tischplan,
  zeilennummer,
} from "./tischgespraech";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine Partie aus SAN-Zügen; der Held spielt Weiß, die Züge wechseln sich ab. */
function verlaufAus(zuege: readonly string[]): Partieverlauf {
  let partie: Partie | null = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 3,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: false,
    },
    "p",
    "2026-11-14T08:00:00.000Z",
  );
  zuege.forEach((san, i) => {
    const zug = i % 2 === 0 ? leserzug(san) : { ...leserzug(san), von: "engine" as const };
    partie = partie && ziehe(partie, zug);
  });
  if (!partie) throw new Error("Partie fehlt");
  const fertig: Partie = partie;
  return {
    fens: stellungen(fertig),
    vomHelden: fertig.zuege.map((z) => z.von === "leser"),
    held: "white",
  };
}

describe("Ereignisse der Partie", () => {
  it("erkennt den ersten Zug des Gegners", () => {
    const v = verlaufAus(["e4", "e5"]);
    expect(tischereignis(v, 1)).toBeNull();
    expect(tischereignis(v, 2)).toBe("beginn");
  });

  it("erkennt Schach des Helden und Schlag einer Figur", () => {
    // 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 4. Lxc6 dxc6: Der Gegner schlägt den Läufer.
    const v = verlaufAus(["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6"]);
    // Mit Lxc6 liegt der Held drei Einheiten vorn: Das zählt mehr als der Schlag selbst.
    expect(tischereignis(v, 7)).toBe("vorne");
    expect(tischereignis(v, 8)).toBe("schlaegtFigur");
    const schach = verlaufAus(["e4", "f5", "Qh5+"]);
    expect(tischereignis(schach, 3)).toBe("schach");
  });

  it("erkennt den Schlag einer Figur durch den Helden", () => {
    // Weiß liegt schon vorn (Dame gegen Springer) und schlägt den Springer: kein „vorne“ mehr.
    const v: Partieverlauf = {
      fens: ["4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1", "4k3/8/8/3Q4/8/8/8/4K3 b - - 0 1"],
      vomHelden: [true],
      held: "white",
    };
    expect(tischereignis(v, 1)).toBe("verliertFigur");
  });

  it("erkennt die Rochade des Helden", () => {
    const v = verlaufAus(["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "O-O"]);
    expect(tischereignis(v, 7)).toBe("rochade");
  });

  it("erkennt den Rückstand nur beim ersten Mal", () => {
    // Weiß stellt den Springer ein (Sg5? Dxg5), danach bleibt der Rückstand ohne neues Ereignis.
    const v = verlaufAus(["e4", "e5", "Nf3", "Qf6", "Ng5", "Qxg5", "d3", "Qf6"]);
    expect(tischereignis(v, 6)).toBe("hinten");
    expect(tischereignis(v, 8)).toBeNull();
  });
});

describe("Plan des Tischgesprächs", () => {
  it("ist fest je Partie und hält Pause und Höchstzahl ein", () => {
    const zuege = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6", "O-O", "f6"];
    const v = verlaufAus(zuege);
    const a = tischplan(v, "partie-1", true);
    expect(tischplan(v, "partie-1", true)).toEqual(a);
    const halbzuege = a.filter((z) => z.sprecher === "gegner").map((z) => z.halbzug);
    halbzuege.slice(1).forEach((h, i) => {
      expect(h - (halbzuege[i] ?? 0)).toBeGreaterThan(TISCHREGELN.pauseHalbzuege);
    });
    expect(halbzuege.length).toBeLessThanOrEqual(TISCHREGELN.hoechstens);
  });

  it("spricht beim Rückstand immer, Ambrose nur, wenn er da ist", () => {
    const v = verlaufAus(["e4", "e5", "Nf3", "Qf6", "Ng5", "Qxg5"]);
    const mit = tischplan(v, "x", true).filter((z) => z.halbzug === 6);
    expect(mit.map((z) => z.sprecher)).toEqual(["gegner", "ambrose"]);
    const ohne = tischplan(v, "x", false).filter((z) => z.halbzug === 6);
    expect(ohne.map((z) => z.sprecher)).toEqual(["gegner"]);
  });
});

describe("Zufall und Zeilenwahl", () => {
  it("gibt für gleiche Eingaben gleiche Zahlen in [0, 1)", () => {
    const z = festerZufall("p", "3:schach");
    expect(festerZufall("p", "3:schach")).toBe(z);
    expect(z).toBeGreaterThanOrEqual(0);
    expect(z).toBeLessThan(1);
  });

  it("trifft etwa die Wahrscheinlichkeit des Tischs", () => {
    const anzahl = 2000;
    const treffer = Array.from({ length: anzahl }, (_, i) => festerZufall("k", `${i}`)).filter(
      (z) => z < TISCHREGELN.chance,
    ).length;
    expect(treffer / anzahl).toBeGreaterThan(0.3);
    expect(treffer / anzahl).toBeLessThan(0.4);
  });

  it("zieht ohne Wiederholung, bis alle dran waren", () => {
    const nummern = [0, 1, 2, 3].map((n) => zeilennummer(4, n, "p", "g"));
    expect(new Set(nummern).size).toBe(4);
    expect(zeilennummer(4, 4, "p", "g")).toBe(nummern[0]);
    expect(zeilennummer(0, 0, "p", "g")).toBe(0);
  });
});

describe("Temperament", () => {
  it("nimmt die Angabe, sonst die Vorgabe der Rolle", () => {
    expect(temperamentVon({ rolle: "strasse" })).toBe("frech");
    expect(temperamentVon({ rolle: "clubchef" })).toBe("trocken");
    expect(temperamentVon({ rolle: "clubchef", temperament: "herzlich" })).toBe("herzlich");
  });
});

describe("Rätsel", () => {
  const lage = { kennung: "r", aufgabe: 2, falschInFolge: 1, gesprochenBei: null, ambroseDa: true };

  it("Ambrose spricht beim Hinweis und beim zweiten Fehler in Folge", () => {
    expect(raetselsprecher("hinweis", lage)).toBe("ambrose");
    expect(raetselsprecher("falsch", { ...lage, falschInFolge: 2 })).toBe("ambrose");
    expect(raetselsprecher("hinweis", { ...lage, ambroseDa: false })).toBeNull();
  });

  it("höchstens eine Zeile je Aufgabe, die Serie spricht immer", () => {
    expect(raetselsprecher("serie", lage)).toBe("steller");
    expect(raetselsprecher("serie", { ...lage, gesprochenBei: 2 })).toBeNull();
  });
});
