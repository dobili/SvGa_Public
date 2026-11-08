/**
 * Tests des QR-Erzeugers: Bausteine gegen Werte der Norm (ISO/IEC 18004) und ganze Modulmatrizen
 * gegen zwei unabhängige, verbreitete Erzeuger: python-qrcode 8.2 und qrcodegen 1.8.0 (Nayuki),
 * Stufe M, Byte-Modus, ohne Anhebung der Stufe; Matrizen und SHA-256 der Zeilen „#“/„.“ am
 * 8.11.2026 erzeugt. Beide stimmen bei allen acht Masken Modul für Modul überein; die selbst
 * gewählte Maske folgt den Strafpunkten wie qrcodegen. Stimmt jedes Modul überein, liest jeder
 * Scanner, was die Referenz liest. (segno 1.6.6 taugt nicht als Referenz: Es hängt nach dem
 * Abschluss ein überzähliges Nullbyte an, gültig, aber nicht die kanonische Form.)
 */
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { generatorpolynom, gfMal, korrekturbytes } from "./galoisfeld";
import { datenbytes, erzeugeQrCode, type QrCode } from "./qrcode";
import {
  ausrichtungspositionen,
  formatbits,
  freieModule,
  versionsangaben,
  versionsbits,
} from "./qrtabellen";

const INSTALLATIONSSEITE = "https://schach-von-grund-auf.com/installieren/";

/** Referenz „HELLO WORLD“: Version 1, Maske 4. */
const HELLO_WORLD = [
  "#######.##..#.#######",
  "#.....#....#..#.....#",
  "#.###.#..#.#..#.###.#",
  "#.###.#.#..#..#.###.#",
  "#.###.#.###.#.#.###.#",
  "#.....#.#..#..#.....#",
  "#######.#.#.#.#######",
  "........#..##........",
  "#...#.######.#####..#",
  "...#....#.###....####",
  "..######..##.##.#..#.",
  "#####...##...#.......",
  "#####.#.#.#.#.##..##.",
  "........#.#.####.#.##",
  "#######.###.#.#.##.#.",
  "#.....#..#.###.##..##",
  "#.###.#.##.#.##...##.",
  "#.###.#..#..#...##.##",
  "#.###.#..###...###...",
  "#.....#....#.#.......",
  "#######.#########.#.#",
];

/** Referenz der Installationsseite: Version 4, Maske 2. */
const INSTALLATION = [
  "#######..#...#..##.##..#..#######",
  "#.....#..##..###.#....#...#.....#",
  "#.###.#.##.#.#..####.#.##.#.###.#",
  "#.###.#.##.#..#.#...#...#.#.###.#",
  "#.###.#.##..#..#..#....#..#.###.#",
  "#.....#.#..#.#.##...##....#.....#",
  "#######.#.#.#.#.#.#.#.#.#.#######",
  "........##....##.....#...........",
  "#.#####..#.#####.#..#...#.#####..",
  ".###.#.##.........###..#..##.##.#",
  ".#.#..#..#.#...#..#.#.#..##.#.##.",
  ".......####.#.#.#..####.#...#####",
  "###.#.####.#...#..#..#..##.###.##",
  "#....#...#.#.#####..#..#..#....##",
  "..##.##..####.#..#.#.##.###..###.",
  "....#....###..#.#.##########.##..",
  "#..#..#.#.#..#...#.#..#.##.##...#",
  "#.##....##..#...#####.##.###.##.#",
  ".##..###.#....####..#.#.#####.#..",
  ".###.#.##.#.#######.#...#..#####.",
  ".##...#.##.#.#.##..#####.#.###.##",
  "###..#..##.#.#.#..#..#.#..#..#..#",
  "#..##.##...#.#.##...#.#....#...#.",
  "#..###..##..####..#..#...##..##.#",
  "#.#####.#......####...#.######.##",
  "........##..##..#.##.#..#...#.#.#",
  "#######..##.#.###.#..#.##.#.#.##.",
  "#.....#.###..#.#...######...#####",
  "#.###.#.#.#..#.#..##.#..######.##",
  "#.###.#.#.##.#####..#.##.#..#.#.#",
  "#.###.#.#.#.##.....#..#.#.##.#...",
  "#.....#..#..##..#..####...#.###..",
  "#######.##.###...#.#..####.#.#.#.",
];

/** SHA-256 der Referenzmatrix der Installationsseite mit fester Maske 0 bis 7. */
const MASKENHASHES = [
  "6c1177b6a4d0b279d1419189cec0d76db7fdbaacf78e24a73ad808efae726e6d",
  "0f07b156c504d94ffeef35f087434cbaa30cd61b9e2c97688a9ebd22d92160b6",
  "0dd810e1ae6f7aa276270a778594b10895a6f5ae555a93aa12a58072c6abe8b1",
  "a0679d22719e84b88c25e740d248f807c1b5c323ca161ed3a2e11ee7b0c0568e",
  "8d6f6a4961d04e7865580d22fcaeb64d3eb9f1230970be73d220f181d6ebc8e8",
  "47c476fc4ef6a142b48b6b83471cf5c06c3900a1577211325b1128d240cf751f",
  "7b37aee08af8c55ac42aaf0b16266b82c7b70a6b5c3978d057d59a4217141980",
  "63fb738e0decc563c8b44916536379b83301f5eea1818b183717fdd124e00355",
];

/** Ein langer Text, der Version 9 mit Versionsinformation braucht (Referenz: Maske 2). */
const LANG =
  "https://schach-von-grund-auf.com/installieren/?lang=en&von=freunden-die-schach-lernen-" +
  "wollen-123456789-abcdefghij-klmnop-qrstuvwxyz-0123456789-abcdefghijklmnopqrstuvwxyz-2026";
const LANG_HASH = "2b4aa36fe333977453dca0efec4895234b7a1f8248c15952a99d90ec0aa4b908";

function zeilen(code: QrCode): string[] {
  return code.module.map((zeile) => zeile.map((an) => (an ? "#" : ".")).join(""));
}

function hash(code: QrCode): string {
  return createHash("sha256").update(zeilen(code).join("\n")).digest("hex");
}

describe("Bausteine des QR-Codes", () => {
  it("rechnet im Galoisfeld GF(256)", () => {
    expect(gfMal(2, 128)).toBe(0x1d);
    expect(gfMal(0, 77)).toBe(0);
    expect(gfMal(1, 77)).toBe(77);
  });

  it("bildet Generatorpolynom und Korrekturbytes wie die Norm (Anhang I, Version 1-M)", () => {
    expect(generatorpolynom(2)).toEqual([3, 2]);
    // Beispiel der Norm: „01234567“ in 1-M, 16 Datenbytes → 10 Korrekturbytes.
    const daten = [16, 32, 12, 86, 97, 128, 236, 17, 236, 17, 236, 17, 236, 17, 236, 17];
    expect(korrekturbytes(daten, generatorpolynom(10))).toEqual([
      165, 36, 212, 193, 237, 54, 199, 135, 44, 85,
    ]);
  });

  it("kennt Größe, Blöcke und freie Module je Version", () => {
    expect(freieModule(1)).toBe(208);
    expect(versionsangaben(1)).toMatchObject({ groesse: 21, bytes: 26, datenbytes: 16 });
    expect(versionsangaben(4)).toMatchObject({
      groesse: 33,
      bytes: 100,
      bloecke: 2,
      datenbytes: 64,
    });
    expect(versionsangaben(10)).toMatchObject({ groesse: 57, bytes: 346, datenbytes: 216 });
  });

  it("legt die Ausrichtungsmuster wie Anhang E", () => {
    expect(ausrichtungspositionen(1)).toEqual([]);
    expect(ausrichtungspositionen(2)).toEqual([6, 18]);
    expect(ausrichtungspositionen(7)).toEqual([6, 22, 38]);
    expect(ausrichtungspositionen(10)).toEqual([6, 28, 50]);
  });

  it("bildet Format- und Versionsbits wie Anhang C und D", () => {
    expect(formatbits(0)).toBe(0b101010000010010);
    expect(formatbits(5)).toBe(0b100000011001110);
    expect(formatbits(7)).toBe(0b100101010100000);
    expect(versionsbits(7)).toBe(0x07c94);
    expect(versionsbits(10)).toBe(0x0a4d3);
  });

  it("füllt die Datenbytes mit Modus, Länge, Abschluss und 0xEC/0x11", () => {
    const bytes = datenbytes([...new TextEncoder().encode("HELLO WORLD")], versionsangaben(1));
    expect(bytes).toHaveLength(16);
    expect(bytes.slice(0, 2)).toEqual([0x40, 0xb4]);
    expect(bytes.slice(-3)).toEqual([0xec, 0x11, 0xec]);
  });
});

describe("Ganze QR-Codes gegen die Referenz", () => {
  it("„HELLO WORLD“: jedes Modul wie die Referenz, Maske 4", () => {
    const code = erzeugeQrCode("HELLO WORLD");
    expect([code.version, code.maske]).toEqual([1, 4]);
    expect(zeilen(code)).toEqual(HELLO_WORLD);
  });

  it("Installationsseite: Version 4, beste Maske 2, jedes Modul wie die Referenz", () => {
    const code = erzeugeQrCode(INSTALLATIONSSEITE);
    expect([code.groesse, code.version, code.maske]).toEqual([33, 4, 2]);
    expect(zeilen(code)).toEqual(INSTALLATION);
  });

  it("jede der acht Masken einzeln wie die Referenz", () => {
    const hashes = MASKENHASHES.map((_, maske) => hash(erzeugeQrCode(INSTALLATIONSSEITE, maske)));
    expect(hashes).toEqual(MASKENHASHES);
  });

  it("langer Text: Version 9 mit Versionsinformation wie die Referenz", () => {
    const code = erzeugeQrCode(LANG);
    expect([code.version, code.maske]).toEqual([9, 2]);
    expect(hash(code)).toBe(LANG_HASH);
  });

  it("Umlaute als UTF-8, zu lange Texte werfen", () => {
    expect(erzeugeQrCode("Läufer").version).toBe(1);
    expect(() => erzeugeQrCode("x".repeat(214))).toThrow(/zu lang/);
    expect(erzeugeQrCode("x".repeat(213)).version).toBe(10);
  });
});
