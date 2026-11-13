/**
 * Kurze Motive, die der Browser selbst erzeugt statt sie aus einer Datei zu spielen (Klangplan,
 * Gesamtübersicht: „kurze Motive im Browser erzeugen wie die Zugtöne“; Vorschlag von mittel-4).
 *
 * Rolle im Gesamtbild: reine Beschreibung der Töne; ton/motivspieler.ts spielt sie mit Web Audio.
 * Eine Kennung ist entweder ein Motiv von hier oder eine Datei im Paket: Der Spieler fragt zuerst
 * hier (ton/tonspieler.ts, spieleEinmal). So kostet ein Motiv keinen Speicher und keine Lizenz.
 * Tonhöhen in Stufen der Tonleiter von Maple Falls (G-Dur), wie der Klangplan sie nennt (A1, A4).
 * Abhängigkeiten: keine.
 */

/** Klangfarbe eines erzeugten Tons. */
export type Klangfarbe = "glocke" | "klavier" | "streicher" | "digital";

/** Ein Ton: Frequenz in Hertz, Beginn und Dauer in Sekunden, Lautstärke 0 bis 1. */
export interface Motivton {
  readonly hz: number;
  readonly beginn: number;
  readonly dauer: number;
  readonly laut: number;
}

export interface Motiv {
  readonly farbe: Klangfarbe;
  readonly toene: readonly Motivton[];
}

/** Grundton G3 (Tonart von Maple Falls) und die Dur-Stufen in Halbtönen. */
const GRUNDTON_HZ = 196;
const DUR = [0, 2, 4, 5, 7, 9, 11, 12] as const;
const HALBTOENE_JE_OKTAVE = 12;
const OKTAVE = 12;

/** Frequenz einer Stufe (1 = Grundton) mit Oktavverschiebung, optional um Halbtöne verändert. */
function stufe(nummer: number, oktave = 0, halbtoene = 0): number {
  const index = Math.min(DUR.length, Math.max(1, nummer)) - 1;
  const abstand = (DUR[index] ?? 0) + oktave * OKTAVE + halbtoene;
  return GRUNDTON_HZ * 2 ** (abstand / HALBTOENE_JE_OKTAVE);
}

/** Ein einzelner Ton ab Sekunde 0. */
function einTon(farbe: Klangfarbe, hz: number, dauer: number, laut: number): Motiv {
  return { farbe, toene: [{ hz, beginn: 0, dauer, laut }] };
}

/** Die festen Motive des Klangplans (A4, 2A3, 3A3, 4A3), soweit ein Ton oder zwei genügen. */
const MOTIVE: Readonly<Record<string, Motiv>> = {
  // Glockenspiel, 0,8 s: 5 und hohe 1, kurz nacheinander (jede gelöste Aufgabe).
  aha: {
    farbe: "glocke",
    toene: [
      { hz: stufe(5, 2), beginn: 0, dauer: 0.6, laut: 0.5 },
      { hz: stufe(8, 2), beginn: 0.12, dauer: 0.7, laut: 0.45 },
    ],
  },
  // Trockenes Digitalpiano, ein Ton, 1,5 s (der Konzern).
  konzern: einTon("digital", stufe(1, 1), 1.5, 0.35),
  // Ein einzelner tiefer Ton, 3 s (Kap. 9 bei „Hale“).
  hale: einTon("streicher", stufe(1, -2), 3, 0.6),
  // Victor gibt auf: die 1 auf dem Klavier, 3 s.
  aufgabe: einTon("klavier", stufe(1), 3, 0.5),
  // Ein einzelner falscher Ton im Finale: die ♭2 auf dem Klavier.
  fehler: einTon("klavier", stufe(2, 1, -1), 1.5, 0.45),
  // „Atme“: die 5, Cello, 6 s.
  atme: einTon("streicher", stufe(5, -1), 6, 0.45),
  // Ein warmer Ton, wenn das Mondlicht Kerzenlicht wird.
  kerzenton: einTon("klavier", stufe(3, 1), 4, 0.4),
};

const BLINDSCHACH = "blindschach.";
const LINIEN = "abcdefgh";
/** Je Reihe so viele Halbtöne höher (Reihe 1 tief, Reihe 8 hoch). */
const HALBTOENE_JE_REIHE = 3;

/**
 * Ton eines Feldes im Blindschach (Kap. 54): Linie a bis h = Stufen 1 bis 7 und 1', Reihe 1 bis
 * 8 = Lage von tief nach hoch; Glockenspiel. Beispiel: „blindschach.e4“ → Stufe 5, Reihe 4.
 */
function blindschachton(feld: string): Motiv | null {
  const linie = LINIEN.indexOf(feld.charAt(0));
  const reihe = Number(feld.charAt(1));
  if (feld.length !== 2 || linie < 0 || !(reihe >= 1 && reihe <= LINIEN.length)) return null;
  return einTon("glocke", stufe(linie + 1, 1, (reihe - 1) * HALBTOENE_JE_REIHE), 0.9, 0.35);
}

/**
 * Das erzeugte Motiv zu einer Kennung, oder null (dann ist es eine Datei im Paket).
 * Beispiele: „aha“ → Glockenspiel; „blindschach.e4“ → ein Ton; „wasserfall“ → null.
 */
export function motivFuer(kennung: string): Motiv | null {
  if (kennung.startsWith(BLINDSCHACH)) return blindschachton(kennung.slice(BLINDSCHACH.length));
  return MOTIVE[kennung] ?? null;
}
