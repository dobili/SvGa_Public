/**
 * Tests des Lernpfads (Gamifizierung P2): Stationen mit Abbildungen, Übungen, Warum-Fragen und
 * Lernzielen (6.11.2026), aktuelle Station, Etappen mit Orden nach der Ringrechnung, Satz, Form.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import type { Datenverzeichnis, Nachschlagen } from "../../../daten/laden";
import { leereDaten, type Fortschritt, type Lernstand } from "../../../speicher/format";
import {
  aktuelleStation,
  etappen,
  hinweistext,
  kapitelDerNummer,
  stationen,
  STATIONSTEILE,
  teilDesKapitels,
  type Stationsquelle,
  type Stationsteil,
} from "./lernpfad";
import { baender, hoehe, KOPF, knoten, linie } from "./wegform";

const INDEX = JSON.parse(
  readFileSync(new URL("../../../../public/daten/de/a1/index.json", import.meta.url), "utf8"),
) as Datenverzeichnis;
const NACHSCHLAGEN = JSON.parse(
  readFileSync(
    new URL("../../../../public/daten/de/a1/nachschlagen.json", import.meta.url),
    "utf8",
  ),
) as Nachschlagen;
const LERNZIELE = new Map(NACHSCHLAGEN.lernziele.map((z) => [z.kapitel, z.punkte.length]));
const LEERER_FORTSCHRITT = leereDaten(new Date("2026-10-31T12:00:00Z")).fortschritt;
const LEER: Stationsquelle = {
  fortschritt: LEERER_FORTSCHRITT,
  lernstand: {},
  lernziele: LERNZIELE,
};
const DATUM = "2026-10-31T12:00:00.000Z";

/** Was mitKapiteln erledigt; Abbildungen sind immer angesehen. */
interface Erledigt {
  readonly uebungen?: boolean;
  readonly warum?: boolean;
  readonly lernziele?: boolean;
}

/** Alle Warum-Fragen der genannten Kapitel richtig beantwortet (Stellen 0 bis n−1). */
function beantwortet(nummern: readonly number[]): Fortschritt["warum"] {
  const kapitel = INDEX.kapitel.filter((k) => nummern.includes(k.kapitel));
  return Object.fromEntries(
    kapitel.flatMap((k) =>
      Object.entries(k.warum ?? {}).map(([id, n]) => [id, Array.from({ length: n }, (_, i) => i)]),
    ),
  );
}

/** Alle Lernziele der genannten Kapitel abgehakt. */
function alleLernziele(nummern: readonly number[]): Lernstand {
  return Object.fromEntries(
    nummern.map((n) => [n, Array.from({ length: LERNZIELE.get(n) ?? 0 }, (_, i) => i)]),
  );
}

/** Quelle mit allen Abbildungen der Kapitel und (ohne Angabe) allem anderen erledigt. */
function mitKapiteln(nummern: readonly number[], erledigt: Erledigt = {}): Stationsquelle {
  const { uebungen = true, warum = true, lernziele = true } = erledigt;
  const kapitel = INDEX.kapitel.filter((k) => nummern.includes(k.kapitel));
  const gesehen = Object.fromEntries(kapitel.flatMap((k) => k.abbildungen).map((n) => [n, DATUM]));
  const ids = uebungen ? nummern.flatMap((n) => UEBUNGEN_JE_KAPITEL[n] ?? []) : [];
  const geloest = Object.fromEntries(
    ids.map((id) => [id, { kapitel: 0, versuche: 1, geloest: true, zuletzt: DATUM }]),
  );
  const fortschritt = {
    ...LEERER_FORTSCHRITT,
    gesehen,
    uebungen: geloest,
    warum: warum ? beantwortet(nummern) : {},
  } as Fortschritt;
  return { fortschritt, lernstand: lernziele ? alleLernziele(nummern) : {}, lernziele: LERNZIELE };
}

describe("Lernpfad: Stationen", () => {
  it("13 Stationen in fünf Etappen nach den Teilen des Buches", () => {
    const liste = stationen(INDEX.kapitel, LEER);
    expect(liste.map((s) => s.kapitel)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const teile = etappen(liste, INDEX.kapitel, LEER.fortschritt);
    expect(teile.map((e) => e.stationen.length)).toEqual([2, 3, 3, 3, 2]);
    expect(teile.every((e) => !e.ordenVerdient)).toBe(true);
    expect(teilDesKapitels(6)).toBe("mittelspiel");
  });

  it("Kapitel 0: erst alle Abbildungen und Übungen machen die Station fertig", () => {
    const nurBilder = stationen(
      INDEX.kapitel,
      mitKapiteln([0], { uebungen: false, lernziele: false }),
    )[0];
    expect(nurBilder?.fertig).toBe(false);
    expect(nurBilder?.anteil.erreicht).toBe(nurBilder?.teile[0]?.anteil.gesamt);
    const alles = stationen(INDEX.kapitel, mitKapiteln([0]))[0];
    expect(alles?.fertig).toBe(true);
  });

  it("Orden der Etappe nach der Ringrechnung: Grundlagen erst mit Kapitel 0 und 1", () => {
    const f0 = mitKapiteln([0]);
    expect(
      etappen(stationen(INDEX.kapitel, f0), INDEX.kapitel, f0.fortschritt)[0]?.ordenVerdient,
    ).toBe(false);
    const f01 = mitKapiteln([0, 1]);
    expect(
      etappen(stationen(INDEX.kapitel, f01), INDEX.kapitel, f01.fortschritt)[0]?.ordenVerdient,
    ).toBe(true);
  });

  it("Warum-Fragen und Lernziele: zählen für die Station, der Orden bleibt (Ringrechnung)", () => {
    const ohne = mitKapiteln([0, 1], { warum: false, lernziele: false });
    const liste = stationen(INDEX.kapitel, ohne);
    const eins = liste[1];
    const teil = (kennung: string) =>
      eins?.teile[STATIONSTEILE.findIndex((x) => x.kennung === kennung)];
    expect(teil("warum")?.anteil).toEqual({ erreicht: 0, gesamt: 18 });
    expect(teil("lernziele")?.anteil.gesamt).toBe(LERNZIELE.get(1));
    expect(eins?.fertig).toBe(false);
    expect(liste[0]?.fertig).toBe(false);
    // Der Orden der Etappe ist trotzdem verdient: Er folgt Abbildungen und Übungen.
    expect(etappen(liste, INDEX.kapitel, ohne.fortschritt)[0]?.ordenVerdient).toBe(true);
    expect(hinweistext(liste, 1, true)).toBe(
      `Noch 18 Warum-Fragen und ${LERNZIELE.get(1)} Lernziele bis zum Ende von Kapitel 1. ` +
        "Den Orden „Teil Grundlagen“ hast du schon.",
    );
    expect(stationen(INDEX.kapitel, mitKapiteln([0, 1]))[1]?.fertig).toBe(true);
  });

  it("Einzahl der Reste und nur richtig beantwortete Stellen zählen", () => {
    const fast = mitKapiteln([1]);
    const ohneEine: Stationsquelle = {
      ...fast,
      fortschritt: { ...fast.fortschritt, warum: { ...fast.fortschritt.warum, "1.26": [] } },
      lernstand: { 1: (fast.lernstand[1] ?? []).slice(1) },
    };
    const liste = stationen(INDEX.kapitel, ohneEine);
    expect(hinweistext(liste, 1)).toMatch(/^Noch 1 Warum-Frage und 1 Lernziel bis zum Ende/);
  });

  it("alte Daten ohne „warum“ im Verzeichnis: keine Warum-Fragen, kein Fehler", () => {
    const alt = INDEX.kapitel.map((k) => ({ kapitel: k.kapitel, abbildungen: k.abbildungen }));
    const station = stationen(alt, LEER)[1];
    expect(station?.teile.map((x) => x.anteil.gesamt)[2]).toBe(0);
  });

  it("ein weiterer Bestandteil zählt mit einer Zeile mit", () => {
    const immerEins: Stationsteil = {
      kennung: "probe",
      rest: "lernpfad.rest.uebungen",
      zaehle: () => ({ erreicht: 0, gesamt: 1 }),
    };
    const f = mitKapiteln([0]);
    expect(stationen(INDEX.kapitel, f)[0]?.fertig).toBe(true);
    expect(stationen(INDEX.kapitel, f, [...STATIONSTEILE, immerEins])[0]?.fertig).toBe(false);
  });
});

describe("Lernpfad: aktuelle Station und Satz", () => {
  it("bleibt beim Kapitel der zuletzt geöffneten Abbildung, auch wenn vorn etwas fehlt", () => {
    const liste = stationen(INDEX.kapitel, LEER);
    expect(aktuelleStation(liste, kapitelDerNummer("6.21"))).toBe(6);
    expect(aktuelleStation(liste, null)).toBe(0);
    const ohneNull = stationen(INDEX.kapitel, mitKapiteln([0]));
    expect(aktuelleStation(ohneNull, null)).toBe(1);
    expect(kapitelDerNummer("abc")).toBeNull();
  });

  it("nennt den Rest des Kapitels und die Kapitel bis zum Orden", () => {
    const liste = stationen(INDEX.kapitel, LEER);
    const text = hinweistext(liste, 6);
    expect(text).toMatch(
      /^Noch \d+ Abbildungen, \d+ Übungen, 16 Warum-Fragen und 10 Lernziele bis zum Ende von Kapitel 6\./,
    );
    expect(text).toContain(
      "Danach fehlen dir noch die Kapitel 5 und 7 bis zum Orden „Teil Mittelspiel“.",
    );
    const fast = stationen(INDEX.kapitel, mitKapiteln([5, 6]));
    expect(hinweistext(fast, 7)).toContain("Danach hast du den Orden „Teil Mittelspiel“.");
    const nurSieben = stationen(INDEX.kapitel, mitKapiteln([5]));
    expect(hinweistext(nurSieben, 6)).toContain("nur noch Kapitel 7 bis zum Orden");
  });

  it("alles fertig: der Satz zum ganzen Weg", () => {
    const alle = mitKapiteln(INDEX.kapitel.map((k) => k.kapitel));
    const liste = stationen(INDEX.kapitel, alle);
    expect(aktuelleStation(liste, 3)).toBe(12);
    expect(hinweistext(liste, 12)).toContain("ganzen Weg");
  });
});

describe("Lernpfad: Form", () => {
  it("18 Knoten (13 Stationen, 5 Orden) von oben nach unten, fünf Bänder, Linie durch alle", () => {
    const liste = stationen(INDEX.kapitel, LEER);
    const alle = knoten(etappen(liste, INDEX.kapitel, LEER.fortschritt));
    expect(alle).toHaveLength(18);
    expect(alle.filter((k) => k.art === "orden").map((k) => k.art === "orden" && k.teil)).toEqual([
      "grundlagen",
      "eroeffnung",
      "mittelspiel",
      "endspiel",
      "praxis",
    ]);
    expect(alle.every((k, i) => i === 0 || k.y > (alle[i - 1]?.y ?? 0))).toBe(true);
    const flaeche = hoehe(alle.length, 5);
    expect(alle.at(-1)?.y).toBeLessThan(flaeche);
    // Fünf Bänder der Landschaft (Gestaltung B1), lückenlos von 0 bis zur Höhe.
    const streifen = baender(alle, flaeche);
    expect(streifen.map((b) => b.teil)).toEqual([
      "grundlagen",
      "eroeffnung",
      "mittelspiel",
      "endspiel",
      "praxis",
    ]);
    expect(streifen[0]?.y0).toBe(0);
    expect(streifen.at(-1)?.y1).toBe(flaeche);
    expect(streifen.every((b, i) => i === 0 || b.y0 === streifen[i - 1]?.y1)).toBe(true);
    // Jede Station liegt mit Abstand unter dem Kopf ihres Bandes (Platz für „Teil 1“).
    for (const k of alle) {
      const band = streifen.find((b) => b.teil === (k.art === "station" ? k.station.teil : k.teil));
      expect(k.y - (band?.y0 ?? 0)).toBeGreaterThanOrEqual(KOPF);
    }
    expect(
      linie([
        { x: 180, y: 56 },
        { x: 260, y: 140 },
      ]),
    ).toBe("M 180 56 C 180 98 260 98 260 140");
  });
});
