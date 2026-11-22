/** Tests für tonregie.ts: Regie mit einem Mitschreiber statt Web Audio (Atmosphäre T1, T2). */
import { describe, expect, it, vi } from "vitest";
import { tagsAus } from "../dialog/geschichte";
import { Tonregie, type Spielwerk } from "./tonregie";
import { STANDARD_ABENTEUERTON } from "./tonplan";

/** Schreibt mit, was gespielt würde. */
function mitschreiber() {
  const protokoll: string[] = [];
  /** Klangquelle und Nähe (T28) getrennt, damit die Musikprotokolle kurz bleiben. */
  const quelle: string[] = [];
  const werk: Spielwerk = {
    setzePegel: (m, g) => protokoll.push(`pegel ${m} ${g}`),
    spieleSchleife: async (spur, angabe) => {
      (spur === "quelle" ? quelle : protokoll).push(`${spur} ${angabe ?? "aus"}`);
    },
    setzeNaehe: (anteil) => quelle.push(`naehe ${anteil}`),
    spieleEinmal: async (angabe) => {
      protokoll.push(`klang ${angabe}`);
    },
    stoppeAlles: () => protokoll.push("stopp"),
  };
  return { protokoll, quelle, werk };
}

describe("Tonregie", () => {
  it("spielt Karte, Szene und Klang, solange der Ton an ist", () => {
    const { protokoll, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("musik/dachboden.ogg", "wind");
    regie.dialogzeile(tagsAus(["musik:aus", "klang:glocke"]));
    regie.dialogBeendet();
    expect(protokoll).toEqual([
      "pegel 0.6 0.8",
      "musik aus",
      "geraeusch aus",
      "musik musik/dachboden.ogg",
      "geraeusch wind",
      "klang glocke",
      "musik aus",
      "geraeusch wind",
      "musik musik/dachboden.ogg",
      "geraeusch wind",
    ]);
  });

  it("stumm: nichts spielt, die Lage bleibt für später", () => {
    const { protokoll, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin({ ...STANDARD_ABENTEUERTON, stumm: true }, true);
    regie.karteBetreten("maple-falls");
    regie.dialogzeile(tagsAus(["klang:pfiff"]));
    expect(protokoll.filter((z) => !z.endsWith(" aus") && !z.startsWith("pegel"))).toEqual([]);
    expect(regie.soll.musik).toBe("maple-falls");
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    expect(protokoll.at(-2)).toBe("musik maple-falls");
  });

  it("Klangquelle: lauter in der Nähe, still außer Reichweite (T28)", () => {
    const { quelle, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("stadt", null, [{ musik: "rosie", x: 20, y: 10, reichweite: 20 }]);
    regie.heldBei(35, 10);
    expect(quelle.slice(-2)).toEqual(["quelle rosie", "naehe 0.5"]);
    regie.heldBei(60, 10);
    expect(quelle.slice(-2)).toEqual(["quelle aus", "naehe 0"]);
  });

  it("ohne Web Audio geschieht nichts und nichts geht kaputt", () => {
    const regie = new Tonregie(() => null);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("x", "y");
    regie.dialogzeile(tagsAus(["musik:z", "klang:k"]));
    regie.verlassen();
    expect(regie.soll).toEqual({ musik: null, geraeusch: null });
  });
  it("ein abgelehnter Ton stört die Seite nicht (Safari: „Context is stopped“)", async () => {
    const { werk } = mitschreiber();
    const fehler = new Error("Context is stopped");
    const abgelehnt: Spielwerk = {
      ...werk,
      spieleSchleife: () => Promise.reject(fehler),
      spieleEinmal: () => Promise.reject(fehler),
    };
    const warnung = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const regie = new Tonregie(() => abgelehnt);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("maple-falls", "wind");
    regie.dialogzeile(tagsAus(["klang:glocke"]));
    await new Promise((fertig) => setTimeout(fertig, 0));
    expect(warnung).toHaveBeenCalledWith("Ton nicht gespielt:", fehler);
    warnung.mockRestore();
  });
});

describe("gestoppter Tonerzeuger (WebKit beim Neuladen, Lauf 44657454880)", () => {
  /** Ein Spieler, dessen synchrone Aufrufe mit dem gegebenen Fehler scheitern. */
  function scheiterndesWerk(fehler: Error): Spielwerk {
    const wirf = () => {
      throw fehler;
    };
    return {
      setzePegel: wirf,
      setzeNaehe: wirf,
      stoppeAlles: wirf,
      spieleSchleife: () => Promise.resolve(),
      spieleEinmal: () => Promise.resolve(),
    };
  }

  it("„Context is stopped“ stört die Seite nicht, wird aber vermerkt", () => {
    const warnung = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const regie = new Tonregie(() =>
      scheiterndesWerk(new DOMException("Context is stopped", "InvalidStateError")),
    );
    expect(() => regie.stelleEin(STANDARD_ABENTEUERTON, true)).not.toThrow();
    expect(() => regie.verlassen()).not.toThrow();
    expect(warnung).toHaveBeenCalled();
    warnung.mockRestore();
  });

  it("andere Fehler gehen weiter (nichts verschluckt)", () => {
    const regie = new Tonregie(() => scheiterndesWerk(new TypeError("kaputt")));
    expect(() => regie.stelleEin(STANDARD_ABENTEUERTON, true)).toThrow("kaputt");
  });
});

describe("Tonregie und räumliche Geräusche", () => {
  it("gibt die Quellen der Karte an die Raumregie, der Pegel folgt dem Helden", () => {
    const faktoren: number[] = [];
    const { werk } = mitschreiber();
    let jetzt = 0;
    const uhr = { jetzt: () => jetzt, spaeter: () => undefined };
    const regie = new Tonregie(
      () => ({ ...werk, setzeRaum: (f) => faktoren.push(f) }),
      vi.fn(),
      uhr,
    );
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten(
      "musik/a.ogg",
      "klang/bach.m4a",
      [],
      [{ art: "bach", felder: [[0, 0, 1, 1]] }],
    );
    expect(faktoren.at(-1)).toBe(1);
    jetzt = 10000;
    regie.heldBei(30, 30);
    expect(regie.raumpegel ?? 1).toBeLessThan(0.4);
    jetzt = 10200;
    regie.heldBei(1, 0);
    expect(regie.raumpegel).toBe(1);
  });
});

describe("Tonregie und Musik in Spuren", () => {
  it("Dialog senkt die Musik, Siege und Innenraum gehen an die Mischung, der Messer meldet", () => {
    const { werk } = mitschreiber();
    const dialog: boolean[] = [];
    const lagen: unknown[] = [];
    const regie = new Tonregie(() => ({
      ...werk,
      setzeDialog: (a) => dialog.push(a),
      setzeMischlage: (l) => lagen.push(l),
    }));
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    regie.karteBetreten("musik/a.ogg", null, [], [], {
      kennung: "mapleFalls.clubraum",
      innen: true,
    });
    regie.dialogzeile(tagsAus(["musik:mapleFalls.clubkampf"]));
    regie.dialogzeile(tagsAus(["sprecher:coach"]));
    regie.ergebnis(true);
    expect(regie.messung()).toMatchObject({
      musik: "mapleFalls.clubkampf",
      dialog: true,
      mischlage: { innen: true, siege: 1, musikerNaehe: 0 },
    });
    regie.dialogBeendet();
    expect(dialog).toEqual([true, false]);
    expect(lagen.at(-1)).toEqual({ innen: true, siege: 0, musikerNaehe: 0 });
  });
});
