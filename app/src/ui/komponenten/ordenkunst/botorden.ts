/**
 * Die Orden der Bot-Bündel und der Engine im klassischen Stil: Medaille aus Metall mit Band.
 *
 * Rolle im Gesamtbild: Variante A der Entwürfe, vom Autor am 30.10.2026 für die Bots gewählt. Die
 * Bündel steigen im Metall auf (Stufe 1–3 Bronze, 4–5 Silber, 6–7 Gold, 8–9 Platin), jedes mit
 * eigenem Roboterkopf und eigenem Band. „Jeden Bot einmal besiegt“ ist ein Zahnrad, „in allen
 * Zeitarten“ ein Dreieck mit Blitz, Stoppuhr und Kaffeetasse (Blitz, Schnellschach, Klassisch).
 * Die Engine (Stufe 10) ist ein Einzelstück: dunkler Kristall mit leuchtenden Leiterbahnen.
 * Abhängigkeiten: zeichnen.ts, figuren.ts, nachtstil.ts (Typ Zeichnung).
 */
import { roboter, type Roboterart } from "./figuren";
import type { Zeichnung } from "./nachtstil";
import {
  aufKreis,
  blitz,
  emaille,
  kreis,
  metall,
  neueId,
  punkteZuPfad,
  r2,
  stoppuhr,
  tasse,
  text,
  vieleck,
  zahnrad,
  type Metall,
  type Metallart,
} from "./zeichnen";

const MX = 50;
const MY = 86;
const ANSICHT_MIT_BAND = "0 0 100 130";

/** Band mit senkrechten Streifen; `streifen` = Farbe und Anteil der Breite. */
function band(streifen: readonly (readonly [string, number])[]): string {
  const clip = neueId("b");
  const pfad = "M27 0 H73 L63 50 H37 Z";
  const breite = 46;
  let x = 27;
  let flaechen = "";
  for (const [farbe, anteil] of streifen) {
    flaechen += `<rect x="${r2(x)}" y="0" width="${r2(breite * anteil + 0.3)}" height="52" fill="${farbe}"/>`;
    x += breite * anteil;
  }
  const falte = `<path d="M50 0 V50" stroke="#000" stroke-opacity="0.18" stroke-width="1"/><path d="M27 0 H73 L71 10 H29 Z" fill="#000" opacity="0.12"/>`;
  return `<clipPath id="${clip}"><path d="${pfad}"/></clipPath><g clip-path="url(#${clip})">${flaechen}${falte}</g><path d="${pfad}" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="0.8"/>`;
}

/** Die Spange, an der die Medaille am Band hängt. */
function spange(m: Metall): string {
  return `<rect x="33" y="44" width="34" height="8" rx="2" fill="${m.hell}" stroke="${m.dunkel}" stroke-width="0.8"/><rect x="35" y="46" width="30" height="1.6" rx="0.8" fill="${m.licht}" opacity="0.7"/>`;
}

/** Metallkörper mit Fase: äußere Form hell, innere etwas kleiner umgekehrt. */
function koerper(aussen: string, innen: string, m: Metall): string {
  return `<path d="${aussen}" fill="${m.hell}" stroke="${m.dunkel}" stroke-width="1"/><path d="${innen}" fill="${m.fase}" stroke="${m.licht}" stroke-opacity="0.6" stroke-width="0.8"/>`;
}

/** Ein Bot-Bündel mit Metall, Roboterkopf und Farben. */
interface Buendelbild {
  readonly stufen: string;
  readonly art: Roboterart;
  readonly metall: Metallart;
  readonly band: readonly [string, string];
  readonly augen: string;
  readonly grund: readonly [string, string];
}

/** Die vier Bündel mit eigenem Orden (das Bündel 10 ist die Engine). */
export const BUENDELBILDER: Readonly<Record<"1-3" | "4-5" | "6-7" | "8-9", Buendelbild>> = {
  "1-3": {
    stufen: "1–3",
    art: 1,
    metall: "bronze",
    band: ["#178f8a", "#e9dcc0"],
    augen: "#7ff3e9",
    grund: ["#1d6f6b", "#0b3433"],
  },
  "4-5": {
    stufen: "4–5",
    art: 2,
    metall: "silber",
    band: ["#2f6fd1", "#dfe4ea"],
    augen: "#9fd2ff",
    grund: ["#2f5fa8", "#0f2550"],
  },
  "6-7": {
    stufen: "6–7",
    art: 3,
    metall: "gold",
    band: ["#c0392b", "#f5d36b"],
    augen: "#ffd166",
    grund: ["#a83226", "#4a0f0a"],
  },
  "8-9": {
    stufen: "8–9",
    art: 4,
    metall: "platin",
    band: ["#7b3fbf", "#e6f4f8"],
    augen: "#e0b3ff",
    grund: ["#5b2a9a", "#1f0b3d"],
  },
};

/** Plakette mit den Stufen unter dem Motiv. */
function plakette(y: number, breite: number, beschriftung: string, m: Metall): string {
  return (
    `<rect x="${MX - breite / 2}" y="${y}" width="${breite}" height="11" rx="5.5" fill="${m.hell}" stroke="${m.dunkel}" stroke-width="0.8"/>` +
    text(MX, r2(y + 5.8), beschriftung, 8.5, m.dunkel)
  );
}

/**
 * Orden „jeden Bot des Bündels einmal besiegt“: Zahnrad mit Roboterkopf.
 * Beispiel: Bündel 1–3 → Zahnrad aus Bronze, Kopf mit Antenne, Band türkis.
 */
export function botordenEinmal(b: Buendelbild): Zeichnung {
  const m = metall(b.metall);
  const e = emaille(b.grund[0], b.grund[1]);
  const umriss = zahnrad(MX, MY, 14, 40, 34);
  const inhalt =
    band([
      [b.band[0], 0.3],
      [b.band[1], 0.4],
      [b.band[0], 0.3],
    ]) +
    spange(m) +
    koerper(umriss, kreis(MX, MY, 31), m) +
    `<circle cx="${MX}" cy="${MY}" r="26" fill="${e.fill}" stroke="${m.dunkel}"/>` +
    roboter(MX, MY - 2, 1.45, b.art, m.licht, b.augen) +
    plakette(MY + 16, 28, b.stufen, m);
  return { defs: m.defs + e.defs, inhalt, umriss, ansicht: ANSICHT_MIT_BAND };
}

/** Gleichseitiges Dreieck mit Spitze oben um die Mitte der Medaille. */
function dreieck(r: number): string {
  return punkteZuPfad([0, 1, 2].map((i) => aufKreis(MX, MY + 4, r, -90 + i * 120)));
}

/**
 * Orden „jeden Bot des Bündels in allen Zeitarten besiegt“: Dreieck mit den drei Zeitarten.
 * Beispiel: Bündel 6–7 → goldenes Dreieck, rote Emaille, Kopf mit Hörnern.
 */
export function botordenAlle(b: Buendelbild): Zeichnung {
  const m = metall(b.metall);
  const e = emaille(b.grund[0], b.grund[1]);
  const umriss = dreieck(48);
  const ecke = (i: number) => aufKreis(MX, MY + 4, 33, -90 + i * 120).map(r2) as [number, number];
  const [oben, rechts, links] = [ecke(0), ecke(1), ecke(2)];
  const zeiten =
    blitz(oben[0], oben[1], 0.75, b.augen) +
    stoppuhr(rechts[0], rechts[1], 0.7, b.augen, b.grund[1]) +
    tasse(links[0], links[1], 0.75, b.augen);
  const inhalt =
    band([
      [b.band[0], 0.2],
      [b.band[1], 0.2],
      [b.band[0], 0.2],
      [b.band[1], 0.2],
      [b.band[0], 0.2],
    ]) +
    spange(m) +
    `<path d="${umriss}" fill="${m.hell}" stroke="${m.dunkel}" stroke-width="1.2" stroke-linejoin="round"/>` +
    `<path d="${dreieck(42)}" fill="${e.fill}" stroke="${m.licht}" stroke-opacity="0.5" stroke-linejoin="round"/>` +
    zeiten +
    `<path d="${zahnrad(MX, MY + 6, 10, 15, 12)}" fill="${m.hell}" stroke="${m.dunkel}" stroke-width="0.8"/>` +
    roboter(MX, MY + 6, 0.85, b.art, b.grund[1], b.augen) +
    plakette(MY + 23, 24, b.stufen, m);
  return { defs: m.defs + e.defs, inhalt, umriss, ansicht: ANSICHT_MIT_BAND };
}

const NEON = "#38e8ff";
const FACETTEN = ["#3a4a72", "#26304f", "#1a2238", "#121829"] as const;

/** Leuchtende Leiterbahnen vom Chip zu den Ecken. */
function leiterbahnen(): string {
  const bahn = (d: string) =>
    `<path d="${d}" fill="none" stroke="${NEON}" stroke-width="1.3" stroke-linecap="round"/>`;
  const enden: readonly (readonly [number, number])[] = [
    [MX - 28, MY - 12],
    [MX + 28, MY + 12],
    [MX - 12, MY + 30],
    [MX + 12, MY - 30],
  ];
  return (
    bahn(`M${MX - 12} ${MY - 6} H${MX - 22} L${MX - 28} ${MY - 12}`) +
    bahn(`M${MX + 12} ${MY + 6} H${MX + 22} L${MX + 28} ${MY + 12}`) +
    bahn(`M${MX - 6} ${MY + 12} V${MY + 24} L${MX - 12} ${MY + 30}`) +
    bahn(`M${MX + 6} ${MY - 12} V${MY - 24} L${MX + 12} ${MY - 30}`) +
    enden.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${NEON}"/>`).join("")
  );
}

/** Orden „Engine (Stufe 10): jeden Bot einmal besiegt“: dunkler Kristall mit Chip „10“. */
export function engineorden(): Zeichnung {
  const silber = metall("silber");
  const glimmen = neueId("g");
  const umriss = vieleck(MX, MY, 8, 41, -67.5);
  let facetten = "";
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = aufKreis(MX, MY, 41, -67.5 + i * 45);
    const [x2, y2] = aufKreis(MX, MY, 41, -67.5 + (i + 1) * 45);
    facetten += `<path d="M${MX} ${MY} L${r2(x1)} ${r2(y1)} L${r2(x2)} ${r2(y2)} Z" fill="${FACETTEN[i % FACETTEN.length]}"/>`;
  }
  const inhalt =
    band([
      ["#0b0f1a", 0.42],
      [NEON, 0.16],
      ["#0b0f1a", 0.42],
    ]) +
    spange(silber) +
    `<path d="${umriss}" fill="#05070d" stroke="${NEON}" stroke-width="1.6"/>` +
    facetten +
    `<path d="${umriss}" fill="none" stroke="#7ff3ff" stroke-opacity="0.8" stroke-width="1"/>` +
    `<g filter="url(#${glimmen})">${leiterbahnen()}</g>` +
    `<rect x="${MX - 12}" y="${MY - 12}" width="24" height="24" rx="3" fill="#0b0f1a" stroke="${NEON}" stroke-width="1.4"/>` +
    text(MX, MY + 0.5, "10", 13, NEON, `filter="url(#${glimmen})"`);
  const defs =
    silber.defs +
    `<filter id="${glimmen}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  return { defs, inhalt, umriss, ansicht: ANSICHT_MIT_BAND };
}
