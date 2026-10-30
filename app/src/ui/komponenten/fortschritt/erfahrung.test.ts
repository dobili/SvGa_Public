/**
 * Tests der Erfahrungspunkte: Gewichte, Stufen mit Balken, Grundlage aus den Nutzerdaten (nur
 * Inhalt zählt, Partien über die Liste der letzten 50 hinaus).
 */
import { describe, expect, it } from "vitest";
import { leereDaten, type Nutzerdaten } from "../../../speicher/format";
import { BEGINN, mitPartien, punkt, testpartie } from "./abzeichen.testhilfe";
import {
  erfahrungspunkte,
  GEWICHTE,
  grundlageAus,
  MIN_HALBZUEGE,
  partienUndSiege,
  STUFEN,
  stufeZu,
} from "./erfahrung";

const LEER = grundlageAus(leereDaten(new Date(BEGINN)), 0);
const LANG = Array.from({ length: MIN_HALBZUEGE }, (_, i) => (i % 2 === 0 ? "Nf3" : "Nf6"));

describe("Erfahrungspunkte", () => {
  it("leere Daten: 0 EP, erste Stufe", () => {
    expect(erfahrungspunkte(LEER)).toBe(0);
    const stufe = stufeZu(0);
    expect(stufe).toMatchObject({ nummer: 1, kennung: "ersterZug", naechsteAb: 100 });
    expect(stufe.anteil).toEqual({ erreicht: 0, gesamt: 100 });
  });

  it("eine gelöste Übung zählt zehnmal so viel wie eine angesehene Abbildung", () => {
    expect(GEWICHTE.uebungen).toBe(GEWICHTE.abbildungen * 10);
    expect(erfahrungspunkte({ ...LEER, abbildungen: 10, uebungen: 2 })).toBe(60);
  });

  it("Stufen: Schwellen steigen, auch die Abstände; 600 EP sind Stufe 4 Rochade", () => {
    const abstaende = STUFEN.slice(1).map((s, i) => s.ab - (STUFEN[i]?.ab ?? 0));
    abstaende.slice(1).forEach((a, i) => expect(a).toBeGreaterThanOrEqual(abstaende[i] ?? 0));
    const stufe = stufeZu(600);
    expect(stufe).toMatchObject({ nummer: 4, kennung: "rochade", naechsteAb: 900 });
    expect(stufe.anteil).toEqual({ erreicht: 100, gesamt: 400 });
  });

  it("höchste Stufe: voller Balken, keine nächste", () => {
    const stufe = stufeZu(99_999);
    expect(stufe.nummer).toBe(STUFEN.length);
    expect(stufe.naechsteAb).toBeNull();
    expect(stufe.anteil).toEqual({ erreicht: 1, gesamt: 1 });
  });
});

describe("Grundlage aus den Nutzerdaten", () => {
  it("zählt nur Inhalt: Sammlung ohne Plan und Notiz, Fehler ohne Satz und kurze Partien nicht", () => {
    const leer = leereDaten(new Date(BEGINN));
    const daten = {
      ...mitPartien([testpartie("kurz", ["e4", "e5"]), testpartie("lang", LANG)], leer),
      sammlung: [
        {
          id: "a",
          datum: BEGINN,
          fen: "",
          herkunft: "fen",
          quelle: "",
          eroeffnung: "",
          plan: "",
          notiz: " ",
        },
        {
          id: "b",
          datum: BEGINN,
          fen: "",
          herkunft: "fen",
          quelle: "",
          eroeffnung: "",
          plan: "Angriff am Königsflügel",
          notiz: "",
        },
      ],
      fehler: [
        { id: "x", datum: BEGINN, fen: "", satz: "", fehlerart: 1 },
        { id: "y", datum: BEGINN, fen: "", satz: "Drohung übersehen", fehlerart: 1 },
      ],
    } satisfies Nutzerdaten;
    const g = grundlageAus(daten, 3);
    expect(g).toMatchObject({ partien: 1, sammlung: 1, fehler: 1, tagesserie: 3 });
  });

  it("Partien und Siege: der größere Wert aus gespeicherten Partien und Wertungsverlauf", () => {
    const daten = mitPartien([testpartie("sieg", LANG, { gewonnen: true })]);
    expect(partienUndSiege(daten.spiel)).toEqual({ partien: 1, siege: 1 });
    const wertung = [punkt(1200, 1200, 1), punkt(1200, 1200, 1), punkt(1200, 1200, 0)];
    expect(partienUndSiege({ ...daten.spiel, wertung })).toEqual({ partien: 3, siege: 2 });
  });
});
