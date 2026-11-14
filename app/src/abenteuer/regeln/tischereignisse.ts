/**
 * Ereignisse des Tischgesprächs (docs/spiel/29_Tischgespraech.md, Abschnitt 3): Was ist mit einem
 * Halbzug der Partie geschehen, worüber der Gegner oder Ambrose etwas sagen könnte?
 *
 * Rolle im Gesamtbild: reine Regeln ohne React, nur aus dem Verlauf der Partie (Stellungen und wer
 * zog), ohne Bewertung der Engine. regeln/tischgespraech.ts entscheidet, ob und wer spricht;
 * anbindung/Tischgespraech.tsx zeigt die Zeile in der Sprechblase.
 * Warum ohne Engine: Die Zeilen sollen sofort kommen und dürfen nie einen Zug verraten; Material,
 * Schach, Rochade und Umwandlung sieht jeder am Brett.
 * Buchbezug: Kapitel 1, Faustwerte der Figuren (Leichtfigur 3 Bauerneinheiten).
 * Abhängigkeiten: regeln/partiemomente.ts (Verlauf, Stellungspaare, Material).
 */
import type { Color } from "chessops/types";
import { gegner, type Stellung } from "../../schach/stellung";
import { material, materialbilanz, stellungspaar, type Partieverlauf } from "./partiemomente";

/** Ereignisse der Partie, nach Wichtigkeit geordnet (das erste zutreffende zählt je Halbzug). */
export const PARTIEEREIGNISSE = [
  "hinten",
  "vorne",
  "umwandlung",
  "schlaegtFigur",
  "verliertFigur",
  "gibtSchach",
  "schach",
  "rochade",
  "beginn",
] as const;

export type Partieereignis = (typeof PARTIEEREIGNISSE)[number];

/** Ereignisse außerhalb der Halbzüge: Uhr und Ende der Partie. */
export type Randereignis = "zeitnot" | "sieg" | "remis" | "niederlage";

/** Ereignisse der Rätsel (Abschnitt 3). */
export type Raetselereignis = "richtig" | "falsch" | "hinweis" | "serie" | "letzte";

export type Tischereignis = Partieereignis | Randereignis | Raetselereignis;

/** Ab so viel Material (Bauerneinheiten) zählt ein Schlag als Figur: eine Leichtfigur. */
const LEICHTFIGUR = 3;
/** Vorsprung oder Rückstand in Bauerneinheiten für `vorne` und `hinten`. */
const VORSPRUNG = 3;
/** Ein rochierender König geht zwei Linien weit. */
const ROCHADEWEITE = 2;
const LINIEN = 8;

/** Wie viel Material verlor `farbe` mit dem Halbzug (Bauerneinheiten)? */
function verlust(vor: Stellung, nach: Stellung, farbe: Color): number {
  return material(vor, farbe) - material(nach, farbe);
}

/** Zog der König der Seite zwei Linien weit (Rochade)? */
function rochiert(vor: Stellung, nach: Stellung, farbe: Color): boolean {
  const a = vor.brett.kingOf(farbe);
  const b = nach.brett.kingOf(farbe);
  if (a === undefined || b === undefined) return false;
  return (
    Math.abs((a % LINIEN) - (b % LINIEN)) === ROCHADEWEITE && a - (a % LINIEN) === b - (b % LINIEN)
  );
}

/** Verschwand ein Bauer der ziehenden Seite? Das geht nur durch Umwandlung. */
function wandeltUm(vor: Stellung, nach: Stellung, farbe: Color): boolean {
  return nach.brett.pieces(farbe, "pawn").size() < vor.brett.pieces(farbe, "pawn").size();
}

/** Liegt der Held mit Halbzug `h` zum ersten Mal in der Partie so weit vorn (oder hinten)? */
function erstmals(verlauf: Partieverlauf, h: number, richtung: 1 | -1): boolean {
  for (let i = 0; i <= h; i++) {
    const s = stellungspaar(verlauf, Math.max(i, 1));
    if (!s) return false;
    const stellung = i === 0 ? s.vor : s.nach;
    const ueber = richtung * materialbilanz(stellung, verlauf.held) >= VORSPRUNG;
    if (ueber) return i === h;
  }
  return false;
}

/** Ist dies der erste Halbzug des Gegners in der Partie? */
function ersterZugDesGegners(verlauf: Partieverlauf, h: number): boolean {
  return verlauf.vomHelden.findIndex((held) => !held) === h - 1;
}

/** Trifft das Ereignis auf Halbzug `h` zu? (Einzelprüfung, für den Test und tischereignis.) */
export function trifftZu(ereignis: Partieereignis, verlauf: Partieverlauf, h: number): boolean {
  const s = stellungspaar(verlauf, h);
  if (!s) return false;
  const heldZog = verlauf.vomHelden[h - 1] === true;
  const ziehend = heldZog ? verlauf.held : gegner(verlauf.held);
  const schach = s.nach.regeln?.isCheck() === true;
  switch (ereignis) {
    case "hinten":
      return erstmals(verlauf, h, -1);
    case "vorne":
      return erstmals(verlauf, h, 1);
    case "umwandlung":
      return wandeltUm(s.vor, s.nach, ziehend);
    case "schlaegtFigur":
      return !heldZog && verlust(s.vor, s.nach, verlauf.held) >= LEICHTFIGUR;
    case "verliertFigur":
      return heldZog && verlust(s.vor, s.nach, gegner(verlauf.held)) >= LEICHTFIGUR;
    case "gibtSchach":
      return !heldZog && schach;
    case "schach":
      return heldZog && schach;
    case "rochade":
      return heldZog && rochiert(s.vor, s.nach, verlauf.held);
    case "beginn":
      return ersterZugDesGegners(verlauf, h);
  }
}

/**
 * Das wichtigste Ereignis des Halbzugs `h` (1-basiert) oder null.
 *
 * Warum nur eines: Je Halbzug spricht höchstens eine Figur; die Ordnung in PARTIEEREIGNISSE sagt,
 * was zählt (ein Rückstand ist wichtiger als das Schach, mit dem er entstand).
 * Beispiel: Der Gegner schlägt mit Sxe5 einen Springer → „schlaegtFigur“; der Held rochiert kurz →
 * „rochade“. Sonderfall: Gegner der Bilanz ist immer der Held (`vorne`: der Held liegt vorn).
 */
export function tischereignis(verlauf: Partieverlauf, h: number): Partieereignis | null {
  return PARTIEEREIGNISSE.find((e) => trifftZu(e, verlauf, h)) ?? null;
}
