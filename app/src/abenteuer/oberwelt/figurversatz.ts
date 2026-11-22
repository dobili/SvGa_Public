/**
 * Feiner Versatz einer Figur (Wunsch des Autors, 22.11.2026: „Figuren in kleineren Schritten
 * verschiebbar … damit die Beine über die Sitzfläche herüberragen und nicht in die Sitzfläche
 * hinein“). Eine Figur der Szene trägt optional `versatz: [dx, dy]` in Kartenpixeln, wie die Möbel;
 * die Karte führt ihn als Eigenschaft „versatz“ („dx,dy“, pipeline/abenteuer/kartentiled.py).
 *
 * Nur Darstellung: Fußkachel, Kollision, Ansprechen und alle Prüfwerkzeuge bleiben beim Feld. Damit
 * niemand sichtbar in die Nachbarkachel rutscht, gilt höchstens eine halbe Kachel (±8 Pixel) je
 * Richtung; größere Werte werden begrenzt.
 * Rolle im Gesamtbild: reine Regel für ausloeserebene.ts (Lesen) und figurensitz.ts (Zeichnen).
 * Abhängigkeiten: keine.
 */

/** Höchstens so viele Kartenpixel weit darf das Bild einer Figur von ihrem Feld abrücken. */
export const VERSATZ_GRENZE = 8;

/** Versatz des Bildes in Kartenpixeln (rechts und unten positiv). */
export interface Bildversatz {
  readonly dx: number;
  readonly dy: number;
}

/** Ganze Pixel, auf ±VERSATZ_GRENZE begrenzt. Beispiel: 11.4 → 8; -3.6 → -4. */
export function begrenzt(wert: number): number {
  const ganz = Math.round(wert);
  return Math.max(-VERSATZ_GRENZE, Math.min(VERSATZ_GRENZE, ganz)) || 0;
}

/**
 * Der Versatz aus der Eigenschaft der Karte („dx,dy“) oder aus der Szene ([dx, dy]); begrenzt.
 * Ausgabe: null ohne Angabe, bei ungültiger Angabe und bei (0, 0).
 * Beispiel: "3,-2" → { dx: 3, dy: -2 }; [12, 0] → { dx: 8, dy: 0 }; "a,b" → null.
 */
export function liesFigurversatz(wert: unknown): Bildversatz | null {
  const teile = typeof wert === "string" ? wert.split(",") : Array.isArray(wert) ? wert : null;
  if (teile?.length !== 2) return null;
  const [x, y] = teile.map((t: unknown) => Number(t));
  if (x === undefined || y === undefined || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  const versatz = { dx: begrenzt(x), dy: begrenzt(y) };
  return versatz.dx === 0 && versatz.dy === 0 ? null : versatz;
}
