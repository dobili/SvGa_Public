/**
 * Felder aus den gebauten Karten des Abenteuers für die Oberflächentests.
 *
 * Warum: Die Karten werden umgebaut (Runde 4, Varianten); Tests mit festen Feldern liefen danach
 * ins Leere (Skater Jo stand nach dem Umbau des Parks an der Bank). Die Tests lesen deshalb das
 * Feld vor einer Figur oder einem Auslöser aus inhalte/abenteuer/karten/.
 */
import { readFileSync } from "node:fs";

/** Kantenlänge einer Kachel in Pixeln (Tiled-Karten des Abenteuers). */
const KACHEL = 16;

interface TiledObjekt {
  readonly name?: string;
  readonly x: number;
  readonly y: number;
}

interface TiledKarte {
  readonly layers: readonly { readonly objects?: readonly TiledObjekt[] }[];
}

/**
 * Das Feld direkt unter einer Figur oder einem Auslöser: Dort steht der Held mit Blick nach oben
 * und kann ansprechen. Eingaben: Dateiname der Karte ohne Endung (etwa „maple-falls-park“) und
 * Name des Objekts (etwa „skaterJo“). Wirft, wenn es das Objekt nicht gibt.
 * Beispiel: feldDarunter("maple-falls-park", "kiosk") → { x: 25, y: 14 }.
 */
export function feldDarunter(karte: string, name: string): { x: number; y: number } {
  const datei = new URL(`../../../inhalte/abenteuer/karten/${karte}.json`, import.meta.url);
  const daten = JSON.parse(readFileSync(datei, "utf8")) as TiledKarte;
  const objekt = daten.layers.flatMap((e) => e.objects ?? []).find((o) => o.name === name);
  if (!objekt) throw new Error(`${name} fehlt auf der Karte ${karte}`);
  return { x: Math.floor(objekt.x / KACHEL), y: Math.floor(objekt.y / KACHEL) + 1 };
}

/**
 * Das Feld eines Auslösers oder einer Figur selbst (etwa „start“): dort beginnt der Held.
 * Beispiel: feldVon("steinbruch-stollen", "start") → Feld des Startauslösers im Stollen.
 */
export function feldVon(karte: string, name: string): { x: number; y: number } {
  const darunter = feldDarunter(karte, name);
  return { x: darunter.x, y: darunter.y - 1 };
}
