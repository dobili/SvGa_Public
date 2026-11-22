/**
 * Ruheplätze in der Welt (Spieluhr, Wunsch des Autors, 22.11.2026): An einer Bank bietet der
 * Aktionsknopf „Ausruhen“ (Warten bis Morgen, Mittag, Abend oder Nacht), am eigenen Bett im Zimmer
 * des Helden „Schlafen bis morgen“.
 *
 * Regel: Ein Möbel der Art `bank` (Katalog) oder, im Zimmer des Helden, der Art `bett`, dessen
 * Rechteck die Kachel des Helden oder die Kachel vor ihm berührt. Andere Betten (Hotel, Motel)
 * zählen nicht: Dort erzählt die Geschichte selbst vom Schlafen.
 * Rolle im Gesamtbild: reine Regel für useWarten.tsx. Abhängigkeiten: moebel.ts (Typ).
 */
import type { Moebel } from "./moebel";
import type { Richtung } from "./szene";

/** Was der Held an einem Ruheplatz tun kann. */
export type Ruhe = "ausruhen" | "schlafen";

/** Karte mit dem Bett des Helden. */
export const ZIMMER_DES_HELDEN = "mapleFalls.zimmer";
const VOR: Readonly<Record<Richtung, readonly [number, number]>> = {
  oben: [0, -1],
  unten: [0, 1],
  links: [-1, 0],
  rechts: [1, 0],
};

/** Berührt das Möbel die Kachel (kx, ky)? */
function beruehrt(m: Moebel, kx: number, ky: number, kachel: number): boolean {
  const x0 = kx * kachel;
  const y0 = ky * kachel;
  return (
    m.x < x0 + kachel &&
    x0 < m.x + m.angabe.breite &&
    m.y < y0 + kachel &&
    y0 < m.y + m.angabe.hoehe
  );
}

/**
 * Der Ruheplatz an der Kachel des Helden oder vor ihm, sonst null.
 * Eingaben: Möbel der Karte, Kennung der Karte, Kachel und Blick des Helden, Kachelgröße.
 * Beispiel: Held im Park vor einer Bank (Art „bank“) → „ausruhen“; in seinem Zimmer am Bett →
 * „schlafen“; am Bett im Motel → null.
 */
export function ruheplatz(
  moebel: readonly Moebel[],
  karte: string,
  held: { readonly x: number; readonly y: number; readonly richtung: Richtung },
  kachel: number,
): Ruhe | null {
  const [dx, dy] = VOR[held.richtung];
  const kacheln: readonly (readonly [number, number])[] = [
    [held.x, held.y],
    [held.x + dx, held.y + dy],
  ];
  const nah = moebel.filter((m) => kacheln.some(([x, y]) => beruehrt(m, x, y, kachel)));
  if (karte === ZIMMER_DES_HELDEN && nah.some((m) => m.angabe.art === "bett")) return "schlafen";
  return nah.some((m) => m.angabe.art === "bank") ? "ausruhen" : null;
}
