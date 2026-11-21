/**
 * In welcher Bildhälfte steht der Held? Danach legen sich kurze Hinweise (Steuerhinweis, Meldung)
 * an den anderen Rand (Wunsch des Autors, 20.11.2026: „Kurze Infotexte verdecken den Helden“).
 *
 * Warum: Der Hinweis zum Steuerkreuz stand fest oben in der Mitte, die Meldung „Deine ersten
 * Münzen“ ebenso; stand der Held am oberen Kartenrand (die Kamera hält dort an), lag der Text auf
 * ihm. Die Szene misst je Bild den Anteil der Heldenhöhe am Bildschirm, diese Regel macht daraus
 * „oben“ oder „unten“, die Oberwelt schreibt das als data-held an die Welt, und die Stilregeln
 * (steuerhinweis.css, bedienung.css) legen die Texte an den ferneren Rand.
 * Eine Hysterese verhindert, dass der Text beim Gehen um die Mitte herum hin und her springt.
 * Rolle im Gesamtbild: reine Regel für oberwelt/kamerafuehrung.ts. Abhängigkeiten: keine.
 */

/** Hälfte des Bildschirms, in der der Held steht. */
export type Heldhaelfte = "oben" | "unten";

/** Unter diesem Anteil der Bildhöhe gilt der Held als oben. */
export const GRENZE_OBEN = 0.45;
/** Über diesem Anteil gilt er als unten; dazwischen bleibt die alte Hälfte. */
export const GRENZE_UNTEN = 0.52;

/**
 * Die Hälfte zum Anteil `anteilY` (0 oberer Rand, 1 unterer Rand des Bildes).
 * Eingaben: Anteil, bisherige Hälfte (null: noch keine). Ausgabe: neue Hälfte.
 * Beispiel: Hochformat, die Kamera legt den Helden in die Mitte der freien Fläche über dem
 * Steuerkreuz (Anteil um 0,36) → „oben“, Hinweise unten über dem Kreuz; quer steht er in der Mitte
 * (0,5) → ohne bisherige Hälfte „unten“, Hinweise ganz oben.
 */
export function heldhaelfte(anteilY: number, alt: Heldhaelfte | null): Heldhaelfte {
  if (anteilY < GRENZE_OBEN) return "oben";
  if (anteilY > GRENZE_UNTEN) return "unten";
  return alt ?? "unten";
}
