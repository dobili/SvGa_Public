// Kopiert die Engine Stockfish 19 (lite, ein Kern) aus node_modules nach public/engine/.
//
// Warum: Die Engine-Dateien sind groß und stehen unverändert im npm-Paket „stockfish“
// (GPL-3.0). Sie werden deshalb nicht ins Repository gelegt, sondern bei jedem Build kopiert.
// Die Einkern-Variante braucht keine besonderen Server-Kopfzeilen (Cross-Origin-Isolation)
// und läuft auch auf älteren iPhones (Konzept Abschnitt 2, Entscheidung vom 13.10.2026).
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const QUELLE = resolve(HIER, "../node_modules/stockfish");
const ZIEL = resolve(HIER, "../public/engine");

/** Die Dateien der Engine-Variante „lite-single“ und der Lizenztext. */
const DATEIEN = [
  ["bin/stockfish-19-lite-single.js", "stockfish-19-lite-single.js"],
  ["bin/stockfish-19-lite-single.wasm", "stockfish-19-lite-single.wasm"],
  ["Copying.txt", "LIZENZ-stockfish.txt"],
];

async function main() {
  await mkdir(ZIEL, { recursive: true });
  for (const [von, nach] of DATEIEN) {
    await copyFile(join(QUELLE, von), join(ZIEL, nach));
  }
  console.log(`Engine nach public/engine/ kopiert (${DATEIEN.length} Dateien).`);
}

main().catch((fehler) => {
  console.error("Engine konnte nicht kopiert werden:", fehler);
  process.exit(1);
});
