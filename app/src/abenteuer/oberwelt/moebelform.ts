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
 */

/** Die Form eines Möbels; ohne Eigenschaften die neutrale Form. */
export interface Moebelform {
  readonly drehung: number;
  readonly spiegeln: boolean;
  readonly massstab: number;
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
  return {
    drehung: typeof drehung === "number" ? ((drehung % 360) + 360) % 360 : 0,
    spiegeln: wert("spiegeln") === true,
    massstab: typeof massstab === "number" && massstab > 0 ? massstab : 1,
  };
}

/** Ob eine Form etwas ändert. */
export function hatForm(form: Moebelform): boolean {
  return form.drehung !== NEUTRAL.drehung || form.spiegeln || form.massstab !== NEUTRAL.massstab;
}

/** Größe nach Maßstab und Drehung. Beispiel: 64 × 32, drehung 90 → [32, 64]. */
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
  const geformte = geformt(angabe, formAus(eigenschaften));
  const maske = eigenschaften?.find((e) => e.name === "maske")?.value;
  return typeof maske === "string" ? { ...geformte, maske: maske.split(REIHENTRENNER) } : geformte;
}
