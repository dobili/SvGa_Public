/**
 * Wache gegen Effekte mit Ausdruck als Körper (Befund 1.11.2026).
 *
 * Warum: Neuere Chrome-Versionen geben bei window.scrollTo und anderen Bildlauf-Methoden ein
 * Promise zurück. Ein Effekt wie `useEffect(() => window.scrollTo(0, 0), [])` gibt es dann an
 * React zurück, React hält es für die Aufräumfunktion und stürzt beim Verlassen ab („destroy_ is
 * not a function“, so auf der Karte des Variationsbrowsers gesehen). Effekte haben deshalb immer
 * einen Block als Körper; ausgenommen sind Effekte, die bewusst eine Aufräumfunktion zurückgeben.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Effekte, die absichtlich eine vorhandene Aufräumfunktion zurückgeben. */
const ERLAUBT = new Set(["halt", "schreibe"]);
const EFFEKT_MIT_AUSDRUCK = /use(?:Layout)?Effect\(\(\) => (?![{\s])([A-Za-z_$][\w$]*)?[^\n]*/g;

function dateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name);
    if (statSync(pfad).isDirectory()) return dateien(pfad);
    return /\.tsx?$/.test(name) && !name.endsWith(".test.ts") ? [pfad] : [];
  });
}

describe("Effekte", () => {
  it("haben einen Block als Körper oder geben eine Aufräumfunktion zurück", () => {
    const funde: string[] = [];
    for (const datei of dateien("src")) {
      for (const treffer of readFileSync(datei, "utf8").matchAll(EFFEKT_MIT_AUSDRUCK)) {
        const ganz = treffer[0].trim();
        const name = treffer[1] ?? "";
        const nurName = new RegExp(`=> ${name}, \\[`).test(ganz);
        if (!(ERLAUBT.has(name) && nurName)) funde.push(`${datei}: ${ganz}`);
      }
    }
    expect(funde).toEqual([]);
  });
});
