// Erzeugt die TypeScript-Typen der Buchdaten aus den JSON-Schemas in /schemas.
//
// Warum: Die Schemas sind der Vertrag zwischen Pipeline und App (Konzept Abschnitt 1).
// Python prüft die Daten beim Erzeugen dagegen, die App bekommt ihre Typen aus denselben
// Dateien. So können beide Seiten nicht auseinanderlaufen.
//
// Ergebnis: src/daten/generiert/*.ts (in .gitignore, wird vor jedem tsc und vite build erzeugt).
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFromFile } from "json-schema-to-typescript";

const HIER = dirname(fileURLToPath(import.meta.url));
const SCHEMA_ORDNER = resolve(HIER, "../../schemas");
const ZIEL_ORDNER = resolve(HIER, "../src/daten/generiert");

/** Kopf jeder erzeugten Datei: Zweck in einem Satz (für Konzeptkarte und Leser), dann die Quelle. */
function kopf(datei) {
  return `// ERZEUGTE DATEI – nicht von Hand bearbeiten.
// Typen der Buchdaten „${modulname(datei)}“ für die App, aus dem Vertrag zwischen Pipeline und App.
// Quelle: schemas/${datei}, erzeugt von app/skripte/erzeuge-typen.mjs.
`;
}

/** Wandelt „abbildung.schema.json“ in den Modulnamen „abbildung“. */
function modulname(dateiname) {
  return dateiname.replace(/\.schema\.json$/, "");
}

async function main() {
  await mkdir(ZIEL_ORDNER, { recursive: true });
  const dateien = (await readdir(SCHEMA_ORDNER)).filter((d) => d.endsWith(".schema.json"));
  for (const datei of dateien) {
    // Querverweise ($ref auf andere Schemas) löst der Compiler relativ zum Schema-Ordner auf.
    const code = await compileFromFile(join(SCHEMA_ORDNER, datei), {
      cwd: SCHEMA_ORDNER,
      bannerComment: kopf(datei),
      additionalProperties: false,
      style: { printWidth: 100 },
    });
    await writeFile(join(ZIEL_ORDNER, `${modulname(datei)}.ts`), code);
  }
  console.log(`Typen aus ${dateien.length} Schemas nach src/daten/generiert/ geschrieben.`);
}

main().catch((fehler) => {
  console.error("Typen konnten nicht erzeugt werden:", fehler);
  process.exit(1);
});
