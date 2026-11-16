/**
 * Form eines Möbels auf der Karte: Drehung, Spiegelung und Maßstab aus dem Karteneditor.
 *
 * Warum: Der Autor dreht, spiegelt und skaliert Bilder im Karteneditor (werkzeuge/karteneditor/,
 * Wunsch des Autors, 15.11.2026). Der Kartenbau schreibt das als Eigenschaften `drehung`,
 * `spiegeln` und `massstab` an das Möbelobjekt (nur wenn gesetzt; alte Karten bleiben gleich).
 * Rolle: Gleiche Regel wie pipeline/abenteuer/objektform.py; moebel.ts zeichnet damit, begehbar.ts
 * und ankunft.ts rechnen Kollision und Verdeckung mit der geformten Größe.
 * Regeln: Maßstab, dann Spiegeln (waagrecht), dann Drehung im Uhrzeigersinn um die Bildmitte. Das
 * Objekt in Tiled nennt die linke obere Ecke des gedrehten Rechtecks. Bei 90 und 270 Grad tauschen
 * Breite und Höhe; eine eigene `maske` dreht mit, mit Maßstab gilt die Standardregel,
 * `frei_unten` gilt nur ungedreht.
 * Beispiel: Sofa 64 × 32 mit drehung 90 → Rechteck 32 × 64, Kollision in 2 Spalten.
 * Zuschnitt (Editor 1.5, moebelzuschnitt.ts): wirkt vor allem anderen; beschnitten trägt das Möbel
 * immer eine Maske im Raster des Ausschnitts.
 */
import {
  beschnitten,
  standardmaske,
  zuschnittAus,
  zuschnittRaster,
  type Zuschnitt,
} from "./moebelzuschnitt";

/** Die Form eines Möbels; ohne Eigenschaften die neutrale Form. */
export interface Moebelform {
  readonly drehung: number;
  readonly spiegeln: boolean;
  readonly massstab: number;
  /** Pixel links, oben, rechts, unten des Katalogbilds, die wegfallen (Karteneditor 1.5). */
  readonly zuschnitt?: Zuschnitt;
}

/** Was die Form an einer Möbelangabe ändert (Größe, Maske, freie Reihen). */
export interface Formbare {
  readonly breite: number;
  readonly hoehe: number;
  readonly frei_unten?: number;
  readonly maske?: readonly string[];
}

const KACHEL = 16;
const NEUTRAL: Moebelform = { drehung: 0, spiegeln: false, massstab: 1 };

/** Liest die Form aus den Tiled-Eigenschaften eines Objekts. */
export function formAus(
  eigenschaften: readonly { readonly name?: string; readonly value?: unknown }[] | undefined,
): Moebelform {
  const wert = (n: string) => eigenschaften?.find((e) => e.name === n)?.value;
  const drehung = wert("drehung");
  const massstab = wert("massstab");
  const zuschnitt = zuschnittAus(wert("zuschnitt"));
  return {
    drehung: typeof drehung === "number" ? ((drehung % 360) + 360) % 360 : 0,
    spiegeln: wert("spiegeln") === true,
    massstab: typeof massstab === "number" && massstab > 0 ? massstab : 1,
    ...(zuschnitt ? { zuschnitt } : {}),
  };
}

/** Ob eine Form etwas ändert. */
export function hatForm(form: Moebelform): boolean {
  return (
    form.drehung !== NEUTRAL.drehung ||
    form.spiegeln ||
    form.massstab !== NEUTRAL.massstab ||
    form.zuschnitt !== undefined
  );
}

/** Größe nach Maßstab und Drehung (Breite und Höhe schon beschnitten). Beispiel: 64 × 32, drehung 90 → [32, 64]. */
export function wirksameGroesse(breite: number, hoehe: number, form: Moebelform): [number, number] {
  const b = Math.max(1, Math.round(breite * form.massstab));
  const h = Math.max(1, Math.round(hoehe * form.massstab));
  return form.drehung % 180 === 90 ? [h, b] : [b, h];
}

/** Maske gespiegelt, dann im Uhrzeigersinn gedreht. Beispiel: ["#.", ".."], 90 → [".#", ".."]. */
export function dreheMaske(
  maske: readonly string[],
  spalten: number,
  reihen: number,
  drehung: number,
  spiegeln: boolean,
): string[] {
  let raster: string[] = [];
  for (let y = 0; y < reihen; y++)
    raster.push((maske[y] ?? "").padEnd(spalten, ".").slice(0, spalten));
  if (spiegeln) raster = raster.map((z) => [...z].reverse().join(""));
  for (let n = 0; n < Math.floor(drehung / 90); n++) {
    const alt = raster;
    raster = [...(alt[0] ?? "")].map((_, x) =>
      alt.map((_z, y) => alt[alt.length - 1 - y]?.[x] ?? ".").join(""),
    );
  }
  return raster;
}

/** Die Angabe so, wie das Möbel in seiner Form liegt (Größe, Maske, freie Reihen). */
export function geformt<T extends Formbare>(angabe: T, form: Moebelform): T {
  if (!hatForm(form)) return angabe;
  if (form.zuschnitt) return geformtBeschnitten(angabe, form);
  const [breite, hoehe] = wirksameGroesse(angabe.breite, angabe.hoehe, form);
  const { maske, frei_unten: freiUnten, ...rest } = angabe;
  const spalten = Math.max(1, Math.floor(angabe.breite / KACHEL));
  const reihen = Math.max(1, Math.floor(angabe.hoehe / KACHEL));
  const neueMaske =
    maske && form.massstab === 1
      ? dreheMaske(maske, spalten, reihen, form.drehung, form.spiegeln)
      : undefined;
  return {
    ...rest,
    breite,
    hoehe,
    ...(neueMaske ? { maske: neueMaske } : {}),
    ...(freiUnten !== undefined && form.drehung === 0 ? { frei_unten: freiUnten } : {}),
  } as T;
}

/**
 * Beschnitten (moebelzuschnitt.ts): erst Ausschnitt und Maske, dann Maßstab, Spiegeln, Drehung. Die
 * Maske gilt im Raster des skalierten Ausschnitts (angefangene Kacheln zählen); mit Maßstab gilt
 * die Standardregel. Eine eigene Maske der Szene steht schon geformt an der Karte (geformtAusObjekt).
 * Beispiel: Zaun 64 × 32, zuschnitt [26, 0, 32, 0], drehung 90 → 32 × 6, Maske ["#."].
 */
function geformtBeschnitten<T extends Formbare>(roh: T, form: Moebelform): T {
  const angabe = form.zuschnitt ? beschnitten(roh, form.zuschnitt) : roh;
  const [breite, hoehe] = wirksameGroesse(angabe.breite, angabe.hoehe, form);
  const [b, h] = wirksameGroesse(angabe.breite, angabe.hoehe, {
    ...NEUTRAL,
    massstab: form.massstab,
  });
  const [spalten, reihen] = zuschnittRaster(b, h);
  const grund = (form.massstab === 1 ? angabe.maske : undefined) ?? standardmaske(spalten, reihen);
  const maske = dreheMaske(grund, spalten, reihen, form.drehung, form.spiegeln);
  return { ...angabe, breite, hoehe, maske } as T;
}

/** Trenner der Maskenreihen in der Tiled-Eigenschaft `maske` (pipeline/abenteuer/objektkollision.py). */
const REIHENTRENNER = "/";

/**
 * Die Angabe so, wie das Objekt auf der Karte liegt: Form aus den Eigenschaften und, falls gesetzt,
 * die eigene Maske der Szene (Eigenschaft `maske`, schon geformt, z. B. "#.../....").
 * Warum: Der Autor legt im Karteneditor je Stelle fest, welche Kacheln eines Bildes sperren
 * (Wunsch des Autors, 16.11.2026); der Kartenbau schreibt das nur an diese eine Stelle.
 * Beispiel: Sofa 64 × 32 mit maske "#.../...." sperrt nur die Kachel oben links.
 */
export function geformtAusObjekt<T extends Formbare>(
  angabe: T,
  eigenschaften: readonly { readonly name?: string; readonly value?: unknown }[] | undefined,
): T {
  const form = formAus(eigenschaften);
  const geformte = geformt(angabe, form);
  const maske = eigenschaften?.find((e) => e.name === "maske")?.value;
  return typeof maske === "string" ? { ...geformte, maske: maske.split(REIHENTRENNER) } : geformte;
}

/** Stufen der Deckkraft in Prozent (Karteneditor 1.5, pipeline/abenteuer/objektform.py). */
const DECKKRAFT_STUFEN: readonly number[] = [25, 50, 75, 100];
const VOLL = 100;

/**
 * Deckkraft eines Möbels als Faktor 0,25 bis 1 aus der Tiled-Eigenschaft `deckkraft` (Prozent).
 * Warum: Der Autor macht Bilder im Karteneditor in Stufen durchsichtig (Wunsch des Autors,
 * 16.11.2026); nur das Bild, die Kollision bleibt. Ohne oder ungültig: 1.
 * Beispiel: [{ name: "deckkraft", value: 50 }] → 0.5.
 */
export function deckkraftAus(
  eigenschaften: readonly { readonly name?: string; readonly value?: unknown }[] | undefined,
): number {
  const wert = eigenschaften?.find((e) => e.name === "deckkraft")?.value;
  return typeof wert === "number" && DECKKRAFT_STUFEN.includes(wert) ? wert / VOLL : 1;
}
