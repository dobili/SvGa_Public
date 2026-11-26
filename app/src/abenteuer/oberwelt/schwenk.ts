/**
 * Kameraschwenk aus dem Dialog (Wunsch des Autors, 26.11.2026): Beschreibt eine Erzählzeile, was
 * auf der Karte zu sehen ist („In der Mitte steht die Bibliothek“), fährt die Kamera dorthin,
 * während der Held stehen bleibt; am Ende kommt sie zu ihm zurück. Ink-Tag `#schwenk:ZIEL`:
 * Name eines Auslösers, einer Figur oder eines Kartenobjekts (Möbel, Gebäude), oder `x,y` in
 * Kacheln; `#schwenk:held` führt zurück, ebenso das Dialogende.
 *
 * Diese Datei rechnet nur: Ziel auflösen, Folgeversatz der Kamera fürs Ziel, Dauer und Verlauf der
 * Fahrt. Die Fahrt selbst führt oberwelt/kamerafuehrung.ts, die Anbindung an die Szene
 * oberwelt/schwenkschicht.ts, den Dialog oberwelt/useBuehne.ts.
 * Abhängigkeiten: kamera.ts (Ränder), kameravoraus.ts (Versatz).
 */
import type { Raender } from "./kamera";
import { RUECK_MS, VORAUS_KACHELN, type Versatz } from "./kameravoraus";

/**
 * Tempo der Fahrt (Wunsch des Autors, 26.11.2026): ruhig wie das Zurückgleiten der
 * vorausschauenden Kamera, mal SCHWENK_FAKTOR. Das Zurückgleiten legt VORAUS_KACHELN in RUECK_MS
 * zurück (kameravoraus.ts), etwa 2,2 Kacheln je Sekunde; das Grundtempo ist das Dreifache, rund
 * 6,7 Kacheln je Sekunde, und wandert mit, wenn sich das Zurückgleiten ändert.
 */
export const SCHWENK_FAKTOR = 3;
export const SCHWENK_KACHELN_JE_S = (SCHWENK_FAKTOR * VORAUS_KACHELN) / (RUECK_MS / 1000);
/** Bis zu dieser Strecke (Kacheln) bleibt die Spitze beim Grundtempo; darüber wächst sie mit. */
export const SCHWENK_SCHWELLE_KACHELN = 12;
/** Höchste Spitze als Vielfaches des Grundtempos (weite Schwenks über große Karten). */
export const SCHWENK_SPITZENFAKTOR = 3;
/** Anfahren und Abbremsen dauern je diesen Anteil der Strecke; dazwischen gleichmäßig. */
export const SCHWENK_RAMPE = 1 / 3;
/** Sehr kurze Wege dauern trotzdem so lange (kein Zucken). */
export const SCHWENK_MIN_MS = 800;
const MS_JE_S = 1000;

/**
 * Bei Kartenobjekten zielt die Kamera auf drei Viertel der Höhe: In der Aufsicht ist das die
 * Vorderseite mit Tür und Treppe; die Mitte eines großen Gebäudes zeigte nur Dach und Mauer
 * (Bibliothek in Cedar Creek, 18 × 16 Kacheln, Foto 26.11.2026).
 */
const VORNE = 0.75;
/** Zurück zum Helden. */
export const HELD = "held";

/** Ein Kartenobjekt mit Rechteck in Kartenpixeln (Möbel, Gebäude). */
export interface Schwenkobjekt {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly breite: number;
  readonly hoehe: number;
}

/** Was die Karte zum Auflösen eines Ziels bietet. */
export interface Schwenkkarte {
  readonly kachel: number;
  /** Auslöser (Kachelkoordinaten) mit Namen. */
  readonly ausloeser: readonly { readonly name: string; readonly x: number; readonly y: number }[];
  /** Lage einer Figur in Kartenpixeln, oder null, wenn sie nicht auf der Karte steht. */
  readonly figur: (name: string) => Versatz | null;
  readonly objekte: readonly Schwenkobjekt[];
}

/** Ein aufgelöstes Ziel: Punkt in Kartenpixeln, zurück zum Helden, oder unbekannt (null). */
export type Schwenkziel = Versatz | typeof HELD | null;

const FELD = /^\s*(\d+)\s*,\s*(\d+)\s*$/;

/**
 * Löst `#schwenk:ZIEL` auf. Reihenfolge: `held`, `x,y`, Figur, Auslöser (Mitte aller Kacheln
 * dieses Namens, eine Tür aus zwei Kacheln also zwischen beiden), Kartenobjekt (waagrecht die
 * Mitte, senkrecht die Vorderseite bei drei Vierteln der Höhe; bei mehreren gleichen das erste).
 * Beispiel: „bibliothekTuer“ auf (22,16) und (23,16), Kachel 16 → { x: 368, y: 264 }.
 * Sonderfälle: unbekannter Name → null (die Kamera bleibt, wo sie ist).
 */
export function schwenkziel(angabe: string, karte: Schwenkkarte): Schwenkziel {
  const name = angabe.trim();
  if (name === "" || name === HELD) return HELD;
  const k = karte.kachel;
  const feld = FELD.exec(name);
  if (feld) return { x: Number(feld[1]) * k + k / 2, y: Number(feld[2]) * k + k / 2 };
  const figur = karte.figur(name);
  if (figur) return figur;
  const kacheln = karte.ausloeser.filter((a) => a.name === name);
  if (kacheln.length > 0) {
    const mitte = (werte: number[]) => (Math.min(...werte) + Math.max(...werte)) / 2;
    return {
      x: mitte(kacheln.map((a) => a.x)) * k + k / 2,
      y: mitte(kacheln.map((a) => a.y)) * k + k / 2,
    };
  }
  const objekt = karte.objekte.find((o) => o.name === name);
  return objekt ? { x: objekt.x + objekt.breite / 2, y: objekt.y + objekt.hoehe * VORNE } : null;
}

/**
 * Folgeversatz, der das Ziel in die Mitte der freien Fläche legt. Phaser zielt auf
 * „Held − Versatz“; der Grundversatz der Kameraregie legt so den Helden in die Mitte zwischen den
 * verdeckten Rändern. Für ein Ziel gilt dasselbe mit dem Ziel statt dem Helden.
 * Eingaben: Held und Ziel (Kartenpixel), verdeckte Ränder (Kartenpixel, mit Dialogfenster).
 * Beispiel: Held (100,100), Ziel (300,40), unten 120 verdeckt → { x: −200, y: 0 }.
 */
export function schwenkversatz(held: Versatz, ziel: Versatz, raender: Raender): Versatz {
  return {
    x: held.x - ziel.x + (raender.links - raender.rechts) / 2,
    y: held.y - ziel.y + (raender.oben - raender.unten) / 2,
  };
}

/** Verlauf einer Fahrt: Strecke (Kartenpixel), Spitze (Pixel je ms), Zeit je Rampe und Mitte. */
export interface Profil {
  readonly weg: number;
  readonly spitze: number;
  readonly rampeMs: number;
  readonly mitteMs: number;
}

/**
 * Bewegungsprofil eines Schwenks. Die Spitze ist das Grundtempo bis SCHWENK_SCHWELLE_KACHELN und
 * wächst darüber mit der Strecke bis SCHWENK_SPITZENFAKTOR × Grundtempo. Anfahren und Abbremsen
 * (je SCHWENK_RAMPE der Strecke) folgen einer Kosinuskurve: Das Tempo steigt ohne Ruck von 0 auf
 * die Spitze. Eine Rampe dauert so 2 × Rampenstrecke / Spitze, die Mitte Mittelstrecke / Spitze.
 * Beispiel (Kachel 16): 12 Kacheln → Spitze 6,7 Kacheln/s, 3,0 s; 100 Kacheln → Spitze 20, 8,3 s;
 * 2 Kacheln → 0,5 s gerechnet, gestreckt auf SCHWENK_MIN_MS.
 */
export function schwenkprofil(von: Versatz, nach: Versatz, kachel: number): Profil {
  const weg = Math.hypot(nach.x - von.x, nach.y - von.y);
  const kacheln = weg / kachel;
  const faktor = Math.min(SCHWENK_SPITZENFAKTOR, Math.max(1, kacheln / SCHWENK_SCHWELLE_KACHELN));
  let spitze = (SCHWENK_KACHELN_JE_S * faktor * kachel) / MS_JE_S;
  const dauer = (sp: number) => (2 * 2 * SCHWENK_RAMPE * weg + (1 - 2 * SCHWENK_RAMPE) * weg) / sp;
  if (weg > 0 && dauer(spitze) < SCHWENK_MIN_MS) spitze = dauer(1) / SCHWENK_MIN_MS;
  if (weg === 0) return { weg, spitze, rampeMs: 0, mitteMs: 0 };
  return {
    weg,
    spitze,
    rampeMs: (2 * SCHWENK_RAMPE * weg) / spitze,
    mitteMs: ((1 - 2 * SCHWENK_RAMPE) * weg) / spitze,
  };
}

/** Gesamtdauer eines Profils in ms. */
export function profildauer(p: Profil): number {
  return 2 * p.rampeMs + p.mitteMs;
}

/** Zurückgelegter Anteil der Strecke (0 bis 1) nach `t` ms. */
export function anteil(p: Profil, t: number): number {
  const gesamt = profildauer(p);
  if (p.weg <= 0 || t >= gesamt) return 1;
  const rampe = (z: number) =>
    (p.spitze / 2) * (z - (p.rampeMs / Math.PI) * Math.sin((Math.PI * z) / p.rampeMs));
  const rampeWeg = rampe(p.rampeMs);
  if (t <= p.rampeMs) return rampe(Math.max(0, t)) / p.weg;
  if (t <= p.rampeMs + p.mitteMs) return (rampeWeg + p.spitze * (t - p.rampeMs)) / p.weg;
  return (p.weg - rampe(gesamt - t)) / p.weg;
}

/** Eine laufende Fahrt zwischen zwei Folgeversätzen. */
export interface Fahrt {
  readonly von: Versatz;
  readonly nach: Versatz;
  readonly profil: Profil;
  readonly vergangenMs: number;
}

/** Stand der Fahrt nach `deltaMs` mehr: neuer Versatz und ob sie am Ziel ist. */
export function fahre(
  fahrt: Fahrt,
  deltaMs: number,
): { fahrt: Fahrt; versatz: Versatz; da: boolean } {
  const dauer = profildauer(fahrt.profil);
  const vergangenMs = Math.min(dauer, fahrt.vergangenMs + deltaMs);
  const t = anteil(fahrt.profil, vergangenMs);
  const versatz = {
    x: fahrt.von.x + (fahrt.nach.x - fahrt.von.x) * t,
    y: fahrt.von.y + (fahrt.nach.y - fahrt.von.y) * t,
  };
  return { fahrt: { ...fahrt, vergangenMs }, versatz, da: vergangenMs >= dauer };
}

/**
 * Verdeckte Ränder mit dem Dialogfenster: Hoch liegt es unten, quer als Spalte rechts. Eingaben:
 * Ränder der Bedienung (Kartenpixel), Rechteck des Dialogs und Bildgröße (Bildschirmpixel), Zoom.
 * Beispiel: 390 × 844, Dialog ab y 520, Zoom 3 → unten mindestens 108 Kartenpixel verdeckt.
 */
export function raenderMitDialog(
  raender: Raender,
  dialog: { readonly links: number; readonly oben: number } | null,
  bild: { readonly breite: number; readonly hoehe: number },
  zoom: number,
): Raender {
  if (!dialog) return raender;
  const rechts = dialog.links > bild.breite / 2 ? (bild.breite - dialog.links) / zoom : 0;
  const unten = rechts > 0 ? 0 : Math.max(0, bild.hoehe - dialog.oben) / zoom;
  return {
    ...raender,
    rechts: Math.max(raender.rechts, rechts),
    unten: Math.max(raender.unten, unten),
  };
}
