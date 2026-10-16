/**
 * Pfeile und Felder einer Abbildung in der Form der Werkzeugmarkierungen.
 *
 * Rolle im Gesamtbild: Abbildung-Bildschirm und Kapitelübersicht zeichnen die Markierungen des
 * Buches mit derselben Brett-Komponente wie die Werkzeugergebnisse.
 * Abhängigkeiten: analyse/werkzeug.ts (Typ), daten/laden.ts (Typ).
 */
import type { Markierung } from "../../analyse/werkzeug";
import type { Abbildung } from "../../daten/laden";

/** Beispiel: Abb. 1.26 → ein rot umrandetes Feld d4 und sechs Pfeile auf d4. */
export function buchmarkierungen(abbildung: Abbildung): Markierung[] {
  return [
    ...abbildung.felder.map((f): Markierung => ({ typ: "feld", farbe: f.farbe, feld: f.feld })),
    ...abbildung.pfeile.map((p): Markierung => ({
      typ: "pfeil",
      farbe: p.farbe,
      von: p.von,
      nach: p.nach,
    })),
  ];
}
