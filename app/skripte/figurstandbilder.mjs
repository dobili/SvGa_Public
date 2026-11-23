/**
 * Weitere Standbilder einer PixelLab-Figur für den Bogen (Karteneditor 1.9, Wunsch des Autors,
 * 23.11.2026: „zwischen den verschiedenen States wechseln … damit ich kleine Ungereimtheiten in der
 * Darstellung selbst im Editor ändern kann“).
 *
 * Woher: Der Import (pipeline/abenteuer/pixellabimport.py) legt jeden weiteren stehenden Zustand
 * einer Figur unter `figuren-neu/<figur>/standbilder/<kennung>/rotations/<richtung>.png` ab und
 * nennt alle in `standbilder.json` (Liste aus { kennung, name, standard }). Der Standard steht
 * schon in der ersten Reihe des Bogens; die übrigen kommen hier als eigene Reihen hinter die letzte
 * Reihe des Bogens, je Standbild vier Rahmen (rechts, oben, links, unten), sechs je Reihe.
 * Wo sie beginnen und in welcher Ordnung, steht im Paket in `figuren32/standbilder.json`
 * ({ figur: { beginn, kennungen } }); die App liest es in oberwelt/figurzustand.ts.
 * Fehlt eine Seitenansicht, gilt die gespiegelte andere; fehlt oben, das Standbild nach unten.
 * Jedes Standbild steht mit den Füßen auf FUSSZEILE wie die übrigen Standbilder.
 * Abhängigkeiten: figurenbogen.mjs (Rahmen, Spiegeln, Fußzeile).
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { aufFusszeile, gespiegelt, standbildAus } from "./figurenbogen.mjs";

/** Richtungen in der Ordnung des Bogens mit Spiegelpartner (wie RICHTUNGEN in figurenbogen.mjs). */
const RICHTUNGEN = [
  { name: "east", spiegel: "west" },
  { name: "north", spiegel: null },
  { name: "west", spiegel: "east" },
  { name: "south", spiegel: null },
];
/** Rahmen je Standbild und Standbilder je Reihe (24 Rahmen breit). */
export const RAHMEN_JE_STANDBILD = 4;
const DATEI = "standbilder.json";
const KENNUNG = /^[a-z0-9][a-z0-9-]{0,39}$/;

/** Die Einträge aus standbilder.json ohne den Standard, nur gültige Kennungen; leer ohne Datei. */
async function eintraege(ordner) {
  const pfad = join(ordner, DATEI);
  if (!existsSync(pfad)) return [];
  const liste = JSON.parse(await readFile(pfad, "utf8"));
  return (Array.isArray(liste) ? liste : []).filter(
    (e) => e && !e.standard && typeof e.kennung === "string" && KENNUNG.test(e.kennung),
  );
}

/** Die vier Rahmen eines Standbilds (Ordnung des Bogens), oder null ohne Südansicht. */
async function vierRahmen(ordner) {
  const roh = {};
  for (const { name } of RICHTUNGEN) roh[name] = await standbildAus(ordner, name);
  if (!roh.south) return null;
  const still = RICHTUNGEN.map(({ name, spiegel }) => {
    const partner = spiegel ? roh[spiegel] : null;
    return roh[name] ?? (partner ? gespiegelt(partner) : null) ?? roh.south;
  });
  return aufFusszeile(still.map((s) => ({ still: s }))).map((r) => r.still);
}

/**
 * Die weiteren Standbilder einer Figur: Kennungen und je vier Rahmen; leer ohne Ordner.
 * Beispiel: figuren-neu/abe mit standbilder/without-telescope → { kennungen: ["without-telescope"],
 * rahmen: [[rechts, oben, links, unten]] }.
 */
export async function weitereStandbilder(ordner) {
  const kennungen = [];
  const rahmen = [];
  for (const e of await eintraege(ordner)) {
    const vier = await vierRahmen(join(ordner, "standbilder", e.kennung));
    if (!vier) continue;
    kennungen.push(e.kennung);
    rahmen.push(vier);
  }
  return { kennungen, rahmen };
}
