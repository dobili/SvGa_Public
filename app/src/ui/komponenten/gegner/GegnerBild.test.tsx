/**
 * Tests der Siegmarken am Porträt (Wunsch des Autors, 25.10.2026): je Zeitklasse eine Marke mit
 * ihrem Zeichen, bis zu drei, und ein vorlesbarer Name wie „Gewertet besiegt in Blitz und
 * Klassisch“. Läuft in Node mit dem Server-Renderer; das Aussehen prüfen die Bildschirmfotos.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GEGNER } from "../../../engine/gegner";
import { GegnerBild } from "./GegnerBild";
import { zeitartenText } from "../bausteine/zeitartzeichen";

const BOT = GEGNER[0]?.kennung ?? "";

function marken(html: string): string[] {
  return [...html.matchAll(/data-tempo="(\w+)"/g)].map((treffer) => treffer[1] ?? "");
}

describe("Siegmarken am Porträt", () => {
  it("zeigt ohne Sieg keine Marke", () => {
    const html = renderToStaticMarkup(<GegnerBild bot={BOT} eigene={[]} name="Bot" />);
    expect(html).not.toContain("gegner-besiegt");
  });

  it("zeigt je Zeitklasse eine Marke und nennt sie für Bildschirmleser", () => {
    const html = renderToStaticMarkup(
      <GegnerBild bot={BOT} eigene={[]} name="Bot" besiegtIn={["blitz", "classical"]} />,
    );
    expect(marken(html)).toEqual(["blitz", "classical"]);
    expect(html).toContain('aria-label="Gewertet besiegt in Blitz und Klassisch"');
  });

  it("zeigt bis zu drei Marken", () => {
    const html = renderToStaticMarkup(
      <GegnerBild bot={BOT} eigene={[]} name="Bot" besiegtIn={["blitz", "rapid", "classical"]} />,
    );
    expect(marken(html)).toHaveLength(3);
    expect(html).toContain("Blitz, Schnellschach und Klassisch");
  });

  it("zählt die Zeitarten in fester Reihenfolge auf", () => {
    expect(zeitartenText(["classical", "blitz"])).toBe("Blitz und Klassisch");
    expect(zeitartenText(["rapid"])).toBe("Schnellschach");
  });
});
