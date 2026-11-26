/**
 * Tests für skripte/figurdiagonalen.mjs (26.11.2026): Schrägen kommen als drei Reihen hinter alle
 * anderen Reihen, die bisherigen Rahmen bleiben gleich, fehlende Schrägen werden gespiegelt, und
 * ohne Schrägen bleibt der Bogen wie bisher.
 */
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { baueFigurenbogenMitStandbildern, RAHMEN } from "../../../skripte/figurenbogen.mjs";

const GROESSE = 32;
const SPALTEN = 24;
const GERADE = ["east", "north", "west", "south"];
const SCHRAEG = ["north-east", "north-west", "south-west", "south-east"];
const ROT = [200, 30, 30, 255];
const GRUEN = [30, 200, 30, 255];
/** Erster Rahmen der Schrägen: hinter Stand, Gehen, Stuhl, Boden, Liegen, Rennen (6 Reihen). */
const BEGINN = 144;

/** Ein 32er-Bild mit einem farbigen Fußpixel unten, links (nicht spiegelgleich). */
function bild(farbe: number[]): Promise<Buffer> {
  const pixel = Buffer.alloc(GROESSE * GROESSE * 4);
  pixel.set(farbe, ((GROESSE - 2) * GROESSE + 4) * 4);
  return sharp(pixel, { raw: { width: GROESSE, height: GROESSE, channels: 4 } })
    .png()
    .toBuffer();
}

async function lege(ordner: string, teile: string[], farbe: number[]): Promise<void> {
  const pfad = join(ordner, ...teile.slice(0, -1));
  mkdirSync(pfad, { recursive: true });
  writeFileSync(join(pfad, teile.at(-1) ?? "x.png"), await bild(farbe));
}

/** Figur mit Standbildern und Gehen gerade (rot); mit Schrägen grün, ohne Rennen Südwest. */
async function figur(schraeg: boolean): Promise<string> {
  const ordner = mkdtempSync(join(tmpdir(), "schraeg-"));
  for (const r of GERADE) {
    await lege(ordner, ["rotations", `${r}.png`], ROT);
    await lege(ordner, ["animations", "Walking", r, "frame_000.png"], ROT);
    await lege(ordner, ["animations", "Running", r, "frame_000.png"], ROT);
  }
  if (schraeg) {
    for (const r of SCHRAEG) {
      await lege(ordner, ["rotations", `${r}.png`], GRUEN);
      await lege(ordner, ["animations", "Walking", r, "frame_000.png"], GRUEN);
      if (r !== "south-west")
        await lege(ordner, ["animations", "Running", r, "frame_000.png"], GRUEN);
    }
  }
  return ordner;
}

/** Farbe am Pixel (x, 30) im Rahmen `nummer`. */
async function farbe(png: Buffer, nummer: number, x: number): Promise<number[]> {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const px = (nummer % SPALTEN) * RAHMEN + x;
  const py = Math.floor(nummer / SPALTEN) * RAHMEN + GROESSE - 2;
  const p = (py * info.width + px) * 4;
  return [...data.subarray(p, p + 4)];
}

describe("figurdiagonalen", () => {
  it("legt Standbilder, Gehen und Rennen der Schrägen ab Rahmen 144 an", async () => {
    const bogen = await baueFigurenbogenMitStandbildern(await figur(true));
    expect(bogen?.diagonalen).toBe(BEGINN);
    const png = bogen?.bild ?? Buffer.alloc(0);
    const { height } = await sharp(png).metadata();
    expect(height).toBe(9 * RAHMEN);
    expect(await farbe(png, 0, 4)).toEqual(ROT);
    expect(await farbe(png, BEGINN, 4)).toEqual(GRUEN);
    expect(await farbe(png, BEGINN + SPALTEN, 4)).toEqual(GRUEN);
    // Rennen Südwest (dritte Schräge) fehlt: gespiegelt aus Südost, der Pixel liegt rechts.
    const suedwest = BEGINN + 2 * SPALTEN + 2 * 6;
    expect(await farbe(png, suedwest, GROESSE - 1 - 4)).toEqual(GRUEN);
  });

  it("ohne Schrägen: kein Index, Bogen ohne zusätzliche Reihen", async () => {
    const bogen = await baueFigurenbogenMitStandbildern(await figur(false));
    expect(bogen?.diagonalen).toBeNull();
    const { height } = await sharp(bogen?.bild ?? Buffer.alloc(0)).metadata();
    expect(height).toBeLessThan(9 * RAHMEN);
  });
});
