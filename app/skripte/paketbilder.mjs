// Rasterbilder des Abenteuerpakets als verlustfreies WebP (skripte/baue-abenteuerpaket.mjs).
//
// Warum: Kartenhintergründe, Möbel, Figurenbögen und Porträtblätter waren im Paket rund 9 MB PNG.
// Verlustfreies WebP zeigt dieselben Pixel (geprüft an allen Bildern des Pakets, 15.11.2026) und
// braucht etwa ein Viertel des Platzes: weniger Download für einfache Handys und weniger Speicher
// im Cache. Die Namen im Code bleiben die der Quellen („moebel/sofa.png“); der Paketlader setzt
// die Endung um (src/abenteuer/paket/paketlader.ts, paketpfad). Bilder, die schon WebP sind, und
// SVG bleiben, wie sie sind.
// Zwischenspeicher: Ein umgewandeltes Bild liegt unter seiner Prüfsumme in
// node_modules/.cache/abenteuer-webp/, damit „npm run vorbereiten“ nicht bei jedem Lauf alle
// 2000 Bilder neu rechnet (erster Lauf etwa 12 s, danach unter einer Sekunde).
// Abhängigkeiten: sharp (wie skripte/figurenbogen.mjs).
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZWISCHENSPEICHER = resolve(HIER, "../node_modules/.cache/abenteuer-webp");
/**
 * Mühe des Kodierers (0 bis 6): 4 ist fast so klein wie 6 (Messung 15.11.2026: 2221 gegen
 * 2224 KB für Karten, Möbel und Figuren) und etwas schneller.
 */
const MUEHE = 4;
/** Stand der Umwandlung; ändert sich die Einstellung, gilt der Zwischenspeicher nicht mehr. */
const FASSUNG = `webp-lossless-${MUEHE}`;

/**
 * Der Paketpfad eines Bildes: „.png“ wird „.webp“, alles andere bleibt.
 * Beispiel: „grafik/karten/mapleFalls.park.png“ → „grafik/karten/mapleFalls.park.webp“.
 */
export function webpPfad(pfad) {
  return pfad.replace(/\.png$/, ".webp");
}

/** Ist die Datei ein PNG, das ins Paket als WebP kommt? */
export function wirdWebp(pfad) {
  return pfad.endsWith(".png");
}

/**
 * Wandelt ein PNG verlustfrei in WebP um (mit Zwischenspeicher). Eingabe: Bytes des PNG.
 * Ausgabe: Bytes des WebP. Ein kaputtes PNG bricht den Paketbau ab (sharp wirft).
 */
export async function alsWebp(bytes) {
  const schluessel = createHash("sha256").update(FASSUNG).update(bytes).digest("hex");
  const datei = join(ZWISCHENSPEICHER, `${schluessel}.webp`);
  if (existsSync(datei)) return readFile(datei);
  const webp = await sharp(bytes).webp({ lossless: true, effort: MUEHE }).toBuffer();
  await mkdir(ZWISCHENSPEICHER, { recursive: true });
  await writeFile(datei, webp);
  return webp;
}
