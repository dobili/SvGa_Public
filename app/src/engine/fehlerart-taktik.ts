/**
 * „Taktik übersehen“ (Kapitel 7): neue Gabel (W6), neue gefährliche Linie (W2) oder ein Motiv in
 * der Antwort der Engine, dazu die Schlüssel, mit denen die Lage Gabeln und Linien vor dem Zug
 * festhält.
 *
 * Rolle im Gesamtbild: Ausgelagert aus fehlerart.ts (0.2.40, Dateigrenze 400 Zeilen). Regeln:
 * Kapitel 4 (W2, W6 Gabelgeometrie) und Kapitel 7 (Motive).
 * Abhängigkeiten: fehlerart-typen.ts (Lage), zugprobe.ts (Zugprobe), analyse/k4-warnsignale.ts,
 * analyse/stellungsprofil.ts, schach/gabeln.ts, schach/taktikmotive.ts, chessops.
 */
import { Chess, normalizeMove } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { makeSanAndPlay } from "chessops/san";
import type { Piece } from "chessops/types";
import { opposite, parseUci } from "chessops/util";
import { gefaehrlicheLinien, type GefaehrlicheLinie } from "../analyse/k4-warnsignale";
import { profil } from "../analyse/stellungsprofil";
import { gabelfelder, type Gabelfeld } from "../schach/gabeln";
import type { Stellung } from "../schach/stellung";
import { erkenneMotive, type Motiv } from "../schach/taktikmotive";
import type { Lage } from "./fehlerart-typen";
import type { Zugprobe } from "./zugprobe";

/** Die übersehene Taktik: eine neue Gabel (W6), eine neue gefährliche Linie (W2) oder ein Motiv der Antwort. */
export type Taktikbefund =
  | { readonly art: "gabel"; readonly gabel: Gabelfeld }
  | { readonly art: "linie"; readonly linie: GefaehrlicheLinie }
  | { readonly art: "motiv"; readonly motiv: Motiv };

/** Motive aus Kapitel 7, die als „Taktik übersehen“ gelten. */
const TAKTIKMOTIVE: ReadonlySet<Motiv> = new Set<Motiv>([
  "gabel",
  "doppelangriff",
  "fesselung",
  "spiess",
  "abzug",
  "doppelschach",
]);
/** So viele Halbzüge der Engine-Antwort prüft die Motiverkennung. */
const ANTWORT_HALBZUEGE = 3;
/** In so vielen Halbzügen der Widerlegung muss das Motiv Material gewinnen (seit 0.2.118). */
const GEWINN_HALBZUEGE = 5;
/** So viel muss es mindestens gewinnen (ein Bauer). */
const GEWINN_AB = 1;
const WERTE: Readonly<Record<Piece["role"], number>> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0,
};

/** Materialbilanz aus Sicht einer Farbe (eigene minus fremde Figuren, Bauerneinheiten). */
function bilanz(regeln: Chess, farbe: Piece["color"]): number {
  let summe = 0;
  for (const [, figur] of regeln.board) {
    summe += (figur.color === farbe ? 1 : -1) * WERTE[figur.role];
  }
  return summe;
}

/**
 * Wie viel Material gewinnt der Gegner in der Widerlegung der Engine (Bauerneinheiten, mindestens 0)? Seit 0.2.118 (Hinweis des
 * Autors mit zwei Fehlalarmen: 9… Df6 „Gabel Sd5“, 4. c4 „Gabel e5“): Ein Motiv zählt nur, wenn
 * die Widerlegung der Engine es spielt und der Gegner in den nächsten fünf Halbzügen mindestens
 * einen Bauern gewinnt. Ohne Antwort der Engine zählt kein Motiv. Gezählt ab der Stellung vor dem
 * Zug (geschlagen: was der Zug selbst schlug).
 */
export function widerlegungsgewinn(
  danach: Chess,
  antwort: readonly string[],
  geschlagen: Piece["role"] | null = null,
  halbzuege: number = GEWINN_HALBZUEGE,
): number {
  if (antwort.length === 0) return 0;
  const gegner = danach.turn;
  const regeln = danach.clone();
  // Gezählt ab der Stellung vor dem Zug: Schlägt der Zug selbst, ist das Zurückschlagen kein Gewinn
  const vorher = bilanz(regeln, gegner) + (geschlagen ? WERTE[geschlagen] : 0);
  let besterStand = Number.NEGATIVE_INFINITY;
  for (const uci of antwort.slice(0, halbzuege)) {
    const roh = parseUci(uci);
    if (!roh) break;
    const zug = normalizeMove(regeln, roh);
    if (!regeln.isLegal(zug)) break;
    regeln.play(zug);
    // Es zählt nur der Stand nach der Antwort des Verteidigers (sonst zählte ein Zwischenstand,
    // etwa Sxf7+ vor Txf7)
    if (regeln.turn === gegner) besterStand = Math.max(besterStand, bilanz(regeln, gegner));
  }
  // Endet die Widerlegung hier, gilt auch ihr letzter Stand (die Engine sieht keine Antwort mehr)
  if (antwort.length <= halbzuege) besterStand = Math.max(besterStand, bilanz(regeln, gegner));
  return Math.max(0, besterStand - vorher);
}

/** Spielt die Widerlegung das Motiv: Zieht ihr erster Zug von diesem Feld (auf dieses Feld)? */
function ersterZugIst(antwort: readonly string[], von: number, nach?: number): boolean {
  const roh = antwort[0] ? parseUci(antwort[0]) : undefined;
  if (!roh || !("from" in roh)) return false;
  return roh.from === von && (nach === undefined || roh.to === nach);
}

/** Die Stellung der App zu einer Regelstellung. */
export function stellungVon(regeln: Chess): Stellung {
  return { fen: makeFen(regeln.toSetup()), brett: regeln.board, amZug: regeln.turn, regeln };
}

/** Schlüssel eines Gabelfelds (Figur, Feld, Ziele), um Gabeln vor und nach dem Zug zu vergleichen. */
function gabelschluessel(g: Gabelfeld): string {
  return `${g.figur.feld}-${g.feld}:${[...g.ziele].sort((a, b) => a - b).join(",")}`;
}

/** Gabelfelder einer Farbe mit Schlüssel. */
export function gabelnVon(stellung: Stellung, farbe: Piece["color"]): Map<string, Gabelfeld> {
  const karte = profil(stellung).angriffskarte;
  return new Map(gabelfelder(stellung, karte, farbe).map((g) => [gabelschluessel(g), g]));
}

/** Schlüssel einer gefährlichen Linie (Art, Langschrittfigur, hintere Figur). */
function linienschluessel(l: GefaehrlicheLinie): string {
  return `${l.art}:${l.von.feld}-${l.hinten.feld}`;
}

/** Gefährliche Linien gegen eine Farbe mit Schlüssel. */
export function linienGegen(
  stellung: Stellung,
  farbe: Piece["color"],
): Map<string, GefaehrlicheLinie> {
  return new Map(gefaehrlicheLinien(profil(stellung), farbe).map((l) => [linienschluessel(l), l]));
}

/** Das Motiv aus Kapitel 7 in der Antwort der Engine (Gabel, Fesselung, Spieß, Abzug, Doppelschach), sonst null. */
function antwortmotiv(danach: Chess, antwort: readonly string[]): Motiv | null {
  if (antwort.length === 0) return null;
  const regeln = danach.clone();
  const san: string[] = [];
  for (const uci of antwort.slice(0, ANTWORT_HALBZUEGE)) {
    const roh = parseUci(uci);
    if (!roh) break;
    const zug = normalizeMove(regeln, roh);
    if (!regeln.isLegal(zug)) break;
    san.push(makeSanAndPlay(regeln, zug));
  }
  const befund = erkenneMotive(danach, san);
  return befund?.motive.find((m) => TAKTIKMOTIVE.has(m)) ?? null;
}

/**
 * Taktik übersehen (Kapitel 7): Nach dem Zug hat der Gegner eine neue Gabel (W6) oder eine neue
 * gefährliche Linie (W2) gegen die ziehende Seite, oder seine Antwort ist ein Motiv; sonst null.
 * Seit 0.2.118 nur, wenn die Widerlegung der Engine das Motiv spielt und Material gewinnt.
 */
export function uebersehneTaktik(
  lage: Lage,
  p: Zugprobe,
  antwort: readonly string[],
): Taktikbefund | null {
  if (p.danach.isCheck() || widerlegungsgewinn(p.danach, antwort, p.geschlagen) < GEWINN_AB)
    return null;
  if (!lage.regeln.isCheck()) {
    const stellung = stellungVon(p.danach);
    const feind = p.danach.turn;
    for (const [schluessel, gabel] of gabelnVon(stellung, feind)) {
      const gespielt = ersterZugIst(antwort, gabel.figur.feld, gabel.feld);
      if (!lage.gabeln.has(schluessel) && gespielt) return { art: "gabel", gabel };
    }
    for (const [schluessel, linie] of linienGegen(stellung, opposite(feind))) {
      const gespielt = ersterZugIst(antwort, linie.von.feld);
      if (!lage.linien.has(schluessel) && gespielt) return { art: "linie", linie };
    }
  }
  const motiv = antwortmotiv(p.danach, antwort);
  return motiv ? { art: "motiv", motiv } : null;
}
