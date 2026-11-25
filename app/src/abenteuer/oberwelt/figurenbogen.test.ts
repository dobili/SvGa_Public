/**
 * Tests für skripte/figurenbogen.mjs mit einem erzeugten PixelLab-Export für ein jüngeres Kind
 * (Leinwand 24 × 24, Laufbilder 36 × 36; Wunsch des Haupt-Chats, 13.11.2026, Doc 24): Standbilder
 * und Laufbilder landen mittig im 32er-Rahmen, die Füße auf FUSSZEILE (Zeile 30). Dazu ein Kind auf
 * 32er-Leinwand, dessen Füße zu hoch stehen (Prüfung im Spiel, 13.11.2026), und eine Figur auf
 * hoher Leinwand 32 × 48 (Schiffskoch, Auftrag des Haupt-Chats, 25.11.2026).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  baueFigurenbogen,
  baueFigurenbogenMitStandbildern,
  FUSSZEILE,
  fusszeileFuer,
  imRahmen,
  leinwandmasse,
  RAHMEN,
  rahmenhoehe,
  untersteZeile,
  verschoben,
  zeilenVon,
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

/** Ein Bild breite × hoehe mit roten Pixeln von Zeile `oben` bis zur Fußzeile `unten` (Mitte). */
function hochbild(breite: number, hoehe: number, oben: number, unten: number): Promise<Buffer> {
  const pixel = Buffer.alloc(breite * hoehe * 4);
  for (let y = oben; y <= unten; y++) pixel.set(ROT, (y * breite + breite / 2) * 4);
  return sharp(pixel, { raw: { width: breite, height: hoehe, channels: 4 } })
    .png()
    .toBuffer();
}

/** Höhe der hohen Leinwand (Schiffskoch, 25.11.2026) und Rand der Laufbilder je Seite. */
const HOCH = 48;
const LAUFRAND = 8;

describe("Figurenbogen mit hoher Leinwand (32 × 48)", () => {
  it("baut Rahmen von 32 × 48: Füße auf Zeile 46, die Mütze oben bleibt ganz", async () => {
    const ordner = mkdtempSync(join(tmpdir(), "figur48-"));
    const size = { width: RAHMEN, height: HOCH };
    writeFileSync(
      join(ordner, "metadata.json"),
      JSON.stringify({ states: [{ character: { size } }] }),
    );
    mkdirSync(join(ordner, "rotations"));
    for (const r of RICHTUNGEN) {
      // Die Figur reicht von Zeile 1 (Mützenspitze) bis Zeile 44 (Füße, zu hoch exportiert).
      writeFileSync(join(ordner, "rotations", `${r}.png`), await hochbild(RAHMEN, HOCH, 1, 44));
      const lauf = join(ordner, "animations", "Walking", r);
      mkdirSync(lauf, { recursive: true });
      const breit = RAHMEN + 2 * LAUFRAND;
      const hoch = HOCH + 2 * LAUFRAND;
      for (let i = 0; i < LAUFBILDER; i++) {
        const b = await hochbild(breit, hoch, LAUFRAND + 1, LAUFRAND + 44);
        writeFileSync(join(lauf, `frame_00${i}.png`), b);
      }
    }
    const ergebnis = await baueFigurenbogenMitStandbildern(ordner);
    expect(ergebnis?.rahmenhoehe).toBe(HOCH);
    const { data, info } = await sharp(ergebnis?.bild ?? Buffer.alloc(0))
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect([info.width, info.height]).toEqual([SPALTEN * RAHMEN, 2 * HOCH]);
    const mitte = RAHMEN / 2;
    const fuss = HOCH - 2;
    // Standbild Süd (Spalte 3): Füße auf Zeile 46, Mütze zwei Zeilen tiefer auf Zeile 3.
    expect(pixelBei(data, info.width, 3 * RAHMEN + mitte, fuss)).toEqual(ROT);
    expect(pixelBei(data, info.width, 3 * RAHMEN + mitte, fuss + 1)[3]).toBe(0);
    expect(pixelBei(data, info.width, 3 * RAHMEN + mitte, 3)).toEqual(ROT);
    // Erstes Laufbild (Reihe 2 ab Zeile 48) ebenso.
    expect(pixelBei(data, info.width, mitte, HOCH + fuss)).toEqual(ROT);
    expect(pixelBei(data, info.width, mitte, HOCH + 3)).toEqual(ROT);
  });

  it("liest Breite und Höhe der Leinwand; 32er-Figuren bleiben 32 hoch", async () => {
    const ordner = mkdtempSync(join(tmpdir(), "leinwand-"));
    writeFileSync(
      join(ordner, "metadata.json"),
      JSON.stringify({ states: [{ character: { size: { width: 24, height: 24 } } }] }),
    );
    expect(await leinwandmasse(ordner)).toEqual({ breite: 24, hoehe: RAHMEN });
    expect(await rahmenhoehe(ordner)).toBe(RAHMEN);
    expect(zeilenVon(Buffer.alloc(RAHMEN * HOCH * 4))).toBe(HOCH);
    expect(fusszeileFuer(HOCH)).toBe(46);
  });
});
