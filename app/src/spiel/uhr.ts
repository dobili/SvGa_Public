/**
 * Schachuhr für das Spiel gegen die Engine: Bedenkzeit je Seite mit Zuschlag je Zug.
 *
 * Rolle im Gesamtbild: Der Partie-Bildschirm zeigt die Uhren über und unter dem Brett
 * (Bildschirmentwurf „Partie“). Die Uhr ist rein: Sie rechnet mit der übergebenen Zeit („jetzt“
 * in Millisekunden) und hat keinen eigenen Takt; die Oberfläche fragt sie regelmäßig ab. So lässt
 * sie sich speichern und nach einem Neuladen fortsetzen.
 * Abhängigkeiten: keine.
 */
import type { Color } from "chessops/types";

/** Bedenkzeit je Seite und Zuschlag je Zug (Fischer-Uhr), beides in Millisekunden. */
export interface Uhreinstellung {
  readonly grundzeitMs: number;
  readonly zuschlagMs: number;
}

export interface Uhrstand {
  /** Verbleibende Zeit je Seite zum Zeitpunkt „seitMs“. */
  readonly restMs: Readonly<Record<Color, number>>;
  /** Wessen Uhr läuft; null, solange die Uhr steht (vor dem ersten Zug, Pause, Partieende). */
  readonly laeuft: Color | null;
  /** Seit wann die laufende Uhr läuft. */
  readonly seitMs: number;
}

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;

/**
 * Bedenkzeit des Partietags im 30-Minuten-Plan: 10 Minuten je Seite ohne Zuschlag, zusammen höchstens
 * die 20 Minuten des Plans (Regel: Kapitel 12, „Der 30-Minuten-Trainingsplan“, Tag A).
 */
export const UHR_PARTIETAG: Uhreinstellung = { grundzeitMs: 10 * MINUTE_MS, zuschlagMs: 0 };

/**
 * Auswahl im Spielen-Bildschirm nach Zeitklassen wie bei Lichess (R51, Wunsch des Autors,
 * 23.10.2026): Blitz 3 + 0, 3 + 2, 5 + 3; Schnellschach 10 + 0 (Partietag des 30-Minuten-Plans,
 * seit 0.2.91) und 15 + 10; Klassisch 30 + 20 und 60 + 0. Kein Bullet (Autor, 23.10.2026).
 * „Ohne Uhr“ gibt es seit 0.2.125 nur noch für ungewertete Partien aus einer Abbildung oder
 * aufgebauten Stellung (ui/bildschirme/Spielen.tsx), weil die Wertung je Zeitklasse gilt.
 */
export const UHR_VORGABEN: readonly Uhreinstellung[] = [
  { grundzeitMs: 3 * MINUTE_MS, zuschlagMs: 0 },
  { grundzeitMs: 3 * MINUTE_MS, zuschlagMs: 2 * SEKUNDE_MS },
  { grundzeitMs: 5 * MINUTE_MS, zuschlagMs: 3 * SEKUNDE_MS },
  UHR_PARTIETAG,
  { grundzeitMs: 15 * MINUTE_MS, zuschlagMs: 10 * SEKUNDE_MS },
  { grundzeitMs: 30 * MINUTE_MS, zuschlagMs: 20 * SEKUNDE_MS },
  { grundzeitMs: 60 * MINUTE_MS, zuschlagMs: 0 },
];

/** Die Uhr, wenn keine gewählt ist (Partien aus der Grundstellung haben seit 0.2.125 immer eine). */
export const UHR_STANDARD: Uhreinstellung = UHR_PARTIETAG;

/** Gleiche Uhr? Beide null gilt als gleich. */
export function gleicheUhr(a: Uhreinstellung | null, b: Uhreinstellung | null): boolean {
  if (!a || !b) return a === b;
  return a.grundzeitMs === b.grundzeitMs && a.zuschlagMs === b.zuschlagMs;
}

/** Neue, stehende Uhr mit voller Bedenkzeit für beide Seiten. */
export function neueUhr(einstellung: Uhreinstellung): Uhrstand {
  const voll = einstellung.grundzeitMs;
  return { restMs: { white: voll, black: voll }, laeuft: null, seitMs: 0 };
}

/**
 * Restzeit einer Seite zum Zeitpunkt „jetzt“, nie unter null.
 * Sonderfall (R37): „seitMs“ darf in der Zukunft liegen, solange der Zug noch über das Brett
 * gleitet (spiel/ablauf.ts, mitUhrverzug); bis dahin ist nichts verbraucht.
 */
export function restzeit(stand: Uhrstand, farbe: Color, jetztMs: number): number {
  const verbraucht = stand.laeuft === farbe ? Math.max(0, jetztMs - stand.seitMs) : 0;
  return Math.max(0, stand.restMs[farbe] - verbraucht);
}

/** Startet die Uhr einer Seite (erster Zug, Fortsetzen nach Pause). Eine laufende Uhr hält vorher. */
export function starte(stand: Uhrstand, farbe: Color, jetztMs: number): Uhrstand {
  const gehalten = halte(stand, jetztMs);
  return { ...gehalten, laeuft: farbe, seitMs: jetztMs };
}

/** Hält die Uhr an und schreibt die verbrauchte Zeit ab (Pause, Partieende, App im Hintergrund). */
export function halte(stand: Uhrstand, jetztMs: number): Uhrstand {
  const farbe = stand.laeuft;
  if (!farbe) return stand;
  const restMs = { ...stand.restMs, [farbe]: restzeit(stand, farbe, jetztMs) };
  return { restMs, laeuft: null, seitMs: jetztMs };
}

/**
 * Der Spieler am Zug drückt nach seinem Zug die Uhr: Seine Zeit steht, er bekommt den Zuschlag,
 * die Uhr des Gegners läuft.
 *
 * Beispiel: 15+10, Weiß braucht 12 Sekunden für 1. e4 → Weiß 14:58, Schwarz läuft.
 * Sonderfall: Steht die Uhr (erster Zug), startet nur die Uhr des Gegners, ohne Zuschlag.
 */
export function druecke(
  stand: Uhrstand,
  einstellung: Uhreinstellung,
  gezogen: Color,
  jetztMs: number,
): Uhrstand {
  const gegner: Color = gezogen === "white" ? "black" : "white";
  if (stand.laeuft !== gezogen) return starte(stand, gegner, jetztMs);
  const gehalten = halte(stand, jetztMs);
  const mitZuschlag = gehalten.restMs[gezogen] + einstellung.zuschlagMs;
  return {
    restMs: { ...gehalten.restMs, [gezogen]: mitZuschlag },
    laeuft: gegner,
    seitMs: jetztMs,
  };
}

/** Die Seite, deren Zeit abgelaufen ist, sonst null. */
export function abgelaufen(stand: Uhrstand, jetztMs: number): Color | null {
  const farbe = stand.laeuft;
  return farbe && restzeit(stand, farbe, jetztMs) <= 0 ? farbe : null;
}

/** Restzeit als „m:ss“, unter zehn Sekunden mit Zehnteln („0:09,4“). */
export function zeitAlsText(ms: number): string {
  const ZEHNTEL_MS = 100;
  const KNAPP_MS = 10 * SEKUNDE_MS;
  const minuten = Math.floor(ms / MINUTE_MS);
  const sekunden = Math.floor((ms % MINUTE_MS) / SEKUNDE_MS);
  const text = `${minuten}:${String(sekunden).padStart(2, "0")}`;
  if (ms >= KNAPP_MS) return text;
  return `${text},${Math.floor((ms % SEKUNDE_MS) / ZEHNTEL_MS)}`;
}
