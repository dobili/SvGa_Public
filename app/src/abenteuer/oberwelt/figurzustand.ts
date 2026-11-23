/**
 * Zustand und Standbild einer Figur, eines Statisten oder eines Tiers an seiner Stelle der Szene
 * (Karteneditor 1.9, Wunsch des Autors, 23.11.2026: „zwischen den verschiedenen States wechseln …
 * damit ich kleine Ungereimtheiten in der Darstellung selbst im Editor ändern kann“).
 *
 * Die Szene trägt optional `zustand` und `standbild` (pipeline/abenteuer/figurzustand.py,
 * Szenen-README); leer heißt Regel wie bisher (Sitzmöbel und `sitzt`, Verhalten, Tagesablauf).
 * - Menschen: stehen, sitzstuhl (Sitzbild, auch ohne Möbel mit Hub), sitzboden (Schneidersitz,
 *   auch auf einem Stuhl), liegt (Liegebild oder gekipptes Standbild).
 * - Tiere: stehen, sitzen, schlafen, grasen, schwimmen; wer ruht, bleibt auf seinem Feld.
 * - Standbild: weiteres Standbild aus PixelLab (skripte/figurstandbilder.mjs). Der Bogen hat sie ab
 *   Rahmen `beginn`, je vier (rechts, oben, links, unten), in der Ordnung von `kennungen`
 *   (Paket: figuren32/standbilder.json).
 * Vorrang: Tagesablauf und `#stelle` gehen vor (regeln/tagesablauf.ts, fuehrungsschicht.ts).
 * Rolle im Gesamtbild: gelesen von ausloeserebene.ts und belebung.ts, angewandt in
 * figurenaufstellung.ts und belebungsschicht.ts. Abhängigkeiten: szene.ts (Typ Richtung).
 */
import type { Richtung } from "./szene";

export type Menschenzustand = "stehen" | "sitzstuhl" | "sitzboden" | "liegt";
export type Tierzustand = "stehen" | "sitzen" | "schlafen" | "grasen" | "schwimmen";

const MENSCHENZUSTAENDE: readonly Menschenzustand[] = ["stehen", "sitzstuhl", "sitzboden", "liegt"];
const TIERZUSTAENDE: readonly Tierzustand[] = [
  "stehen",
  "sitzen",
  "schlafen",
  "grasen",
  "schwimmen",
];
const KENNUNG = /^[a-z0-9][a-z0-9-]{0,39}$/;
/** Reihenfolge der Richtungen im Bogen (wie die Standbilder, figurbilder.ts). */
const REIHENFOLGE: readonly Richtung[] = ["rechts", "oben", "links", "unten"];

/** Weitere Standbilder eines Bogens: erster Rahmen und Kennungen in der Ordnung des Bogens. */
export interface Standbildindex {
  readonly beginn: number;
  readonly kennungen: readonly string[];
}

/** Index aller Bögen (Bogenname → Standbilder), aus figuren32/standbilder.json. */
export type Standbildindizes = Readonly<Record<string, Standbildindex>>;

/** Zustand eines Menschen aus einer Eigenschaft, sonst null. Beispiel: "sitzboden" → "sitzboden". */
export function liesMenschenzustand(wert: unknown): Menschenzustand | null {
  return MENSCHENZUSTAENDE.find((z) => z === wert) ?? null;
}

/** Zustand eines Tiers aus einer Eigenschaft, sonst null. Beispiel: "grasen" → "grasen". */
export function liesTierzustand(wert: unknown): Tierzustand | null {
  return TIERZUSTAENDE.find((z) => z === wert) ?? null;
}

/** Kennung eines Standbilds, sonst null. Beispiel: "ohne-teleskop" → gleich; "Mit Hut" → null. */
export function liesStandbild(wert: unknown): string | null {
  return typeof wert === "string" && KENNUNG.test(wert) ? wert : null;
}

/**
 * Rahmen des weiteren Standbilds `kennung` in Richtung `richtung`, oder null (kein Index, Kennung
 * unbekannt: dann gilt das gewöhnliche Standbild). Beispiel: { beginn: 144, kennungen: ["a", "b"] },
 * "b", "unten" → 144 + 4 + 3 = 151.
 */
export function standbildrahmen(
  index: Standbildindex | undefined,
  kennung: string | null | undefined,
  richtung: Richtung,
): number | null {
  const k = kennung && index ? index.kennungen.indexOf(kennung) : -1;
  if (!index || k < 0) return null;
  return index.beginn + k * REIHENFOLGE.length + REIHENFOLGE.indexOf(richtung);
}

/** Wie eine Figur an ihrer Stelle sitzt oder liegt (null bei amBoden: nach Sitzmöbel wie bisher). */
export interface Haltung {
  readonly sitzt: Richtung | null;
  readonly amBoden: boolean | null;
  readonly liegt: boolean;
}

/**
 * Haltung nach Zustand der Szene; ohne Zustand die Regel (sitzt, wenn `sitzt` gesetzt).
 * Beispiel: (sitzboden, sitzt null, blick links) → sitzt links, am Boden; (stehen, sitzt unten) →
 * steht; (null, sitzt oben) → sitzt oben, Boden nach Sitzmöbel.
 */
export function haltungAus(
  zustand: Menschenzustand | null | undefined,
  sitzt: Richtung | null | undefined,
  blick: Richtung | null | undefined,
): Haltung {
  const richtung = sitzt ?? blick ?? "unten";
  switch (zustand) {
    case "stehen":
      return { sitzt: null, amBoden: null, liegt: false };
    case "sitzstuhl":
      return { sitzt: richtung, amBoden: false, liegt: false };
    case "sitzboden":
      return { sitzt: richtung, amBoden: true, liegt: false };
    case "liegt":
      return { sitzt: null, amBoden: null, liegt: true };
    default:
      return { sitzt: sitzt ?? null, amBoden: null, liegt: false };
  }
}
