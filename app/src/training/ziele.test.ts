/**
 * Tests der eigenen Ziele (Gamifizierung P13): Bot-Ziel je Zeitart und „egal“, Ringziel bei vollem
 * Ring, Regeln fürs Anheften, Prüfung nach der Partie und Vorschläge sortiert nach Nähe.
 */
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "../daten/uebungsliste-daten";
import type { Partie } from "../spiel/partie";
import type { Besiegte } from "../speicher/besiegt";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import type { Ziel } from "../speicher/gamifizierung";
import { botsDesBuendels } from "../ui/komponenten/fortschritt/ringrechnung";
import {
  anheftsperre,
  HOECHSTENS_ZIELE,
  mitAngeheftetem,
  ohneZiel,
  pruefeZiele,
  zieleNachPartie,
  zielErreicht,
  zielschluessel,
} from "./ziele";
import { zielvorschlaege } from "./zielvorschlaege";

const JETZT = new Date("2026-10-31T12:00:00Z");
const LOTTE: Ziel = { art: "bot", bot: "lotte", zeitart: "rapid" };

function mitBesiegt(daten: Nutzerdaten, besiegt: Partial<Besiegte>): Nutzerdaten {
  return { ...daten, spiel: { ...daten.spiel, besiegt: { ...daten.spiel.besiegt, ...besiegt } } };
}

function mitAngeheftet(daten: Nutzerdaten, ziele: readonly Ziel[]): Nutzerdaten {
  return { ...daten, ziele: { ...daten.ziele, angeheftet: ziele } };
}

function mitGeloest(daten: Nutzerdaten, ids: readonly string[]): Nutzerdaten {
  const uebungen = Object.fromEntries(ids.map((id) => [id, { geloest: true }]));
  return {
    ...daten,
    fortschritt: { ...daten.fortschritt, uebungen: { ...daten.fortschritt.uebungen, ...uebungen } },
  } as Nutzerdaten;
}

const kontext = (daten: Nutzerdaten) => ({ daten, kapitel: null });

describe("Bot-Ziel", () => {
  it("ist erreicht bei einem Sieg in der Zeitart, nicht in einer anderen", () => {
    const leer = leereDaten(JETZT);
    expect(zielErreicht(LOTTE, kontext(mitBesiegt(leer, { blitz: ["lotte"] })))).toBe(false);
    expect(zielErreicht(LOTTE, kontext(mitBesiegt(leer, { rapid: ["lotte"] })))).toBe(true);
  });

  it("„egal“ ist mit einem Sieg in jeder Zeitart erreicht", () => {
    const egal: Ziel = { art: "bot", bot: "lotte", zeitart: "egal" };
    const daten = mitBesiegt(leereDaten(JETZT), { classical: ["lotte"] });
    expect(zielErreicht(egal, kontext(daten))).toBe(true);
  });
});

describe("Ringziel", () => {
  it("ist erreicht, sobald der Ring voll ist", () => {
    const ziel: Ziel = { art: "ring", ring: "ich-bots-4-5-einmal" };
    const bots = botsDesBuendels("4-5");
    const fast = mitBesiegt(leereDaten(JETZT), { blitz: bots.slice(1) });
    expect(zielErreicht(ziel, kontext(fast))).toBe(false);
    expect(zielErreicht(ziel, kontext(mitBesiegt(fast, { rapid: bots.slice(0, 1) })))).toBe(true);
  });

  it("ein Ring eines Buchteils ohne Verzeichnis gilt nicht als erreicht", () => {
    const ziel: Ziel = { art: "ring", ring: "ich-teil-grundlagen" };
    expect(zielErreicht(ziel, kontext(leereDaten(JETZT)))).toBe(false);
  });
});

describe("Anheften und Lösen", () => {
  it("höchstens drei, keine Doppel, nichts schon Erreichtes", () => {
    const leer = leereDaten(JETZT);
    expect(anheftsperre(LOTTE, kontext(mitBesiegt(leer, { rapid: ["lotte"] })))).toBe(
      "schonErreicht",
    );
    const eins = mitAngeheftetem(leer, LOTTE, null);
    expect(mitAngeheftetem(eins, LOTTE, null)).toBe(eins);
    const drei = mitAngeheftet(leer, [
      { art: "bot", bot: "tom", zeitart: "egal" },
      { art: "bot", bot: "marie", zeitart: "egal" },
      { art: "bot", bot: "luis", zeitart: "egal" },
    ]);
    expect(drei.ziele.angeheftet).toHaveLength(HOECHSTENS_ZIELE);
    expect(anheftsperre(LOTTE, kontext(drei))).toBe("voll");
    expect(ohneZiel(eins, LOTTE).ziele.angeheftet).toEqual([]);
  });

  it("der Schlüssel hängt nicht von der Reihenfolge der Felder ab", () => {
    expect(zielschluessel({ zeitart: "rapid", bot: "lotte", art: "bot" } as Ziel)).toBe(
      zielschluessel(LOTTE),
    );
  });
});

describe("Prüfen", () => {
  it("verschiebt erreichte Ziele mit Datum, andere bleiben", () => {
    const tom: Ziel = { art: "bot", bot: "tom", zeitart: "blitz" };
    const daten = mitBesiegt(mitAngeheftet(leereDaten(JETZT), [LOTTE, tom]), { rapid: ["lotte"] });
    const { daten: neu, neu: erreicht } = pruefeZiele(daten, null, JETZT);
    expect(erreicht).toEqual([LOTTE]);
    expect(neu.ziele.angeheftet).toEqual([tom]);
    expect(neu.ziele.erreicht).toEqual([{ ziel: LOTTE, datum: JETZT.toISOString() }]);
  });

  it("nach der Partie: Sieg steht schon in besiegt, das Ziel ist erreicht", () => {
    const daten = mitBesiegt(mitAngeheftet(leereDaten(JETZT), [LOTTE]), { rapid: ["lotte"] });
    const neu = zieleNachPartie(daten, {} as Partie, JETZT);
    expect(neu.ziele.erreicht).toHaveLength(1);
    expect(zieleNachPartie(neu, {} as Partie, JETZT)).toBe(neu);
  });
});

describe("Vorschläge", () => {
  it("sortiert nach Nähe, höchstens fünf, ohne Angeheftetes", () => {
    const kapitel = Number(
      Object.keys(UEBUNGEN_JE_KAPITEL).find((n) => (UEBUNGEN_JE_KAPITEL[Number(n)] ?? []).length >= 2),
    );
    const ids = UEBUNGEN_JE_KAPITEL[kapitel] ?? [];
    const daten = mitGeloest(mitBesiegt(leereDaten(JETZT), { blitz: ["lotte"] }), ids.slice(0, 1));
    const vorschlaege = zielvorschlaege(kontext(daten));
    expect(vorschlaege.length).toBeLessThanOrEqual(5);
    const fehlend = vorschlaege.map((v) => v.fehlend);
    expect(fehlend).toEqual([...fehlend].sort((a, b) => a - b));
    const schluessel = vorschlaege.map((v) => zielschluessel(v.ziel));
    expect(schluessel).toContain(zielschluessel({ art: "bot", bot: "lotte", zeitart: "rapid" }));
    if (ids.length <= 5)
      expect(schluessel).toContain(zielschluessel({ art: "kapitel", kapitel }));
    const angeheftet = mitAngeheftet(daten, [{ art: "bot", bot: "lotte", zeitart: "rapid" }]);
    expect(zielvorschlaege(kontext(angeheftet)).map((v) => zielschluessel(v.ziel))).not.toContain(
      zielschluessel({ art: "bot", bot: "lotte", zeitart: "rapid" }),
    );
  });

  it("schlägt nichts Erreichtes vor", () => {
    const daten = mitBesiegt(leereDaten(JETZT), { blitz: ["lotte"] });
    const vorschlaege = zielvorschlaege(kontext(daten));
    expect(vorschlaege.every((v) => v.fehlend > 0)).toBe(true);
    expect(vorschlaege.map((v) => zielschluessel(v.ziel))).not.toContain(
      zielschluessel({ art: "bot", bot: "lotte", zeitart: "blitz" }),
    );
  });
});
