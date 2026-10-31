/**
 * Test: Kein Schlüssel steht in einer Sprachdatei doppelt.
 *
 * Warum: JSON erlaubt doppelte Schlüssel, und beim Einlesen gewinnt der letzte. Beim
 * Zusammenführen zweier Arbeitsstände (31.10.2026, Trainer-Startseiten mit Training neu) standen
 * so ein neuer und ein alter Text unter demselben Schlüssel, und die App hätte still den alten
 * gezeigt. Der Test liest die Dateien als Text und zählt die Schlüssel selbst.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const DATEIEN = ["de.json", "en.json", "en.buchzitate.json"] as const;

/** Alle Schlüssel, die in einem flachen JSON-Objekt mehr als einmal vorkommen. */
function doppelteSchluessel(text: string): string[] {
  const gesehen = new Set<string>();
  const doppelt: string[] = [];
  JSON.parse(text); // gültiges JSON, sonst wirft der Test hier
  for (const treffer of text.matchAll(/^\s{2}"((?:[^"\\]|\\.)*)":/gm)) {
    const schluessel = treffer[1] ?? "";
    if (gesehen.has(schluessel)) doppelt.push(schluessel);
    gesehen.add(schluessel);
  }
  return doppelt;
}

describe("Sprachdateien ohne doppelte Schlüssel", () => {
  it("erkennt einen doppelten Schlüssel", () => {
    expect(doppelteSchluessel('{\n  "a": "1",\n  "b": "2",\n  "a": "3"\n}\n')).toEqual(["a"]);
  });

  for (const datei of DATEIEN) {
    it(`${datei} hat jeden Schlüssel nur einmal`, () => {
      const text = readFileSync(new URL(`./${datei}`, import.meta.url), "utf8");
      expect(doppelteSchluessel(text)).toEqual([]);
    });
  }
});
