/**
 * Pixelfiguren des Schach-Abenteuers: sechs Figuren auf einem Raster von 18 × 18 Pixeln.
 *
 * Rolle im Gesamtbild: Die Bretter des Abenteuers zeigen Figuren im Pixelstil der Welt
 * (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5). Die Formen sind abgeleitet vom
 * gemeinfreien Satz „Kiefer & Kirsche“ (RhosGFX, „Vector Chess Pieces“, CC0 1.0, Original in
 * pipeline/figuren/saetze/quelle/rhosgfx/): die weißen Figuren auf 18 × 18 Felder gerechnet
 * (Fläche, Umriss, Schatten je Feld nach Mehrheit) und von Hand nachgebessert: symmetrisch
 * gemacht, Kreuz, Krone, Zinnen und Kerbe des Läufers freigestellt, der Bauer runder.
 * Weiß und Schwarz teilen dieselbe Zeichnung; die Farben kommen je Material aus materialien.ts.
 * Märchenfiguren (Auftrag 26.11.2026) tragen ihre FEN-Zeichen wie in Fairy-Stockfish: H Falke
 * (Hawk), E Bison (Elephant), D Drache; bis gezeichnete Bilder da sind, ein Buchstabe im Kreis.
 * Abhängigkeiten: keine.
 *
 * Zeichen im Raster: „.“ leer, „1“ Umriss, „2“ Körper, „3“ Schatten (Sockel, Bänder).
 */

/** Breite und Höhe des Rasters in Pixeln. */
export const RASTERGROESSE = 18;

/** Klasse eines Pixels: Umriss, Körper oder Schatten; leere Pixel fehlen. */
export type Pixelklasse = "umriss" | "koerper" | "schatten";

const KLASSEN: Readonly<Record<string, Pixelklasse>> = {
  "1": "umriss",
  "2": "koerper",
  "3": "schatten",
};

/** Die Zeichnungen je Figur (FEN-Buchstabe in Großschreibung). */
export const PIXELRASTER: Readonly<Record<string, readonly string[]>> = {
  K: [
    "..................",
    "........11........",
    ".......1221.......",
    "......112211......",
    "......122221......",
    "......112211......",
    "....1111221111....",
    "...112222222211...",
    "...122222222221...",
    "...122222222221...",
    "...112222222211...",
    "....1222222221....",
    "....1333333331....",
    "....1111111111....",
    "...113333333311...",
    "...133333333331...",
    "...111111111111...",
    "..................",
  ],
  Q: [
    "..................",
    "........11........",
    ".......1221.......",
    "..11...1221...11..",
    "..121..1221..121..",
    "...121.1221.121...",
    "...122222222221...",
    "...122222222221...",
    "....1222222221....",
    "....1222222221....",
    ".....12222221.....",
    ".....12222221.....",
    "....1333333331....",
    "....1111111111....",
    "...113333333311...",
    "...133333333331...",
    "...111111111111...",
    "..................",
  ],
  R: [
    "..................",
    "..................",
    "...111.1111.111...",
    "...121.1221.121...",
    "...122112211221...",
    "...122222222221...",
    "...111111111111...",
    "....1222222221....",
    "....1222222221....",
    "....1222222221....",
    "....1222222221....",
    "....1222222221....",
    "....1111111111....",
    "...113333333311...",
    "...133333333331...",
    "...133333333331...",
    "...111111111111...",
    "..................",
  ],
  B: [
    "..................",
    "........11........",
    ".......1221.......",
    ".......1111.......",
    "......122221......",
    ".....12222121.....",
    "....1222212221....",
    "....1222222221....",
    ".....12222221.....",
    "......122221......",
    ".....11111111.....",
    "......133331......",
    "......122221......",
    ".....12222221.....",
    "...111111111111...",
    "...133333333331...",
    "...111111111111...",
    "..................",
  ],
  N: [
    "..................",
    "........1..1......",
    ".......121121.....",
    "......12222221....",
    ".....122122221....",
    "....1222222221....",
    "...122222222221...",
    "..1222222222221...",
    "..1221122222221...",
    "...11..12222221...",
    "......122222221...",
    ".....1222222221...",
    "....12222222221...",
    "....11111111111...",
    "...1133333333311..",
    "...1333333333331..",
    "...1111111111111..",
    "..................",
  ],
  P: [
    "..................",
    "..................",
    "..................",
    "..................",
    ".......1111.......",
    "......122221......",
    ".....12222221.....",
    ".....12222221.....",
    "......122221......",
    ".....11111111.....",
    "......122221......",
    "......122221......",
    ".....12222221.....",
    "....1222222221....",
    "...111111111111...",
    "...133333333331...",
    "...111111111111...",
    "..................",
  ],
  // Falke (Läufer + Springer, Variante Falke und Bison, L9): Platzhalter F im Kreis
  H: [
    "..................",
    ".......1111.......",
    ".....11222211.....",
    "....1222222221....",
    "...122211111221...",
    "..12222122222221..",
    "..12222122222221..",
    "..12222111122221..",
    "..12222122222221..",
    "..12222122222221..",
    "..12222122222221..",
    "..12222222222221..",
    "...122222222221...",
    "....1333333331....",
    ".....11333311.....",
    ".......1111.......",
    "..................",
    "..................",
  ],
  // Bison (Turm + Springer, Variante Falke und Bison, L9): Platzhalter B im Kreis
  E: [
    "..................",
    ".......1111.......",
    ".....11222211.....",
    "....1222222221....",
    "...122211112221...",
    "..12222122212221..",
    "..12222122212221..",
    "..12222111122221..",
    "..12222122212221..",
    "..12222122212221..",
    "..12222111122221..",
    "..12222222222221..",
    "...122222222221...",
    "....1333333331....",
    ".....11333311.....",
    ".......1111.......",
    "..................",
    "..................",
  ],
  // Drache (Dame + Springer, Drachenfest, L10): Platzhalter D im Kreis
  D: [
    "..................",
    ".......1111.......",
    ".....11222211.....",
    "....1222222221....",
    "...122211112221...",
    "..12222122212221..",
    "..12222122212221..",
    "..12222122212221..",
    "..12222122212221..",
    "..12222122212221..",
    "..12222111122221..",
    "..12222222222221..",
    "...122222222221...",
    "....1333333331....",
    ".....11333311.....",
    ".......1111.......",
    "..................",
    "..................",
  ],
};

/**
 * Das Raster einer Figur mit Kantenschatten: Ein Körperpixel direkt links neben dem Umriss wird
 * Schatten. So bekommt jede Figur eine Schattenseite rechts, ohne dass die Zeichnung sie trägt.
 *
 * Eingabe: FEN-Zeichen, Groß- oder Kleinbuchstabe. Ausgabe: 18 Zeilen zu 18 Zeichen; null für
 * ein unbekanntes Zeichen. Beispiel: „p“ und „P“ liefern dasselbe Raster des Bauern.
 */
export function figurenraster(zeichen: string): readonly string[] | null {
  const raster = PIXELRASTER[zeichen.toUpperCase()];
  if (!raster) return null;
  return raster.map((zeile) =>
    [...zeile].map((z, i) => (z === "2" && zeile[i + 1] === "1" ? "3" : z)).join(""),
  );
}

/** Ein waagrechter Lauf gleicher Pixel: wird als ein Rechteck gezeichnet. */
export interface Pixellauf {
  readonly x: number;
  readonly y: number;
  readonly laenge: number;
  readonly klasse: Pixelklasse;
}

/**
 * Fasst jede Zeile in Läufe gleicher Klasse zusammen, damit eine Figur nur wenige Rechtecke
 * braucht (etwa 60 statt 200).
 *
 * Beispiel: „...111..“ → ein Lauf x 3, Länge 3, Umriss. Sonderfall: leere Pixel bilden keinen Lauf.
 */
export function pixellaeufe(raster: readonly string[]): Pixellauf[] {
  const laeufe: Pixellauf[] = [];
  raster.forEach((zeile, y) => {
    let x = 0;
    while (x < zeile.length) {
      const zeichen = zeile.charAt(x);
      let ende = x + 1;
      while (zeile.charAt(ende) === zeichen) ende += 1;
      const klasse = KLASSEN[zeichen];
      if (klasse) laeufe.push({ x, y, laenge: ende - x, klasse });
      x = ende;
    }
  });
  return laeufe;
}
