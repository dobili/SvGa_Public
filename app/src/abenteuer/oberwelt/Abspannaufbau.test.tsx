/**
 * Test des Abspann-Fensters: Nur der Inhalt rollt, „Schließen“ steht im Fuß darunter.
 *
 * Warum: Quer lag der stehende Knopf über einer Zeile des Abspanns (Spieler-Durchlauf quer,
 * 20.11.2026, Abschnitt 9). Wie in der Deckwahl und im Laden steht er jetzt in
 * `.abenteuer-menue-fuss` unter dem Rollbereich `.abenteuer-menue-inhalt` (abenteuer.css). Den
 * Laden prüft die Oberfläche quer (abenteuer-querformat.spec.ts); den Abspann erreicht sie nur am
 * Ende des Spiels, deshalb hier der Aufbau. Server-Renderer.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import orte from "../../../../inhalte/abenteuer/orte.json";
import type { Spieldaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { Abspann } from "./Abspann";

const STAND = { held: { name: "Kim", figur: "held-0" } } as unknown as Abenteuerstand;

describe("Abspann: Aufbau des Fensters", () => {
  it("Figuren und Mitwirkende im Rollbereich, „Schließen“ im Fuß", () => {
    const html = renderToStaticMarkup(
      <Abspann
        stand={STAND}
        daten={orte as unknown as Spieldaten}
        beiSchliessen={() => undefined}
      />,
    );
    const inhalt = html.indexOf('class="abenteuer-menue-inhalt"');
    const fuss = html.indexOf('class="abenteuer-menue-fuss"');
    expect(inhalt).toBeGreaterThan(0);
    expect(html.indexOf("abenteuer-abspann-figuren")).toBeGreaterThan(inhalt);
    expect(fuss).toBeGreaterThan(html.indexOf("abenteuer-abspann-figuren"));
    expect(html.slice(fuss)).toMatch(
      /^class="abenteuer-menue-fuss"><button[^>]*class="knopf-haupt"/,
    );
  });
});
