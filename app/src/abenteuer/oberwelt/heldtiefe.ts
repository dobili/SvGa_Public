/**
 * Zeichentiefe des Helden gegenüber Gebäuden, Zäunen und anderen festen Möbeln (Befund des Autors,
 * 25.11.2026: „Wenn ich an Häuser herantrete, verschwinde ich hinter dem Haus“).
 *
 * Warum: Jedes Möbel hat eine einzige Zeichentiefe (zeichentiefe.ts, Mitte seiner untersten
 * gesperrten Kachelreihe), der Held die Höhe seines Fußpunkts. Das stimmt vor und hinter einem
 * Möbel, aber nicht daneben: Zwischen den Villen in Maple Falls läuft der Held durch eine Lücke von
 * einer Kachel, neben einem Zaunpfahl mit feiner Maske steht er in derselben Kachel. Sein Fuß liegt
 * dort höher als die Tiefe des Nachbarn, und das Bild des Nachbarn deckte die halbe Figur zu.
 * Regel: Der Held steht hinter einem Möbel, wenn eine gesperrte Zelle dieses Möbels in seinen
 * Spalten tiefer reicht als sein Fuß (das Möbel steht zwischen ihm und dem Betrachter) oder wenn er
 * ganz nördlich der gesperrten Fläche steht (hinter einer Zaunreihe, schräg hinter einer Hausecke).
 * Sonst steht er davor oder daneben und wird über dem Möbel gezeichnet. Die Tiefe des Helden bleibt
 * sein Fußpunkt, solange das schon stimmt; sonst rückt sie knapp über die Möbel, vor denen er steht,
 * und bleibt unter denen, hinter denen er steht.
 * Bäume (Krone über dem Stamm) und Möbel ohne Kollision behalten die einfache Regel: Neben dem
 * Stamm unter der Krone gehört der Held unter die Krone.
 * Abhängigkeiten: begehbar.ts (sperreMoebel), feinsperren.ts (Zellen), zeichentiefe.ts.
 * Beispiel: Zaunpfahl (160, 320) mit Tiefe 328, Held daneben auf (168, 326): keine Sperrzelle des
 * Pfahls in seinen Spalten → Tiefe knapp über 328 statt 326.
 */
import { sperreMoebel, type Sperrangabe } from "./begehbar";
import { ZELLEN } from "./feinsperren";
import type { Moebel } from "./moebel";
import { moebeltiefe } from "./zeichentiefe";

/** Halbe Breite des Heldenkörpers (12 von 16 Pixeln, figurbilder.ts) in Pixeln. */
const KOERPER_HALB = 6;
/** So knapp rückt der Held über oder unter eine Möbeltiefe (kleiner als jeder Pixelschritt). */
const KNAPP = 0.01;
/** Arten, für die die einfache Regel bleibt (Krone über dem Stamm). */
const OHNE_SEITENREGEL = new Set(["baum"]);

/** Ein Rechteck in Weltpixeln. */
export interface Bildrechteck {
  readonly x: number;
  readonly y: number;
  readonly breite: number;
  readonly hoehe: number;
}

/** Was die Regel von einem Möbel braucht: Tiefe, Bild und je Zellspalte die unterste Sperre. */
export interface Tiefenmoebel {
  readonly name: string;
  readonly tiefe: number;
  readonly bild: Bildrechteck;
  /** Zellspalte (4 Pixel) → Unterkante der untersten gesperrten Zelle in Pixeln. */
  readonly unterkante: ReadonlyMap<number, number>;
  /** Oberkante der obersten gesperrten Zelle in Pixeln. */
  readonly oberkante: number;
}

/** Ein Möbel, so weit die Regel es braucht (moebel.ts, Moebel; im Test aus der Karte gebaut). */
export interface Tiefenquelle {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly angabe: Sperrangabe & { readonly art?: string };
  readonly kollision?: boolean;
  readonly tiefe: number;
}

/**
 * Baut die Angaben für die Regel; nur feste Möbel mit gesperrten Zellen, ohne Bäume.
 * Beispiel: Zaunseite 16 × 16 mit feiner Maske (Pfahl in der Mitte) → Unterkanten nur in den
 * Zellspalten des Pfahls.
 */
export function tiefenmoebel(quellen: readonly Tiefenquelle[], kachel: number): Tiefenmoebel[] {
  const zelle = kachel / ZELLEN;
  const ergebnis: Tiefenmoebel[] = [];
  for (const q of quellen) {
    if (!(q.kollision ?? q.angabe.kollision) || OHNE_SEITENREGEL.has(q.angabe.art ?? "")) continue;
    const zellen = new Set<string>();
    sperreMoebel(zellen, q, q.angabe, kachel, zelle);
    if (zellen.size === 0) continue;
    const unterkante = new Map<number, number>();
    let oberkante = Infinity;
    for (const k of zellen) {
      const [sx, sy] = k.split(",").map(Number) as [number, number];
      unterkante.set(sx, Math.max(unterkante.get(sx) ?? 0, (sy + 1) * zelle));
      oberkante = Math.min(oberkante, sy * zelle);
    }
    const bild = { x: q.x, y: q.y, breite: q.angabe.breite, hoehe: q.angabe.hoehe };
    ergebnis.push({ name: q.name, tiefe: q.tiefe, bild, unterkante, oberkante });
  }
  return ergebnis;
}

function schneiden(a: Bildrechteck, b: Bildrechteck): boolean {
  return a.x < b.x + b.breite && b.x < a.x + a.breite && a.y < b.y + b.hoehe && b.y < a.y + a.hoehe;
}

/**
 * Steht der Held (Fußpunkt x, y) hinter diesem Möbel? Ja, wenn sein Körper ganz nördlich der
 * gesperrten Fläche endet oder wenn in einer Zellspalte unter seinem Körper eine gesperrte Zelle
 * tiefer reicht als die Unterkante seines Körpers.
 */
export function stehtDahinter(m: Tiefenmoebel, x: number, y: number, kachel: number): boolean {
  const zelle = kachel / ZELLEN;
  const unten = y + KOERPER_HALB;
  if (unten <= m.oberkante) return true;
  for (let s = Math.floor((x - KOERPER_HALB) / zelle); s * zelle < x + KOERPER_HALB; s++) {
    if ((m.unterkante.get(s) ?? -Infinity) > unten) return true;
  }
  return false;
}

/** Ergebnis der Regel: die Tiefe und ob sich vor und hinter widersprachen. */
export interface Heldtiefe {
  readonly tiefe: number;
  readonly widerspruch: boolean;
}

/**
 * Die Zeichentiefe des Helden. Eingaben: Fußpunkt (x, y), das Rechteck seines Bildes, die Möbel.
 * Ausgabe: der Fußpunkt, wenn kein Möbel über ihm liegt, vor oder neben dem er steht; sonst knapp
 * über dem höchsten solchen Möbel und unter dem niedrigsten, hinter dem er steht. Die Regel hebt
 * nur, sie senkt nie: Ein Möbel, das schon unter dem Fußpunkt liegt, bleibt dort (sonst zöge ein
 * Pfeiler der Veranda den Helden hinter die ganze Villa). Widersprechen sich beide (hinter dem
 * Kaktus und zugleich neben dem Saloon, dessen Tiefe größer ist), bleibt der Fußpunkt wie bisher:
 * Was vor dem Helden steht, deckt ihn; `widerspruch` meldet den Fall für den Dauertest.
 */
export function heldtiefe(
  x: number,
  y: number,
  bild: Bildrechteck,
  moebel: readonly Tiefenmoebel[],
  kachel: number,
): Heldtiefe {
  // Nur heben, nie senken: Möbel, die schon unter dem Fußpunkt liegen, bleiben unten (wie bisher).
  let ueber = -Infinity;
  let unter = Infinity;
  for (const m of moebel) {
    if (m.tiefe < y || !schneiden(bild, m.bild)) continue;
    if (stehtDahinter(m, x, y, kachel)) unter = Math.min(unter, m.tiefe);
    else ueber = Math.max(ueber, m.tiefe);
  }
  if (ueber === -Infinity) return { tiefe: y, widerspruch: false };
  if (ueber >= unter) return { tiefe: y, widerspruch: true };
  return { tiefe: Math.min(ueber + KNAPP, (ueber + unter) / 2), widerspruch: false };
}

/** Die Angaben aus den Möbeln der Szene (moebel.ts) mit ihrer Zeichentiefe (zeichentiefe.ts). */
export function tiefenmoebelAus(moebel: readonly Moebel[], kachel: number): Tiefenmoebel[] {
  return tiefenmoebel(
    moebel.map((m) => ({ ...m, tiefe: moebeltiefe(m, kachel) })),
    kachel,
  );
}

/** Was die Szene vom Helden braucht (Phaser-Sprite, hier ohne Phaser). */
interface Heldbild {
  readonly x: number;
  readonly y: number;
  getBounds(): { x: number; y: number; width: number; height: number };
  setDepth(tiefe: number): unknown;
}

/** Setzt die Tiefe des Helden nach der Regel (szene.ts, jedes Bild). */
export function setzeHeldtiefe(
  held: Heldbild,
  moebel: readonly Tiefenmoebel[],
  kachel: number,
): void {
  const r = held.getBounds();
  const bild = { x: r.x, y: r.y, breite: r.width, hoehe: r.height };
  held.setDepth(heldtiefe(held.x, held.y, bild, moebel, kachel).tiefe);
}
