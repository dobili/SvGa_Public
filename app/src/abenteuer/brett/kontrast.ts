/**
 * Kontrast zweier Farben nach WCAG 2.1 (relative Leuchtdichte, Verhältnis 1:1 bis 21:1).
 *
 * Rolle im Gesamtbild: Die Brettstile des Schach-Abenteuers (brettstile.ts) wählen ihre Farben
 * für Markierungen und Figuren von Hand; die Tests prüfen damit, dass jede Markierung auf beiden
 * Feldfarben genug Abstand hat (Ziel 3:1, WCAG 1.4.11 „Kontrast von Nicht-Text-Inhalten“) und
 * Weiß und Schwarz klar zu unterscheiden sind (docs/spiel/30, Abschnitt 5 „Lesbarkeit“).
 * Abhängigkeiten: keine.
 */

/** Ab diesem Wert gilt ein Rand oder eine Fläche nach WCAG 1.4.11 als sichtbar. */
export const MINDESTKONTRAST = 3;

/** Länge einer Farbe in Kurzform („#abc“) und in Langform („#aabbcc“). */
const KURZFORM = 4;
const LANGFORM = 7;
/** Höchstwert eines Farbkanals. */
const KANAL_MAX = 255;
/** Grenze und Werte der sRGB-Linearisierung (WCAG 2.1, Definition „relative luminance“). */
const SRGB_GRENZE = 0.04045;
const SRGB_TEILER_LINEAR = 12.92;
const SRGB_VERSATZ = 0.055;
const SRGB_TEILER = 1.055;
const SRGB_EXPONENT = 2.4;
/** Gewichte der Kanäle für die Leuchtdichte. */
const GEWICHT_ROT = 0.2126;
const GEWICHT_GRUEN = 0.7152;
const GEWICHT_BLAU = 0.0722;
/** Streulicht-Zuschlag im Kontrastverhältnis. */
const STREULICHT = 0.05;

/**
 * Die drei Kanäle einer Farbe in Hex-Schreibweise.
 *
 * Beispiel: „#16253D“ → [22, 37, 61]. Sonderfall: eine andere Schreibweise ist ein Fehler im
 * Code der Stiltabelle und wirft deshalb.
 */
export function kanaele(farbe: string): readonly [number, number, number] {
  const lang =
    farbe.length === KURZFORM
      ? `#${[...farbe.slice(1)].map((z) => z + z).join("")}`
      : farbe.length === LANGFORM
        ? farbe
        : "";
  if (!/^#[0-9a-fA-F]{6}$/.test(lang)) throw new Error(`Keine Hex-Farbe: ${farbe}`);
  return [
    parseInt(lang.slice(1, 3), 16),
    parseInt(lang.slice(3, 5), 16),
    parseInt(lang.slice(5, 7), 16),
  ];
}

/** Ein Kanal (0 bis 255) linear, wie WCAG ihn für die Leuchtdichte braucht. */
function linear(kanal: number): number {
  const wert = kanal / KANAL_MAX;
  return wert <= SRGB_GRENZE
    ? wert / SRGB_TEILER_LINEAR
    : ((wert + SRGB_VERSATZ) / SRGB_TEILER) ** SRGB_EXPONENT;
}

/** Relative Leuchtdichte einer Farbe, 0 (Schwarz) bis 1 (Weiß). */
export function leuchtdichte(farbe: string): number {
  const [r, g, b] = kanaele(farbe);
  return GEWICHT_ROT * linear(r) + GEWICHT_GRUEN * linear(g) + GEWICHT_BLAU * linear(b);
}

/**
 * Kontrastverhältnis zweier Farben, 1 bis 21.
 *
 * Beispiel: Navy „#16253D“ gegen Creme „#F5F0E6“ etwa 14:1; Gold gegen Creme etwa 2:1.
 */
export function kontrast(a: string, b: string): number {
  const la = leuchtdichte(a);
  const lb = leuchtdichte(b);
  return (Math.max(la, lb) + STREULICHT) / (Math.min(la, lb) + STREULICHT);
}

/**
 * Ist eine Marke aus Fläche und Kontur auf einem Feld zu sehen?
 *
 * Warum: Auf Brettern mit mittlerem Abstand zwischen hell und dunkel erreicht keine einzelne
 * Farbe 3:1 gegen beide Felder. Wie im Buch hat jede Marke deshalb eine Kontur: Sichtbar ist sie,
 * wenn Fläche oder Kontur sich vom Feld abhebt und Fläche und Kontur sich voneinander abheben.
 */
export function markeSichtbar(flaeche: string, kontur: string, feld: string): boolean {
  const gegenFeld = Math.max(kontrast(flaeche, feld), kontrast(kontur, feld));
  return gegenFeld >= MINDESTKONTRAST && kontrast(flaeche, kontur) >= MINDESTKONTRAST;
}
