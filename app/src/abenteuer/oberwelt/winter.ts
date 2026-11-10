/**
 * Winter ohne Schneebilder (Entscheidung 10.11.2026): Möbelbilder einer Winterkarte (Bäume, Büsche)
 * werden beim Laden umgefärbt, Gras und Laub werden Schnee. Den Hintergrund färbt schon die
 * Pipeline (pipeline/abenteuer/winter.py, dieselbe Regel; Änderungen gehören in beide).
 *
 * Regel je Farbe (Farbton H, Helligkeit L, Sättigung S wie Pythons colorsys.rgb_to_hls):
 * Grün (0,17 < H < 0,45, S > 0,15) → Schnee, die Helligkeit bleibt; Braun (0,05 ≤ H ≤ 0,17,
 * S > 0,2, L > 0,35) → halb zum Grau; Wasser (0,45 ≤ H ≤ 0,6) → kühler, nur mit `wasser` (bei
 * Möbeln aus, sonst würden blaue Autos dunkel).
 *
 * Bäume und Büsche bekommen Schneekappen statt ganz weißer Kronen (faerbeMoebelDaten, Regel 10.67).
 *
 * Rolle im Gesamtbild: Reine Logik plus das Umfärben einer Phaser-Textur über eine Leinwand; die
 * Szene (szene.ts) ruft `faerbeWinterlich` vor dem Aufstellen der Möbel. Winter erkennt sie an der
 * Karteneigenschaft `jahreszeit` (kartenbau schreibt sie aus der Szene).
 */
import type Phaser from "phaser";

type Farbe = readonly [number, number, number];

const VOLL = 255;
const SECHSTEL = 6;
const GRUEN = [0.17, 0.45] as const;
const GRUEN_SAETTIGUNG = 0.15;
const BRAUN = [0.05, 0.17] as const;
const BRAUN_SAETTIGUNG = 0.2;
const BRAUN_HELLIGKEIT = 0.35;
const WASSER = [0.45, 0.6] as const;
const WASSER_FAKTOR = [0.7, 0.8, 0.9] as const;
const SCHNEE_GRUND = 0.72;
const SCHNEE_ANTEIL = 0.28;
const SCHNEE_FARBE = [
  [225, 30],
  [232, 23],
  [245, 10],
] as const;
const KANAELE = 4;

/** Farbton, Helligkeit, Sättigung (je 0 bis 1) wie colorsys.rgb_to_hls. */
export function hls(r: number, g: number, b: number): readonly [number, number, number] {
  const [rr, gg, bb] = [r / VOLL, g / VOLL, b / VOLL];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, l, 0];
  const d = max - min;
  const s = l <= 0.5 ? d / (max + min) : d / (2 - max - min);
  const [rc, gc, bc] = [(max - rr) / d, (max - gg) / d, (max - bb) / d];
  const h = rr === max ? bc - gc : gg === max ? 2 + rc - bc : 4 + gc - rc;
  return [(((h / SECHSTEL) % 1) + 1) % 1, l, s];
}

/**
 * Die Winterfarbe (Regel im Dateikopf); andere Farben bleiben.
 * Beispiel: Gras (106, 170, 72) → Schnee (222, 221, 219); Erde (150, 110, 70) → (130, 110, 90).
 */
export function winterfarbe(r: number, g: number, b: number, wasser = true): Farbe {
  const [h, l, s] = hls(r, g, b);
  if (h > GRUEN[0] && h < GRUEN[1] && s > GRUEN_SAETTIGUNG) {
    const v = SCHNEE_GRUND + SCHNEE_ANTEIL * l;
    const [fr, fg, fb] = SCHNEE_FARBE.map(([f, d]) => Math.min(VOLL, Math.round(f * v + d)));
    return [fr ?? r, fg ?? g, fb ?? b];
  }
  if (h >= BRAUN[0] && h <= BRAUN[1] && s > BRAUN_SAETTIGUNG && l > BRAUN_HELLIGKEIT) {
    const grau = (r + g + b) / 3;
    return [Math.round((r + grau) / 2), Math.round((g + grau) / 2), Math.round((b + grau) / 2)];
  }
  if (wasser && h >= WASSER[0] && h <= WASSER[1]) {
    return [
      Math.round(r * WASSER_FAKTOR[0]),
      Math.round(g * WASSER_FAKTOR[1]),
      Math.round(b * WASSER_FAKTOR[2]),
    ];
  }
  return [r, g, b];
}

// Bäume und Büsche (Regel 10.67): nur oben Schnee, darunter Wintergrün, dunkler Rand bleibt; sonst
// wurden Laubbäume zu weißen Kugeln ohne Stamm („Schneebälle“). Wie schneekappen in winter.py.
const KAPPE_ANTEIL = 0.35;
const KAPPE_MINDESTENS = 2;
const RAND_HELLIGKEIT = 0.22;
const LAUB_GRAU = 0.45;
const LAUB_DUNKEL = 0.85;

/** Ob eine Farbe Laub ist (Regel für Grün) und ob sie ein dunkler Rand ist. */
function laub(r: number, g: number, b: number): { readonly laub: boolean; readonly rand: boolean } {
  const [h, l, s] = hls(r, g, b);
  const ist = h > GRUEN[0] && h < GRUEN[1] && s > GRUEN_SAETTIGUNG;
  return { laub: ist, rand: ist && l < RAND_HELLIGKEIT };
}

/** Laub unter der Schneekappe: zum Grau gezogen und etwas dunkler (Wintergrün). */
export function winterlaub(r: number, g: number, b: number): Farbe {
  const grau = (r + g + b) / 3;
  const f = (c: number) => Math.round((c * (1 - LAUB_GRAU) + grau * LAUB_GRAU) * LAUB_DUNKEL);
  return [f(r), f(g), f(b)];
}

/** Ob das Pixel an Stelle i deckend und Laub ist. */
function istLaub(daten: Uint8ClampedArray, i: number): boolean {
  return (daten[i + 3] ?? 0) > 0 && laub(daten[i] ?? 0, daten[i + 1] ?? 0, daten[i + 2] ?? 0).laub;
}

/** Eine Laubstrecke einer Spalte von `oben` bis vor `ende` färben (Kappe, dann Wintergrün). */
function faerbeStrecke(
  daten: Uint8ClampedArray,
  index: (y: number) => number,
  oben: number,
  ende: number,
  kappe: number,
): void {
  for (let y = oben; y < ende; y++) {
    const i = index(y);
    const [r, g, b] = [daten[i] ?? 0, daten[i + 1] ?? 0, daten[i + 2] ?? 0];
    if (laub(r, g, b).rand) continue;
    [daten[i], daten[i + 1], daten[i + 2]] =
      y - oben < kappe ? winterfarbe(r, g, b) : winterlaub(r, g, b);
  }
}

/**
 * Möbel im Winter, an Ort und Stelle: je Spalte bekommt die oberste Laubstrecke oben eine
 * Schneekappe (35 %, mindestens 2 Pixel), darunter und tiefer Wintergrün; dunkle Ränder bleiben;
 * alles andere wie `winterfarbe` ohne Wasser. Beispiel: 10 hellgrüne Pixel → 4 Schnee, 6 Wintergrün.
 */
export function faerbeMoebelDaten(daten: Uint8ClampedArray, breite: number, hoehe: number): void {
  for (let x = 0; x < breite; x++) {
    const index = (y: number) => (y * breite + x) * KANAELE;
    let erste = true;
    for (let y = 0; y < hoehe;) {
      const i = index(y);
      if (!istLaub(daten, i)) {
        const neu = winterfarbe(daten[i] ?? 0, daten[i + 1] ?? 0, daten[i + 2] ?? 0, false);
        if ((daten[i + 3] ?? 0) > 0) [daten[i], daten[i + 1], daten[i + 2]] = neu;
        y++;
        continue;
      }
      let ende = y;
      while (ende < hoehe && istLaub(daten, index(ende))) ende++;
      const kappe = erste ? Math.max(KAPPE_MINDESTENS, Math.ceil((ende - y) * KAPPE_ANTEIL)) : 0;
      faerbeStrecke(daten, index, y, ende, kappe);
      erste = false;
      y = ende;
    }
  }
}

/** Ob eine Tiled-Karte im Winter spielt (Eigenschaft `jahreszeit`: „winter“). */
export function istWinter(karte: object): boolean {
  const eigenschaften = (karte as { properties?: readonly { name?: string; value?: unknown }[] })
    .properties;
  return (eigenschaften ?? []).some((e) => e.name === "jahreszeit" && e.value === "winter");
}

/** Ersetzt geladene Texturen durch umgefärbte Leinwände (gleicher Schlüssel; ohne Möbelwasser). */
export function faerbeWinterlich(szene: Phaser.Scene, schluessel: readonly string[]): void {
  for (const s of schluessel) {
    if (!szene.textures.exists(s)) continue;
    const quelle = szene.textures.get(s).getSourceImage() as CanvasImageSource & {
      width: number;
      height: number;
    };
    const leinwand = document.createElement("canvas");
    leinwand.width = quelle.width;
    leinwand.height = quelle.height;
    const malen = leinwand.getContext("2d");
    if (!malen) continue;
    malen.drawImage(quelle, 0, 0);
    const bild = malen.getImageData(0, 0, leinwand.width, leinwand.height);
    faerbeMoebelDaten(bild.data, leinwand.width, leinwand.height);
    malen.putImageData(bild, 0, 0);
    szene.textures.remove(s);
    szene.textures.addCanvas(s, leinwand);
  }
}
