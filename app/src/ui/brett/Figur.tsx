/**
 * Eine Figur auf dem Brett, im gewählten Figurensatz.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: … Figurensatz“. Seit 0.2.33 (Frage des
 * Autors nach dem versprochenen zweiten Satz) gibt es mehrere Sätze:
 * - „buch“: die Figuren der Buchdiagramme (SkakNew, Pfade aus figurenpfade.generiert.ts), mit
 *   cremefarbenem Schattenriss und Figur in der Farbe des Brettes;
 * - seit 0.2.81 neun Bildsätze nach Wahl des Autors, je drei klassisch, modern und aus Holz
 *   (speicher/format.ts, BILDSAETZE; Herkunft und Lizenz in pipeline/figuren/saetze/LIZENZEN.md).
 *   Sie ersetzen die früheren Sätze „klassisch“ und „Holz“.
 * Die SVG-Dateien liegen in public/figuren/<satz>/ und gehören zum Offline-Speicher (Muster *.svg).
 * Abhängigkeiten: figurenpfade.generiert.ts, masse.ts.
 */
import type { Figurensatz } from "../../app/einstellungen";
import { FIGURENPFADE } from "./figurenpfade.generiert";
import { FARBEN, FELD } from "./masse";

/** Ordner der Bildsätze unter der Basisadresse der App; der Buchsatz kommt aus Pfaden. */
const ORDNER_BILDSAETZE = "figuren/";

/**
 * Dateiname einer Figur in einem Bildsatz.
 *
 * Eingabe: FEN-Zeichen („K“ weißer König, „n“ schwarzer Springer). Ausgabe: „wK.svg“, „bN.svg“.
 */
function dateiname(zeichen: string): string {
  const weiss = zeichen === zeichen.toUpperCase();
  return `${weiss ? "w" : "b"}${zeichen.toUpperCase()}.svg`;
}

/**
 * Zeichnet eine Figur in der linken oberen Ecke (x, y) eines Feldes.
 *
 * Eingaben: FEN-Zeichen, Ecke, Figurensatz, Farbe der Buchfiguren (je nach Brettfarben).
 * Beispiel: Abb. 1.26, weißer Springer f3: im Buchsatz Schattenriss und Navy-Figur, im
 * Satz „klassisch-cburnett“ das Bild figuren/klassisch-cburnett/wN.svg. Sonderfall: unbekanntes Zeichen zeichnet nichts.
 */
export function Figur({
  zeichen,
  x,
  y,
  satz,
  farbe,
}: {
  zeichen: string;
  x: number;
  y: number;
  satz: Figurensatz;
  farbe: string;
}) {
  const pfade = FIGURENPFADE[zeichen];
  if (!pfade) return null;
  if (satz !== "buch") {
    return (
      <image
        href={`${import.meta.env.BASE_URL}${ORDNER_BILDSAETZE}${satz}/${dateiname(zeichen)}`}
        x={x}
        y={y}
        width={FELD}
        height={FELD}
      />
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={pfade.schattenriss} fill={FARBEN.creme} />
      <path d={pfade.figur} fill={farbe} />
    </g>
  );
}
