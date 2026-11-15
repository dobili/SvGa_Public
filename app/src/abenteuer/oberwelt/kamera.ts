/**
 * Kameragrenzen der Oberwelt: Die Kamera folgt dem Helden und hält am Kartenrand an (wie bei
 * Pokémon, Wunsch des Autors, 9.11.2026). Ist eine Karte schmaler oder niedriger als der
 * Bildschirm (kleiner Raum im Querformat), steht sie mittig statt links oben mit dunklem Rest.
 *
 * Seit dem Spieltest „einstieg“ (15.11.2026, R7) gibt es unten einen verdeckten Streifen: Im
 * Hochformat liegen Steuerkreuz, Aktionsknopf und Leiste über dem unteren Drittel des Bildes. Am
 * unteren Kartenrand stand der Held sonst unter den Knöpfen, und kleine Räume hingen mittig hinter
 * ihnen. Die Kamera darf deshalb so weit hinaus, dass der Kartenrand über den Knöpfen liegt, und
 * kleine Räume stehen mittig in der freien Fläche darüber.
 *
 * Rolle im Gesamtbild: Hilfe für oberwelt/szene.ts und oberweltspiel.ts. Abhängigkeiten: keine.
 */

/**
 * Höhe der Knöpfe unten im Hochformat in Bildschirmpixeln (bedienung.css: Rand 16, Steuerkreuz
 * 160, Fuge 8, Leiste 48, dazu etwas Luft). Quer liegen die Knöpfe seitlich, dort gilt 0.
 */
const VERDECKT_HOCHFORMAT_PX = 240;

/** Rechteck der Kameragrenzen in Spielpixeln. */
export interface Grenzen {
  x: number;
  y: number;
  breite: number;
  hoehe: number;
}

/**
 * Grenzen für eine Achse: die Karte selbst, oder, wenn sie kürzer als die Ansicht ist, die Ansicht
 * mittig um die Karte gelegt.
 */
function achse(karte: number, ansicht: number, verdeckt = 0): [number, number] {
  const frei = ansicht - verdeckt;
  if (karte >= frei) return [0, karte + verdeckt];
  return [-Math.floor((frei - karte) / 2), ansicht];
}

/**
 * Verdeckter Streifen unten in Spielpixeln: im Hochformat die Knöpfe, quer nichts.
 * Eingaben: Ansicht in Spielpixeln und Vergrößerung. Beispiel: 130 × 281 bei ZOOM 3 → 80.
 * Sonderfall: sehr niedrige Ansicht → höchstens ein Drittel der Höhe.
 */
export function verdeckteHoehe(ansichtBreite: number, ansichtHoehe: number, zoom: number): number {
  if (ansichtHoehe <= ansichtBreite) return 0;
  return Math.min(Math.round(VERDECKT_HOCHFORMAT_PX / zoom), Math.floor(ansichtHoehe / 3));
}

/**
 * Kameragrenzen für eine Karte bei gegebener Ansichtsgröße (alles in Spielpixeln); `verdeckt` ist
 * der Streifen unten unter den Knöpfen (verdeckteHoehe).
 * Beispiel: Dachboden 224 px breit, Ansicht 280 px → x = −28, Breite 280; die Karte steht mittig.
 * Hochformat 130 × 281 mit 80 verdeckt: Dachboden 176 hoch → y = −12 (mittig in 201 freien Pixeln).
 */
export function kameragrenzen(
  kartenBreite: number,
  kartenHoehe: number,
  ansichtBreite: number,
  ansichtHoehe: number,
  verdeckt = 0,
): Grenzen {
  const [x, breite] = achse(kartenBreite, ansichtBreite);
  const [y, hoehe] = achse(kartenHoehe, ansichtHoehe, verdeckt);
  return { x, y, breite, hoehe };
}
