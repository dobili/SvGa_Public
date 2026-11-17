/**
 * Tests des Wikis im Worker (Paket D): Annahme mit Schlüssel, Ersetzen, Liste, Seite, Suche; seit
 * 17.11.2026 zwei getrennte Wikis („app“, „spiel“) und die Übernahme der alten Tabelle „wiki“.
 */
import { describe, expect, it } from "vitest";
import worker from "./index";
import { sorgeFuerTabellen } from "./datenbank";
import { testausfuehrung, testumgebung } from "./testhilfe";
import type { Umgebung } from "./umgebung";
import { ausschnitt, pruefeSendung, wikiliste, wikiseite, wikisuche } from "./wiki";

const SEITE = "https://schach-von-grund-auf.com";
const SCHLUESSEL = "geheimer-testschluessel";
const LISTE = new URL(`${SEITE}/api/admin/wiki`);
const url = (pfad: string) => new URL(`${SEITE}/api/admin/${pfad}`);

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
    expect((await json<{ seiten: unknown[] }>(wikiliste(env, LISTE))).seiten).toHaveLength(120);
    expect((await sende(env, { seiten: [seite("neu", "Orden für volle Ringe")] })).status).toBe(
      200,
    );
    const liste = await json<{ seiten: { pfad: string; laenge: number }[] }>(wikiliste(env, LISTE));
    expect(liste.seiten).toEqual([expect.objectContaining({ pfad: "neu", laenge: 21 })]);
  });

  it("liefert eine Seite und findet Begriffe mit Ausschnitt", async () => {
    const env = testumgebung({ BERICHT_SCHLUESSEL: SCHLUESSEL });
    await sende(env, { seiten: [seite("x", "Vorne. Die Orden für volle Ringe. Hinten.")] });
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

  it("hält die Wikis „app“ und „spiel“ getrennt; eine Sendung ersetzt nur ihr Wiki", async () => {
    const env = testumgebung({ BERICHT_SCHLUESSEL: SCHLUESSEL });
    await sende(env, { seiten: [seite("projekt/fortschritt", "App: Orden")] });
    await sende(env, { wiki: "spiel", seiten: [seite("projekt/fortschritt", "Spiel: Nadeln")] });
    expect((await sende(env, { wiki: "buch", seiten: [seite("x")] })).status).toBe(400);
    const app = await json<{ seiten: unknown[] }>(wikiliste(env, url("wiki?wiki=app")));
    const spiel = await json<{ seiten: unknown[] }>(wikiliste(env, url("wiki?wiki=spiel")));
    expect(app.seiten).toHaveLength(1);
    expect(spiel.seiten).toHaveLength(1);
    const seiteSpiel = await json<{ seite: { inhalt: string } }>(
      wikiseite(env, url("wiki/seite?wiki=spiel&pfad=projekt/fortschritt")),
    );
    expect(seiteSpiel.seite.inhalt).toBe("Spiel: Nadeln");
    const treffer = await json<{ treffer: unknown[] }>(
      wikisuche(env, url("wiki/suche?wiki=app&q=Nadeln")),
    );
    expect(treffer.treffer).toEqual([]);
    expect((await wikiliste(env, url("wiki?wiki=buch"))).status).toBe(400);
    // Neues Hochladen des Spiels lässt die App-Seiten stehen.
    await sende(env, { wiki: "spiel", seiten: [seite("a"), seite("b")] });
    expect((await json<{ seiten: unknown[] }>(wikiliste(env, LISTE))).seiten).toHaveLength(1);
  });

  it("übernimmt die alte Tabelle „wiki“ als Wiki „app“", async () => {
    const env = testumgebung({ BERICHT_SCHLUESSEL: SCHLUESSEL });
    const db = env.ADMIN_DB;
    await db
      .prepare(
        "CREATE TABLE wiki (pfad TEXT PRIMARY KEY, bereich TEXT NOT NULL, titel TEXT NOT NULL, inhalt TEXT NOT NULL, quelle TEXT NOT NULL, stand TEXT, zeit TEXT NOT NULL)",
      )
      .run();
    await db
      .prepare(
        "INSERT INTO wiki VALUES ('alt', 'projekt', 'Alt', 'Alter Text', 'docs/x.md', null, 'z')",
      )
      .run();
    await sorgeFuerTabellen(db);
    const liste = await json<{ seiten: { pfad: string }[] }>(wikiliste(env, LISTE));
    expect(liste.seiten.map((s) => s.pfad)).toEqual(["alt"]);
    const alt = await db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'wiki'")
      .first();
    expect(alt).toBeNull();
  });
});
