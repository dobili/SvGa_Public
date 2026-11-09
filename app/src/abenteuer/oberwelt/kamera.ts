/**
 * Kameragrenzen der Oberwelt: Die Kamera folgt dem Helden und hält am Kartenrand an (wie bei
 * Pokémon, Wunsch des Autors, 9.11.2026). Ist eine Karte schmaler oder niedriger als der
 * Bildschirm (kleiner Raum im Querformat), steht sie mittig statt links oben mit dunklem Rest.
 *
 * Rolle im Gesamtbild: Hilfe für oberwelt/szene.ts. Abhängigkeiten: keine.
 */

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
function achse(karte: number, ansicht: number): [number, number] {
  if (karte >= ansicht) return [0, karte];
  return [-Math.floor((ansicht - karte) / 2), ansicht];
}

/**
 * Kameragrenzen für eine Karte bei gegebener Ansichtsgröße (alles in Spielpixeln).
 * Beispiel: Dachboden 224 px breit, Ansicht 280 px → x = −28, Breite 280; die Karte steht mittig.
 */
export function kameragrenzen(
  kartenBreite: number,
  kartenHoehe: number,
  ansichtBreite: number,
  ansichtHoehe: number,
): Grenzen {
  const [x, breite] = achse(kartenBreite, ansichtBreite);
  const [y, hoehe] = achse(kartenHoehe, ansichtHoehe);
  return { x, y, breite, hoehe };
}
