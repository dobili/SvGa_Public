// Schreibt die Kennungen der Übungen je Kapitel aus den App-Daten nach src/daten/uebungsliste-daten.ts.
//
// Warum: Die Ringe „Übungen“ und „Teile des Buches“ (Orden, Wunsch des Autors vom 26.10.2026)
// brauchen die Zahl der Übungen schon beim Start der App; die Übungen stehen aber nur in den 13
// Kapiteldateien, die erst beim Öffnen eines Kapitels geladen werden. Die kleine Liste spart das.
// Ein Test (daten/uebungsliste.test.ts) meldet, wenn sie nicht mehr zu den Kapiteldateien passt.
// Aufruf (im Ordner app/): node skripte/erzeuge-uebungsliste.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const DATEN = resolve(HIER, "../public/daten/de/a1");
const ZIEL = resolve(HIER, "../src/daten/uebungsliste-daten.ts");

const index = JSON.parse(readFileSync(resolve(DATEN, "index.json"), "utf8"));
const zeilen = index.kapitel.map((eintrag) => {
  const kapitel = JSON.parse(readFileSync(resolve(DATEN, eintrag.datei), "utf8"));
  const ids = kapitel.uebungen.map((u) => JSON.stringify(u.id)).join(", ");
  return `  ${eintrag.kapitel}: [${ids}],`;
});
writeFileSync(
  ZIEL,
  `/**
 * Kennungen der Übungen des Buches je Kapitel, aus den Kapiteldateien der App (public/daten).
 *
 * Rolle im Gesamtbild: Die Ringe „Übungen“ und „Teile des Buches“ (Orden) zählen die gelösten
 * Übungen, ohne alle Kapitel zu laden. Erzeugt von skripte/erzeuge-uebungsliste.mjs, nicht von
 * Hand ändern; daten/uebungsliste.test.ts prüft, dass die Liste zu den Kapiteldateien passt.
 */
export const UEBUNGEN_JE_KAPITEL: Readonly<Record<number, readonly string[]>> = {
${zeilen.join("\n")}
};
`,
);
console.log(`Übungen von ${zeilen.length} Kapiteln nach ${ZIEL} geschrieben.`);
