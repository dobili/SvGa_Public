/**
 * Grundbausteine der Ordenkunst: Formen, Verläufe, Schrift und kleine Zeichen als SVG-Text.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Jeder Orden und jedes Abzeichen bekommt ein
 * eigenes Bild, das zu seiner Aufgabe passt, statt derselben Medaille mit wechselndem Zeichen. Der
 * Autor hat auf einer Entwurfsseite je Stück aus drei Varianten gewählt; die gewählten Bilder setzt
 * entwuerfe.ts aus diesen Bausteinen zusammen. Alle Funktionen liefern SVG-Text (keine Elemente),
 * weil ein Bild aus vielen gleichartigen Teilen besteht (Strahlen, Blätter, Felder), die als
 * Schleife über Text am kürzesten zu schreiben und zu prüfen sind.
 * Zahlen in Pfaden und Koordinaten sind Zeichnungsdaten in einem Kasten von 100 Einheiten
 * (Orden mit Band 100 × 130); benannte Werte stehen nur dort, wo sie etwas bedeuten.
 * Abhängigkeiten: keine.
 */

let zaehler = 0;

/**
 * Neue, im Dokument eindeutige Kennung für Verläufe, Filter und Ausschnitte. Warum: Mehrere Bilder
 * auf einer Seite dürfen sich ihre Verläufe nicht gegenseitig überschreiben.
 * Beispiel: neueId("m") → "ok-m17".
 */
export function neueId(vorsilbe: string): string {
  zaehler += 1;
  return `ok-${vorsilbe}${zaehler}`;
}

/** Rundet auf zwei Nachkommastellen, damit der SVG-Text kurz bleibt. */
export function r2(zahl: number): number {
  return Math.round(zahl * 100) / 100;
}

/** Ein Punkt der Zeichnung. */
export type Punkt = readonly [number, number];

/** Geschlossener Pfad durch die Punkte. Beispiel: drei Ecken → Dreieck. */
export function punkteZuPfad(punkte: readonly Punkt[]): string {
  return "M" + punkte.map(([x, y]) => `${r2(x)} ${r2(y)}`).join(" L") + " Z";
}

const GRAD = Math.PI / 180;

/** Punkt auf einem Kreis um (cx, cy) im Winkel `grad` (0° rechts, im Uhrzeigersinn). */
export function aufKreis(cx: number, cy: number, r: number, grad: number): Punkt {
  return [cx + r * Math.cos(grad * GRAD), cy + r * Math.sin(grad * GRAD)];
}

/** Kreis als Pfad (für Ausschnitte und Umrisse, die einen Pfad brauchen). */
export function kreis(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
}

/** Stern mit `n` Zacken zwischen Außenradius `ra` und Innenradius `ri`; erste Zacke oben. */
export function stern(cx: number, cy: number, n: number, ra: number, ri: number): string {
  const punkte: Punkt[] = [];
  for (let i = 0; i < 2 * n; i++)
    punkte.push(aufKreis(cx, cy, i % 2 === 0 ? ra : ri, -90 + (i * 180) / n));
  return punkteZuPfad(punkte);
}

/** Regelmäßiges Vieleck; `dreh` ist der Winkel der ersten Ecke. Beispiel: n = 8 → Achteck. */
export function vieleck(cx: number, cy: number, n: number, r: number, dreh = -90): string {
  const punkte: Punkt[] = [];
  for (let i = 0; i < n; i++) punkte.push(aufKreis(cx, cy, r, dreh + (i * 360) / n));
  return punkteZuPfad(punkte);
}

/** Feinere Abtastung der Rosette: so viele Punkte je Bogen. */
const ROSETTE_PUNKTE_JE_BOGEN = 8;

/** Rosette: Kreis mit `n` runden Bögen am Rand, `tiefe` ist die Tiefe der Kerben. */
export function rosette(cx: number, cy: number, n: number, r: number, tiefe: number): string {
  const punkte: Punkt[] = [];
  const schritte = n * ROSETTE_PUNKTE_JE_BOGEN;
  for (let i = 0; i < schritte; i++) {
    const w = (i / schritte) * 2 * Math.PI;
    const rr = r - tiefe + tiefe * Math.abs(Math.cos((w * n) / 2));
    punkte.push([cx + rr * Math.cos(w), cy + rr * Math.sin(w)]);
  }
  return punkteZuPfad(punkte);
}

/** Lage der Zahnflanken innerhalb eines Zahns (Anteile einer Teilung) und der Radius dazu. */
const ZAHNFORM: readonly (readonly [number, "aussen" | "innen"])[] = [
  [0, "innen"],
  [0.12, "aussen"],
  [0.38, "aussen"],
  [0.5, "aussen"],
  [0.62, "innen"],
  [0.88, "innen"],
];

/** Zahnrad mit `n` Zähnen zwischen Fußkreis `ri` und Kopfkreis `ra`. */
export function zahnrad(cx: number, cy: number, n: number, ra: number, ri: number): string {
  const punkte: Punkt[] = [];
  const teilung = (2 * Math.PI) / n;
  for (let i = 0; i < n; i++) {
    for (const [anteil, lage] of ZAHNFORM) {
      const w = i * teilung + anteil * teilung;
      const r = lage === "aussen" ? ra : ri;
      punkte.push([cx + r * Math.cos(w), cy + r * Math.sin(w)]);
    }
  }
  return punkteZuPfad(punkte);
}

/**
 * Lorbeerkranz: Blätter auf zwei Bögen, unten offen (Platz für die Schleife).
 * Beispiel: Orden „Teil Praxis“ → grüner Kranz um die Schachuhr.
 */
export function lorbeer(
  cx: number,
  cy: number,
  r: number,
  farbe: string,
  rand: string,
  blaetter = 10,
): string {
  let s = "";
  for (let i = 0; i < blaetter; i++) {
    for (const seite of [1, -1]) {
      const phi = seite === 1 ? 70 - i * 13 : 110 + i * 13;
      const [x, y] = aufKreis(cx, cy, r, phi);
      const dreh = r2(phi + seite * 25);
      s += `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="2.4" ry="5.6" transform="rotate(${dreh} ${r2(x)} ${r2(y)})" fill="${farbe}" stroke="${rand}" stroke-width="0.6"/>`;
    }
  }
  return s;
}

/** Ein Metall in vier Tönen von hell nach dunkel. */
export type Metallart = "gold" | "silber" | "bronze" | "platin";

const METALLTOENE: Readonly<Record<Metallart, readonly [string, string, string, string]>> = {
  gold: ["#fff6c4", "#f5d36b", "#d4a92c", "#8f6a10"],
  silber: ["#ffffff", "#e3e8ee", "#a7b1bd", "#5f6974"],
  bronze: ["#ffe0bd", "#e0a06a", "#a9642f", "#5e3313"],
  platin: ["#ffffff", "#e6f4f8", "#a9cdd9", "#557884"],
};

/** Linearer Verlauf von oben links nach unten rechts über die Farben. */
export function linear(id: string, farben: readonly string[]): string {
  const stopps = farben
    .map((f, i) => `<stop offset="${r2(i / (farben.length - 1))}" stop-color="${f}"/>`)
    .join("");
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${stopps}</linearGradient>`;
}

/** Ein Metall: Verläufe für Fläche und Fase, dazu der dunkelste und der hellste Ton. */
export interface Metall {
  readonly defs: string;
  readonly hell: string;
  readonly fase: string;
  readonly dunkel: string;
  readonly licht: string;
}

/** Verläufe eines Metalls; die Fase läuft umgekehrt, das gibt den geprägten Rand. */
export function metall(art: Metallart): Metall {
  const [licht, hell, mittel, dunkel] = METALLTOENE[art];
  const a = neueId("m");
  const b = neueId("m");
  return {
    defs: linear(a, [licht, hell, mittel, dunkel]) + linear(b, [dunkel, mittel, hell, licht]),
    hell: `url(#${a})`,
    fase: `url(#${b})`,
    dunkel,
    licht,
  };
}

/** Emaille: runder Verlauf von `farbe` (Licht oben links) nach `tief`. */
export function emaille(farbe: string, tief: string): { defs: string; fill: string } {
  const id = neueId("e");
  return {
    defs: `<radialGradient id="${id}" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="${farbe}"/><stop offset="1" stop-color="${tief}"/></radialGradient>`,
    fill: `url(#${id})`,
  };
}

/** Text in der Schrift der Titel, mittig auf (x, y). `extra` sind weitere Attribute. */
export function text(
  x: number,
  y: number,
  inhalt: string,
  groesse: number,
  fill: string,
  extra = "",
): string {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="'Source Serif 4', Georgia, serif" font-weight="800" font-size="${groesse}" fill="${fill}" ${extra}>${inhalt}</text>`;
}

/** Haken (gelöst), Mitte etwa (x, y), Größe s. */
export function haken(x: number, y: number, s: number, farbe: string, breite = 4): string {
  return `<path d="M${x - 9 * s} ${y} l${6 * s} ${6 * s} l${12 * s} ${-13 * s}" fill="none" stroke="${farbe}" stroke-width="${breite}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Blitz (Zeitart Blitz, Trainingseifer). */
export function blitz(x: number, y: number, s: number, farbe: string): string {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M2 -10 L-6 2 H-1 L-3 10 L6 -3 H1 Z" fill="${farbe}"/>`;
}

/** Stoppuhr (Zeitart Schnellschach). */
export function stoppuhr(x: number, y: number, s: number, farbe: string, grund: string): string {
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="7" fill="${grund}" stroke="${farbe}" stroke-width="2"/><rect x="-1.5" y="-11" width="3" height="3" fill="${farbe}"/><path d="M0 0 V-4.5 M0 0 L3 2" stroke="${farbe}" stroke-width="1.6" stroke-linecap="round"/></g>`;
}

/** Kaffeetasse (Zeitart Klassisch, wie das Zeichen im Fortschritt). */
export function tasse(x: number, y: number, s: number, farbe: string): string {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 -3 H5 V3 a5 5 0 0 1 -5 5 H-1 a5 5 0 0 1 -5 -5 Z" fill="${farbe}"/><path d="M5 -1 h2 a2.5 2.5 0 0 1 0 5 h-2" fill="none" stroke="${farbe}" stroke-width="1.6"/><path d="M-3 -6 q1 -2 0 -3 M0 -6 q1 -2 0 -3" stroke="${farbe}" stroke-width="1" fill="none"/></g>`;
}

/** Flamme mit hellem Kern (Lerntage hintereinander). */
export function flamme(x: number, y: number, s: number, farbe: string, kern: string): string {
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${s})"><path d="M0 -9 C4 -4 7 -1 7 3 a7 7 0 0 1 -14 0 C-7 -1 -4 -2 -3 -6 C-1 -3 0 -4 0 -9 Z" fill="${farbe}"/><path d="M0 -1 C2 1 3 2 3 4 a3 3 0 0 1 -6 0 C-3 2 -1 1 0 -1 Z" fill="${kern}"/></g>`;
}

/** Vierzackiges Funkeln (Glanzpunkt). */
export function funkeln(x: number, y: number, s: number, farbe: string): string {
  return `<path transform="translate(${r2(x)} ${r2(y)}) scale(${s})" d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z" fill="${farbe}"/>`;
}
