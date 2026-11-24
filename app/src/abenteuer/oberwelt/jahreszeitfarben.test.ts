/**
 * Tests für jahreszeitfarben.ts, kahlbaum.ts und dachschnee (winter.ts): Winter ohne Schnee im Süden
 * und Schnee auf Dächern (RO53.5). Die Prüfsummen stehen gleich in
 * pipeline/tests/test_abenteuer_winter.py: App und Pipeline färben Pixel für Pixel gleich.
 */
import { describe, expect, it } from "vitest";
import { fahlfarbe, faerbeDaten, jahreszeitDer, sorte } from "./jahreszeitfarben";
import { kahl } from "./kahlbaum";
import { dachschnee } from "./winter";

const BREITE = 24;
const HOEHE = 32;

/** Runde Krone (Radius 10) über braunem Stamm, darunter ein halbdurchsichtiger Schatten. */
function probebaum(farbe: readonly [number, number, number] = [70, 150, 60]): Uint8ClampedArray {
  const pixel: number[] = [];
  for (let y = 0; y < HOEHE; y++) {
    for (let x = 0; x < BREITE; x++) {
      if ((x - 12) ** 2 + (y - 11) ** 2 <= 100) {
        pixel.push(...((x + y) % 5 ? [...farbe, 255] : [30, 60, 40, 255]));
      } else if (x >= 10 && x <= 13 && y < 30) pixel.push(110, 75, 45, 255);
      else if (y >= 29 && x >= 6 && x <= 18) pixel.push(60, 110, 60, 160);
      else pixel.push(0, 0, 0, 0);
    }
  }
  return new Uint8ClampedArray(pixel);
}

/** Dieselbe Prüfsumme wie _pruefsumme in test_abenteuer_winter.py. */
function pruefsumme(d: Uint8ClampedArray): number {
  let summe = 0;
  for (let i = 0; i < d.length / 4; i++) {
    const wert =
      (d[i * 4] ?? 0) * 3 +
      (d[i * 4 + 1] ?? 0) * 5 +
      (d[i * 4 + 2] ?? 0) * 7 +
      (d[i * 4 + 3] ?? 0) * 11;
    summe = (summe + (i + 1) * wert) % 1_000_000_007;
  }
  return summe;
}

describe("Winter ohne Schnee", () => {
  it("Gras wird fahl, Erde bleibt", () => {
    expect(fahlfarbe(106, 170, 72)).toEqual([124, 135, 80]);
    expect(fahlfarbe(150, 110, 70)).toEqual([150, 110, 70]);
  });

  it("kahler Baum Pixel für Pixel wie die Pipeline", () => {
    const baum = probebaum();
    kahl(baum, BREITE, HOEHE);
    expect(pruefsumme(baum)).toBe(225325905);
    const herbst = probebaum([200, 90, 40]);
    kahl(herbst, BREITE, HOEHE);
    expect(pruefsumme(herbst)).toBe(227397915);
  });

  it("Laubbäume werden kahl, Nadelbäume bleiben", () => {
    const nadel = probebaum();
    faerbeDaten("nadelbaum", "winter_mild", nadel, BREITE, HOEHE);
    expect([...nadel]).toEqual([...probebaum()]);
    const laub = probebaum();
    faerbeDaten("laubbaum", "winter_mild", laub, BREITE, HOEHE);
    expect([...laub]).not.toEqual([...probebaum()]);
  });
});

describe("Schnee auf Dächern", () => {
  it("rechnet wie die Pipeline", () => {
    const haus = probebaum([180, 60, 50]);
    dachschnee(haus, BREITE, HOEHE);
    expect(pruefsumme(haus)).toBe(608170085);
  });
});

describe("Sorte und Jahreszeit", () => {
  it("ordnet Möbel nach Art und Name", () => {
    expect(sorte("pw7Tanne", "baum")).toBe("nadelbaum");
    expect(sorte("wg4Laubbaum", "baum")).toBe("laubbaum");
    expect(sorte("cc4Hecke", undefined)).toBe("busch");
    expect(sorte("ws5Schilf", "pflanze")).toBe("pflanze");
    expect(sorte("sa8Baeckerei", "gebaeude")).toBe("haus");
  });

  it("liest die Eigenschaft jahreszeit", () => {
    expect(jahreszeitDer({ properties: [{ name: "jahreszeit", value: "winter" }] })).toBe("winter");
    expect(jahreszeitDer({ properties: [{ name: "jahreszeit", value: "winter_mild" }] })).toBe(
      "winter_mild",
    );
    expect(jahreszeitDer({ properties: [{ name: "toenung", value: "nebel" }] })).toBeNull();
    expect(jahreszeitDer({})).toBeNull();
  });
});
