// Prüft nach dem Build, ob die ausgelieferte App ins Größenbudget passt.
//
// Warum: Nach der Installation lädt das Gerät alle Dateien für die Offline-Nutzung.
// Das Konzept (Abschnitt 11.2) setzt dafür eine Obergrenze von 25 MB. Wird sie
// überschritten, schlägt der Build fehl, damit es nicht unbemerkt passiert.
// Seit V4 (Nutzungsprüfung 25.10.2026) lädt das Gerät nicht mehr alles vorab: Die Dateien einer
// weiteren Sprache (daten/en/**, assets/sprachpaket-en-…js) kommen erst, wenn der Leser sie wählt
// (src/sw/dateiliste.ts). Die Obergrenze gilt weiter für alles zusammen (wer Englisch wählt, hat
// beides auf dem Gerät); zusätzlich steht da, wie viel davon vorab lädt.
import { readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HIER, "../dist");

/** Obergrenze aus Konzept Abschnitt 11.2: 25 MB. */
const OBERGRENZE_BYTES = 25 * 1024 * 1024;
const BYTES_JE_MB = 1024 * 1024;

/** Dateien eines Sprachpakets, wie in src/sw/dateiliste.ts (Deutsch gehört zum Kern). */
const SPRACHPAKET = /^(daten\/(?!de\/)[a-z]{2}\/|assets\/sprachpaket-(?!de-)[a-z]{2}-)/;
/** Nicht in der Dateiliste des Service Workers (vite.config.ts, globIgnores). */
const NICHT_IN_DER_LISTE = /^admin\//;
/**
 * Das Maia-Zusatzpaket (0.2.141, Entscheidung des Autors 25.10.2026): auf Wunsch nachgeladen,
 * etwa 96 MB, zählt nicht zur Obergrenze der App; es wird eigens ausgewiesen.
 */
const ZUSATZPAKET = /^maia\//;

/** Größe aller Dateien unterhalb eines Ordners, getrennt nach Kern, Sprachpaketen und Rest. */
async function ordnergroesse(
  ordner,
  summen = { alles: 0, sprachpakete: 0, ohneListe: 0, zusatz: 0 },
) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) {
      await ordnergroesse(pfad, summen);
      continue;
    }
    const groesse = (await stat(pfad)).size;
    const relativ = relative(DIST, pfad).split(sep).join("/");
    if (ZUSATZPAKET.test(relativ)) {
      summen.zusatz += groesse;
      continue;
    }
    summen.alles += groesse;
    if (SPRACHPAKET.test(relativ)) summen.sprachpakete += groesse;
    else if (NICHT_IN_DER_LISTE.test(relativ)) summen.ohneListe += groesse;
  }
  return summen;
}

/** Bytes als Megabyte mit einer Nachkommastelle. */
function mb(bytes) {
  return (bytes / BYTES_JE_MB).toFixed(1);
}

async function main() {
  const { alles, sprachpakete, ohneListe, zusatz } = await ordnergroesse(DIST);
  if (alles > OBERGRENZE_BYTES) {
    console.error(`Größenbudget überschritten: ${mb(alles)} MB (Obergrenze 25 MB).`);
    process.exit(1);
  }
  const vorab = alles - sprachpakete - ohneListe;
  console.log(
    `Größenbudget eingehalten: ${mb(alles)} MB von 25 MB ` +
      `(vorab geladen höchstens ${mb(vorab)} MB, Sprachpakete auf Wahl ${mb(sprachpakete)} MB); ` +
      `Zusatzpaket Maia ${mb(zusatz)} MB.`,
  );
}

main().catch((fehler) => {
  console.error("Größe konnte nicht geprüft werden:", fehler);
  process.exit(1);
});
