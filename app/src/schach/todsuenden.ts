/**
 * Die vier Todsünden der Eröffnungsphase (Kapitel 1), geprüft an der Zugfolge.
 *
 * Rolle im Gesamtbild: Baustein für das Werkzeug k1-todsuenden. Pflichtenheft 6.2: „Prüft in der
 * Eröffnungsphase: verfrühte Dame, Materialgier bei Entwicklungsrückstand, Randbauernzüge ohne
 * Anlass, König zu lange in der Mitte. Braucht die Zugfolge, nicht nur die Stellung.“ Art N.
 * Eröffnungsphase nach Pflichtenheft 6.6: bis eine Seite ihre drei Eröffnungsziele erfüllt hat.
 * Regeln der App (das Buch nennt die Sünden, aber keine Zählregel). Ein Zug aus den Eröffnungen
 * der Kapitel 2 und 3 ohne Fragezeichen ist eine Empfehlung des Buches und nie eine Sünde.
 * - Verfrühte Dame: Die Dame verlässt ihr Startfeld ohne zu schlagen, während noch mindestens
 *   zwei eigene Leichtfiguren auf ihrem Startfeld stehen (Abb. 1.8: 3... Df6?, Abb. 1.13: 2. Dh5).
 * - Materialgier: ein Schlag, nach dem die Seite im Material vorn liegt („ein eroberter Bauer“,
 *   kein Abtausch), während der eigene König unrochiert ist und mindestens zwei Leichtfiguren zu
 *   Hause sind (Kapitel 3, Dänisches Gambit: „drei Züge gingen ins Schlagen von Bauern“).
 * - Passivität: ein a- oder h-Bauernzug ohne Schlag, nach dem der Bauer keine Figur angreift
 *   („ohne konkrete Drohung“; 3... a6 in der Spanischen Partie greift den Läufer an), solange
 *   noch mindestens drei eigene Leichtfiguren zu Hause stehen (Zeit statt Entwicklung; 9. h3 in
 *   der Spanischen Hauptvariante, Abb. 2.11, ist keine Sünde).
 * - König in der Mitte: Nach dem zehnten Zug steht der König noch nicht rochiert (Kapitel 1:
 *   „Rochiere früh – idealerweise innerhalb der ersten zehn Züge“; Abb. 1.12).
 * Abhängigkeiten: chessops, zielbilanz.ts, angriffskarte.ts.
 */
import { pawnAttacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Color, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import { Angriffskarte } from "./angriffskarte";
import { buchzugschluessel, stellungsschluessel } from "./eroeffnungsindex";
import { materialvergleich } from "./faktorenbilanz";
import { gegner } from "./stellung";
import { zielbilanz } from "./zielbilanz";

export type Todsuende = "dame" | "gier" | "passiv" | "mitte";

export interface Suendenfund {
  readonly art: Todsuende;
  readonly farbe: Color;
  /** Zug in englischer Kurznotation und Zugnummer; null bei Funden aus der Stellung allein. */
  readonly san: string | null;
  readonly zugnummer: number;
  /** Feld der betroffenen Figur nach dem Zug (für die rote Markierung). */
  readonly feld: Square;
  /** Leichtfiguren noch auf dem Startfeld (für den Text). */
  readonly zuHause: number;
}

/** Die Zugfolge von einer Ausgangsstellung aus. */
export interface Verlauf {
  readonly startFen: string;
  readonly zuege: readonly string[];
}

/** Ab so vielen Leichtfiguren auf dem Startfeld gilt die Entwicklung als zurück. */
const ZU_HAUSE_RUECKSTAND = 2;
/** Randbauernzüge sind Passivität, solange noch so viele Leichtfiguren zu Hause stehen. */
const ZU_HAUSE_PASSIV = 3;
/** Nach so vielen Zügen sollte der König rochiert haben (Kapitel 1). */
const ROCHADE_SPAETESTENS = 10;
const GRUNDREIHE: Readonly<Record<Color, number>> = { white: 0, black: 7 };
const LEICHTFIGUREN_START = [
  { linie: 1, rolle: "knight" },
  { linie: 6, rolle: "knight" },
  { linie: 2, rolle: "bishop" },
  { linie: 5, rolle: "bishop" },
] as const;
const DAMENLINIE = 3;
const RANDLINIEN = new Set([0, 7]);
/** Linien, auf denen ein König nach der Rochade steht (a bis c, g und h). */
const ROCHADELINIEN = new Set([0, 1, 2, 6, 7]);

/** Wie viele eigene Leichtfiguren noch auf ihrem Startfeld stehen. */
export function leichtfigurenZuHause(brett: Board, farbe: Color): number {
  return LEICHTFIGUREN_START.filter(({ linie, rolle }) => {
    const feld = squareFromCoords(linie, GRUNDREIHE[farbe]);
    const figur = feld === undefined ? undefined : brett.get(feld);
    return figur?.role === rolle && figur.color === farbe;
  }).length;
}

function koenigRochiert(brett: Board, farbe: Color): boolean {
  const koenig = brett.kingOf(farbe);
  return (
    koenig !== undefined &&
    squareRank(koenig) === GRUNDREIHE[farbe] &&
    ROCHADELINIEN.has(squareFile(koenig))
  );
}

/** Eröffnungsphase einer Seite: noch nicht alle drei Ziele erfüllt (Pflichtenheft 6.6). */
function inEroeffnung(pos: Chess, farbe: Color): boolean {
  const z = zielbilanz(pos.board, new Angriffskarte(pos.board), farbe, pos.turn);
  return [z.zentrum, z.entwicklung, z.koenig].some((p) => p.wertung !== "ja");
}

interface Zugdaten {
  readonly pos: Chess;
  readonly von: Square;
  readonly nach: Square;
}

/** Liegt die Farbe nach dem Zug im Material vorn (Faustwerte)? */
function danachVorn(pos: Chess, von: Square, nach: Square, farbe: Color): boolean {
  const danach = pos.clone();
  danach.play({ from: von, to: nach });
  return materialvergleich(danach.board).vorn === farbe;
}

/** Die Sünde eines einzelnen Zuges, oder null. */
function suendeImZug(z: Zugdaten): Todsuende | null {
  const { pos, von, nach } = z;
  const farbe = pos.turn;
  const figur = pos.board.get(von);
  if (!figur) return null;
  const zuHause = leichtfigurenZuHause(pos.board, farbe);
  const schlag = pos.board[gegner(farbe)].has(nach);
  const startfeldDame = squareFromCoords(DAMENLINIE, GRUNDREIHE[farbe]);
  const rueckstand = zuHause >= ZU_HAUSE_RUECKSTAND;
  if (figur.role === "queen" && von === startfeldDame && !schlag && rueckstand) return "dame";
  if (
    schlag &&
    rueckstand &&
    !koenigRochiert(pos.board, farbe) &&
    danachVorn(pos, von, nach, farbe)
  ) {
    return "gier";
  }
  const randbauer = figur.role === "pawn" && RANDLINIEN.has(squareFile(von));
  if (randbauer && !schlag && zuHause >= ZU_HAUSE_PASSIV) {
    const greiftAn = pawnAttacks(farbe, nach).intersects(pos.board[gegner(farbe)]);
    if (!greiftAn) return "passiv";
  }
  return null;
}

/** Steht der Zug ohne Fragezeichen in den Eröffnungen des Buches? */
function buchzugOhneTadel(
  pos: Chess,
  san: string,
  buchzuege?: ReadonlyMap<string, string>,
): boolean {
  const zeichen = buchzuege?.get(
    buchzugschluessel(stellungsschluessel(makeFen(pos.toSetup())), san),
  );
  return zeichen !== undefined && !zeichen.includes("?");
}

function startstellung(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isOk ? pos.value : null;
}

/** König in der Mitte nach dem zehnten Zug, in der gezeigten Stellung. */
function mitteAm(pos: Chess, farbe: Color): Suendenfund | null {
  const koenig = pos.board.kingOf(farbe);
  const zuege = pos.turn === "white" || farbe === "black" ? pos.fullmoves - 1 : pos.fullmoves;
  if (koenig === undefined || koenigRochiert(pos.board, farbe) || zuege < ROCHADE_SPAETESTENS) {
    return null;
  }
  const zuHause = leichtfigurenZuHause(pos.board, farbe);
  return { art: "mitte", farbe, san: null, zugnummer: zuege, feld: koenig, zuHause };
}

/**
 * Sucht die vier Todsünden in einer Zugfolge.
 *
 * Warum: „Häufig verstoßen Anfänger gegen die gerade besprochenen Grundprinzipien und begehen
 * insbesondere eine der vier Todsünden“ (Kapitel 1). Eingaben: Ausgangsstellung und Züge,
 * optional die Buchzüge aus dem Eröffnungsindex.
 * Ausgabe: Funde in Zugreihenfolge; dazu, aus der gezeigten Stellung, der König in der Mitte.
 * Beispiel: Abb. 1.8 (1. e4 e5 2. Sf3 Sc6 3. Lc4 Df6?): Schwarz, verfrühte Dame bei 3... Df6.
 * Sonderfälle: Ein Zug, der nicht geht, beendet die Prüfung; nach Erreichen der drei
 * Eröffnungsziele zählt für diese Seite nichts mehr.
 */
export function todsuenden(
  verlauf: Verlauf,
  buchzuege?: ReadonlyMap<string, string>,
): Suendenfund[] {
  const pos = startstellung(verlauf.startFen);
  if (!pos) return [];
  const funde: Suendenfund[] = [];
  const gefunden = new Set<string>();
  for (const san of verlauf.zuege) {
    const zug = parseSan(pos, san);
    if (!zug || !("from" in zug)) break;
    const farbe = pos.turn;
    const pruefen = inEroeffnung(pos, farbe) && !buchzugOhneTadel(pos, san, buchzuege);
    const art = pruefen ? suendeImZug({ pos, von: zug.from, nach: zug.to }) : null;
    const schluessel = `${art}:${farbe}`;
    // Je Seite und Sünde der erste Fund; die verfrühte Dame zählt nur beim ersten Damenzug.
    if (art && !gefunden.has(schluessel)) {
      gefunden.add(schluessel);
      const zuHause = leichtfigurenZuHause(pos.board, farbe);
      funde.push({ art, farbe, san, zugnummer: pos.fullmoves, feld: zug.to, zuHause });
    }
    pos.play(zug);
  }
  for (const farbe of ["white", "black"] as const) {
    const mitte = inEroeffnung(pos, farbe) ? mitteAm(pos, farbe) : null;
    if (mitte) funde.push(mitte);
  }
  return funde;
}
