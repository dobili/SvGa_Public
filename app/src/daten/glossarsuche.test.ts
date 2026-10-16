/** Tests für die Glossarsuche mit den echten Einträgen des Buches. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Glossar } from "./generiert/glossar";
import { suche } from "./glossarsuche";

const glossar = JSON.parse(
  readFileSync(new URL("../../public/daten/de/a1/glossar.json", import.meta.url), "utf8"),
) as Glossar;

describe("Glossarsuche", () => {
  it("findet Begriffe am Anfang vor Begriffen mit dem Wort und vor Texttreffern", () => {
    const treffer = suche(glossar.eintraege, "Abschneid").map((e) => e.begriff);
    expect(treffer[0]).toBe("Abschneiden");
  });

  it("ignoriert Groß- und Kleinschreibung und liefert ohne Suchtext alles", () => {
    expect(suche(glossar.eintraege, "ABSCHNEIDEN")[0]?.begriff).toBe("Abschneiden");
    expect(suche(glossar.eintraege, "  ")).toHaveLength(glossar.eintraege.length);
    expect(suche(glossar.eintraege, "xyzzy")).toEqual([]);
  });
});
