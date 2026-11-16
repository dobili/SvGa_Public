/**
 * Sitzende Figuren und Statisten, reine Regeln ohne Phaser (Wunsch des Autors seit Runde 11,
 * R020: „Schachspieler sitzen“). Eine Figur der Szene mit `"sitzt": "unten"` (oder `true`), ein
 * Statist mit der Eigenschaft `sitzt` sitzt auf einem Stuhl, einer Bank oder einem Sofa und
 * schaut in diese Richtung.
 *
 * Bild: Hat der Bogen eine dritte Reihe (PixelLab-Export mit `animations/Sitting/<richtung>/`,
 * skripte/figurenbogen.mjs; Doc 24), stehen dort die Sitzbilder ab Rahmen 48 in der Ordnung
 * rechts, oben, links, unten. Sonst gilt das Standbild der Richtung, um SITZ_HUB Pixel höher
 * gezeichnet (oberwelt/figurensitz.ts).
 * Stehende Figuren und Statisten schauen nach unten, außer sie tragen die Eigenschaft `blick`
 * (oben, unten, links, rechts; Rückmeldung R008 des Autors: „Stehen sie still, müssen sie logisch
 * platziert sein, mit sinnvoller Blickrichtung“). Dann zeigen sie das Standbild dieser Richtung,
 * etwa die Verkäuferin, die über ihren Tresen nach links zur Kundschaft schaut.
 * Rolle im Gesamtbild: gelesen von ausloeserebene.ts und belebung.ts, gezeichnet von
 * figurensitz.ts, figurenaufstellung.ts und belebungsschicht.ts. Abhängigkeiten: szene.ts (Typ Richtung).
 */
import type { Richtung } from "./szene";

/** So viele Pixel höher steht ein sitzendes Standbild (ohne eigenes Sitzbild). */
export const SITZ_HUB = 6;
/** Erster Rahmen der Sitzreihe im Bogen (dritte Reihe bei 24 Rahmen je Reihe). */
export const SITZ_BEGINN = 48;
/** Reihenfolge der Richtungen bei LimeZu, wie die Standbilder (figurbilder.ts). */
const REIHENFOLGE: readonly Richtung[] = ["rechts", "oben", "links", "unten"];

/**
 * Blickrichtung einer sitzenden Figur aus der Eigenschaft `sitzt`, sonst null.
 * Beispiel: "links" → "links"; "ja" oder true → "unten"; "" oder fehlend → null.
 */
export function sitzrichtung(wert: unknown): Richtung | null {
  if (wert === true || wert === "ja") return "unten";
  return REIHENFOLGE.find((r) => r === wert) ?? null;
}

/**
 * Blickrichtung einer stehenden Figur aus der Eigenschaft `blick` (R008), sonst null; dann gilt
 * die Vorgabe „unten“. Beispiel: "links" → "links"; "ja", "" oder fehlend → null.
 */
export function blickrichtung(wert: unknown): Richtung | null {
  return REIHENFOLGE.find((r) => r === wert) ?? null;
}

/** Hat ein Bogen mit so vielen Rahmen eine Sitzreihe? */
export function hatSitzbilder(rahmen: number): boolean {
  return rahmen >= SITZ_BEGINN + REIHENFOLGE.length;
}

/** Rahmen des Sitzbilds: aus der Sitzreihe, sonst das Standbild der Richtung. */
export function sitzbild(rahmen: number, richtung: Richtung): number {
  const index = REIHENFOLGE.indexOf(richtung);
  return hatSitzbilder(rahmen) ? SITZ_BEGINN + index : index;
}
