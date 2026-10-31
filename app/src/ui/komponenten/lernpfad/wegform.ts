/**
 * Form des Lernpfads: wo Stationen und Orden auf dem Weg liegen und wie die Linie schwingt.
 *
 * Rolle im Gesamtbild: Weg.tsx zeichnet in einem festen Koordinatensystem (BREITE × Höhe) die
 * Linie als SVG und legt die Knöpfe der Stationen in Prozent darüber, damit Linie und Knöpfe bei
 * jeder Bildschirmbreite zusammenpassen. Die Knoten folgen den Etappen: erst die Stationen eines
 * Teils, dann sein Orden. Reine Funktionen.
 * Abhängigkeiten: lernpfad.ts (Etappen).
 */
import type { Buchteil } from "../fortschritt/ringrechnung";
import type { Etappe, Station } from "./lernpfad";

/** Breite des Koordinatensystems; die Höhe ergibt sich aus der Zahl der Knoten. */
export const BREITE = 360;
/** Senkrechter Abstand zweier Knoten und Rand oben und unten. */
const ABSTAND = 84;
const RAND = 56;
/** Wie weit der Weg nach links und rechts schwingt, und wie schnell (Bogenmaß je Knoten). */
const AUSSCHLAG = 92;
const WELLE = 0.9;

/** Ein Punkt auf dem Weg: eine Station oder ein Orden. */
export type Knoten =
  | { readonly art: "station"; readonly station: Station; readonly x: number; readonly y: number }
  | {
      readonly art: "orden";
      readonly teil: Buchteil;
      readonly verdient: boolean;
      readonly x: number;
      readonly y: number;
    };

/** Lage des i-ten Knotens. Beispiel: i = 0 → Mitte oben. */
function lage(i: number): { x: number; y: number } {
  return { x: BREITE / 2 + AUSSCHLAG * Math.sin(i * WELLE), y: RAND + i * ABSTAND };
}

/** Alle Knoten des Weges von oben nach unten: je Etappe ihre Stationen, dann ihr Orden. */
export function knoten(liste: readonly Etappe[]): Knoten[] {
  const ohneLage = liste.flatMap((etappe) => [
    ...etappe.stationen.map((station) => ({ art: "station" as const, station })),
    { art: "orden" as const, teil: etappe.teil, verdient: etappe.ordenVerdient },
  ]);
  return ohneLage.map((k, i) => ({ ...k, ...lage(i) }));
}

/** Höhe des Koordinatensystems für so viele Knoten. */
export function hoehe(anzahl: number): number {
  return RAND * 2 + Math.max(0, anzahl - 1) * ABSTAND;
}

/**
 * Die Linie durch die Knoten als SVG-Pfad, mit weichen Bögen (kubisch, senkrechte Tangenten).
 * Beispiel: zwei Knoten (180|56) und (260|140) → „M 180 56 C 180 98 260 98 260 140“.
 */
export function linie(punkte: readonly { x: number; y: number }[]): string {
  const [erster, ...rest] = punkte;
  if (!erster) return "";
  let vorher = erster;
  const boegen = rest.map((p) => {
    const mitte = (vorher.y + p.y) / 2;
    const bogen = `C ${vorher.x} ${mitte} ${p.x} ${mitte} ${p.x} ${p.y}`;
    vorher = p;
    return bogen;
  });
  return [`M ${erster.x} ${erster.y}`, ...boegen].join(" ");
}

/** Lage in Prozent der Fläche, für die Knöpfe über der Zeichnung. */
export function inProzent(
  x: number,
  y: number,
  flaechenhoehe: number,
): { left: string; top: string } {
  const HUNDERT = 100;
  return { left: `${(x / BREITE) * HUNDERT}%`, top: `${(y / flaechenhoehe) * HUNDERT}%` };
}
