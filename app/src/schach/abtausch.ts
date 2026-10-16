/**
 * Abtauschrechnung auf einem Feld: Wer gewinnt wie viel, wenn beide Seiten schlagen?
 *
 * Rolle im Gesamtbild: Baustein „Abtauschrechnung“ des Stellungsprofils (Konzept 7.2),
 * genutzt vom Werkzeug k1-zaehlen und später von allen Werkzeugen, die nach Materialgewinn fragen.
 * Abhängigkeiten: angreifer.ts, stellung.ts.
 * Buchbezug: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“: Schlage grundsätzlich
 * zuerst mit deiner billigsten Figur; bei gleicher Anzahl lohnt sich der Schlag meist nicht.
 */
import { SquareSet } from "chessops/squareSet";
import type { Board } from "chessops/board";
import type { Color, Role, Square } from "chessops/types";
import { direkteAngreifer, type Angreifer } from "./angreifer";
import { FIGURENWERT, gegner } from "./stellung";

/**
 * Reihenfolge bei gleichem Wert: der Springer schlägt vor dem Läufer (Abb. 7.30: 1. Sxd5, nicht
 * Lxd5; das Läuferpaar bleibt, Kapitel 5). Der Rest folgt dem Wert.
 */
const SCHLAGREIHENFOLGE: Readonly<Record<Role, number>> = {
  pawn: 0,
  knight: 1,
  bishop: 2,
  rook: 3,
  queen: 4,
  king: 5,
};

/** Ein Schlag in der Abtauschfolge. */
export interface Schlag {
  readonly figur: Angreifer;
  /** Die Figur, die dabei geschlagen wird. */
  readonly geschlagen: Role;
}

/** Ergebnis der Abtauschrechnung auf einem Feld. */
export interface Abtausch {
  /** Die Seite, die zuerst schlägt (Gegner der Figur auf dem Feld). */
  readonly seite: Color;
  /** Alle möglichen Schläge, jede Seite immer mit ihrer billigsten Figur. */
  readonly schlagfolge: readonly Schlag[];
  /**
   * Wie viele Schläge der Folge sich lohnen, wenn beide Seiten aufhören dürfen, sobald weiteres
   * Schlagen Material kostet. 0 heißt: Der erste Schlag lohnt sich nicht.
   */
  readonly lohnendeSchlaege: number;
  /** Materialgewinn der schlagenden Seite in Bauerneinheiten, wenn sie anfängt. */
  readonly bilanz: number;
}

/**
 * Wählt die billigste Figur, die gerade schlagen kann.
 *
 * Regel: Kapitel 1: „Schlage grundsätzlich zunächst mit deiner billigsten Figur.“ Bei gleichem
 * Wert zuerst der Springer, dann der Läufer (SCHLAGREIHENFOLGE).
 * Der König schlägt nur, wenn das Feld danach von keiner gegnerischen Figur mehr angegriffen wird.
 */
function billigsterSchlaeger(
  brett: Board,
  ziel: Square,
  farbe: Color,
  belegung: SquareSet,
  weg: SquareSet,
): Angreifer | null {
  const kandidaten = direkteAngreifer(brett, ziel, farbe, belegung, weg).sort(
    (a, b) =>
      FIGURENWERT[a.rolle] - FIGURENWERT[b.rolle] ||
      SCHLAGREIHENFOLGE[a.rolle] - SCHLAGREIHENFOLGE[b.rolle],
  );
  const billigster = kandidaten[0];
  if (!billigster || billigster.rolle !== "king") {
    return billigster ?? null;
  }
  const ohneKoenig = belegung.without(billigster.feld);
  const gegenwehr = direkteAngreifer(brett, ziel, gegner(farbe), ohneKoenig, weg);
  return gegenwehr.length === 0 ? billigster : null;
}

/**
 * Spielt die Schlagfolge auf einem Feld durch, beide Seiten mit der billigsten Figur zuerst.
 *
 * Warum: Nach jedem Schlag kann eine Figur dahinter frei werden (Batterie). Deshalb werden die
 * Angreifer nach jedem Schlag mit der neuen Belegung neu bestimmt.
 */
function schlagfolge(brett: Board, ziel: Square, seite: Color, opfer: Role): Schlag[] {
  const folge: Schlag[] = [];
  let belegung = brett.occupied;
  let weg = SquareSet.empty();
  let amZug = seite;
  let aufDemFeld = opfer;
  for (;;) {
    const figur = billigsterSchlaeger(brett, ziel, amZug, belegung, weg);
    if (!figur) {
      return folge;
    }
    folge.push({ figur, geschlagen: aufDemFeld });
    belegung = belegung.without(figur.feld);
    weg = weg.with(figur.feld);
    aufDemFeld = figur.rolle;
    amZug = gegner(amZug);
  }
}

/**
 * Bewertet die Schlagfolge rückwärts: Jede Seite schlägt nur, solange es sich für sie lohnt.
 *
 * Ausgabe: Gewinn jeder Stufe aus Sicht der Seite, die dort schlägt (Stufe 0 = erster Schlag).
 */
function gewinneJeStufe(folge: readonly Schlag[]): number[] {
  const gewinne = folge.map((schlag) => FIGURENWERT[schlag.geschlagen]);
  // Rückwärts: Wer auf Stufe i schlägt, gewinnt die geschlagene Figur und verliert, was der
  // Gegner danach bestenfalls herausholt (aber nie weniger als 0, denn er darf aufhören).
  for (let i = gewinne.length - 2; i >= 0; i -= 1) {
    const danach = gewinne[i + 1] ?? 0;
    gewinne[i] = (gewinne[i] ?? 0) - Math.max(0, danach);
  }
  return gewinne;
}

/**
 * Berechnet den Abtausch auf einem Feld, auf dem eine Figur steht.
 *
 * Warum: Das Buch fragt nicht nur „wie viele?“, sondern „welche Figuren?“ (Kapitel 1).
 * Eingaben: Brett, Feld. Ausgabe: Abtausch, oder null bei einem leeren Feld.
 * Beispiel: Abb. 1.26, d4: Bilanz 0 („Drei gegen drei: Noch geht nichts“).
 * Abb. 1.28, d4: Schwarz gewinnt einen Bauern (Sxd4 Sxd4 Dxd4, Bilanz +1).
 * Sonderfälle: Fesselungen bleiben unberücksichtigt, wie bei der reinen Zählung im Buch.
 */
export function abtausch(brett: Board, ziel: Square): Abtausch | null {
  const opfer = brett.get(ziel);
  if (!opfer) {
    return null;
  }
  const seite = gegner(opfer.color);
  const folge = schlagfolge(brett, ziel, seite, opfer.role);
  const gewinne = gewinneJeStufe(folge);
  const bilanz = gewinne[0] ?? 0;
  return { seite, schlagfolge: folge, lohnendeSchlaege: lohnend(gewinne), bilanz };
}

/**
 * Zählt die Schläge, die unter beidseitig bestem Aufhören tatsächlich gespielt werden.
 *
 * Der erste Schlag nur bei echtem Gewinn (Kapitel 1: bei Gleichstand lohnt er sich nicht),
 * danach wird zurückgeschlagen, solange es nichts kostet.
 */
function lohnend(gewinne: readonly number[]): number {
  if ((gewinne[0] ?? 0) <= 0) {
    return 0;
  }
  let anzahl = 1;
  while (anzahl < gewinne.length && (gewinne[anzahl] ?? 0) >= 0) {
    anzahl += 1;
  }
  return anzahl;
}
