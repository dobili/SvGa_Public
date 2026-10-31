/** Tests des Lernpfads (Gamifizierung P2): Stationen, aktuelle Station, Etappen, Satz, Form. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import type { Datenverzeichnis } from "../../../daten/laden";
import { leereDaten, type Fortschritt } from "../../../speicher/format";
import {
  aktuelleStation,
  etappen,
  hinweistext,
  kapitelDerNummer,
  stationen,
  STATIONSTEILE,
  teilDesKapitels,
  type Stationsteil,
} from "./lernpfad";
import { hoehe, knoten, linie } from "./wegform";

const INDEX = JSON.parse(
  readFileSync(new URL("../../../../public/daten/de/a1/index.json", import.meta.url), "utf8"),
) as Datenverzeichnis;
const LEER = leereDaten(new Date("2026-10-31T12:00:00Z")).fortschritt;
const DATUM = "2026-10-31T12:00:00.000Z";

/** Fortschritt mit allen Abbildungen und Übungen der genannten Kapitel. */
function mitKapiteln(nummern: readonly number[], uebungen = true): Fortschritt {
  const kapitel = INDEX.kapitel.filter((k) => nummern.includes(k.kapitel));
  const gesehen = Object.fromEntries(kapitel.flatMap((k) => k.abbildungen).map((n) => [n, DATUM]));
  const ids = uebungen ? nummern.flatMap((n) => UEBUNGEN_JE_KAPITEL[n] ?? []) : [];
  const geloest = Object.fromEntries(
    ids.map((id) => [id, { kapitel: 0, versuche: 1, geloest: true, zuletzt: DATUM }]),
  );
  return { ...LEER, gesehen, uebungen: geloest } as Fortschritt;
}

describe("Lernpfad: Stationen", () => {
  it("13 Stationen in fünf Etappen nach den Teilen des Buches", () => {
    const liste = stationen(INDEX.kapitel, LEER);
    expect(liste.map((s) => s.kapitel)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const teile = etappen(liste, INDEX.kapitel, LEER);
    expect(teile.map((e) => e.stationen.length)).toEqual([2, 3, 3, 3, 2]);
    expect(teile.every((e) => !e.ordenVerdient)).toBe(true);
    expect(teilDesKapitels(6)).toBe("mittelspiel");
  });

  it("Kapitel 0: erst alle Abbildungen und Übungen machen die Station fertig", () => {
    const nurBilder = stationen(INDEX.kapitel, mitKapiteln([0], false))[0];
    expect(nurBilder?.fertig).toBe(false);
    expect(nurBilder?.anteil.erreicht).toBe(nurBilder?.teile[0]?.anteil.gesamt);
    const alles = stationen(INDEX.kapitel, mitKapiteln([0]))[0];
    expect(alles?.fertig).toBe(true);
  });

  it("Orden der Etappe nach der Ringrechnung: Grundlagen erst mit Kapitel 0 und 1", () => {
    const f0 = mitKapiteln([0]);
    expect(etappen(stationen(INDEX.kapitel, f0), INDEX.kapitel, f0)[0]?.ordenVerdient).toBe(false);
    const f01 = mitKapiteln([0, 1]);
    expect(etappen(stationen(INDEX.kapitel, f01), INDEX.kapitel, f01)[0]?.ordenVerdient).toBe(true);
  });

  it("ein weiterer Bestandteil zählt mit einer Zeile mit", () => {
    const immerEins: Stationsteil = {
      kennung: "probe",
      rest: "lernpfad.rest.uebungen",
      zaehle: () => ({ erreicht: 0, gesamt: 1 }),
    };
    const f = mitKapiteln([0]);
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
    expect(text).toMatch(/^Noch \d+ Abbildungen und \d+ Übungen bis zum Ende von Kapitel 6\./);
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
  it("18 Knoten (13 Stationen, 5 Orden) von oben nach unten, Linie durch alle", () => {
    const liste = stationen(INDEX.kapitel, LEER);
    const alle = knoten(etappen(liste, INDEX.kapitel, LEER));
    expect(alle).toHaveLength(18);
    expect(alle.filter((k) => k.art === "orden").map((k) => k.art === "orden" && k.teil)).toEqual([
      "grundlagen",
      "eroeffnung",
      "mittelspiel",
      "endspiel",
      "praxis",
    ]);
    expect(alle.every((k, i) => i === 0 || k.y > (alle[i - 1]?.y ?? 0))).toBe(true);
    expect(alle.at(-1)?.y).toBeLessThan(hoehe(alle.length));
    expect(
      linie([
        { x: 180, y: 56 },
        { x: 260, y: 140 },
      ]),
    ).toBe("M 180 56 C 180 98 260 98 260 140");
  });
});
