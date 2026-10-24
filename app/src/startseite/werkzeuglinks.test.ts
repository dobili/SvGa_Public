/**
 * Tests der Werkzeug-Links auf den Trainingsseiten (R57-Zusatz).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Trainingsblock, Trainingsseite } from "./trainingsseiten";
import { kapitelseite } from "./trainingsrahmen";
import { WERKZEUGLINKS, werkzeugeDes, werkzeuglinksHtml } from "./werkzeuglinks";

const absatz = (text: string, ziel?: string): Trainingsblock => ({
  art: "absatz",
  teile: [
    { art: "text", text, stil: "normal" },
    ...(ziel ? [{ art: "link" as const, text: "Link", ziel }] : []),
  ],
});

describe("Werkzeug-Links", () => {
  it("findet genannte Werkzeuge, jedes einmal, in der Reihenfolge der Liste", () => {
    const block = absatz(
      "Baue die Stellung mit „Stellung aufbauen“ auf und löse dann „Aufgabenthemen“; danach im Analysebrett und nochmal Analysebrett.",
    );
    expect(werkzeugeDes(block).map((w) => w.titel)).toEqual([
      "Aufgabenthemen",
      "Analysebrett",
      "Stellung aufbauen",
    ]);
  });

  it("verlinkt nichts doppelt, was der Text schon verlinkt", () => {
    expect(
      werkzeugeDes(absatz("Öffne die Aufgabenthemen", "https://lichess.org/training/themes")),
    ).toEqual([]);
    expect(werkzeuglinksHtml(absatz("Ein Holzbrett genügt."))).toBe("");
  });

  it("alle Adressen sind https und stehen im Werkzeugkasten des Buches oder sind seine Domains", () => {
    const kasten = readFileSync(
      new URL("../../../inhalte/de/training/werkzeugkasten.json", import.meta.url),
      "utf8",
    );
    for (const w of WERKZEUGLINKS) {
      expect(w.adresse).toMatch(/^https:\/\//);
      expect(kasten).toContain(`"ziel": "${w.adresse}"`);
    }
  });

  it("jede Kapitelseite mit Lichess-Übung bekommt mindestens einen Link, mit neuem Tab", () => {
    const daten = JSON.parse(
      readFileSync(new URL("../../../inhalte/de/training/kap01.json", import.meta.url), "utf8"),
    ) as Trainingsseite;
    const html = kapitelseite(daten, null, null);
    expect(html).toContain(
      'href="https://lichess.org/training/themes" target="_blank" rel="noopener"',
    );
    expect(html).toContain("{{training.werkzeuglinks}}");
  });
});
