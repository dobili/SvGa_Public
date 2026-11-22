/**
 * Räumliche Geräusche (Auftrag des Hauptchats, 22.11.2026): Das Dauergeräusch einer Karte liegt
 * überall auf einem leisen Grundpegel, schwillt beim Betreten kurz an und wird in der Nähe seiner
 * Quelle lauter (Wasserfall, Fluss, Bach …).
 *
 * Warum: Vorher klang das Dauergeräusch überall gleich laut, gut 3 dB unter der Musik. Am
 * Wasserfall war es so laut wie am Parkeingang, und auf Dauer lag es zu dicht an der Musik.
 * Gemessen (ffmpeg volumedetect, 22.11.2026): Musik Maple Falls −20,3 dB, Wasserfall −23,8, Fluss
 * und Bach −23,5. Mit den Reglern der Grundeinstellung (Musik 60 %, Geräusche 80 %: −4,4 und
 * −1,9 dB) lag das Geräusch nur gut 1 dB unter der Musik. Mit `GRUND_DB` = −11 liegt es etwa
 * 12 dB darunter (−36,7 gegen −24,7 dB); an der Quelle (`NAH_DB` = 0) klingt es wie bisher.
 *
 * Rolle im Gesamtbild: reine Rechnung für ton/tonregie.ts. Die Quellen schreibt die Pipeline als
 * Eigenschaft `geraeuschquellen` in die Tiled-Karte (pipeline/abenteuer/geraeuschquellen.py); die
 * App lädt dafür keine eigene Datei. Einzelne Geräusche aus Dialogzeilen (`#klang`) laufen an
 * diesem Pegel vorbei (ton/tonspieler.ts).
 * Abhängigkeiten: keine.
 */

/** Grundpegel des Dauergeräuschs gegenüber der Datei (dB); rund 12 dB unter der Musik. */
export const GRUND_DB = -11;
/** Pegel ganz nah an der Quelle und auf dem Gipfel der Ankunft (dB, wie die Datei). */
export const NAH_DB = 0;
/** Bis zu diesem Abstand (Kacheln) klingt eine Quelle voll. */
export const VOLL_BIS = 2;
/** Ab diesem Abstand (Kacheln) trägt eine Quelle nichts mehr bei (Auftrag: 10 bis 14). */
export const STILL_AB = 12;
/** Ankunft: so lange (Sekunden) bleibt das Geräusch nach dem Betreten oben … */
export const ANKUNFT_HALTEN_S = 3.5;
/** … und sinkt dann in dieser Zeit weich auf den Pegel des Ortes. */
export const ANKUNFT_SINKEN_S = 3;
/** Höchstens so oft (Millisekunden) rechnet die Regie den Pegel neu. */
export const TAKT_MS = 100;

const DEZIBEL_JE_ZEHNFACH = 20;
const ZEHN = 10;

/** Ein Rechteck in Kacheln: x, y, Breite, Höhe (ein Punkt hat 1 × 1). */
export type Rechteck = readonly [number, number, number, number];

/** Eine Art von Geräusch und ihre Stellen auf der Karte. */
export interface Geraeuschquelle {
  /** Stamm der Klangdatei, etwa „wasserfall“ (klang/wasserfall.m4a). */
  readonly art: string;
  readonly felder: readonly Rechteck[];
}

/**
 * Anteil 0 bis 1 nach Abstand in Kacheln: voll bis `VOLL_BIS`, still ab `STILL_AB`, dazwischen
 * eine Kosinuskurve ohne Knick an beiden Enden (kein Sprung beim Gehen).
 * Beispiele: 0 → 1; 7 → 0,5; 12 → 0.
 */
export function anteilNachAbstand(abstand: number): number {
  if (abstand <= VOLL_BIS) return 1;
  if (abstand >= STILL_AB) return 0;
  const t = (abstand - VOLL_BIS) / (STILL_AB - VOLL_BIS);
  return 0.5 + 0.5 * Math.cos(Math.PI * t);
}

/** Abstand eines Feldes zum nächsten Feld eines Rechtecks (Kacheln, gerade Linie). */
export function abstandZu(r: Rechteck, x: number, y: number): number {
  const [rx, ry, b, h] = r;
  const dx = Math.max(rx - x, 0, x - (rx + b - 1));
  const dy = Math.max(ry - y, 0, y - (ry + h - 1));
  return Math.hypot(dx, dy);
}

/**
 * Nähe 0 bis 1 zum Geräusch `art` am Feld (x, y): die nächste Stelle zählt. Mehrere Stellen der
 * gleichen Art addieren sich nicht (ein langer Fluss ist nicht lauter als ein kurzer).
 * Beispiel: Wasserfall auf [30, 1, 4, 4], Held auf (31, 12) → Abstand 7 → 0,5.
 */
export function naeheZu(
  quellen: readonly Geraeuschquelle[],
  art: string | null,
  x: number,
  y: number,
): number {
  let beste = 0;
  for (const q of quellen) {
    if (q.art !== art) continue;
    for (const r of q.felder) beste = Math.max(beste, anteilNachAbstand(abstandZu(r, x, y)));
  }
  return beste;
}

/**
 * Anteil der Ankunft 0 bis 1, `sekunden` nach dem Betreten: erst oben, dann weich (Kosinus) nach
 * unten. Beispiele: 1 s → 1; 3,5 + 1,5 s → 0,5; ab 6,5 s → 0.
 */
export function ankunftsanteil(sekunden: number): number {
  if (sekunden < 0) return 0;
  if (sekunden <= ANKUNFT_HALTEN_S) return 1;
  const t = (sekunden - ANKUNFT_HALTEN_S) / ANKUNFT_SINKEN_S;
  return t >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * t);
}

/** Dauer der ganzen Ankunft (Sekunden): danach braucht es keinen Takt mehr. */
export const ANKUNFT_DAUER_S = ANKUNFT_HALTEN_S + ANKUNFT_SINKEN_S;

/**
 * Verstärkung des Dauergeräuschs aus Nähe und Ankunft (beide 0 bis 1): das Größere zählt,
 * gerechnet in Dezibel zwischen `GRUND_DB` und `NAH_DB`, damit es gleichmäßig lauter klingt.
 * Beispiele: (0, 0) → 10^(−11/20) ≈ 0,28; (1, 0) → 1; (0,5, 0) → 10^(−5,5/20) ≈ 0,53.
 */
export function raumpegel(naehe: number, ankunft: number): number {
  const anteil = Math.min(1, Math.max(0, naehe, ankunft));
  const db = GRUND_DB + (NAH_DB - GRUND_DB) * anteil;
  return ZEHN ** (db / DEZIBEL_JE_ZEHNFACH);
}

/** Ist der Wert ein Rechteck aus vier Zahlen? */
function istRechteck(wert: unknown): wert is Rechteck {
  return Array.isArray(wert) && wert.length === 4 && wert.every((z) => typeof z === "number");
}

/** Ist der Wert eine Quelle im Format der Pipeline? */
function istQuelle(wert: unknown): wert is Geraeuschquelle {
  if (typeof wert !== "object" || wert === null) return false;
  const q = wert as { art?: unknown; felder?: unknown };
  return typeof q.art === "string" && Array.isArray(q.felder) && q.felder.every(istRechteck);
}

/**
 * Die Quellen aus der Eigenschaft `geraeuschquellen` einer Tiled-Karte; ohne Eigenschaft oder
 * bei kaputtem Inhalt leer (dann klingt das Geräusch überall auf dem Grundpegel).
 */
export function geraeuschquellenAus(karte: object): Geraeuschquelle[] {
  const eigenschaften =
    (karte as { properties?: readonly { name?: string; value?: unknown }[] }).properties ?? [];
  const roh = eigenschaften.find((p) => p.name === "geraeuschquellen")?.value;
  if (typeof roh !== "string") return [];
  try {
    const liste: unknown = JSON.parse(roh);
    return Array.isArray(liste) ? liste.filter(istQuelle) : [];
  } catch (fehler: unknown) {
    console.warn("geraeuschquellen nicht lesbar:", fehler);
    return [];
  }
}
