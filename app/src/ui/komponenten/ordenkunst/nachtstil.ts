/**
 * Der Stil „Nacht und Gold“: dunkler Grund, leuchtende Kante in der Farbe des Stücks, Motiv in
 * Gold; Orden zusätzlich im goldenen Lorbeerkranz mit Schleife.
 *
 * Rolle im Gesamtbild: Variante C der Entwürfe, vom Autor am 30.10.2026 für alle 18 Abzeichen und
 * die Orden der Buch- und Teilringe gewählt. Die Bot-Orden und die Engine bleiben klassisch
 * (botorden.ts). So unterscheiden sich Orden (mit Kranz) und Abzeichen (ohne) auf einen Blick,
 * und jedes Stück hat trotzdem eigene Form, Farbe und Motiv.
 * Abhängigkeiten: zeichnen.ts, motive.ts.
 */
import { FORM, motiv, type Formname, type Motivangabe } from "./motive";
import { funkeln, lorbeer, metall, neueId, r2 } from "./zeichnen";

/** Angaben eines Stücks im Nachtstil. */
export interface Nachtangabe {
  readonly form: Formname;
  readonly motiv: Motivangabe;
  /** Farbe der leuchtenden Kante und der Akzente. */
  readonly akzent: string;
  /** Mitte des dunklen Grundes (ohne Angabe ein tiefes Blau). */
  readonly grund?: string;
  /** Verschiebung des Motivs nach unten (Tropfenform: Auge tiefer, Wunsch des Autors). */
  readonly tiefer?: number;
}

/** Eine fertige Zeichnung: Verläufe, Inhalt und Umriss (für Glanz und Silhouette). */
export interface Zeichnung {
  readonly defs: string;
  readonly inhalt: string;
  readonly umriss: string;
  /** Ausschnitt des Bildes (viewBox). */
  readonly ansicht: string;
}

const MITTE_X = 50;
const GOLD_DUNKEL = "#8f6a10";
const GOLD = "#d4a92c";
const LICHT = "#fff6c4";
const TIEFES_BLAU = "#1d2a48";
const SCHWARZBLAU = "#05070d";

/** Lage und Größe: Orden kleiner und etwas höher, darunter Platz für Kranz und Schleife. */
function masse(orden: boolean): { cy: number; r: number; ansicht: string } {
  return orden
    ? { cy: 46, r: 32, ansicht: "0 0 100 100" }
    : { cy: 50, r: 42, ansicht: "0 0 100 100" };
}

/** Kranz und Schleife unter dem Orden. */
function kranz(cy: number, r: number, akzent: string): string {
  const unten = cy + r + 6;
  return (
    lorbeer(MITTE_X, cy, r + 9, GOLD, GOLD_DUNKEL) +
    `<path d="M${MITTE_X} ${unten} l-14 10 l2 -12 Z M${MITTE_X} ${unten} l14 10 l-2 -12 Z" fill="${akzent}"/>` +
    `<circle cx="${MITTE_X}" cy="${unten}" r="4" fill="${akzent}" stroke="${LICHT}" stroke-width="0.8"/>`
  );
}

/** Verläufe und Leuchtfilter eines Stücks. */
function nachtDefs(angabe: Nachtangabe): {
  defs: string;
  grund: string;
  kante: string;
  leuchten: string;
  gold: string;
} {
  const gold = metall("gold");
  const grund = neueId("d");
  const kante = neueId("r");
  const leuchten = neueId("n");
  const defs =
    gold.defs +
    `<radialGradient id="${grund}" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="${angabe.grund ?? TIEFES_BLAU}"/><stop offset="1" stop-color="${SCHWARZBLAU}"/></radialGradient>` +
    `<linearGradient id="${kante}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${angabe.akzent}"/><stop offset="1" stop-color="${angabe.akzent}" stop-opacity="0.6"/></linearGradient>` +
    `<filter id="${leuchten}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  return { defs, grund, kante, leuchten, gold: gold.hell };
}

/**
 * Zeichnet ein Stück im Nachtstil.
 * Beispiel: { form: "schild", motiv: "pokal", akzent: "#ffd166" } → Abzeichen „Erster Sieg“.
 */
export function nacht(angabe: Nachtangabe, orden: boolean): Zeichnung {
  const { cy, r, ansicht } = masse(orden);
  const d = nachtDefs(angabe);
  const aussen = FORM[angabe.form](MITTE_X, cy, r);
  const linie = FORM[angabe.form](MITTE_X, cy, r * 0.84);
  const funken =
    funkeln(MITTE_X - r * 0.95, cy - r * 0.75, 0.55, LICHT) +
    funkeln(MITTE_X + r * 0.9, cy + r * 0.7, 0.4, LICHT);
  const farben = { haupt: d.gold, akzent: angabe.akzent, grund: "#0b0f1a" };
  const inhalt =
    (orden ? kranz(cy, r, angabe.akzent) : "") +
    `<path d="${aussen}" fill="url(#${d.grund})" stroke="url(#${d.kante})" stroke-width="3" filter="url(#${d.leuchten})" stroke-linejoin="round"/>` +
    `<path d="${linie}" fill="none" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.8" stroke-linejoin="round"/>` +
    motiv(angabe.motiv, MITTE_X, r2(cy + (angabe.tiefer ?? 0)), r * 1.1, farben) +
    funken;
  return { defs: d.defs, inhalt, umriss: aussen, ansicht };
}
