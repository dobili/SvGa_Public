/**
 * Figurenbögen aus PixelLab zusammensetzen (Wunsch des Haupt-Chats, 13.11.2026): je Figur ein
 * Ordner im privaten Repository (`figuren-neu/<name>/rotations/<richtung>.png` 32 × 32 und
 * `animations/Walk/<richtung>/frame_00N.png` 48 × 48 mit der Figur mittig) wird zu einem Bogen mit
 * Rahmen 32 × 32 in der Ordnung von LimeZu: obere Reihe die Standbilder (rechts, oben, links,
 * unten), untere Reihe ab Rahmen 24 je Richtung sechs Laufbilder. So liest die App beide Formate
 * gleich (app/src/abenteuer/oberwelt/figurbilder.ts).
 *
 * Entscheidungen:
 * - Die Laufbilder werden auf 32 × 32 um die Mitte zugeschnitten (8 Pixel Rand je Seite); dann
 *   stehen die Füße wie bei den Standbildern auf Zeile 30.
 * - Der Bodenschatten des Exports (Farbe #4f4f4e unter den Füßen, in Lauf- und Standbildern)
 *   wird überall entfernt, damit alle Figuren gleich aussehen; einen eigenen Schatten gibt es nicht.
 * - Fehlt eine Laufrichtung, wird links aus rechts gespiegelt (und umgekehrt); sonst bleibt das
 *   Standbild stehen. Fehlt ein Standbild, gilt das erste Laufbild oder das Spiegelbild.
 * Abhängigkeiten: sharp.
 */
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const RAHMEN = 32;
const LAUF_RAHMEN = 48;
const RAND = (LAUF_RAHMEN - RAHMEN) / 2;
const SPALTEN = 24;
const LAUFBILDER = 6;
const KANAELE = 4;
/** Schattenfarbe des Exports und ab welcher Zeile (im 32er-Rahmen) sie als Schatten gilt. */
const SCHATTEN = [0x4f, 0x4f, 0x4e];
const SCHATTEN_AB_ZEILE = 24;

/** Richtungen in der Ordnung von LimeZu, mit dem Namen bei PixelLab und dem Spiegelpartner. */
const RICHTUNGEN = [
  { name: "east", spiegel: "west" },
  { name: "north", spiegel: null },
  { name: "west", spiegel: "east" },
  { name: "south", spiegel: null },
];

/** Ein Bild als rohe RGBA-Pixel. */
async function roh(pfad) {
  const { data, info } = await sharp(pfad)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { pixel: data, breite: info.width, hoehe: info.height };
}

/** Macht die Schattenpixel unter den Füßen eines 32er-Rahmens durchsichtig (verändert ihn). */
export function ohneSchatten(rahmen) {
  for (let y = SCHATTEN_AB_ZEILE; y < RAHMEN; y++) {
    for (let x = 0; x < RAHMEN; x++) {
      const p = (y * RAHMEN + x) * KANAELE;
      if (SCHATTEN.every((wert, k) => rahmen[p + k] === wert)) rahmen.fill(0, p, p + KANAELE);
    }
  }
  return rahmen;
}

/** Schneidet die Mitte eines 48er-Laufbilds auf 32 × 32 aus, ohne Schatten. */
export function laufrahmen(bild) {
  const aus = Buffer.alloc(RAHMEN * RAHMEN * KANAELE);
  for (let y = 0; y < RAHMEN; y++) {
    const q = ((y + RAND) * bild.breite + RAND) * KANAELE;
    bild.pixel.copy(aus, y * RAHMEN * KANAELE, q, q + RAHMEN * KANAELE);
  }
  return ohneSchatten(aus);
}

/** Spiegelt einen 32er-Rahmen waagerecht. */
export function gespiegelt(rahmen) {
  const aus = Buffer.alloc(rahmen.length);
  for (let y = 0; y < RAHMEN; y++) {
    for (let x = 0; x < RAHMEN; x++) {
      const q = (y * RAHMEN + x) * KANAELE;
      const z = (y * RAHMEN + (RAHMEN - 1 - x)) * KANAELE;
      rahmen.copy(aus, z, q, q + KANAELE);
    }
  }
  return aus;
}

/** Die Laufbilder einer Richtung (bis zu sechs), oder null. */
async function laufbilder(ordner, richtung) {
  const pfad = join(ordner, "animations", "Walk", richtung);
  if (!existsSync(pfad)) return null;
  const namen = (await readdir(pfad)).filter((n) => n.endsWith(".png")).sort();
  if (namen.length === 0) return null;
  return Promise.all(
    namen.slice(0, LAUFBILDER).map(async (n) => laufrahmen(await roh(join(pfad, n)))),
  );
}

/** Das Standbild einer Richtung als 32er-Rahmen, oder null. */
async function standbild(ordner, richtung) {
  const pfad = join(ordner, "rotations", `${richtung}.png`);
  if (!existsSync(pfad)) return null;
  const bild = await roh(pfad);
  return bild.breite === RAHMEN ? ohneSchatten(bild.pixel) : laufrahmen(bild);
}

/** Legt einen Rahmen an Spalte und Zeile in den Bogen. */
function lege(bogen, rahmen, spalte, zeile) {
  for (let y = 0; y < RAHMEN; y++) {
    const z = ((zeile * RAHMEN + y) * SPALTEN * RAHMEN + spalte * RAHMEN) * KANAELE;
    rahmen.copy(bogen, z, y * RAHMEN * KANAELE, (y + 1) * RAHMEN * KANAELE);
  }
}

/** Standbild und Laufbilder je Richtung, mit Spiegelung und Rückfall wie im Dateikopf. */
async function sammle(ordner) {
  const roheDaten = {};
  for (const { name } of RICHTUNGEN) {
    roheDaten[name] = {
      still: await standbild(ordner, name),
      lauf: await laufbilder(ordner, name),
    };
  }
  return RICHTUNGEN.map(({ name, spiegel }) => {
    const eigen = roheDaten[name];
    const partner = spiegel ? roheDaten[spiegel] : null;
    const lauf = eigen.lauf ?? partner?.lauf?.map(gespiegelt) ?? null;
    const still =
      eigen.still ?? (partner?.still ? gespiegelt(partner.still) : null) ?? lauf?.[0] ?? null;
    return { still, lauf: lauf ?? (still ? Array(LAUFBILDER).fill(still) : null) };
  });
}

/**
 * Baut den Bogen einer Figur (PNG) aus ihrem PixelLab-Ordner; null, wenn kein Bild da ist.
 * Beispiel: figuren-neu/juno → 768 × 64 Pixel, Rahmen 32 × 32.
 */
export async function baueFigurenbogen(ordner) {
  const richtungen = await sammle(ordner);
  if (richtungen.every((r) => !r.still)) return null;
  const leer = Buffer.alloc(RAHMEN * RAHMEN * KANAELE);
  const bogen = Buffer.alloc(SPALTEN * RAHMEN * 2 * RAHMEN * KANAELE);
  richtungen.forEach((r, i) => {
    lege(bogen, r.still ?? leer, i, 0);
    (r.lauf ?? []).forEach((rahmen, j) => {
      const nummer = SPALTEN + i * LAUFBILDER + j;
      lege(bogen, rahmen, nummer % SPALTEN, Math.floor(nummer / SPALTEN));
    });
  });
  return sharp(bogen, { raw: { width: SPALTEN * RAHMEN, height: 2 * RAHMEN, channels: KANAELE } })
    .png()
    .toBuffer();
}
