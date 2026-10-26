/**
 * Porträts zur Wahl für eigene Bots (Wunsch des Autors vom 19.10.2026).
 *
 * Rolle im Gesamtbild: Eigene Gegner (engine/gegner.ts, EigenerGegner) bekommen kein frei
 * gestaltetes Bild, sondern eines aus dieser festen Liste: je sechs Kinder, Jugendliche, junge
 * Erwachsene, Erwachsene und ältere Menschen, Frauen und Männer, mit verschiedenen Haut- und
 * Haarfarben, Brillen und Bärten. Die Bilder liegen in app/public/gegner/wahl-01.svg bis
 * wahl-30.svg (erzeugt von skripte/erzeuge-portraetwahl.mjs), die Beschreibungen in i18n/de.json
 * („portraet.wahl-01“).
 * Abhängigkeiten: keine.
 */

/** Altersgruppen in der Reihenfolge der Auswahlliste. */
export const ALTERSGRUPPEN = [
  "kind",
  "jugendlich",
  "jungErwachsen",
  "erwachsen",
  "aelter",
] as const;
export type Altersgruppe = (typeof ALTERSGRUPPEN)[number];

/** Alle Porträts zur Wahl mit ihrer Altersgruppe, in der Reihenfolge des Skripts. */
export const PORTRAETWAHL = [
  { kennung: "wahl-01", gruppe: "kind" },
  { kennung: "wahl-02", gruppe: "kind" },
  { kennung: "wahl-03", gruppe: "kind" },
  { kennung: "wahl-04", gruppe: "kind" },
  { kennung: "wahl-05", gruppe: "kind" },
  { kennung: "wahl-06", gruppe: "kind" },
  { kennung: "wahl-07", gruppe: "jugendlich" },
  { kennung: "wahl-08", gruppe: "jugendlich" },
  { kennung: "wahl-09", gruppe: "jugendlich" },
  { kennung: "wahl-10", gruppe: "jugendlich" },
  { kennung: "wahl-11", gruppe: "jugendlich" },
  { kennung: "wahl-12", gruppe: "jugendlich" },
  { kennung: "wahl-13", gruppe: "jungErwachsen" },
  { kennung: "wahl-14", gruppe: "jungErwachsen" },
  { kennung: "wahl-15", gruppe: "jungErwachsen" },
  { kennung: "wahl-16", gruppe: "jungErwachsen" },
  { kennung: "wahl-17", gruppe: "jungErwachsen" },
  { kennung: "wahl-18", gruppe: "jungErwachsen" },
  { kennung: "wahl-19", gruppe: "erwachsen" },
  { kennung: "wahl-20", gruppe: "erwachsen" },
  { kennung: "wahl-21", gruppe: "erwachsen" },
  { kennung: "wahl-22", gruppe: "erwachsen" },
  { kennung: "wahl-23", gruppe: "erwachsen" },
  { kennung: "wahl-24", gruppe: "erwachsen" },
  { kennung: "wahl-25", gruppe: "aelter" },
  { kennung: "wahl-26", gruppe: "aelter" },
  { kennung: "wahl-27", gruppe: "aelter" },
  { kennung: "wahl-28", gruppe: "aelter" },
  { kennung: "wahl-29", gruppe: "aelter" },
  { kennung: "wahl-30", gruppe: "aelter" },
] as const satisfies readonly { kennung: string; gruppe: Altersgruppe }[];

export type Portraetkennung = (typeof PORTRAETWAHL)[number]["kennung"];

/**
 * Ist das eine Kennung aus der Liste? Für Rohdaten aus dem Speicher und der Sicherung.
 * Beispiel: "wahl-07" → true; "lotta" (vorgefertigter Gegner) → false.
 */
export function istPortraetwahl(wert: unknown): wert is Portraetkennung {
  return PORTRAETWAHL.some((p) => p.kennung === wert);
}

/**
 * Ein selbst gebautes Porträt (Wunsch des Autors vom 25.10.2026): die Merkmale aus
 * dem Baukasten (ui/profil/merkmale.ts) und das fertige SVG, damit nur der Baukasten die
 * Bibliothek laden muss. Für das Profil des Lesers und für eigene Bots.
 */
export interface GebautesPortraet {
  readonly merkmale: Readonly<Record<string, string>>;
  readonly svg: string;
}
