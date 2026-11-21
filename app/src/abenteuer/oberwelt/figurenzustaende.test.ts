/**
 * Tests für skripte/figurenzustaende.mjs und die Reihen 3 bis 5 des Figurenbogens (Zustände aus
 * PixelLab, Auftrag des Haupt-Chats, 21.11.2026): Ein Export mit nur dem Zustand „schlaf“ ergibt
 * einen Bogen mit fünf Reihen; Stuhl und Boden davor bekommen den Ersatz (Standbild 6 Pixel höher,
 * Standbild), die Liegereihe die Bilder West (Kopf rechts) und Ost (Kopf links). Größer gezeichnete
 * Zustände werden auf die Kopfbreite des Standbilds verkleinert.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { baueFigurenbogen, FUSSZEILE, RAHMEN } from "../../../skripte/figurenbogen.mjs";
import { kopfbreite } from "../../../skripte/figurenzustaende.mjs";

const KANAELE = 4;
const SPALTEN = 24;
const ROT = [200, 30, 30, 255];
const BLAU = [30, 30, 200, 255];
const ERSATZHUB = 6;

/** Ein 32er-Bild mit einem gefüllten Rechteck (x, y, Breite, Höhe) in einer Farbe. */
function rechteck(x: number, y: number, b: number, h: number, farbe = ROT): Promise<Buffer> {
  const pixel = Buffer.alloc(RAHMEN * RAHMEN * KANAELE);
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + b; i++) pixel.set(farbe, (j * RAHMEN + i) * KANAELE);
  return sharp(pixel, { raw: { width: RAHMEN, height: RAHMEN, channels: KANAELE } })
    .png()
    .toBuffer();
}

/** Ein Export: Standbilder (Säule 4 breit bis FUSSZEILE) und der Zustand „schlaf“ (West, Ost, Süd). */
async function exportMitSchlaf(): Promise<string> {
  const ordner = mkdtempSync(join(tmpdir(), "zustand-"));
  mkdirSync(join(ordner, "rotations"));
  for (const r of ["east", "north", "west", "south"])
    writeFileSync(join(ordner, "rotations", `${r}.png`), await rechteck(14, 10, 4, 21));
  const schlaf = join(ordner, "zustaende", "schlaf");
  mkdirSync(join(schlaf, "Sleeping_in_an_invis", "rotations"), { recursive: true });
  writeFileSync(
    join(schlaf, "metadata.json"),
    JSON.stringify({ states: [{ folder: "Sleeping_in_an_invis" }] }),
  );
  const bilder = join(schlaf, "Sleeping_in_an_invis", "rotations");
  // Süd doppelt so breit wie das Standbild: Der Zustand wird auf die Hälfte verkleinert.
  writeFileSync(join(bilder, "south.png"), await rechteck(12, 0, 8, 32));
  writeFileSync(join(bilder, "west.png"), await rechteck(0, 12, 32, 8, BLAU));
  writeFileSync(join(bilder, "east.png"), await rechteck(0, 12, 32, 8, ROT));
  return ordner;
}

/** RGBA eines Pixels im Bogen. */
function pixelBei(roh: Buffer, breite: number, x: number, y: number): number[] {
  const i = (y * breite + x) * KANAELE;
  return [...roh.subarray(i, i + KANAELE)];
}

describe("Zustände im Figurenbogen", () => {
  it("misst die Kopfbreite in den oberen zwei Fünfteln", async () => {
    const { data } = await sharp(await rechteck(10, 2, 6, 28))
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(kopfbreite(data)).toBe(6);
  });

  it("füllt Stuhl und Boden mit dem Ersatz und legt die Liegebilder in Reihe 5", async () => {
    const png = await baueFigurenbogen(await exportMitSchlaf());
    if (!png) throw new Error("kein Bogen");
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    expect([info.width, info.height]).toEqual([SPALTEN * RAHMEN, 5 * RAHMEN]);
    const mitte = RAHMEN / 2;
    // Reihe 3, Stuhl: Standbild 6 Pixel höher; Reihe 4, Boden: das Standbild.
    expect(pixelBei(data, info.width, mitte, 2 * RAHMEN + FUSSZEILE - ERSATZHUB)).toEqual(ROT);
    expect(pixelBei(data, info.width, mitte, 2 * RAHMEN + FUSSZEILE)[3]).toBe(0);
    expect(pixelBei(data, info.width, mitte, 3 * RAHMEN + FUSSZEILE)).toEqual(ROT);
    // Reihe 5: Kopf rechts (West, blau) in Spalte 0, Kopf links (Ost, rot) in Spalte 1, halbiert
    // (32 breit → 16), senkrecht mittig.
    expect(pixelBei(data, info.width, mitte, 4 * RAHMEN + mitte)).toEqual(BLAU);
    expect(pixelBei(data, info.width, 2, 4 * RAHMEN + mitte)[3]).toBe(0);
    expect(pixelBei(data, info.width, RAHMEN + mitte, 4 * RAHMEN + mitte)).toEqual(ROT);
  });

  it("legt das Rennen in Reihe 6 und füllt das fehlende Liegen mit dem gedrehten Standbild", async () => {
    const ordner = await exportMitSchlaf();
    rmSync(join(ordner, "zustaende"), { recursive: true });
    for (const r of ["east", "north", "west", "south"]) {
      const pfad = join(ordner, "animations", "Running", r);
      mkdirSync(pfad, { recursive: true });
      writeFileSync(join(pfad, "frame_000.png"), await rechteck(2, 10, 4, 21, BLAU));
    }
    const png = await baueFigurenbogen(ordner);
    if (!png) throw new Error("kein Bogen");
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    expect(info.height).toBe(6 * RAHMEN);
    // Rennen „rechts“, erstes Bild: Spalte 0 der sechsten Reihe, blau links im Rahmen.
    expect(pixelBei(data, info.width, 3, 5 * RAHMEN + FUSSZEILE)).toEqual(BLAU);
    // Liegen ohne Zustand: Standbild Süd im Uhrzeigersinn gedreht, also waagrecht.
    expect(pixelBei(data, info.width, 10, 4 * RAHMEN + 15)).toEqual(ROT);
  });
});
