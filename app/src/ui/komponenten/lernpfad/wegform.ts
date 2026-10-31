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
/** Platz über der ersten Station einer Etappe für ihren Namen („Teil 1 · Grundlagen“, B1). */
export const KOPF = 64;
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

/** Lage des i-ten Knotens in der e-ten Etappe. Beispiel: i = 0, e = 0 → Mitte, unter dem Kopf. */
function lage(i: number, etappe: number): { x: number; y: number } {
  return {
    x: BREITE / 2 + AUSSCHLAG * Math.sin(i * WELLE),
    y: RAND + i * ABSTAND + (etappe + 1) * KOPF,
  };
}

/** Alle Knoten des Weges von oben nach unten: je Etappe ihre Stationen, dann ihr Orden. */
export function knoten(liste: readonly Etappe[]): Knoten[] {
  const ohneLage = liste.flatMap((etappe, e) => [
    ...etappe.stationen.map((station) => ({ art: "station" as const, station, e })),
    { art: "orden" as const, teil: etappe.teil, verdient: etappe.ordenVerdient, e },
  ]);
  return ohneLage.map(({ e, ...k }, i) => ({ ...k, ...lage(i, e) }));
}

/** Höhe des Koordinatensystems für so viele Knoten und Etappen (je Etappe ein Kopf). */
export function hoehe(anzahl: number, etappen = 0): number {
  return RAND * 2 + Math.max(0, anzahl - 1) * ABSTAND + etappen * KOPF;
}

/** Ein Band der Landschaft: der Bereich einer Etappe von oben (y0) bis unten (y1). */
export interface Band {
  readonly teil: Buchteil;
  readonly y0: number;
  readonly y1: number;
}

/**
 * Die Bänder der Etappen, lückenlos von 0 bis zur Höhe: Jedes beginnt einen halben Abstand und
 * einen Kopf über seiner ersten Station und endet einen halben Abstand unter seinem Orden.
 * Beispiel: zwei Etappen → [{ y0: 0, … }, { y0: Ende des ersten, y1: Höhe }].
 */
export function baender(alle: readonly Knoten[], flaechenhoehe: number): Band[] {
  const teile = [...new Set(alle.map(teilVon))];
  return teile.map((teil, e) => {
    const eigene = alle.filter((k) => teilVon(k) === teil);
    const oben = (eigene[0]?.y ?? 0) - KOPF - ABSTAND / 2;
    const unten = (eigene.at(-1)?.y ?? 0) + ABSTAND / 2;
    return { teil, y0: e === 0 ? 0 : oben, y1: e === teile.length - 1 ? flaechenhoehe : unten };
  });
}

/** Der Teil des Buches, zu dem ein Knoten gehört. */
function teilVon(k: Knoten): Buchteil {
  return k.art === "station" ? k.station.teil : k.teil;
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
