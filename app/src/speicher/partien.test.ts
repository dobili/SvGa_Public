/**
 * Tests der Partien im Speicher (Format 2): ablegen, begrenzen, Auswertung schreiben, und das
 * Lesen aus Rohdaten mit beschädigten Einträgen. Dazu der Weg durch JSON wie bei der Sicherung.
 */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "../spiel/partie";
import { leereDaten, wandleUm } from "./format";
import {
  legeAb,
  LEERER_SPIELSTAND,
  MAX_PARTIEN,
  mitLaufender,
  mitPartie,
  mitWerten,
  partieAus,
  spielstandAus,
} from "./partien";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const JETZT = new Date("2026-10-15T10:00:00.000Z");
const MINUTE = 60_000;

function partie(id: string): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr: { grundzeitMs: 15 * MINUTE, zuschlagMs: 10_000 },
      ruecknahmeErlaubt: true,
      abbildung: "1.26",
    },
    id,
    JETZT.toISOString(),
  );
  if (!neu) throw new Error("nicht spielbar");
  const fehler: Partiezug = {
    san: "f6",
    von: "engine",
    quelle: "fehler",
    fehler: "ungenau",
    verlust: 0.8,
  };
  const mitZuegen = [leserzug("e4"), fehler, leserzug("Qh5+")].reduce<Partie | null>(
    (p, zug) => (p ? ziehe(p, zug) : null),
    neu,
  );
  if (!mitZuegen) throw new Error("Zug geht nicht");
  return mitZuegen;
}

function durchJson<T>(wert: T): unknown {
  return JSON.parse(JSON.stringify(wert));
}

describe("Spielstand", () => {
  it("legt beendete Partien vorne ab und gibt die laufende frei", () => {
    const p = partie("a");
    const stand = legeAb(mitLaufender(LEERER_SPIELSTAND, p), p);
    expect(stand.laufend).toBeNull();
    expect(stand.partien.map((e) => e.partie.id)).toEqual(["a"]);
    expect(legeAb(stand, partie("b")).partien.map((e) => e.partie.id)).toEqual(["b", "a"]);
  });

  it(`behält höchstens ${MAX_PARTIEN} Partien`, () => {
    let stand = LEERER_SPIELSTAND;
    for (let i = 0; i <= MAX_PARTIEN; i++) stand = legeAb(stand, partie(`p${i}`));
    expect(stand.partien).toHaveLength(MAX_PARTIEN);
    expect(stand.partien[0]?.partie.id).toBe(`p${MAX_PARTIEN}`);
  });

  it("eine beendete Partie läuft nach der Rücknahme wieder", () => {
    const p = partie("a");
    const beendet = { ...p, ende: { art: "aufgabe", sieger: "black" } as const };
    const abgelegt = mitPartie(mitLaufender(LEERER_SPIELSTAND, p), beendet);
    expect(abgelegt.laufend).toBeNull();
    const wieder = mitPartie(abgelegt, p);
    expect(wieder.laufend).toEqual(p);
    expect(wieder.partien).toEqual([]);
  });

  it("schreibt die Auswertung zur richtigen Partie", () => {
    const beste = ["e2e4", "g8f6", "d2d4", "e8f7"];
    const stand = mitWerten(
      legeAb(LEERER_SPIELSTAND, partie("a")),
      "a",
      [0.2, 0.3, 0.1, 1.5],
      beste,
    );
    expect(stand.partien[0]?.werte).toEqual([0.2, 0.3, 0.1, 1.5]);
    expect(stand.partien[0]?.beste).toEqual(beste);
  });
});

describe("Lesen aus Rohdaten", () => {
  it("eine Partie übersteht den Weg durch JSON unverändert", () => {
    const p = partie("a");
    expect(partieAus(durchJson(p))).toEqual(p);
  });

  it("Laufende und beendete Partie bleiben beim Einspielen erhalten", () => {
    const spiel = mitLaufender(
      mitWerten(legeAb(LEERER_SPIELSTAND, partie("a")), "a", [0, 1, 2, 3], ["a", "b", "c", ""]),
      partie("b"),
    );
    const daten = { ...leereDaten(JETZT), spiel };
    expect(wandleUm(durchJson(daten), JETZT)).toEqual({
      ok: true,
      daten,
      vonVersion: daten.schemaVersion,
    });
  });

  it("eine laufende Uhr steht nach dem Laden, mit der gespeicherten Restzeit", () => {
    const p = partie("a");
    const laufend = {
      ...p,
      uhr: { restMs: { white: 5 * MINUTE, black: 4 * MINUTE }, laeuft: "white", seitMs: 1 },
    };
    const geladen = partieAus(durchJson(laufend));
    expect(geladen?.uhr).toEqual({
      restMs: { white: 5 * MINUTE, black: 4 * MINUTE },
      laeuft: null,
      seitMs: 1,
    });
  });

  it("ein unpassender Zug kürzt die Partie vor ihm", () => {
    const roh = durchJson(partie("a")) as { zuege: { san: string }[] };
    const zweiter = roh.zuege[1];
    if (zweiter) zweiter.san = "Ke5";
    expect(partieAus(roh)?.zuege.map((z) => z.san)).toEqual(["e4"]);
  });

  it("verwirft Partien ohne spielbare Startstellung oder mit fremder Stufe", () => {
    const roh = durchJson(partie("a")) as { einstellung: Record<string, unknown> };
    expect(partieAus({ ...roh, einstellung: { ...roh.einstellung, stufe: 9 } })).toBeNull();
    expect(
      partieAus({
        ...roh,
        einstellung: { ...roh.einstellung, startFen: "8/8/8/8/8/8/8/8 w - - 0 1" },
      }),
    ).toBeNull();
  });

  it("Werte, die nicht zur Partie passen, fallen weg", () => {
    const stand = mitWerten(legeAb(LEERER_SPIELSTAND, partie("a")), "a", [0], ["e2e4"]);
    expect(spielstandAus(durchJson(stand)).partien[0]?.werte).toEqual([]);
  });

  it("Unsinn ergibt einen leeren Spielstand mit Standardvorlieben", () => {
    expect(spielstandAus("x")).toEqual(LEERER_SPIELSTAND);
    const stand = spielstandAus({
      laufend: 3,
      partien: [1, { partie: {} }],
      vorlieben: { stufe: 4 },
    });
    expect(stand.laufend).toBeNull();
    expect(stand.partien).toEqual([]);
    expect(stand.vorlieben.stufe).toBe(4);
    expect(stand.vorlieben.ruecknahmeErlaubt).toBe(true);
  });
});
