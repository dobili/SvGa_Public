/**
 * Aktivität der Figuren nach dem LAP-Prinzip (Least Active Piece): freie Zielfelder je Figur,
 * die am wenigsten aktive Figur, die aktivste Figur des Gegners (Tauschfrage).
 *
 * Rolle im Gesamtbild: Baustein für k6-lap und k6-planbilanz (Planfrage 3). Pflichtenheft 6.3:
 * „Zählt die freien Zielfelder jeder Figur wie im Buch und schlägt die am wenigsten aktive
 * Figur vor.“ Abhängigkeiten: sichereFelder.ts (Zugziele), stellung.ts (Faustwerte).
 * Buchbezug: Kapitel 6, „Frage 3: Welche Figur bringe ich dorthin?“ (Abb. 6.16: Der Springer
 * d2 könnte nach b1, b3, c4, e4, f1 und f3 ziehen, auf vier Feldern stehen eigene Figuren, übrig
 * bleiben b1 und b3) und „Die Tauschfrage“ (Abb. 6.6: der Läufer g7).
 */
import type { Color, Piece, Role, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import type { Figurenfelder } from "./sichereFelder";
import { FIGURENWERT } from "./stellung";

/** Startlinien der Leichtfiguren (b, g für Springer; c, f für Läufer). */
const STARTLINIEN: Readonly<Partial<Record<Role, readonly number[]>>> = {
  knight: [1, 6],
  bishop: [2, 5],
};
const GRUNDREIHE: Readonly<Record<Color, number>> = { white: 0, black: 7 };

/** Eine Figur mit ihren freien Zielfeldern (ohne eigene Figuren darauf) und den sicheren davon. */
export interface Aktivitaet {
  readonly stand: Figurenstand;
  readonly freie: readonly Square[];
  readonly sichere: readonly Square[];
  /** Eine Leichtfigur, die noch auf ihrem Startfeld steht (Abb. 6.20: der Läufer c1). */
  readonly zuHause: boolean;
}

/** Steht die Leichtfigur noch auf ihrem Startfeld? Türme und Dame zählen nicht als „zu Hause“. */
export function zuHause(feld: Square, figur: Piece): boolean {
  const linien = STARTLINIEN[figur.role];
  return (
    linien !== undefined &&
    linien.includes(squareFile(feld)) &&
    squareRank(feld) === GRUNDREIHE[figur.color]
  );
}

/** Reihenfolge der Figurenarten bei der LAP-Frage: Leichtfiguren, dann Türme, dann die Dame. */
const GRUPPE: Readonly<Partial<Record<Role, number>>> = { knight: 0, bishop: 0, rook: 1, queen: 2 };

/**
 * Ordnet die Figuren nach Aktivität: zuerst die am wenigsten aktive.
 *
 * Regel: Kapitel 6 (LAP-Prinzip), Reihenfolge der App: Leichtfiguren zu Hause zuerst
 * (Entwicklung geht vor, Kapitel 1), dann die Leichtfiguren nach Zahl der freien Felder, dann
 * die Türme, zuletzt die Dame (Abb. 6.16: Der Springer d2 ist die am wenigsten aktive Figur,
 * obwohl der Turm f1 nur ein freies Feld hat; Türme gehören auf Linien, Kapitel 5). Bei
 * Gleichstand die billigere Figur, dann von a1 aufsteigend.
 */
function nachAktivitaet(a: Aktivitaet, b: Aktivitaet): number {
  return (
    Number(b.zuHause) - Number(a.zuHause) ||
    (GRUPPE[a.stand.figur.role] ?? 0) - (GRUPPE[b.stand.figur.role] ?? 0) ||
    a.freie.length - b.freie.length ||
    FIGURENWERT[a.stand.figur.role] - FIGURENWERT[b.stand.figur.role] ||
    a.stand.feld - b.stand.feld
  );
}

/**
 * Die Aktivität aller Figuren einer Seite außer König und Bauern, am wenigsten aktive zuerst.
 *
 * Eingaben: Zielfelder je Figur (aus dem Profil, `sichereFelder`). Ausgabe: Aktivitäten.
 * Beispiel: Abb. 6.16, Weiß: Springer d2 mit b1 und b3 (2 freie Felder) zuerst.
 */
export function aktivitaeten(felder: readonly Figurenfelder[]): Aktivitaet[] {
  return felder
    .filter((f) => f.figur.role !== "king" && f.figur.role !== "pawn")
    .map((f) => ({
      stand: { feld: f.feld, figur: f.figur },
      freie: [...f.sichere, ...f.unsichere].sort((a, b) => a - b),
      sichere: f.sichere,
      zuHause: zuHause(f.feld, f.figur),
    }))
    .sort(nachAktivitaet);
}

/**
 * Die aktivste Figur einer Seite (Tauschfrage: „Welche Figur des Gegners ist am aktivsten?“).
 * Bei Gleichstand die wertvollere, dann die weiter vorn stehende.
 */
export function aktivste(liste: readonly Aktivitaet[]): Aktivitaet | null {
  const geordnet = [...liste].sort(
    (a, b) =>
      b.freie.length - a.freie.length ||
      FIGURENWERT[b.stand.figur.role] - FIGURENWERT[a.stand.figur.role] ||
      a.stand.feld - b.stand.feld,
  );
  return geordnet[0] ?? null;
}
