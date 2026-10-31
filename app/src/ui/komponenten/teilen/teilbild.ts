/**
 * Das Bild zum Teilen (Gamifizierung P9): ein verdientes Stück groß auf dunklem Grund, mit Name,
 * Datum, „Schach von Grund auf“ und der Adresse der Seite, als SVG-Text im Hochformat 1080 × 1350.
 *
 * Rolle im Gesamtbild: Leser sollen Orden, Abzeichen und später Rekorde und Meisterschaften
 * zeigen können, ohne Server und ohne Konto: Die App baut das Bild auf dem Gerät, rastert es
 * (teileBild.ts) und gibt es an das Teilen-Menü des Geräts. Was geteilt werden kann, steht in
 * TEILARTEN; ein späteres Paket trägt seine Art mit einer Zeile ein. Die Bilder der Stücke kommen
 * als fertiger SVG-Text aus ordenkunst/entwuerfe.ts (stueckSvg) und werden als inneres SVG
 * eingesetzt. Reine Funktionen; alle Texte werden für XML maskiert.
 * Abhängigkeiten: keine.
 */

/** Adresse der Seite, wie sie auf dem Bild steht. */
export const TEILADRESSE = "schach-von-grund-auf.com";
/** Adresse der App für Links (Herausforderungen). */
export const APP_ADRESSE = `https://${TEILADRESSE}/app/`;

/** Größe des geteilten Bildes in Bildpunkten (Hochformat 4:5, passt in Nachrichten und Status). */
export const TEILBILD = { breite: 1080, hoehe: 1350 } as const;

/**
 * Was sich teilen lässt; je Art eine Zeile (Überschrift „teilen.art.<kennung>“). Rekorde (P5) und
 * Meisterschaften (P3) stehen schon da, damit Welle 2 nur noch den Knopf einsetzt.
 */
export const TEILARTEN = ["orden", "abzeichen", "rekord", "meisterschaft"] as const;
export type Teilart = (typeof TEILARTEN)[number];

/** Alles, was auf dem Bild steht, schon übersetzt. */
export interface Teilbildangabe {
  /** Kleine Überschrift oben, etwa „Abzeichen“. */
  readonly ueberschrift: string;
  /** Name des Stücks, groß unter dem Bild. */
  readonly name: string;
  /** Zeile darunter, etwa „Verdient am 31.10.2026“; null ohne. */
  readonly zeile: string | null;
  /** SVG-Text des Stücks (stueckSvg); null: nur Name und Zeile. */
  readonly bild: string | null;
  /** Fußzeile, der Name der App. */
  readonly fuss: string;
  /** Adresse der Seite ohne https://. */
  readonly adresse: string;
}

/** Lage der Teile im Bild (Bildpunkte). */
const RAND = 48;
const BILD_GROESSE = 640;
const BILD_OBEN = 230;
const UEBERSCHRIFT_Y = 165;
const NAME_Y = 990;
const ZEILE_Y = 1070;
const FUSS_Y = 1215;
const ADRESSE_Y = 1270;
/** Schriftgröße des Namens; lange Namen werden kleiner, damit sie in die Breite passen. */
const NAME_GROESSE = 72;
const NAME_ZEICHEN_JE_BREITE = 1700;
const GOLD = "#c9a227";
const CREME = "#f5f0e6";

/** Maskiert Text für XML. Beispiel: „Matt & Patt“ → „Matt &amp; Patt“. */
export function xmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Schriftgröße für einen Namen dieser Länge. Beispiel: „Erste Partie“ → 72. */
export function namensgroesse(name: string): number {
  return Math.min(NAME_GROESSE, Math.floor(NAME_ZEICHEN_JE_BREITE / Math.max(1, name.length)));
}

/** Setzt das SVG eines Stücks als inneres SVG an seinen Platz in der Mitte. */
function stueck(svg: string): string {
  const x = (TEILBILD.breite - BILD_GROESSE) / 2;
  const lage = `x="${x}" y="${BILD_OBEN}" width="${BILD_GROESSE}" height="${BILD_GROESSE}"`;
  return svg.replace(/^<svg\b/, `<svg ${lage}`);
}

/** Eine mittige Textzeile. */
function zeile(text: string, y: number, groesse: number, farbe: string, extra = ""): string {
  return `<text x="${TEILBILD.breite / 2}" y="${y}" font-size="${groesse}" fill="${farbe}" text-anchor="middle" ${extra}>${xmlText(text)}</text>`;
}

/** Dunkler Grund mit goldenem Rahmen. */
function grund(): string {
  const { breite, hoehe } = TEILBILD;
  return (
    `<defs><linearGradient id="teilgrund" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16253d"/><stop offset="1" stop-color="#0b1424"/></linearGradient></defs>` +
    `<rect width="${breite}" height="${hoehe}" fill="url(#teilgrund)"/>` +
    `<rect x="${RAND}" y="${RAND}" width="${breite - 2 * RAND}" height="${hoehe - 2 * RAND}" rx="28" fill="none" stroke="${GOLD}" stroke-width="4"/>`
  );
}

/**
 * Das ganze Bild als SVG-Text.
 * Beispiel: Abzeichen „Erste Partie“, verdient am 31.10.2026 → dunkles Hochformat mit der Fahne
 * in der Mitte, darunter „Erste Partie“ und „Verdient am 31.10.2026“.
 */
export function teilbildSvg(angabe: Teilbildangabe): string {
  const { breite, hoehe } = TEILBILD;
  const schrift = `font-family="'Source Sans 3', 'Helvetica Neue', Arial, sans-serif"`;
  const teile = [
    grund(),
    zeile(angabe.ueberschrift.toUpperCase(), UEBERSCHRIFT_Y, 40, GOLD, 'letter-spacing="6"'),
    angabe.bild ? stueck(angabe.bild) : "",
    zeile(angabe.name, NAME_Y, namensgroesse(angabe.name), CREME, 'font-weight="700"'),
    angabe.zeile ? zeile(angabe.zeile, ZEILE_Y, 40, "#c9bfa8") : "",
    zeile(angabe.fuss, FUSS_Y, 50, GOLD, `font-family="Georgia, 'Source Serif 4', serif"`),
    zeile(angabe.adresse, ADRESSE_Y, 34, "#c9bfa8"),
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}" ${schrift}>${teile.join("")}</svg>`;
}

/**
 * Dateiname des Bildes, nur Buchstaben, Ziffern und Bindestriche.
 * Beispiel: ("abzeichen", "ersterSieg") → „schach-von-grund-auf-abzeichen-erstersieg.png“.
 */
export function teildateiname(art: Teilart, kennung: string): string {
  const teil = kennung.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `schach-von-grund-auf-${art}-${teil}.png`;
}
