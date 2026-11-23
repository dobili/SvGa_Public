/**
 * Vordergrund von Sitz- und Liegemöbeln (Wunsch des Autors, 23.11.2026): Wer sitzt oder liegt, wird
 * vom vorderen Teil seines Möbels verdeckt. Das Möbelbild wird dafür ein zweites Mal über die Figur
 * gezeichnet, aber nur ein Ausschnitt davon:
 * - Sitzen (Stuhl, Hocker, Bank, Sessel, Sofa): alles unterhalb der Sitzflächen-Vorderkante, also
 *   Vorderkante und Beine (und von hinten gesehen die Lehne). Wer zum Betrachter schaut („unten“),
 *   bekommt keinen Vordergrund: Seine Füße baumeln vor dem Möbel.
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
/** Anteil der Bettbreite an der Kopfseite, der frei bleibt (Kopf und Kissen). */
export const VORGABE_KOPF = 0.3;
/** So weit liegt der Vordergrund in der Tiefe über der Figur (weniger als der Sitzabstand). */
export const VORDERGRUND_ABSTAND = 0.25;
/** Ein Anteil von 1 oder mehr: kein Vordergrund. */
const GANZ = 1;

/**
 * Ausschnitt (im Rahmen des Möbelbilds), der eine Sitzende verdeckt, oder null.
 * Beispiel: Stuhl, sichtbar 3, 1, 12 × 21, Blick „oben“ → ab Zeile 1 + 21 × 0,55 = 13 bis 22.
 */
export function sitzausschnitt(
  sichtbar: Umriss,
  art: string | undefined,
  richtung: Richtung,
  angabe?: Vordergrundangabe,
): Umriss | null {
  if (richtung === "unten") return null;
  const ab = angabe?.ab ?? (art ? VORGABE_AB[art] : undefined) ?? VORGABE_AB_SONST;
  if (ab >= GANZ) return null;
  const oben = Math.round(sichtbar.y + sichtbar.hoehe * ab);
  const unten = sichtbar.y + sichtbar.hoehe;
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
  readonly angabe?: Vordergrundangabe;
  /** Sichtbarer Teil im Rahmen (sitzumriss.ts), oder null. */
  readonly sichtbar: () => Umriss | null;
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
  const seite = kopfseiteDesBetts(eintrag.name, false) ?? vorgabe;
  const ausschnitt = bettausschnitt(sichtbar, seite, eintrag.angabe);
  figur.setData(DECKE, legeAusschnitt(eintrag, ausschnitt, figur.depth + VORDERGRUND_ABSTAND));
}

/**
 * Legt den Vordergrund eines Sitzmöbels (Lage aus sitzplatz.ts) über eine Sitzende oder ein
 * ruhendes Tier: Ausschnitt nach sitzausschnitt, Tiefe knapp über der Sitzenden. Ausgabe: das Bild
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
  const ausschnitt = sitzausschnitt(sichtbar, eintrag.art, richtung, eintrag.angabe);
  return legeAusschnitt(eintrag, ausschnitt, lage.tiefe + VORDERGRUND_ABSTAND);
}
