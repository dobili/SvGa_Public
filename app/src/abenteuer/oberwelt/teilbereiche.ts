/**
 * Teilbereiche eines Möbelbilds mit eigener Zeichentiefe (KARTENREGELN 10.95, Phase 2B, 28.11.2026).
 * Rolle im Gesamtbild: moebel.ts zeichnet ein Bild mit `teilbereiche` als mehrere beschnittene
 * Bilder, heldtiefe.ts behandelt jedes Teil wie ein eigenes Möbel.
 *
 * Warum: Ein Bild hat sonst eine einzige Sortierlinie. Bei einer Veranda (Villa in Port Delacroix,
 * Musikhaus) steht der Held auf dem Verandaboden vor der Hauswand, aber hinter dem Geländer; mit einer
 * Linie stünde er entweder hinter dem ganzen Haus oder vor dem Geländer. Katalogfeld:
 * `teilbereiche: [{ rechteck: [x0, y0, x1, y1], sortierlinie?: n, ebene?: "boden" }]` in Pixeln des
 * ungeformten Katalogbilds (Ende ausschließlich). Ein Teil hat die eigene Sortierlinie (ab Oberkante
 * des Bildes) oder liegt auf der Bodenebene (unter allen Figuren, wie `ebene: "boden"`); ohne beides
 * gilt die Tiefe des ganzen Bildes. Der Rest des Bildes behält die Tiefe des Möbels (zeichentiefe.ts).
 * Die Bereiche überlappen sich nicht. Die Sperre bleibt die Maske des Bildes (`maske_fein`).
 * Sonderfälle: Mit Form aus dem Karteneditor (Drehung, Spiegeln, Maßstab, Zuschnitt) oder eigener
 * Tiefe aus der Karte bleibt das Bild ganz (eine Tiefe), wie bisher.
 * Beispiel: Villa 144 × 208 auf (0, 0), Sortierlinie 206, Teilbereich [16, 0, 104, 182] mit Linie
 * 170 → Teil (16, 0, 88 × 182) mit Tiefe 170 und drei Restteile mit Tiefe 206.
 */
import type { Moebel } from "./moebel";
import { BODENTIEFE, moebeltiefe } from "./zeichentiefe";

/** Ein Teilbereich im Katalog (Pixel des Katalogbilds, Ende ausschließlich). */
export interface Teilbereich {
  readonly rechteck: readonly [number, number, number, number];
  readonly sortierlinie?: number;
  readonly ebene?: string;
}

/** Ein Rechteck im Bild (Pixel ab der linken oberen Ecke). */
export interface Bildausschnitt {
  readonly x: number;
  readonly y: number;
  readonly breite: number;
  readonly hoehe: number;
}

/** Ein Teil des Bildes mit seiner Zeichentiefe; `ganz` für das ungeteilte Bild. */
export interface Bildteil {
  readonly ausschnitt: Bildausschnitt;
  readonly tiefe: number;
  readonly ganz: boolean;
}

type Rechteck = readonly [number, number, number, number];

/**
 * Ein Rechteck minus ein zweites: bis zu vier Teile (oben, unten, links, rechts).
 * Beispiel: [0, 0, 10, 10] minus [2, 2, 8, 8] → oben [0,0,10,2], unten [0,8,10,10], links, rechts.
 */
export function abziehen(r: Rechteck, weg: Rechteck): Rechteck[] {
  const [x0, y0, x1, y1] = r;
  const [wx0, wy0, wx1, wy1] = weg;
  if (wx0 >= x1 || wx1 <= x0 || wy0 >= y1 || wy1 <= y0) return [r];
  const teile: Rechteck[] = [];
  if (y0 < wy0) teile.push([x0, y0, x1, wy0]);
  if (wy1 < y1) teile.push([x0, wy1, x1, y1]);
  const oben = Math.max(y0, wy0);
  const unten = Math.min(y1, wy1);
  if (x0 < wx0) teile.push([x0, oben, wx0, unten]);
  if (wx1 < x1) teile.push([wx1, oben, x1, unten]);
  return teile;
}

function ausschnitt([x0, y0, x1, y1]: Rechteck): Bildausschnitt {
  return { x: x0, y: y0, breite: x1 - x0, hoehe: y1 - y0 };
}

/** Die Teilbereiche, die für dieses Möbel gelten (ungeformt, ohne eigene Tiefe), sonst leer. */
function geltende(m: Moebel, kachel: number): readonly Teilbereich[] {
  const bereiche = m.angabe.teilbereiche;
  if (!bereiche || bereiche.length === 0 || m.form) return [];
  const vorgabe = m.y + m.angabe.hoehe - kachel / 2;
  if (m.tiefe !== undefined && m.tiefe !== vorgabe) return [];
  return bereiche;
}

/**
 * Die Teile eines Möbelbilds mit Zeichentiefe. Ohne geltende Teilbereiche ein Teil (das ganze Bild,
 * `moebeltiefe`). Mit ihnen je Bereich ein Teil (eigene Sortierlinie, Bodenebene oder die Tiefe des
 * Bildes) und der Rest des Bildes in Rechtecken mit der Tiefe des Bildes.
 * Beispiel: Musikhaus 208 × 160 auf y 400, Bereich [84, 92, 124, 160] mit Linie 128 → Teil mit
 * Tiefe 528, Rest (oben, links, rechts) mit der Tiefe des Hauses.
 */
export function bildteile(m: Moebel, kachel: number): Bildteil[] {
  const tiefe = moebeltiefe(m, kachel);
  const { breite, hoehe } = m.angabe;
  const bereiche = geltende(m, kachel);
  if (bereiche.length === 0) {
    return [{ ausschnitt: { x: 0, y: 0, breite, hoehe }, tiefe, ganz: true }];
  }
  let rest: Rechteck[] = [[0, 0, breite, hoehe]];
  const teile: Bildteil[] = [];
  for (const b of bereiche) {
    const [x0, y0, x1, y1] = b.rechteck;
    const r: Rechteck = [
      Math.max(0, x0),
      Math.max(0, y0),
      Math.min(breite, x1),
      Math.min(hoehe, y1),
    ];
    if (r[2] <= r[0] || r[3] <= r[1]) continue;
    rest = rest.flatMap((s) => abziehen(s, r));
    const eigene =
      b.ebene === "boden"
        ? BODENTIEFE
        : typeof b.sortierlinie === "number"
          ? m.y + b.sortierlinie
          : tiefe;
    teile.push({ ausschnitt: ausschnitt(r), tiefe: eigene, ganz: false });
  }
  return [...teile, ...rest.map((r) => ({ ausschnitt: ausschnitt(r), tiefe, ganz: false }))];
}

/**
 * Die Bodenbereiche eines Möbels in Weltpixeln (Katalogfeld `boden_bereiche`, abgeleitet von
 * pipeline/abenteuer/bauteilregeln.py: begehbare Teile über der Sortierlinie, etwa ein Absatz vor
 * der Tür). Bedeutung: Steht der Fuß des Helden darin, wird er über dem ganzen Bild gezeichnet
 * (heldtiefe.ts). Nur ungeformt (mit Form aus dem Karteneditor: keine), wie die Teilbereiche.
 * Beispiel: Kantine auf (896, 0) mit [[144, 254, 208, 256]] → [{ x: 1040, y: 254, breite: 64, hoehe: 2 }].
 */
export function bodenbereiche(m: Moebel): Bildausschnitt[] {
  const bereiche = m.angabe.boden_bereiche;
  if (!bereiche || m.form) return [];
  return bereiche.map(([x0, y0, x1, y1]) => ({
    x: m.x + x0,
    y: m.y + y0,
    breite: x1 - x0,
    hoehe: y1 - y0,
  }));
}
