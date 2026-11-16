/**
 * Kollision fein in den Lauftests: Auf welchen Kacheln kann die Mitte des Helden stehen?
 *
 * Rolle im Gesamtbild: Reine Logik für uebergangslauf.test.ts und reiseankunft.test.ts. Die Rechner
 * in ganzen Kacheln (begehbar.ts) zählen eine Kachel mit einer gesperrten Zelle als gesperrt (der
 * Held, 12 × 12 Pixel, stünde mittig darauf an). Im Spiel stößt der Held aber genau an den
 * Physik-Rechtecken der Zellen an (moebel.ts, szene.ts) und löst einen Übergang aus, sobald seine
 * Mitte auf dem Auslöser steht. Der Autor baut Treppenlöcher mit fein gesetzten Geländerkanten
 * (Karteneditor 1.6, 16.11.2026): Die Auslöser liegen zwischen den Kanten auf Kacheln, die in
 * ganzen Kacheln gesperrt sind. Dieselbe Rechnung macht die Pipeline
 * (pipeline/abenteuer/durchgang.py, betretbare_kacheln; engstelle.py, stellplaetze).
 * Abhängigkeiten: begehbar.ts, feinsperren.ts, moebelform.ts.
 * Beispiel: Wohnzimmer, Treppe zwischen zwei Holmen, je ein Viertel breit: Die Kacheln (1, 4) und
 * (2, 4) sind in ganzen Kacheln gesperrt, die Mitte des Helden passt aber zwischen die Holme.
 */
import {
  hatKollision,
  pinselkacheln,
  sperreMoebel,
  sperrendeKacheln,
  sperrkacheln,
  type Sperrangabe,
  type Tiledkarte,
} from "./begehbar";
import { ZELLEN, feinsperrenAus } from "./feinsperren";
import { geformtAusObjekt } from "./moebelform";

/** Der Held in Zellen (12 Pixel bei Zellen von 4 Pixeln). */
const KOERPER = 3;

/** Trägt die 16 Zellen einer Kachel ein oder aus. */
function kachelzellen(x: number, y: number): string[] {
  const zellen: string[] = [];
  for (let i = 0; i < ZELLEN * ZELLEN; i++) {
    zellen.push(`${x * ZELLEN + (i % ZELLEN)},${y * ZELLEN + Math.floor(i / ZELLEN)}`);
  }
  return zellen;
}

/**
 * Alle gesperrten Zellen (4 Pixel) einer Karte ohne Figuren: Kachelebenen mit Kollision, Möbel
 * (jede berührte Zelle), gemalte Sperren und Freigaben, feine Sperren (`sperren_fein`). Feine
 * Freigaben hat der Kartenbau schon in Ebenen und Masken geschrieben.
 */
export function sperrzellen(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
): Set<string> {
  const zellen = new Set<string>();
  const gids = sperrendeKacheln(karte);
  for (const ebene of karte.layers) {
    (ebene.data ?? []).forEach((gid, i) => {
      if (!gids.has(gid)) return;
      for (const z of kachelzellen(i % karte.width, Math.floor(i / karte.width))) zellen.add(z);
    });
    for (const o of ebene.objects ?? []) {
      const roh = o.type === "moebel" && o.name ? moebel[o.name] : undefined;
      if (!roh || !(hatKollision(o.properties) ?? roh.kollision)) continue;
      const ort = { x: o.x ?? 0, y: o.y ?? 0 };
      sperreMoebel(zellen, ort, geformtAusObjekt(roh, o.properties), kachel, kachel / ZELLEN);
    }
  }
  const feld = (k: string) => k.split(",").map(Number) as [number, number];
  for (const k of pinselkacheln(karte, "sperren"))
    for (const z of kachelzellen(...feld(k))) zellen.add(z);
  for (const k of pinselkacheln(karte, "freigeben")) {
    for (const z of kachelzellen(...feld(k))) zellen.delete(z);
  }
  for (const [k, maske] of feinsperrenAus(karte.properties)) {
    const [x, y] = feld(k);
    [...maske].forEach((c, i) => {
      if (c === "#")
        zellen.add(`${x * ZELLEN + (i % ZELLEN)},${y * ZELLEN + Math.floor(i / ZELLEN)}`);
    });
  }
  return zellen;
}

/**
 * Die Kacheln („x,y“), auf denen die Mitte des Helden stehen kann: Ein Körper von 3 × 3 Zellen
 * passt frei hinein, und seine Mitte liegt auf der Kachel.
 */
export function mittenkacheln(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
): Set<string> {
  const zu = sperrzellen(karte, moebel, kachel);
  const breite = karte.width * ZELLEN;
  const hoehe = karte.height * ZELLEN;
  const mitte = (KOERPER * (kachel / ZELLEN)) / 2;
  const ergebnis = new Set<string>();
  for (let y = 0; y + KOERPER <= hoehe; y++) {
    for (let x = 0; x + KOERPER <= breite; x++) {
      let frei = true;
      for (let i = 0; i < KOERPER * KOERPER && frei; i++) {
        frei = !zu.has(`${x + (i % KOERPER)},${y + Math.floor(i / KOERPER)}`);
      }
      if (!frei) continue;
      const px = (x * kachel) / ZELLEN + mitte;
      const py = (y * kachel) / ZELLEN + mitte;
      ergebnis.add(`${Math.floor(px / kachel)},${Math.floor(py / kachel)}`);
    }
  }
  return ergebnis;
}

/**
 * Abfrage „ist diese Kachel frei?“ mit Kollision fein: frei in ganzen Kacheln oder eine Kachel, auf
 * der die Mitte des Helden stehen kann und auf der keine Figur steht. `gesperrt`: die gesperrten
 * Kacheln des Lauftests (mit Figuren und Statisten).
 */
export function freiMitMitte(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
  gesperrt: ReadonlySet<string>,
): (x: number, y: number) => boolean {
  const ohneFiguren = sperrkacheln(karte, moebel, kachel, false);
  const mitten = mittenkacheln(karte, moebel, kachel);
  return (x, y) => {
    if (x < 0 || y < 0 || x >= karte.width || y >= karte.height) return false;
    const k = `${x},${y}`;
    const figur = gesperrt.has(k) && !ohneFiguren.has(k);
    return !gesperrt.has(k) || (mitten.has(k) && !figur);
  };
}
