/**
 * Der eilige Spieler des Durchlaufs (eilig.ts): erste Antwort, aber nicht endlos; Doppeltipp
 * jedes zweite Mal; jeden Laden nur beim ersten Besuch abbrechen; je Karte höchstens einmal
 * umdrehen; ausgeschaltet tut er nichts davon.
 */
import { describe, expect, it } from "vitest";
import { Eiliger, ERSTE_MAX, ladenZu } from "./eilig";
import type { Knopf } from "./lage";

const knopf = (text: string, fenster: string, klasse: string): Knopf =>
  ({ text, fenster, klasse, x: 0, y: 0, kennung: null }) as Knopf;

describe("eiliger Spieler", () => {
  it("nimmt die erste Antwort, auf dieselbe Frage aber nur ERSTE_MAX-mal", () => {
    const e = new Eiliger(true);
    const wahlen = ["Noch eine.", "Nicht jetzt."];
    for (let i = 0; i < ERSTE_MAX; i++) expect(e.antwort("Noch eine Partie?", wahlen)).toBe(0);
    // Sonst spielte er ewig Revanche: danach wählt der gewöhnliche Durchlauf.
    expect(e.antwort("Noch eine Partie?", wahlen)).toBeNull();
    expect(e.antwort("Willst du spielen?", wahlen)).toBe(0);
  });

  it("tippt jedes zweite „Weiter“ doppelt und blättert regelmäßig im Tagebuch", () => {
    const e = new Eiliger(true);
    expect([e.doppelt(), e.doppelt(), e.doppelt(), e.doppelt()]).toEqual([
      false,
      true,
      false,
      true,
    ]);
    const tagebuch = Array.from({ length: 12 }, () => e.tagebuchJetzt()).filter(Boolean);
    expect(tagebuch.length).toBe(2);
  });

  it("bricht jeden Laden nur beim ersten Besuch ab und dreht je Karte höchstens einmal um", () => {
    const e = new Eiliger(true);
    expect(e.brichLadenAb("riverton.laden")).toBe(true);
    expect(e.brichLadenAb("riverton.laden")).toBe(false);
    const karten = ["a", "b", "c", "d"].map((k) => e.drehtUm(k));
    expect(karten).toEqual([false, true, false, true]);
    expect(e.drehtUm("b")).toBe(false);
  });

  it("ausgeschaltet hetzt er nie", () => {
    const e = new Eiliger(false);
    expect(e.antwort("Frage?", ["Ja."])).toBeNull();
    expect(e.doppelt()).toBe(false);
    expect(e.brichLadenAb("x")).toBe(false);
    expect(e.drehtUm("x")).toBe(false);
    expect(Array.from({ length: 12 }, () => e.tagebuchJetzt()).some(Boolean)).toBe(false);
  });

  it("findet den Knopf, der den Laden schließt, nicht eine Ware", () => {
    const knoepfe = [
      knopf("Karte 5", "abenteuer-laden", "abenteuer-karte"),
      knopf("Schließen", "abenteuer-laden", "knopf-haupt"),
    ];
    expect(ladenZu(knoepfe)?.text).toBe("Schließen");
  });
});
