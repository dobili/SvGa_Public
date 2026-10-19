// Erzeugt die App-Symbole für den Startbildschirm aus dem goldenen Springer des Buchcovers
// (seit 0.2.106, Vorschlag DS37, Wunsch des Autors vom 19.10.2026).
//
// Warum: Das Cover zeigt den Springer mit Pfeilen, Kreisen und Zielmarken; als App-Symbol erkennt
// man die App so auf dem Startbildschirm wieder. Bei 60 Pixeln (Startbildschirm) bleibt der
// Springer gut erkennbar, bei 16 bis 32 Pixeln (Browser-Tab) nicht mehr; dort bleibt der schlichte
// Springer aus erzeuge-symbole.mjs (symbol.svg). Der Ausschnitt wird zum Rand hin in Navy
// abgedunkelt, damit die roten Figuren im Hintergrund nicht ablenken.
//
// Eingabe: das Cover als JPEG in voller Auflösung (1697 × 2400), etwa aus den Buchquellen mit
//   pdfimages -j buch/a1/cover_a4.pdf buch/arbeit/cover
// Aufruf:  node skripte/erzeuge-appsymbol.mjs ../buch/arbeit/cover-000.jpg
// Danach auf 256 Farben verkleinern (von 1,3 MB auf etwa ein Viertel, für den Offline-Speicher):
//   python3 -c "from PIL import Image; import glob; [Image.open(f).convert('RGB').quantize(256,
//   dither=Image.Dither.FLOYDSTEINBERG).save(f, optimize=True) for f in glob.glob('public/symbole/*.png')]"
// Das Cover selbst kommt nicht ins Repository, nur die erzeugten Symbole (public/symbole/).
// Abhängigkeiten: Playwright (Chromium) zum Zuschneiden und Speichern als PNG.
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = resolve(HIER, "../public/symbole");

/** Ausschnitt im Cover (Bildpunkte bei 1697 × 2400): Springer mit dem Kreis aus Pfeilen. */
const AUSSCHNITT = { x: 400, y: 800, seite: 980 };
/** Ab diesem Anteil des Radius dunkelt der Rand zum Navy der App ab. */
const ABDUNKELN_AB = 0.55;
const NAVY_TIEF = "11, 20, 36";

/**
 * Ausschnitt für maskierbare Symbole, die Android rund beschneidet (sichere Zone: Kreis mit 80 %
 * Durchmesser): etwas weiter, damit Ohren und Fuß des Springers sichtbar bleiben, und so weit
 * unten, dass die Unterzeile des Covers nicht hineinragt.
 */
const AUSSCHNITT_MASKIERBAR = { x: 350, y: 800, seite: 1080 };

const VARIANTEN = [
  { datei: "symbol-192.png", groesse: 192, ausschnitt: AUSSCHNITT },
  { datei: "symbol-512.png", groesse: 512, ausschnitt: AUSSCHNITT },
  { datei: "symbol-maskierbar-512.png", groesse: 512, ausschnitt: AUSSCHNITT_MASKIERBAR },
  { datei: "apple-touch-icon.png", groesse: 180, ausschnitt: AUSSCHNITT },
];

/** Zeichnet ein Symbol im Browser und gibt es als PNG-Daten-URL zurück. */
function zeichne({ bild, ausschnitt, groesse, abdunkelnAb, navy }) {
  return new Promise((fertig, fehler) => {
    const img = new Image();
    img.onerror = () => fehler(new Error("Cover nicht lesbar"));
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = groesse;
      c.height = groesse;
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(
        img,
        ausschnitt.x,
        ausschnitt.y,
        ausschnitt.seite,
        ausschnitt.seite,
        0,
        0,
        groesse,
        groesse,
      );
      const mitte = groesse / 2;
      const verlauf = g.createRadialGradient(
        mitte,
        mitte,
        mitte * abdunkelnAb,
        mitte,
        mitte,
        mitte * Math.SQRT2,
      );
      verlauf.addColorStop(0, `rgba(${navy}, 0)`);
      verlauf.addColorStop(1, `rgba(${navy}, 0.92)`);
      g.fillStyle = verlauf;
      g.fillRect(0, 0, groesse, groesse);
      fertig(c.toDataURL("image/png"));
    };
    img.src = bild;
  });
}

async function main() {
  const quelle = process.argv[2];
  if (!quelle) throw new Error("Aufruf: node skripte/erzeuge-appsymbol.mjs <cover.jpg>");
  const bild = `data:image/jpeg;base64,${(await readFile(quelle)).toString("base64")}`;
  const browser = await chromium.launch(
    process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {},
  );
  const seite = await browser.newPage();
  for (const v of VARIANTEN) {
    const daten = await seite.evaluate(zeichne, {
      bild,
      ausschnitt: v.ausschnitt,
      groesse: v.groesse,
      abdunkelnAb: ABDUNKELN_AB,
      navy: NAVY_TIEF,
    });
    await writeFile(resolve(ZIEL, v.datei), Buffer.from(daten.split(",")[1], "base64"));
    console.log(`${v.datei} (${v.groesse} px)`);
  }
  await browser.close();
}

await main();
