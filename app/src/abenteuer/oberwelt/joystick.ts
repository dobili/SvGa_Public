/**
 * Regeln des Joysticks (Wunsch des Autors, 26.11.2026: „die Pfeiltasten gegen einen Joystick
 * austauschen und diagonales Laufen für den Protagonisten ermöglichen … zwei Kreise ineinander“).
 *
 * Aus der Lage des Daumens relativ zur Mitte des Rings folgen: wo der innere Knopf steht (höchstens
 * am Ring), der Ausschlag (0 bis 1), die Laufrichtung in acht Sektoren zu 45 Grad, die
 * Blickrichtung (vier Werte, vorherrschende Achse, steuerrichtung.ts) und die Gangart (gangart.ts).
 * - Totzone: unter TOTZONE des Radius läuft der Held nicht (ein ruhender Daumen zittert).
 * - Hysterese an den Sektorgrenzen: Die bisherige Richtung gilt, bis der Daumen SEKTOR_HYSTERESE_GRAD
 *   über die Grenze hinaus ist; sonst flackert das Bild zwischen gerade und schräg.
 * Rolle im Gesamtbild: reine Logik für oberwelt/Joystick.tsx (getestet in joystick.test.ts).
 * Abhängigkeiten: achtrichtung.ts, gangart.ts, steuerrichtung.ts.
 */
import { istSchraege, type Achtrichtung, type Hauptrichtung } from "./achtrichtung";
import { gangartZu, type Gangart } from "./gangart";
import { richtungZu } from "./steuerrichtung";

/** Daumenradius in CSS-Pixeln: so weit wandert der innere Knopf (Ring 112 px, bedienung.css). */
export const DAUMENRADIUS_PX = 56;
/** Unter diesem Anteil des Radius läuft der Held nicht. */
export const TOTZONE = 0.15;
/** Breite eines Sektors und Zugabe über seine Grenze, solange die Richtung schon gilt. */
const SEKTOR_GRAD = 45;
export const SEKTOR_HYSTERESE_GRAD = 8;
const HALBKREIS_GRAD = 180;
const VOLLKREIS_GRAD = 360;

/** Was der Joystick bisher meldete. */
export interface Joysticklage {
  readonly richtung: Achtrichtung | null;
  readonly blick: Hauptrichtung | null;
  readonly gangart: Gangart;
  /** Lage des inneren Knopfs relativ zur Mitte, in CSS-Pixeln. */
  readonly knopf: { readonly x: number; readonly y: number };
  readonly ausschlag: number;
}

/** Ruhelage: Knopf in der Mitte, keine Richtung. */
export const RUHE: Joysticklage = {
  richtung: null,
  blick: null,
  gangart: "gehen",
  knopf: { x: 0, y: 0 },
  ausschlag: 0,
};

/**
 * Winkel in Grad, 0 nach rechts, gegen den Uhrzeigersinn (y des Bildschirms zeigt nach unten).
 * Auch für die Begleiter (gefolgeschicht.ts). Beispiel: (1, −1) → 45.
 */
export function winkelVon(dx: number, dy: number): number {
  const w = (Math.atan2(-dy, dx) * HALBKREIS_GRAD) / Math.PI;
  return (w + VOLLKREIS_GRAD) % VOLLKREIS_GRAD;
}

/** Mittelwinkel einer Richtung. Beispiel: rechts 0, rechtsOben 45, oben 90. */
const IM_KREIS: readonly Achtrichtung[] = [
  "rechts",
  "rechtsOben",
  "oben",
  "linksOben",
  "links",
  "linksUnten",
  "unten",
  "rechtsUnten",
];
function mittelwinkel(r: Achtrichtung): number {
  return IM_KREIS.indexOf(r) * SEKTOR_GRAD;
}

/** Kleinster Abstand zweier Winkel in Grad. Beispiel: 350 und 10 → 20. */
function winkelabstand(a: number, b: number): number {
  const d = Math.abs(a - b) % VOLLKREIS_GRAD;
  return d > HALBKREIS_GRAD ? VOLLKREIS_GRAD - d : d;
}

/**
 * Die Richtung im Sektor des Winkels, mit Hysterese zur bisherigen.
 * Beispiel: 30 Grad → rechtsOben; 20 Grad nach „rechtsOben“ → bleibt (Hysterese); 10 Grad → rechts.
 */
export function sektorZu(w: number, alt: Achtrichtung | null): Achtrichtung {
  if (alt && winkelabstand(w, mittelwinkel(alt)) <= SEKTOR_GRAD / 2 + SEKTOR_HYSTERESE_GRAD) {
    return alt;
  }
  const sektor = Math.round(w / SEKTOR_GRAD) % IM_KREIS.length;
  return IM_KREIS[sektor] ?? "rechts";
}

/**
 * Die neue Lage zum Versatz (dx, dy) des Daumens von der Mitte des Rings.
 * Eingaben: Versatz in CSS-Pixeln (y nach unten), bisherige Lage, Radius (Vorgabe 56 px).
 * Beispiel: (30, 0) → rechts, gehen; (40, −40) → rechtsOben, rennen (Ausschlag 1, Knopf am Ring);
 * (5, 0) → keine Richtung (Totzone), Knopf bei (5, 0).
 */
export function joystickLage(
  dx: number,
  dy: number,
  alt: Joysticklage,
  radius = DAUMENRADIUS_PX,
): Joysticklage {
  const weite = Math.hypot(dx, dy);
  const ausschlag = Math.min(1, weite / radius);
  const kuerzung = weite > radius ? radius / weite : 1;
  const knopf = { x: dx * kuerzung, y: dy * kuerzung };
  if (ausschlag < TOTZONE) return { ...RUHE, knopf, ausschlag };
  const richtung = sektorZu(winkelVon(dx, dy), alt.richtung);
  // Blick: die vorherrschende Achse mit Hysterese; bei einer geraden Richtung sie selbst.
  const blick = istSchraege(richtung) ? (richtungZu(dx, dy, alt.blick) ?? alt.blick) : richtung;
  return { richtung, blick, gangart: gangartZu(ausschlag, alt.gangart), knopf, ausschlag };
}
