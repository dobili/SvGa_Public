// Kopiert die Aufgaben der Trainer aus inhalte/de/trainer/ nach public/daten/de/trainer/ und
// legt die englische Fassung public/daten/en/trainer/ an.
//
// Warum: Die Pipeline (pipeline/trainer/, Fable) schreibt die Aufgaben für Taktiktrainer,
// „Falle oder Köder“, Strukturerkenner und die Engine-Prüfung der Übungen nach inhalte/de/trainer/
// (dort liegen sie geprüft gegen ihre Schemas). Die App liest sie aus public/; damit es nur eine
// Quelle gibt, wird bei jedem Build kopiert statt doppelt eingecheckt (wie die Engine).
// Englisch (R25, P6-Abschluss, 24.10.2026): Die Aufgaben bestehen aus Stellungen, Zügen und
// Kennungen; sichtbar ist nur der Name des Fallenchecks bei Aufgaben aus dem Buch. Den nimmt die
// englische Fassung aus den englischen Buchdaten (Fallencheck mit derselben Stoppabbildung), damit
// er zur übersetzten Abbildung passt. Ohne englischen Namen bleibt der deutsche.
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const QUELLE = resolve(HIER, "../../inhalte/de/trainer");
const DATEN = resolve(HIER, "../public/daten");
const ZIEL_DE = join(DATEN, "de/trainer");
const ZIEL_EN = join(DATEN, "en/trainer");
const BUCH_EN = join(DATEN, "en/a1");

/** Die Dateien, die die App braucht (Kennungen wie in src/daten/trainerdaten.ts). */
const DATEIEN = [
  "taktik.json",
  "falle.json",
  "struktur.json",
  "endspiel.json",
  "uebungen-engine.json",
];

/** Stoppabbildung → englischer Name des Fallenchecks, aus allen englischen Kapiteln. */
async function englischeFallennamen() {
  const namen = new Map();
  for (const datei of await readdir(BUCH_EN)) {
    if (!/^kap\d{2}\.json$/.test(datei)) continue;
    const kapitel = JSON.parse(await readFile(join(BUCH_EN, datei), "utf8"));
    for (const falle of kapitel.fallenchecks ?? []) namen.set(falle.stopp, falle.name);
  }
  return namen;
}

/** „Falle oder Köder“ englisch: nur die Namen der Fallenchecks aus dem Buch tauschen. */
async function schreibeFalleEnglisch() {
  const namen = await englischeFallennamen();
  const daten = JSON.parse(await readFile(join(QUELLE, "falle.json"), "utf8"));
  for (const aufgabe of daten.aufgaben) {
    const herkunft = aufgabe.herkunft;
    if (herkunft?.quelle === "buch" && herkunft.fallencheck && namen.has(herkunft.abbildung)) {
      herkunft.fallencheck = namen.get(herkunft.abbildung);
    }
  }
  await writeFile(join(ZIEL_EN, "falle.json"), JSON.stringify(daten));
}

async function main() {
  await mkdir(ZIEL_DE, { recursive: true });
  await mkdir(ZIEL_EN, { recursive: true });
  for (const datei of DATEIEN) {
    await copyFile(join(QUELLE, datei), join(ZIEL_DE, datei));
    if (datei !== "falle.json") await copyFile(join(QUELLE, datei), join(ZIEL_EN, datei));
  }
  await schreibeFalleEnglisch();
  console.log(
    `Trainerdaten nach public/daten/de/trainer/ und en/trainer/ (${DATEIEN.length} Dateien).`,
  );
}

main().catch((fehler) => {
  console.error("Trainerdaten konnten nicht kopiert werden:", fehler);
  process.exit(1);
});
