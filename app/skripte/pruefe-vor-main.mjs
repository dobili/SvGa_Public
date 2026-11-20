// Prüft vor dem Schritt nach main, was sich maschinell prüfen lässt (Checkliste
// docs/spiel/auftraege/vor_main_checkliste.md, Vorbereitung vom 20.11.2026).
//
// Warum: Der Schritt nach main bringt das Schach-Abenteuer zu echten Lesern. Dabei darf nichts
// zurückfallen, was nur auf main steht (der Commit „Das Buch ist erschienen“ vom 17.11.2026 fehlte
// beta), die Versionsnummer muss steigen, sonst meldet die installierte App kein Update, und das
// Spielpaket muss mit der echten Grafik gebaut sein (ohne GRAFIK_TOKEN nimmt der Paketbau still
// die Platzhalter).
//
// Aufruf (im Ordner app/, nach `git fetch origin main` und einem Build):
//   node skripte/pruefe-vor-main.mjs
// Ausgabe: je Punkt „ok“ oder „FEHLT“ mit Grund; Ende mit Fehlercode 1, wenn ein Punkt fehlt.
// Sonderfall: Ohne origin/main (kein fetch) melden die Punkte zu main „FEHLT“ mit Hinweis.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HIER, "..");
const DIST = join(APP, "dist");
/** Der Zweig, auf dem die Leser-App liegt. */
const MAIN = "origin/main";
/** Kennzeichen der Testhilfen im Bündel (anbindung/Testleiste.tsx), nur in Bauten für den Autor. */
const TESTHILFE = "Testhilfe des Autors";

/** Ein git-Befehl im Repository; Ausgabe ohne Zeilenende, bei Fehler null. */
function git(...argumente) {
  try {
    return execFileSync("git", argumente, { cwd: APP, encoding: "utf8", stdio: "pipe" }).trim();
  } catch {
    return null;
  }
}

/** Vergleicht zwei Versionen „a.b.c“; Ausgabe wie bei sort (negativ, 0, positiv). */
function vergleicheVersion(a, b) {
  const teile = (v) => v.split(".").map(Number);
  const [x, y] = [teile(a), teile(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const unterschied = (x[i] ?? 0) - (y[i] ?? 0);
    if (unterschied !== 0) return unterschied;
  }
  return 0;
}

/** Version und main: steigt die Nummer, steckt alles von main im aktuellen Stand? */
function pruefeMain(version) {
  const aufMain = git("show", `${MAIN}:app/package.json`);
  if (aufMain === null) {
    return [["Version und main", false, `${MAIN} fehlt (vorher: git fetch origin main)`]];
  }
  const mainVersion = JSON.parse(aufMain).version;
  const fehlend = git("log", "--oneline", `HEAD..${MAIN}`) ?? "";
  return [
    [
      "Versionsnummer steigt",
      vergleicheVersion(version, mainVersion) > 0,
      `hier ${version}, auf main ${mainVersion}`,
    ],
    [
      "alles von main enthalten",
      fehlend === "",
      fehlend === "" ? "ja" : `es fehlen: ${fehlend.split("\n").join("; ")}`,
    ],
  ];
}

/** Spielpaket in dist/: vorhanden, zur Version passend, mit echter Grafik (Großbilder)? */
function pruefePaket(version) {
  const pfad = join(DIST, "abenteuer", "paket.json");
  if (!existsSync(pfad)) return [["Spielpaket gebaut", false, "dist/abenteuer/paket.json fehlt"]];
  const paket = JSON.parse(readFileSync(pfad, "utf8"));
  const bilder = join(DIST, "abenteuer", "bilder");
  const grossbilder = existsSync(bilder) ? readdirSync(bilder).length : 0;
  return [
    ["Spielpaket gebaut", true, `${paket.version}, ${paket.dateien.length} Dateien`],
    ["Paket zur App-Version", paket.appVersion === version, `Paket ${paket.appVersion}`],
    [
      "echte Grafik (nicht Platzhalter)",
      grossbilder > 0,
      grossbilder > 0 ? `${grossbilder} Einträge in bilder/` : "keine Großbilder: GRAFIK_TOKEN?",
    ],
  ];
}

/** Welche Fassung liegt in dist/? Nur zur Auskunft (main baut bis 1.0 die Fassung des Autors). */
function fassung() {
  const assets = join(DIST, "assets");
  if (!existsSync(assets)) return "kein Build";
  const mitTesthilfe = readdirSync(assets)
    .filter((n) => n.endsWith(".js"))
    .some((n) => readFileSync(join(assets, n), "utf8").includes(TESTHILFE));
  return mitTesthilfe ? "Fassung des Autors (mit Testleiste)" : "Fassung für die Leser";
}

function main() {
  const version = JSON.parse(readFileSync(join(APP, "package.json"), "utf8")).version;
  const sauber = (git("status", "--porcelain") ?? "x") === "";
  const punkte = [
    ["Arbeitsstand eingecheckt", sauber, sauber ? "ja" : "ungespeicherte Änderungen"],
    ...pruefeMain(version),
    ...pruefePaket(version),
  ];
  for (const [name, ok, grund] of punkte)
    console.log(`${ok ? "ok   " : "FEHLT"} ${name}: ${grund}`);
  console.log(`Info  Build in dist/: ${fassung()}`);
  if (punkte.some(([, ok]) => !ok)) process.exit(1);
}

main();
