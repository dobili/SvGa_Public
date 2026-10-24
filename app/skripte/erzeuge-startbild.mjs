// Erzeugt das Bild der Startanimation (R39) aus dem Cover: der goldene Springer mittig, darunter
// das Schachbrett mit seinem Schatten wie auf dem Cover (Wunsch des Autors vom 24.10.2026).
//
// Warum ein eigenes Bild: Das App-Symbol (erzeuge-appsymbol.mjs) ist eng um den Springer
// geschnitten; im Kreis der Startanimation stand sein Sockel deshalb auf dem unteren Rand, und
// ein bloßes Verkleinern ließ nur einen einfarbigen Rand um ihn. Dieser Ausschnitt ist größer und
// reicht unten bis ins Brett. Er beginnt unter der Unterzeile des Covers (sie endet bei Zeile 775),
// damit kein Text hineinragt. Farbe, Schärfe und Abdunkeln zum Rand wie beim App-Symbol
// (erzeuge-appsymbol.mjs), damit die Animation so satt wirkt wie vorher.
//
// Eingabe: das Cover in voller Auflösung (1697 × 2400) als PNG oder JPEG. Am besten aus dem
// verlustfreien TIF des Autors (cover_A4.tif in den Buchquellen), umgewandelt mit
//   python3 -c "from PIL import Image; Image.open('buch/a1/cover_A4.tif').convert('RGB').save('buch/arbeit/cover-original.png')"
// Aufruf (im Ordner app/):  node skripte/erzeuge-startbild.mjs ../buch/arbeit/cover-original.png
//   (in der Cloud-Umgebung mit CHROMIUM_PFAD=/opt/pw-browsers/…/chrome, siehe CLAUDE.md)
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
 * Ausschnitt im Cover (Bildpunkte bei 1697 × 2400): Kreis um (890, 1345) mit Radius 560. Der
 * Springer reicht etwa von y = 900 bis 1750, seine Mitte (1325) liegt also fast in der Mitte des
 * Kreises (Wunsch des Autors, 24.10.2026); darunter liegen sein Schatten und das Brett.
 */
const AUSSCHNITT = { x: 330, y: 785, seite: 1120 };
/** Kantenlänge des Ergebnisses: scharf bei 260 CSS-Pixeln und dreifacher Pixeldichte. */
const GROESSE = 840;
const WEBP_QUALITAET = 0.9;
/** Wie beim App-Symbol (erzeuge-appsymbol.mjs): Farbe „knackiger“, Schärfe, Rand in Navy. */
const FARBFILTER = "contrast(1.2) saturate(1.1)";
const SCHAERFE = 0.6;
const ABDUNKELN_AB = 0.45;
const ABDUNKELN_DECKUNG = 0.97;
const NAVY_TIEF = "11, 20, 36";

/** Schneidet den Ausschnitt im Browser zu, bearbeitet ihn wie das App-Symbol, gibt WebP zurück. */
function zeichne({ bild, ausschnitt, groesse, qualitaet, filter, schaerfe, ab, deckung, navy }) {
  /** Schärft mit einem einfachen Laplace-Kern: Pixel minus Mittel der vier Nachbarn, verstärkt. */
  const schaerfen = (g) => {
    const daten = g.getImageData(0, 0, groesse, groesse);
    const alt = new Uint8ClampedArray(daten.data);
    const zeile = groesse * 4;
    for (let i = zeile + 4; i < alt.length - zeile - 4; i += 1) {
      if (i % 4 === 3) continue;
      const nachbarn = alt[i - 4] + alt[i + 4] + alt[i - zeile] + alt[i + zeile];
      daten.data[i] = alt[i] + schaerfe * (4 * alt[i] - nachbarn);
    }
    g.putImageData(daten, 0, 0);
  };
  return new Promise((fertig, fehler) => {
    const img = new Image();
    img.onerror = () => fehler(new Error("Cover nicht lesbar"));
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = groesse;
      c.height = groesse;
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.filter = filter;
      const { x, y, seite } = ausschnitt;
      g.drawImage(img, x, y, seite, seite, 0, 0, groesse, groesse);
      g.filter = "none";
      schaerfen(g);
      const mitte = groesse / 2;
      const verlauf = g.createRadialGradient(
        mitte,
        mitte,
        mitte * ab,
        mitte,
        mitte,
        mitte * Math.SQRT2,
      );
      verlauf.addColorStop(0, `rgba(${navy}, 0)`);
      verlauf.addColorStop(1, `rgba(${navy}, ${deckung})`);
      g.fillStyle = verlauf;
      g.fillRect(0, 0, groesse, groesse);
      fertig(c.toDataURL("image/webp", qualitaet));
    };
    img.src = bild;
  });
}

async function main() {
  const quelle = process.argv[2];
  if (!quelle) throw new Error("Aufruf: node skripte/erzeuge-startbild.mjs <cover.jpg>");
  const art = quelle.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  const bild = `data:image/${art};base64,${(await readFile(quelle)).toString("base64")}`;
  const browser = await chromium.launch(
    process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {},
  );
  const seite = await browser.newPage();
  const daten = await seite.evaluate(zeichne, {
    bild,
    ausschnitt: AUSSCHNITT,
    groesse: GROESSE,
    qualitaet: WEBP_QUALITAET,
    filter: FARBFILTER,
    schaerfe: SCHAERFE,
    ab: ABDUNKELN_AB,
    deckung: ABDUNKELN_DECKUNG,
    navy: NAVY_TIEF,
  });
  await browser.close();
  await mkdir(dirname(ZIEL), { recursive: true });
  await writeFile(ZIEL, Buffer.from(daten.split(",")[1], "base64"));
  console.log(`${ZIEL} (${GROESSE} px)`);
}

await main();
