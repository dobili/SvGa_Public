/**
 * Ersatzporträts aus der eigenen Figur (Wunsch des Autors, 25.11.2026): Wer spricht, aber kein
 * Porträtblatt und kein großes Porträt hat (Nebenfiguren, Statisten), bekam im Dialog ein winziges
 * Ersatzgesicht, das nicht zur Figur passte (der Wanderer mit gelbem Hut sprach mit einem jungen
 * Kopf mit braunem Haar). Jetzt baut der Paketbau aus dem Standbild Süd der Figur
 * (`spiel/figuren-neu/<name>/rotations/south.png`, PixelLab) ein Porträt: Kopf und Schultern
 * ausgeschnitten, ganzzahlig vergrößert (nächster Nachbar) auf 64 × 64 wie die großen Porträts.
 *
 * Rolle im Gesamtbild: gerufen von skripte/baue-abenteuerpaket.mjs; die App sucht die Bilder unter
 * `portraets/ersatz/<name>.png` nach Großbild und Blatt, vor dem alten Ersatzgesicht
 * (dialog/Portraet.tsx). Ohne privates Paket (keine Figuren) entsteht nichts.
 * Abhängigkeiten: sharp, Node.
 */
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

/** Kantenlänge der Porträts in Pixeln (wie portraets/gross, dialog/Portraet.tsx zeigt sie mit 96). */
const SEITE = 64;
/** Anteil der Figurenhöhe, der Kopf und Schultern zeigt (PixelLab: großer Kopf, Chibi-Maß). */
const KOPFANTEIL = 0.62;
/** Deckkraft, ab der ein Pixel zur Figur zählt. */
const DECKEND = 16;

/** Begrenzung der deckenden Pixel eines RGBA-Bildes (x0, y0, x1, y1 einschließlich), sonst null. */
function umriss(daten, breite, hoehe) {
  let [x0, y0, x1, y1] = [breite, hoehe, -1, -1];
  for (let y = 0; y < hoehe; y++) {
    for (let x = 0; x < breite; x++) {
      if (daten[(y * breite + x) * 4 + 3] < DECKEND) continue;
      [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

/**
 * Das Ersatzporträt aus einem Standbild: quadratischer Ausschnitt um Kopf und Schultern, oben an
 * der Figur, mittig über ihr; vergrößert mit dem größten ganzen Faktor, der in SEITE passt.
 * Beispiel: Wanderer 32 × 32, Figur 24 × 31 Pixel → Ausschnitt 19 × 19 → × 3 → 57 Pixel, mittig
 * auf 64 × 64 mit durchsichtigem Rand.
 */
export async function ersatzportraet(quelle) {
  const { data, info } = await sharp(quelle)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const u = umriss(data, info.width, info.height);
  if (!u) return null;
  const seite = Math.max(1, Math.round((u.y1 - u.y0 + 1) * KOPFANTEIL));
  // Mittig über der ganzen Figur; ein breiter Hut darf am Rand angeschnitten sein, dafür bleibt
  // das Gesicht groß (der breitere Ausschnitt zog den Rucksack mit und machte es klein).
  const mitte = Math.round((u.x0 + u.x1) / 2);
  const links = Math.min(Math.max(0, mitte - Math.floor(seite / 2)), info.width - seite);
  const ausschnitt = { left: Math.max(0, links), top: u.y0, width: seite, height: seite };
  const faktor = Math.max(1, Math.floor(SEITE / seite));
  const gross = await sharp(quelle)
    .extract({ ...ausschnitt, height: Math.min(seite, info.height - u.y0) })
    .resize(seite * faktor, Math.min(seite, info.height - u.y0) * faktor, { kernel: "nearest" })
    .png()
    .toBuffer();
  const meta = await sharp(gross).metadata();
  const rand = {
    left: Math.floor((SEITE - meta.width) / 2),
    top: Math.floor((SEITE - meta.height) / 2),
  };
  return sharp({
    create: {
      width: SEITE,
      height: SEITE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: gross, ...rand }])
    .png()
    .toBuffer();
}

/**
 * Ersatzporträts für alle Figuren in `privat/figuren-neu`, die weder ein Porträtblatt
 * (`portraets/blatt/<name>.png`) noch ein großes Porträt (`portraets/gross/<name>.*`) haben.
 * Ausgabe: Liste { pfad: "portraets/ersatz/<name>.png", inhalt } (leer ohne Figuren).
 */
export async function ersatzportraets(privat) {
  const figuren = join(privat, "figuren-neu");
  if (!existsSync(figuren)) return [];
  const hat = (pfad) => existsSync(join(privat, pfad));
  const ergebnis = [];
  for (const name of (await readdir(figuren)).sort()) {
    if (hat(`portraets/blatt/${name}.png`) || hat(`portraets/gross/${name}.png`)) continue;
    if (hat(`portraets/gross/${name}.webp`)) continue;
    const sued = join(figuren, name, "rotations", "south.png");
    if (!existsSync(sued)) continue;
    const inhalt = await ersatzportraet(sued);
    if (inhalt) ergebnis.push({ pfad: `portraets/ersatz/${name}.png`, inhalt });
  }
  return ergebnis;
}
