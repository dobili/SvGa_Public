// Baut das Zusatzpaket des Schach-Abenteuers nach public/abenteuer/ (docs/spiel/04_Architektur.md,
// Abschnitt 7).
//
// Warum: Die Inhalte des Spiels liegen als Quellen in inhalte/abenteuer/ (JSON, Ink, Tiled);
// ausgeliefert wird ein Paket mit Verzeichnisdatei (Version, Dateien, Prüfsummen), das die App
// erst auf Wunsch in ihren Cache lädt. public/abenteuer/ ist erzeugt und in .gitignore.
// Schritte: Daten kopieren, Ink-Dialoge mit dem Compiler von inkjs nach JSON übersetzen,
// Platzhaltergrafik zeichnen (Schritt 5: bis die LimeZu-Kacheln da sind), paket.json schreiben.
// Aufruf: node skripte/baue-abenteuerpaket.mjs (läuft in „npm run vorbereiten“).
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { kompakteKarte, ladbareKarten } from "./abenteuerpaket-auswahl.mjs";
import { schreibeMoebel } from "./abenteuerpaket-moebel.mjs";
import {
  platzhalterFigur,
  platzhalterHeld,
  platzhalterKacheln,
  platzhalterRechteck,
} from "./platzhaltergrafik.mjs";
import { baueFigurenbogen } from "./figurenbogen.mjs";
import { brettbilderDateien } from "./brettbilder-paket.mjs";
import { alsWebp, webpPfad, wirdWebp } from "./paketbilder.mjs";
import { alsGrossbild, HOCHGELADEN } from "./grossbilder.mjs";

const require = createRequire(import.meta.url);
const { Compiler } = require("inkjs/compiler/Compiler");
const { CompilerOptions } = require("inkjs/compiler/CompilerOptions");

const HIER = dirname(fileURLToPath(import.meta.url));
const QUELLE = resolve(HIER, "../../inhalte/abenteuer");
/**
 * Gekaufte Grafik (LimeZu, Entscheidung A10; Rückfrage Q17): liegt nur lokal, nie im öffentlichen
 * Repository (.gitignore), wie die Buchquellen. Gibt es dort eine Datei gleichen Namens, nimmt der
 * Paketbau sie statt des Platzhalters.
 */
const PRIVAT =
  [
    // Nur zum Ausprobieren (etwa mit Probebildern): ein anderer Ordner im Aufbau von spiel/.
    process.env.ABENTEUER_PRIVAT ? resolve(process.env.ABENTEUER_PRIVAT) : "",
    resolve(HIER, "../inhalte-privat/abenteuer"),
    // Zugeschnittene Bilder aus dem privaten Repository (skripte/hole-privatgrafik.mjs).
    resolve(HIER, "../inhalte-privat/quelle/spiel"),
  ].find((ordner) => existsSync(ordner)) ?? resolve(HIER, "../inhalte-privat/abenteuer");
const ZIEL = resolve(HIER, "../public/abenteuer");
const PAKET = JSON.parse(await readFile(resolve(HIER, "../package.json"), "utf8"));

/** Die Dateien des Pakets mit Gruppe und Staffel (schnittstelle/paket.ts). */
const dateien = [];
/** Texte der geschriebenen Daten, Karten und Dialoge: Danach richtet sich, welche Möbel ins Paket kommen. */
const texte = [];
/** Die Karten im Paket (Dateiname → kompakter Text): Danach entstehen die Möbelbögen je Ort. */
const kartentexte = new Map();

async function kopiereJson(unterordner, name, gruppe) {
  const inhalt = await readFile(join(QUELLE, name), "utf8");
  const ziel = join(unterordner, name.split("/").pop());
  await schreibe(ziel, inhalt, gruppe);
}

/**
 * Rahmen der Spieloberfläche (Entscheidung G2): alle Dateien aus inhalte/abenteuer/ui (eigene
 * Platzhalter im Pixelstil) und aus dem privaten Ordner ui/ (gekaufte Rahmen aus Modern UI samt
 * eigener rahmen.json). Bei gleichem Namen gewinnt die private Datei.
 */
async function kopiereOberflaeche() {
  const namen = new Set();
  for (const ordner of [join(QUELLE, "ui"), join(PRIVAT, "ui")]) {
    if (existsSync(ordner)) (await readdir(ordner)).forEach((name) => namen.add(name));
  }
  for (const name of [...namen].sort()) {
    const privat = join(PRIVAT, "ui", name);
    const quelle = existsSync(privat) ? privat : join(QUELLE, "ui", name);
    await schreibe(
      `ui/${name}`,
      await readFile(quelle),
      name.endsWith(".json") ? "daten" : "grafik",
    );
  }
}

/**
 * Figuren aus PixelLab (privates Repository, figuren-neu/<name>/): je Ordner ein Bogen
 * figuren32/<name>.png mit Rahmen 32 × 32 (skripte/figurenbogen.mjs). Der Name ist der des alten
 * Bogens (figuren/<name>.png); die App nimmt den neuen, wo es ihn gibt (oberwelt/figurbogen.ts).
 */
async function baueFigurenboegen() {
  const quelle = join(PRIVAT, "figuren-neu");
  if (!existsSync(quelle)) return;
  for (const name of (await readdir(quelle, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()) {
    const bogen = await baueFigurenbogen(join(quelle, name));
    if (bogen) await schreibe(`figuren32/${name}.png`, bogen, "grafik");
  }
}

/** Letzter Akt des Abenteuers (Ton je Akt in akt2 … akt4). */
const LETZTER_AKT = 4;

/**
 * Musik und Geräusche aus dem privaten Repository (Ordner musik/ und klang/, Atmosphäre T1 und T2,
 * docs/spiel/23_Technik_Atmosphaere.md): m4a und ogg, je in ihrer Paketgruppe. Ohne Ordner nichts;
 * das Spiel bleibt dann still (abenteuer/ton/tonspieler.ts).
 */
async function kopiereTon(ordner) {
  const quelle = join(PRIVAT, ordner);
  if (!existsSync(quelle)) return;
  // Akt 1 liegt direkt im Ordner, Akt 2 bis 4 in Unterordnern akt2 … akt4. Ton gehört nicht zum
  // Grundpaket: Das Spiel startet ohne ihn; Akt 1 lädt gleich danach im Hintergrund, spätere
  // Akte beim Betreten (Entscheidung des Autors, 13.11.2026; Messung „zugang“, 15.11.2026: 25 MB
  // Ton hielten den Spielstart auf). Fehlt ein Ton noch, bleibt es still (ton/tonspieler.ts).
  // Im Paket liegen alle flach unter <ordner>/, damit die Kennung im Dialog gleich bleibt.
  const quellen = [{ pfad: quelle, akt: 1 }];
  for (let akt = 2; akt <= LETZTER_AKT; akt++) {
    const unter = join(quelle, `akt${akt}`);
    if (existsSync(unter)) quellen.push({ pfad: unter, akt });
  }
  // Kleine Tabellen zum Ton (musik/einmal.json: Stücke ohne Schleife; klang/pegel.json: Anhebung
  // leiser Geräusche) gehören zum Grundpaket; der Tonspieler liest sie einmal (ton/tonangaben.ts).
  for (const name of (await readdir(quelle)).filter((d) => d.endsWith(".json")).sort()) {
    await schreibe(`${ordner}/${name}`, await readFile(join(quelle, name)), ordner);
  }
  for (const { pfad, akt } of quellen) {
    const namen = (await readdir(pfad)).filter((d) => /\.(m4a|ogg)$/.test(d));
    for (const name of namen.sort()) {
      await schreibe(`${ordner}/${name}`, await readFile(join(pfad, name)), ordner, 1, akt);
    }
  }
}

/**
 * Bilder der Großansicht im Dialog (Atmosphäre T7, `#bild:kennung`) und Fundbilder: WebP aus dem
 * privaten Ordner bilder/, Gruppe grafik; dazu PNG und JPG, die der Autor selbst hochlädt (seit
 * 20.11.2026, skripte/grossbilder.mjs). Ohne Ordner nichts; die Dialogzeile erscheint dann ohne Bild.
 * Sie laden nach dem Start im Hintergrund (Feld hintergrund, Auftrag „Größe und Startzeit“, 20.11.2026).
 */
async function kopiereBilder() {
  const quelle = join(PRIVAT, "bilder");
  if (!existsSync(quelle)) return;
  const alle = await readdir(quelle);
  const namen = alle.filter((d) => d.endsWith(".webp"));
  for (const name of namen.sort()) {
    await schreibe(
      `bilder/${name}`,
      await readFile(join(quelle, name)),
      "grafik",
      1,
      undefined,
      true,
    );
  }
  // Vom Autor hochgeladen (PNG, JPG mit dem Namen aus dem Auftrag): ins Format des Spiels,
  // außer es gibt schon ein zugeschnittenes WebP gleichen Namens (skripte/grossbilder.mjs).
  const hochgeladen = alle.filter((d) => HOCHGELADEN.includes(extname(d).toLowerCase()));
  for (const datei of hochgeladen.sort()) {
    const name = basename(datei, extname(datei));
    if (namen.includes(`${name}.webp`)) continue;
    const webp = await alsGrossbild(await readFile(join(quelle, datei)), name);
    await schreibe(`bilder/${name}.webp`, webp, "grafik", 1, undefined, true);
  }
}

/**
 * Bilder, die es nur mit der gekauften Grafik gibt (Figuren im Format von LimeZu): alle PNG aus
 * dem privaten Ordner; ohne ihn nichts, das Spiel nimmt dann die Platzhalter.
 */
async function kopierePrivatordner(ordner, behalte = () => true, endungen = [".png"]) {
  const quelle = join(PRIVAT, ordner);
  if (!existsSync(quelle)) return;
  const namen = (await readdir(quelle)).filter(
    (d) => endungen.some((e) => d.endsWith(e)) && behalte(d),
  );
  for (const name of namen.sort()) {
    await schreibe(`${ordner}/${name}`, await readFile(join(quelle, name)), "grafik");
  }
}

/** Wurzel des privaten Repositorys (die Pfade „quelle“ der Möbel beziehen sich darauf). */
const PRIVAT_WURZEL = resolve(HIER, "../inhalte-privat/quelle");

/** Eine Grafik: aus dem privaten Ordner, wenn vorhanden, sonst der gezeichnete Platzhalter. */
async function schreibeGrafik(pfad, platzhalter) {
  const privat = join(PRIVAT, pfad);
  if (existsSync(privat)) {
    await schreibe(pfad, await readFile(privat), "grafik");
    return;
  }
  await schreibe(pfad, platzhalter(), "grafik");
}

/**
 * Schreibt eine Datei ins Paket und merkt Größe und Prüfsumme. PNG kommt als verlustfreies WebP
 * ins Paket (skripte/paketbilder.mjs); der Paketlader setzt die Endung beim Lesen um.
 */
async function schreibe(
  quellpfad,
  inhalt,
  gruppe,
  staffel = 1,
  akt = undefined,
  hintergrund = false,
) {
  const bild = typeof inhalt !== "string" && wirdWebp(quellpfad);
  const pfad = bild ? webpPfad(quellpfad) : quellpfad;
  const voll = join(ZIEL, pfad);
  await mkdir(dirname(voll), { recursive: true });
  if (typeof inhalt === "string") texte.push(inhalt);
  const bytes =
    typeof inhalt === "string"
      ? Buffer.from(inhalt, "utf8")
      : bild
        ? await alsWebp(inhalt)
        : inhalt;
  await writeFile(voll, bytes);
  dateien.push({
    pfad,
    bytes: bytes.byteLength,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    gruppe,
    staffel,
    // Nur Ton trägt den Akt (auch Akt 1); alles ohne „akt“ gehört zum Grundpaket.
    ...(akt !== undefined ? { akt } : {}),
    // Großbilder laden nach dem Start mit (paket/aktton.ts, Feld hintergrund in schnittstelle/paket.ts).
    ...(hintergrund ? { hintergrund } : {}),
  });
}

/** Übersetzt alle Ink-Dateien einer Sprache; ein Fehler im Ink bricht den Build ab. */
async function uebersetzeDialoge(sprache) {
  const ordner = join(QUELLE, "dialoge", sprache);
  for (const name of (await readdir(ordner)).filter((d) => d.endsWith(".ink"))) {
    const quelle = await readFile(join(ordner, name), "utf8");
    // Alle Besuche zählen: Die Oberwelt meldet Knoten über ihre Besuchszahl (dialog/geschichte.ts),
    // sonst ginge ein Knoten mit nur einer Zeile vor END verloren (Leuchtfeuer, 10.11.2026).
    const geschichte = new Compiler(quelle, new CompilerOptions(null, [], true)).Compile();
    const json = geschichte.ToJson();
    await schreibe(`dialoge/${sprache}/${name.replace(/\.ink$/, ".json")}`, json, "dialoge");
  }
}

async function main() {
  await rm(ZIEL, { recursive: true, force: true });
  await mkdir(ZIEL, { recursive: true });
  for (const name of [
    "gegner.json",
    "karten.json",
    "quests.json",
    "orte.json",
    "begegnungen.json",
    "runden.json",
    "funde.json",
    "laeden.json",
    // Vorführungen der Statisten (Dokument 16, 3.4); die App liest fen und zuege.
    "vorfuehrungen.json",
    "brettbeispiele.json",
    // Gedächtnisstellungen und Simultan (Runde 6, docs/spiel/15 Abschnitt 4).
    "partieformen.json",
    // Startstellungen der kurzen Formate aus Partien Bot gegen Bot (regeln/vorrat.ts).
    "stellungsvorrat.json",
    // Aufbau der Porträtblätter (dialog/portraetblatt.ts): Fassung → Feld, Stimmung → Fassung.
    "portraetblatt.json",
  ]) {
    await kopiereJson("daten", name, "daten");
  }
  // Spieltexte und Dialoge aller vorhandenen Sprachen (Dokument 17); Deutsch ist die Quelle.
  for (const name of (await readdir(join(QUELLE, "texte"))).filter((d) => d.endsWith(".json"))) {
    await kopiereJson("texte", `texte/${name}`, "daten");
  }
  // Nur Karten und Hintergründe, die orte.json erreicht; Karten ohne Einrückung (Paketgröße).
  const orte = JSON.parse(await readFile(join(QUELLE, "orte.json"), "utf8"));
  const ladbar = ladbareKarten(orte);
  for (const name of (await readdir(join(QUELLE, "karten"))).filter((d) => ladbar.dateien.has(d))) {
    const text = kompakteKarte(await readFile(join(QUELLE, "karten", name), "utf8"));
    kartentexte.set(name, text);
    await schreibe(`karten/${name}`, text, "karten");
  }
  for (const sprache of (await readdir(join(QUELLE, "dialoge"), { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()) {
    await uebersetzeDialoge(sprache);
  }
  // Porträts (Q17-2): die erzeugten Pixel-Porträts; ein gleichnamiges Bild im privaten Ordner
  // (gekaufte oder gezeichnete Grafik) geht vor.
  for (const name of (await readdir(join(QUELLE, "portraets"))).filter((d) => d.endsWith(".svg"))) {
    const privat = join(PRIVAT, "portraets", name);
    const quelle = existsSync(privat) ? privat : join(QUELLE, "portraets", name);
    await schreibe(`portraets/${name}`, await readFile(quelle), "grafik");
  }
  await kopiereOberflaeche();
  await kopierePrivatordner("figuren");
  await baueFigurenboegen();
  // Tierbögen der Belebung (pipeline/abenteuer/belebungsbilder.py, Runde 7).
  await kopierePrivatordner("tiere");
  await kopierePrivatordner("portraets");
  // Große Porträts (64 × 64 oder 96 × 96 je Fassung, dialog/Portraet.tsx); fehlen sie, SVG.
  await kopierePrivatordner("portraets/gross", () => true, [".png", ".webp"]);
  // Porträtblätter: je Figur sechs Fassungen à 64 × 64 (3 × 2), portraetblatt.json.
  await kopierePrivatordner("portraets/blatt");
  await kopierePrivatordner("grafik");
  // Motive der Spielkarten (Gemini, Wunsch des Autors 14.11.2026): karten/<kennung>.webp, dazu
  // die Rückseite; ohne Ordner zeichnet der Kartenfächer ein Muster (anbindung/Spielkarte.tsx).
  await kopierePrivatordner("karten", () => true, [".webp"]);
  // Gezeichnete Bretter und Figuren je Brettstil (skripte/brettbilder-paket.mjs).
  for (const { pfad, quelle, gruppe } of await brettbilderDateien(PRIVAT)) {
    await schreibe(pfad, await readFile(quelle), gruppe);
  }
  await kopiereTon("musik");
  await kopiereTon("klang");
  await kopiereBilder();
  await kopierePrivatordner("grafik/karten", (name) => ladbar.hintergruende.has(name));
  // Möbel: je Ort ein Bogen mit den Möbeln seiner Karten (skripte/abenteuerpaket-moebel.mjs).
  const moebelzahlen = await schreibeMoebel({
    quelle: QUELLE,
    privatWurzel: PRIVAT_WURZEL,
    texte,
    orte,
    kartentexte,
    schreibe,
    platzhalter: platzhalterRechteck,
  });
  await schreibeGrafik("grafik/platzhalter.png", platzhalterKacheln);
  await schreibeGrafik("grafik/held.png", () => platzhalterHeld());
  await schreibeGrafik("grafik/figur.png", platzhalterFigur);
  // Die Version: App-Version plus Kurzhash aller Inhalte, damit jede Änderung einen neuen Cache
  // bekommt (Stellungnahme, Abschnitt 4: Schwäche des Maia-Pakets ohne Versionsvergleich).
  const inhaltshash = createHash("sha256")
    .update(dateien.map((d) => `${d.pfad}:${d.sha256}`).join("\n"))
    .digest("hex")
    .slice(0, 8);
  const verzeichnis = {
    version: `${PAKET.version}-${inhaltshash}`,
    appVersion: PAKET.version,
    dateien,
    // Nur das Grundpaket; Ton aller Akte lädt das Spiel nach (paket/aktton.ts).
    bytes: dateien.filter((d) => !d.akt).reduce((summe, d) => summe + d.bytes, 0),
  };
  await writeFile(join(ZIEL, "paket.json"), JSON.stringify(verzeichnis, null, 1));
  console.log(
    `Abenteuerpaket ${verzeichnis.version}: ${dateien.length} Dateien, ${(verzeichnis.bytes / 1024).toFixed(0)} KB; ` +
      `${moebelzahlen.moebel} Möbel auf ${moebelzahlen.boegen} Bögen je Ort (${moebelzahlen.doppelt} doppelt).`,
  );
}

main().catch((fehler) => {
  console.error("Abenteuerpaket konnte nicht gebaut werden:", fehler);
  process.exit(1);
});
