/**
 * Tests des Serienmodus im Taktiktrainer (training/taktikserie.ts): Reihenfolge nach Stufen und
 * Ende der Serie, Rekord „taktikSerie“ in der Rekordtafel.
 */
import { describe, expect, it } from "vitest";
import type { Taktikaufgabe } from "../daten/trainerdaten";
import { leereDaten } from "../speicher/format";
import { REKORDARTEN } from "./rekordarten";
import { pruefeRekorde } from "./rekorde";
import {
  QUELLE_SERIE,
  REKORD_TAKTIKSERIE,
  SERIE_JE_STUFE,
  serienaufgaben,
  serienende,
} from "./taktikserie";
import { ZUFALL } from "./zufall";

const JE_STUFE = 5;
const STUFEN = [1, 2, 3, 4, 5];

function aufgabe(id: string, schwierigkeit: number, motiv: string): Taktikaufgabe {
  return { id, schwierigkeit, motiv, mattbild: null } as unknown as Taktikaufgabe;
}

const ALLE = STUFEN.flatMap((s) =>
  Array.from({ length: JE_STUFE }, (_, i) =>
    aufgabe(`a${s}-${i}`, s, i % 2 === 0 ? "fesselung" : "spiess"),
  ),
);

describe("serienaufgaben", () => {
  it("beginnt mit je drei Aufgaben je Stufe, leichteste zuerst", () => {
    const serie = serienaufgaben(ALLE, "gemischt", ZUFALL);
    expect(serie).toHaveLength(ALLE.length);
    const leiter = serie.slice(0, SERIE_JE_STUFE * STUFEN.length).map((a) => a.schwierigkeit);
    expect(leiter).toEqual(STUFEN.flatMap((s) => Array<number>(SERIE_JE_STUFE).fill(s)));
  });

  it("nimmt danach die übrigen, schwerste zuerst", () => {
    const rest = serienaufgaben(ALLE, "gemischt", ZUFALL)
      .slice(SERIE_JE_STUFE * STUFEN.length)
      .map((a) => a.schwierigkeit);
    expect(rest).toEqual([...rest].sort((a, b) => b - a));
    expect(rest[0]).toBe(5);
  });

  it("hält sich an das Thema und kennt jede Aufgabe nur einmal", () => {
    const serie = serienaufgaben(ALLE, "fesselung", ZUFALL);
    expect(serie.every((a) => a.motiv === "fesselung")).toBe(true);
    expect(new Set(serie.map((a) => a.id)).size).toBe(serie.length);
    expect(serienaufgaben(ALLE, "umwandlung", ZUFALL)).toEqual([]);
  });
});

describe("serienende", () => {
  const laufend = { richtig: 5, falsch: 0, index: 5, anzahl: 40, aufgehoert: false };

  it("läuft ohne Fehler weiter", () => {
    expect(serienende(laufend)).toBeNull();
  });

  it("endet mit dem ersten Fehler, auch bei der letzten Aufgabe", () => {
    expect(serienende({ ...laufend, falsch: 1 })).toBe("fehler");
    expect(serienende({ ...laufend, falsch: 1, index: 40 })).toBe("fehler");
  });

  it("endet, wenn alle Aufgaben gelöst sind oder der Leser aufhört", () => {
    expect(serienende({ ...laufend, index: 40 })).toBe("alle");
    expect(serienende({ ...laufend, aufgehoert: true })).toBe("aufgehoert");
  });
});

describe("Rekord der Serie", () => {
  const heute = new Date("2026-10-31T10:00:00.000Z");

  it("meldet „12 in Folge“ als Rekord und nur eine echte Verbesserung", () => {
    const leer = leereDaten(heute);
    const erste = pruefeRekorde(leer, { quelle: QUELLE_SERIE, wert: 12 }, heute, REKORDARTEN);
    expect(erste.neue).toEqual([{ kennung: REKORD_TAKTIKSERIE, wert: 12, vorher: null }]);
    const gleich = pruefeRekorde(erste.daten, { quelle: QUELLE_SERIE, wert: 12 }, heute, REKORDARTEN);
    expect(gleich.neue).toEqual([]);
  });

  it("zählt eine Serie ohne gelöste Aufgabe nicht", () => {
    const leer = leereDaten(heute);
    expect(pruefeRekorde(leer, { quelle: QUELLE_SERIE, wert: 0 }, heute, REKORDARTEN).neue).toEqual([]);
  });
});
