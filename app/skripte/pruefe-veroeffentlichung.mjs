// Prüft die Fassung für die Leser (AP 17, gebaut mit VEROEFFENTLICHUNG=1): Die Aufgabenseite
// des Autors und die englische Vorschau dürfen nicht in dist/ stehen.
//
// Warum: Beide Teile sind nur für den Autor und die Vorschau gedacht. Der Bundler lässt sie über
// die feste Zahl __VEROEFFENTLICHUNG__ weg; diese Prüfung stellt sicher, dass das auch so bleibt
// (etwa wenn ein neuer Bildschirm die Aufgabenseite direkt einbindet).
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HIER, "../dist");

/** Kennzeichen, die nur in der Aufgabenseite bzw. in en.json vorkommen. */
const VERBOTEN = [
  { name: "Aufgabenseite des Autors", text: "Was noch zu tun ist (für den Autor)" },
  { name: "englische Vorschau", text: "English (preview)" },
];

/** Alle Dateien unterhalb eines Ordners. */
async function dateien(ordner) {
  const liste = [];
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) liste.push(...(await dateien(pfad)));
    else if (/\.(js|html|json|txt)$/.test(eintrag.name)) liste.push(pfad);
  }
  return liste;
}

async function main() {
  const funde = [];
  for (const pfad of await dateien(DIST)) {
    const inhalt = await readFile(pfad, "utf8");
    for (const { name, text } of VERBOTEN) {
      if (inhalt.includes(text)) funde.push(`${name} in ${pfad.slice(DIST.length + 1)}`);
    }
  }
  if (funde.length > 0) {
    console.error(`Fassung für die Leser enthält noch:\n${funde.join("\n")}`);
    process.exit(1);
  }
  console.log("Fassung für die Leser: ohne Aufgabenseite und ohne englische Vorschau.");
}

await main();
