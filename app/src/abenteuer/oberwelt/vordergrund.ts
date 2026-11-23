/**
 * Vordergrund von Sitz- und Liegemöbeln (Wunsch des Autors, 23.11.2026): Wer sitzt oder liegt, wird
 * vom vorderen Teil seines Möbels verdeckt. Das Möbelbild wird dafür ein zweites Mal über die Figur
 * gezeichnet, aber nur ein Ausschnitt davon:
 * - Sitzen (Stuhl, Hocker, Bank, Sessel, Sofa), je nach Blick (Korrektur nach Fotos des Hauptchats,
 *   23.11.2026, Clubraum: seitlich deckte 0,55 den ganzen Rumpf):
 *   - „unten“ (zum Betrachter): nichts davor, die Füße baumeln vor dem Möbel.
 *   - „links“/„rechts“: nur, was UNTER der Sitzfläche liegt (Beine, Unterkante als 1-px-Kante). Die
 *     Figur sitzt auf der Sitzfläche, die Lehne steht hinter ihr; Rumpf und Oberschenkel bleiben
 *     frei. Die Grenze kommt aus den Pixeln (sitzunterkante), sonst VORGABE_SEITE.
 *   - „oben“ (Rücken zum Betrachter): die Lehne vor dem Rücken, ab dem Anteil `ab` (VORGABE_AB) der
 *     sichtbaren Höhe; der obere Teil der Lehne bleibt frei, damit der Kopf darüber ragt.
 * - Liegen im Bett: die Decke über die ganze Länge bis auf die Kopfseite; Kopf und Kissen bleiben
 *   frei.
 *
 * Warum so: Im Diner lag das Bild einer Sitzenden ganz über dem Tresenhocker; im Bett lag der Held auf
 * der Decke statt darunter. Ein zweites, beschnittenes Bild braucht keine eigenen Grafiken und gilt
 * für alle Möbel. Über einem leeren Möbel deckt sich der Ausschnitt mit dem Bild darunter und ist
 * unsichtbar; darum bleibt er stehen, wenn die Figur aufsteht (beim Bett wird er entfernt, weil seine
 * Tiefe an der Liegenden hängt).
 *
 * Die Grenze kommt aus dem sichtbaren Teil des Bildes (sitzumriss.ts): `ab` ist der Anteil der
 * sichtbaren Höhe von oben, ab dem der Vordergrund beginnt; `kopf` der Anteil der sichtbaren Breite,
 * der an der Kopfseite frei bleibt. Beides je Möbelart vorgegeben (VORGABE_AB, VORGABE_KOPF) und je
 * Möbel im Katalog oder an der Karte von Hand einstellbar (`vordergrund: { ab, kopf }`; ab 1 heißt:
 * kein Vordergrund).
 * Rolle im Gesamtbild: figurensitz.ts (Sitzende), fuehrungsschicht.ts (Liegende), moebel.ts merkt
 * sich die Bilder; dieselben Regeln rechnet pipeline/abenteuer/verdeckung.py für die Vorschau.
 */
import type Phaser from "phaser";
import type { Umriss } from "./sitzplatz";
import { kopfseiteDesBetts } from "./sitzrichtung";
import type { Richtung } from "./szene";

/** Einstellung im Katalog oder an der Karte (moebel.json, Eigenschaft `vordergrund`). */
export interface Vordergrundangabe {
  readonly ab?: number;
  /** Grenze bei seitlichem Blick als Anteil der sichtbaren Höhe (statt der gemessenen Unterkante). */
  readonly seite?: number;
  readonly kopf?: number;
}

/** Ab diesem Anteil der sichtbaren Höhe (von oben) verdeckt ein Sitzmöbel die Figur. */
export const VORGABE_AB: Readonly<Record<string, number>> = {
  stuhl: 0.55,
  hocker: 0.45,
  bank: 0.55,
  sessel: 0.6,
  sofa: 0.6,
  couch: 0.6,
};
/** Ohne bekannte Art (nur am Namen erkannt). */
export const VORGABE_AB_SONST = 0.55;
/** Seitlicher Blick ohne messbare Sitzfläche: ab diesem Anteil (etwa die Unterkante der Sitzfläche). */
export const VORGABE_SEITE = 0.8;
/** Eine Zeile zählt zur Sitzfläche, wenn mindestens dieser Anteil der sichtbaren Breite deckt. */
export const SITZFLAECHE_BREIT = 0.6;
/** So viele breite Zeilen hintereinander bilden eine Sitzfläche (eine Querstrebe ist nur eine). */
export const SITZFLAECHE_ZEILEN = 2;
/** Ab dieser Deckkraft (0–255) zählt ein Pixel (wie sitzumriss.ts). */
const DECKT_AB = 40;
/** Kanäle je Pixel (RGBA) und Lage der Deckkraft. */
const KANAELE = 4;
const DECKKRAFT = 3;
/** Anteil der Bettbreite an der Kopfseite, der frei bleibt (Kopf und Kissen). */
export const VORGABE_KOPF = 0.3;
/** So weit liegt der Vordergrund in der Tiefe über der Figur (weniger als der Sitzabstand). */
export const VORDERGRUND_ABSTAND = 0.25;
/** Ein Anteil von 1 oder mehr: kein Vordergrund. */
const GANZ = 1;

/** Zahl der deckenden Pixel einer Zeile innerhalb des sichtbaren Teils. */
function deckendeInZeile(daten: ArrayLike<number>, breite: number, y: number, s: Umriss): number {
  let zahl = 0;
  for (let x = s.x; x < s.x + s.breite; x += 1) {
    if ((daten[(y * breite + x) * KANAELE + DECKKRAFT] ?? 0) >= DECKT_AB) zahl += 1;
  }
  return zahl;
}

/**
 * Unterste Zeile der Sitzfläche im Rahmen, aus den Pixeln: von unten das erste Band aus mindestens
 * SITZFLAECHE_ZEILEN breiten Zeilen (SITZFLAECHE_BREIT der sichtbaren Breite), davon die unterste.
 * Warum ein Band: Eine Querstrebe zwischen den Beinen ist breit, aber nur eine Zeile hoch. Warum von
 * unten: Eine Bank von vorn hat oben eine breite Lehne; gemeint ist die Sitzfläche darunter.
 * Eingaben: RGBA-Daten des Rahmens, seine Breite, der sichtbare Teil. Ausgabe: Zeile oder null.
 * Beispiel: Schulstuhl von der Seite (Lehnenstange links, Sitzblock Zeilen 11 bis 13) → 13.
 */
export function sitzunterkante(
  daten: ArrayLike<number>,
  breite: number,
  sichtbar: Umriss,
): number | null {
  const noetig = sichtbar.breite * SITZFLAECHE_BREIT;
  let band = 0;
  for (let y = sichtbar.y + sichtbar.hoehe - 1; y >= sichtbar.y; y -= 1) {
    band = deckendeInZeile(daten, breite, y, sichtbar) >= noetig ? band + 1 : 0;
    if (band >= SITZFLAECHE_ZEILEN) return y + SITZFLAECHE_ZEILEN - 1;
  }
  return null;
}

/** Erste verdeckende Zeile bei seitlichem Blick: Katalog `seite`, gemessene Unterkante, Vorgabe. */
function seitengrenze(sichtbar: Umriss, angabe?: Vordergrundangabe, unterkante?: number | null) {
  if (angabe?.seite !== undefined) return Math.round(sichtbar.y + sichtbar.hoehe * angabe.seite);
  return unterkante ?? Math.round(sichtbar.y + sichtbar.hoehe * VORGABE_SEITE);
}

/**
 * Ausschnitt (im Rahmen des Möbelbilds), der eine Sitzende verdeckt, oder null (Regel je Blick im
 * Dateikopf). `unterkante` ist die gemessene unterste Zeile der Sitzfläche (sitzunterkante); sie
 * bleibt als 1-px-Kante im Ausschnitt.
 * Beispiel: Stuhl, sichtbar 3, 1, 12 × 21, Blick „oben“ → ab Zeile 1 + 21 × 0,55 = 13 bis 22;
 * Blick „rechts“ mit Unterkante 13 → Zeilen 13 bis 22, der Rumpf darüber bleibt frei.
 */
export function sitzausschnitt(
  sichtbar: Umriss,
  art: string | undefined,
  richtung: Richtung,
  angabe?: Vordergrundangabe,
  unterkante?: number | null,
): Umriss | null {
  const ab = angabe?.ab ?? (art ? VORGABE_AB[art] : undefined) ?? VORGABE_AB_SONST;
  if (richtung === "unten" || ab >= GANZ) return null;
  const oben =
    richtung === "oben"
      ? Math.round(sichtbar.y + sichtbar.hoehe * ab)
      : seitengrenze(sichtbar, angabe, unterkante);
  const unten = sichtbar.y + sichtbar.hoehe;
  if (oben >= unten) return null;
  return { x: sichtbar.x, y: oben, breite: sichtbar.breite, hoehe: unten - oben };
}

/**
 * Ausschnitt eines Betts (im Rahmen), der eine Liegende zudeckt: alles bis auf die Kopfseite.
 * `kopfseite` gilt im Rahmen, also vor einem Spiegeln (fuehrungsschicht.ts rechnet das um).
 * Beispiel: sichtbar 0, 4, 32 × 20, Kopf links → x 10 bis 32 (Kopf und Kissen frei).
 */
export function bettausschnitt(
  sichtbar: Umriss,
  kopfseite: "links" | "rechts",
  angabe?: Vordergrundangabe,
): Umriss | null {
  const anteil = angabe?.kopf ?? VORGABE_KOPF;
  if (anteil >= GANZ) return null;
  const frei = Math.round(sichtbar.breite * anteil);
  const x = kopfseite === "links" ? sichtbar.x + frei : sichtbar.x;
  return { x, y: sichtbar.y, breite: sichtbar.breite - frei, hoehe: sichtbar.hoehe };
}

/** Ein gemerktes Möbelbild mit Angaben für den Vordergrund. */
export interface Moebelbild {
  readonly bild: Phaser.GameObjects.Image;
  /** Name im Katalog (die Kopfseite eines Betts steht im Namen, sitzrichtung.ts). */
  readonly name: string;
  readonly art?: string;
  /** Katalogangabe `ende` (Kopfende eines Betts ohne Kopfseite im Namen). */
  readonly ende?: string;
  readonly angabe?: Vordergrundangabe;
  /** Sichtbarer Teil im Rahmen (sitzumriss.ts), oder null. */
  readonly sichtbar: () => Umriss | null;
  /** Unterste Zeile der Sitzfläche im Rahmen (sitzunterkante), oder null; für den seitlichen Blick. */
  readonly unterkante?: () => number | null;
}

const bilderJeSzene = new WeakMap<Phaser.Scene, Map<string, Moebelbild>>();

/** Schlüssel eines Möbels der Karte (Name und Lage). Beispiel: „Stuhl@85,117“. */
export function moebelschluessel(name: string, x: number, y: number): string {
  return `${name}@${x},${y}`;
}

/** Merkt sich das Bild eines Möbels (moebel.ts, stelleMoebelAuf). */
export function merkeMoebelbild(
  szene: Phaser.Scene,
  schluessel: string,
  eintrag: Moebelbild,
): void {
  const bilder = bilderJeSzene.get(szene) ?? new Map<string, Moebelbild>();
  bilder.set(schluessel, eintrag);
  bilderJeSzene.set(szene, bilder);
}

/** Das gemerkte Bild eines Möbels, oder undefined. */
export function moebelbild(szene: Phaser.Scene, schluessel: string): Moebelbild | undefined {
  return bilderJeSzene.get(szene)?.get(schluessel);
}

/**
 * Legt den Ausschnitt eines Möbelbilds als zweites Bild in der Tiefe `tiefe` darüber: gleiche Lage,
 * Drehung, Spiegelung und Deckkraft, nur beschnitten. Ausgabe: das neue Bild (oder null ohne
 * Ausschnitt).
 */
export function legeAusschnitt(
  eintrag: Moebelbild,
  ausschnitt: Umriss | null,
  tiefe: number,
): Phaser.GameObjects.Image | null {
  if (!ausschnitt || ausschnitt.breite <= 0 || ausschnitt.hoehe <= 0) return null;
  const { bild } = eintrag;
  const kopie = bild.scene.add.image(bild.x, bild.y, bild.texture.key, bild.frame.name);
  kopie
    .setOrigin(bild.originX, bild.originY)
    .setScale(bild.scaleX, bild.scaleY)
    .setFlipX(bild.flipX)
    .setAngle(bild.angle)
    .setAlpha(bild.alpha)
    .setCrop(ausschnitt.x, ausschnitt.y, ausschnitt.breite, ausschnitt.hoehe)
    .setDepth(tiefe);
  return kopie;
}

/** Datenschlüssel an der Figur: die Decke über der Liegenden. */
const DECKE = "bettdecke";
/** Betten erkennt man am Namen (wie fuehrungsschicht.ts). */
const BETT = /Bett/;

/** Das Bett unter einem Punkt der Karte (gemerktes Bild, dessen Fläche den Punkt enthält). */
export function bettUnter(szene: Phaser.Scene, x: number, y: number): Moebelbild | undefined {
  for (const eintrag of bilderJeSzene.get(szene)?.values() ?? []) {
    if (BETT.test(eintrag.name) && eintrag.bild.getBounds().contains(x, y)) return eintrag;
  }
  return undefined;
}

/**
 * Kopfseite des Betts unter (x, y) in der Welt (gespiegelt vertauscht), oder null ohne Bett oder
 * ohne Angabe. Beispiel: Oma Ruths iw5BettLila („ende: west“) → "links".
 */
export function kopfseiteUnter(
  szene: Phaser.Scene,
  x: number,
  y: number,
): "links" | "rechts" | null {
  const eintrag = bettUnter(szene, x, y);
  return eintrag ? kopfseiteDesBetts(eintrag.name, eintrag.bild.flipX, eintrag.ende) : null;
}

/** Entfernt die Decke über einer Figur (beim Aufstehen oder neuen Stellen). */
export function nimmDeckeWeg(figur: Phaser.GameObjects.Sprite): void {
  zerstoere(figur.getData(DECKE));
  figur.setData(DECKE, null);
}

/**
 * Entfernt ein gemerktes Zusatzbild (Decke, Sitzvordergrund), falls es eines ist. Ohne Laufzeitbezug
 * auf Phaser, damit reine Regeln wie sitzplatz.ts diese Datei in Tests ohne Browser laden können.
 */
export function zerstoere(bild: unknown): void {
  const zerstoerbar = bild as { destroy?: unknown } | null | undefined;
  if (typeof zerstoerbar?.destroy === "function")
    (zerstoerbar as { destroy: () => void }).destroy();
}

/**
 * Deckt eine Liegende zu: das Bettbild unter (x, y) ein zweites Mal über ihr, ohne die Kopfseite
 * (bettausschnitt). Die Kopfseite zählt im Rahmen, also vor dem Spiegeln; ohne Angabe im Namen gilt
 * `vorgabe` (wie beim Liegebild). Ohne Bett geschieht nichts. Beispiel: Held im Dachboden, Oma Ruth
 * im Tagesablauf.
 */
export function deckeZu(
  figur: Phaser.GameObjects.Sprite,
  x: number,
  y: number,
  vorgabe: "links" | "rechts",
): void {
  nimmDeckeWeg(figur);
  const eintrag = figur.scene ? bettUnter(figur.scene, x, y) : undefined;
  const sichtbar = eintrag?.sichtbar();
  if (!eintrag || !sichtbar) return;
  const seite = kopfseiteDesBetts(eintrag.name, false, eintrag.ende) ?? vorgabe;
  const ausschnitt = bettausschnitt(sichtbar, seite, eintrag.angabe);
  figur.setData(DECKE, legeAusschnitt(eintrag, ausschnitt, figur.depth + VORDERGRUND_ABSTAND));
}

/**
 * Legt den Vordergrund eines Sitzmöbels (Lage aus sitzplatz.ts) über eine Sitzende oder ein
 * ruhendes Tier (Blick „links“, also nur unter der Sitzfläche): Ausschnitt nach sitzausschnitt, Tiefe
 * knapp über der Sitzenden. Ausgabe: das Bild
 * oder null (kein Möbel, kein gemerktes Bild, Blick zum Betrachter).
 */
export function legeSitzausschnitt(
  szene: Phaser.Scene,
  lage: { readonly moebel?: string; readonly tiefe: number },
  richtung: Richtung,
): Phaser.GameObjects.Image | null {
  const eintrag = lage.moebel ? moebelbild(szene, lage.moebel) : undefined;
  const sichtbar = eintrag?.sichtbar();
  if (!eintrag || !sichtbar) return null;
  const unterkante = richtung === "oben" ? null : (eintrag.unterkante?.() ?? null);
  const ausschnitt = sitzausschnitt(sichtbar, eintrag.art, richtung, eintrag.angabe, unterkante);
  return legeAusschnitt(eintrag, ausschnitt, lage.tiefe + VORDERGRUND_ABSTAND);
}
