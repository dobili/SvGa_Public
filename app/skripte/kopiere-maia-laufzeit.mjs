// Kopiert die WebAssembly-Laufzeit von onnxruntime-web nach public/maia/ort/ (Maia-Zusatzpaket).
//
// Warum: Die Laufzeit (MIT-Lizenz) rechnet das Netz Maia-2 im Browser (src/engine/maia-web.ts).
// Sie ist 11 MB groß und gehört zum Zusatzpaket, das der Leser auf Wunsch lädt (0.2.143); sie wird
// deshalb nicht ins Repository gelegt und nicht vorab geladen (vite.config.ts, globIgnores), sondern
// bei jedem Build aus dem npm-Paket kopiert. Nur die Fassung ohne WebGPU (einfacher, überall da).
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const QUELLE = resolve(HIER, "../node_modules/onnxruntime-web");
const ZIEL = resolve(HIER, "../public/maia/ort");

/** WebAssembly-Laufzeit und ihr Lader (Lizenz MIT, Microsoft; Nachweis in docs/LIZENZEN.md). */
const DATEIEN = [
  ["dist/ort-wasm-simd-threaded.wasm", "ort-wasm-simd-threaded.wasm"],
  ["dist/ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.mjs"],
];

async function main() {
  await mkdir(ZIEL, { recursive: true });
  for (const [von, nach] of DATEIEN) {
    await copyFile(join(QUELLE, von), join(ZIEL, nach));
  }
  console.log(`Maia-Laufzeit nach public/maia/ort/ kopiert (${DATEIEN.length} Dateien).`);
}

main().catch((fehler) => {
  console.error("Maia-Laufzeit konnte nicht kopiert werden:", fehler);
  process.exit(1);
});
