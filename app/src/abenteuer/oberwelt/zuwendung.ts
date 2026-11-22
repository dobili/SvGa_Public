/**
 * Figuren schauen den Helden an, wenn er mit ihnen spricht (Wunsch des Autors, 22.11.2026: „Spricht
 * man mit einer Figur, sollte sie einen anschauen, sich zu einem drehen.“). Reine Regeln ohne
 * Phaser; gezeichnet wird in zuwendungsschicht.ts.
 *
 * Regeln:
 * - Die Richtung ergibt sich aus der Lage des Helden relativ zur Figur; die größere Achse
 *   entscheidet (wie blickZu in gefuehrterweg.ts), bei Gleichstand die waagrechte.
 * - Nicht gedreht werden: Sitzende (am Brett oder Tisch; ihr Sitzbild gehört zum Möbel),
 *   Liegende, Figuren in einem geführten Weg (der Weg bestimmt die Richtung) und Figuren mit einem
 *   fremden Bild (weder eigener Bogen noch Platzhalter).
 * - Das Bild: im eigenen Bogen das Standbild der Richtung (figurbilder.ts), im Platzhalterbogen
 *   „figur“ (grafik/figur.png, Ordnung unten, links, rechts, oben wie der Held in szene.ts).
 * Rolle im Gesamtbild: gelesen von zuwendungsschicht.ts. Abhängigkeiten: gefuehrterweg.ts.
 */
import { blickZu, type Blick } from "./gefuehrterweg";

/** Was über eine Figur bekannt ist, bevor sie sich dreht. */
export interface Figurlage {
  readonly x: number;
  readonly y: number;
  readonly sitzt: boolean;
  readonly liegt: boolean;
  readonly gefuehrt: boolean;
  /** Welcher Bogen: der eigene der Figur, der Platzhalter oder ein anderer (dreht sich nicht). */
  readonly bild: "eigen" | "platzhalter" | "anderes";
}

/** Bild je Blickrichtung im Platzhalterbogen „figur“ (wie BILD_JE_RICHTUNG in szene.ts). */
export const PLATZHALTER_BILD: Readonly<Record<Blick, number>> = {
  unten: 0,
  links: 1,
  rechts: 2,
  oben: 3,
};

/**
 * Die Blickrichtung, in die sich die Figur zum Helden dreht, oder null, wenn sie sich nicht dreht
 * (Ausnahmen im Dateikopf, oder Held und Figur am selben Punkt).
 * Eingaben in Kartenpixeln. Beispiel: Mama auf (232, 120), Held links daneben auf (216, 122) →
 * "links"; Held zwei Kacheln darunter → "unten".
 */
export function zuwendung(
  figur: Figurlage,
  held: { readonly x: number; readonly y: number },
): Blick | null {
  if (figur.sitzt || figur.liegt || figur.gefuehrt || figur.bild === "anderes") return null;
  return blickZu(figur, held);
}
