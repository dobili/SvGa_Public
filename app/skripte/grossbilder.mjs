// Bilder der Großansicht (#bild) und Fundbilder, die der Autor selbst hochlädt, ins Format des Spiels
// (skripte/baue-abenteuerpaket.mjs, kopiereBilder).
//
// Warum: Bisher kamen Gemini-Bilder nur über eine Sitzung ins Spiel, die sie zuschnitt
// (werkzeuge/gemini_lieferung_*.py im privaten Repository). Damit die Bilder der Einleitung (E1 bis
// E4) sofort ankommen, sobald der Autor sie hochlädt (Auftrag 20.11.2026), nimmt der Paketbau auch
// ein PNG oder JPG mit dem Namen aus dem Auftrag (etwa „einzug-fahrt.png“) aus spiel/bilder/ und
// macht daraus das Format des Spiels:
// - Szene: Ausschnitt 4:3 aus der Mitte, Raster 256 × 192 (je Block ein Pixel, nächster Nachbar),
//   vierfach vergrößert auf 1024 × 768;
// - Fundbild („fund-…“): Ausschnitt quadratisch, Raster 128 × 128, vierfach auf 512 × 512;
// - verlustfreies WebP wie alle Bilder des Pakets.
// Liegt schon ein WebP gleichen Namens dort, gilt das WebP (zugeschnitten von einer Sitzung).
// Abhängigkeiten: sharp.
import sharp from "sharp";

/** Raster und Vergrößerung je Bildart. */
const SZENE = { breite: 256, hoehe: 192 };
const FUND = { breite: 128, hoehe: 128 };
const VERGROESSERUNG = 4;
/** Endungen, die der Autor hochladen darf. */
export const HOCHGELADEN = [".png", ".jpg", ".jpeg"];

/** Raster des Bildes nach seinem Namen. Beispiel: „fund-schluessel“ → 128 × 128. */
export function rasterFuer(name) {
  return name.startsWith("fund-") ? FUND : SZENE;
}

/**
 * Ein hochgeladenes Bild im Format des Spiels. Eingabe: Bytes und Name ohne Endung.
 * Ausgabe: verlustfreies WebP. Beispiel: Gemini-Bild 1408 × 1056 „einzug-fahrt“ → 1024 × 768.
 */
export async function alsGrossbild(bytes, name) {
  const raster = rasterFuer(name);
  const klein = await sharp(bytes)
    .rotate()
    .resize(raster.breite, raster.hoehe, { fit: "cover", position: "centre", kernel: "nearest" })
    .png()
    .toBuffer();
  return sharp(klein)
    .resize(raster.breite * VERGROESSERUNG, raster.hoehe * VERGROESSERUNG, { kernel: "nearest" })
    .webp({ lossless: true })
    .toBuffer();
}
