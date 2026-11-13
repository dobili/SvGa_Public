/**
 * Tests der Deckwahl im Tiefpunkt (regeln/abwesenheit.ts): Ambroses Karten bleiben sichtbar, aber
 * grau und gesperrt, mit „Er ist nicht da.“; Karten des Helden bleiben wählbar. Server-Renderer.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import kartendatei from "../../../../inhalte/abenteuer/karten.json";
import type { Kartendaten } from "../daten/laden";
import { Deckwahl } from "./Deckwahl";

const SORTEN = kartendatei.karten as unknown as Kartendaten[];
const BESITZ = ["mentorzug", "abzaehlen"].map((kennung) => ({
  kennung,
  anzahl: 1,
  erhalten: "2026-11-13T10:00:00.000Z",
}));

function zeichne(ambroseFehlt: boolean): string {
  return renderToStaticMarkup(
    <Deckwahl
      besitz={BESITZ}
      sorten={SORTEN}
      mitKarten
      zeitwahl={false}
      ambroseFehlt={ambroseFehlt}
      beiWahl={() => undefined}
      beiAbbruch={() => undefined}
    />,
  );
}

/** Der Knopf einer Karte im Markup. */
function knopf(html: string, kennung: string): string {
  const treffer = new RegExp(
    `<button[^>]*data-testid="abenteuer-deckkarte-${kennung}"[^>]*>.*?</button>`,
  ).exec(html);
  return treffer?.[0] ?? "";
}

describe("Deckwahl ohne Ambrose", () => {
  it("zeigt den Mentor-Zug grau mit Grund, Abzählen bleibt wählbar", () => {
    const html = zeichne(true);
    const mentor = knopf(html, "mentorzug");
    expect(mentor).toContain('data-gesperrt="ja"');
    expect(mentor).toContain("disabled");
    expect(mentor).toContain("Er ist nicht da.");
    expect(knopf(html, "abzaehlen")).not.toContain("disabled");
  });

  it("lässt den Mentor-Zug ohne Tiefpunkt wählbar", () => {
    const mentor = knopf(zeichne(false), "mentorzug");
    expect(mentor).not.toContain("data-gesperrt");
    expect(mentor).not.toContain("disabled");
  });
});
