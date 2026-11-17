/**
 * Vorausschauende Kamera der Oberwelt, reine Rechenregeln ohne Phaser (getestet in
 * kameravoraus.test.ts; angebunden in kamerafuehrung.ts).
 *
 * Warum: Im Querformat zeigt die Kamera über dem Helden nur etwa vier Kacheln; große Gebäude
 * waren vor ihrer Tür halb abgeschnitten (Spieltest 17.11.2026, Befund 6). Im Hochformat lag die
 * Haustür im Wohnzimmer hinter dem Steuerkreuz (Befund 5). Die Kamera schaut deshalb beim Laufen
 * in Laufrichtung voraus, und läuft der Held auf einen Auslöser zu (Tür, Treppe, Schild), rückt
 * sie so weit, dass der Auslöser samt dem, was hinter ihm liegt (Gebäude über der Tür), in der
 * freien Fläche neben den Bedienelementen liegt.
 *
 * Regeln:
 * - Voraus: VORAUS_KACHELN in Laufrichtung, beim Stehen null.
 * - Ziel: Der nächste Auslöser höchstens ZIEL_REICHWEITE Kacheln voraus (quer höchstens eine
 *   Kachel daneben) soll mit ZIEL_UEBERSTAND Kacheln dahinter in der freien Fläche liegen.
 * - Grenze: Der Held bleibt mindestens HELD_RAND Kacheln vom Rand der freien Fläche entfernt.
 * - Weich: Der Versatz nähert sich dem Ziel exponentiell, beim Laufen schnell, beim Stehen langsam
 *   (zurück zur Mitte); ein Richtungswechsel ruckt so nicht.
 * Am Kartenrand hält die Kamera wie bisher an ihren Grenzen (kamera.ts, Phaser setBounds).
 * Abhängigkeiten: kamera.ts (Typ Raender).
 */
import type { Raender } from "./kamera";

/** So weit schaut die Kamera beim Laufen voraus, in Kacheln. */
export const VORAUS_KACHELN = 2;
/** Auslöser bis so weit voraus nimmt die Kamera ins Bild, in Kacheln. */
export const ZIEL_REICHWEITE = 6;
/** Hinter einem Auslöser soll so viel mit ins Bild (das Gebäude über der Tür), in Kacheln. */
export const ZIEL_UEBERSTAND = 3;
/** Quer zur Laufrichtung zählt ein Auslöser bis so weit daneben, in Kacheln. */
const ZIEL_QUER = 1;
/** So viel Abstand hält der Held mindestens zum Rand der freien Fläche, in Kacheln. */
export const HELD_RAND = 2;
/** Zeitkonstanten der Nachführung: beim Laufen schnell, beim Stehen langsam zurück. */
export const LAUF_MS = 350;
export const RUECK_MS = 900;

export type Laufrichtung = "oben" | "unten" | "links" | "rechts";

/** Ein Versatz in Kartenpixeln (positiv: nach rechts bzw. nach unten). */
export interface Versatz {
  readonly x: number;
  readonly y: number;
}

export const OHNE_VERSATZ: Versatz = { x: 0, y: 0 };

const SCHRITT: Readonly<Record<Laufrichtung, Versatz>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};

/** Freie Fläche neben den Bedienelementen: halbe Breite und Höhe in Kartenpixeln. */
function halbFrei(sicht: Versatz, raender: Raender): Versatz {
  return {
    x: Math.max(0, (sicht.x - raender.links - raender.rechts) / 2),
    y: Math.max(0, (sicht.y - raender.oben - raender.unten) / 2),
  };
}

/**
 * Höchster Versatz je Achse: Der Held bleibt HELD_RAND Kacheln im Bild. Beispiel: quer 267 × 140,
 * links 61, rechts 32, oben 19 → frei 174 × 121, halb 87 × 60,5; bei Kachel 16 höchstens
 * 55 × 28,5.
 */
export function hoechsterVersatz(sicht: Versatz, raender: Raender, kachel: number): Versatz {
  const h = halbFrei(sicht, raender);
  return {
    x: Math.max(0, h.x - HELD_RAND * kachel),
    y: Math.max(0, h.y - HELD_RAND * kachel),
  };
}

/** Der nächste Auslöser voraus (Mittelpunkte in Kartenpixeln), sonst null; dazu sein Abstand. */
function naechstesZiel(
  richtung: Laufrichtung,
  held: Versatz,
  ziele: readonly Versatz[],
  kachel: number,
): number | null {
  const s = SCHRITT[richtung];
  let bester: number | null = null;
  for (const z of ziele) {
    const vor = (z.x - held.x) * s.x + (z.y - held.y) * s.y;
    const quer = Math.abs((z.x - held.x) * s.y) + Math.abs((z.y - held.y) * s.x);
    if (vor <= 0 || vor > ZIEL_REICHWEITE * kachel || quer > ZIEL_QUER * kachel) continue;
    if (bester === null || vor < bester) bester = vor;
  }
  return bester;
}

/**
 * Wohin der Versatz streben soll. Eingaben: Laufrichtung (null beim Stehen), Held und Auslöser in
 * Kartenpixeln (Mittelpunkte), sichtbare Fläche (Kartenpixel), verdeckte Ränder, Kachelgröße.
 * Beispiel: quer 267 × 140 (oben 19 verdeckt), Held läuft nach oben auf eine Tür 2 Kacheln voraus:
 * Tür samt 3 Kacheln Gebäude braucht 32 + 56 − (60,5 − 8) = 35,5, begrenzt auf 28,5 nach oben.
 */
export function zielVersatz(
  richtung: Laufrichtung | null,
  held: Versatz,
  ziele: readonly Versatz[],
  sicht: Versatz,
  raender: Raender,
  kachel: number,
): Versatz {
  if (!richtung) return OHNE_VERSATZ;
  const s = SCHRITT[richtung];
  const grenze = hoechsterVersatz(sicht, raender, kachel);
  const achseGrenze = s.x !== 0 ? grenze.x : grenze.y;
  const halb = s.x !== 0 ? halbFrei(sicht, raender).x : halbFrei(sicht, raender).y;
  let weite = VORAUS_KACHELN * kachel;
  const abstand = naechstesZiel(richtung, held, ziele, kachel);
  if (abstand !== null) {
    // Ziel samt Überstand soll eine halbe Kachel vor dem Rand der freien Fläche enden.
    const noetig = abstand + (ZIEL_UEBERSTAND + 0.5) * kachel - (halb - kachel / 2);
    weite = Math.max(weite, noetig);
  }
  weite = Math.min(weite, achseGrenze);
  return { x: s.x * weite, y: s.y * weite };
}

/**
 * Ein Schritt der weichen Nachführung: exponentiell zum Ziel, mit LAUF_MS beim Laufen und
 * RUECK_MS beim Stehen. Beispiel: 0 → 32 in 350 ms beim Laufen ergibt etwa 20,2.
 */
export function naehere(
  aktuell: Versatz,
  ziel: Versatz,
  deltaMs: number,
  laeuft: boolean,
): Versatz {
  const anteil = 1 - Math.exp(-Math.max(0, deltaMs) / (laeuft ? LAUF_MS : RUECK_MS));
  return {
    x: aktuell.x + (ziel.x - aktuell.x) * anteil,
    y: aktuell.y + (ziel.y - aktuell.y) * anteil,
  };
}
