/**
 * Tests der Ortsmarken auf den Trainingsseiten (R17): An echten Übungen aus inhalte/de/training/
 * wird geprüft, dass Lichess, Website, App, echtes Brett und eigene Partien erkannt werden.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Trainingsblock, Trainingsseite } from "./trainingsseiten";
import { orteDerUebung } from "./uebungsort";

const QUELLE = new URL("../../../inhalte/de/training/", import.meta.url);

/** Den Block eines Kapitels, dessen Text so beginnt. */
function uebung(kapitel: string, anfang: string): Trainingsblock {
  const seite = JSON.parse(
    readFileSync(new URL(`${kapitel}.json`, QUELLE), "utf8"),
  ) as Trainingsseite;
  const block = seite.bloecke.find(
    (b) =>
      "teile" in b &&
      b.teile
        .map((t) => t.text)
        .join("")
        .startsWith(anfang),
  );
  if (!block) throw new Error(`Übung „${anfang}“ fehlt in ${kapitel}`);
  return block;
}

describe("orteDerUebung", () => {
  it("Kapitel 1, Schäfermatt mit „Stellung aufbauen“ und Abb. 1.15: Lichess und App", () => {
    expect(orteDerUebung(uebung("kap01", "Schäfermatt"))).toEqual(["lichess", "app"]);
  });

  it("Kapitel 1, „Am echten Brett“ mit Abb. 1.7: App und Brett", () => {
    expect(orteDerUebung(uebung("kap01", "Am echten Brett"))).toEqual(["app", "brett"]);
  });

  it("Kapitel 0: Lichess großgeschrieben und Online-Partie zählen als Lichess", () => {
    expect(orteDerUebung(uebung("kap00", "Felder treffen"))).toEqual(["lichess"]);
    expect(orteDerUebung(uebung("kap00", "Notation schreiben"))).toEqual(["lichess"]);
  });

  it("Kapitel 0, Regeln beim Schachbund: andere Website", () => {
    expect(orteDerUebung(uebung("kap00", "Die Regeln im Wortlaut"))).toEqual(["web"]);
  });

  it("Kapitel 4, Stopp-Ritual: nur eigene Partien", () => {
    expect(orteDerUebung(uebung("kap04", "Das Stopp-Ritual"))).toEqual(["partie"]);
  });

  it("Satz zum Werkzeugkasten: keine Marke", () => {
    expect(orteDerUebung(uebung("kap01", "Den Weg zu allen"))).toEqual([]);
  });
});
