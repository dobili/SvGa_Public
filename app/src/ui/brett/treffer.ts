/**
 * Großzügige Trefferfläche beim Antippen und Ablegen: Welches Feld meint der Finger?
 *
 * Rolle im Gesamtbild: Brett.tsx und useZiehen.ts fragen hier, welches Feld ein Tipp oder ein
 * Ablegen trifft. Wunsch des Autors (R35, 23.10.2026): „Figur antippen, dann Zielfeld“ wurde
 * manchmal nicht erkannt, wenn der Finger knapp neben dem Zielfeld landete. Ist eine Figur
 * gewählt, zieht ein Tipp knapp neben einem möglichen Zielfeld zu diesem Feld hin. Abgelehnt
 * wird nur, wenn der Finger genau zwischen zwei möglichen Zielfeldern liegt.
 * Abhängigkeiten: geometrie.ts, masse.ts.
 */
import { feldAnPunkt, feldEcke, type Punkt } from "./geometrie";
import { FELD } from "./masse";

/** So weit (Anteil der Feldbreite) neben einem Zielfeld zählt ein Tipp noch für dieses Feld. */
export const TOLERANZ_ZIELFELD = 0.25;
/** Kleiner, wenn unter dem Finger eine eigene Figur steht: Dann ist ein Wechsel der Figur gemeint. */
export const TOLERANZ_EIGENE_FIGUR = 0.1;
/** Liegen zwei Zielfelder näher beieinander als dieser Anteil, ist der Tipp mehrdeutig. */
const MEHRDEUTIG = 0.06;

/** Abstand eines Punktes zum Rechteck eines Feldes in Einheiten des Brettes; 0 im Feld. */
function abstandZumFeld(punkt: Punkt, feld: string, gedreht: boolean): number {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return Number.POSITIVE_INFINITY;
  const dx = Math.max(ecke.x - punkt.x, 0, punkt.x - (ecke.x + FELD));
  const dy = Math.max(ecke.y - punkt.y, 0, punkt.y - (ecke.y + FELD));
  return Math.hypot(dx, dy);
}

/**
 * Das gemeinte Feld eines Tipps.
 *
 * Warum: Auf dem Handy ist ein Feld nur etwa 5 mm breit; wer neben das Zielfeld tippt, will
 * trotzdem ziehen. Ohne Zielfelder (keine Figur gewählt) gilt einfach das Feld unter dem Finger.
 * Eingaben: Punkt in Einheiten des Brettes, Drehung, mögliche Zielfelder, Toleranz als Anteil
 * der Feldbreite (TOLERANZ_ZIELFELD, auf einer eigenen Figur TOLERANZ_EIGENE_FIGUR).
 * Ausgabe: Feldname; null neben dem Brett oder bei echter Mehrdeutigkeit zwischen zwei
 * Zielfeldern (dann geschieht nichts, die Figur bleibt gewählt).
 * Beispiel: Springer g1 gewählt (Ziele f3, h3), Tipp auf g3 knapp neben f3 → „f3“; Tipp auf die
 * Mitte von g3 → „g3“ (wählt ab); Tipp genau auf die Kante zwischen zwei Zielfeldern → null.
 * Sonderfälle: Ein Tipp in ein Zielfeld gilt diesem Feld, außer er liegt auf der Kante zu einem
 * zweiten Zielfeld.
 */
export function trefferfeld(
  punkt: Punkt,
  gedreht: boolean,
  ziele: readonly string[],
  toleranz: number = TOLERANZ_ZIELFELD,
): string | null {
  const feld = feldAnPunkt(punkt, gedreht);
  if (!feld || ziele.length === 0) return feld;
  const nahe = ziele
    .map((ziel) => ({ ziel, abstand: abstandZumFeld(punkt, ziel, gedreht) }))
    .filter((eintrag) => eintrag.abstand <= toleranz * FELD)
    .sort((a, b) => a.abstand - b.abstand);
  const [erstes, zweites] = nahe;
  if (!erstes) return feld;
  if (zweites && zweites.abstand - erstes.abstand < MEHRDEUTIG * FELD) return null;
  return erstes.ziel;
}
