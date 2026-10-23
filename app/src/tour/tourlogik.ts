/**
 * Reine Logik der Tour: welcher Schritt als Nächstes kommt und wo die Karte steht.
 *
 * Rolle im Gesamtbild: Ohne Browser testbar (tourlogik.test.ts); TourEbene.tsx fragt hier, ob ein
 * Schritt gezeigt oder übersprungen wird (Leitlinie R52: Fehlt ein Ziel, bleibt die Tour nicht
 * hängen) und ob die Karte oben, unten oder in der Mitte steht.
 * Abhängigkeiten: touren.ts (Typ des Schritts).
 */
import type { Tourschritt } from "./touren";

/** Wie ein Schritt erscheint: am Ziel mit Rahmen, in der Mitte ohne Rahmen, oder gar nicht. */
export type Schrittart = "ziel" | "mitte" | "ueberspringen";

/**
 * Wie ein Schritt erscheint, je nachdem, ob sein Ziel gerade auf dem Bildschirm ist.
 *
 * Beispiel: Abb. 1.1 ohne Zugfolge: Schritt „zugleiste“ → überspringen; Schritt „karte“ ohne
 * gewähltes Werkzeug (ersatzMitte) → mitte.
 */
export function schrittart(schritt: Tourschritt, vorhanden: (ziel: string) => boolean): Schrittart {
  if (schritt.ziel === null) return "mitte";
  if (vorhanden(schritt.ziel)) return "ziel";
  return schritt.ersatzMitte ? "mitte" : "ueberspringen";
}

/**
 * Der nächste Schritt, der sich zeigen lässt, ab `ab` (eingeschlossen) in Richtung `richtung`.
 *
 * Eingaben: alle Schritte, Startstelle, +1 (Weiter) oder −1 (Zurück), Prüfung auf das Ziel.
 * Ausgabe: die Stelle oder null, wenn in dieser Richtung keiner mehr kommt (Tour zu Ende).
 * Beispiel: [zugleiste (fehlt), brett] ab 0 vorwärts → 1.
 */
export function naechsterSchritt(
  schritte: readonly Tourschritt[],
  ab: number,
  richtung: 1 | -1,
  vorhanden: (ziel: string) => boolean,
): number | null {
  for (let stelle = ab; stelle >= 0 && stelle < schritte.length; stelle += richtung) {
    const schritt = schritte[stelle];
    if (schritt && schrittart(schritt, vorhanden) !== "ueberspringen") return stelle;
  }
  return null;
}

/** Wo die Karte steht: am Rand gegenüber dem Ziel, oder in der Mitte (Schritt ohne Ziel). */
export type Kartenlage = "oben" | "unten" | "links" | "rechts" | "mitte";

/** Ein Ziel darf höchstens so viel der Breite einnehmen, damit die Karte daneben Platz hat. */
const HOECHSTENS_BREITE_DANEBEN = 0.55;

/**
 * Die Karte steht dort, wo sie das Ziel nicht verdeckt. Im Querformat (breiter als hoch) neben
 * dem Ziel, wenn es schmal genug ist: liegt seine Mitte links, steht die Karte rechts. Sonst
 * unter oder über dem Ziel: liegt seine Mitte in der oberen Hälfte, steht die Karte unten.
 *
 * Beispiele: Handy hoch, Leiste unten → oben; Nummernfeld im Buch → unten; Handy quer, Brett
 * links → rechts.
 */
export function kartenlage(
  ziel: { top: number; bottom: number; left: number; width: number } | null,
  breite: number,
  hoehe: number,
): Kartenlage {
  if (ziel === null) return "mitte";
  if (breite > hoehe && ziel.width <= breite * HOECHSTENS_BREITE_DANEBEN) {
    return ziel.left + ziel.width / 2 < breite / 2 ? "rechts" : "links";
  }
  const mittelpunkt = (ziel.top + ziel.bottom) / 2;
  return mittelpunkt < hoehe / 2 ? "unten" : "oben";
}
