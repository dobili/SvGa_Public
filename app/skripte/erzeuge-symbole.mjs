// Erzeugt die App-Symbole (Startbildschirm, Browser-Tab) aus dem Springer des Buches.
//
// Warum: Android und iPhone brauchen Symbole als PNG in festen Größen. Gezeichnet wird der
// weiße Springer aus der Figurenschrift SkakNew (wie in den Diagrammen) auf Navy.
// Das Ergebnis liegt im Repository (public/symbole/); das Skript wird nur bei Änderungen
// am Symbol erneut ausgeführt:  node skripte/erzeuge-symbole.mjs
//
// Abhängigkeiten: Playwright (Chromium) zum Umwandeln von SVG in PNG.
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = resolve(HIER, "../public/symbole");
const FIGUREN = resolve(HIER, "../src/ui/brett/figurenpfade.generiert.ts");

const NAVY = "#16253D";
const CREME = "#F5F0E6";
const GOLD = "#C9A227";

/** Liest die beiden Pfade des weißen Springers aus dem erzeugten Figurenmodul. */
async function springerpfade() {
  const text = await readFile(FIGUREN, "utf8");
  const block = text.split(/\n {2}N: \{/)[1];
  const schattenriss = /schattenriss: "([^"]+)"/.exec(block)[1];
  const figur = /figur: "([^"]+)"/.exec(block)[1];
  return { schattenriss, figur };
}

/**
 * Baut das Symbol als SVG. „rand“ ist der Anteil, um den der Springer verkleinert wird:
 * maskierbare Symbole brauchen einen Sicherheitsrand, weil Android sie rund beschneidet.
 */
function symbolSvg({ schattenriss, figur }, rand, ecken) {
  const skala = 1 - 2 * rand;
  const versatz = 1000 * rand;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<rect width="1000" height="1000" rx="${ecken}" fill="${NAVY}"/>
<rect x="80" y="905" width="840" height="22" fill="${GOLD}" opacity="${ecken > 0 ? 1 : 0}"/>
<g transform="translate(${versatz} ${versatz}) scale(${skala})">
<path d="${schattenriss}" fill="${CREME}"/><path d="${figur}" fill="${NAVY}"/>
</g></svg>`;
}

async function main() {
  const pfade = await springerpfade();
  const varianten = [
    { datei: "symbol.svg", rand: 0.04, ecken: 160, groesse: 0 },
    { datei: "symbol-192.png", rand: 0.04, ecken: 0, groesse: 192 },
    { datei: "symbol-512.png", rand: 0.04, ecken: 0, groesse: 512 },
    { datei: "symbol-maskierbar-512.png", rand: 0.16, ecken: 0, groesse: 512 },
    { datei: "apple-touch-icon.png", rand: 0.08, ecken: 0, groesse: 180 },
  ];
  const browser = await chromium.launch(
    process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {},
  );
  const seite = await browser.newPage();
  for (const v of varianten) {
    const svg = symbolSvg(pfade, v.rand, v.ecken);
    if (v.groesse === 0) {
      await writeFile(resolve(ZIEL, v.datei), svg);
      continue;
    }
    await seite.setViewportSize({ width: v.groesse, height: v.groesse });
    await seite.setContent(
      `<body style="margin:0"><div style="width:${v.groesse}px;height:${v.groesse}px">${svg.replace("<svg ", `<svg width="${v.groesse}" height="${v.groesse}" `)}</div></body>`,
    );
    await seite.screenshot({ path: resolve(ZIEL, v.datei), omitBackground: false });
  }
  await browser.close();
  console.log(`${varianten.length} Symbole nach public/symbole/ geschrieben.`);
}

main().catch((fehler) => {
  console.error("Symbole konnten nicht erzeugt werden:", fehler);
  process.exit(1);
});
