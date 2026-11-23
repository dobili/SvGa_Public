/**
 * Weitere Standbilder im Paket finden (Karteneditor 1.9): den Index figuren32/standbilder.json
 * einmal laden und den Figuren einer Karte ihren Eintrag zuordnen.
 *
 * Warum eigene Datei: weltdaten.ts lädt alles für eine Karte und ist nah an der Größengrenze.
 * Der Index heißt nach dem Bogen (figuren-neu/<name>), die Karte nach dem Objekt; die Brücke ist
 * der `sprite` der Figur in orte.json (figuren/<bogen>.png). In der Rivalin-Fassung gilt Victorias
 * Eintrag, wenn es ihren Bogen gibt (regeln/rivalform.ts).
 * Abhängigkeiten: paket/paketlader.ts, figurzustand.ts (Typen), regeln/rivalform.ts.
 */
import { liesPaketJson } from "../paket/paketlader";
import { rivalinbogen } from "../regeln/rivalform";
import type { Standbildindex, Standbildindizes } from "./figurzustand";

const DATEI = "figuren32/standbilder.json";
let vorrat: Promise<Standbildindizes> | null = null;
let geladen: Standbildindizes = {};

/** Der Index des Pakets; leer, wenn es ihn nicht gibt (ältere Pakete, CI ohne private Bilder). */
export function ladeStandbildindex(): Promise<Standbildindizes> {
  vorrat ??= liesPaketJson<Standbildindizes>(DATEI)
    .catch(() => ({}))
    .then((index) => (geladen = index));
  return vorrat;
}

/**
 * Der schon geladene Index (leer vor dem ersten Laden). Für die Statisten (belebungsschicht.ts):
 * weltdaten.ts wartet auf ladeStandbildindex, bevor eine Karte aufgebaut wird.
 */
export function geladenerStandbildindex(): Standbildindizes {
  return geladen;
}

/** Bogenname zu einem Sprite-Pfad. Beispiel: "figuren/abe.png" → "abe". */
export function bogenname(sprite: string): string {
  return sprite.replace(/^.*\//, "").replace(/\.png$/, "");
}

/**
 * Objektname → Index der weiteren Standbilder für die Figuren der Karte; Figuren ohne Eintrag
 * fehlen. Eingaben: Namen der Figuren, ihr Sprite (orte.json), Index, ob die Rivalin gewählt ist.
 * Beispiel: ["abe"], abe → "figuren/abe.png", { abe: {beginn: 144, …} } → { abe: {beginn: 144, …} }.
 */
export function figurstandbilderFuer(
  namen: readonly string[],
  spriteVon: (name: string) => string | undefined,
  index: Standbildindizes,
  rivalin: boolean,
): Record<string, Standbildindex> {
  const ergebnis: Record<string, Standbildindex> = {};
  for (const name of namen) {
    const sprite = spriteVon(name);
    if (!sprite) continue;
    const ihrer = rivalinbogen(sprite, rivalin);
    const eintrag = (ihrer ? index[bogenname(ihrer)] : undefined) ?? index[bogenname(sprite)];
    if (eintrag) ergebnis[name] = eintrag;
  }
  return ergebnis;
}
