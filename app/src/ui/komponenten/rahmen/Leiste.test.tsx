/**
 * Tests der Leiste unten: Reihenfolge der Reiter mit und ohne „Abenteuer“ (27.11.2026) und die
 * gezeichneten Knöpfe mit Namen und Wort.
 *
 * Die Tests laufen in Node ohne Browser (renderToStaticMarkup). Das Öffnen des Spiels und den Weg
 * zurück prüft tests/e2e/abenteuer-reiter.spec.ts im Browser.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { NavigationsKontext, type Navigation } from "../../../app/navigationsKontext";
import { neuerStapel } from "../../../app/stapel";
import { Leiste } from "./Leiste";
import { reiterDerLeiste } from "./leistenreiter";

/** Navigation für den Test: Stapel im Buch, alle Aufrufe als Attrappen. */
function testnavigation(): Navigation {
  const stapel = neuerStapel("buch");
  return {
    stapel,
    ansicht: stapel.ansichten[0],
    navigiere: vi.fn(),
    ersetze: vi.fn(),
    zurueck: vi.fn(),
    wechsleBereich: vi.fn(),
  };
}

/** Die Kennungen der Reiter in ihrer Reihenfolge. */
const kennungen = (mitAbenteuer: boolean) =>
  reiterDerLeiste(mitAbenteuer).map((r) => (r === "abenteuer" ? r : r.bereich));

describe("Leiste", () => {
  it("stellt „Abenteuer“ hinter „Spielen“, in der Leserfassung fehlt er", () => {
    expect(kennungen(true)).toEqual([
      "buch",
      "training",
      "spielen",
      "abenteuer",
      "nachschlagen",
      "ich",
    ]);
    expect(kennungen(false)).toEqual(["buch", "training", "spielen", "nachschlagen", "ich"]);
  });

  it("zeichnet sechs Knöpfe mit Namen und Wort, „Abenteuer“ mit eigenem Tourziel", () => {
    const html = renderToStaticMarkup(
      <NavigationsKontext.Provider value={testnavigation()}>
        <Leiste />
      </NavigationsKontext.Provider>,
    );
    const namen = [...html.matchAll(/<button[^>]*aria-label="([^"]+)"/g)].map((t) => t[1]);
    expect(namen).toEqual(["Buch", "Training", "Spielen", "Abenteuer", "Nachschlagen", "Profil"]);
    expect(html).toContain('data-tour="leiste-abenteuer"');
    expect(html).toContain('<span aria-hidden="true">Abenteuer</span>');
  });
});
