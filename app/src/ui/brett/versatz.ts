/**
 * Seitlicher Versatz für Pfeile, die auf derselben Linie übereinanderliegen.
 *
 * Rolle im Gesamtbild: Brett.tsx verschiebt solche Pfeile leicht quer zur Richtung, damit jeder
 * sichtbar bleibt. Die Buchdaten bleiben unverändert; es ist nur Darstellung. Wunsch des Autors
 * nach dem Handytest vom 14.10.2026: In Abb. 1.26 deckte der Pfeil b6–d4 (Dame in Batterie hinter
 * c5) den Pfeil c5–d4 ganz zu.
 * Abhängigkeiten: keine.
 */

/** Start- und Zielfeld eines Pfeils, etwa { von: "b6", nach: "d4" }. */
export interface Pfeilweg {
  readonly von: string;
  readonly nach: string;
}

interface Strecke {
  /** Richtung in Feldschritten, gekürzt und mit fester Ausrichtung (erstes Glied positiv). */
  readonly richtung: readonly [number, number];
  /** +1, wenn der Pfeil in Richtung zeigt, sonst −1. */
  readonly sinn: number;
  /** Lage der Geraden: Kreuzprodukt eines Punktes mit der Richtung. */
  readonly gerade: number;
  readonly anfang: number;
  readonly ende: number;
}

const LINIEN = "abcdefgh";

function ggt(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : ggt(b, a % b);
}

function koordinaten(feld: string): [number, number] {
  return [LINIEN.indexOf(feld.charAt(0)), Number(feld.charAt(1))];
}

/** Beschreibt einen Pfeil als Abschnitt auf einer Geraden des Brettes. */
function alsStrecke(pfeil: Pfeilweg): Strecke | null {
  const [x1, y1] = koordinaten(pfeil.von);
  const [x2, y2] = koordinaten(pfeil.nach);
  const teiler = ggt(x2 - x1, y2 - y1);
  if (teiler === 0) return null;
  let rx = (x2 - x1) / teiler;
  let ry = (y2 - y1) / teiler;
  const sinn = rx > 0 || (rx === 0 && ry > 0) ? 1 : -1;
  rx *= sinn;
  ry *= sinn;
  const t1 = x1 * rx + y1 * ry;
  const t2 = x2 * rx + y2 * ry;
  return {
    richtung: [rx, ry],
    sinn,
    gerade: x1 * ry - y1 * rx,
    anfang: Math.min(t1, t2),
    ende: Math.max(t1, t2),
  };
}

/** Liegen zwei Pfeile auf derselben Geraden und teilen sich ein Stück? */
function ueberlappen(a: Strecke, b: Strecke): boolean {
  return (
    a.richtung[0] === b.richtung[0] &&
    a.richtung[1] === b.richtung[1] &&
    a.gerade === b.gerade &&
    Math.min(a.ende, b.ende) - Math.max(a.anfang, b.anfang) > 0
  );
}

/** Fasst Pfeile zu Gruppen zusammen, die sich (auch über andere) überdecken. */
function gruppen(strecken: readonly (Strecke | null)[]): number[][] {
  const gruppeVon = strecken.map((_, index) => index);
  const wurzel = (index: number): number =>
    gruppeVon[index] === index ? index : wurzel(gruppeVon[index] ?? index);
  strecken.forEach((a, i) => {
    strecken.forEach((b, j) => {
      if (j > i && a && b && ueberlappen(a, b)) gruppeVon[wurzel(j)] = wurzel(i);
    });
  });
  const ergebnis = new Map<number, number[]>();
  strecken.forEach((_, index) => {
    const schluessel = wurzel(index);
    ergebnis.set(schluessel, [...(ergebnis.get(schluessel) ?? []), index]);
  });
  return [...ergebnis.values()];
}

/**
 * Versatz jedes Pfeils quer zu seiner Richtung, in Vielfachen von ``abstand``.
 *
 * Eingaben: Pfeile in Zeichenreihenfolge, Abstand zweier Nachbarpfeile.
 * Ausgabe: je Pfeil der Versatz (0 für Pfeile, die nichts überdecken). Überdeckende Pfeile
 * werden gleichmäßig um die gemeinsame Gerade verteilt, zwei also je einen halben Abstand.
 * Beispiel aus dem Buch: Abb. 1.26, b6–d4 und c5–d4 → ±abstand/2; c6–d4 bleibt bei 0.
 * Sonderfälle: Gegenläufige Pfeile auf derselben Strecke werden ebenfalls getrennt; der
 * Versatz bezieht sich auf die Querrichtung des jeweiligen Pfeils (links in Zeigerichtung).
 */
export function querversaetze(pfeile: readonly Pfeilweg[], abstand: number): number[] {
  const strecken = pfeile.map(alsStrecke);
  const versaetze = pfeile.map(() => 0);
  for (const gruppe of gruppen(strecken)) {
    if (gruppe.length < 2) continue;
    const mitte = (gruppe.length - 1) / 2;
    gruppe.forEach((index, rang) => {
      const sinn = strecken[index]?.sinn ?? 1;
      versaetze[index] = (rang - mitte) * abstand * sinn;
    });
  }
  return versaetze;
}
