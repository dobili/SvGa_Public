/**
 * Regler auf menschlichen Quantilen (0.2.124, Entscheidung des Autors 23.10.2026): Eine Stufe
 * je Fehlerart oder blindem Fleck von −2 (5 % der Spieler machen das noch seltener) über 0 (Median)
 * bis 2 (95 %), dazu je zwei „unmenschliche“ Stufen ±3 und ±4 darüber hinaus.
 *
 * Rolle im Gesamtbild: Persönlichkeiten der Bots (engine/gegnerbau.ts) und später die Regler
 * eigener Gegner nennen Stufen statt freier Faktoren; der Faktor auf das Gewicht einer Art
 * (engine/wahlschritt.ts) folgt daraus und aus der Wertung des Bots, denn die Spanne der Menschen
 * ist je Band verschieden (engine/spielerbereiche-daten.ts). So bleibt jeder Bot innerhalb dessen,
 * was echte Spieler seiner Stärke tun, und die Regler sind vergleichbar: Stufe 2 heißt immer „so
 * oft wie die auffälligsten 5 %“.
 * Abhängigkeiten: engine/spielerbereiche-daten.ts.
 */
import { SPIELERBEREICHE } from "./spielerbereiche-daten";

export const STUFE_MIN = -4;
export const STUFE_MAX = 4;
/** Innerhalb dieser Stufen bewegt sich ein Mensch (5 bis 95 % der Spieler). */
export const MENSCHLICH_MIN = -2;
export const MENSCHLICH_MAX = 2;
/** Stelle der Quantile 5, 25, 50, 75, 95 % in der Tabelle für die Stufen −2 bis 2. */
const MITTE = 2;
/** Breite eines Bandes und Lage seiner Mitte. */
const HALBES_BAND = 200;

export type Bereichsteil = "arten" | "flecken";

/** Die fünf Verhältnisse einer Art im Band; fehlt die Art, bleibt alles 1. */
function verhaeltnisse(teil: Bereichsteil, name: string, band: string): readonly number[] {
  return SPIELERBEREICHE[teil][band]?.[name] ?? [1, 1, 1, 1, 1];
}

/** Faktor aus den fünf Verhältnissen für eine Stufe; über 2 oder unter −2 geometrisch fortgesetzt. */
function faktorAusVerhaeltnissen(v: readonly number[], stufe: number): number {
  const s = Math.max(STUFE_MIN, Math.min(STUFE_MAX, stufe));
  const innen = Math.max(MENSCHLICH_MIN, Math.min(MENSCHLICH_MAX, s));
  const unten = Math.floor(innen);
  const oben = Math.ceil(innen);
  const a = v[MITTE + unten] ?? 1;
  const b = v[MITTE + oben] ?? 1;
  const basis = unten === oben ? a : a * (b / a) ** (innen - unten);
  if (s === innen) return basis;
  // Unmenschlich: je Stufe dasselbe Verhältnis wie vom 75- zum 95-%-Quantil (bzw. 25 → 5).
  const schritt =
    s > 0 ? (v[MITTE + 2] ?? 1) / (v[MITTE + 1] ?? 1) : (v[MITTE - 2] ?? 1) / (v[MITTE - 1] ?? 1);
  return basis * schritt ** Math.abs(s - innen);
}

/**
 * Der Faktor auf das Gewicht einer Fehlerart oder eines Flecks für eine Stufe und Wertung; zwischen
 * den Bandmitten linear, außen festgehalten.
 * Beispiel: „verfruehteDame“, Stufe 2, Wertung 1300 → etwa 2,4 (die auffälligsten 5 % der
 * 1200er stellen die Dame 2,4-mal so oft früh heraus wie der Median); Stufe 0 → 1; Stufe −2 →
 * etwa 0,1. Sonderfall: unbekannte Art → 1.
 */
export function faktorFuerStufe(
  teil: Bereichsteil,
  name: string,
  stufe: number,
  wertung: number,
): number {
  const baender = Object.keys(SPIELERBEREICHE[teil])
    .map(Number)
    .sort((x, y) => x - y);
  const mitten = baender.map((b) => b + HALBES_BAND);
  const erste = mitten[0] ?? 0;
  const letzte = mitten[mitten.length - 1] ?? 0;
  const faktor = (i: number) =>
    faktorAusVerhaeltnissen(verhaeltnisse(teil, name, String(baender[i])), stufe);
  if (wertung <= erste) return faktor(0);
  if (wertung >= letzte) return faktor(mitten.length - 1);
  const i = mitten.findIndex((m) => m > wertung);
  const [m0, m1] = [mitten[i - 1] ?? erste, mitten[i] ?? letzte];
  const t = (wertung - m0) / (m1 - m0);
  return faktor(i - 1) * (faktor(i) / faktor(i - 1)) ** t;
}
