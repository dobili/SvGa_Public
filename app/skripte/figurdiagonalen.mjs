/**
 * Diagonale Reihen im Figurenbogen (Wunsch des Autors, 26.11.2026: „Ich habe Animationen für
 * diagonale Bewegung hinzugefügt … diagonales Laufen für den Protagonisten“).
 *
 * Woher: pipeline/abenteuer/pixellabdiagonal.py legt bei Held, Heldin, Juno und Mama die Schrägen ab:
 * `figuren-neu/<figur>/rotations/<schraege>.png` und `animations/Walking|Running/<schraege>/`.
 * Andere Figuren haben keine Schrägen und bekommen keine Reihen; ihre Bögen bleiben byte-gleich.
 *
 * Aufbau: drei Reihen hinter der letzten Reihe des Bogens (auch hinter weiteren Standbildern),
 * damit alle bisherigen Rahmennummern bleiben. Ordnung der Schrägen RECHTS_OBEN, LINKS_OBEN,
 * LINKS_UNTEN, RECHTS_UNTEN (PixelLab north-east, north-west, south-west, south-east):
 * - Reihe 1: vier Standbilder (Rahmen beginn … beginn + 3),
 * - Reihe 2: Gehen, sechs Bilder je Schräge (beginn + 24 …),
 * - Reihe 3: Rennen, sechs Bilder je Schräge (beginn + 48 …).
 * Wo sie beginnen, steht im Index figuren32/diagonalen.json ({ figur: beginn }); die App liest ihn
 * in oberwelt/figurbogen.ts.
 * Fehlt eine Schräge, gilt ihr Spiegelbild (Nordost ↔ Nordwest, Südost ↔ Südwest; die Heldin hat
 * kein Rennen Südwest); fehlt das Rennen, die Gehbilder. Die Füße stehen um denselben Versatz
 * verschoben wie die geraden Bilder (aufFusszeile in figurenbogen.mjs), damit nichts springt.
 * Abhängigkeiten: sharp, figurenbogen.mjs.
 */
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import {
  fusszeileFuer,
  gespiegelt,
  laufrahmen,
  leinwandmasse,
  standbildAus,
  untersteZeile,
  verschoben,
  zeilenVon,
} from "./figurenbogen.mjs";

/** Die Schrägen in der Ordnung des Bogens mit ihrem Spiegelpartner. */
export const SCHRAEGEN = [
  { name: "north-east", spiegel: "north-west" },
  { name: "north-west", spiegel: "north-east" },
  { name: "south-west", spiegel: "south-east" },
  { name: "south-east", spiegel: "south-west" },
];
/** Gerade Richtungen (für den Fußversatz wie in figurenbogen.mjs). */
const GERADE = ["east", "north", "west", "south"];
const LAUFBILDER = 6;
/** Reihen der Schrägen: Standbilder, Gehen, Rennen. */
export const DIAGONALREIHEN = 3;

/** Die bis zu sechs Bilder einer Animation in einer Schräge als Rahmen, oder null. */
async function animation(ordner, name, richtung, masse) {
  const pfad = join(ordner, "animations", name, richtung);
  if (!existsSync(pfad)) return null;
  const namen = (await readdir(pfad)).filter((n) => n.endsWith(".png")).sort();
  if (namen.length === 0) return null;
  return Promise.all(
    namen.slice(0, LAUFBILDER).map(async (n) => {
      const { data, info } = await sharp(join(pfad, n))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const bild = { pixel: data, breite: info.width, hoehe: info.height };
      return laufrahmen(bild, masse.breite, masse.hoehe);
    }),
  );
}

/**
 * Versatz der Füße wie aufFusszeile: tiefste Zeile der geraden Standbilder auf die Fußzeile.
 * Beispiel: Held mit Füßen auf Zeile 30 → 0.
 */
async function fussversatz(ordner, masse) {
  const still = (await Promise.all(GERADE.map((r) => standbildAus(ordner, r, masse)))).filter(
    Boolean,
  );
  const tiefste = Math.max(-1, ...still.map(untersteZeile));
  return tiefste < 0 ? 0 : fusszeileFuer(zeilenVon(still[0])) - tiefste;
}

/** Eigene Bilder einer Schräge oder das Spiegelbild des Partners (Rahmenliste), sonst null. */
function oderGespiegelt(eigen, partner) {
  return eigen ?? partner?.map(gespiegelt) ?? null;
}

/**
 * Die drei Reihen der Schrägen einer Figur ({ still, lauf, renn } je Schräge, schon auf der
 * Fußzeile), oder null, wenn die Figur keine Schrägen hat (kein Standbild und kein Gehen).
 * Beispiel: figuren-neu/heldin-0 → vier Schrägen, Rennen Südwest gespiegelt aus Südost.
 */
export async function diagonalreihen(ordner) {
  const masse = await leinwandmasse(ordner);
  const roh = {};
  for (const { name } of SCHRAEGEN) {
    const still = await standbildAus(ordner, name, masse);
    roh[name] = {
      still: still ? [still] : null,
      lauf: await animation(ordner, "Walking", name, masse),
      renn: await animation(ordner, "Running", name, masse),
    };
  }
  if (SCHRAEGEN.every(({ name }) => !roh[name].still && !roh[name].lauf)) return null;
  const dy = await fussversatz(ordner, masse);
  const schiebe = (rahmen) => verschoben(rahmen, dy);
  return SCHRAEGEN.map(({ name, spiegel }) => {
    const eigen = roh[name];
    const partner = roh[spiegel];
    const lauf = oderGespiegelt(eigen.lauf, partner.lauf);
    const still = oderGespiegelt(eigen.still, partner.still)?.[0] ?? lauf?.[0] ?? null;
    const gehen = lauf ?? (still ? Array(LAUFBILDER).fill(still) : []);
    const renn = oderGespiegelt(eigen.renn, partner.renn) ?? gehen;
    return { still: still && schiebe(still), lauf: gehen.map(schiebe), renn: renn.map(schiebe) };
  });
}

/**
 * Legt die drei Reihen ab Reihe `ersteReihe` in den Bogen (`lege` aus figurenbogen.mjs, `leer`
 * für ein fehlendes Bild). Beispiel: Held mit sechs Reihen → Standbilder ab Rahmen 144.
 */
export function legeDiagonalen(reihen, ersteReihe, lege, leer) {
  reihen.forEach((r, i) => {
    lege(r.still ?? leer, i, ersteReihe);
    r.lauf.forEach((rahmen, j) => lege(rahmen, i * LAUFBILDER + j, ersteReihe + 1));
    r.renn.forEach((rahmen, j) => lege(rahmen, i * LAUFBILDER + j, ersteReihe + 2));
  });
}
