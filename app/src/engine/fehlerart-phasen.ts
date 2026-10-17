/**
 * Typische Fehler je Phase (0.2.40): Tempoverlust und Bauernraub in der Eröffnung, geschwächter
 * Königsschild und falscher Abtausch im Mittelspiel, passiver König, Bauernvorstoß und Patt im
 * Endspiel.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026): die typischen Fehler von Menschen je
 * Niveau und Phase als Vorgaben für die Engine. Die Liste mit Quellen steht in
 * docs/ENTSCHEIDUNGEN.md; hier die Regeln, mit denen die Fehlersuche (engine/fehlersuche.ts)
 * solche Züge erkennt und der Rückblick (spiel/erklaerung.ts) sie erklärt. Die Gewichte je
 * Phase und Stufe stehen in engine/fehlerprofil.ts.
 * Abhängigkeiten: fehlerart.ts (Lage, Zugprobe), schach/angriffskarte.ts, schach/todsuenden.ts,
 * schach/stellung.ts (Faustwerte), chessops.
 */
import type { Color, Role } from "chessops/types";
import { makeSquare, opposite, squareFile, squareRank } from "chessops/util";
import { Angriffskarte } from "../schach/angriffskarte";
import { FIGURENWERT } from "../schach/stellung";
import { leichtfigurenZuHause } from "../schach/todsuenden";
import type { Lage, Zugprobe } from "./fehlerart";

/** Ab so viel Verlust (Engine) gilt ein Zug als Fehler dieser Art, wenn die Regel allein nicht reicht. */
const VERLUST_AB = 0.5;
/** Leichtfiguren zu Hause, ab denen ein zweiter Zug derselben Figur ein Tempoverlust ist. */
const ZU_HAUSE_TEMPO = 2;
/** Materialrückstand, ab dem ein gleicher Abtausch falsch ist (Kapitel 8: „Wer vorn liegt, tauscht“). */
const RUECKSTAND_AB = 2;
/** Materialvorsprung, ab dem ein Patt ein Fehler ist (statt eine Rettung). */
const VORSPRUNG_PATT = 2;
const GRUNDREIHE: Readonly<Record<Color, number>> = { white: 0, black: 7 };
const SCHILDREIHE: Readonly<Record<Color, number>> = { white: 1, black: 6 };
/** Linien, auf denen ein rochierter König steht (a bis c, g bis h). */
const KURZ_AB = 6;
const LANG_BIS = 2;
/** Startlinien der Figuren je Rolle, für „schon entwickelt“. */
const STARTLINIEN: Readonly<Partial<Record<Role, readonly number[]>>> = {
  knight: [1, 6],
  bishop: [2, 5],
  queen: [3],
};
/** Bauernraub: die Bauern auf b und g sind die klassischen Köder (b2/b7, g2/g7). */
const KOEDERLINIEN = new Set([1, 6]);
/** UCI: zwei Zeichen Startfeld. */
const FELDLAENGE = 2;

/** Summe der Faustwerte einer Farbe ohne König. */
function material(lage: Lage, farbe: Color): number {
  let summe = 0;
  for (const feld of lage.regeln.board[farbe]) {
    const figur = lage.regeln.board.get(feld);
    if (figur && figur.role !== "king") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/** Steht die Figur auf einem Startfeld ihrer Art (Grundreihe, passende Linie)? */
function aufStartfeld(p: Zugprobe, farbe: Color): boolean {
  const linien = STARTLINIEN[p.figur.role];
  return (
    linien !== undefined &&
    squareRank(p.zug.from) === GRUNDREIHE[farbe] &&
    linien.includes(squareFile(p.zug.from))
  );
}

/**
 * Tempoverlust (Eröffnung, Kapitel 1 „Entwickle alle Figuren“): eine schon entwickelte
 * Leichtfigur oder Dame zieht noch einmal, ohne zu schlagen, Schach zu geben oder angegriffen zu
 * sein, während zwei oder mehr eigene Leichtfiguren zu Hause stehen.
 * Beispiel: 1. e4 e5 2. Sf3 Sc6 3. Lc4 Lc5 4. Lb3?! (Springer b1 und Läufer c1 zu Hause).
 */
export function istTempoverlust(lage: Lage, p: Zugprobe): boolean {
  const farbe = lage.regeln.turn;
  // Seit 0.2.44 kann die Phase Mittelspiel sein, obwohl diese Seite noch in der Entwicklung steckt;
  // maßgeblich sind die eigenen Figuren zu Hause, nicht die Phase.
  if (lage.phase === "endspiel" || !(p.figur.role in STARTLINIEN)) return false;
  if (p.geschlagen !== null || p.danach.isCheck() || aufStartfeld(p, farbe)) return false;
  if (leichtfigurenZuHause(lage.regeln.board, farbe) < ZU_HAUSE_TEMPO) return false;
  const karte = new Angriffskarte(lage.regeln.board);
  return karte.angreiferVon(p.zug.from, opposite(farbe)).length === 0;
}

/**
 * Bauernraub (Eröffnung, Kapitel 4 „Köder“): die Dame schlägt einen Bauern, laut Engine mit
 * Verlust, oder einen der klassischen Köder auf der b- oder g-Linie.
 * Beispiel: Dxb2 im Sizilianer, Dxg7 ohne Rechnung.
 */
export function istBauernraub(lage: Lage, p: Zugprobe, verlust: number | null): boolean {
  if (lage.phase === "endspiel" || p.figur.role !== "queen" || p.geschlagen !== "pawn") {
    return false;
  }
  // Bauernraub ist ein Eröffnungsfehler: Die raubende Seite hat noch Figuren zu Hause (0.2.44).
  if (leichtfigurenZuHause(lage.regeln.board, lage.regeln.turn) < ZU_HAUSE_TEMPO) return false;
  return (verlust !== null && verlust >= VERLUST_AB) || KOEDERLINIEN.has(squareFile(p.zug.to));
}

/** Das Feld des rochierten Königs (Grundreihe, Linie a bis c oder g bis h), sonst null. */
function koenigRochiert(lage: Lage, farbe: Color): number | null {
  const koenig = lage.regeln.board.kingOf(farbe);
  if (koenig === undefined || squareRank(koenig) !== GRUNDREIHE[farbe]) return null;
  const linie = squareFile(koenig);
  return linie >= KURZ_AB || linie <= LANG_BIS ? koenig : null;
}

/**
 * Königsschild geschwächt (Mittelspiel, Kapitel 2 und 3 „Bauernschild“): ein Bauer vor dem
 * rochierten König (Nachbarlinien, zweite Reihe) zieht ohne Not vor, ohne zu schlagen.
 * Beispiel: nach 0-0 der Zug g2–g4 bei Figuren des Gegners am Königsflügel.
 */
export function istKoenigsschild(lage: Lage, p: Zugprobe): boolean {
  const farbe = lage.regeln.turn;
  if (lage.phase === "endspiel" || p.figur.role !== "pawn" || p.geschlagen !== null) return false;
  const koenig = koenigRochiert(lage, farbe);
  if (koenig === null || p.danach.isCheck()) return false;
  const abstand = Math.abs(squareFile(p.zug.from) - squareFile(koenig));
  return squareRank(p.zug.from) === SCHILDREIHE[farbe] && abstand <= 1;
}

/**
 * Falscher Abtausch (Mittelspiel und Endspiel, Kapitel 8 „Wer Material vorn hat, tauscht
 * Figuren; wer zurückliegt, nicht“): Wer mindestens zwei Bauerneinheiten zurückliegt, tauscht eine
 * Figur ab Leichtfigur gleichwertig ab.
 */
export function istFalscherAbtausch(lage: Lage, p: Zugprobe): boolean {
  const farbe = lage.regeln.turn;
  if (lage.phase === "eroeffnung" || p.geschlagen === null || p.geschlagen === "pawn") return false;
  if (material(lage, farbe) > material(lage, opposite(farbe)) - RUECKSTAND_AB) return false;
  const schlag = lage.schlaege.find((s) => s.von === p.zug.from && s.nach === p.zug.to);
  return schlag !== undefined && schlag.bilanz === 0;
}

/**
 * Passiver König (Endspiel, Kapitel 8 „Der König wird zur Figur“): Der beste Zug der Engine ist
 * ein Königszug, gespielt wird etwas anderes, ohne Schlag und ohne Schach.
 */
export function istKoenigPassiv(lage: Lage, p: Zugprobe, besterZug: string | null): boolean {
  if (lage.phase !== "endspiel" || !besterZug || p.figur.role === "king") return false;
  if (p.geschlagen !== null || p.danach.isCheck()) return false;
  const koenig = lage.regeln.board.kingOf(lage.regeln.turn);
  return koenig !== undefined && besterZug.slice(0, FELDLAENGE) === makeSquare(koenig);
}

/**
 * Bauernvorstoß (Endspiel, Kapitel 8 „Bauern gehen nicht zurück“): ein Bauernzug ohne Schlag und
 * ohne Umwandlung, der laut Engine verliert.
 */
export function istBauernvorstoss(lage: Lage, p: Zugprobe, verlust: number | null): boolean {
  if (lage.phase !== "endspiel" || p.figur.role !== "pawn" || p.geschlagen !== null) return false;
  if (p.zug.promotion !== undefined || p.danach.isCheck()) return false;
  return verlust !== null && verlust >= VERLUST_AB;
}

/**
 * Patt gesetzt (Endspiel, Kapitel 8 „Pattfalle“): Der Zug setzt den Gegner patt, obwohl man
 * mindestens zwei Bauerneinheiten vorn liegt. Beispiel: Übung 50, Pattfalle vermeiden.
 */
export function istPattGesetzt(lage: Lage, p: Zugprobe): boolean {
  if (!p.danach.isStalemate()) return false;
  const farbe = lage.regeln.turn;
  return material(lage, farbe) >= material(lage, opposite(farbe)) + VORSPRUNG_PATT;
}
