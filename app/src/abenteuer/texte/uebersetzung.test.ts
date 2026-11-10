/**
 * Tests der Mehrsprachigkeit des Abenteuers (Dokument 17, Abschnitt 3): Prüfung aller
 * Übersetzungen der Spieltexte und Rückfall auf Deutsch.
 *
 * Warum: Der Autor möchte später eine englische Fassung. Jede weitere Sprache in
 * inhalte/abenteuer/texte/ wird hier gegen de.json geprüft: unbekannte Schlüssel und falsche
 * Platzhalter sind Fehler; fehlende Schlüssel nur bei Sprachen, die als fertig gelten (bis dahin
 * fällt das Spiel dort auf Deutsch zurück, und der Test nennt die Zahl).
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import de from "../../../../inhalte/abenteuer/texte/de.json";
import { ladeSpieltexte, spielsprache, tSpiel, hatSpieltext } from "./texte";
import { pruefeUebersetzung } from "./uebersetzung";

const ORDNER = resolve(__dirname, "../../../../inhalte/abenteuer/texte");
/** Sprachen, die vollständig sein müssen (Englisch kommt, wenn das Spiel fertig ist). */
const FERTIGE_SPRACHEN: readonly string[] = [];

describe("Übersetzungen der Spieltexte", () => {
  const sprachen = readdirSync(ORDNER)
    .filter((d) => d.endsWith(".json") && d !== "de.json")
    .map((d) => d.replace(/\.json$/, ""));

  it.each(sprachen.length > 0 ? sprachen : ["(keine)"])("%s passt zu de.json", (sprache) => {
    if (sprache === "(keine)") return;
    const texte = JSON.parse(readFileSync(resolve(ORDNER, `${sprache}.json`), "utf8")) as Record<
      string,
      string
    >;
    const befund = pruefeUebersetzung(de, texte);
    expect(befund.unbekannt).toEqual([]);
    expect(befund.platzhalter).toEqual([]);
    if (FERTIGE_SPRACHEN.includes(sprache)) expect(befund.fehlend).toEqual([]);
  });

  it("meldet fehlende, unbekannte Schlüssel und falsche Platzhalter", () => {
    const quelle = { a: "Hallo {name}", b: "Tschüss", c: "Zug {zug}" };
    const befund = pruefeUebersetzung(quelle, { a: "Hello {nom}", x: "?", c: "Move {zug}" });
    expect(befund).toEqual({ fehlend: ["b"], unbekannt: ["x"], platzhalter: ["a"] });
  });
});

describe("Spieltexte in der Sprache der App", () => {
  it("nimmt die Übersetzung und fällt bei fehlenden Schlüsseln auf Deutsch zurück", async () => {
    const englisch = { "oberwelt.aktion.sprechen": "Talk" };
    expect(await ladeSpieltexte("en", () => Promise.resolve(englisch))).toBe("en");
    expect(spielsprache()).toBe("en");
    expect(tSpiel("oberwelt.aktion.sprechen")).toBe("Talk");
    expect(tSpiel("oberwelt.aktion.ansehen")).toBe(de["oberwelt.aktion.ansehen"]);
    expect(hatSpieltext("oberwelt.aktion.ansehen")).toBe(true);
  });

  it("bleibt Deutsch, wenn das Paket die Sprache nicht hat", async () => {
    expect(await ladeSpieltexte("fr", () => Promise.reject(new Error("fehlt")))).toBe("de");
    expect(tSpiel("oberwelt.aktion.sprechen")).toBe(de["oberwelt.aktion.sprechen"]);
    expect(await ladeSpieltexte("de")).toBe("de");
  });
});
