// Kopiert die Aufgaben der Trainer aus inhalte/de/trainer/ nach public/daten/de/trainer/.
//
// Warum: Die Pipeline (pipeline/trainer/, Fable) schreibt die Aufgaben für Taktiktrainer,
// „Falle oder Köder“, Strukturerkenner und die Engine-Prüfung der Übungen nach inhalte/de/trainer/
// (dort liegen sie geprüft gegen ihre Schemas). Die App liest sie aus public/; damit es nur eine
// Quelle gibt, wird bei jedem Build kopiert statt doppelt eingecheckt (wie die Engine).
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const QUELLE = resolve(HIER, "../../inhalte/de/trainer");
const ZIEL = resolve(HIER, "../public/daten/de/trainer");

/** Die Dateien, die die App braucht (Kennungen wie in src/daten/trainerdaten.ts). */
const DATEIEN = ["taktik.json", "falle.json", "struktur.json", "uebungen-engine.json"];

async function main() {
  await mkdir(ZIEL, { recursive: true });
  for (const datei of DATEIEN) {
    await copyFile(join(QUELLE, datei), join(ZIEL, datei));
  }
  console.log(`Trainerdaten nach public/daten/de/trainer/ kopiert (${DATEIEN.length} Dateien).`);
}

main().catch((fehler) => {
  console.error("Trainerdaten konnten nicht kopiert werden:", fehler);
  process.exit(1);
});
