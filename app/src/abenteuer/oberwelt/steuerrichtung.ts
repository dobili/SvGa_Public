/**
 * Richtung des Steuerkreuzes aus der Lage des Fingers (Wunsch des Autors, 20.11.2026): Solange ein
 * Finger auf dem Kreuz liegt, zählt die Richtung, deren Taste der Berührung am nächsten ist, auch in
 * den Lücken zwischen den Pfeilen, in der Mitte und außerhalb des Kreuzes.
 *
 * Warum: „Wenn man einen Pfeil drückt und gedrückt hält und dann auf einen anderen rüber swiped, dann
 * gibt es zwischen zwei Pfeilen gar keine Reaktion.“ Bisher galt nur die Taste unter dem Finger; in der
 * Lücke stand der Held, die Bewegung hackte ab. Jetzt entscheidet der Winkel zur Mitte des Kreuzes.
 * Ein kleiner toter Kern in der Mitte hält die alte Richtung (sonst zittert sie beim Überstreichen der
 * Mitte), und eine Hysterese auf der Diagonale verhindert Flackern zwischen zwei Nachbarn.
 * Seit dem Joystick (26.11.2026) bestimmt die Regel den Blick bei schrägem Laufen: die vorherrschende
 * Achse mit derselben Hysterese (joystick.ts); die Laufrichtung selbst hat acht Sektoren.
 * Rolle im Gesamtbild: reine Regel für oberwelt/joystick.ts. Abhängigkeiten: keine.
 */
import type { Richtung } from "./szene";

/** Halbmesser des toten Kerns in CSS-Pixeln: Darin bleibt die bisherige Richtung. */
export const TOTER_KERN_PX = 8;
/** Auf der Diagonale wechselt die Achse erst, wenn die neue Achse so viel mal stärker ist. */
export const HYSTERESE = 1.25;

function waagrecht(r: Richtung | null): boolean {
  return r === "links" || r === "rechts";
}

/**
 * Die Richtung zur Lage (dx, dy) des Fingers relativ zur Mitte des Kreuzes (y nach unten).
 * Eingaben: Versatz in CSS-Pixeln, bisherige Richtung (null: noch keine).
 * Ausgabe: neue Richtung; im toten Kern die bisherige (oder null, wenn es noch keine gab).
 * Beispiel: (30, 0) → rechts; (20, 22) nach „rechts“ → bleibt rechts (Diagonale, Hysterese);
 * (10, 30) nach „rechts“ → unten.
 */
export function richtungZu(dx: number, dy: number, alt: Richtung | null): Richtung | null {
  if (Math.hypot(dx, dy) < TOTER_KERN_PX) return alt;
  const x = Math.abs(dx);
  const y = Math.abs(dy);
  const waag: Richtung = dx < 0 ? "links" : "rechts";
  const senk: Richtung = dy < 0 ? "oben" : "unten";
  if (alt === null) return x >= y ? waag : senk;
  // Auf der alten Achse bleiben, bis die andere deutlich überwiegt; die Seite darf sofort wechseln.
  if (waagrecht(alt)) return y > x * HYSTERESE ? senk : waag;
  return x > y * HYSTERESE ? waag : senk;
}
