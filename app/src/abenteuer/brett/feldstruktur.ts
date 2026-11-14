/**
 * Feine Pixelstruktur der Bretter des Schach-Abenteuers: Maserung, Körnung, Platten, Glanz …
 *
 * Rolle im Gesamtbild: Die Bretter sind Farbpaare mit feiner Pixelstruktur, ohne Bilddatei
 * (docs/spiel/30, Abschnitt 5 „Bretter“). Diese Datei rechnet die Pixel einer Kachel von zwei
 * mal zwei Feldern; Zeichnung.tsx legt sie als SVG-Muster über die Felder. Die Pixel sind nur
 * Weiß oder Schwarz mit wenig Deckkraft, damit sie auf jedem Farbpaar wirken und die
 * Lesbarkeit der Marken nicht verändern. Ein fester Zufall je Stil macht das Muster stabil.
 * Abhängigkeiten: brettstile.ts (Strukturarten).
 */
import type { Brettstilkennung, Strukturart } from "./brettstile";

/** Pixel je Feldbreite; ein Feld der Figuren hat 18, die Struktur ist etwas gröber. */
export const STRUKTURPIXEL_JE_FELD = 16;
/** Die Kachel ist zwei mal zwei Felder groß. */
export const KACHEL_FELDER = 2;
const KACHEL = STRUKTURPIXEL_JE_FELD * KACHEL_FELDER;

/** Ein Pixel (oder ein waagrechter Lauf) der Struktur, in Strukturpixeln der Kachel. */
export interface Strukturpixel {
  readonly x: number;
  readonly y: number;
  readonly breite: number;
  readonly hell: boolean;
  readonly deckkraft: number;
}

/** Deckkraft der Strukturen: zart, damit Figuren und Marken vorn bleiben. */
const ZART = 0.08;
const MITTEL = 0.14;
const KRAEFTIG = 0.3;

/** Ein kleiner Zufallsgenerator mit festem Anfang (lineare Kongruenz, Numerical Recipes). */
function zufall(saat: number): () => number {
  const MODUL = 2 ** 32;
  const FAKTOR = 1664525;
  const SUMMAND = 1013904223;
  let stand = saat % MODUL;
  return () => {
    stand = (stand * FAKTOR + SUMMAND) % MODUL;
    return stand / MODUL;
  };
}

/** Eine feste Saat aus der Kennung des Stils, damit jedes Brett sein eigenes Muster hat. */
function saat(kennung: string): number {
  const BASIS = 31;
  return [...kennung].reduce((summe, z) => (summe * BASIS + z.charCodeAt(0)) % 2 ** 31, 7);
}

/** Ganze Zufallszahl von `von` bis `bis` einschließlich. */
function ganz(z: () => number, von: number, bis: number): number {
  return von + Math.floor(z() * (bis - von + 1));
}

/** Anteil der Zeilen mit dunklem und hellem Strich der Maserung; Länge der Striche in Pixeln. */
const MASERUNG = {
  dunkelAnteil: 0.4,
  hellAnteil: 0.15,
  dunkelLaenge: [3, 9],
  hellLaenge: [2, 6],
} as const;
/** Kratzer je Kachel und ihre Länge in Pixeln (je zwei Pixel nach rechts einer nach unten). */
const KRATZER = { anzahl: 3, laenge: [4, 7], rand: 8 } as const;
/** Dichte der Körnung (Anteil der Pixel) und Abstand der Fugen der Schichten in Pixeln. */
const KOERNUNG_DICHTE = 0.07;
const SCHICHTEN = { start: [2, 4], abstand: [5, 7], luecke: [6, 10], laenge: [3, 7] } as const;

/** Ein waagrechter Strich zufälliger Lage und Länge in Zeile y. */
function strich(
  z: () => number,
  y: number,
  laenge: readonly [number, number],
  hell: boolean,
): Strukturpixel {
  const breite = ganz(z, laenge[0], laenge[1]);
  return { x: ganz(z, 0, KACHEL - breite), y, breite, hell, deckkraft: ZART };
}

/** Maserung: waagrechte Striche unterschiedlicher Länge, meist dunkel. */
function maserung(z: () => number): Strukturpixel[] {
  const pixel: Strukturpixel[] = [];
  for (let y = 0; y < KACHEL; y += 1) {
    if (z() < MASERUNG.dunkelAnteil) pixel.push(strich(z, y, MASERUNG.dunkelLaenge, false));
    if (z() < MASERUNG.hellAnteil) pixel.push(strich(z, y, MASERUNG.hellLaenge, true));
  }
  return pixel;
}

/** Kratzer: wenige schräge, helle Linien wie auf einem viel benutzten Brett. */
function kratzer(z: () => number): Strukturpixel[] {
  const pixel: Strukturpixel[] = [];
  for (let k = 0; k < KRATZER.anzahl; k += 1) {
    const x0 = ganz(z, 0, KACHEL - KRATZER.rand);
    const y0 = ganz(z, 0, KACHEL - KRATZER.rand);
    const laenge = ganz(z, KRATZER.laenge[0], KRATZER.laenge[1]);
    for (let i = 0; i < laenge; i += 1) {
      pixel.push({
        x: x0 + i,
        y: y0 + Math.floor(i / 2),
        breite: 1,
        hell: true,
        deckkraft: MITTEL,
      });
    }
  }
  return pixel;
}

/** Körnung: einzelne Pixel, hell und dunkel gemischt (Stein, Sand, altes Papier). */
function koernung(z: () => number, dichte = KOERNUNG_DICHTE, deckkraft = MITTEL): Strukturpixel[] {
  const HALB = 0.5;
  const pixel: Strukturpixel[] = [];
  for (let y = 0; y < KACHEL; y += 1) {
    for (let x = 0; x < KACHEL; x += 1) {
      if (z() < dichte) pixel.push({ x, y, breite: 1, hell: z() < HALB, deckkraft });
    }
  }
  return pixel;
}

/** Platten: jedes Feld eine Stahlplatte mit Lichtkante oben, Schattenkante unten, vier Nieten. */
function platten(): Strukturpixel[] {
  const pixel: Strukturpixel[] = [];
  const N = STRUKTURPIXEL_JE_FELD;
  const NIETE = [2, N - 3];
  for (const fy of [0, N]) {
    for (const fx of [0, N]) {
      pixel.push({ x: fx, y: fy, breite: N, hell: true, deckkraft: MITTEL });
      pixel.push({ x: fx, y: fy + N - 1, breite: N, hell: false, deckkraft: KRAEFTIG });
      for (const ny of NIETE) {
        for (const nx of NIETE) {
          pixel.push({ x: fx + nx, y: fy + ny, breite: 1, hell: true, deckkraft: KRAEFTIG });
          pixel.push({
            x: fx + nx + 1,
            y: fy + ny + 1,
            breite: 1,
            hell: false,
            deckkraft: KRAEFTIG,
          });
        }
      }
    }
  }
  return pixel;
}

/** Glanz: schräge helle Bänder wie Licht auf Glas oder Politur. */
function glanz(): Strukturpixel[] {
  const pixel: Strukturpixel[] = [];
  const BAND = [0, 1, 6];
  for (let y = 0; y < KACHEL; y += 1) {
    for (const versatz of BAND) {
      const x = (KACHEL * 2 - y + versatz) % KACHEL;
      pixel.push({ x, y, breite: 1, hell: true, deckkraft: versatz === BAND[2] ? ZART : MITTEL });
    }
  }
  return pixel;
}

/** Schichten: waagrechte Fugen mit Lücken (Schiefer, Sandstein). */
function schichten(z: () => number): Strukturpixel[] {
  const pixel: Strukturpixel[] = [];
  const { start, abstand, luecke, laenge } = SCHICHTEN;
  for (let y = ganz(z, start[0], start[1]); y < KACHEL; y += ganz(z, abstand[0], abstand[1])) {
    for (let x = 0; x < KACHEL; x += ganz(z, luecke[0], luecke[1])) {
      pixel.push({ x, y, breite: ganz(z, laenge[0], laenge[1]), hell: false, deckkraft: MITTEL });
    }
  }
  return pixel;
}

/**
 * Die Pixel einer Kachel für einen Stil.
 *
 * Eingaben: Kennung (für den festen Zufall), Strukturarten des Stils. Ausgabe: Pixel in
 * Strukturpixeln, Kachel 32 × 32. Beispiel: „stahl“ mit Platten und Kratzern hat je Feld vier
 * Nieten. Sonderfall: ohne Strukturarten bleibt die Liste leer (schlichte Felder).
 */
export function strukturpixel(
  kennung: Brettstilkennung,
  arten: readonly Strukturart[],
): Strukturpixel[] {
  const z = zufall(saat(kennung));
  const SALZDICHTE = 0.025;
  const VINYLDICHTE = 0.03;
  const erzeuger: Record<Strukturart, () => Strukturpixel[]> = {
    maserung: () => maserung(z),
    kratzer: () => kratzer(z),
    koernung: () => koernung(z),
    platten,
    glanz,
    salz: () => koernung(z, SALZDICHTE, KRAEFTIG).map((p) => ({ ...p, hell: true })),
    schichten: () => schichten(z),
    vinyl: () => koernung(z, VINYLDICHTE, ZART).map((p) => ({ ...p, hell: false })),
  };
  return arten.flatMap((art) => erzeuger[art]());
}
