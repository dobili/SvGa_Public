/**
 * Kollision fein: Sperren in Viertelkacheln (Zellen von 4 × 4 Pixeln), reine Logik ohne Phaser.
 *
 * Warum: Der Autor sperrt im Karteneditor ein Viertel, die Hälfte oder drei Viertel einer Kachel,
 * waagrecht und senkrecht getrennt (Karteneditor 1.6, Wunsch des Autors, 16.11.2026). Der Kartenbau
 * (pipeline/abenteuer/kollisionfein.py) schreibt das in zwei Tiled-Eigenschaften:
 * - Karte `sperren_fein`: „x,y,maske;…“, je Kachel 16 Zeichen „#“ (sperrt) oder „.“, Reihe für
 *   Reihe von oben links.
 * - Möbel `maske_fein`: „..##/..##/…“, je Kachel 4 Zeichen und 4 Zeilen, schon gedreht und
 *   gespiegelt; dazu steht die grobe `maske` am Objekt.
 * Rolle: Die Szene legt daraus Physik-Rechtecke an (moebel.ts, szene.ts), der Held stößt genau an der
 * Kante an. Wer in ganzen Kacheln rechnet (begehbar.ts, sperrkarte.ts: Ankunft, Tiere, Statisten,
 * Tippschritt, Lauftest), zählt eine Kachel als gesperrt, wenn der Held (12 × 12 Pixel) mittig auf
 * ihr (Pixel 2 bis 14) eine gesperrte Zelle überlappte: also bei irgendeiner gesperrten Zelle.
 * Gleiche Fälle wie die Pipeline: feinsperren.faelle.json (feinsperren.test.ts,
 * pipeline/tests/test_abenteuer_kollisionfein.py).
 * Abhängigkeiten: keine.
 */

/** Zellen je Kachelkante. */
export const ZELLEN = 4;
const TRENNER = ";";
const REIHENTRENNER = "/";
const MASKE = /^[#.]{16}$/;

/** Ein Rechteck in Pixeln (linke obere Ecke, Breite, Höhe). */
export interface Rechteck {
  readonly x: number;
  readonly y: number;
  readonly b: number;
  readonly h: number;
}

interface Eigenschaft {
  readonly name?: string;
  readonly value?: unknown;
}

/**
 * Die feinen Sperren einer Karte aus der Eigenschaft `sperren_fein`: „x,y“ → 16 Zeichen.
 * Beispiel: „5,7,########........“ → Map { "5,7" → "########........" }. Kaputtes wird übergangen.
 */
export function feinsperrenAus(
  eigenschaften: readonly Eigenschaft[] | undefined,
): Map<string, string> {
  const wert = eigenschaften?.find((e) => e.name === "sperren_fein")?.value;
  const ergebnis = new Map<string, string>();
  if (typeof wert !== "string" || !wert) return ergebnis;
  for (const teil of wert.split(TRENNER)) {
    const [x, y, maske] = teil.split(",");
    if (!/^-?\d+$/.test(x ?? "") || !/^-?\d+$/.test(y ?? "") || !MASKE.test(maske ?? "")) continue;
    ergebnis.set(`${x},${y}`, maske ?? "");
  }
  return ergebnis;
}

/** Die feine Maske eines Möbels aus der Eigenschaft `maske_fein` („..##/..##“) oder undefined. */
export function feineMaskeAus(
  eigenschaften: readonly Eigenschaft[] | undefined,
): string[] | undefined {
  const wert = eigenschaften?.find((e) => e.name === "maske_fein")?.value;
  return typeof wert === "string" && /^[#./]+$/.test(wert) ? wert.split(REIHENTRENNER) : undefined;
}

/**
 * Die Kacheln mit mindestens einer gesperrten Zelle („x,y“): für die Ganzkachel-Rechner gesperrt.
 * Beispiel: { "5,7" → "########........" } → ["5,7"]; eine leere Maske zählt nicht.
 */
export function kachelnMitFeinsperre(feinsperren: ReadonlyMap<string, string>): string[] {
  return [...feinsperren].filter(([, maske]) => maske.includes("#")).map(([k]) => k);
}

/**
 * Fasst gesperrte Zellen zu wenigen Rechtecken zusammen: erst waagrechte Läufe je Reihe, dann
 * gleiche Läufe in aufeinanderfolgenden Reihen. Eingabe: Raster aus Zeilen („#“ sperrt), Größe
 * einer Zelle in Pixeln. Ausgabe: Rechtecke in Pixeln ab der linken oberen Ecke des Rasters.
 * Beispiel: ["####", "####", "....", "...."], 4 → [{ x: 0, y: 0, b: 16, h: 8 }].
 */
export function zellrechtecke(raster: readonly string[], zelle: number): Rechteck[] {
  const fertig: Rechteck[] = [];
  let offen = new Map<string, Rechteck>();
  raster.forEach((zeile, reihe) => {
    const naechste = new Map<string, Rechteck>();
    for (const [anfang, ende] of laeufe(zeile)) {
      const schluessel = `${anfang},${ende}`;
      const alt = offen.get(schluessel);
      naechste.set(
        schluessel,
        alt
          ? { ...alt, h: alt.h + zelle }
          : { x: anfang * zelle, y: reihe * zelle, b: (ende - anfang) * zelle, h: zelle },
      );
      offen.delete(schluessel);
    }
    fertig.push(...offen.values());
    offen = naechste;
  });
  return [...fertig, ...offen.values()];
}

/** Die waagrechten Läufe von „#“ einer Zeile als [Anfang, Ende) in Zellen. */
function laeufe(zeile: string): [number, number][] {
  const ergebnis: [number, number][] = [];
  let anfang = -1;
  for (let i = 0; i <= zeile.length; i++) {
    const zu = zeile[i] === "#";
    if (zu && anfang < 0) anfang = i;
    if (!zu && anfang >= 0) {
      ergebnis.push([anfang, i]);
      anfang = -1;
    }
  }
  return ergebnis;
}

/** Die 16 Zeichen einer Kachel als Raster 4 × 4. Beispiel: „####…“ → ["####", "....", …]. */
function kachelraster(maske: string): string[] {
  return [0, 1, 2, 3].map((r) => maske.slice(r * ZELLEN, (r + 1) * ZELLEN));
}

/**
 * Die Physik-Rechtecke der feinen Sperren einer Karte in Pixeln, je Kachel zusammengefasst.
 * Beispiel: „1,1,########........“ bei Kacheln von 16 Pixeln → [{ x: 16, y: 16, b: 16, h: 8 }].
 */
export function feinsperrRechtecke(
  feinsperren: ReadonlyMap<string, string>,
  kachel: number,
): Rechteck[] {
  const zelle = kachel / ZELLEN;
  return [...feinsperren].flatMap(([k, maske]) => {
    const [x, y] = k.split(",").map(Number);
    return zellrechtecke(kachelraster(maske), zelle).map((r) => ({
      ...r,
      x: r.x + (x ?? 0) * kachel,
      y: r.y + (y ?? 0) * kachel,
    }));
  });
}

/**
 * Die Physik-Rechtecke eines Möbels mit feiner Maske in Kartenpixeln (Ecke des Möbels plus Zellen).
 * Beispiel: Möbel bei (8, 16) mit ["##..", "##..", "....", "...."] → [{ x: 8, y: 16, b: 8, h: 8 }].
 */
export function moebelRechtecke(
  ort: { readonly x: number; readonly y: number },
  maskeFein: readonly string[],
  kachel: number,
): Rechteck[] {
  return zellrechtecke(maskeFein, kachel / ZELLEN).map((r) => ({
    ...r,
    x: r.x + ort.x,
    y: r.y + ort.y,
  }));
}
