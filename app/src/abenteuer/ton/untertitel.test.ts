/**
 * Tests für Geräusche als Text (ton/untertitel.ts, ton/tonregie.ts, ton/Untertitelzeile.tsx):
 * Schlüssel, Anzeigedauer, wann die Regie meldet, und die Texte aus den Spieltexten.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tagsAus } from "../dialog/geschichte";
import { Tonregie, type Spielwerk } from "./tonregie";
import { STANDARD_ABENTEUERTON } from "./tonplan";
import {
  aktuelleUntertitel,
  leereUntertitel,
  meldeUntertitel,
  UNTERTITEL_DAUER_MS,
  UNTERTITEL_HOECHSTENS,
  untertitelschluessel,
  type Untertitelart,
} from "./untertitel";
import { untertiteltext } from "./untertiteltext";

const STILL: Spielwerk = {
  setzePegel: () => undefined,
  spieleSchleife: () => Promise.resolve(),
  setzeNaehe: () => undefined,
  spieleEinmal: () => Promise.resolve(),
  stoppeAlles: () => undefined,
};

/** Eine Regie ohne Web Audio, die ihre Meldungen mitschreibt. */
function regieMitProtokoll(untertitel = true, tonAn = true) {
  const gemeldet: string[] = [];
  const regie = new Tonregie(
    () => STILL,
    (art: Untertitelart, angabe: string) => gemeldet.push(`${art} ${angabe}`),
  );
  regie.stelleEin({ ...STANDARD_ABENTEUERTON, untertitel }, tonAn);
  return { regie, gemeldet };
}

describe("Untertitel: Schlüssel", () => {
  it("folgt dem Dateinamen, ohne Variante, mit Binnenmajuskeln", () => {
    expect(untertitelschluessel("klang", "klang/uhr_ticken.m4a")).toEqual([
      "untertitel.klang.uhrTicken",
    ]);
    expect(untertitelschluessel("klang", "knarren-2")[0]).toBe("untertitel.klang.knarren");
    expect(untertitelschluessel("musik", "musik/maple-falls.ogg")).toEqual([
      "untertitel.musik.mapleFalls",
    ]);
    expect(untertitelschluessel("musik", "mapleFalls")[0]).toBe("untertitel.musik.mapleFalls");
  });

  it("fällt auf allgemeinere Schlüssel zurück", () => {
    expect(untertitelschluessel("musik", "riverton.pavillon")).toEqual([
      "untertitel.musik.riverton.pavillon",
      "untertitel.musik.riverton",
    ]);
    expect(untertitelschluessel("klang", "turmuhr12")).toEqual([
      "untertitel.klang.turmuhr12",
      "untertitel.klang.turmuhr",
    ]);
    expect(untertitelschluessel("klang", "blindschach.e4")).toEqual([
      "untertitel.klang.blindschach.e4",
      "untertitel.klang.blindschach",
    ]);
  });
});

describe("Untertitel: Anzeige", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    leereUntertitel();
    vi.useRealTimers();
  });

  it("zeigt eine Zeile für eine feste Zeit", () => {
    meldeUntertitel("klang", "knarren");
    expect(aktuelleUntertitel().map((z) => z.angabe)).toEqual(["knarren"]);
    vi.advanceTimersByTime(UNTERTITEL_DAUER_MS);
    expect(aktuelleUntertitel()).toEqual([]);
  });

  it("zeigt Gleiches nicht doppelt und höchstens zwei Zeilen", () => {
    meldeUntertitel("klang", "knarren");
    meldeUntertitel("klang", "knarren");
    expect(aktuelleUntertitel()).toHaveLength(1);
    meldeUntertitel("klang", "pfiff");
    meldeUntertitel("musik", "weg");
    expect(aktuelleUntertitel().map((z) => z.angabe)).toEqual(["pfiff", "weg"]);
    expect(aktuelleUntertitel()).toHaveLength(UNTERTITEL_HOECHSTENS);
  });
});

describe("Untertitel: wann die Regie meldet", () => {
  it("Musik nur beim Wechsel, Dauergeräusch bei jedem Betreten", () => {
    const { regie, gemeldet } = regieMitProtokoll();
    regie.karteBetreten("musik/maple-falls.ogg", "klang/wasserfall.m4a");
    regie.karteBetreten("musik/maple-falls.ogg", "klang/wasserfall.m4a");
    regie.karteBetreten("musik/maple-falls.club.m4a", null);
    expect(gemeldet).toEqual([
      "musik musik/maple-falls.ogg",
      "klang klang/wasserfall.m4a",
      "klang klang/wasserfall.m4a",
      "musik musik/maple-falls.club.m4a",
    ]);
  });

  it("meldet einmalige Klänge und Wechsel im Dialog, auch bei ausgeschaltetem Ton", () => {
    const { regie, gemeldet } = regieMitProtokoll(true, false);
    regie.karteBetreten("weg", null);
    regie.dialogzeile(tagsAus(["musik:ambroseThema", "klang:knarren"]));
    regie.dialogzeile(tagsAus(["sprecher:ambrose"]));
    expect(gemeldet).toEqual(["musik weg", "klang knarren", "musik ambroseThema"]);
  });

  it("schweigt, solange die Einstellung aus ist; eingeschaltet zeigt sie, was gerade klingt", () => {
    const { regie, gemeldet } = regieMitProtokoll(false);
    regie.karteBetreten("weg", "klang/fluss.m4a");
    regie.dialogzeile(tagsAus(["klang:knarren"]));
    expect(gemeldet).toEqual([]);
    regie.stelleEin({ ...STANDARD_ABENTEUERTON, untertitel: true }, true);
    expect(gemeldet).toEqual(["musik weg", "klang klang/fluss.m4a"]);
  });
});

describe("Untertitel: Texte", () => {
  it("setzt die Spieltexte in ihren Rahmen", () => {
    expect(untertiteltext({ art: "klang", angabe: "klang/wind_fenster.m4a" })).toBe(
      "[Wind pfeift am Fenster]",
    );
    expect(untertiteltext({ art: "musik", angabe: "musik/maple-falls.ogg" })).toBe(
      "[Musik: warm, tastend]",
    );
  });

  it("zeigt zu einem unbekannten Klang nichts", () => {
    expect(untertiteltext({ art: "klang", angabe: "gibtEsNicht" })).toBeNull();
  });
});
