/** Tests des Wikis im Worker (Paket D): Annahme mit Schlüssel, Ersetzen, Liste, Seite, Suche. */
import { describe, expect, it } from "vitest";
import worker from "./index";
import { testausfuehrung, testumgebung } from "./testhilfe";
import type { Umgebung } from "./umgebung";
import { ausschnitt, pruefeSendung, wikiliste, wikiseite, wikisuche } from "./wiki";

const SEITE = "https://schach-von-grund-auf.com";
const SCHLUESSEL = "geheimer-testschluessel";

const seite = (pfad: string, inhalt = "Text") => ({
  pfad,
  bereich: "projekt",
  titel: `Titel ${pfad}`,
  inhalt,
  quelle: "docs/ENTSCHEIDUNGEN.md",
});

function sende(env: Umgebung, daten: unknown, schluessel = SCHLUESSEL): Promise<Response> {
  const anfrage = new Request(`${SEITE}/api/wiki`, {
    method: "POST",
    headers: { Authorization: `Bearer ${schluessel}` },
    body: JSON.stringify(daten),
  });
  return worker.fetch(anfrage, env, testausfuehrung());
}

const json = async <T>(antwort: Response | Promise<Response>) =>
  (await (await antwort).json()) as T;

describe("Wiki", () => {
  it("prüft die Sendung", () => {
    expect(pruefeSendung({ seiten: [seite("a/b")] })?.seiten).toHaveLength(1);
    expect(pruefeSendung({ seiten: [] })).toBeNull();
    expect(pruefeSendung({ seiten: [seite("a/b"), seite("a/b")] })).toBeNull();
    expect(pruefeSendung({ seiten: [{ ...seite("a/b"), bereich: "buch" }] })).toBeNull();
    expect(pruefeSendung({ seiten: [seite("A B")] })).toBeNull();
  });

  it("nimmt nur mit Schlüssel an und ersetzt bei jedem Hochladen alle Seiten", async () => {
    const env = testumgebung({ BERICHT_SCHLUESSEL: SCHLUESSEL });
    expect((await sende(env, { seiten: [seite("a")] }, "falsch")).status).toBe(401);
    const viele = Array.from({ length: 120 }, (_, i) => seite(`s/${i}`));
    expect((await sende(env, { stand: "abc", seiten: viele })).status).toBe(200);
    expect((await json<{ seiten: unknown[] }>(wikiliste(env))).seiten).toHaveLength(120);
    expect((await sende(env, { seiten: [seite("neu", "Orden für volle Ringe")] })).status).toBe(
      200,
    );
    const liste = await json<{ seiten: { pfad: string; laenge: number }[] }>(wikiliste(env));
    expect(liste.seiten).toEqual([expect.objectContaining({ pfad: "neu", laenge: 21 })]);
  });

  it("liefert eine Seite und findet Begriffe mit Ausschnitt", async () => {
    const env = testumgebung({ BERICHT_SCHLUESSEL: SCHLUESSEL });
    await sende(env, { seiten: [seite("x", "Vorne. Die Orden für volle Ringe. Hinten.")] });
    const url = (pfad: string) => new URL(`${SEITE}/api/admin/${pfad}`);
    const gefunden = await json<{ seite: { inhalt: string } }>(
      wikiseite(env, url("wiki/seite?pfad=x")),
    );
    expect(gefunden.seite.inhalt).toContain("Orden");
    expect((await wikiseite(env, url("wiki/seite?pfad=fehlt"))).status).toBe(404);
    const treffer = await json<{ treffer: { pfad: string; ausschnitt: string }[] }>(
      wikisuche(env, url("wiki/suche?q=orden")),
    );
    expect(treffer.treffer.map((t) => t.pfad)).toEqual(["x"]);
    const leer = await json<{ treffer: unknown[] }>(wikisuche(env, url("wiki/suche?q=o")));
    expect(leer.treffer).toEqual([]);
  });

  it("Ausschnitt um die Fundstelle", () => {
    const text = `${"a".repeat(200)}Orden${"b".repeat(200)}`;
    const teil = ausschnitt(text, "orden");
    expect(teil.startsWith("…")).toBe(true);
    expect(teil).toContain("Orden");
    expect(teil.length).toBeLessThan(200);
  });
});
