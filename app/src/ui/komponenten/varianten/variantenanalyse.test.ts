/**
 * Tests der Warteschlange der Variantenanalyse (Stufe 3) mit einer Ersatz-Engine: Fortschritt,
 * gebündeltes Speichern, Nachfordern während des Laufs, Abbrechen, nicht bewertbare Stellungen,
 * keine Stellung doppelt.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Engineergebnis } from "../../../training/variationswerte";
import { Analysewarteschlange, type Analysestand } from "./variantenanalyse";

/** Rechenzeit der Ersatz-Engine je Stellung. */
const RECHNEN_MS = 100;
const SPEICHERN_MS = 1000;

/** Eine Ersatz-Engine: nach RECHNEN_MS ein Ergebnis, „kaputt“ ist nicht bewertbar. */
function ersatz() {
  const gerechnet: string[] = [];
  const gespeichert: { id: string; fens: string[] }[] = [];
  const bewerte = async (fen: string): Promise<Engineergebnis | null> => {
    await new Promise((fertig) => setTimeout(fertig, RECHNEN_MS));
    gerechnet.push(fen);
    return fen === "kaputt" ? null : { w: fen.length, b: "e2e4", a: 0 };
  };
  const speichere = (id: string, e: ReadonlyMap<string, Engineergebnis>) =>
    gespeichert.push({ id, fens: [...e.keys()] });
  const schlange = new Analysewarteschlange({ bewerte, speichere }, SPEICHERN_MS);
  const staende: Analysestand[] = [];
  schlange.beobachte(() => staende.push(schlange.aktuell()));
  return { schlange, gerechnet, gespeichert, staende };
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("Warteschlange der Variantenanalyse", () => {
  it("rechnet alle Stellungen nacheinander, zeigt den Fortschritt und speichert am Ende", async () => {
    const { schlange, gerechnet, gespeichert, staende } = ersatz();
    schlange.fordere("var-1", ["a", "b", "c"]);
    expect(schlange.aktuell()).toEqual({ art: "laeuft", id: "var-1", erledigt: 0, gesamt: 3 });
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 3);
    expect(gerechnet).toEqual(["a", "b", "c"]);
    expect(schlange.aktuell()).toEqual({ art: "ruht" });
    expect(
      staende.filter((s) => s.art === "laeuft").map((s) => s.art === "laeuft" && s.erledigt),
    ).toEqual([0, 1, 2, 3]);
    // Gebündelt: ein Schreiben am Ende statt drei.
    expect(gespeichert).toEqual([{ id: "var-1", fens: ["a", "b", "c"] }]);
    expect(schlange.ergebnisse().get("b")).toEqual({ w: 1, b: "e2e4", a: 0 });
  });

  it("schreibt bei langen Analysen zwischendurch", async () => {
    const { schlange, gespeichert } = ersatz();
    const viele = Array.from({ length: 15 }, (_, i) => `s${i}`);
    schlange.fordere("var-1", viele);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 12);
    expect(gespeichert.length).toBeGreaterThanOrEqual(1);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 5);
    expect(gespeichert.flatMap((g) => g.fens).sort()).toEqual([...viele].sort());
  });

  it("nimmt neue Züge während des Laufs hinten auf und rechnet nichts doppelt", async () => {
    const { schlange, gerechnet } = ersatz();
    schlange.fordere("var-1", ["a", "b"]);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS);
    schlange.fordere("var-1", ["a", "b", "neu"]);
    expect(schlange.aktuell()).toMatchObject({ gesamt: 3 });
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 3);
    expect(gerechnet).toEqual(["a", "b", "neu"]);
    // Später noch einmal dieselben Stellungen: nichts zu tun.
    schlange.fordere("var-1", ["a", "b", "neu"]);
    expect(schlange.aktuell()).toEqual({ art: "ruht" });
  });

  it("Abbrechen hält die Schlange an; Fertiges bleibt und wird gespeichert", async () => {
    const { schlange, gerechnet, gespeichert } = ersatz();
    schlange.fordere("var-1", ["a", "b", "c", "d"]);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS + 1);
    schlange.brichAb();
    expect(schlange.aktuell()).toEqual({ art: "ruht" });
    expect(gespeichert).toEqual([{ id: "var-1", fens: ["a"] }]);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 5);
    // Der laufende Auftrag (b) endet noch, danach kommt nichts mehr dran.
    expect(gerechnet).toEqual(["a", "b"]);
    expect(schlange.kennt("b")).toBe(true);
    expect(schlange.kennt("c")).toBe(false);
  });

  it("eine nicht bewertbare Stellung wird gemerkt und nie wieder angefordert", async () => {
    const { schlange, gerechnet } = ersatz();
    schlange.fordere("var-1", ["kaputt", "a"]);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 2);
    expect(schlange.kennt("kaputt")).toBe(true);
    expect(schlange.ergebnisse().has("kaputt")).toBe(false);
    schlange.fordere("var-1", ["kaputt"]);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 2);
    expect(gerechnet).toEqual(["kaputt", "a"]);
  });

  it("eine andere Variante löst die erste ab", async () => {
    const { schlange, gerechnet, gespeichert } = ersatz();
    schlange.fordere("var-1", ["a", "b", "c"]);
    await vi.advanceTimersByTimeAsync(RECHNEN_MS + 1);
    schlange.fordere("var-2", ["x"]);
    expect(schlange.aktuell()).toMatchObject({ id: "var-2", gesamt: 1 });
    await vi.advanceTimersByTimeAsync(RECHNEN_MS * 4);
    expect(gerechnet).toEqual(["a", "b", "x"]);
    expect(gespeichert).toEqual([
      { id: "var-1", fens: ["a"] },
      { id: "var-2", fens: ["x"] },
    ]);
  });
});
