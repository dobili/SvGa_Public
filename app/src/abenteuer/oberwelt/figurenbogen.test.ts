/**
 * Tests für skripte/figurenbogen.mjs mit einem erzeugten PixelLab-Export für ein jüngeres Kind
 * (Leinwand 24 × 24, Laufbilder 36 × 36; Wunsch des Haupt-Chats, 13.11.2026, Doc 24): Standbilder
 * und Laufbilder landen unten bündig und mittig im 32er-Rahmen.
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { baueFigurenbogen, imRahmen, RAHMEN } from "../../../skripte/figurenbogen.mjs";

const LEINWAND = 24;
const LAUF = 36;
const SPALTEN = 24;
const LAUFBILDER = 6;
const ROT = [200, 30, 30, 255];
const RICHTUNGEN = ["east", "north", "west", "south"];

/** Ein Bild der Größe `groesse` mit einem roten Fußpixel unten in der Mitte der Leinwand. */
function bild(groesse: number): Promise<Buffer> {
  const pixel = Buffer.alloc(groesse * groesse * 4);
  const rand = (groesse - LEINWAND) / 2;
  const fuss = ((rand + LEINWAND - 1) * groesse + groesse / 2) * 4;
  pixel.set(ROT, fuss);
  return sharp(pixel, { raw: { width: groesse, height: groesse, channels: 4 } })
    .png()
    .toBuffer();
}

async function export24(): Promise<string> {
  const ordner = mkdtempSync(join(tmpdir(), "figur24-"));
  mkdirSync(join(ordner, "rotations"));
  const size = { width: LEINWAND, height: LEINWAND };
  writeFileSync(
    join(ordner, "metadata.json"),
    JSON.stringify({ states: [{ character: { size } }] }),
  );
  for (const r of RICHTUNGEN) {
    writeFileSync(join(ordner, "rotations", `${r}.png`), await bild(LEINWAND));
    const lauf = join(ordner, "animations", "Walking", r);
    mkdirSync(lauf, { recursive: true });
    for (let i = 0; i < LAUFBILDER; i++) {
      writeFileSync(join(lauf, `frame_00${i}.png`), await bild(LAUF));
    }
  }
  return ordner;
}

/** RGBA eines Pixels im Bogen. */
function pixelBei(roh: Buffer, breite: number, x: number, y: number): number[] {
  const i = (y * breite + x) * 4;
  return [...roh.subarray(i, i + 4)];
}

describe("Figurenbogen mit kleiner Leinwand", () => {
  it("füllt Stand- und Laufbilder unten mittig auf 32 × 32 auf", async () => {
    const png = await baueFigurenbogen(await export24());
    if (!png) throw new Error("kein Bogen");
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    expect([info.width, info.height]).toEqual([SPALTEN * RAHMEN, 2 * RAHMEN]);
    const fussX = RAHMEN / 2;
    // Standbild „unten“ (Spalte 3): Fuß auf der untersten Zeile, waagrecht in der Mitte.
    expect(pixelBei(data, info.width, 3 * RAHMEN + fussX, RAHMEN - 1)).toEqual(ROT);
    // Erstes Laufbild „unten“ (Rahmen 24 + 3 × 6 = 42: Spalte 18, Zeile 1), ebenso.
    expect(pixelBei(data, info.width, 18 * RAHMEN + fussX, 2 * RAHMEN - 1)).toEqual(ROT);
  });

  it("lässt ein 32er-Bild unverändert", () => {
    const pixel = Buffer.alloc(RAHMEN * RAHMEN * 4, 7);
    expect(imRahmen(pixel, RAHMEN, RAHMEN).equals(pixel)).toBe(true);
  });
});
