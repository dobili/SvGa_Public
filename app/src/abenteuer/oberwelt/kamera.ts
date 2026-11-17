/**
 * Kameragrenzen der Oberwelt: Die Kamera folgt dem Helden und hält am Kartenrand an (wie bei
 * Pokémon, Wunsch des Autors, 9.11.2026). Ist eine Karte schmaler oder niedriger als der
 * Bildschirm (kleiner Raum im Querformat), steht sie mittig statt links oben mit dunklem Rest.
 *
 * Verdeckte Ränder: Feste Bedienelemente liegen über dem Bild. Am Kartenrand stand der Held sonst
 * unter ihnen. Die Kamera darf deshalb so weit über die Karte hinaus, dass der Kartenrand neben den
 * Bedienelementen liegt, und kleine Räume stehen mittig in der freien Fläche.
 * - Hochformat (Spieltest „einstieg“, 15.11.2026, R7): unten Steuerkreuz, Aktionsknopf und Leiste.
 * - Querformat (Spieltest Variante B, 16.11.2026, F3): links das Steuerkreuz, rechts die
 *   Knopfspalte mit Aktionsknopf, Menü und Leiste; sie reichen von unten fast bis oben.
 * - Oben in beiden Lagen die Münzen (F3: im Hochformat deckten sie den Helden zu 30 %), mindestens
 *   aber eine halbe Figurenhöhe: Der Kopf ragt über die Fußkachel, in der obersten Kartenreihe
 *   wurde er sonst am Bildrand abgeschnitten (F4, Zedernpfad-Ausgang im Park).
 * Was über die Karte hinausragt, zeigt den dunklen Grund der Szene.
 *
 * Rolle im Gesamtbild: Hilfe für oberwelt/kameraregie.ts (szene.ts, oberweltspiel.ts) und
 * oberwelt/zielmarker.ts. Abhängigkeiten: keine.
 */

/**
 * Höhe der Knöpfe unten im Hochformat in Bildschirmpixeln (bedienung.css: Rand 16, Steuerkreuz
 * 160, Fuge 8, Leiste 48, dazu etwas Luft).
 */
const VERDECKT_HOCHFORMAT_PX = 240;
/** Querformat links: Rand 16 und Steuerkreuz 160 (bedienung.css), dazu 8 Luft. */
const VERDECKT_QUER_LINKS_PX = 184;
/** Querformat rechts: Rand 16 und Aktionsknopf 72 (die Knopfspalte ist schmaler), dazu 8 Luft. */
const VERDECKT_QUER_RECHTS_PX = 96;
/** Oben: Münzen (abenteuer.css: Abstand 8, Knopfhöhe 40) und 8 Luft. */
const VERDECKT_OBEN_PX = 56;
/** Mindestens so viel Luft oben in Kartenpixeln: Der Kopf ragt etwa 4 Pixel über die Fußkachel. */
export const KOPF_LUFT = 8;
/** Höchste Bildhöhe in CSS-Pixeln, bei der die Bedienung quer liegt (bedienung.css, max-height). */
const QUER_HOECHSTENS_PX = 600;

/** Rechteck der Kameragrenzen in Spielpixeln. */
export interface Grenzen {
  x: number;
  y: number;
  breite: number;
  hoehe: number;
}

/** Von Bedienelementen verdeckte Ränder der Ansicht in Kartenpixeln. */
export interface Raender {
  readonly oben: number;
  readonly unten: number;
  readonly links: number;
  readonly rechts: number;
}

/** Keine verdeckten Ränder. */
export const OHNE_RAENDER: Raender = { oben: 0, unten: 0, links: 0, rechts: 0 };

/**
 * Grenzen für eine Achse: die Karte samt der verdeckten Ränder davor (`vor`) und dahinter
 * (`nach`), oder, wenn sie kürzer als die freie Fläche ist, die Ansicht mittig um die Karte in der
 * freien Fläche.
 */
function achse(karte: number, ansicht: number, vor: number, nach: number): [number, number] {
  const frei = ansicht - vor - nach;
  // „0 − vor“ statt „−vor“: ohne Rand bleibt es +0 (−0 stört Vergleiche und Tests).
  if (karte >= frei) return [0 - vor, karte + vor + nach];
  return [0 - vor - Math.floor((frei - karte) / 2), ansicht];
}

/**
 * Verdeckter Streifen unten in Spielpixeln: im Hochformat die Knöpfe, quer nichts.
 * Eingaben: Ansicht in Spielpixeln und Vergrößerung. Beispiel: 130 × 281 bei ZOOM 3 → 80.
 * Sonderfall: sehr niedrige Ansicht → höchstens ein Drittel der Höhe.
 */
export function verdeckteHoehe(ansichtBreite: number, ansichtHoehe: number, zoom: number): number {
  return ansichtHoehe <= ansichtBreite ? 0 : hochUnten(ansichtHoehe, zoom);
}

/**
 * Liegt die Bedienung quer (Steuerkreuz links, Knopfspalte rechts)? Wie bedienung.css: breiter
 * als hoch und höchstens 600 CSS-Pixel hoch. Beispiel: 800 × 420 → ja; 1280 × 800 → nein.
 */
export function bedienungQuer(ansichtBreite: number, ansichtHoehe: number, zoom: number): boolean {
  return ansichtBreite > ansichtHoehe && ansichtHoehe * zoom <= QUER_HOECHSTENS_PX;
}

/**
 * Die verdeckten Ränder einer Ansicht in Kartenpixeln (siehe Dateikopf).
 * Eingaben: Ansicht in Kartenpixeln und Vergrößerung.
 * Beispiel: hoch 140 × 267 bei ZOOM 3 → oben 19, unten 80, links und rechts 0; quer 267 × 140 →
 * oben 19, links 61, rechts 32, unten 0. Sonderfall: jede Seite höchstens ein Viertel der Breite.
 */
export function verdeckteRaender(
  ansichtBreite: number,
  ansichtHoehe: number,
  zoom: number,
): Raender {
  const oben = Math.max(KOPF_LUFT, Math.round(VERDECKT_OBEN_PX / zoom));
  if (!bedienungQuer(ansichtBreite, ansichtHoehe, zoom)) {
    return { oben, unten: hochUnten(ansichtHoehe, zoom), links: 0, rechts: 0 };
  }
  const seite = (px: number) => Math.min(Math.round(px / zoom), Math.floor(ansichtBreite / 4));
  return {
    oben,
    unten: 0,
    links: seite(VERDECKT_QUER_LINKS_PX),
    rechts: seite(VERDECKT_QUER_RECHTS_PX),
  };
}

/** Streifen unten, wenn die Bedienung nicht quer liegt: die Knöpfe, höchstens ein Drittel. */
function hochUnten(ansichtHoehe: number, zoom: number): number {
  return Math.min(Math.round(VERDECKT_HOCHFORMAT_PX / zoom), Math.floor(ansichtHoehe / 3));
}

/**
 * Kameragrenzen für eine Karte bei gegebener Ansichtsgröße (alles in Spielpixeln); `raender` sind
 * die verdeckten Ränder (verdeckteRaender).
 * Beispiel: Dachboden 224 px breit, Ansicht 280 px → x = −28, Breite 280; die Karte steht mittig.
 * Hochformat 130 × 281 mit 80 unten verdeckt: Dachboden 176 hoch → y = −12 (mittig in 201 freien
 * Pixeln).
 */
export function kameragrenzen(
  kartenBreite: number,
  kartenHoehe: number,
  ansichtBreite: number,
  ansichtHoehe: number,
  raender: Raender = OHNE_RAENDER,
): Grenzen {
  const [x, breite] = achse(kartenBreite, ansichtBreite, raender.links, raender.rechts);
  const [y, hoehe] = achse(kartenHoehe, ansichtHoehe, raender.oben, raender.unten);
  return { x, y, breite, hoehe };
}
