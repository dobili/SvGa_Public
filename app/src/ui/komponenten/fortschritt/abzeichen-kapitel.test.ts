/**
 * Tests der Abzeichen zu Kapiteln: „Kurzer Prozess“ (Regel: Kapitel 4, Fallen enden mit schnellem
 * Matt) nur aus der Grundstellung und in höchstens 15 eigenen Zügen, „Neue Dame“ (Regel:
 * Kapitel 8, Umwandlung des Freibauern) nur für einen Zug des Lesers.
 */
import { describe, expect, it } from "vitest";
import { abzeichengrundlageAus, erfuellteAbzeichen } from "./abzeichen";
import { eigeneUmwandlung, KURZER_PROZESS_ZUEGE, kurzerProzess } from "./abzeichen-kapitel";
import { mitPartien, testpartie } from "./abzeichen.testhilfe";

/** So viele Halbzüge abwechselnd Leser und Engine. */
function halbzuege(anzahl: number, letzter = "Qxf7#"): string[] {
  return Array.from({ length: anzahl }, (_, i) =>
    i === anzahl - 1 ? letzter : i % 2 === 0 ? "Nf3" : "Nf6",
  );
}

const GRENZE = KURZER_PROZESS_ZUEGE * 2;

describe("Abzeichen zu Kapiteln", () => {
  it("Kurzer Prozess: Matt in höchstens 15 eigenen Zügen aus der Grundstellung", () => {
    const schnell = testpartie("s", halbzuege(GRENZE - 1), { gewonnen: true, matt: true });
    const langsam = testpartie("l", halbzuege(GRENZE + 1), { gewonnen: true, matt: true });
    const aufgabe = testpartie("a", halbzuege(GRENZE - 1), { gewonnen: true });
    expect(kurzerProzess(schnell)).toBe(true);
    expect(kurzerProzess(langsam)).toBe(false);
    expect(kurzerProzess(aufgabe)).toBe(false);
    const ausAbbildung = {
      ...schnell,
      einstellung: { ...schnell.einstellung, startFen: "8/8/8/8/8/5k2/8/4K2Q w - - 0 1" },
    };
    expect(kurzerProzess(ausAbbildung)).toBe(false);
  });

  it("Neue Dame: nur eine Umwandlung des Lesers zählt", () => {
    const eigene = testpartie("e", halbzuege(3, "e8=Q"));
    const fremde = testpartie("f", halbzuege(2, "e1=Q"));
    expect(eigeneUmwandlung(eigene)).toBe(true);
    expect(eigeneUmwandlung(fremde)).toBe(false);
    const erfuellt = erfuellteAbzeichen(abzeichengrundlageAus(mitPartien([eigene]), 0, false));
    expect(erfuellt).toContain("umwandlung");
    expect(erfuellt).not.toContain("kurzerProzess");
  });
});
