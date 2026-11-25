/**
 * Baut die Figurenbögen aller Ordner unter figuren-neu als PNG in einen Zielordner (ohne Paketbau).
 *
 * Warum: Nach dem Import der PixelLab-Figuren (pipeline/abenteuer/pixellabimport.py, 23.11.2026)
 * braucht die Übersichtsseite für den Autor (pixellabuebersicht.py) die Bögen als PNG; der Paketbau
 * legt sie dagegen als WebP ins Paket. Dieselbe Funktion wie im Paketbau (figurenbogen.mjs).
 *
 * Aufruf (im Ordner app/): node skripte/figurenboegen-ordner.mjs PRIVAT/spiel/figuren-neu ZIEL
 * Abhängigkeiten: figurenbogen.mjs (sharp).
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { baueFigurenbogenMitStandbildern, RAHMEN } from "./figurenbogen.mjs";

const [quelle, ziel] = process.argv.slice(2);
if (!quelle || !ziel) {
  console.error("Aufruf: node skripte/figurenboegen-ordner.mjs FIGUREN_NEU ZIEL");
  process.exit(1);
}
await mkdir(ziel, { recursive: true });
let anzahl = 0;
// Weitere Standbilder (Karteneditor 1.9): Index wie im Paket (figuren32/standbilder.json).
const standbilder = {};
// Hohe Rahmen (32 × 48, figurenbogen.mjs): Index wie im Paket (figuren32/rahmenhoehen.json).
const rahmenhoehen = {};
for (const eintrag of await readdir(quelle, { withFileTypes: true })) {
  if (!eintrag.isDirectory()) continue;
  const bogen = await baueFigurenbogenMitStandbildern(join(quelle, eintrag.name));
  if (bogen) {
    await writeFile(join(ziel, `${eintrag.name}.png`), bogen.bild);
    if (bogen.standbilder) standbilder[eintrag.name] = bogen.standbilder;
    if (bogen.rahmenhoehe !== RAHMEN) rahmenhoehen[eintrag.name] = bogen.rahmenhoehe;
    anzahl += 1;
  }
}
await writeFile(join(ziel, "standbilder.json"), JSON.stringify(standbilder, null, 2));
await writeFile(join(ziel, "rahmenhoehen.json"), JSON.stringify(rahmenhoehen, null, 2));
console.log(`${anzahl} Bögen → ${ziel}`);
