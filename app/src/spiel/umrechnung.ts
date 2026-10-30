/**
 * Umrechnung der eigenen Wertung auf chess.com und FIDE als Bereich, dazu die Kurvenrechnung, die
 * auch die Eichung nutzt.
 *
 * Rolle im Gesamtbild: Die eigene Wertung je Zeitklasse (spiel/elomodell.ts) ist auf dem Maßstab
 * von Lichess geeicht. Der Autor wollte die Entsprechung auf chess.com und bei der FIDE, und zwar für
 * jede Zeitklasse und als Bereich statt „etwa“ (Wunsch vom 27.10.2026). Gerechnet wird über die
 * gemeinsame Spalte „chess.com Blitz“ des Wertungsvergleichs von chessgoals.com
 * (spiel/umrechnung-daten.ts): eigene Wertung → chess.com Blitz → Zielliste. Klassisch wird auf
 * chess.com mit Schnellschach verglichen, weil chess.com keine klassische Wertung führt. Der Bereich
 * ist der, in dem die Hälfte vergleichbarer Spieler liegt (beide Streuungen zusammengenommen).
 * Außerhalb der Tabellen gibt es keine Entsprechung (FIDE erst ab etwa chess.com Blitz 1100).
 * Abhängigkeiten: spiel/umrechnung-daten.ts, spiel/elomodell-daten.ts (Zeitklasse).
 */
import type { Wertungstempo } from "./elomodell-daten";
import {
  CHESSCOM_BLITZ_ZU,
  HALBE_BREITE,
  LICHESS_ZU_CHESSCOM_BLITZ,
  type Zielspalte,
} from "./umrechnung-daten";

/** Eine Kurve als Stützstellen [x, y], aufsteigend in x. */
export type Kurve = readonly (readonly [number, number])[];

/** Die beiden Listen, auf die umgerechnet werden kann. */
export type Zielliste = "chesscom" | "fide";

/** Die Liste der kurzen Sätze „entspricht etwa“ (Auswertung): je Zeitklasse die naheliegende. */
export const ZIELLISTE: Readonly<Record<Wertungstempo, Zielliste>> = {
  blitz: "chesscom",
  rapid: "chesscom",
  classical: "fide",
};

/** Gerundet wird auf zehn Punkte; feiner ist die Umrechnung nicht. */
const RUNDUNG = 10;
/** Die Grenzen des Vergleichsbereichs auf fünf Punkte gerundet. */
const GRENZRUNDUNG = 5;

/** Die umgerechnete Zahl: Mitte und Bereich, in dem die Hälfte vergleichbarer Spieler liegt. */
export interface Umrechnung {
  readonly mitte: number;
  readonly von: number;
  readonly bis: number;
  /** Die Wertung, mit der verglichen wird: chess.com Blitz, chess.com Schnellschach oder FIDE. */
  readonly ziel: "chesscomBlitz" | Zielspalte;
}

/** Wert der Kurve an einer Stelle, linear dazwischen, außerhalb der Randwert. */
export function kurvenwert(kurve: Kurve, x: number): number {
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte) return Number.NaN;
  if (x <= erste[0]) return erste[1];
  if (x >= letzte[0]) return letzte[1];
  for (let i = 1; i < kurve.length; i += 1) {
    const [x0, y0] = kurve[i - 1] ?? erste;
    const [x1, y1] = kurve[i] ?? letzte;
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return letzte[1];
}

/** Wert der Kurve nur innerhalb ihrer Stützstellen, sonst null. */
function innerhalb(kurve: Kurve, x: number): number | null {
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte || x < erste[0] || x > letzte[0]) return null;
  return kurvenwert(kurve, x);
}

/** Mit welcher Wertung verglichen wird: chess.com nach Zeitklasse (Klassisch mit Schnellschach). */
function zielVon(tempo: Wertungstempo, liste: Zielliste): Umrechnung["ziel"] {
  if (liste === "fide") return "fide";
  return tempo === "blitz" ? "chesscomBlitz" : "chesscomRapid";
}

const gerundet = (x: number, auf: number) => Math.round(x / auf) * auf;

/**
 * Die eigene Wertung auf der Zielliste: Mitte und Bereich; null außerhalb der Tabellen.
 *
 * Warum der Bereich: Eine einzelne Zahl täuscht Genauigkeit vor. Die Streuung der eigenen Spalte
 * und der Zielspalte (je gegen chess.com Blitz gemessen) werden quadratisch zusammengenommen.
 * Beispiel: Schnellschach 1680 auf chess.com → Mitte etwa 1340, Bereich etwa 1190 bis 1490;
 * Blitz 1500 auf chess.com → etwa 1110, Bereich 1040 bis 1180; Klassisch 1500 auf FIDE → null.
 */
export function umgerechnet(
  tempo: Wertungstempo,
  wertung: number,
  liste: Zielliste,
): Umrechnung | null {
  const blitz = innerhalb(LICHESS_ZU_CHESSCOM_BLITZ[tempo], wertung);
  if (blitz === null) return null;
  const ziel = zielVon(tempo, liste);
  const wert = ziel === "chesscomBlitz" ? blitz : innerhalb(CHESSCOM_BLITZ_ZU[ziel], blitz);
  if (wert === null) return null;
  const breite = Math.hypot(HALBE_BREITE[tempo], ziel === "chesscomBlitz" ? 0 : HALBE_BREITE[ziel]);
  return {
    mitte: gerundet(wert, RUNDUNG),
    von: gerundet(wert - breite, RUNDUNG),
    bis: gerundet(wert + breite, RUNDUNG),
    ziel,
  };
}

/**
 * „Entspricht etwa“ auf der naheliegenden Liste der Zeitklasse (ZIELLISTE), auf 10 gerundet; null
 * außerhalb. Beispiel: Schnellschach 1680 → chess.com Schnellschach etwa 1340; Klassisch 2120 →
 * FIDE etwa 1965; Klassisch 1500 → null.
 */
export function entsprichtEtwa(tempo: Wertungstempo, wertung: number): number | null {
  return umgerechnet(tempo, wertung, ZIELLISTE[tempo])?.mitte ?? null;
}

/** Kleinste und größte eigene Wertung, die auf der Kurve einen Wert in [unten, oben] hat. */
function urbild(kurve: Kurve, unten: number, oben: number): { von: number; bis: number } | null {
  const umgekehrt: Kurve = kurve.map(([x, y]) => [y, x] as const);
  const erste = kurve[0];
  const letzte = kurve.at(-1);
  if (!erste || !letzte) return null;
  const von = Math.max(unten, erste[1]);
  const bis = Math.min(oben, letzte[1]);
  if (von > bis) return null;
  return { von: kurvenwert(umgekehrt, von), bis: kurvenwert(umgekehrt, bis) };
}

/**
 * Von welcher bis zu welcher eigenen Wertung (Lichess-Maßstab) die Umrechnung reicht.
 * Warum: Außerhalb gibt es keine Entsprechung; die Oberfläche nennt dann die Grenze.
 * Beispiel: Klassisch auf FIDE → von 1730 bis 2350; Blitz auf chess.com → 1090 bis 2745.
 * Sonderfall: ohne Überschneidung der Tabellen null.
 */
export function vergleichsbereich(
  tempo: Wertungstempo,
  liste: Zielliste = ZIELLISTE[tempo],
): { von: number; bis: number } | null {
  const ziel = zielVon(tempo, liste);
  const zielkurve = ziel === "chesscomBlitz" ? null : CHESSCOM_BLITZ_ZU[ziel];
  const unten = zielkurve?.[0]?.[0] ?? Number.NEGATIVE_INFINITY;
  const oben = zielkurve?.at(-1)?.[0] ?? Number.POSITIVE_INFINITY;
  const bereich = urbild(LICHESS_ZU_CHESSCOM_BLITZ[tempo], unten, oben);
  if (!bereich) return null;
  return {
    von: Math.ceil(bereich.von / GRENZRUNDUNG) * GRENZRUNDUNG,
    bis: Math.floor(bereich.bis / GRENZRUNDUNG) * GRENZRUNDUNG,
  };
}
