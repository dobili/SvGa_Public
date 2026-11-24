/**
 * Kahle Laubbäume für den Winter ohne Schnee (RO53.5, Kartenblick 24.11.2026).
 *
 * Warum: Im Süden (Altstadt Silicon Bay, Pelikaninsel, Deich, Glasbrücke, Raststätte) ist Winter
 * ohne Schnee: fahles Gras, kahle Laubbäume, Nadelbäume bleiben. Die gekauften Pakete haben keine
 * kahlen Bäume; die Krone eines Laubbaums wird entfernt und durch gezeichnete Äste in der Farbe des
 * Stamms ersetzt, ein lichter Schleier aus Zweigpunkten hält den Umriss.
 *
 * Dieselbe Regel steht in pipeline/abenteuer/kahlbaum.py (Ablauf dort im Dateikopf; Änderungen
 * gehören in beide). Die Prüfsummen in kahlbaum.test.ts und test_abenteuer_winter.py sind gleich.
 *
 * Rolle im Gesamtbild: reine Logik auf RGBA-Bilddaten; jahreszeitfarben.ts ruft `kahl` für jedes
 * Möbel der Sorte „laubbaum“ auf einer Karte mit `jahreszeit: winter_mild`.
 */
import { hls } from "./winter";

const VOLL = 255;
const KANAELE = 4;
const GRUEN = [0.17, 0.5] as const;
const GRUEN_SAETTIGUNG = 0.15;
const DUNKELGRUEN = [0.17, 0.6] as const;
const DUNKEL_SAETTIGUNG = 0.05;
const DUNKEL_HELLIGKEIT = 0.35;
const WARM_BIS = 0.17;
const WARM_AB = 0.9;
const WARM_SAETTIGUNG = 0.35;
const WARM_HELLIGKEIT = 0.3;
const BRAUN_BIS = 0.13;
const BRAUN_AB = 0.95;
const BRAUN_SAETTIGUNG = 0.12;
const BRAUN_HELLIGKEIT = 0.78;
const HOLZ_AB = 0.45;
const FUSS_ABSTAND = 3;
const RANDSCHATTEN = 0.28;
const RANDSCHATTEN_ZEILEN = 3;
const STAMMFARBE = [92, 70, 58] as const;
const SCHLEIER_ALPHA = 70;
const SCHLEIER_TEILER = 13;
const DICK_AB = 20;
const ASTRICHTUNGEN = [-0.7, 0.7, -0.4, 0.4] as const;
const AST_ABSTAND = [0.25, 0.2] as const;
const AST_LAENGE = 0.45;
const ZWEIG_DREHUNG = 0.9;
const ZWEIG_SPREIZUNG = 1.6;
const ZWEIG_ZUSATZ = 0.5;
const AST_STUFEN = 2;

type Farbe = readonly [number, number, number];

/** Die Farbe von Pixel i (r, g, b) und ob es deckend ist. */
function farbeBei(d: Uint8ClampedArray, i: number): Farbe {
  const k = i * KANAELE;
  return [d[k] ?? 0, d[k + 1] ?? 0, d[k + 2] ?? 0];
}

function deckend(d: Uint8ClampedArray, i: number): boolean {
  return (d[i * KANAELE + 3] ?? 0) > 0;
}

/** Grünes Laub oder dunkler, blaugrüner Kronenrand. */
export function istGruen([r, g, b]: Farbe): boolean {
  const [h, l, s] = hls(r, g, b);
  if (h > GRUEN[0] && h < GRUEN[1] && s > GRUEN_SAETTIGUNG) return true;
  return h > DUNKELGRUEN[0] && h < DUNKELGRUEN[1] && s > DUNKEL_SAETTIGUNG && l < DUNKEL_HELLIGKEIT;
}

/** Rotes, oranges oder gelbes Herbstlaub. */
export function istWarm([r, g, b]: Farbe): boolean {
  const [h, l, s] = hls(r, g, b);
  return (h < WARM_BIS || h > WARM_AB) && s > WARM_SAETTIGUNG && l > WARM_HELLIGKEIT;
}

/** Holz: braun bis rotbraun, nicht zu hell. */
function istBraun([r, g, b]: Farbe): boolean {
  const [h, l, s] = hls(r, g, b);
  return (h < BRAUN_BIS || h > BRAUN_AB) && s > BRAUN_SAETTIGUNG && l < BRAUN_HELLIGKEIT;
}

/** Mehr warme als grüne deckende Pixel: Rot, Orange und Gelb sind dann Laub. */
export function istHerbstbaum(d: Uint8ClampedArray): boolean {
  let warm = 0;
  let gruen = 0;
  for (let i = 0; i < d.length / KANAELE; i++) {
    if (!deckend(d, i)) continue;
    if (istWarm(farbeBei(d, i))) warm++;
    if (istGruen(farbeBei(d, i))) gruen++;
  }
  return warm > gruen;
}

interface Krone {
  readonly maske: readonly boolean[];
  readonly holz: readonly number[];
  readonly oben: number;
  readonly unten: number;
}

/** Kronenmaske, Holzpixel und oberste und unterste Kronenzeile; null ohne Laub. */
function krone(d: Uint8ClampedArray, breite: number, hoehe: number): Krone | null {
  const herbst = istHerbstbaum(d);
  const laub = (f: Farbe) => istGruen(f) || (herbst && istWarm(f));
  const anzahl = breite * hoehe;
  const zeile = (i: number) => Math.floor(i / breite);
  const holz: number[] = [];
  for (let i = 0; i < anzahl; i++) {
    if (deckend(d, i) && istBraun(farbeBei(d, i)) && zeile(i) > hoehe * HOLZ_AB) holz.push(i);
  }
  const fuss = (holz.length > 0 ? Math.max(...holz.map(zeile)) : hoehe) - FUSS_ABSTAND;
  const zeilen: number[] = [];
  for (let i = 0; i < anzahl; i++) {
    if (deckend(d, i) && zeile(i) < fuss && laub(farbeBei(d, i))) zeilen.push(zeile(i));
  }
  if (zeilen.length === 0) return null;
  const oben = Math.min(...zeilen);
  const unten = Math.max(...zeilen);
  const vollBis = unten - Math.floor((unten - oben) / 3);
  const maske: boolean[] = [];
  for (let i = 0; i < anzahl; i++) {
    const f = farbeBei(d, i);
    const y = zeile(i);
    maske.push(deckend(d, i) && y <= unten && (laub(f) || !istBraun(f) || y < vollBis));
  }
  return { maske, holz, oben, unten };
}

/** Mitte des sichtbaren Stamms und seine Astfarbe (ein dunkles Holzpixel). */
function stamm(d: Uint8ClampedArray, breite: number, k: Krone): [number, Farbe] {
  const sichtbar = k.holz.filter((i) => !k.maske[i]);
  if (sichtbar.length === 0) return [Math.floor(breite / 2), STAMMFARBE];
  const xs = sichtbar.map((i) => i % breite).sort((a, b) => a - b);
  const summe = (i: number) => farbeBei(d, i).reduce((a, b) => a + b, 0);
  const dunkel = [...sichtbar].sort((a, b) => summe(a) - summe(b) || a - b);
  return [
    xs[Math.floor(xs.length / 2)] ?? 0,
    farbeBei(d, dunkel[Math.floor(dunkel.length / 4)] ?? 0),
  ];
}

/** Ein Pixel setzen (Farbe und Deckkraft). */
function setzePixel(d: Uint8ClampedArray, i: number, [r, g, b]: Farbe, a: number): void {
  const k = i * KANAELE;
  [d[k], d[k + 1], d[k + 2], d[k + 3]] = [r, g, b, a];
}

/** Stamm und Äste in die (leere) Krone zeichnen, nur innerhalb des alten Umrisses. */
function aeste(
  d: Uint8ClampedArray,
  breite: number,
  hoehe: number,
  k: Krone,
  sx: number,
  farbe: Farbe,
): void {
  const setze = (x: number, y: number) => {
    if (x >= 0 && x < breite && y >= 0 && y < hoehe && k.maske[y * breite + x]) {
      setzePixel(d, y * breite + x, farbe, VOLL);
    }
  };
  const ast = (x: number, y: number, dx: number, laenge: number, stufe: number): void => {
    let fx = x;
    const erste = Math.floor(laenge / 3);
    const zweite = Math.floor((2 * laenge) / 3);
    for (let t = 0; t < laenge; t++) {
      fx += dx;
      setze(Math.round(fx), y - t);
      if (stufe < AST_STUFEN && (t === erste || t === zweite)) {
        const neu =
          t === erste
            ? dx <= 0
              ? ZWEIG_DREHUNG
              : -ZWEIG_DREHUNG
            : dx * ZWEIG_SPREIZUNG + (dx >= 0 ? ZWEIG_ZUSATZ : -ZWEIG_ZUSATZ);
        ast(Math.round(fx), y - t, neu, Math.max(2, Math.floor(laenge / 2)), stufe + 1);
      }
    }
  };
  const hoch = k.unten - k.oben;
  for (let y = k.oben + Math.floor(hoch / 4); y <= k.unten; y++) {
    setze(sx, y);
    if (hoch > DICK_AB && y > k.oben + Math.floor(hoch / 2)) setze(sx + 1, y);
  }
  ASTRICHTUNGEN.forEach((dx, n) => {
    const y0 = k.unten - Math.floor(hoch * (AST_ABSTAND[0] + AST_ABSTAND[1] * n));
    ast(sx, y0, dx, Math.floor(hoch * AST_LAENGE), 0);
  });
}

/**
 * Ein Laubbaum ohne Laub, an Ort und Stelle (Ablauf in kahlbaum.py). Ohne Laub (Stumpf, Pfahl)
 * bleibt das Bild. Beispiel: runde grüne Krone über braunem Stamm → Stamm mit Astwerk.
 */
export function kahl(daten: Uint8ClampedArray, breite: number, hoehe: number): void {
  const alt = Uint8ClampedArray.from(daten);
  const k = krone(alt, breite, hoehe);
  if (!k) return;
  const [sx, farbe] = stamm(alt, breite, k);
  k.maske.forEach((drin, i) => {
    if (!drin) return;
    const [x, y] = [i % breite, Math.floor(i / breite)];
    const schleier = (x * 7 + y * 11 + ((x * y) % 5)) % SCHLEIER_TEILER === 0;
    setzePixel(daten, i, schleier ? farbe : [0, 0, 0], schleier ? SCHLEIER_ALPHA : 0);
  });
  for (let y = k.unten + 1; y < Math.min(hoehe, k.unten + 1 + RANDSCHATTEN_ZEILEN); y++) {
    for (let x = 0; x < breite; x++) {
      const i = y * breite + x;
      const [r, g, b] = farbeBei(alt, i);
      if (deckend(alt, i) && hls(r, g, b)[1] < RANDSCHATTEN) setzePixel(daten, i, farbe, VOLL);
    }
  }
  aeste(daten, breite, hoehe, k, sx, farbe);
}
