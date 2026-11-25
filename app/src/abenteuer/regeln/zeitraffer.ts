/**
 * Zeitraffer beim Warten und Schlafen (Wunsch des Autors, 25.11.2026): Statt einer stehenden
 * Abblende mit Uhrsymbol läuft die Zeit sichtbar ab: Sonne oder Mond ziehen über einen Bogen
 * über dem Horizont, der Himmel färbt sich von Tag über Abend zu Nacht, nachts kommen Sterne, und
 * die Zeiger einer Uhr laufen zur Zielzeit.
 *
 * Diese Datei rechnet nur das Bild zu einem Zeitpunkt der Animation; oberwelt/Zeitraffer.tsx
 * zeichnet es. Die Himmelsfarben kommen aus dem Farbsystem des Spiels (docs/spiel/30, Abschnitt 4;
 * dieselben Werte wie spielfarben.css): Navy für die Nacht, gedämpftes Rot und Gold für Morgen
 * und Abend, Blau für den Tag.
 * Rolle im Gesamtbild: reine Rechnung für oberwelt/useWarten.tsx. Abhängigkeiten:
 * regeln/spieluhr.ts (Minuten je Stunde und Tag).
 */
import { MINUTEN_JE_STUNDE, MINUTEN_JE_TAG, STUNDEN_JE_TAG } from "./spieluhr";

/** Himmelsfarbe zu einer Stunde (Stützstellen, dazwischen gleitend). */
const HIMMEL: readonly { readonly stunde: number; readonly farbe: string }[] = [
  { stunde: 0, farbe: "#0b1424" }, // --spiel-navy-tief
  { stunde: 5, farbe: "#16253d" }, // --spiel-navy
  { stunde: 6.5, farbe: "#e5958a" }, // --spiel-rot-hell: Morgenrot
  { stunde: 8, farbe: "#5b86c4" }, // --spiel-blau: Tag
  { stunde: 17, farbe: "#5b86c4" },
  { stunde: 19, farbe: "#c9a227" }, // --spiel-gold: Abend
  { stunde: 20.5, farbe: "#a8473d" }, // --spiel-rot: Abendrot
  { stunde: 22, farbe: "#0b1424" },
  { stunde: 24, farbe: "#0b1424" },
];

/** Die Sonne steht von 6 bis 20 Uhr über dem Horizont, sonst der Mond. */
const SONNE_AUF = 6;
const SONNE_UNTER = 20;
/** Sterne ganz sichtbar von 21 bis 5 Uhr, eine Stunde Übergang davor und danach. */
const STERNE_AB = 21;
const STERNE_BIS = 5;
/** Höchstens so viele Runden läuft der Minutenzeiger (sonst flimmert er bei langem Warten). */
const MINUTENRUNDEN_HOECHSTENS = 4;
const VOLLKREIS = 360;
const GRAD_JE_STUNDE = VOLLKREIS / 12;
const GRAD_JE_MINUTE = VOLLKREIS / MINUTEN_JE_STUNDE;

/** Was die Animation zu einem Zeitpunkt zeigt. */
export interface Rafferbild {
  /** Stunde des Tages als Kommazahl (0 bis unter 24). */
  readonly stunde: number;
  /** Himmelsfarbe als Hex. */
  readonly himmel: string;
  readonly gestirn: "sonne" | "mond";
  /** Lage auf dem Bogen: 0 am linken Horizont (Aufgang), 1 am rechten (Untergang). */
  readonly bahn: number;
  /** Deckkraft der Sterne, 0 bis 1. */
  readonly sterne: number;
  /** Drehung der Zeiger in Grad, im Uhrzeigersinn von 12 Uhr. */
  readonly zeigerStunde: number;
  readonly zeigerMinute: number;
  /** Uhrzeit als Text „22:00“. */
  readonly uhrzeit: string;
}

/** Sanftes Anlaufen und Abbremsen (0 bis 1 auf 0 bis 1). */
export function sanft(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Das Bild zum Fortschritt `fortschritt` (0 bis 1) zwischen zwei Spielminuten.
 * Eingaben: Spielminuten vorher und nachher (nachher > vorher, regeln/spieluhr.ts,
 * naechsteStunde), Fortschritt. Beispiel: 14:00 → 22:00, Fortschritt 1 → Mond am linken
 * Horizont-Bogen (bahn 0,2), Sterne 1, Uhrzeit „22:00“.
 * Sonderfälle: Der Minutenzeiger läuft höchstens vier Runden und endet doch auf der Zielminute.
 */
export function rafferbild(von: number, nach: number, fortschritt: number): Rafferbild {
  const p = sanft(fortschritt);
  const minute = von + (nach - von) * p;
  const tagesminute = ((minute % MINUTEN_JE_TAG) + MINUTEN_JE_TAG) % MINUTEN_JE_TAG;
  const stunde = tagesminute / MINUTEN_JE_STUNDE;
  const tag = stunde >= SONNE_AUF && stunde < SONNE_UNTER;
  const bahn = tag
    ? (stunde - SONNE_AUF) / (SONNE_UNTER - SONNE_AUF)
    : ((stunde - SONNE_UNTER + STUNDEN_JE_TAG) % STUNDEN_JE_TAG) /
      (STUNDEN_JE_TAG - SONNE_UNTER + SONNE_AUF);
  return {
    stunde,
    himmel: himmelsfarbe(stunde),
    gestirn: tag ? "sonne" : "mond",
    bahn,
    sterne: sternenlicht(stunde),
    zeigerStunde: (stunde % 12) * GRAD_JE_STUNDE,
    zeigerMinute: minutenzeiger(von, nach, p),
    uhrzeit: uhrzeitText(tagesminute),
  };
}

/** Minutenzeiger: vom Start bis zur Zielminute, mit höchstens vier ganzen Runden. */
function minutenzeiger(von: number, nach: number, p: number): number {
  const start = (von % MINUTEN_JE_STUNDE) * GRAD_JE_MINUTE;
  const ziel = (nach % MINUTEN_JE_STUNDE) * GRAD_JE_MINUTE;
  const runden = Math.min(MINUTENRUNDEN_HOECHSTENS, Math.floor((nach - von) / MINUTEN_JE_STUNDE));
  let weg = ziel - start + runden * VOLLKREIS;
  if (weg < 0) weg += VOLLKREIS;
  return (start + weg * p) % VOLLKREIS;
}

/** Deckkraft der Sterne zur Stunde. */
function sternenlicht(stunde: number): number {
  if (stunde >= STERNE_AB || stunde < STERNE_BIS) return 1;
  if (stunde >= STERNE_AB - 1) return stunde - (STERNE_AB - 1);
  if (stunde < STERNE_BIS + 1) return STERNE_BIS + 1 - stunde;
  return 0;
}

/** Himmelsfarbe zur Stunde, zwischen den Stützstellen gemischt. */
export function himmelsfarbe(stunde: number): string {
  let a = HIMMEL[0];
  let b = HIMMEL[HIMMEL.length - 1];
  for (const stelle of HIMMEL) {
    if (stelle.stunde <= stunde) a = stelle;
    else {
      b = stelle;
      break;
    }
  }
  if (!a || !b) return "#000000";
  const t = b.stunde === a.stunde ? 0 : (stunde - a.stunde) / (b.stunde - a.stunde);
  return mische(a.farbe, b.farbe, Math.min(1, Math.max(0, t)));
}

/** Zwei Hex-Farben mischen. */
function mische(a: string, b: string, t: number): string {
  const kanal = (hex: string, k: number) => parseInt(hex.slice(1 + k * 2, 3 + k * 2), 16);
  const teile = [0, 1, 2].map((k) => Math.round(kanal(a, k) + (kanal(b, k) - kanal(a, k)) * t));
  return `#${teile.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** „07:05“ aus der Minute des Tages. */
function uhrzeitText(tagesminute: number): string {
  const ganz = Math.round(tagesminute) % MINUTEN_JE_TAG;
  const h = Math.floor(ganz / MINUTEN_JE_STUNDE);
  const m = ganz % MINUTEN_JE_STUNDE;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
