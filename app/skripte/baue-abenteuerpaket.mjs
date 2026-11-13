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
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { genutzteMoebel, kompakteKarte, ladbareKarten } from "./abenteuerpaket-auswahl.mjs";

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
    resolve(HIER, "../inhalte-privat/abenteuer"),
    // Zugeschnittene Bilder aus dem privaten Repository (skripte/hole-privatgrafik.mjs).
    resolve(HIER, "../inhalte-privat/quelle/spiel"),
  ].find((ordner) => existsSync(ordner)) ?? resolve(HIER, "../inhalte-privat/abenteuer");
const ZIEL = resolve(HIER, "../public/abenteuer");
const PAKET = JSON.parse(await readFile(resolve(HIER, "../package.json"), "utf8"));

/** Kachelgröße des Prototyps und Farben der acht Platzhalterkacheln (inhalte/abenteuer/README.md). */
const KACHEL = 16;
const KACHELFARBEN = [
  [200, 181, 142], // 1 Boden
  [92, 66, 40], // 2 Wand
  [154, 107, 58], // 3 Kiste
  [122, 59, 59], // 4 Teppich
  [47, 107, 79], // 5 Brett
  [140, 140, 140], // 6 Treppe
  [240, 208, 112], // 7 Lampe
  [158, 197, 232], // 8 Fenster
];
/** Farben des Helden: Körper und das Merkmal, das die Blickrichtung zeigt. */
const HELD_KOERPER = [38, 70, 120];
const HELD_GESICHT = [255, 220, 180];
/** Farbe der übrigen Figuren (ein Platzhalter für alle, bis die Spritesheets da sind). */
const FIGUR_KOERPER = [120, 60, 90];

/** Die Dateien des Pakets mit Gruppe und Staffel (schnittstelle/paket.ts). */
const dateien = [];
/** Texte der geschriebenen Daten, Karten und Dialoge: Danach richtet sich, welche Möbel ins Paket kommen. */
const texte = [];

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
  // Akt 1 liegt direkt im Ordner und kommt ins Grundpaket; Akt 2 bis 4 in Unterordnern akt2 …
  // akt4 und werden erst beim Betreten des Akts nachgeladen (Entscheidung des Autors, 13.11.2026).
  // Im Paket liegen alle flach unter <ordner>/, damit die Kennung im Dialog gleich bleibt.
  const quellen = [{ pfad: quelle, akt: 1 }];
  for (let akt = 2; akt <= LETZTER_AKT; akt++) {
    const unter = join(quelle, `akt${akt}`);
    if (existsSync(unter)) quellen.push({ pfad: unter, akt });
  }
  for (const { pfad, akt } of quellen) {
    const namen = (await readdir(pfad)).filter((d) => /\.(m4a|ogg)$/.test(d));
    for (const name of namen.sort()) {
      await schreibe(`${ordner}/${name}`, await readFile(join(pfad, name)), ordner, 1, akt);
    }
  }
}

/**
 * Bilder der Großansicht im Dialog (Atmosphäre T7, `#bild:kennung`): WebP aus dem privaten Ordner
 * bilder/, Gruppe grafik. Ohne Ordner nichts; die Dialogzeile erscheint dann ohne Bild.
 */
async function kopiereBilder() {
  const quelle = join(PRIVAT, "bilder");
  if (!existsSync(quelle)) return;
  const namen = (await readdir(quelle)).filter((d) => d.endsWith(".webp"));
  for (const name of namen.sort()) {
    await schreibe(`bilder/${name}`, await readFile(join(quelle, name)), "grafik");
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
const MOEBEL_GRUND = [150, 120, 90];
const MOEBEL_RAND = [58, 58, 80];

/**
 * Alle Möbel aus inhalte/abenteuer/moebel/<ort>.json in einem Objekt Name → Angabe.
 *
 * Warum: Jeder Ort hat seit Runde 4 seine eigene Möbeldatei (weniger Merge-Konflikte, wenn mehrere
 * Helfer parallel bauen); die App kennt weiter eine einzige daten/moebel.json im Paket. Namen sind
 * über alle Dateien eindeutig (wie pipeline/abenteuer/moebelliste.py); ein doppelter Name bricht ab.
 */
async function ladeMoebelliste() {
  const ordner = join(QUELLE, "moebel");
  const alle = {};
  const herkunft = {};
  for (const datei of (await readdir(ordner)).filter((d) => d.endsWith(".json")).sort()) {
    const { moebel } = JSON.parse(await readFile(join(ordner, datei), "utf8"));
    for (const [name, angabe] of Object.entries(moebel)) {
      if (name in alle) throw new Error(`Möbelname doppelt: ${name} (${herkunft[name]}, ${datei})`);
      alle[name] = angabe;
      herkunft[name] = datei;
    }
  }
  return alle;
}

/**
 * Möbel und Schmuck: daten/moebel.json aus allen Ortsdateien und je Möbel das Bild aus dem privaten
 * Repository, sonst ein Platzhalter in der angegebenen Größe (braune Fläche mit dunklem Rand),
 * damit Karten immer vollständig laden.
 */
async function schreibeMoebel() {
  // Nur Möbel, die eine Karte, die Daten oder ein Dialog nennen (abenteuerpaket-auswahl.mjs).
  const moebel = genutzteMoebel(await ladeMoebelliste(), texte);
  await schreibe("daten/moebel.json", JSON.stringify({ moebel }, null, 2) + "\n", "daten");
  for (const [name, angabe] of Object.entries(moebel)) {
    // Umgefärbte Fassung zuerst: durchscheinender statt grauer Festschatten (werkzeuge/schatten.py
    // im privaten Repository; Rückmeldung des Autors zum grauen Schleier, 9.11.2026).
    const umgefaerbt = join(PRIVAT_WURZEL, "spiel/schatten", angabe.quelle);
    const quelle = existsSync(umgefaerbt) ? umgefaerbt : join(PRIVAT_WURZEL, angabe.quelle);
    const bild = existsSync(quelle)
      ? await readFile(quelle)
      : platzhalterRechteck(angabe.breite, angabe.hoehe);
    await schreibe(`moebel/${name}.png`, bild, "grafik");
  }
}

function platzhalterRechteck(breite, hoehe) {
  const pixel = Buffer.alloc(breite * hoehe * 4);
  for (let y = 0; y < hoehe; y++) {
    for (let x = 0; x < breite; x++) {
      const rand = x === 0 || y === 0 || x === breite - 1 || y === hoehe - 1;
      setzePixel(pixel, breite, x, y, rand ? MOEBEL_RAND : MOEBEL_GRUND);
    }
  }
  return pngAus(breite, hoehe, pixel);
}

/** Schreibt eine Datei ins Paket und merkt Größe und Prüfsumme. */
/** Eine Grafik: aus dem privaten Ordner, wenn vorhanden, sonst der gezeichnete Platzhalter. */
async function schreibeGrafik(pfad, platzhalter) {
  const privat = join(PRIVAT, pfad);
  if (existsSync(privat)) {
    await schreibe(pfad, await readFile(privat), "grafik");
    return;
  }
  await schreibe(pfad, platzhalter(), "grafik");
}

async function schreibe(pfad, inhalt, gruppe, staffel = 1, akt = 1) {
  const voll = join(ZIEL, pfad);
  await mkdir(dirname(voll), { recursive: true });
  if (typeof inhalt === "string") texte.push(inhalt);
  const bytes = typeof inhalt === "string" ? Buffer.from(inhalt, "utf8") : inhalt;
  await writeFile(voll, bytes);
  dateien.push({
    pfad,
    bytes: bytes.byteLength,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    gruppe,
    staffel,
    // Nur Ton späterer Akte trägt den Akt; alles ohne „akt“ gehört zum Grundpaket.
    ...(akt > 1 ? { akt } : {}),
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

/** Ein PNG ohne Bibliothek: RGBA, ohne Filter, deflate. Für Platzhalterbilder genügt das. */
function pngAus(breite, hoehe, pixel) {
  const zeilen = Buffer.alloc((breite * 4 + 1) * hoehe);
  for (let y = 0; y < hoehe; y++) {
    zeilen[y * (breite * 4 + 1)] = 0;
    pixel.copy(zeilen, y * (breite * 4 + 1) + 1, y * breite * 4, (y + 1) * breite * 4);
  }
  const kopf = Buffer.alloc(13);
  kopf.writeUInt32BE(breite, 0);
  kopf.writeUInt32BE(hoehe, 4);
  kopf.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    abschnitt("IHDR", kopf),
    abschnitt("IDAT", deflateSync(zeilen)),
    abschnitt("IEND", Buffer.alloc(0)),
  ]);
}

function abschnitt(typ, daten) {
  const laenge = Buffer.alloc(4);
  laenge.writeUInt32BE(daten.length, 0);
  const typUndDaten = Buffer.concat([Buffer.from(typ, "ascii"), daten]);
  const pruefsumme = Buffer.alloc(4);
  pruefsumme.writeUInt32BE(crc32(typUndDaten), 0);
  return Buffer.concat([laenge, typUndDaten, pruefsumme]);
}

const CRC_TABELLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(daten) {
  let c = 0xffffffff;
  for (const byte of daten) c = CRC_TABELLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function setzePixel(pixel, breite, x, y, [r, g, b], a = 255) {
  const i = (y * breite + x) * 4;
  pixel[i] = r;
  pixel[i + 1] = g;
  pixel[i + 2] = b;
  pixel[i + 3] = a;
}

/** Der Kachelsatz des Prototyps: 4 × 4 Kacheln, davon acht gefüllt, mit dunklem Rand je Kachel. */
function platzhalterKacheln() {
  const breite = KACHEL * 4;
  const pixel = Buffer.alloc(breite * breite * 4);
  KACHELFARBEN.forEach((farbe, index) => {
    const kx = (index % 4) * KACHEL;
    const ky = Math.floor(index / 4) * KACHEL;
    for (let y = 0; y < KACHEL; y++) {
      for (let x = 0; x < KACHEL; x++) {
        const rand = x === 0 || y === 0 || x === KACHEL - 1 || y === KACHEL - 1;
        const dunkel = farbe.map((w) => Math.round(w * 0.8));
        // Das Brett (Kachel 5) bekommt ein Schachbrettmuster, damit es auffällt.
        const feld = index === 4 && (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0;
        setzePixel(pixel, breite, kx + x, ky + y, rand ? dunkel : feld ? [230, 220, 190] : farbe);
      }
    }
  });
  return pngAus(breite, breite, pixel);
}

/** Der Held: vier Bilder (unten, links, rechts, oben) als Spritesheet 64 × 16. */
function platzhalterHeld(koerper = HELD_KOERPER) {
  const breite = KACHEL * 4;
  const pixel = Buffer.alloc(breite * KACHEL * 4);
  const gesichter = [
    [6, 10, 4, 3], // unten: Gesicht unten
    [3, 5, 3, 6], // links
    [10, 5, 3, 6], // rechts
    [6, 3, 4, 3], // oben
  ];
  gesichter.forEach(([gx, gy, gb, gh], richtung) => {
    const kx = richtung * KACHEL;
    for (let y = 2; y < KACHEL - 1; y++) {
      for (let x = 3; x < KACHEL - 3; x++) setzePixel(pixel, breite, kx + x, y, koerper);
    }
    for (let y = gy; y < gy + gh; y++) {
      for (let x = gx; x < gx + gb; x++) setzePixel(pixel, breite, kx + x, y, HELD_GESICHT);
    }
  });
  return pngAus(breite, KACHEL, pixel);
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
    // Gedächtnisstellungen und Simultan (Runde 6, docs/spiel/15 Abschnitt 4).
    "partieformen.json",
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
  const ladbar = ladbareKarten(JSON.parse(await readFile(join(QUELLE, "orte.json"), "utf8")));
  for (const name of (await readdir(join(QUELLE, "karten"))).filter((d) => ladbar.dateien.has(d))) {
    const text = await readFile(join(QUELLE, "karten", name), "utf8");
    await schreibe(`karten/${name}`, kompakteKarte(text), "karten");
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
  // Tierbögen der Belebung (pipeline/abenteuer/belebungsbilder.py, Runde 7).
  await kopierePrivatordner("tiere");
  await kopierePrivatordner("portraets");
  // Große Porträts (64 × 64 oder 96 × 96 je Fassung, dialog/Portraet.tsx); fehlen sie, SVG.
  await kopierePrivatordner("portraets/gross", () => true, [".png", ".webp"]);
  // Porträtblätter: je Figur sechs Fassungen à 64 × 64 (3 × 2), portraetblatt.json.
  await kopierePrivatordner("portraets/blatt");
  await kopierePrivatordner("grafik");
  await kopiereTon("musik");
  await kopiereTon("klang");
  await kopiereBilder();
  await kopierePrivatordner("grafik/karten", (name) => ladbar.hintergruende.has(name));
  await schreibeMoebel();
  await schreibeGrafik("grafik/platzhalter.png", platzhalterKacheln);
  await schreibeGrafik("grafik/held.png", () => platzhalterHeld());
  await schreibeGrafik("grafik/figur.png", () => platzhalterHeld(FIGUR_KOERPER));
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
    // Nur das Grundpaket; Ton späterer Akte lädt das Spiel nach (paket/aktton.ts).
    bytes: dateien.filter((d) => !d.akt).reduce((summe, d) => summe + d.bytes, 0),
  };
  await writeFile(join(ZIEL, "paket.json"), JSON.stringify(verzeichnis, null, 1));
  console.log(
    `Abenteuerpaket ${verzeichnis.version}: ${dateien.length} Dateien, ${(verzeichnis.bytes / 1024).toFixed(0)} KB.`,
  );
}

main().catch((fehler) => {
  console.error("Abenteuerpaket konnte nicht gebaut werden:", fehler);
  process.exit(1);
});
