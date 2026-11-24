/**
 * Jahreszeiten der Karten (RO53.5, Kartenblick 24.11.2026): Möbel werden beim Laden umgefärbt.
 *
 * Warum: Die gekauften Bilder zeigen Sommer. Karten mit der Eigenschaft `jahreszeit` zeigen Winter:
 * - `winter` (Norden und Berge): Schneekappen auf Bäumen und Büschen, Schnee auf Dächern (winter.ts).
 * - `winter_mild` (Süden): Laubbäume kahl (kahlbaum.ts), Büsche und Hecken gedämpft, Schilf und
 *   Strandgras fahl; Nadelbäume und Häuser bleiben.
 * Den Hintergrund (Gras) färbt die Pipeline (pipeline/abenteuer/winter.py); dort steht dieselbe Regel
 * für die Möbel (faerbe, sorte, fahlfarbe). Änderungen gehören in beide.
 *
 * Rolle im Gesamtbild: Die Szene (szene.ts) ruft `faerbeJahreszeitlich` vor dem Aufstellen der
 * Möbel; die Jahreszeit kommt aus der Karteneigenschaft `jahreszeit` (kartenbau schreibt sie).
 */
import type Phaser from "phaser";
import { kahl } from "./kahlbaum";
import { dachschnee, faerbeMoebelDaten, hls, laub, winterlaub } from "./winter";

/** Die Jahreszeiten einer Karte (ohne Eigenschaft: wie die Bilder der Pakete). */
export type Jahreszeit = "winter" | "winter_mild";

/** Wie ein Möbel umgefärbt wird. */
export type Sorte = "laubbaum" | "nadelbaum" | "busch" | "pflanze" | "haus" | "sonst";

const KANAELE = 4;
const GRUEN = [0.17, 0.45] as const;
const GRUEN_SAETTIGUNG = 0.15;
const FAHL_ANTEIL = 0.7;
const FAHL_STROH = [
  [1.08, 6],
  [1.0, 4],
  [0.72, 0],
] as const;
const HECKE = /hecke|busch/i;
const NADEL = /nadel|kiefer|tanne|zeder|zypresse|pinie|kegelbaum|mammut/i;

/**
 * Winter ohne Schnee: Grün wird fahl (zum Grau mit einem Stich Stroh), alles andere bleibt.
 * Beispiel: Gras (106, 170, 72) → (124, 135, 80).
 */
export function fahlfarbe(r: number, g: number, b: number): readonly [number, number, number] {
  const [h, , s] = hls(r, g, b);
  if (!(h > GRUEN[0] && h < GRUEN[1] && s > GRUEN_SAETTIGUNG)) return [r, g, b];
  const grau = (r + g + b) / 3;
  const misch = (c: number, k: 0 | 1 | 2) => {
    const [f, d] = FAHL_STROH[k];
    return Math.round(c * (1 - FAHL_ANTEIL) + (grau * f + d) * FAHL_ANTEIL);
  };
  return [misch(r, 0), misch(g, 1), misch(b, 2)];
}

/** Die Sorte nach Katalogart und Name. Beispiel: („pw7Tanne“, baum) → nadelbaum. */
export function sorte(name: string, art: string | undefined): Sorte {
  if (art === "baum") return NADEL.test(name) ? "nadelbaum" : "laubbaum";
  if (art === "busch" || art === "hecke" || HECKE.test(name)) return "busch";
  if (art === "pflanze") return "pflanze";
  return art === "gebaeude" || art === "haus" ? "haus" : "sonst";
}

/** Jedes deckende Pixel durch `neu` ersetzen (r, g, b → r, g, b). */
function jedesPixel(
  d: Uint8ClampedArray,
  neu: (r: number, g: number, b: number) => readonly [number, number, number] | null,
): void {
  for (let i = 0; i < d.length; i += KANAELE) {
    if ((d[i + 3] ?? 0) === 0) continue;
    const f = neu(d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0);
    if (f) [d[i], d[i + 1], d[i + 2]] = f;
  }
}

/**
 * Ein Möbelbild (RGBA, an Ort und Stelle) für die Jahreszeit nach seiner Sorte; wie `faerbe` in
 * winter.py. Beispiel: Laubbaum im Winter ohne Schnee → kahl, sein Schatten am Boden fahl.
 */
export function faerbeDaten(
  sorte_: Sorte,
  zeit: Jahreszeit,
  d: Uint8ClampedArray,
  breite: number,
  hoehe: number,
): void {
  if (zeit === "winter") {
    if (sorte_ === "haus") dachschnee(d, breite, hoehe);
    else faerbeMoebelDaten(d, breite, hoehe);
    return;
  }
  if (sorte_ === "laubbaum") {
    kahl(d, breite, hoehe);
    jedesPixel(d, fahlfarbe);
  } else if (sorte_ === "pflanze") {
    jedesPixel(d, fahlfarbe);
  } else if (sorte_ === "busch") {
    jedesPixel(d, (r, g, b) => (laub(r, g, b).laub ? winterlaub(r, g, b) : null));
  }
}

/** Die Jahreszeit einer Tiled-Karte (Eigenschaft `jahreszeit`) oder null. */
export function jahreszeitDer(karte: object): Jahreszeit | null {
  const eigenschaften = (karte as { properties?: readonly { name?: string; value?: unknown }[] })
    .properties;
  const wert = (eigenschaften ?? []).find((e) => e.name === "jahreszeit")?.value;
  return wert === "winter" || wert === "winter_mild" ? wert : null;
}

/** Ein Möbel auf einer Textur: Rahmen (x, y, Breite, Höhe; null = ganzes Bild) und Sorte. */
export interface Texturteil {
  readonly rahmen: readonly [number, number, number, number] | null;
  readonly sorte: Sorte;
}

/**
 * Ersetzt geladene Texturen durch umgefärbte Leinwände (gleicher Schlüssel). Jedes Möbel auf einem
 * Bogen wird für sich gefärbt (eigene Schneekappe, eigener kahler Baum). Die Rahmen der Textur gehen
 * dabei verloren; die Szene legt sie danach neu an (moebel.ts, richteMoebelrahmenEin).
 */
export function faerbeJahreszeitlich(
  szene: Phaser.Scene,
  teile: ReadonlyMap<string, readonly Texturteil[]>,
  zeit: Jahreszeit,
): void {
  for (const [s, liste] of teile) {
    if (!szene.textures.exists(s)) continue;
    const quelle = szene.textures.get(s).getSourceImage() as CanvasImageSource & {
      width: number;
      height: number;
    };
    const leinwand = document.createElement("canvas");
    leinwand.width = quelle.width;
    leinwand.height = quelle.height;
    const malen = leinwand.getContext("2d");
    if (!malen) continue;
    malen.drawImage(quelle, 0, 0);
    for (const teil of liste) {
      const [x, y, breite, hoehe] = teil.rahmen ?? [0, 0, leinwand.width, leinwand.height];
      const bild = malen.getImageData(x, y, breite, hoehe);
      faerbeDaten(teil.sorte, zeit, bild.data, breite, hoehe);
      malen.putImageData(bild, x, y);
    }
    szene.textures.remove(s);
    szene.textures.addCanvas(s, leinwand);
  }
}
