/**
 * Tests für skripte/figurstandbilder.mjs (Karteneditor 1.9, 23.11.2026): weitere Standbilder einer
 * PixelLab-Figur kommen ab Rahmen 144 in den Bogen, der Standard bleibt in der ersten Reihe, und
 * der Index nennt Anfang und Kennungen. Ohne weitere Standbilder bleibt der Bogen wie bisher.
 */
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { baueFigurenbogenMitStandbildern, RAHMEN } from "../../../skripte/figurenbogen.mjs";

const GROESSE = 32;
const SPALTEN = 24;
const ERSTER_STANDBILDRAHMEN = 144;
const RICHTUNGEN = ["east", "north", "west", "south"];
const ROT = [200, 30, 30, 255];
const BLAU = [30, 30, 200, 255];

/** Ein 32er-Bild mit zwei farbigen Fußpixeln unten mittig (spiegelgleich). */
function bild(farbe: number[]): Promise<Buffer> {
  const pixel = Buffer.alloc(GROESSE * GROESSE * 4);
  pixel.set(farbe, ((GROESSE - 2) * GROESSE + GROESSE / 2) * 4);
  pixel.set(farbe, ((GROESSE - 2) * GROESSE + GROESSE / 2 - 1) * 4);
  return sharp(pixel, { raw: { width: GROESSE, height: GROESSE, channels: 4 } })
    .png()
    .toBuffer();
}

async function rotationen(ordner: string, farbe: number[], richtungen = RICHTUNGEN) {
  mkdirSync(join(ordner, "rotations"), { recursive: true });
  for (const r of richtungen)
    writeFileSync(join(ordner, "rotations", `${r}.png`), await bild(farbe));
}

/** Eine Figur mit rotem Standard und, auf Wunsch, einem blauen weiteren Standbild (nur Süd, Ost). */
async function figur(mitWeiterem: boolean): Promise<string> {
  const ordner = mkdtempSync(join(tmpdir(), "standbild-"));
  await rotationen(ordner, ROT);
  if (mitWeiterem) {
    await rotationen(join(ordner, "standbilder", "ohne-teleskop"), BLAU, ["east", "south"]);
    const liste = [
      { kennung: "idle", name: "Idle", standard: true },
      { kennung: "ohne-teleskop", name: "Without telescope", standard: false },
      { kennung: "fehlt", name: "Kein Ordner", standard: false },
    ];
    writeFileSync(join(ordner, "standbilder.json"), JSON.stringify(liste));
  }
  return ordner;
}

/** Farbe des Fußpixels im Rahmen `nummer` des Bogens. */
async function fussfarbe(png: Buffer, nummer: number): Promise<number[]> {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const x = (nummer % SPALTEN) * RAHMEN + GROESSE / 2;
  const y = Math.floor(nummer / SPALTEN) * RAHMEN + GROESSE - 2;
  const p = (y * info.width + x) * 4;
  return [...data.subarray(p, p + 4)];
}

describe("weitere Standbilder im Figurenbogen", () => {
  it("legt sie ab Rahmen 144 ab, Seitenansicht gespiegelt, oben aus Süd", async () => {
    const bogen = await baueFigurenbogenMitStandbildern(await figur(true));
    expect(bogen?.standbilder).toEqual({
      beginn: ERSTER_STANDBILDRAHMEN,
      kennungen: ["ohne-teleskop"],
    });
    const png = bogen?.bild ?? Buffer.alloc(0);
    const meta = await sharp(png).metadata();
    expect(meta.height).toBe(7 * RAHMEN);
    for (let i = 0; i < RICHTUNGEN.length; i++) {
      expect(await fussfarbe(png, ERSTER_STANDBILDRAHMEN + i)).toEqual(BLAU);
    }
    expect(await fussfarbe(png, 3)).toEqual(ROT);
  });

  it("lässt den Bogen ohne weitere Standbilder wie bisher", async () => {
    const bogen = await baueFigurenbogenMitStandbildern(await figur(false));
    expect(bogen?.standbilder).toBeNull();
    expect((await sharp(bogen?.bild ?? Buffer.alloc(0)).metadata()).height).toBe(2 * RAHMEN);
  });
});
