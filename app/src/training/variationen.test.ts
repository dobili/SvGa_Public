/**
 * Tests für die Varianten: Grenzen, Liste, Lesen aus Rohdaten (Format 8) und die Quellen.
 */
import { describe, expect, it } from "vitest";
import { knotenzahl } from "../schach/variationsbaum";
import {
  grenzeFuer,
  HOECHSTENS_VARIATIONEN,
  mitVariation,
  nachAenderung,
  neueVariationskennung,
  ohneVariation,
  variationenZu,
  type Variation,
  type Variationsknoten,
} from "./variationen";
import { variationenAus } from "./variationenLesen";
import {
  ausAbbildung,
  ausFehler,
  ausPartie,
  ausSammlung,
  ausStellung,
  ENTWURF,
  linieAlsKnoten,
} from "./variationsquellen";

const JETZT = new Date("2026-11-01T10:00:00.000Z");
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function variation(id: string, zuege: readonly Variationsknoten[] = []): Variation {
  const v = ausStellung("grund", GRUND, `Titel ${id}`, JETZT);
  if (!v) throw new Error("keine Grundstellung");
  return { ...v, id, zuege };
}

/** Eine Kette aus ``anzahl`` Springerzügen hin und her (immer legal). */
function springerkette(anzahl: number): Variationsknoten[] {
  const runde = ["Nf3", "Nf6", "Ng1", "Ng8"];
  const sans = Array.from({ length: anzahl }, (_, i) => runde[i % runde.length] ?? "");
  return linieAlsKnoten(GRUND, sans).knoten;
}

describe("Liste und Grenzen", () => {
  it("speichert, ersetzt, ordnet und löscht", () => {
    const a = { ...variation("a"), geaendert: "2026-11-01T09:00:00.000Z" };
    const b = { ...variation("b"), geaendert: "2026-11-01T11:00:00.000Z" };
    const eins = mitVariation([], a);
    if (!("liste" in eins)) throw new Error("abgelehnt");
    const zwei = mitVariation(eins.liste, b);
    if (!("liste" in zwei)) throw new Error("abgelehnt");
    expect(nachAenderung(zwei.liste).map((v) => v.id)).toEqual(["b", "a"]);
    const ersetzt = mitVariation(zwei.liste, { ...a, titel: "neu" });
    expect("liste" in ersetzt && ersetzt.liste.map((v) => v.titel)).toEqual(["neu", "Titel b"]);
    expect(ohneVariation(zwei.liste, "a").map((v) => v.id)).toEqual(["b"]);
  });

  it("meldet die Grenzen statt etwas zu löschen", () => {
    const voll = Array.from({ length: HOECHSTENS_VARIATIONEN }, (_, i) => variation(`v${i}`));
    expect(grenzeFuer(voll, variation("neu"))).toBe("varianten");
    expect(grenzeFuer(voll, { ...variation("v3"), titel: "geändert" })).toBeNull();
    expect(grenzeFuer([], variation("lang", springerkette(601)))).toBe("knoten");
    expect(grenzeFuer([], variation("lang", springerkette(600)))).toBeNull();
    const viele = Array.from({ length: 67 }, (_, i) => variation(`g${i}`, springerkette(600)));
    expect(grenzeFuer(viele, variation("dazu", springerkette(1)))).toBe("gesamt");
  });

  it("findet die Varianten einer Quelle und vergibt eindeutige Kennungen", () => {
    const abb = { ...variation("x"), quelle: { art: "abbildung", nummer: "2.40" } as const };
    const partie = { ...variation("y"), quelle: { art: "partie", id: "p1" } as const };
    const liste = [abb, partie, variation("z")];
    expect(variationenZu(liste, { art: "abbildung", nummer: "2.40" })).toEqual([abb]);
    expect(variationenZu(liste, { art: "partie", id: "p2" })).toEqual([]);
    expect(neueVariationskennung(JETZT, () => 0.5)).toBe(`var-${JETZT.getTime()}-i`);
  });
});

describe("Lesen aus Rohdaten (Format 8)", () => {
  it("liest gültige Einträge, kürzt Texte und beendet Äste an ungültigen Zügen", () => {
    const roh = [
      {
        ...variation("ok"),
        titel: "x".repeat(200),
        zuege: [
          { zug: "e4", zeichen: "!", weiter: [{ zug: "e4", weiter: [] }, { zug: "e5", weiter: [] }] },
          { zug: "Ke2", weiter: [] },
          { zug: "e4", weiter: [] },
        ],
      },
      { id: "kaputt" },
      "Unsinn",
    ];
    const [gelesen, ...rest] = variationenAus(JSON.parse(JSON.stringify(roh)));
    expect(rest).toEqual([]);
    expect(gelesen?.titel).toHaveLength(80);
    expect(gelesen?.zuege).toEqual([
      { zug: "e4", zeichen: "!", weiter: [{ zug: "e5", weiter: [] }] },
    ]);
    expect(variationenAus(undefined)).toEqual([]);
  });

});

describe("Lesen aus Rohdaten: spätere Stufen", () => {
  it("liest Marken ohne Nummer und Farben ohne Nummern (Format 9), Fremdes fällt weg", () => {
    const roh = {
      ...variation("format9"),
      nummernAus: ["rot", "lila", "rot"],
      start: { marken: ["Gd4", "Ge4"], ohneNummer: ["Ge4", "Gh8", 3] },
    };
    const [v] = variationenAus([roh]);
    expect(v?.nummernAus).toEqual(["rot"]);
    expect(v?.start).toEqual({ marken: ["Gd4", "Ge4"], ohneNummer: ["Ge4"] });
    const [alt] = variationenAus([variation("format8")]);
    expect(alt && "nummernAus" in alt).toBe(false);
  });

  it("behält die Felder späterer Stufen und verwirft Fremdes darin", () => {
    const roh = {
      ...variation("stufe2"),
      legende: { rot: "Falle", lila: "x" },
      analysiert: true,
      start: { kommentar: "Start", marken: ["Ge2e4", "Xx", "Re8"], w: 35 },
      zuege: [
        { zug: "e4", herkunft: "engine", nummerntexte: { R2: "Dame fällt", Q: "x" }, b: "e7e5", a: 40, weiter: [] },
      ],
    };
    const [v] = variationenAus([roh]);
    expect(v?.legende).toEqual({ rot: "Falle" });
    expect(v?.analysiert).toBe(true);
    expect(v?.start).toEqual({ kommentar: "Start", marken: ["Ge2e4", "Re8"], w: 35 });
    expect(v?.zuege[0]).toEqual({
      zug: "e4",
      herkunft: "engine",
      nummerntexte: { R2: "Dame fällt" },
      b: "e7e5",
      a: 40,
      weiter: [],
    });
  });

});

describe("Lesen aus Rohdaten: Grenzen", () => {
  it("liest nicht mehr als die Grenzen und keinen Startpfad außerhalb des Baums", () => {
    const lang = { ...variation("lang", springerkette(700)), startpfad: ["d4"] };
    const [v] = variationenAus([lang, lang]);
    expect(knotenzahl(v?.zuege ?? [])).toBe(600);
    expect(v?.startpfad).toEqual([]);
    expect(variationenAus([lang, lang])).toHaveLength(1);
  });
});

describe("Quellen", () => {
  it("kopiert den Buchbaum einer Abbildung und öffnet am Pfad", () => {
    const beispiel = {
      startFen: GRUND,
      zuege: [
        { zug: "e4", zeichen: "" as const, abbildungen: [], weiter: [
          { zug: "e5", zeichen: "!?" as const, abbildungen: ["9.99"], weiter: [] },
        ] },
      ],
    };
    const v = ausAbbildung({ nummer: "9.99", fen: "", beispiel, pfad: ["e4", "e5"] }, "Abb.", JETZT);
    expect(v?.id).toBe(ENTWURF);
    expect(v?.quelle).toEqual({ art: "abbildung", nummer: "9.99" });
    expect(v?.startpfad).toEqual(["e4", "e5"]);
    expect(v?.zuege).toEqual([
      { zug: "e4", herkunft: "buch", weiter: [{ zug: "e5", herkunft: "buch", zeichen: "!?", weiter: [] }] },
    ]);
    // Lehrbild ohne König: keine Regeln, keine Variante.
    expect(ausAbbildung({ nummer: "0.1", fen: "8/8/8/8/8/8/8/8 w - - 0 1", beispiel: null, pfad: [] }, "", JETZT)).toBeNull();
  });

});

describe("Quellen aus eigenen Daten", () => {
  it("macht aus Partie, Fehler und Sammlung Entwürfe mit Herkunft", () => {
    const partie = ausPartie({ id: "p1", startFen: GRUND, zuege: ["e4", "e5", "Qh5"] }, 2, "P", JETZT);
    expect(partie?.startpfad).toEqual(["e4", "e5"]);
    expect(partie?.zuege[0]?.herkunft).toBe("partie");
    const fehler = ausFehler(
      { id: "f1", datum: "", fen: GRUND, satz: "Zu schnell", fehlerart: 1, zug: "f3" },
      "F",
      JETZT,
    );
    expect(fehler?.start).toEqual({ kommentar: "Zu schnell" });
    expect(fehler?.zuege.map((k) => k.zug)).toEqual(["f3"]);
    const sammlung = ausSammlung(
      {
        id: "s1",
        datum: "",
        fen: "",
        herkunft: "abbildung",
        quelle: "2.2",
        eroeffnung: "",
        plan: "Druck auf e5",
        notiz: "",
        verlauf: { startFen: GRUND, zuege: ["e4"] },
      },
      "S",
      JETZT,
    );
    expect(sammlung?.kommentar).toBe("Druck auf e5");
    expect(sammlung?.zuege[0]?.herkunft).toBe("buch");
    expect(sammlung?.startpfad).toEqual(["e4"]);
  });
});
