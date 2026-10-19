// Erzeugt die Porträts zur Wahl für eigene Bots (app/public/gegner/wahl-01.svg bis wahl-30.svg).
//
// Warum: Wunsch des Autors (19.10.2026): Eigene Bots bekommen ein Porträt aus einer festen Liste,
// mit Kindern, Jugendlichen, jungen Erwachsenen, Erwachsenen und älteren Menschen, Frauen und
// Männern, und genug Abwechslung bei Haar, Hautfarbe, Brille und Bart. Stil und Rahmen wie bei den
// vorgefertigten Gegnern (skripte/erzeuge-gegnerbilder.mjs; DiceBear „Personas“, Zeichnungen
// Draftbit CC BY 4.0, Code Florian Körner MIT; siehe docs/LIZENZEN.md). Jedes Merkmal steht in
// der Tabelle fest, damit die Beschreibung in i18n/de.json („portraet.wahl-01“) zum Bild passt.
// Die Reihenfolge und Altersgruppen stehen in ui/komponenten/portraetwahl.ts.
//
// Aufruf (im Ordner app/; die Pakete braucht nur dieses Skript, nicht die App):
//   npm install --no-save @dicebear/core@9 @dicebear/personas@9
//   node skripte/erzeuge-portraetwahl.mjs
import { createAvatar } from "@dicebear/core";
import * as personas from "@dicebear/personas";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ZIEL = resolve(dirname(fileURLToPath(import.meta.url)), "../public/gegner");
const GROESSE = 128;
const RUNDUNG = 18;
const HINTERGRUND = ["3b4a6b"];

/** Haarfarben der Personas: dunkel, braun, rot, blond, grau. */
const HAAR = { dunkel: "362c47", braun: "6c4545", rot: "f27d65", blond: "f29c65", grau: "dee1f5" };
/** Hautfarben der Personas, von hell nach dunkel. */
const HAUT = ["eeb4a4", "e7a391", "e5a07e", "d78774", "b16a5b", "92594b", "623d36"];

/**
 * [Frisur, Haarfarbe, Hautfarbe (Stelle in HAUT), Augen, Bart oder null, Mund].
 * Reihenfolge: je sechs Kinder, Jugendliche, junge Erwachsene, Erwachsene, Ältere.
 */
const WAHL = [
  ["pigtails", "braun", 0, "happy", null, "bigSmile"],
  ["bobBangs", "blond", 2, "open", null, "smile"],
  ["curlyBun", "dunkel", 5, "happy", null, "smile"],
  ["cap", "rot", 1, "wink", null, "bigSmile"],
  ["curlyHighTop", "dunkel", 6, "open", null, "smile"],
  ["buzzcut", "blond", 3, "happy", null, "bigSmile"],
  ["long", "dunkel", 4, "open", null, "smirk"],
  ["straightBun", "rot", 0, "happy", null, "smile"],
  ["bobCut", "blond", 2, "glasses", null, "lips"],
  ["fade", "dunkel", 5, "open", null, "smirk"],
  ["mohawk", "braun", 1, "wink", null, "bigSmile"],
  ["beanie", "braun", 3, "open", null, "smile"],
  ["extraLong", "braun", 2, "open", null, "lips"],
  ["curly", "dunkel", 6, "happy", null, "smile"],
  ["bobBangs", "rot", 0, "sunglasses", null, "smirk"],
  ["sideShave", "dunkel", 4, "open", null, "smile"],
  ["bunUndercut", "braun", 1, "open", "shadow", "smirk"],
  ["fade", "blond", 3, "happy", "goatee", "smile"],
  ["bobCut", "dunkel", 5, "glasses", null, "smile"],
  ["long", "blond", 0, "open", null, "lips"],
  ["curlyBun", "braun", 4, "happy", null, "smile"],
  ["shortComboverChops", "dunkel", 2, "open", "beardMustache", "smile"],
  ["buzzcut", "braun", 6, "open", "pyramid", "smirk"],
  ["shortCombover", "rot", 1, "glasses", null, "smile"],
  ["straightBun", "grau", 0, "glasses", null, "smile"],
  ["curlyBun", "grau", 5, "happy", null, "smile"],
  ["bobCut", "grau", 2, "open", null, "lips"],
  ["bald", "grau", 1, "open", "beardMustache", "smile"],
  ["balding", "grau", 6, "glasses", "walrus", "smile"],
  ["shortCombover", "grau", 3, "happy", "goatee", "smirk"],
];

const STELLEN = 2;
mkdirSync(ZIEL, { recursive: true });
WAHL.forEach(([hair, farbe, haut, eyes, bart, mouth], i) => {
  const kennung = `wahl-${String(i + 1).padStart(STELLEN, "0")}`;
  const svg = createAvatar(personas, {
    seed: kennung,
    size: GROESSE,
    radius: RUNDUNG,
    backgroundColor: HINTERGRUND,
    hair: [hair],
    hairColor: [HAAR[farbe]],
    skinColor: [HAUT[haut]],
    eyes: [eyes],
    mouth: [mouth],
    facialHair: bart ? [bart] : undefined,
    facialHairProbability: bart ? 100 : 0,
  }).toString();
  writeFileSync(join(ZIEL, `${kennung}.svg`), svg);
});
console.log(`${WAHL.length} Porträts zur Wahl nach ${ZIEL}`);
