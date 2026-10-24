// Erzeugt das Bild der Startanimation (R39) aus dem Cover: der goldene Springer mittig, darunter
// das Schachbrett mit seinem Schatten wie auf dem Cover (Wunsch des Autors vom 24.10.2026).
//
// Warum ein eigenes Bild: Das App-Symbol (erzeuge-appsymbol.mjs) ist eng um den Springer
// geschnitten; im Kreis der Startanimation stand sein Sockel deshalb auf dem unteren Rand, und
// ein bloßes Verkleinern ließ nur einen einfarbigen Rand um ihn. Dieser Ausschnitt ist größer und
// reicht unten bis ins Brett. Er beginnt unter der Unterzeile des Covers, damit kein Text
// hineinragt. Die Farben bleiben wie im Cover (ohne Filter des App-Symbols).
//
// Eingabe: das Cover als JPEG in voller Auflösung (1697 × 2400), etwa aus den Buchquellen mit
//   pdfimages -j buch/a1/cover_a4.pdf buch/arbeit/cover
// Aufruf:  node skripte/erzeuge-startbild.mjs ../buch/arbeit/cover-000.jpg
// Ausgabe: public/bilder/startspringer.webp (quadratisch; rund schneidet die Oberfläche).
// Das Cover selbst kommt nicht ins Repository, nur das erzeugte Bild.
// Abhängigkeiten: Playwright (Chromium) zum Zuschneiden und Speichern als WebP.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = resolve(HIER, "../public/bilder/startspringer.webp");

/**
 * Ausschnitt im Cover (Bildpunkte bei 1697 × 2400): Kreis um (890, 1420) mit Radius 630. Der
 * Springer reicht etwa von y = 900 bis 1760, steht also knapp über der Mitte; darunter das Brett.
 */
const AUSSCHNITT = { x: 260, y: 790, seite: 1260 };
/** Kantenlänge des Ergebnisses: scharf auch bei 260 CSS-Pixeln und doppelter Pixeldichte. */
const GROESSE = 560;
const WEBP_QUALITAET = 0.85;

/** Schneidet den Ausschnitt im Browser zu und gibt ihn als WebP-Daten-URL zurück. */
function zeichne({ bild, ausschnitt, groesse, qualitaet }) {
  return new Promise((fertig, fehler) => {
    const img = new Image();
    img.onerror = () => fehler(new Error("Cover nicht lesbar"));
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = groesse;
      c.height = groesse;
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      const { x, y, seite } = ausschnitt;
      g.drawImage(img, x, y, seite, seite, 0, 0, groesse, groesse);
      fertig(c.toDataURL("image/webp", qualitaet));
    };
    img.src = bild;
  });
}

async function main() {
  const quelle = process.argv[2];
  if (!quelle) throw new Error("Aufruf: node skripte/erzeuge-startbild.mjs <cover.jpg>");
  const bild = `data:image/jpeg;base64,${(await readFile(quelle)).toString("base64")}`;
  const browser = await chromium.launch(
    process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {},
  );
  const seite = await browser.newPage();
  const daten = await seite.evaluate(zeichne, {
    bild,
    ausschnitt: AUSSCHNITT,
    groesse: GROESSE,
    qualitaet: WEBP_QUALITAET,
  });
  await browser.close();
  await mkdir(dirname(ZIEL), { recursive: true });
  await writeFile(ZIEL, Buffer.from(daten.split(",")[1], "base64"));
  console.log(`${ZIEL} (${GROESSE} px)`);
}

await main();
