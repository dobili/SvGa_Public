/**
 * Welchen typischen Anfängerfehler ein Zug darstellt (Konzept 8.2, Tabelle „Fehlerarten“).
 *
 * Rolle im Gesamtbild: Die Fehlersuche der Stufen 1 bis 4 (engine/fehlersuche.ts) sucht unter
 * allen legalen Zügen und den Kandidaten der Engine einen typischen Fehlerzug und protokolliert
 * seine Art; die Auswertung nach der Partie nennt sie („Mit 12... Sf6 hat die Engine eine Figur
 * hängen lassen (W1). Hast du es gesehen?“, Pflichtenheft 5.2).
 *
 * Die sechs Arten aus Konzept 8.2, geprüft mit den Werkzeugen des Buches:
 * - Figur hängen lassen (W1, Kapitel 4): Nach dem Zug ist eine eigene Figur (ab Leichtfigur)
 *   angegriffen und laut Abtauschrechnung (Kapitel 1) verloren; vor dem Zug war sie es nicht.
 * - Schlagreflex und Köder annehmen (W5, Kapitel 4): ein Schlag, den die Abtauschrechnung oder
 *   die Engine (Verlust ab 1) als schlecht bewertet.
 * - Verfrühte Dame (Kapitel 1, Todsünde): Die Dame verlässt ihr Startfeld ohne Schlag, während
 *   mindestens zwei Leichtfiguren zu Hause stehen (dieselbe Regel wie schach/todsuenden.ts).
 * - König in der Mitte (Kapitel 1): ab dem zehnten Zug eine mögliche Rochade ausgelassen.
 * - Taktik übersehen (Kapitel 7): Nach dem Zug hat der Gegner eine neue Gabel (W6
 *   Gabelgeometrie), eine neue gefährliche Linie (W2: Fesselung, Spieß, Abzug), oder seine
 *   Antwort laut Engine ist ein Motiv aus Kapitel 7 (Gabel, Fesselung, Spieß, Abzug, Doppelschach).
 * - Drohung ignorieren (Kapitel 1, Schach-Röntgen-Regel; Kapitel 7, Schritt 2): Vor dem Zug
 *   drohte der Gegner Matt oder Materialgewinn, und nach dem Zug droht dasselbe noch.
 * Alles andere heißt „ungenau“. Die Lage vor dem Zug (Drohungen, Gabeln, Linien) wird je
 * Stellung einmal berechnet, damit alle legalen Züge geprüft werden können.
 * Abhängigkeiten: chessops, schach/ (Abtausch, Drohungen, Gabeln, Motive, Todsünden),
 * analyse/k4-warnsignale.ts (W2), analyse/stellungsprofil.ts.
 */
import { Chess, normalizeMove } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSanAndPlay } from "chessops/san";
import type { NormalMove, Piece, Role } from "chessops/types";
import { makeUci, opposite, parseUci, squareRank } from "chessops/util";
import { gefaehrlicheLinien } from "../analyse/k4-warnsignale";
import { profil } from "../analyse/stellungsprofil";
import { abtausch } from "../schach/abtausch";
import {
  drohungenVon,
  legaleZuege,
  schlaege,
  sofortigeGewinne,
  type Drohung,
  type Schlagzug,
} from "../schach/drohungen";
import { gabelfelder } from "../schach/gabeln";
import { FIGURENWERT, type Stellung } from "../schach/stellung";
import { erkenneMotive, type Motiv } from "../schach/taktikmotive";
import { leichtfigurenZuHause } from "../schach/todsuenden";

export type Fehlerart =
  | "figurHaengen"
  | "schlagreflex"
  | "verfruehteDame"
  | "koenigMitte"
  | "taktikUebersehen"
  | "drohungIgnoriert"
  | "ungenau";

/** Faustwerte aus Kapitel 1. */
const LEICHTFIGUR = 3;
const DAME = 9;
/** Ab so viel Verlust (Engine) gilt ein Schlag als Schlagreflex statt als Abtausch. */
const SCHLAG_VERLUST = 1;
/** Ab diesem Abtauschergebnis des Gegners gilt eine Figur als verloren (mehr als ein Bauer). */
const VERLOREN_AB = 2;
/** Eine Drohung zählt ab einem Bauern Gewinn (Kapitel 1: „Material gewinnen“). */
const DROHUNG_AB = 1;
/** Ein Damenopfer: Die Dame geht für höchstens eine Leichtfigur verloren. */
const DAMENOPFER_AB = DAME - LEICHTFIGUR;
/** Wert einer Mattdrohung beim Vergleich mit Materialdrohungen. */
const MATTDROHUNG = 1000;
/** Leichtfiguren zu Hause, ab denen ein Damenzug „verfrüht“ ist (wie k1-todsuenden). */
const ZU_HAUSE_DAME = 2;
/** Ab diesem Zug gilt eine ausgelassene mögliche Rochade als „König in der Mitte“. */
const ROCHADE_SPAETESTENS = 10;
const DAMENLINIE = 3;
const GRUNDREIHE = { white: 0, black: 7 } as const;
const AUF_REIHE = 8;
const LETZTE_REIHEN = new Set([0, 7]);
/** Linien des Königs nach der kurzen (g) und der langen (c) Rochade, in UCI der Engine. */
const KOENIG_KURZ = 6;
const KOENIG_LANG = 2;
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

/** Die Lage vor dem Zug, einmal je Stellung berechnet, damit viele Züge schnell geprüft sind. */
export interface Lage {
  readonly regeln: Chess;
  /** Drohungen des Gegners, als wäre er am Zug (leer, wenn die Seite am Zug im Schach steht). */
  readonly drohungen: readonly Drohung[];
  /** Alle Schläge der Seite am Zug mit ihrer Abtauschbilanz. */
  readonly schlaege: readonly Schlagzug[];
  /** Schlüssel der Gabelfelder des Gegners (W6) vor dem Zug. */
  readonly gabeln: ReadonlySet<string>;
  /** Schlüssel der gefährlichen Linien (W2) gegen die Seite am Zug vor dem Zug. */
  readonly linien: ReadonlySet<string>;
}

/** Ein geprüfter Zug: der Zug, die Stellung danach und was er schlägt. */
interface Zugprobe {
  readonly zug: NormalMove;
  readonly figur: Piece;
  readonly danach: Chess;
  readonly geschlagen: Role | null;
}

function stellungVon(regeln: Chess): Stellung {
  return { fen: makeFen(regeln.toSetup()), brett: regeln.board, amZug: regeln.turn, regeln };
}

/** Gabelfelder einer Farbe als Schlüssel (Figur, Feld, Ziele). */
function gabelschluessel(stellung: Stellung, farbe: Piece["color"]): Set<string> {
  const karte = profil(stellung).angriffskarte;
  return new Set(
    gabelfelder(stellung, karte, farbe).map(
      (g) => `${g.figur.feld}-${g.feld}:${[...g.ziele].sort((a, b) => a - b).join(",")}`,
    ),
  );
}

/** Gefährliche Linien gegen eine Farbe als Schlüssel (Art, Langschrittfigur, hintere Figur). */
function linienschluessel(stellung: Stellung, farbe: Piece["color"]): Set<string> {
  return new Set(
    gefaehrlicheLinien(profil(stellung), farbe).map(
      (l) => `${l.art}:${l.von.feld}-${l.hinten.feld}`,
    ),
  );
}

/**
 * Die Lage vor dem Zug; null bei unlesbarer oder regelwidriger Stellung.
 *
 * Beispiel: Abb. 1.13 nach 2. Dh5 (Schwarz am Zug): Weiß droht Dxe5+ (ein Bauer).
 */
export function lageVon(fen: string): Lage | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr) return null;
  const regeln = pos.value;
  const stellung = stellungVon(regeln);
  const feind = opposite(regeln.turn);
  const imSchach = regeln.isCheck();
  return {
    regeln,
    drohungen: drohungenVon(regeln, feind) ?? [],
    schlaege: schlaege(regeln),
    gabeln: imSchach ? new Set() : gabelschluessel(stellung, feind),
    linien: linienschluessel(stellung, regeln.turn),
  };
}

/** Was der Zug schlägt (auch en passant), sonst null. */
function geschlageneRolle(regeln: Chess, zug: NormalMove): Role | null {
  const opfer = regeln.board.get(zug.to);
  if (opfer && opfer.color !== regeln.turn) return opfer.role;
  const bauer = regeln.board.get(zug.from);
  return bauer?.role === "pawn" && zug.to === regeln.epSquare ? "pawn" : null;
}

/** Spielt einen Zug (UCI, Rochade wie die Engine sie schreibt) probeweise; null, wenn er nicht geht. */
function probe(lage: Lage, uci: string): Zugprobe | null {
  const roh = parseUci(uci);
  if (!roh || !("from" in roh)) return null;
  const zug = normalizeMove(lage.regeln, roh);
  if (!("from" in zug) || !lage.regeln.isLegal(zug)) return null;
  const figur = lage.regeln.board.get(zug.from);
  if (!figur) return null;
  const danach = lage.regeln.clone();
  danach.play(zug);
  return { zug, figur, danach, geschlagen: geschlageneRolle(lage.regeln, zug) };
}

/**
 * Ein legaler Zug in der UCI-Schreibweise der Engine: Rochade als Königszug um zwei Felder
 * (chessops schreibt „König auf Turm“), Umwandlung immer in die Dame.
 */
export function engineUci(regeln: Chess, zug: NormalMove): string {
  const figur = regeln.board.get(zug.from);
  if (figur?.role === "king" && regeln.board[regeln.turn].has(zug.to)) {
    const reihe = zug.from - (zug.from % AUF_REIHE);
    return makeUci({ from: zug.from, to: reihe + (zug.to > zug.from ? KOENIG_KURZ : KOENIG_LANG) });
  }
  if (figur?.role === "pawn" && LETZTE_REIHEN.has(squareRank(zug.to))) {
    return makeUci({ ...zug, promotion: "queen" });
  }
  return makeUci(zug);
}

/** Alle legalen Züge der Seite am Zug in der UCI-Schreibweise der Engine. */
export function alleZuege(lage: Lage): string[] {
  return legaleZuege(lage.regeln).map((zug) => engineUci(lage.regeln, zug));
}

/**
 * Wert der Drohung, die der Zug stehen lässt (Matt, sonst Bauerneinheiten); 0, wenn keine.
 *
 * Regel: Kapitel 1, Röntgen-Frage 3 („Was droht mein Gegner?“): Eine Drohung von vorher gilt
 * noch, wenn der Gegner nach dem Zug denselben Schlag mit Gewinn oder ein Matt in einem Zug hat.
 * Gibt der Zug Schach, muss der Gegner erst darauf antworten; dann zählt nichts.
 */
function stehengelasseneDrohung(lage: Lage, p: Zugprobe): number {
  if (lage.drohungen.length === 0 || p.danach.isCheck()) return 0;
  const danach = sofortigeGewinne(p.danach);
  let wert = 0;
  for (const alt of lage.drohungen) {
    if (alt.art === "matt") {
      if (danach.some((d) => d.art === "matt")) wert = Math.max(wert, MATTDROHUNG);
      continue;
    }
    if (alt.zug.bilanz < DROHUNG_AB) continue;
    for (const neu of danach) {
      const gleich =
        neu.art === "material" &&
        neu.zug.nach === alt.zug.nach &&
        neu.zug.geschlagen === alt.zug.geschlagen &&
        neu.zug.bilanz >= DROHUNG_AB;
      if (gleich) wert = Math.max(wert, neu.zug.bilanz);
    }
  }
  return wert;
}

/**
 * Größter Abtauschgewinn des Gegners an einer eigenen Figur (ab Leichtfigur), die erst durch
 * den Zug verloren geht; 0, wenn keine. Regel: Kapitel 4, W1, mit der Abtauschrechnung aus
 * Kapitel 1 (Fesselungen bleiben wie im Buch unberücksichtigt).
 */
function neuVerlorene(lage: Lage, p: Zugprobe): number {
  if (p.danach.isCheck()) return 0;
  const eigen = opposite(p.danach.turn);
  let wert = 0;
  for (const feld of p.danach.board[eigen]) {
    const figur = p.danach.board.get(feld);
    if (!figur || figur.role === "king" || FIGURENWERT[figur.role] < LEICHTFIGUR) continue;
    const jetzt = abtausch(p.danach.board, feld);
    if (!jetzt || jetzt.bilanz < VERLOREN_AB) continue;
    const vorher = abtausch(lage.regeln.board, feld === p.zug.to ? p.zug.from : feld);
    if (vorher && vorher.bilanz >= VERLOREN_AB) continue;
    wert = Math.max(wert, jetzt.bilanz);
  }
  return wert;
}

/** Schlagreflex (W5): ein Schlag mit negativer Abtauschbilanz oder laut Engine mit Verlust. */
function istSchlagreflex(lage: Lage, p: Zugprobe, verlust: number | null): boolean {
  if (p.geschlagen === null) return false;
  if (verlust !== null && verlust >= SCHLAG_VERLUST) return true;
  const schlag = lage.schlaege.find((s) => s.von === p.zug.from && s.nach === p.zug.to);
  return schlag !== undefined && schlag.bilanz < 0;
}

/** Ist die Antwort der Engine ein Motiv aus Kapitel 7 (Gabel, Fesselung, Spieß, Abzug, Doppelschach)? */
function antwortIstMotiv(danach: Chess, antwort: readonly string[]): boolean {
  if (antwort.length === 0) return false;
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
  return befund?.motive.some((m) => TAKTIKMOTIVE.has(m)) ?? false;
}

/**
 * Taktik übersehen (Kapitel 7): Nach dem Zug hat der Gegner eine neue Gabel (W6) oder eine neue
 * gefährliche Linie (W2) gegen die ziehende Seite, oder seine Antwort ist ein Motiv.
 */
function istTaktikUebersehen(lage: Lage, p: Zugprobe, antwort: readonly string[]): boolean {
  if (p.danach.isCheck()) return false;
  if (!lage.regeln.isCheck()) {
    const stellung = stellungVon(p.danach);
    const feind = p.danach.turn;
    if ([...gabelschluessel(stellung, feind)].some((k) => !lage.gabeln.has(k))) return true;
    const linien = linienschluessel(stellung, opposite(feind));
    if ([...linien].some((k) => !lage.linien.has(k))) return true;
  }
  return antwortIstMotiv(p.danach, antwort);
}

/** Verfrühte Dame (Kapitel 1): vom Startfeld ohne Schlag, zwei Leichtfiguren noch zu Hause. */
function istVerfruehteDame(lage: Lage, p: Zugprobe): boolean {
  const startfeld = GRUNDREIHE[lage.regeln.turn] * AUF_REIHE + DAMENLINIE;
  return (
    p.figur.role === "queen" &&
    p.zug.from === startfeld &&
    p.geschlagen === null &&
    leichtfigurenZuHause(lage.regeln.board, lage.regeln.turn) >= ZU_HAUSE_DAME
  );
}

/** Kann die Seite am Zug jetzt rochieren (ein Königszug auf den eigenen Turm)? */
function kannRochieren(regeln: Chess): boolean {
  const koenig = regeln.board.kingOf(regeln.turn);
  if (koenig === undefined) return false;
  for (const ziel of regeln.dests(koenig)) {
    const figur = regeln.board.get(ziel);
    if (figur?.role === "rook" && figur.color === regeln.turn) return true;
  }
  return false;
}

/** König in der Mitte (Kapitel 1): ab Zug 10 eine mögliche Rochade ausgelassen. */
function istKoenigMitte(lage: Lage, p: Zugprobe): boolean {
  return (
    lage.regeln.fullmoves >= ROCHADE_SPAETESTENS &&
    p.figur.role !== "king" &&
    kannRochieren(lage.regeln)
  );
}

/**
 * Ordnet einem Zug seine Fehlerart zu.
 *
 * Eingaben: Lage vor dem Zug, Zug in UCI, die Antwort der Engine (UCI, darf leer sein) und
 * der Verlust des Zuges gegenüber dem besten in Bauerneinheiten (null, wenn noch unbekannt).
 * Ausgabe: Fehlerart, „ungenau“, wenn keine Regel passt oder der Zug nicht geht.
 * Reihenfolge: Eine Mattdrohung oder eine Drohung ab Leichtfigur, die stehen bleibt, zuerst;
 * dann Schlagreflex, Figur hängen lassen, kleinere Drohungen, Taktik, Dame, König.
 * Beispiel: Abb. 1.13 nach 2. Dh5: 2... Sf6?? lässt Dxe5+ zu → „drohungIgnoriert“.
 */
export function fehlerartIn(
  lage: Lage,
  uci: string,
  antwort: readonly string[],
  verlust: number | null,
): Fehlerart {
  const p = probe(lage, uci);
  if (!p) return "ungenau";
  const drohung = stehengelasseneDrohung(lage, p);
  const haengt = neuVerlorene(lage, p);
  if (drohung >= MATTDROHUNG || (drohung >= LEICHTFIGUR && drohung >= haengt)) {
    return "drohungIgnoriert";
  }
  if (istSchlagreflex(lage, p, verlust)) return "schlagreflex";
  if (haengt > 0) return "figurHaengen";
  if (drohung > 0) return "drohungIgnoriert";
  if (istTaktikUebersehen(lage, p, antwort)) return "taktikUebersehen";
  if (istVerfruehteDame(lage, p)) return "verfruehteDame";
  if (istKoenigMitte(lage, p)) return "koenigMitte";
  return "ungenau";
}

/**
 * Ordnet einem Fehlerzug seine Art zu (Kurzform für eine einzelne Variante der Engine).
 *
 * Eingaben: Stellung vor dem Zug, Variante der Engine (Zug und Antwort in UCI), Verlust des Zuges
 * gegenüber dem besten in Bauerneinheiten. Ausgabe: Fehlerart, „ungenau“, wenn keine Regel passt.
 * Beispiel: Abb. 1.8, 3... Df6 mit Springern und Läufern zu Hause → „verfruehteDame“.
 * Sonderfall: Ein unlesbarer Zug ergibt „ungenau“.
 */
export function fehlerartVon(fen: string, zuege: readonly string[], verlust: number): Fehlerart {
  const lage = lageVon(fen);
  const uci = zuege[0];
  if (!lage || !uci) return "ungenau";
  return fehlerartIn(lage, uci, zuege.slice(1), verlust);
}

/**
 * Gibt der Zug die Dame grundlos her? Konzept 8.2: „Ein grundloses Damenopfer gibt es ab Stufe 2
 * nicht.“ Regel: Nach dem Zug gewinnt der Gegner laut Abtauschrechnung (Kapitel 1) auf dem Feld
 * einer eigenen Dame mindestens Dame gegen Leichtfigur. Beispiel: Abb. 1.13, 2. Dh5 Sc6 3. Dxe5+??
 * Sxe5 → ja. Ein Opfer, das die Engine für gut hält, kommt in der Fehlersuche ohnehin nicht vor
 * (Mindestverlust).
 */
export function istDamenopfer(lage: Lage, uci: string): boolean {
  const p = probe(lage, uci);
  if (!p) return false;
  for (const feld of p.danach.board.pieces(opposite(p.danach.turn), "queen")) {
    const a = abtausch(p.danach.board, feld);
    if (a && a.bilanz >= DAMENOPFER_AB) return true;
  }
  return false;
}
