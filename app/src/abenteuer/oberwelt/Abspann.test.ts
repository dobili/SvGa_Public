/**
 * Test des Abspanns: Jede Figur steht einmal in der Liste, auch wenn sie an mehreren Orten unter
 * eigener Kennung vorkommt.
 *
 * Warum: Im Abspann stand „Mama“ dreimal, zweimal ohne Porträt (Spieler-Durchlauf im Querformat,
 * 20.11.2026); acht Figuren waren doppelt.
 * Abhängigkeiten: abspannfiguren.ts, die echten Spieldaten (inhalte/abenteuer), Texte.
 */
import { describe, expect, it } from "vitest";
import orte from "../../../../inhalte/abenteuer/orte.json";
import texte from "../../../../inhalte/abenteuer/texte/de.json";
import type { Spieldaten } from "../daten/laden";
import { figurenDerWelt } from "./abspannfiguren";

const daten = orte as unknown as Spieldaten;
const figuren = figurenDerWelt(daten);

describe("Abspann: Figuren der Welt", () => {
  it("nennt jeden Namen genau einmal", () => {
    const namen = figuren.map((f) => (texte as Record<string, string>)[f.name] ?? f.name);
    expect(namen.filter((n, i) => namen.indexOf(n) !== i)).toEqual([]);
  });

  it("nimmt das Porträt der Kennung, die zum Namen gehört", () => {
    const kennung = (name: string) => figuren.find((f) => f.name === name)?.kennung;
    expect(kennung("figur.mutter.name")).toBe("mutter");
    expect(kennung("figur.pratt.name")).toBe("pratt");
  });

  it("lässt keine Figur der Welt aus", () => {
    const alle = new Set(daten.orte.flatMap((o) => o.figuren).map((f) => f.name));
    expect(figuren.length).toBe(alle.size);
  });
});
