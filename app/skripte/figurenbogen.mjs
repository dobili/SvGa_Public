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
 * - Füße auf Zeile 30 (FUSSZEILE): PixelLab stellt kleine Figuren (Kinder auf 32er-Leinwand) oft
 *   höher, sodass sie schwebten (Prüfung im Spiel, 13.11.2026). Jede Figur wird so senkrecht
 *   verschoben, dass die tiefste Zeile ihrer Standbilder auf FUSSZEILE liegt; alle Rahmen der Figur
 *   gleich, damit das Auf und Ab beim Laufen bleibt.
 * - Fehlt eine Laufrichtung, wird links aus rechts gespiegelt (und umgekehrt); sonst bleibt das
 *   Standbild stehen. Fehlt ein Standbild, gilt das erste Laufbild oder das Spiegelbild.
 * - Sitzbilder (Wunsch des Autors R020, Doc 24): Hat der Export `animations/Sitting/<richtung>/`,
 *   bekommt der Bogen eine dritte Reihe mit vier Sitzbildern ab Rahmen 48 (erstes Bild je
 *   Richtung, Ordnung wie die Standbilder; fehlende gespiegelt oder das Standbild). Die App
 *   erkennt die Reihe an der Bogenhöhe (oberwelt/sitzrichtung.ts).
 * - Zustände aus PixelLab („New State“, skripte/figurenzustaende.mjs, 21.11.2026): Sitzen auf dem
 *   Stuhl ersetzt die dritte Reihe (Rahmen 48 bis 51), Sitzen am Boden ist die vierte (72 bis 75),
 *   Liegen die fünfte (96 Kopf rechts, 97 Kopf links). Der Bogen reicht bis zur letzten vorhandenen
 *   Reihe; eine Lücke davor füllt der heutige Ersatz: Stuhl = Standbild ERSATZHUB Pixel höher,
 *   Boden = Standbild, Liegen = Standbild gedreht. Ohne Liegereihe kippt die App das Standbild
 *   (fuehrungsschicht.ts).
 * - Rennen (Animation „Running“, `animations/Running/<richtung>/`, 21.11.2026): sechste Reihe ab
 *   Rahmen 120, sechs Bilder je Richtung wie die Gehreihe. Ohne sie rennt die App mit den
 *   Gehbildern bei höherer Bildrate (figurbilder.ts, rennname).
 * - Weitere Standbilder (Karteneditor 1.9, 23.11.2026): ab Rahmen 144 je vier Rahmen,
 *   Anfang und Ordnung im Index figuren32/standbilder.json (figurstandbilder.mjs).
 * Abhängigkeiten: sharp, figurenzustaende.mjs, figurstandbilder.mjs.
 */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ZUSTAENDE, zustandsrahmen } from "./figurenzustaende.mjs";
import { weitereStandbilder } from "./figurstandbilder.mjs";

export const RAHMEN = 32;
const SPALTEN = 24;
const LAUFBILDER = 6;
const KANAELE = 4;
/** Schattenfarbe des Exports und ab welcher Zeile (im 32er-Rahmen) sie als Schatten gilt. */
const SCHATTEN = [0x4f, 0x4f, 0x4e];
const SCHATTEN_AB_ZEILE = 24;
/** Zeile, auf der die Füße der Standbilder stehen (wie bei LimeZu und kartenbild.py). */
export const FUSSZEILE = 30;

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

/** Die unterste Zeile mit einem deckenden Pixel, oder -1 bei einem leeren Rahmen. */
export function untersteZeile(rahmen) {
  for (let y = RAHMEN - 1; y >= 0; y--) {
    for (let x = 0; x < RAHMEN; x++) {
      if (rahmen[(y * RAHMEN + x) * KANAELE + KANAELE - 1] > 0) return y;
    }
  }
  return -1;
}

/** Verschiebt einen 32er-Rahmen um dy Zeilen (positiv nach unten); was hinausfällt, entfällt. */
export function verschoben(rahmen, dy) {
  if (dy === 0) return rahmen;
  const aus = Buffer.alloc(rahmen.length);
  const zeile = RAHMEN * KANAELE;
  for (let y = 0; y < RAHMEN; y++) {
    const ziel = y + dy;
    if (ziel >= 0 && ziel < RAHMEN) rahmen.copy(aus, ziel * zeile, y * zeile, (y + 1) * zeile);
  }
  return aus;
}

/**
 * Setzt alle Rahmen einer Figur so, dass die Füße der Standbilder auf FUSSZEILE stehen.
 * Beispiel: Kind mit Füßen auf Zeile 26 → alle Rahmen 4 Zeilen tiefer.
 */
export function aufFusszeile(richtungen) {
  const fuesse = richtungen.map((r) => (r.still ? untersteZeile(r.still) : -1));
  const tiefste = Math.max(...fuesse);
  if (tiefste < 0) return richtungen;
  const dy = FUSSZEILE - tiefste;
  const schiebe = (rahmen) => (rahmen ? verschoben(rahmen, dy) : rahmen);
  return richtungen.map((r) => ({
    still: schiebe(r.still),
    lauf: r.lauf ? r.lauf.map(schiebe) : r.lauf,
    sitz: schiebe(r.sitz),
    renn: r.renn ? r.renn.map(schiebe) : r.renn,
  }));
}

/**
 * Dreht einen 32er-Rahmen um eine Vierteldrehung, im Uhrzeigersinn (Kopf nach rechts) oder
 * dagegen (Kopf nach links): Ersatz für ein fehlendes Liegebild vor einer Rennreihe.
 */
export function gedreht(rahmen, imUhrzeigersinn) {
  const aus = Buffer.alloc(rahmen.length);
  for (let y = 0; y < RAHMEN; y++) {
    for (let x = 0; x < RAHMEN; x++) {
      const zx = imUhrzeigersinn ? RAHMEN - 1 - y : y;
      const zy = imUhrzeigersinn ? x : RAHMEN - 1 - x;
      rahmen.copy(
        aus,
        (zy * RAHMEN + zx) * KANAELE,
        (y * RAHMEN + x) * KANAELE,
        (y * RAHMEN + x + 1) * KANAELE,
      );
    }
  }
  return aus;
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
/** Namen des Rennordners im Export (Animation „Running“, Auftrag des Haupt-Chats, 21.11.2026). */
const RENNORDNER = ["Running", "Run"];
/** Name des Sitzordners im Export (Doc 24). */
const SITZORDNER = "Sitting";
const SITZREIHE = 2;
/** Ersatz für ein fehlendes Stuhlbild vor einer vorhandenen späteren Reihe (wie SITZ_HUB der App). */
const ERSATZHUB = 6;
/** Index der Richtung Süd in RICHTUNGEN (Standbild für Maßstab und Ersatz). */
const SUED = 3;

/** Die Lauf- oder Rennbilder einer Richtung (bis zu sechs, Ordner nach `ordnernamen`), oder null. */
async function laufbilder(ordner, richtung, leinwand, ordnernamen = LAUFORDNER) {
  const pfad = ordnernamen.map((n) => join(ordner, "animations", n, richtung)).find(existsSync);
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

/**
 * Das Standbild einer Richtung als 32er-Rahmen aus `<ordner>/rotations/<richtung>.png`, oder null
 * (auch für weitere Standbilder, figurstandbilder.mjs).
 */
export async function standbildAus(ordner, richtung, leinwand = RAHMEN) {
  return standbild(ordner, richtung, leinwand);
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
      renn: await laufbilder(ordner, name, leinwand, RENNORDNER),
    };
  }
  const mitSitz = RICHTUNGEN.some(({ name }) => roheDaten[name].sitz);
  const mitRennen = RICHTUNGEN.some(({ name }) => roheDaten[name].renn);
  return RICHTUNGEN.map(({ name, spiegel }) => {
    const eigen = roheDaten[name];
    const partner = spiegel ? roheDaten[spiegel] : null;
    const lauf = eigen.lauf ?? partner?.lauf?.map(gespiegelt) ?? null;
    const still =
      eigen.still ?? (partner?.still ? gespiegelt(partner.still) : null) ?? lauf?.[0] ?? null;
    const sitz = mitSitz
      ? (eigen.sitz ?? (partner?.sitz ? gespiegelt(partner.sitz) : null) ?? still)
      : null;
    const gehen = lauf ?? (still ? Array(LAUFBILDER).fill(still) : null);
    // Fehlt eine Rennrichtung, rennt die Figur dort mit den Laufbildern (wie die App ohne Reihe).
    const renn = mitRennen ? (eigen.renn ?? partner?.renn?.map(gespiegelt) ?? gehen) : null;
    return { still, lauf: gehen, sitz, renn };
  });
}

/**
 * Die Reihen 3 bis 6 (Stuhl, Boden, Liegen, Rennen): Rahmen oder null. Der Stuhl kommt aus dem
 * Zustand, sonst aus der Sitting-Animation (sammle). Lücken vor einer späteren Reihe füllt der
 * Ersatz aus dem Dateikopf; nach der letzten vorhandenen Reihe endet der Bogen.
 */
async function zustandsreihen(ordner, richtungen, alleReihen = false) {
  const reihen = [];
  for (const zustand of ZUSTAENDE) {
    reihen.push(await zustandsrahmen(ordner, zustand, richtungen[SUED]?.still, gespiegelt));
  }
  if (!reihen[0] && richtungen.some((r) => r.sitz)) reihen[0] = richtungen.map((r) => r.sitz);
  if (richtungen.some((r) => r.renn)) reihen.push(richtungen.flatMap((r) => r.renn ?? []));
  // Mit weiteren Standbildern (ab Rahmen 144) braucht der Bogen alle Reihen davor; ohne Rennen
  // rennt die Figur dort mit den Gehbildern, wie die App ohne Rennreihe.
  if (alleReihen && reihen.length < ZUSTAENDE.length + 1) {
    reihen.push(richtungen.flatMap((r) => r.lauf ?? []));
  }
  const letzte = reihen.findLastIndex((r) => r);
  const still = (i) => richtungen[i]?.still ?? null;
  const sued = still(SUED);
  const ersatz = [
    richtungen.map((_, i) => (still(i) ? verschoben(still(i), -ERSATZHUB) : null)),
    richtungen.map((_, i) => still(i)),
    sued ? [gedreht(sued, true), gedreht(sued, false)] : [],
  ];
  return reihen.slice(0, letzte + 1).map((r, i) => r ?? ersatz[i]);
}

/**
 * Baut den Bogen einer Figur (PNG) aus ihrem PixelLab-Ordner; null, wenn kein Bild da ist.
 * Beispiel: figuren-neu/juno → 768 × 64 Pixel, Rahmen 32 × 32.
 */
export async function baueFigurenbogen(ordner) {
  return (await baueFigurenbogenMitStandbildern(ordner))?.bild ?? null;
}

/**
 * Wie baueFigurenbogen, dazu die weiteren Standbilder (figurstandbilder.mjs) ab Rahmen 144 (Reihe 7;
 * fehlende Reihen davor füllt der Ersatz, damit die App Sitz-, Liege- und Rennreihe an der Zahl
 * der Rahmen erkennt): { bild, standbilder: { beginn, kennungen } | null }; null ohne Bild.
 * Beispiel: abe mit einem weiteren Standbild → beginn 144, kennungen [„without-telescope“].
 */
export async function baueFigurenbogenMitStandbildern(ordner) {
  const richtungen = aufFusszeile(await sammle(ordner));
  if (richtungen.every((r) => !r.still)) return null;
  const leer = Buffer.alloc(RAHMEN * RAHMEN * KANAELE);
  const weitere = await weitereStandbilder(ordner);
  const zusatz = await zustandsreihen(ordner, richtungen, weitere.kennungen.length > 0);
  const beginnReihe = SITZREIHE + zusatz.length;
  const standbildrahmen = weitere.rahmen.flat();
  const reihen = beginnReihe + Math.ceil(standbildrahmen.length / SPALTEN);
  const bogen = Buffer.alloc(SPALTEN * RAHMEN * reihen * RAHMEN * KANAELE);
  richtungen.forEach((r, i) => {
    lege(bogen, r.still ?? leer, i, 0);
    (r.lauf ?? []).forEach((rahmen, j) => {
      const nummer = SPALTEN + i * LAUFBILDER + j;
      lege(bogen, rahmen, nummer % SPALTEN, Math.floor(nummer / SPALTEN));
    });
  });
  zusatz.forEach((reihe, z) =>
    reihe.forEach((rahmen, i) => lege(bogen, rahmen ?? leer, i, SITZREIHE + z)),
  );
  standbildrahmen.forEach((rahmen, i) =>
    lege(bogen, rahmen, i % SPALTEN, beginnReihe + Math.floor(i / SPALTEN)),
  );
  const bild = await sharp(bogen, {
    raw: { width: SPALTEN * RAHMEN, height: reihen * RAHMEN, channels: KANAELE },
  })
    .png()
    .toBuffer();
  const standbilder = weitere.kennungen.length
    ? { beginn: beginnReihe * SPALTEN, kennungen: weitere.kennungen }
    : null;
  return { bild, standbilder };
}
