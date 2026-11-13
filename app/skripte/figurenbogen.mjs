/**
 * Figurenbögen aus PixelLab zusammensetzen (Wunsch des Haupt-Chats, 13.11.2026): je Figur ein
 * Ordner im privaten Repository (`figuren-neu/<name>/rotations/<richtung>.png` 32 × 32 und
 * `animations/Walk/<richtung>/frame_00N.png` oder `animations/Walking/…`, 48 × 48 mit der Figur mittig) wird zu einem Bogen mit
 * Rahmen 32 × 32 in der Ordnung von LimeZu: obere Reihe die Standbilder (rechts, oben, links,
 * unten), untere Reihe ab Rahmen 24 je Richtung sechs Laufbilder. So liest die App beide Formate
 * gleich (app/src/abenteuer/oberwelt/figurbilder.ts).
 *
 * Entscheidungen:
 * - Die Leinwand der Figur steht in metadata.json (states[].character.size; Erwachsene 32,
 *   jüngere Kinder 24, Doc 24). Die Laufbilder werden auf die Leinwand um die Mitte
 *   zugeschnitten (bei 32 und 48er-Laufbildern 8 Pixel Rand je Seite); dann stehen die Füße wie
 *   bei den Standbildern.
 * - Ist die Leinwand kleiner als 32, wird jedes Bild unten bündig und waagrecht mittig auf
 *   32 × 32 aufgefüllt (Füße unten mittig, wie die Erwachsenen).
 * - Der Bodenschatten des Exports (Farbe #4f4f4e unter den Füßen, in Lauf- und Standbildern)
 *   wird überall entfernt, damit alle Figuren gleich aussehen; einen eigenen Schatten gibt es nicht.
 * - Fehlt eine Laufrichtung, wird links aus rechts gespiegelt (und umgekehrt); sonst bleibt das
 *   Standbild stehen. Fehlt ein Standbild, gilt das erste Laufbild oder das Spiegelbild.
 * - Sitzbilder (Wunsch des Autors R020, Doc 24): Hat der Export `animations/Sitting/<richtung>/`,
 *   bekommt der Bogen eine dritte Reihe mit vier Sitzbildern ab Rahmen 48 (erstes Bild je
 *   Richtung, Ordnung wie die Standbilder; fehlende gespiegelt oder das Standbild). Die App
 *   erkennt die Reihe an der Bogenhöhe (oberwelt/sitzrichtung.ts).
 * Abhängigkeiten: sharp.
 */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const RAHMEN = 32;
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

/**
 * Setzt ein Bild unten bündig und waagrecht mittig in einen 32er-Rahmen, ohne Schatten.
 * Beispiel: 24 × 24 → 4 Pixel Rand links und rechts, 8 oben, Füße auf der untersten Zeile.
 */
export function imRahmen(pixel, breite, hoehe) {
  const aus = Buffer.alloc(RAHMEN * RAHMEN * KANAELE);
  const links = Math.floor((RAHMEN - breite) / 2);
  const oben = RAHMEN - hoehe;
  for (let y = 0; y < hoehe; y++) {
    const q = y * breite * KANAELE;
    pixel.copy(aus, ((oben + y) * RAHMEN + links) * KANAELE, q, q + breite * KANAELE);
  }
  return ohneSchatten(aus);
}

/**
 * Schneidet die Leinwand (Standard 32) mittig aus einem Laufbild und setzt sie in einen
 * 32er-Rahmen. Beispiel: 48er-Laufbild, Leinwand 32 → Mitte mit 8 Pixel Rand; 36er-Laufbild,
 * Leinwand 24 → Mitte mit 6 Pixel Rand, dann aufgefüllt wie imRahmen.
 */
export function laufrahmen(bild, leinwand = RAHMEN) {
  const rand = Math.floor((bild.breite - leinwand) / 2);
  const oben = Math.floor((bild.hoehe - leinwand) / 2);
  const mitte = Buffer.alloc(leinwand * leinwand * KANAELE);
  for (let y = 0; y < leinwand; y++) {
    const q = ((y + oben) * bild.breite + rand) * KANAELE;
    bild.pixel.copy(mitte, y * leinwand * KANAELE, q, q + leinwand * KANAELE);
  }
  return imRahmen(mitte, leinwand, leinwand);
}

/**
 * Die Leinwand der Figur aus metadata.json; ohne Angabe die eines Standbilds, sonst 32.
 * Größer als 32 wird nicht angenommen (dann gilt 32 wie bisher).
 */
async function leinwandVon(ordner, ersatz) {
  const pfad = join(ordner, "metadata.json");
  if (!existsSync(pfad)) return Math.min(ersatz ?? RAHMEN, RAHMEN);
  const daten = JSON.parse(await readFile(pfad, "utf8"));
  const zustaende = Array.isArray(daten.states) ? daten.states : [daten];
  const groesse = zustaende.map((z) => z?.character?.size?.width).find((w) => w > 0);
  return Math.min(groesse ?? ersatz ?? RAHMEN, RAHMEN);
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

/** Namen des Laufordners im Export (PixelLab nennt ihn je nach Fassung so oder so). */
const LAUFORDNER = ["Walk", "Walking"];
/** Name des Sitzordners im Export (Doc 24). */
const SITZORDNER = "Sitting";
const SITZREIHE = 2;

/** Die Laufbilder einer Richtung (bis zu sechs), oder null. */
async function laufbilder(ordner, richtung, leinwand) {
  const pfad = LAUFORDNER.map((n) => join(ordner, "animations", n, richtung)).find(existsSync);
  if (!pfad) return null;
  const namen = (await readdir(pfad)).filter((n) => n.endsWith(".png")).sort();
  if (namen.length === 0) return null;
  return Promise.all(
    namen.slice(0, LAUFBILDER).map(async (n) => laufrahmen(await roh(join(pfad, n)), leinwand)),
  );
}

/** Das erste Sitzbild einer Richtung als 32er-Rahmen, oder null. */
async function sitzbild(ordner, richtung, leinwand) {
  const pfad = join(ordner, "animations", SITZORDNER, richtung);
  if (!existsSync(pfad)) return null;
  const erstes = (await readdir(pfad)).filter((n) => n.endsWith(".png")).sort()[0];
  return erstes ? laufrahmen(await roh(join(pfad, erstes)), leinwand) : null;
}

/** Das Standbild einer Richtung als 32er-Rahmen, oder null. */
async function standbild(ordner, richtung, leinwand) {
  const pfad = join(ordner, "rotations", `${richtung}.png`);
  if (!existsSync(pfad)) return null;
  const bild = await roh(pfad);
  if (bild.breite <= RAHMEN && bild.hoehe <= RAHMEN) {
    return imRahmen(bild.pixel, bild.breite, bild.hoehe);
  }
  return laufrahmen(bild, leinwand);
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
  const sued = join(ordner, "rotations", "south.png");
  const leinwand = await leinwandVon(ordner, existsSync(sued) ? (await roh(sued)).breite : null);
  const roheDaten = {};
  for (const { name } of RICHTUNGEN) {
    roheDaten[name] = {
      still: await standbild(ordner, name, leinwand),
      lauf: await laufbilder(ordner, name, leinwand),
      sitz: await sitzbild(ordner, name, leinwand),
    };
  }
  const mitSitz = RICHTUNGEN.some(({ name }) => roheDaten[name].sitz);
  return RICHTUNGEN.map(({ name, spiegel }) => {
    const eigen = roheDaten[name];
    const partner = spiegel ? roheDaten[spiegel] : null;
    const lauf = eigen.lauf ?? partner?.lauf?.map(gespiegelt) ?? null;
    const still =
      eigen.still ?? (partner?.still ? gespiegelt(partner.still) : null) ?? lauf?.[0] ?? null;
    const sitz = mitSitz
      ? (eigen.sitz ?? (partner?.sitz ? gespiegelt(partner.sitz) : null) ?? still)
      : null;
    return { still, lauf: lauf ?? (still ? Array(LAUFBILDER).fill(still) : null), sitz };
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
  const reihen = richtungen.some((r) => r.sitz) ? SITZREIHE + 1 : SITZREIHE;
  const bogen = Buffer.alloc(SPALTEN * RAHMEN * reihen * RAHMEN * KANAELE);
  richtungen.forEach((r, i) => {
    lege(bogen, r.still ?? leer, i, 0);
    (r.lauf ?? []).forEach((rahmen, j) => {
      const nummer = SPALTEN + i * LAUFBILDER + j;
      lege(bogen, rahmen, nummer % SPALTEN, Math.floor(nummer / SPALTEN));
    });
    if (r.sitz) lege(bogen, r.sitz, i, SITZREIHE);
  });
  return sharp(bogen, {
    raw: { width: SPALTEN * RAHMEN, height: reihen * RAHMEN, channels: KANAELE },
  })
    .png()
    .toBuffer();
}
