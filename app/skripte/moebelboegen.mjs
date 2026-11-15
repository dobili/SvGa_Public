// Möbelbilder des Abenteuerpakets je Ort als Bogen (Atlas) zusammenfassen
// (skripte/baue-abenteuerpaket.mjs).
//
// Warum: Das Grundpaket hatte gut 1700 einzelne Möbelbilder von zusammen nur gut 1 MB. Auf
// einfachen Handys hängt die Ladezeit am Aufwand je Datei (Abruf, Prüfsumme, Cache-Eintrag;
// Messung „zugang“, 15.11.2026: etwa 60 s bei gedrosselter CPU), nicht an den Bytes. Ein Bogen je
// Ortsdatei (inhalte/abenteuer/moebel/<ort>.json) macht daraus gut 35 Dateien. Die App schneidet
// die Möbel als Rahmen aus dem Bogen (src/abenteuer/oberwelt/moebel.ts); die Lage steht in
// daten/moebel.json unter `bogen` und `rahmen`.
// Verfahren: Regalpacken (nach Höhe absteigend, Zeile für Zeile), Bogen höchstens 2048 × 2048
// (das kann jedes Handy als Textur), sonst ein zweiter Bogen. Jedes Bild bekommt einen Rand von
// einem Pixel, der seine Randpixel wiederholt: Bei krummer Kameravergrößerung greift die
// Grafikkarte sonst ins Nachbarbild (sichtbare Haarlinien an Pixelgrafik).
// Abhängigkeiten: sharp (wie skripte/paketbilder.mjs).
import sharp from "sharp";

/** Größte Kante eines Bogens in Pixeln (sichere Texturgröße auf alten Handys). */
export const BOGEN_HOECHSTENS = 2048;
/** Wiederholter Rand um jedes Bild in Pixeln. */
export const BOGEN_RAND = 1;
/** Zuschlag auf die Fläche für die erste Schätzung der Bogenbreite (Lücken im Regal). */
const FLAECHENZUSCHLAG = 1.25;

/**
 * Packt Rechtecke in Bögen (Regalverfahren). Eingabe: Einträge mit name, breite, hoehe (schon mit
 * Rand). Ausgabe: Liste der Bögen, je { breite, hoehe, plaetze: [{ name, x, y, breite, hoehe }] }.
 * Die Reihenfolge ist fest (Höhe absteigend, dann Name), damit derselbe Inhalt dieselben Bögen
 * und damit dieselbe Prüfsumme ergibt. Ein Bild, das größer ist als ein Bogen, bricht ab.
 * Beispiel: zwei Bilder 18 × 18 und 10 × 34 → ein Bogen, das hohe links, das kleine daneben.
 */
export function packeRegal(eintraege, hoechstens = BOGEN_HOECHSTENS) {
  const sortiert = [...eintraege].sort(
    (a, b) => b.hoehe - a.hoehe || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
  );
  const flaeche = sortiert.reduce((s, e) => s + e.breite * e.hoehe, 0);
  const breitestes = sortiert.reduce((m, e) => Math.max(m, e.breite), 0);
  const breite = Math.min(
    hoechstens,
    Math.max(breitestes, Math.ceil(Math.sqrt(flaeche * FLAECHENZUSCHLAG))),
  );
  const boegen = [];
  let bogen = null;
  let x = 0;
  let y = 0;
  let zeile = 0;
  for (const e of sortiert) {
    if (e.breite > hoechstens || e.hoehe > hoechstens) {
      throw new Error(`Möbelbild zu groß für einen Bogen: ${e.name} (${e.breite} × ${e.hoehe})`);
    }
    if (bogen && x + e.breite > breite) {
      y += zeile;
      x = 0;
      zeile = 0;
    }
    if (!bogen || y + e.hoehe > hoechstens) {
      bogen = { breite: 0, hoehe: 0, plaetze: [] };
      boegen.push(bogen);
      x = 0;
      y = 0;
      zeile = 0;
    }
    bogen.plaetze.push({ name: e.name, x, y, breite: e.breite, hoehe: e.hoehe });
    x += e.breite;
    zeile = Math.max(zeile, e.hoehe);
    bogen.breite = Math.max(bogen.breite, x);
    bogen.hoehe = Math.max(bogen.hoehe, y + zeile);
  }
  return boegen;
}

/**
 * Baut die Bögen einer Gruppe. Eingabe: Präfix des Bogennamens (Ortsdatei ohne .json, etwa
 * „maple-falls“) und Bilder [{ name, bild }] (PNG-Bytes). Ausgabe: { boegen: [{ name, png }],
 * rahmen: { <möbel>: { bogen, rahmen: [x, y, breite, hoehe] } } } mit den Rahmen ohne Rand.
 * Beispiel: „maple-falls“ mit 229 Möbeln → ein Bogen „maple-falls-1“ von etwa 950 × 900 Pixeln.
 */
export async function baueMoebelboegen(praefix, bilder) {
  const vorbereitet = await Promise.all(
    bilder.map(async ({ name, bild }) => {
      const gerandet = await sharp(bild)
        .ensureAlpha()
        .extend({
          top: BOGEN_RAND,
          bottom: BOGEN_RAND,
          left: BOGEN_RAND,
          right: BOGEN_RAND,
          extendWith: "copy",
        })
        .png()
        .toBuffer({ resolveWithObject: true });
      return {
        name,
        breite: gerandet.info.width,
        hoehe: gerandet.info.height,
        bytes: gerandet.data,
      };
    }),
  );
  const nachName = new Map(vorbereitet.map((v) => [v.name, v]));
  const boegen = [];
  const rahmen = {};
  for (const [index, bogen] of packeRegal(vorbereitet).entries()) {
    const name = `${praefix}-${index + 1}`;
    const png = await sharp({
      create: {
        width: bogen.breite,
        height: bogen.hoehe,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(
        bogen.plaetze.map((p) => ({ input: nachName.get(p.name).bytes, left: p.x, top: p.y })),
      )
      .png()
      .toBuffer();
    boegen.push({ name, png });
    for (const p of bogen.plaetze) {
      rahmen[p.name] = {
        bogen: name,
        rahmen: [
          p.x + BOGEN_RAND,
          p.y + BOGEN_RAND,
          p.breite - 2 * BOGEN_RAND,
          p.hoehe - 2 * BOGEN_RAND,
        ],
      };
    }
  }
  return { boegen, rahmen };
}
