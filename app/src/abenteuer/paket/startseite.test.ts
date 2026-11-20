/**
 * Fehlende Paketdatei, Server liefert die Startseite (paketlader.ts, alsStartseite): HTML auf eine
 * Datei, die kein HTML ist, gilt als „fehlt“. Warum: Porträts ohne Bild zeigten im Abspann ein
 * kaputtes Bild (Owen Fisk, Ivy; eiliger Spieler, 20.11.2026).
 */
import { describe, expect, it } from "vitest";
import { alsStartseite } from "./paketlader";

const antwort = (art: string) => new Response("x", { headers: { "content-type": art } });

describe("Startseite statt Paketdatei", () => {
  it("HTML auf ein Porträt ist die Startseite", () => {
    expect(alsStartseite("portraets/owen.svg", antwort("text/html; charset=utf-8"))).toBe(true);
  });

  it("ein echtes Bild oder eine HTML-Datei ist keine Startseite", () => {
    expect(alsStartseite("portraets/abe.svg", antwort("image/svg+xml"))).toBe(false);
    expect(alsStartseite("hilfe/seite.html", antwort("text/html"))).toBe(false);
  });
});
