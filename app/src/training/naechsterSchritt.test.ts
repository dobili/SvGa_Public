/**
 * Tests von „Dein nächster Schritt“ (Gamifizierung P1): Rangfolge der sechs Vorschlagsarten, je
 * Fall eine erzeugte Datenlage, dazu Themennamen und „Nicht jetzt“ bis morgen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import {
  blendeNaechsterSchrittAus,
  naechsterSchrittSichtbar,
} from "../ui/komponenten/start/naechsterSchrittMerker";
import {
  kapitelFuerUebungen,
  tagesaufgabeHeuteErledigt,
  vorschlaege,
  type Kapitelangabe,
  type Lage,
} from "./naechsterSchritt";
import { themennameSchluessel, trainerZumThema } from "./themennamen";

const JETZT = new Date(2026, 9, 31, 10);
const GESTERN = "2026-10-30T09:00:00.000Z";
const KAPITEL: readonly Kapitelangabe[] = [
  { kapitel: 0, titel: "Null", abbildungen: ["0.1", "0.2"] },
  { kapitel: 1, titel: "Eins", abbildungen: ["1.1", "1.2", "1.3", "1.4", "1.5"] },
];

/** Eine Lage mit leeren Daten, Tagesaufgabe erledigt; Teile lassen sich überschreiben. */
function lage(teil: Partial<Lage> = {}, daten: Partial<Nutzerdaten> = {}): Lage {
  return {
    daten: { ...leereDaten(JETZT), ...daten },
    kapitel: KAPITEL,
    uebungen: {},
    zuletzt: null,
    tagesaufgabeErledigt: true,
    jetzt: JETZT,
    ...teil,
  };
}

/** Gesehene Abbildungen als Fortschritt. */
function gesehen(...nummern: string[]): Partial<Nutzerdaten> {
  const leer = leereDaten(JETZT).fortschritt;
  return {
    fortschritt: { ...leer, gesehen: Object.fromEntries(nummern.map((n) => [n, GESTERN])) },
  };
}

/** So viele fällige Karten. */
function faelligeKarten(anzahl: number): Partial<Nutzerdaten> {
  const karte = { kasten: 1, faellig: GESTERN, verlauf: [] };
  return {
    karten: Object.fromEntries(Array.from({ length: anzahl }, (_, i) => [`uebung:u${i}`, karte])),
  };
}

const arten = (l: Lage) => vorschlaege(l).map((v) => v.art);

describe("Rangfolge der Vorschläge", () => {
  it("schlägt ab drei fälligen Karten Wiederholen vor, mit grober Dauer", () => {
    const [erster] = vorschlaege(lage({ tagesaufgabeErledigt: false }, faelligeKarten(4)));
    expect(erster?.art).toBe("faellig");
    expect(erster?.werte).toEqual({ anzahl: 4, minuten: 3 });
    expect(erster?.ziel).toEqual({ bildschirm: "zusatz", kennung: "naechster", wert: "wiederholung" });
    expect(arten(lage({}, faelligeKarten(2)))).not.toContain("faellig");
    // Verwaiste Karten zählen nicht: dieselbe Zahl wie die Übersicht im Training.
    expect(arten(lage({ faelligAnzahl: 2 }, faelligeKarten(5)))).not.toContain("faellig");
    const [mitZahl] = vorschlaege(lage({ faelligAnzahl: 4 }, faelligeKarten(9)));
    expect(mitZahl?.werte).toMatchObject({ anzahl: 4 });
  });

  it("nennt die offene Tagesaufgabe vor dem Weiterlesen, höchstens drei Vorschläge", () => {
    const l = lage({ tagesaufgabeErledigt: false }, { ...faelligeKarten(3), ...gesehen("0.1", "0.2") });
    expect(arten(l)).toEqual(["faellig", "tagesaufgabe", "weiterlesen"]);
  });

  it("schlägt Neulingen noch keine Tagesaufgabe vor, erst nach Kapitel 0 (Niveau)", () => {
    expect(arten(lage({ tagesaufgabeErledigt: false }))).not.toContain("tagesaufgabe");
    expect(arten(lage({ tagesaufgabeErledigt: false }, gesehen("0.1")))).not.toContain(
      "tagesaufgabe",
    );
  });

  it("fängt vorn an, wenn eine Abbildung nur kurz offen war, und liest dort weiter", () => {
    expect(vorschlaege(lage({ zuletzt: "1.2" }))[0]?.ziel).toEqual({
      bildschirm: "abbildung",
      nummer: "0.1",
    });
    const kurz = vorschlaege(lage({ zuletzt: "1.3" }, gesehen("0.1", "0.2", "1.1")))[0];
    expect(kurz?.werte).toMatchObject({ nummer: "1.3" });
  });

  it("lässt neue Leser vorn anfangen", () => {
    const [erster] = vorschlaege(lage());
    expect(erster?.text).toBe("naechster.anfangen");
    expect(erster?.ziel).toEqual({ bildschirm: "abbildung", nummer: "0.1" });
  });

  it("liest nach der zuletzt geöffneten Abbildung weiter, sonst im nächsten Kapitel", () => {
    const mitten = vorschlaege(lage({ zuletzt: "1.2" }, gesehen("0.1", "1.1", "1.2")))[0];
    expect(mitten?.text).toBe("naechster.weiterlesen");
    expect(mitten?.werte).toEqual({ kapitel: 1, titel: "Eins", nummer: "1.3" });
    const kapitelfertig = vorschlaege(lage({ zuletzt: "0.2" }, gesehen("0.1", "0.2")))[0];
    expect(kapitelfertig?.ziel).toEqual({ bildschirm: "abbildung", nummer: "1.1" });
  });

  it("schlägt offene Übungen erst ab 80 % gesehenen Abbildungen vor", () => {
    const daten = gesehen("0.1", "0.2", "1.1", "1.2", "1.3", "1.4", "1.5");
    const leer = leereDaten(JETZT).fortschritt;
    const fortschritt = {
      ...leer,
      gesehen: daten.fortschritt?.gesehen ?? {},
      uebungen: { a: { kapitel: 1, versuche: 1, geloest: true, zuletzt: GESTERN } },
    };
    const v = vorschlaege(lage({ uebungen: { 1: ["a", "b"] } }, { fortschritt }))[0];
    expect(v?.text).toBe("naechster.uebungenEins");
    expect(v?.ziel).toEqual({
      bildschirm: "uebung",
      kapitel: 1,
      id: "b",
      reihe: [{ kapitel: 1, id: "b" }],
    });
    const zuWenig = lage({ uebungen: { 1: ["a", "b"] } }, gesehen("1.1", "1.2", "1.3"));
    expect(arten(zuWenig)).not.toContain("uebungen");
  });

  it("schlägt das schwächste Thema unter 70 % mit seinem Trainer vor", () => {
    const fesselung = { richtig: 5, falsch: 4, letzte: "rfrfrfrfr", tage: [], zuletzt: GESTERN };
    const gabel = { richtig: 9, falsch: 1, letzte: "rrrrrrrrrf", tage: [], zuletzt: GESTERN };
    const themen = { "taktik:fesselung": fesselung, "taktik:doppelangriff": gabel };
    const v = vorschlaege(lage({}, { themen })).find((x) => x.art === "thema");
    expect(v?.werte).toEqual({ richtig: 5, anzahl: 9 });
    expect(v?.namen).toEqual({ thema: "motiv.name.fesselung" });
    expect(v?.ziel).toEqual({
      bildschirm: "trainer",
      kennung: "taktik",
      thema: "taktik:fesselung",
    });
    const sicher = { "taktik:doppelangriff": gabel };
    expect(arten(lage({}, { themen: sicher }))).not.toContain("thema");
  });

  it("übernimmt den Vorschlag der Fehlerdatenbank", () => {
    const eintrag = { id: "f1", datum: GESTERN, fen: "8/8/8/8/8/8/8/8 w - - 0 1", satz: "" };
    const fehler = [{ ...eintrag, fehlerart: 1 }, { ...eintrag, id: "f2", fehlerart: 1 }];
    const alles = gesehen("0.1", "0.2", "1.1", "1.2", "1.3", "1.4", "1.5");
    const v = vorschlaege(lage({}, { ...alles, fehler }))[0];
    expect(v?.art).toBe("fehler");
    expect(v?.werte).toEqual({ kapitel: 1 });
    expect(v?.ziel).toEqual({ bildschirm: "trainer", kennung: "roentgen" });
  });

  it("schlägt bei sehr vielen fälligen Karten eine Portion vor (Bug-Test 1.11.2026)", () => {
    const [erster] = vorschlaege(lage({ faelligAnzahl: 200 }, faelligeKarten(3)));
    expect(erster?.text).toBe("naechster.faelligViele");
    expect(erster?.werte).toEqual({ anzahl: 200, portion: 20, minuten: 14 });
    expect(erster?.kurz).toBe("buchlook.kurz.faelligViele");
    const [genau] = vorschlaege(lage({ faelligAnzahl: 20 }, faelligeKarten(3)));
    expect(genau?.text).toBe("naechster.faellig");
    expect(genau?.kurz).toBeUndefined();
  });

  it("nimmt die Übungen des zuletzt gelesenen Kapitels vor denen von Kapitel 0", () => {
    const daten = gesehen("0.1", "0.2", "1.1", "1.2", "1.3", "1.4", "1.5");
    const uebungen = { 0: ["n"], 1: ["e"] };
    const v = vorschlaege(lage({ uebungen, zuletzt: "1.5" }, daten)).find((x) => x.art === "uebungen");
    expect(v?.werte).toEqual({ kapitel: 1, anzahl: 1 });
    const ohneZuletzt = vorschlaege(lage({ uebungen }, daten)).find((x) => x.art === "uebungen");
    expect(ohneZuletzt?.werte).toMatchObject({ kapitel: 1 });
  });

  it("zieht das Kapitel eines eigenen Ziels vor, auch wenn es noch nicht gelesen ist", () => {
    const leer = leereDaten(JETZT);
    const ziele = { ...leer.ziele, angeheftet: [{ art: "kapitel" as const, kapitel: 1 }] };
    const daten = { ...gesehen("0.1", "0.2"), ziele };
    const v = vorschlaege(lage({ uebungen: { 0: ["n"], 1: ["e"] }, zuletzt: "0.2" }, daten));
    expect(v.find((x) => x.art === "uebungen")?.werte).toEqual({ kapitel: 1, anzahl: 1 });
    expect(kapitelFuerUebungen({ ...leer, ziele }, KAPITEL)).toEqual([1]);
  });

  it("meldet einen einzelnen Eintrag der Fehlerdatenbank noch nicht als Häufung", () => {
    const eintrag = { id: "f1", datum: GESTERN, fen: "8/8/8/8/8/8/8/8 w - - 0 1", satz: "" };
    expect(arten(lage({}, { fehler: [{ ...eintrag, fehlerart: 1 }] }))).not.toContain("fehler");
  });

  it("schlägt zuletzt Kurzplan und Partie vor, aber nicht dem Neuling", () => {
    expect(arten(lage())).not.toContain("partie");
    expect(arten(lage())).not.toContain("kurzplan");
    const alles = gesehen("0.1", "0.2", "1.1", "1.2", "1.3", "1.4", "1.5");
    expect(vorschlaege(lage({}, alles))).toEqual([
      expect.objectContaining({
        art: "kurzplan",
        ziel: { bildschirm: "trainer", kennung: "kurzplaene" },
      }),
      expect.objectContaining({ art: "partie", ziel: { bildschirm: "spielen" } }),
    ]);
  });

  it("nimmt eingetragene Arten nach Rang auf", () => {
    const eigen = (art: string, rang: number) => ({
      kennung: art,
      rang,
      ermittle: () => ({
        art,
        text: "naechster.tagesaufgabe" as const,
        werte: {},
        knopf: "naechster.knopf.loesen" as const,
        ziel: { bildschirm: "buch" as const },
      }),
    });
    const liste = [eigen("b", 20), eigen("a", 10), { kennung: "x", rang: 5, ermittle: () => null }];
    expect(vorschlaege(lage(), liste).map((v) => v.art)).toEqual(["a", "b"]);
  });
});

describe("Themennamen und Tagesaufgabe", () => {
  it("findet Name und Trainer aus dem Präfix", () => {
    expect(themennameSchluessel("endspiel:opposition")).toBe("endspiel.thema.opposition");
    expect(themennameSchluessel("struktur:isolani")).toBe("struktur.art.isolani");
    expect(themennameSchluessel("falle")).toBe("trainer.falle.name");
    expect(themennameSchluessel("taktik:unbekannt")).toBe("trainer.taktik.name");
    expect(themennameSchluessel("kapitel:3")).toBeNull();
    expect(trainerZumThema("endspiel:opposition")).toBe("endspiel");
  });

  it("erkennt die heute bearbeitete Tagesaufgabe an Serie oder Tagesprotokoll", () => {
    const leer = leereDaten(JETZT);
    const serie = { letzterTag: "2026-10-31", serie: 1, beste: 1 };
    const keine = { letzterTag: "2026-10-30", serie: 1, beste: 1 };
    expect(tagesaufgabeHeuteErledigt(leer, serie, JETZT)).toBe(true);
    expect(tagesaufgabeHeuteErledigt(leer, keine, JETZT)).toBe(false);
    const mitProtokoll = { ...leer, aktivitaet: { "2026-10-31": { tagesaufgabe: 1 } } };
    expect(tagesaufgabeHeuteErledigt(mitProtokoll, keine, JETZT)).toBe(true);
  });
});

describe("Nicht jetzt", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("blendet die Karte bis zum nächsten Tag aus", () => {
    const ablage = new Map<string, string>();
    const localStorage = {
      getItem: (k: string) => ablage.get(k) ?? null,
      setItem: (k: string, w: string) => ablage.set(k, w),
      removeItem: (k: string) => ablage.delete(k),
    };
    vi.stubGlobal("window", { localStorage });
    expect(naechsterSchrittSichtbar(JETZT)).toBe(true);
    blendeNaechsterSchrittAus(JETZT);
    expect(naechsterSchrittSichtbar(JETZT)).toBe(false);
    expect(naechsterSchrittSichtbar(new Date(2026, 10, 1, 8))).toBe(true);
  });
});
