// Möbel des Abenteuerpakets: daten/moebel.json und die Möbelbögen je Ort
// (skripte/baue-abenteuerpaket.mjs ruft `schreibeMoebel`).
//
// Warum je Ort (Auftrag „Leistung“, 16.11.2026): Bis dahin gab es einen Bogen je Ortsdatei
// (inhalte/abenteuer/moebel/<ort>.json). Eine Karte nutzt aber Möbel aus vielen Dateien (vor allem
// allgemein.json), lud im Mittel 4,8 Bögen (bis 13) und hielt dafür im Mittel 2,2 Megapixel
// Textur (8,3 MB im Grafikspeicher, bis 24 MB), von denen sie 0,12 Megapixel brauchte. Jetzt
// bekommt jeder Ort (orte.json) einen Bogen mit genau den Möbeln seiner Karten (samt Zuständen);
// Möbel, die mehrere Orte nutzen, liegen in jedem dieser Bögen. Möbel ohne Karte (nur in Daten
// oder Dialogen genannt) kommen in den Bogen „uebrige“.
// Ausgabe in moebel.json je Möbel: `bogen` und `rahmen` (erster Ort, für alte Leser) und, wenn es
// in mehreren Orten liegt, `jeOrt` { <ort>: { bogen, rahmen } } (src/abenteuer/oberwelt/moebel.ts).
// Abhängigkeiten: sharp, skripte/moebelboegen.mjs, skripte/abenteuerpaket-auswahl.mjs.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { genutzteMoebel } from "./abenteuerpaket-auswahl.mjs";
import { baueMoebelboegen } from "./moebelboegen.mjs";

/** Name des Bogens für Möbel, die keine Karte zeigt. */
export const UEBRIGE = "uebrige";

/**
 * Alle Möbel aus inhalte/abenteuer/moebel/<ort>.json in einem Objekt Name → Angabe.
 *
 * Warum: Jeder Ort hat seit Runde 4 seine eigene Möbeldatei (weniger Merge-Konflikte, wenn mehrere
 * Helfer parallel bauen); die App kennt weiter eine einzige daten/moebel.json im Paket. Namen sind
 * über alle Dateien eindeutig (wie pipeline/abenteuer/moebelliste.py); ein doppelter Name bricht ab.
 */
async function ladeMoebelliste(quelle) {
  const ordner = join(quelle, "moebel");
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

/** „karten/maple-falls-park.json“ → „maple-falls-park.json“ (Schlüssel der Kartentexte). */
function dateiname(pfad) {
  return pfad.split("/").pop();
}

/**
 * Die Möbel je Ort: Namen der Objekte vom Typ „moebel“ in allen Karten des Orts (Grundkarte und
 * Zustände), soweit sie in `moebel` stehen. Eingaben: orte.json, Kartentexte je Dateiname.
 * Ausgabe: Map Ort → sortierte Namen; Orte ohne Möbel fehlen.
 * Beispiel: mapleFalls → [„bett“, „sofa“, …] aus Dachboden, Zimmer, Wohnzimmer, Park …
 */
export function moebelJeOrt(orte, kartentexte, moebel) {
  const jeOrt = new Map();
  for (const ort of orte.orte) {
    const namen = new Set();
    for (const karte of ort.karten) {
      for (const datei of [karte.datei, ...Object.values(karte.zustaende ?? {})]) {
        const text = kartentexte.get(dateiname(datei));
        if (!text) continue;
        for (const ebene of JSON.parse(text).layers ?? []) {
          for (const o of ebene.objects ?? []) {
            if (o.type === "moebel" && o.name && o.name in moebel) namen.add(o.name);
          }
        }
      }
    }
    if (namen.size > 0) jeOrt.set(ort.kennung, [...namen].sort());
  }
  return jeOrt;
}

/**
 * Das Bild eines Möbels aus dem privaten Repository, sonst der Platzhalter in der angegebenen
 * Größe, damit Karten immer vollständig laden.
 */
async function moebelbild(privatWurzel, angabe, platzhalter) {
  // Umgefärbte Fassung zuerst: durchscheinender statt grauer Festschatten (werkzeuge/schatten.py
  // im privaten Repository; Rückmeldung des Autors zum grauen Schleier, 9.11.2026).
  const umgefaerbt = join(privatWurzel, "spiel/schatten", angabe.quelle);
  const quelle = existsSync(umgefaerbt) ? umgefaerbt : join(privatWurzel, angabe.quelle);
  if (!existsSync(quelle)) return platzhalter(angabe.breite, angabe.hoehe);
  if (!angabe.ausschnitt) return readFile(quelle);
  // Kachel aus einem Bogen (pipeline/abenteuer/bodenkacheln.py): links, oben, rechts, unten.
  const [links, oben, rechts, unten] = angabe.ausschnitt;
  return sharp(await readFile(quelle))
    .extract({ left: links, top: oben, width: rechts - links, height: unten - oben })
    .png()
    .toBuffer();
}

/**
 * Schreibt die Möbelbögen je Ort (moebelboegen/<ort>-<n>.png, als WebP im Paket) und
 * daten/moebel.json. Eingaben: { quelle (inhalte/abenteuer), privatWurzel, texte (alle
 * geschriebenen Texte, für genutzteMoebel), orte, kartentexte (Dateiname → Text),
 * schreibe(pfad, inhalt, gruppe), platzhalter(breite, hoehe) }.
 * Ausgabe: Zahlen für die Konsole { boegen, moebel, doppelt }.
 */
export async function schreibeMoebel({
  quelle,
  privatWurzel,
  texte,
  orte,
  kartentexte,
  schreibe,
  platzhalter,
}) {
  const moebel = genutzteMoebel(await ladeMoebelliste(quelle), texte);
  const gruppen = moebelJeOrt(orte, kartentexte, moebel);
  const verortet = new Set([...gruppen.values()].flat());
  const uebrige = Object.keys(moebel).filter((n) => !verortet.has(n));
  if (uebrige.length > 0) gruppen.set(UEBRIGE, uebrige.sort());
  const bilder = new Map();
  const bild = (name) => {
    if (!bilder.has(name)) bilder.set(name, moebelbild(privatWurzel, moebel[name], platzhalter));
    return bilder.get(name);
  };
  const lagen = {};
  let boegen = 0;
  for (const [gruppe, namen] of [...gruppen].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const eingaben = await Promise.all(
      namen.map(async (name) => ({ name, bild: await bild(name) })),
    );
    const gebaut = await baueMoebelboegen(gruppe, eingaben);
    for (const { name, png } of gebaut.boegen)
      await schreibe(`moebelboegen/${name}.png`, png, "grafik");
    boegen += gebaut.boegen.length;
    for (const [name, lage] of Object.entries(gebaut.rahmen)) (lagen[name] ??= {})[gruppe] = lage;
  }
  const mitLage = Object.fromEntries(
    Object.entries(moebel).map(([name, angabe]) => {
      const jeOrt = lagen[name] ?? {};
      const erste = Object.values(jeOrt)[0] ?? {};
      const mehrere = Object.keys(jeOrt).length > 1;
      return [name, { ...angabe, ...erste, ...(mehrere ? { jeOrt } : {}) }];
    }),
  );
  // Ohne Einrückung wie die Karten (abenteuerpaket-auswahl.mjs): eingerückt war die Datei mit
  // `jeOrt` gut 900 KB groß, fast alles Leerzeichen und Zeilen der Rahmen.
  await schreibe("daten/moebel.json", JSON.stringify({ moebel: mitLage }) + "\n", "daten");
  const doppelt = [...gruppen.values()].flat().length - Object.keys(moebel).length;
  return { boegen, moebel: Object.keys(moebel).length, doppelt };
}
