/** Tests für Studien lösen (Kapitel 10) und Zug erraten (Kapitel 11), AP 13. */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { anfang, gegnerAmZug } from "./repertoiretrainer";
import { gutGeraten, partienAus, studienAus } from "./studientrainer";

describe("Studien lösen", () => {
  const studien = studienAus(ladeKapitel(10));

  it("die Studien aus den Abschnitten von Kapitel 10, ohne die Übungen", () => {
    expect(studien.length).toBeGreaterThanOrEqual(4);
    expect(studien.some((s) => s.titel.startsWith("Die Saavedra-Studie"))).toBe(true);
    expect(studien.some((s) => s.titel.startsWith("Rückblick"))).toBe(false);
  });

  it("Saavedra: Weiß am Zug beginnt selbst, die Lösung beginnt mit 1. c7", () => {
    const saavedra = studien.find((s) => s.titel.startsWith("Die Saavedra-Studie"));
    expect(saavedra?.seite).toBe("white");
    expect(saavedra?.linie[0]).toBe("c7");
    if (saavedra) expect(anfang(saavedra)).toEqual([]);
  });
});

describe("Zug erraten", () => {
  it("die Meisterpartien aus Kapitel 11, ohne Vorlauf und Übungen", () => {
    const partien = partienAus(ladeKapitel(11), "white");
    expect(partien.length).toBeGreaterThanOrEqual(8);
    expect(partien[0]?.titel.startsWith("Morphys Opernpartie")).toBe(true);
    expect(partien.some((p) => p.titel.includes("Vorlauf"))).toBe(false);
  });

  it("als Schwarz spielt die App den ersten weißen Zug", () => {
    const [opernpartie] = partienAus(ladeKapitel(11), "black");
    if (!opernpartie) throw new Error("Opernpartie fehlt");
    expect(anfang(opernpartie)).toEqual(["e4"]);
    expect(gegnerAmZug(opernpartie, 2)).toBe(true);
  });

  it("gut geraten ab der Hälfte der Züge", () => {
    expect(gutGeraten({ versuche: 10, treffer: 5 })).toBe(true);
    expect(gutGeraten({ versuche: 10, treffer: 4 })).toBe(false);
    expect(gutGeraten({ versuche: 0, treffer: 0 })).toBe(false);
  });
});
