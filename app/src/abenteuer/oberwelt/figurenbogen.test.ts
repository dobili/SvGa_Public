/**
 * Tests für skripte/figurenbogen.mjs mit einem erzeugten PixelLab-Export für ein jüngeres Kind
 * (Leinwand 24 × 24, Laufbilder 36 × 36; Wunsch des Haupt-Chats, 13.11.2026, Doc 24): Standbilder
 * und Laufbilder landen mittig im 32er-Rahmen, die Füße auf FUSSZEILE (Zeile 30). Dazu ein Kind auf
 * 32er-Leinwand, dessen Füße zu hoch stehen (Prüfung im Spiel, 13.11.2026).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  baueFigurenbogen,
  FUSSZEILE,
  imRahmen,
  RAHMEN,
  untersteZeile,
  verschoben,
} from "../../../skripte/figurenbogen.mjs";

const LEINWAND = 24;
const LAUF = 36;
const SPALTEN = 24;
const LAUFBILDER = 6;
const ROT = [200, 30, 30, 255];
const RICHTUNGEN = ["east", "north", "west", "south"];

/**
 * Ein Bild der Größe `groesse` mit einem roten Fußpixel in der Mitte der Leinwand `leinwand`,
 * `hoeher` Zeilen über ihrer untersten Zeile.
 */
function bild(groesse: number, leinwand = LEINWAND, hoeher = 0): Promise<Buffer> {
  const pixel = Buffer.alloc(groesse * groesse * 4);
  const rand = (groesse - leinwand) / 2;
  const fuss = ((rand + leinwand - 1 - hoeher) * groesse + groesse / 2) * 4;
  pixel.set(ROT, fuss);
  return sharp(pixel, { raw: { width: groesse, height: groesse, channels: 4 } })
    .png()
    .toBuffer();
}

async function export24(leinwand = LEINWAND, hoeher = 0): Promise<string> {
  const ordner = mkdtempSync(join(tmpdir(), "figur24-"));
  mkdirSync(join(ordner, "rotations"));
  const size = { width: leinwand, height: leinwand };
  writeFileSync(
    join(ordner, "metadata.json"),
    JSON.stringify({ states: [{ character: { size } }] }),
  );
  for (const r of RICHTUNGEN) {
    writeFileSync(join(ordner, "rotations", `${r}.png`), await bild(leinwand, leinwand, hoeher));
    const lauf = join(ordner, "animations", "Walking", r);
    mkdirSync(lauf, { recursive: true });
    for (let i = 0; i < LAUFBILDER; i++) {
      writeFileSync(
        join(lauf, `frame_00${i}.png`),
        await bild(LAUF + leinwand - LEINWAND, leinwand, hoeher),
      );
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
    // Standbild „unten“ (Spalte 3): Fuß auf FUSSZEILE, waagrecht in der Mitte.
    expect(pixelBei(data, info.width, 3 * RAHMEN + fussX, FUSSZEILE)).toEqual(ROT);
    // Erstes Laufbild „unten“ (Rahmen 24 + 3 × 6 = 42: Spalte 18, Zeile 1), ebenso.
    expect(pixelBei(data, info.width, 18 * RAHMEN + fussX, RAHMEN + FUSSZEILE)).toEqual(ROT);
  });

  it("setzt ein zu hoch stehendes Kind auf 32er-Leinwand auf die Fußzeile", async () => {
    const png = await baueFigurenbogen(await export24(RAHMEN, 5));
    if (!png) throw new Error("kein Bogen");
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    expect(pixelBei(data, info.width, 3 * RAHMEN + RAHMEN / 2, FUSSZEILE)).toEqual(ROT);
    expect(pixelBei(data, info.width, 18 * RAHMEN + RAHMEN / 2, RAHMEN + FUSSZEILE)).toEqual(ROT);
  });

  it("verschiebt Rahmen senkrecht und findet die unterste Zeile", () => {
    const rahmen = Buffer.alloc(RAHMEN * RAHMEN * 4);
    rahmen.set(ROT, (10 * RAHMEN + 4) * 4);
    expect(untersteZeile(rahmen)).toBe(10);
    expect(untersteZeile(verschoben(rahmen, 3))).toBe(13);
    expect(untersteZeile(verschoben(rahmen, -30))).toBe(-1);
  });

  it("legt Sitzbilder in eine dritte Reihe, fehlende Richtungen aus dem Standbild", async () => {
    const ordner = await export24();
    const sitz = join(ordner, "animations", "Sitting", "south");
    mkdirSync(sitz, { recursive: true });
    writeFileSync(join(sitz, "frame_000.png"), await bild(LAUF));
    const png = await baueFigurenbogen(ordner);
    if (!png) throw new Error("kein Bogen");
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    expect(info.height).toBe(3 * RAHMEN);
    // Sitzbild „unten“: Rahmen 48 + 3, Spalte 3 der dritten Reihe.
    expect(pixelBei(data, info.width, 3 * RAHMEN + RAHMEN / 2, 2 * RAHMEN + FUSSZEILE)).toEqual(
      ROT,
    );
    // „rechts“ ohne Sitzbild: das Standbild, ebenfalls mit Fuß auf FUSSZEILE mittig.
    expect(pixelBei(data, info.width, RAHMEN / 2, 2 * RAHMEN + FUSSZEILE)).toEqual(ROT);
  });

  it("lässt ein 32er-Bild unverändert", () => {
    const pixel = Buffer.alloc(RAHMEN * RAHMEN * 4, 7);
    expect(imRahmen(pixel, RAHMEN, RAHMEN).equals(pixel)).toBe(true);
  });
});
