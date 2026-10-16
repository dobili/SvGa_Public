// Prüft nach dem Build, ob die ausgelieferte App ins Größenbudget passt.
//
// Warum: Nach der Installation lädt das Gerät alle Dateien für die Offline-Nutzung.
// Das Konzept (Abschnitt 11.2) setzt dafür eine Obergrenze von 25 MB. Wird sie
// überschritten, schlägt der Build fehl, damit es nicht unbemerkt passiert.
import { readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HIER, "../dist");

/** Obergrenze aus Konzept Abschnitt 11.2: 25 MB. */
const OBERGRENZE_BYTES = 25 * 1024 * 1024;
const BYTES_JE_MB = 1024 * 1024;

/** Summiert die Größe aller Dateien unterhalb eines Ordners. */
async function ordnergroesse(ordner) {
  let summe = 0;
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name);
    summe += eintrag.isDirectory() ? await ordnergroesse(pfad) : (await stat(pfad)).size;
  }
  return summe;
}

async function main() {
  const groesse = await ordnergroesse(DIST);
  const mb = (groesse / BYTES_JE_MB).toFixed(1);
  if (groesse > OBERGRENZE_BYTES) {
    console.error(`Größenbudget überschritten: ${mb} MB (Obergrenze 25 MB).`);
    process.exit(1);
  }
  console.log(`Größenbudget eingehalten: ${mb} MB von 25 MB.`);
}

main().catch((fehler) => {
  console.error("Größe konnte nicht geprüft werden:", fehler);
  process.exit(1);
});
