/**
 * Wo und in welcher Tiefe eine sitzende Figur auf ihrem Sitzmöbel erscheint (reine Regeln ohne
 * Phaser, getestet in sitzplatz.test.ts; dieselbe Regel in pipeline/abenteuer/sitzplatz.py für
 * die Vorschaubilder, damit Vorschau und Spiel gleich aussehen).
 *
 * Warum: Figuren stehen mit den Füßen am unteren Rand ihrer Kachel. Ein Stuhl von LimeZu ist aber
 * 16 × 32 groß und zeichnet nur die oberen 22 Pixel; dazu tragen Stühle in der Szene oft einen
 * Feinschub (`versatz`, im Clubraum von Maple Falls [5, 5]) oder einen Maßstab. Die Figur saß
 * dadurch neben dem Stuhl unter seiner Lehne (Clubraum) oder stand ganz unter ihm (Terrasse vor dem
 * Whitlock-Haus, Calloway und Owen; Spieltest Variante B, 16.11.2026, F2). Jetzt rückt die Figur
 * mit den Füßen an die sichtbare Unterkante ihres Sitzmöbels, waagerecht auf seine sichtbare Mitte,
 * und liegt in der Tiefe knapp darüber, auch von hinten gesehen (Schüler der Akademie in Silicon
 * Bay vor ihren Stühlen mit hoher Lehne: dahinter sah man nur noch die Haare).
 * Lange Bänke und Sofas (mehr als eine Kachel breit oder zwei hoch) tragen mehrere Leute: Dort
 * übernimmt die Figur nur den Feinschub des Möbels gegen das Raster.
 *
 * Rolle im Gesamtbild: gelesen von figurenaufstellung.ts (Figuren) und belebungsschicht.ts
 * (Statisten), gezeichnet über figurensitz.ts; den sichtbaren Umriss misst sitzumriss.ts.
 * Abhängigkeiten: moebel.ts (Typen), zeichentiefe.ts.
 */
import type { Moebel } from "./moebel";
import { moebeltiefe } from "./zeichentiefe";

/** Arten im Möbelkatalog, auf denen man sitzt (wie SITZMOEBEL in pipeline/abenteuer/kartenregeln.py). */
export const SITZARTEN: readonly string[] = ["stuhl", "bank", "sessel", "sofa", "hocker", "couch"];

/** So weit liegt eine Sitzende in der Tiefe über ihrem Möbel: weniger als ein Pixel. */
export const SITZ_TIEFENABSTAND = 0.5;

/** Grad im halben Kreis (Umrechnung der Drehung ins Bogenmaß). */
const HALBKREIS_GRAD = 180;
/** Auf so viele Teile werden Sinus und Kosinus der Drehung gerundet. */
const WINKEL_GENAUIGKEIT = 1e6;

/** Ein Rechteck in Kartenpixeln (linke obere Ecke, Breite, Höhe). */
export interface Umriss {
  readonly x: number;
  readonly y: number;
  readonly breite: number;
  readonly hoehe: number;
}

/** Ein Sitzmöbel der Karte in Kartenpixeln: ganzes Rechteck, sichtbarer Teil, Zeichentiefe. */
export interface Sitzmoebel extends Umriss {
  readonly name: string;
  readonly tiefe: number;
  /** Was das Bild wirklich zeigt (ohne durchsichtigen Rand); ohne Angabe das ganze Rechteck. */
  readonly sichtbar?: Umriss;
}

/** Wie eine Sitzende gezeichnet wird: Verschiebung des Bildes in Kartenpixeln und Tiefe. */
export interface Sitzlage {
  readonly dx: number;
  readonly dy: number;
  readonly tiefe: number;
}

/** Drehung, Spiegelung und Maßstab eines Möbelbilds um seine Mitte (moebelform.ts). */
export interface Bildlage {
  readonly mitteX: number;
  readonly mitteY: number;
  readonly massstab: number;
  readonly spiegeln: boolean;
  readonly drehung: number;
}

/**
 * Ist ein Möbel ein Sitzplatz? Nach der Art im Katalog; ohne Art nach dem Namen.
 * Beispiel: art „stuhl“ → ja; „cc4StuhlVorn“ ohne Art → ja; art „gebaeude“ namens „Bank“ → nein.
 */
export function istSitzmoebel(name: string, art?: string): boolean {
  if (art !== undefined) return SITZARTEN.includes(art);
  const klein = name.toLowerCase();
  return SITZARTEN.some((wort) => klein.includes(wort));
}

/**
 * Die Sitzmöbel einer Karte mit ihrer Zeichentiefe (moebeltiefe, wie beim Aufstellen).
 * `sichtbarVon` liefert den sichtbaren Umriss eines Möbels in Kartenpixeln (sitzumriss.ts, misst
 * das Bild) oder null; ohne sie gilt das ganze Rechteck.
 */
export function sitzmoebelAus(
  moebel: readonly Moebel[],
  kachel: number,
  sichtbarVon: (m: Moebel) => Umriss | null = () => null,
): Sitzmoebel[] {
  return moebel
    .filter((m) => istSitzmoebel(m.name, m.angabe.art))
    .map((m) => {
      const sichtbar = sichtbarVon(m);
      return {
        name: m.name,
        x: m.x,
        y: m.y,
        breite: m.angabe.breite,
        hoehe: m.angabe.hoehe,
        tiefe: moebeltiefe(m, kachel),
        ...(sichtbar ? { sichtbar } : {}),
      };
    });
}

/**
 * Sichtbarer Umriss eines Möbelbilds in Kartenpixeln aus dem Umriss im Rahmen (Pixel ohne
 * durchsichtigen Rand) und der Lage des Bildes. Ohne `lage` liegt der Rahmen ungedreht bei (x, y).
 * Mit `lage` (Form aus dem Karteneditor) wie Phaser: Maßstab, Spiegeln, dann Drehung im
 * Uhrzeigersinn um die Mitte. Beispiel: Rahmen 16 × 32, Umriss 3, 1, 12 × 21 bei (85, 117) →
 * 88, 118, 12 × 21; gespiegelt um die Mitte (93, 133) → 86, 118, 12 × 21.
 */
export function umrissInWelt(
  rahmen: Umriss,
  rahmenBreite: number,
  rahmenHoehe: number,
  ecke: { readonly x: number; readonly y: number },
  lage?: Bildlage,
): Umriss {
  if (!lage) return { ...rahmen, x: ecke.x + rahmen.x, y: ecke.y + rahmen.y };
  const winkel = (lage.drehung * Math.PI) / HALBKREIS_GRAD;
  // Gerundet, damit 90 Grad genau 0 und 1 ergeben (sonst bleibt ein Rest von 6 · 10⁻¹⁷).
  const glatt = (wert: number) => Math.round(wert * WINKEL_GENAUIGKEIT) / WINKEL_GENAUIGKEIT;
  const [cos, sin] = [glatt(Math.cos(winkel)), glatt(Math.sin(winkel))];
  const punkte = [
    [rahmen.x, rahmen.y],
    [rahmen.x + rahmen.breite, rahmen.y],
    [rahmen.x, rahmen.y + rahmen.hoehe],
    [rahmen.x + rahmen.breite, rahmen.y + rahmen.hoehe],
  ].map(([px = 0, py = 0]) => {
    const x = (px - rahmenBreite / 2) * lage.massstab * (lage.spiegeln ? -1 : 1);
    const y = (py - rahmenHoehe / 2) * lage.massstab;
    return [lage.mitteX + x * cos - y * sin, lage.mitteY + x * sin + y * cos] as const;
  });
  const xs = punkte.map(([x]) => x);
  const ys = punkte.map(([, y]) => y);
  const [links, oben] = [Math.min(...xs), Math.min(...ys)];
  return { x: links, y: oben, breite: Math.max(...xs) - links, hoehe: Math.max(...ys) - oben };
}

/**
 * Das Sitzmöbel unter einem Feld: das kleinste, dessen Rechteck die Mitte des Feldes enthält;
 * sonst null. Beispiel: Sam auf (5, 8), Schulstuhl bei x 85, y 117, 16 × 32 → dieser Stuhl.
 */
export function findeSitz(
  sitze: readonly Sitzmoebel[],
  feld: { readonly x: number; readonly y: number },
  kachel: number,
): Sitzmoebel | null {
  const mx = feld.x * kachel + kachel / 2;
  const my = feld.y * kachel + kachel / 2;
  const treffer = sitze.filter(
    (s) => mx >= s.x && mx < s.x + s.breite && my >= s.y && my < s.y + s.hoehe,
  );
  treffer.sort((a, b) => a.breite * a.hoehe - b.breite * b.hoehe);
  return treffer[0] ?? null;
}

/** Rest einer Lage gegen das Kachelraster, zwischen −K/2 (ausschließlich) und K/2. */
function rasterrest(wert: number, kachel: number): number {
  const rest = wert - Math.round(wert / kachel) * kachel;
  return rest <= -kachel / 2 ? rest + kachel : rest;
}

/** Auf ±K begrenzt: Eine Sitzende rückt höchstens eine Kachel von ihrem Feld weg. */
function begrenzt(wert: number, kachel: number): number {
  return Math.round(Math.max(-kachel, Math.min(kachel, wert)));
}

/**
 * Lage und Tiefe einer Sitzenden auf ihrem Möbel (siehe Dateikopf).
 * Waagerecht: auf einem Möbel von höchstens einer Kachel Breite auf die sichtbare Mitte, sonst der
 * Feinschub gegen das Raster. Senkrecht: auf einem Möbel von höchstens zwei Kacheln Höhe die Füße an
 * die sichtbare Unterkante, sonst der Feinschub. Tiefe: knapp über dem Möbel.
 * Beispiel: Sam (5, 8) auf dem Schulstuhl bei x 85, y 117, sichtbar 88–100 × 118–139
 * (Tiefe 141) → dx 6, dy −5, Tiefe 141,5. Calloway (4, 31) auf dem Stuhl bei (64, 480), sichtbar bis
 * y 502 → dy −10.
 */
export function sitzlage(
  sitz: Sitzmoebel,
  feld: { readonly x: number; readonly y: number },
  kachel: number,
): Sitzlage {
  const s = sitz.sichtbar ?? sitz;
  const mitte = feld.x * kachel + kachel / 2;
  const fuss = (feld.y + 1) * kachel;
  const waagerecht =
    sitz.breite <= kachel ? s.x + s.breite / 2 - mitte : rasterrest(sitz.x, kachel);
  const senkrecht = sitz.hoehe <= 2 * kachel ? s.y + s.hoehe - fuss : rasterrest(sitz.y, kachel);
  const tiefe = sitz.tiefe + SITZ_TIEFENABSTAND;
  return { dx: begrenzt(waagerecht, kachel), dy: begrenzt(senkrecht, kachel), tiefe };
}

/**
 * Lage einer Sitzenden auf einem Feld, falls dort ein Sitzmöbel steht; sonst null (dann bleibt
 * alles wie bisher: Kachelmitte, Tiefe der Fußlinie).
 */
export function sitzlageAuf(
  sitze: readonly Sitzmoebel[],
  feld: { readonly x: number; readonly y: number },
  kachel: number,
): Sitzlage | null {
  const sitz = findeSitz(sitze, feld, kachel);
  return sitz ? sitzlage(sitz, feld, kachel) : null;
}
