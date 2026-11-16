// Platzhaltergrafik des Abenteuerpakets ohne Bildbibliothek (skripte/baue-abenteuerpaket.mjs):
// Kachelsatz, Held, Figur und Möbel als PNG, solange die gekaufte Grafik fehlt (öffentliche
// Arbeitskopien und die Prüfungen in GitHub Actions haben sie nicht).
// Warum eine eigene Datei: Der Paketbau blieb so unter 400 Zeilen (Auftrag „Leistung“, 16.11.2026).
// Abhängigkeiten: node:zlib.
import { deflateSync } from "node:zlib";

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
const MOEBEL_GRUND = [150, 120, 90];
const MOEBEL_RAND = [58, 58, 80];

/** Ein Möbel als braune Fläche mit dunklem Rand in der angegebenen Größe. */
export function platzhalterRechteck(breite, hoehe) {
  const pixel = Buffer.alloc(breite * hoehe * 4);
  for (let y = 0; y < hoehe; y++) {
    for (let x = 0; x < breite; x++) {
      const rand = x === 0 || y === 0 || x === breite - 1 || y === hoehe - 1;
      setzePixel(pixel, breite, x, y, rand ? MOEBEL_RAND : MOEBEL_GRUND);
    }
  }
  return pngAus(breite, hoehe, pixel);
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
export function platzhalterKacheln() {
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
export function platzhalterHeld(koerper = HELD_KOERPER) {
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

/** Eine Figur wie der Held, nur in der Farbe der übrigen Figuren. */
export function platzhalterFigur() {
  return platzhalterHeld(FIGUR_KOERPER);
}
