/**
 * Zuschnitt eines Möbels auf der Karte: links, oben, rechts und unten Pixel weg (Karteneditor 1.5).
 *
 * Warum: Der Autor beschneidet im Karteneditor vorhandene Bilder, etwa einen Pfosten aus einem
 * Zaunstück (Wunsch des Autors, 16.11.2026). Der Kartenbau schreibt das als Eigenschaft `zuschnitt`
 * („links,oben,rechts,unten“) an das Möbelobjekt. Gleiche Regel wie
 * pipeline/abenteuer/objektzuschnitt.py; moebelform.ts wendet sie vor Maßstab und Drehung an.
 * Regeln: Das Objekt ist so groß wie der Ausschnitt. Die Katalogmaske (auch die Standardregel mit
 * `frei_unten`) wird mitbeschnitten; das Raster des Ausschnitts zählt angefangene Kacheln mit, und
 * eine neue Kachel sperrt, wenn sie eine gesperrte Katalogkachel berührt.
 * Beispiel: Zaun 64 × 32 mit zuschnitt "26,0,32,0" → Pfosten 6 × 32, Maske [".", "#"].
 */

/** Pixel links, oben, rechts, unten. */
export type Zuschnitt = readonly [number, number, number, number];

const KACHEL = 16;
const SEITEN = 4;

/** Liest den Zuschnitt aus dem Wert der Eigenschaft; ohne oder lauter Nullen: undefined. */
export function zuschnittAus(wert: unknown): Zuschnitt | undefined {
  if (typeof wert !== "string") return undefined;
  const teile = wert.split(",").map((t) => Math.max(0, Math.trunc(Number(t))));
  if (teile.length !== SEITEN || teile.some((t) => !Number.isFinite(t))) return undefined;
  if (!teile.some((t) => t > 0)) return undefined;
  return [teile[0] ?? 0, teile[1] ?? 0, teile[2] ?? 0, teile[3] ?? 0];
}

/** Größe des Ausschnitts, mindestens 1. Beispiel: 64 × 32, [26, 0, 32, 0] → [6, 32]. */
export function beschnitteneGroesse(breite: number, hoehe: number, z: Zuschnitt): [number, number] {
  return [Math.max(1, breite - z[0] - z[2]), Math.max(1, hoehe - z[1] - z[3])];
}

/** Spalten und Reihen der Maske eines beschnittenen Bildes. Beispiel: 6 × 32 → [1, 2]. */
export function zuschnittRaster(breite: number, hoehe: number): [number, number] {
  return [Math.max(1, Math.ceil(breite / KACHEL)), Math.max(1, Math.ceil(hoehe / KACHEL))];
}

/** Standardregel (pipeline/abenteuer/maske.py) als Maske. Beispiel: 2 × 2 → ["..", "##"]. */
export function standardmaske(spalten: number, reihen: number, freiUnten = 0): string[] {
  const oben = reihen > 1 ? 1 : 0;
  return Array.from({ length: reihen }, (_, y) =>
    (y >= oben && y < reihen - freiUnten ? "#" : ".").repeat(spalten),
  );
}

/** Wirksame Katalogmaske, voll aufgefüllt. Beispiel: Zaun 64 × 32 → ["....", "####"]. */
function katalogmaske(
  breite: number,
  hoehe: number,
  maske: readonly string[] | undefined,
  freiUnten: number,
): string[] {
  const spalten = Math.max(1, Math.floor(breite / KACHEL));
  const reihen = Math.max(1, Math.floor(hoehe / KACHEL));
  if (!maske) return standardmaske(spalten, reihen, freiUnten);
  return Array.from({ length: reihen }, (_, y) =>
    (maske[y] ?? "").padEnd(spalten, ".").slice(0, spalten),
  );
}

/** Neue Kacheln, die die alte Kachel ab `anfang` nach dem Versatz berührt. */
function beruehrte(anfang: number, laenge: number, versatz: number, anzahl: number): number[] {
  const links = Math.max(0, anfang - versatz);
  const rechts = Math.min(laenge, anfang + KACHEL - versatz);
  const liste: number[] = [];
  if (rechts <= links) return liste;
  const ende = Math.min(anzahl, Math.floor((rechts - 1) / KACHEL) + 1);
  for (let i = Math.floor(links / KACHEL); i < ende; i++) liste.push(i);
  return liste;
}

/** Katalogmaske auf den Ausschnitt gebracht. Beispiel: ["....", "####"], [26, 0, 32, 0] → [".", "#"]. */
export function beschneideMaske(
  maske: readonly string[],
  z: Zuschnitt,
  breite: number,
  hoehe: number,
): string[] {
  const [spalten, reihen] = zuschnittRaster(breite, hoehe);
  const neu = Array.from({ length: reihen }, () => Array<string>(spalten).fill("."));
  maske.forEach((zeile, y) =>
    [...zeile].forEach((zeichen, x) => {
      if (zeichen !== "#") return;
      for (const ny of beruehrte(y * KACHEL, hoehe, z[1], reihen))
        for (const nx of beruehrte(x * KACHEL, breite, z[0], spalten)) {
          const reihe = neu[ny];
          if (reihe) reihe[nx] = "#";
        }
    }),
  );
  return neu.map((r) => r.join(""));
}

/** Die Angabe nach dem Zuschnitt: Größe des Ausschnitts, beschnittene Maske, ohne `frei_unten`. */
export function beschnitten<
  T extends {
    readonly breite: number;
    readonly hoehe: number;
    readonly frei_unten?: number;
    readonly maske?: readonly string[];
  },
>(angabe: T, z: Zuschnitt): T {
  const [breite, hoehe] = beschnitteneGroesse(angabe.breite, angabe.hoehe, z);
  const { frei_unten: freiUnten, ...rest } = angabe;
  const katalog = katalogmaske(angabe.breite, angabe.hoehe, angabe.maske, freiUnten ?? 0);
  const maske = beschneideMaske(katalog, z, breite, hoehe);
  return { ...rest, breite, hoehe, maske } as unknown as T;
}
