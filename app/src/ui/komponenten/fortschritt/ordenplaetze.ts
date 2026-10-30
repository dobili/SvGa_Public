/**
 * Plätze der Orden im Hintergrund der Startanimation: zufällig verstreut im freien Rand um Springer
 * und Titel, aber bei jedem Start gleich.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026, bestätigt 30.10.2026): die Orden „zufällig
 * verteilt“ im einfarbigen Hintergrund, verdiente golden, offene als Silhouette. Bis 0.3.12 standen
 * sie in einem Kranz. Ein fester Zufall (training/zufall.ts) verteilt sie; so steht jeder Orden
 * immer an derselben Stelle, und man findet die eigenen wieder. Plätze in der Mitte (Springer,
 * Titel) und zu nahe an einem anderen Orden werden verworfen.
 * Abhängigkeiten: training/zufall.ts.
 */
import { festerZufall } from "../../../training/zufall";

/** Ein Platz in Prozent der Fläche (Mitte des Ordens). */
export interface Ordenplatz {
  readonly x: number;
  readonly y: number;
}

/** Feste Saat: dieselbe Verteilung bei jedem Start. */
const SAAT = 2610;
/** Rand der Fläche, den kein Orden überschreitet (Prozent). */
const RAND = 6;
const PROZENT = 100;
const MITTE = PROZENT / 2;
/** Freie Ellipse in der Mitte für Springer und Titel (Halbachsen in Prozent). */
export const FREI_X = 30;
export const FREI_Y = 34;
/** Mindestabstand zweier Orden (Prozentpunkte), damit sie sich nicht überdecken. */
export const ABSTAND = 11;
/** So oft wird ein Platz neu gewürfelt, bevor der Abstand halbiert wird. */
const VERSUCHE = 400;
/** Faktor, um den der Abstand schrumpft, wenn die Fläche zu voll ist. */
const ENGER = 0.85;

/** Liegt der Punkt in der freien Mitte? */
function inDerMitte(p: Ordenplatz): boolean {
  return ((p.x - MITTE) / FREI_X) ** 2 + ((p.y - MITTE) / FREI_Y) ** 2 < 1;
}

/**
 * Plätze für `anzahl` Orden: zufällig, aber fest, außerhalb der Mitte, mit Mindestabstand.
 *
 * Eingabe: Zahl der Orden (heute 18). Ausgabe: je Orden ein Platz, immer dieselben.
 * Sonderfall: Passen nicht alle mit vollem Abstand, wird der Abstand schrittweise kleiner.
 */
export function ordenplaetze(anzahl: number): readonly Ordenplatz[] {
  const zufall = festerZufall(SAAT);
  const plaetze: Ordenplatz[] = [];
  let abstand = ABSTAND;
  while (plaetze.length < anzahl) {
    let gefunden: Ordenplatz | null = null;
    for (let i = 0; i < VERSUCHE && !gefunden; i++) {
      const p = {
        x: RAND + zufall() * (PROZENT - 2 * RAND),
        y: RAND + zufall() * (PROZENT - 2 * RAND),
      };
      const frei = plaetze.every((q) => Math.hypot(p.x - q.x, p.y - q.y) >= abstand);
      if (!inDerMitte(p) && frei) gefunden = p;
    }
    if (gefunden) plaetze.push(gefunden);
    else abstand *= ENGER;
  }
  return plaetze;
}
