/**
 * Elo-Modell der App: eine eigene Wertung je Zeitklasse (Blitz, Schnellschach, Klassisch)
 * aus den Kennzahlen der eigenen Züge bis zur Entscheidung, geeicht an den Lichess-Wertungen von
 * 3 900 Spielern (77 000 Partien), umgerechnet auf die Tiefe 18 der Engine der App.
 *
 * Rolle im Gesamtbild: liefert die geschätzte Spielstärke nach jeder Partie (Entscheidung des
 * Autors, 23.10.2026: eine Zahl je Zeitklasse auf dem Maßstab von Lichess; „entspricht etwa“ für
 * chess.com und FIDE rechnet spiel/umrechnung.ts). Kennzahlen: Zahl der Züge, Genauigkeit nach
 * Lichess, Verlust je Zug, Fehlerrate (ab einem halben Bauern), Anteile Ungenauigkeit, Fehler und
 * Patzer, Verlust je Fehler; je Phase Züge, Verlust, Genauigkeit, Fehler und Patzer. Das Modell ist
 * additiv: je Kennzahl eine stückweise lineare Kurve (spiel/elomodell-daten.ts), ein Modell für
 * eine bis zehn Partien (Kennzahlen gemittelt, Zahl der Partien als Kennzahl), danach entzerrt,
 * damit Spieler jeder Wertung im Mittel ihre Lichess-Zahl bekommen, mit der Spanne, in der 90 % der
 * Spieler liegen. Kontrolle an zurückgelegten Spielern: Schnellschach je Partie ±310, über zehn
 * Partien ±150 (Blitz ±410 und ±200, Klassisch ±270 und ±130).
 * Warum additiv: erklärbar, klein und in TypeScript nachrechenbar; Gradient Boosting war nur 5 bis
 * 15 Prozent genauer. Die Teilmodelle je Phase sind breit (Endspiel sehr); ihre Zahl erscheint nur,
 * wenn die Spanne schmal ist (SCHMAL).
 * Abhängigkeiten: spiel/elomodell-daten.ts, spiel/phasen.ts, spiel/uhr.ts, engine/wahlmodell.ts
 * (Zeitklasse wie Lichess).
 */
import { wahltempo } from "../engine/wahlmodell";
import {
  ELO_MODELLE,
  type Kennzahlkurve,
  type Teilmodell,
  type Wertungstempo,
} from "./elomodell-daten";
import { PHASEN, type Phase } from "./phasen";
import type { Uhreinstellung } from "./uhr";

export type { Wertungstempo } from "./elomodell-daten";
/** Die drei Zeitklassen mit eigener Wertung, in der Reihenfolge der Anzeige. */
export const WERTUNGSTEMPI: readonly Wertungstempo[] = ["blitz", "rapid", "classical"];

/** Ein Zug für die Kennzahlen: Verlust in Bauern, Zuggenauigkeit, Wert danach aus eigener Sicht, Phase. */
export interface Kennzahlzug {
  readonly verlust: number;
  readonly genauigkeit: number;
  readonly nachher: number;
  readonly phase: Phase | null;
}

/** Kennzahlen einer Seite, Namen wie im Modell; null, wo die Kennzahl nicht bestimmbar ist. */
export type Partiekennzahlen = Readonly<Record<string, number | null>>;

/** Eine Schätzung: Zeitklasse, Mitte und Spanne (90 % der Spieler), Zahl der Partien dahinter. */
export interface Wertungsschaetzung {
  readonly tempo: Wertungstempo;
  readonly mitte: number;
  readonly von: number;
  readonly bis: number;
  readonly partien: number;
}

/** Grenzen der Zugklassen wie in der Eichung: Fehler ab einem halben Bauern, Patzer ab drei. */
const FEHLER_AB = 0.5;
const GRENZE_FEHLER = 1.2;
const GRENZE_PATZER = 3;
/** Steht man danach noch so klar besser, zählt ein Patzer nur als Ungenauigkeit. */
const KLAR_GEWONNEN = 5;
/** Höchstens so viele Partien gehen in eine Schätzung ein (Eichung der Spanne bis zehn). */
export const HOECHSTENS_PARTIEN = 10;
const RUNDUNG = 50;
/**
 * Die Zahl einer Phase erscheint nur, wenn 90 % der Spieler höchstens so weit danebenliegen.
 * 400 statt 350 (24.10.2026): Die halbe Spanne des Mittelspiels liegt bei zehn Schnellschach-Partien
 * bei 395; mit 350 bekäme das Mittelspiel im Schnellschach nie eine Zahl (ENTSCHEIDUNGEN).
 */
export const SCHMAL = 400;

type Zugklasse = "ok" | "ungenau" | "fehler" | "patzer";

/** Regel der Eichung (buch/arbeit/tiefe18/abgleich.py): Klasse eines Zuges aus Verlust und Stand danach. */
function klasseVon(z: Kennzahlzug): Zugklasse {
  if (z.nachher >= KLAR_GEWONNEN) return z.verlust >= GRENZE_PATZER ? "ungenau" : "ok";
  if (z.verlust >= GRENZE_PATZER) return "patzer";
  if (z.verlust >= GRENZE_FEHLER) return "fehler";
  return z.verlust >= FEHLER_AB ? "ungenau" : "ok";
}

function mittel(werte: readonly number[]): number | null {
  if (werte.length === 0) return null;
  return werte.reduce((s, x) => s + x, 0) / werte.length;
}

function anteil(zuege: readonly Kennzahlzug[], passt: (z: Kennzahlzug) => boolean): number | null {
  if (zuege.length === 0) return null;
  return zuege.filter(passt).length / zuege.length;
}

/**
 * Die Kennzahlen einer Seite aus ihren Zügen bis zur Entscheidung und ihrer Lichess-Genauigkeit.
 * Beispiel: 30 Züge, davon 9 mit mindestens einem halben Bauern Verlust (Mittel 2,0 Bauern), zwei
 * Patzer → n 30, fehlerrate 0,3, k_patzer 0,067, verlust_je_fehler 2,0. Sonderfall: ohne Züge null;
 * eine Phase ohne Züge hat n 0 und sonst null (das Modell nutzt dann das Gewicht „fehlend“).
 */
export function kennzahlenAus(
  zuege: readonly Kennzahlzug[],
  genauigkeitLichess: number | null,
): Partiekennzahlen | null {
  if (zuege.length === 0) return null;
  const fehler = zuege.filter((z) => z.verlust >= FEHLER_AB);
  const k: Record<string, number | null> = {
    n: zuege.length,
    acc_lichess: genauigkeitLichess,
    verlust: mittel(zuege.map((z) => z.verlust)),
    fehlerrate: fehler.length / zuege.length,
    k_ungenau: anteil(zuege, (z) => klasseVon(z) === "ungenau"),
    k_fehler: anteil(zuege, (z) => klasseVon(z) === "fehler"),
    k_patzer: anteil(zuege, (z) => klasseVon(z) === "patzer"),
    verlust_je_fehler: mittel(fehler.map((z) => z.verlust)) ?? 0,
  };
  for (const ph of PHASEN) {
    const eigene = zuege.filter((z) => z.phase === ph);
    k[`ph_${ph}_n`] = eigene.length;
    k[`ph_${ph}_verlust`] = mittel(eigene.map((z) => z.verlust));
    k[`ph_${ph}_acc`] = mittel(eigene.map((z) => z.genauigkeit));
    k[`ph_${ph}_fehler`] = anteil(eigene, (z) => z.verlust >= FEHLER_AB);
    k[`ph_${ph}_patzer`] = anteil(eigene, (z) => klasseVon(z) === "patzer");
  }
  return k;
}

/**
 * Mittel der Kennzahlen über mehrere Partien (je Kennzahl über die Partien, in denen sie bestimmt
 * ist), wie in der Eichung der Spielerebene. Beispiel: zwei Partien mit fehlerrate 0,2 und 0,4 → 0,3.
 */
export function kennzahlenMittel(liste: readonly Partiekennzahlen[]): Partiekennzahlen {
  const namen = new Set(liste.flatMap((k) => Object.keys(k)));
  const aus: Record<string, number | null> = {};
  for (const name of namen) {
    const werte = liste
      .map((k) => k[name])
      .filter((w): w is number => w !== null && w !== undefined);
    aus[name] = mittel(werte);
  }
  return aus;
}

/** Wert einer Kurve: linear zwischen den Stützstellen, außerhalb der Randwert. */
function kurvenwert(kurve: Kennzahlkurve, x: number): number {
  const { knoten, gewichte } = kurve;
  const erste = knoten[0];
  const letzte = knoten[knoten.length - 1];
  if (erste === undefined || letzte === undefined) return 0;
  if (x <= erste) return gewichte[0] ?? 0;
  if (x >= letzte) return gewichte[gewichte.length - 1] ?? 0;
  for (let i = 1; i < knoten.length; i += 1) {
    const x1 = knoten[i] ?? letzte;
    if (x <= x1) {
      const x0 = knoten[i - 1] ?? erste;
      const y0 = gewichte[i - 1] ?? 0;
      const y1 = gewichte[i] ?? 0;
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return gewichte[gewichte.length - 1] ?? 0;
}

/** Rohe Schätzung eines Teilmodells: Achse plus Kurvenwert je Kennzahl (fehlend: eigenes Gewicht). */
function rohwert(modell: Teilmodell, kennzahlen: Partiekennzahlen, partien: number): number {
  let summe = modell.achse;
  for (const kurve of modell.merkmale) {
    const wert = kurve.name === "anzahl" ? partien : kennzahlen[kurve.name];
    summe += wert === null || wert === undefined ? kurve.fehlend : kurvenwert(kurve, wert);
  }
  return summe;
}

function gerundet(wert: number): number {
  return Math.max(0, Math.round(wert / RUNDUNG) * RUNDUNG);
}

/**
 * Die Schätzung einer Zeitklasse aus Kennzahlen (einer Partie oder gemittelt über bis zu zehn),
 * entzerrt und mit der Spanne für diese Zahl der Partien; mit Phase das Teilmodell dieser Phase.
 * Beispiel: Schnellschach, eine Partie mit 85 % Genauigkeit, Fehlerrate 0,2 → etwa 1500
 * (1200 bis 1800); dieselben Kennzahlen als Mittel über zehn Partien → etwa 1500 (1350 bis 1650).
 * Sonderfall: mehr als zehn Partien zählen wie zehn.
 */
export function schaetzung(
  tempo: Wertungstempo,
  kennzahlen: Partiekennzahlen,
  partien: number,
  phase: Phase | null = null,
): Wertungsschaetzung {
  const modell = phase ? ELO_MODELLE[tempo].phasen[phase] : ELO_MODELLE[tempo].gesamt;
  const k = Math.max(1, Math.min(HOECHSTENS_PARTIEN, Math.round(partien)));
  const roh = rohwert(modell, kennzahlen, k);
  const gerade = modell.entzerrung[k - 1] ?? { a: 1, b: 0 };
  const mitte = (roh - gerade.b) / gerade.a;
  const halb = modell.spanne[k - 1] ?? 0;
  return {
    tempo,
    mitte: gerundet(mitte),
    von: gerundet(mitte - halb),
    bis: gerundet(mitte + halb),
    partien: k,
  };
}

/** Schmal genug, um die Zahl zu zeigen (Phasen): halbe Spanne höchstens SCHMAL. */
export function istSchmal(s: Wertungsschaetzung): boolean {
  return (s.bis - s.von) / 2 <= SCHMAL;
}

/** Die Zeitklasse einer Partie wie bei Lichess; ohne Uhr Schnellschach (engine/wahlmodell.ts). */
export function wertungstempo(uhr: Uhreinstellung | null): Wertungstempo {
  return wahltempo(uhr);
}
