/**
 * Tests der Brettansichten der Sonderformen (statisch gezeichnet): Nebel über den Reihen 5 bis 8,
 * Ente auf ihrem Feld, Tandem mit Partnerbrett und Tasche.
 */
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// Das Brett der App braucht Einstellungen aus dem Browser; hier zählt nur, was darüber liegt.
vi.mock("../../ui/brett/Brett", () => ({
  Brett: (e: { readonly fen: string; readonly ueberlagerung?: ReactNode }) => (
    <div data-fen={e.fen}>{e.ueberlagerung}</div>
  ),
}));
import { spieleEntenzug, neueEntenpartie } from "./ente";
import { Entenbrett } from "./Entenbrett";
import { Nebelbrett } from "./Nebelbrett";
import { Tandembretter } from "./Tandembretter";
import { neueTandempartie } from "./tandem";
import { variantenpartie } from "../anbindung/variantenpartien";
import { varianteVon } from "../../spiel/varianten/alle";
import "./Variantenpartien";
import type { Variantenumgebung } from "./useBotzug";

const u: Variantenumgebung = {
  bewerter: () => Promise.resolve([]),
  stil: { varianten: 3, spielraumCp: 50, zufall: () => 0 },
  heldFarbe: "white",
  gegner: "Theron",
  beiEnde: () => {},
};

const anzahl = (html: string, teil: string) => html.split(teil).length - 1;

describe("Brettansichten der Sonderformen", () => {
  it("Nebel: in der Grundstellung liegen 32 Felder im Nebel, schwarze Figuren sind verborgen", () => {
    const html = renderToStaticMarkup(<Nebelbrett u={u} />);
    expect(anzahl(html, 'data-testid="variante-nebelfeld"')).toBe(32);
    expect(html).toContain("Was im Nebel liegt");
    expect(html).toContain('data-fen="8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"');
  });

  it("Ente: steht auf ihrem Feld, die Zeile sagt, was dran ist", () => {
    const start = spieleEntenzug(neueEntenpartie(), "e2e4,e4e5");
    const html = renderToStaticMarkup(
      <Entenbrett u={{ ...u, heldFarbe: "black" }} start={start} />,
    );
    expect(html).toContain('data-feld="e5"');
    expect(html).toContain("Zieh eine Figur");
  });

  it("Tandem: zwei Bretter und die Tasche", () => {
    const html = renderToStaticMarkup(<Tandembretter u={u} start={neueTandempartie("white")} />);
    expect(html).toContain('data-testid="variante-tandem-b"');
    expect(html).toContain('data-testid="variante-tasche"');
  });

  it("Nebel, Ente und Tandem sind als Variante und eigene Partie angemeldet", () => {
    for (const kennung of ["nebel", "ente", "tandem"]) {
      expect(varianteVon(kennung)?.ablauf).toBe("eigene_partie");
      expect(variantenpartie(kennung)).toBeDefined();
    }
  });
});
