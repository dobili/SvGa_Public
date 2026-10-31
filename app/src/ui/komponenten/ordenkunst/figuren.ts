/**
 * Schachfiguren und Roboterköpfe als SVG-Text für die Ordenkunst.
 *
 * Rolle im Gesamtbild: Die Motive der Orden und Abzeichen zeigen, wofür es sie gibt: der Bauer für
 * die Grundlagen und die erste Partie, der fallende König für das erste Matt, ein Roboterkopf je
 * Bot-Bündel (Stufe 1–3 mit Antenne, 4–5 mit Visier, 6–7 mit Hörnern, 8–9 mit Krone). Die Figuren
 * sind eigene, schlichte Umrisse in einem Kasten 20 × 24, keine fremde Schrift und kein Bild.
 * Abhängigkeiten: zeichnen.ts.
 */
import { r2 } from "./zeichnen";

/** Die Figuren der Ordenkunst. */
export type Figurname = "bauer" | "turm" | "koenig" | "dame" | "springer";

/** Umrisse im Kasten 20 × 24 (Mitte 10/12). */
const UMRISS: Readonly<Record<Figurname, string>> = {
  bauer:
    "M10 1.5a4.2 4.2 0 0 1 2.9 7.2H14.5v2.2h-2.3c.4 3.3 1.8 5.8 4 7.8v1.6H3.8v-1.6c2.2-2 3.6-4.5 4-7.8H5.5V8.7h1.6A4.2 4.2 0 0 1 10 1.5zM2.5 20.8h15v2.7h-15z",
  turm: "M3 1.5h3.2v2.8h2.2V1.5h3.2v2.8h2.2V1.5H17v6l-2.8 2v7.4l2.2 2.4v1.5H3.6v-1.5l2.2-2.4V9.5L3 7.5zM2.5 20.8h15v2.7h-15z",
  koenig:
    "M9 0h2v2.2h2.2v2H11v2.4c3.6.4 6.2 2.6 6.2 5.6 0 2.4-1.4 4.6-3.4 6.4v2.2H6.2v-2.2c-2-1.8-3.4-4-3.4-6.4 0-3 2.6-5.2 6.2-5.6V4.2H6.8v-2H9zM2.5 20.8h15v2.7h-15z",
  dame: "M1.6 5.5l3.4 9 1.8-9.6 3.2 8.8 3.2-8.8 1.8 9.6 3.4-9-1.6 13H3.2zM3 18.8h14v2H3zM2.5 20.8h15v2.7h-15z",
  springer:
    "M5 23.5h12.5v-2.8c0-5.2-.8-9.6-3.2-12.8l1.2-3.4-3.3 1.3C9.6 4.6 6.6 5.6 4.6 8.4L1.8 13l1.9 2.2 3.4-1.8 2.3.9c-1 2.4-4.4 4.2-4.4 9.2z",
};

/** Perlen auf den Zacken der Dame. */
const DAMENPERLEN: readonly (readonly [number, number])[] = [
  [1.6, 4.5],
  [6.8, 3.9],
  [13.2, 3.9],
  [18.4, 4.5],
];
const KASTEN_HOEHE = 24;

/** Wie eine Figur gezeichnet wird. */
export interface Figurart {
  /** Nach links schauen (Springer, der dem anderen gegenübersteht). */
  readonly spiegel?: boolean;
  /** Kippen in Grad (der fallende König beim ersten Matt). */
  readonly neigung?: number;
  /** Farbe eines leicht versetzten Schattens, der die Figur geprägt wirken lässt. */
  readonly gepraegt?: string;
}

/**
 * Eine Figur mit Mitte (x, y) und Höhe h.
 * Beispiel: figur("koenig", 0, 0, 30, "#fff6c4", { neigung: 40 }) → fallender König (erstes Matt).
 */
export function figur(
  name: Figurname,
  x: number,
  y: number,
  h: number,
  fill: string,
  art: Figurart = {},
): string {
  const s = h / KASTEN_HOEHE;
  const sx = art.spiegel ? -s : s;
  const lage = `translate(${r2(x)} ${r2(y)}) rotate(${art.neigung ?? 0}) scale(${r2(sx)} ${r2(s)}) translate(-10 -12)`;
  const schatten = art.gepraegt
    ? `<path d="${UMRISS[name]}" fill="${art.gepraegt}" opacity="0.55" transform="translate(0.9 0.9)"/>`
    : "";
  const perlen =
    name === "dame"
      ? DAMENPERLEN.map(
          ([px, py]) => `<circle cx="${px}" cy="${py}" r="1.4" fill="${fill}"/>`,
        ).join("")
      : "";
  const auge =
    name === "springer"
      ? `<circle cx="9.2" cy="9.6" r="1" fill="${art.gepraegt ?? "#000"}" opacity="0.6"/>`
      : "";
  return `<g transform="${lage}">${schatten}<path d="${UMRISS[name]}" fill="${fill}"/>${perlen}${auge}</g>`;
}

/** Die vier Roboterköpfe der Bot-Bündel (Stufe 1–3, 4–5, 6–7, 8–9). */
export type Roboterart = 1 | 2 | 3 | 4;

/** Das Besondere jedes Kopfes oben: Antenne, nichts (Visier im Gesicht), Hörner, Krone. */
function roboterOben(art: Roboterart, farbe: string): string {
  if (art === 1)
    return `<path d="M0 -8 V-13" stroke="${farbe}" stroke-width="1.8"/><circle cx="0" cy="-14" r="2.2" fill="${farbe}"/>`;
  if (art === 3)
    return `<path d="M-8 -7 L-11 -15 L-4 -8 Z M8 -7 L11 -15 L4 -8 Z" fill="${farbe}"/>`;
  if (art === 4)
    return `<path d="M-8 -8 L-8 -15 L-4 -11 L0 -16 L4 -11 L8 -15 L8 -8 Z" fill="${farbe}"/>`;
  return "";
}

/**
 * Roboterkopf (Mitte x, y, Größe s), je Bündel mit eigenem Merkmal; `augen` leuchten.
 * Beispiel: Orden „Stufe 8–9: jeden Bot einmal besiegt“ → Kopf mit Krone.
 */
export function roboter(
  x: number,
  y: number,
  s: number,
  art: Roboterart,
  farbe: string,
  augen: string,
): string {
  const kopf = `<rect x="-10" y="-8" width="20" height="16" rx="${art === 1 ? 8 : 3}" fill="${farbe}"/>`;
  const ohren = `<rect x="-13" y="-3" width="3" height="6" rx="1" fill="${farbe}"/><rect x="10" y="-3" width="3" height="6" rx="1" fill="${farbe}"/>`;
  const gesicht =
    art === 2
      ? `<rect x="-8" y="-4" width="16" height="6" rx="3" fill="${augen}"/><rect x="-4" y="4" width="8" height="1.8" rx="0.9" fill="${augen}"/>`
      : `<circle cx="-4.5" cy="-1" r="2.6" fill="${augen}"/><circle cx="4.5" cy="-1" r="2.6" fill="${augen}"/><rect x="-5" y="4" width="10" height="1.8" rx="0.9" fill="${augen}"/>`;
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${s})">${roboterOben(art, farbe)}${ohren}${kopf}${gesicht}</g>`;
}
