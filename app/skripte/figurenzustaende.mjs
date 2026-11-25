/**
 * Zustände einer PixelLab-Figur für den Figurenbogen (Auftrag des Haupt-Chats, 21.11.2026):
 * Sitzen auf dem Stuhl, Sitzen am Boden und Liegen. PixelLab hat dafür keine Animation, sondern
 * „New State“: eine Fassung derselben Figur mit eigenen Ansichten in acht Richtungen, als eigener
 * Export (metadata.json und `<ordner>/rotations/<richtung>.png`, 32 × 32).
 *
 * Wo die Zustände liegen (robuster als die Namen, die PixelLab auf 20 Zeichen abschneidet, etwa
 * „Sitting on a invisib“): Der Autor entpackt jeden Export in einen Ordner mit festem Namen unter
 * `figuren-neu/<figur>/zustaende/`:
 * - `sitzstuhl`: „Sitting on an invisible chair, eyes open, hands on lap“
 * - `sitzboden`: „sitting down cross-legged on the floor“
 * - `schlaf`: „Sleeping, lying on the side in an invisible bed“
 * Den Bildordner darin nennt metadata.json (states[0].folder); sonst gilt der einzige Unterordner
 * mit `rotations/`. Ersatzweise erkennt das Werkzeug Zustände im Hauptexport der Figur
 * (metadata.json mit mehreren states, wenn eine ganze Gruppe exportiert wurde) an Wörtern im Namen
 * oder in der Beschreibung (ZUSTANDSWOERTER).
 *
 * Maßstab: PixelLab zeichnet die Zustände größer (Kopf beim Helden 21 statt 17 Pixel breit, Probe
 * vom 21.11.2026). Gemessen wird die größte Breite in den oberen zwei Fünfteln des Südbilds (der
 * Kopf) im Zustand und im Stehen; um dieses Verhältnis werden alle Bilder des Zustands verkleinert
 * (nächster Nachbar, kein Weichzeichnen der Pixelkunst). Sitzbilder stehen danach unten auf
 * FUSSZEILE wie die Standbilder, Liegebilder senkrecht mittig im Rahmen.
 * Rolle im Gesamtbild: Hilfe für skripte/figurenbogen.mjs (Reihen 3 bis 5 des Bogens).
 * Abhängigkeiten: sharp, figurenbogen.mjs (Rahmen, Schatten, Verschieben).
 */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import {
  fusszeileFuer,
  imRahmen,
  RAHMEN,
  untersteZeile,
  verschoben,
  zeilenVon,
} from "./figurenbogen.mjs";

const KANAELE = 4;
/** Der Kopf: die oberen zwei Fünftel der Figur (Chibi-Maß, Kopf etwa halbe Körperhöhe). */
const KOPFANTEIL = 0.4;

/** Die drei Zustände: Ordnername, Wörter im Namen oder in der Beschreibung, Richtungen. */
export const ZUSTAENDE = [
  { art: "stuhl", ordner: "sitzstuhl", woerter: /chair|stuhl/i, liegt: false },
  { art: "boden", ordner: "sitzboden", woerter: /cross-legged|floor|sitting down/i, liegt: false },
  { art: "liegen", ordner: "schlaf", woerter: /sleep|lying|liegen/i, liegt: true },
];

/** Richtungen der Sitzreihen (Ordnung wie die Standbilder) und der Liegereihe (Kopf rechts, links). */
const SITZRICHTUNGEN = ["east", "north", "west", "south"];
const LIEGERICHTUNGEN = ["west", "east"];

/**
 * Ein PNG als rohe RGBA-Pixel in einem Rahmen 32 × `zeilen` (kleinere Bilder unten mittig; ein
 * Zustand auf 32 × 48 bei einer hohen Figur, figurenbogen.mjs).
 */
async function rahmenAus(pfad, zeilen) {
  const { data, info } = await sharp(pfad)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return imRahmen(data, info.width, Math.min(info.height, zeilen), zeilen);
}

/** Deckend an (x, y) eines Rahmens (Breite 32)? */
function deckend(rahmen, x, y) {
  return rahmen[(y * RAHMEN + x) * KANAELE + KANAELE - 1] > 0;
}

/**
 * Größte Breite (Pixel) in den oberen zwei Fünfteln der Figur, also des Kopfs; 0 bei leerem Rahmen.
 * Beispiel: Held stehend 17, sitzend (Probe) 21.
 */
export function kopfbreite(rahmen) {
  const zeilen = [];
  for (let y = 0; y < zeilenVon(rahmen); y++) {
    const xs = [...Array(RAHMEN).keys()].filter((x) => deckend(rahmen, x, y));
    if (xs.length > 0) zeilen.push(xs.at(-1) - xs[0] + 1);
  }
  const kopf = zeilen.slice(0, Math.max(1, Math.floor(zeilen.length * KOPFANTEIL)));
  return kopf.length > 0 ? Math.max(...kopf) : 0;
}

/** Bildordner eines Zustandsexports (states[0].folder, sonst der einzige mit rotations/). */
async function bildordner(ordner) {
  const meta = join(ordner, "metadata.json");
  if (existsSync(meta)) {
    const daten = JSON.parse(await readFile(meta, "utf8"));
    const name = daten?.states?.[0]?.folder;
    if (name && existsSync(join(ordner, name, "rotations"))) return join(ordner, name);
  }
  if (existsSync(join(ordner, "rotations"))) return ordner;
  const unter = (await readdir(ordner, { withFileTypes: true })).filter(
    (e) => e.isDirectory() && existsSync(join(ordner, e.name, "rotations")),
  );
  return unter.length === 1 ? join(ordner, unter[0].name) : null;
}

/** Ersatz: Ordner eines Zustands im Hauptexport (mehrere states, erkannt an den Wörtern). */
async function ausHauptexport(figur, zustand) {
  const meta = join(figur, "metadata.json");
  if (!existsSync(meta)) return null;
  const daten = JSON.parse(await readFile(meta, "utf8"));
  const treffer = (daten?.states ?? []).find((s) =>
    zustand.woerter.test(`${s?.character?.name ?? ""} ${s?.character?.prompt ?? ""}`),
  );
  const pfad = treffer?.folder ? join(figur, treffer.folder) : null;
  return pfad && existsSync(join(pfad, "rotations")) ? pfad : null;
}

/** Wo die Bilder eines Zustands liegen, oder null. */
export async function zustandsordner(figur, zustand) {
  const eigen = join(figur, "zustaende", zustand.ordner);
  if (existsSync(eigen)) return bildordner(eigen);
  return ausHauptexport(figur, zustand);
}

/** Verkleinert einen Rahmen um `massstab` (nächster Nachbar), wieder in einen gleich großen Rahmen. */
async function verkleinert(rahmen, massstab) {
  if (massstab >= 1) return rahmen;
  const zeilen = zeilenVon(rahmen);
  const seite = Math.max(1, Math.round(RAHMEN * massstab));
  const hoch = Math.max(1, Math.round(zeilen * massstab));
  const klein = await sharp(rahmen, { raw: { width: RAHMEN, height: zeilen, channels: KANAELE } })
    .resize(seite, hoch, { kernel: "nearest" })
    .raw()
    .toBuffer();
  // Waagrecht mittig, senkrecht mittig; die Lage im Rahmen richtet danach `ausgerichtet`.
  const aus = Buffer.alloc(RAHMEN * zeilen * KANAELE);
  const rand = Math.floor((RAHMEN - seite) / 2);
  const oben = Math.floor((zeilen - hoch) / 2);
  for (let y = 0; y < hoch; y++) {
    const q = y * seite * KANAELE;
    klein.copy(aus, ((oben + y) * RAHMEN + rand) * KANAELE, q, q + seite * KANAELE);
  }
  return aus;
}

/** Sitzbilder unten auf der Fußzeile, Liegebilder senkrecht mittig. */
function ausgerichtet(rahmen, liegt) {
  const unten = untersteZeile(rahmen);
  const zeilen = zeilenVon(rahmen);
  if (unten < 0) return rahmen;
  if (!liegt) return verschoben(rahmen, fusszeileFuer(zeilen) - unten);
  let oben = 0;
  while (oben < zeilen && ![...Array(RAHMEN).keys()].some((x) => deckend(rahmen, x, oben))) oben++;
  return verschoben(rahmen, Math.floor((zeilen - 1 - unten - oben) / 2));
}

/**
 * Die Rahmen eines Zustands: vier Sitzbilder (rechts, oben, links, unten) oder zwei Liegebilder
 * (Kopf rechts = West, Kopf links = Ost); null, wenn der Zustand fehlt. Fehlt eine Richtung, gilt
 * das Spiegelbild der Gegenrichtung (spiegeln aus figurenbogen.mjs), sonst null an dieser Stelle.
 * Eingaben: Figurenordner, Zustand aus ZUSTAENDE, Standbild Süd (für den Maßstab), Spiegelfunktion.
 */
export async function zustandsrahmen(figur, zustand, standSued, spiegeln) {
  const ordner = await zustandsordner(figur, zustand);
  if (!ordner) return null;
  // Höhe der Rahmen wie die Standbilder der Figur (32, bei hohen Figuren etwa 48).
  const zeilen = standSued ? zeilenVon(standSued) : RAHMEN;
  const lies = async (r) => {
    const pfad = join(ordner, "rotations", `${r}.png`);
    return existsSync(pfad) ? rahmenAus(pfad, zeilen) : null;
  };
  const sued = await lies("south");
  const soll = standSued ? kopfbreite(standSued) : 0;
  const ist = sued ? kopfbreite(sued) : 0;
  const massstab = soll > 0 && ist > 0 ? soll / ist : 1;
  const richtungen = zustand.liegt ? LIEGERICHTUNGEN : SITZRICHTUNGEN;
  const roh = await Promise.all(richtungen.map(lies));
  const gegen = { east: "west", west: "east" };
  const voll = richtungen.map((r, i) => {
    if (roh[i]) return roh[i];
    const partner = gegen[r] ? roh[richtungen.indexOf(gegen[r])] : null;
    return partner ? spiegeln(partner) : null;
  });
  return Promise.all(
    voll.map(async (r) => (r ? ausgerichtet(await verkleinert(r, massstab), zustand.liegt) : null)),
  );
}
