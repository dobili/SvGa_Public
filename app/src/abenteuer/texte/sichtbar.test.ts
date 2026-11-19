/**
 * Kein sichtbarer Text im Code des Abenteuers (docs/spiel/17_Mehrsprachigkeit.md, Abschnitt 2,
 * Regel 1) und zusammengesetzte Textschlüssel mit Gegenstück in de.json.
 *
 * Warum: Die englische Fassung kommt, wenn das Spiel auf Deutsch fertig ist (Autor, 10.11.2026).
 * Bis dahin muss jeder Satz, den der Spieler sieht, über einen Schlüssel laufen. Der Typ
 * Spieltextschluessel prüft nur feste Schlüssel; zusammengesetzte wie
 * `tisch.ambrose.${art}.${n}` und Text direkt in JSX prüfte bisher nichts (Nacharbeit zum
 * 19.11.2026: Einleitung, Rückmeldungen, Zeit-Hinweise, Zielpfeil, Erzählzeit).
 * Ausgenommen ist die Testleiste des Autors (anbindung/Testleiste.tsx): Sie wird nie
 * ausgeliefert und nie übersetzt.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import de from "../../../../inhalte/abenteuer/texte/de.json";

const ORDNER = resolve(__dirname, "..");
/** Dateien, die sichtbaren deutschen Text haben dürfen (nie ausgeliefert). */
const AUSNAHMEN = ["Testleiste.tsx"];

/** Alle Quelldateien unter dem Abenteuer, ohne Tests und Messungen. */
function quellen(ordner: string, endung: RegExp): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name);
    if (statSync(pfad).isDirectory()) return quellen(pfad, endung);
    const quelle = endung.test(name) && !/\.(test|messung|testhilfe)\./.test(name);
    return quelle ? [pfad] : [];
  });
}

/** Der Code ohne Kommentare. */
function ohneKommentare(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1");
}

/** Text zwischen JSX-Tags und in sichtbaren Attributen, der nach Wörtern aussieht. */
function sichtbareTexte(code: string): string[] {
  const zwischen = [...code.matchAll(/>\s*([^<>{}\n]*[A-Za-zÄÖÜäöüß]{3,}[^<>{}\n]*?)\s*</g)]
    .map((m) => (m[1] ?? "").trim())
    // Ausdrücke und Typen (Promise<…>, Vergleiche) sind kein Text.
    .filter((t) => !/[=()&|;:]|^\w+\.\w+$|^\w+$/.test(t));
  const attribute = [
    ...code.matchAll(/\b(?:aria-label|title|alt|placeholder)="([^"]*[A-Za-zÄÖÜäöüß]{3,}[^"]*)"/g),
  ].map((m) => m[1] ?? "");
  return [...zwischen.filter((t) => /\s/.test(t)), ...attribute];
}

describe("Spieltexte nur über Schlüssel", () => {
  it("kein sichtbarer Text in den Ansichten des Abenteuers", () => {
    const funde = quellen(ORDNER, /\.tsx$/)
      .filter((pfad) => !AUSNAHMEN.some((a) => pfad.endsWith(a)))
      .flatMap((pfad) =>
        sichtbareTexte(ohneKommentare(readFileSync(pfad, "utf8"))).map((t) => `${pfad}: ${t}`),
      );
    expect(funde).toEqual([]);
  });

  it("jeder zusammengesetzte Schlüssel hat Gegenstücke in de.json", () => {
    const schluessel = Object.keys(de);
    const funde = quellen(ORDNER, /\.tsx?$/).flatMap((pfad) => {
      const code = ohneKommentare(readFileSync(pfad, "utf8"));
      return [...code.matchAll(/tSpiel\(\s*`([a-zA-Z0-9_.]+)\$\{/g)]
        .map((m) => m[1] ?? "")
        .filter((praefix) => !schluessel.some((k) => k.startsWith(praefix)))
        .map((praefix) => `${pfad}: ${praefix}…`);
    });
    expect(funde).toEqual([]);
  });

  it("erkennt Text in JSX und Attributen, nicht aber Ausdrücke", () => {
    expect(sichtbareTexte("<p>Weiter geht es</p>")).toEqual(["Weiter geht es"]);
    expect(sichtbareTexte('<b aria-label="Spielmenü öffnen" />')).toEqual(["Spielmenü öffnen"]);
    expect(sichtbareTexte('<p>{tSpiel("a.b")}</p><i>{x && y}</i>')).toEqual([]);
  });
});
