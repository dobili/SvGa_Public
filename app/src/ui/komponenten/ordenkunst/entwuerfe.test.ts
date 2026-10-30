/**
 * Tests der Ordenkunst: Jeder Orden und jedes Abzeichen hat ein eigenes, gültiges Bild.
 *
 * Warum: Der Autor hat am 30.10.2026 für alle 36 Stücke ein Bild gewählt; fehlt eines oder rechnet
 * eine Form „NaN“, sähe man im Profil eine leere Stelle. Die Ringe kommen aus
 * fortschritt/ringrechnung.ts, die Abzeichen aus fortschritt/abzeichen.ts.
 */
import { describe, expect, it } from "vitest";
import { ABZEICHEN } from "../fortschritt/abzeichen";
import { BOTBUENDEL, BUCHTEILE, ENGINEBUENDEL } from "../fortschritt/ringrechnung";
import {
  ABZEICHENKENNUNGEN,
  hatOrdenkunst,
  ORDENKENNUNGEN,
  ordenkennungAusRing,
  stueckSvg,
} from "./entwuerfe";

/** Die testids aller Ringe, wie fortschritt/fortschrittsringe.ts sie vergibt. */
const RINGE = [
  "ich-abbildungen",
  "ich-uebungen",
  "ich-lernziele",
  "ich-trainer",
  ...BUCHTEILE.map(({ kennung }) => `ich-teil-${kennung}`),
  ...BOTBUENDEL.flatMap(({ kennung }) =>
    kennung === ENGINEBUENDEL
      ? ["ich-bots-10"]
      : [`ich-bots-${kennung}-einmal`, `ich-bots-${kennung}-alle`],
  ),
];

function pruefeSvg(svg: string | null): void {
  expect(svg).not.toBeNull();
  expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 100 1[03]0"/);
  expect(svg).not.toMatch(/NaN|undefined|Infinity/);
}

describe("Ordenkunst", () => {
  it("hat für jeden Ring ein eigenes Bild", () => {
    expect(RINGE).toHaveLength(18);
    for (const ring of RINGE) {
      const kennung = ordenkennungAusRing(ring);
      expect(hatOrdenkunst("orden", kennung), ring).toBe(true);
      pruefeSvg(stueckSvg("orden", kennung));
    }
    expect(new Set(RINGE.map(ordenkennungAusRing))).toEqual(new Set(ORDENKENNUNGEN));
  });

  it("hat für jedes Abzeichen ein eigenes Bild", () => {
    expect(new Set(ABZEICHENKENNUNGEN)).toEqual(new Set(ABZEICHEN.map((a) => a.kennung)));
    for (const { kennung } of ABZEICHEN) pruefeSvg(stueckSvg("abzeichen", kennung));
  });

  it("findet die Engine über ihren Ring", () => {
    expect(ordenkennungAusRing("ich-bots-10")).toBe("engine");
    expect(ordenkennungAusRing("ich-teil-endspiel")).toBe("teil-endspiel");
  });

  it("vergibt jedem Bild eigene Kennungen für Verläufe", () => {
    const ids = (svg: string | null) =>
      [...(svg ?? "").matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    const a = ids(stueckSvg("orden", "teil-endspiel"));
    const b = ids(stueckSvg("orden", "teil-endspiel"));
    expect(a.length).toBeGreaterThan(0);
    expect(a.filter((id) => b.includes(id))).toEqual([]);
  });

  it("zeigt offene Stücke als Silhouette und verdiente mit Glanz", () => {
    expect(stueckSvg("abzeichen", "warum", { silhouette: true })).toContain("feFlood");
    expect(stueckSvg("abzeichen", "warum", { silhouette: true })).not.toContain("ordenkunst-glanz");
    expect(stueckSvg("abzeichen", "warum", { glanz: true })).toContain("ordenkunst-glanz");
  });

  it("kennt keine Bilder für Unbekanntes", () => {
    expect(stueckSvg("orden", "gibt-es-nicht")).toBeNull();
    expect(hatOrdenkunst("abzeichen", "gibtEsNicht")).toBe(false);
  });
});
