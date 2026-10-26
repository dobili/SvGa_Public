/**
 * Blinde Flecken eines Gegners: Zugarten, die er „nicht sieht“ (Wunsch des Autors, 17.10.2026,
 * Recherche in docs/ENTSCHEIDUNGEN.md „Vormerkung: Bots mit Persönlichkeit“).
 *
 * Rolle im Gesamtbild: Menschen übersehen bestimmte Züge systematisch: Rückzüge (Christiansen–
 * Karpow), lange Läuferdiagonalen aus der Ecke, Springerzüge rückwärts, lange Damenzüge,
 * seitliche Turmzüge, ruhige Züge, wenn ein Schlag möglich wäre, Abzüge und stille Bauernzüge.
 * Ein Gegner mit einem blinden Fleck spielt, wenn der beste Zug der Engine von dieser Art ist,
 * mit einer Wahrscheinlichkeit den nächstbesten Zug anderer Art (engine/zugwahl.ts), begrenzt
 * auf den Verlust einer Leichtfigur; das Protokoll nennt den blinden Fleck für die Auswertung
 * („einen Rückzug nicht gesehen“). Anders als die Fehlerarten (Stufe 1 bis 4) wirken blinde
 * Flecken in jeder Stufe; so bekommen auch starke Gegner eine Persönlichkeit.
 * Dazu Röntgen, Zwischenzug und Grundreihe, und die Blindheit gilt auch
 * gegenüber gegnerischen Zügen dieser Art: Ein Gegner, der Abzüge nicht sieht, tappt in einen
 * Zug, dessen Widerlegung ein Abzug ist (`blindeWahl`, zweiter Teil).
 * Abhängigkeiten: chessops, engine/spielbewerter.ts (wertFuer), engine/uci.ts (Variante),
 * engine/fehlerart-typen.ts (BlinderFleck und Fehlerart; BlinderFleck wird hier weitergereicht).
 */
import { attacks, rookAttacks, bishopAttacks, queenAttacks } from "chessops/attacks";
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import type { Color, Role, Square } from "chessops/types";
import { opposite, parseUci, squareFile, squareRank } from "chessops/util";
import type { BlinderFleck, Fehlerart } from "./fehlerart-typen";
import { wertFuer } from "./spielbewerter";
import type { Variante } from "./uci";

export type { BlinderFleck } from "./fehlerart-typen";

/** Alle blinden Flecken, die ein Bot haben kann. */
export const BLINDE_FLECKEN: readonly BlinderFleck[] = [
  "rueckzug",
  "diagonale",
  "springer",
  "dame",
  "turm",
  "ruhig",
  "abzug",
  "bauer",
  "roentgen",
  "zwischenzug",
  "grundreihe",
];

/** Die Fehlerart im Protokoll zu einem blinden Fleck („blindRueckzug“). */
export function blindeFehlerart(fleck: BlinderFleck): Fehlerart {
  return `blind${fleck.charAt(0).toUpperCase()}${fleck.slice(1)}` as Fehlerart;
}

/** Alle Fehlerarten der blinden Flecken, für Speicher und Oberfläche. */
export const BLINDE_FEHLERARTEN: readonly Fehlerart[] = BLINDE_FLECKEN.map(blindeFehlerart);

/** So oft übersieht ein Gegner einen Zug seiner blinden Art. */
export const BLINDHEIT = 0.7;
/** Höchstens so viel darf das Übersehen kosten (eine Leichtfigur), damit die Stufe hält. */
export const BLIND_HOECHSTVERLUST = 3;
/**
 * Flecken, die als gegnerische Drohung nicht zählen: Fast jede Widerlegung ist ein ruhiger Zug
 * oder ein stiller Bauernzug; zählten sie, tappte ein Gegner in jede zweite Falle (Messung
 * 0.2.57: Lena auf Stufe 5 verlor 1,5:8,5 gegen Stufe 5 ohne Flecken).
 */
const KEINE_DROHUNGSFLECKEN: ReadonlySet<BlinderFleck> = new Set<BlinderFleck>(["ruhig", "bauer"]);
/** Ab so vielen Feldern gilt eine Läuferdiagonale als lang. */
const LANGE_DIAGONALE = 4;
/** Ab so vielen Feldern (Königsabstand) gilt ein Damenzug als lang. */
const LANGER_DAMENZUG = 4;
/** Ab so vielen Feldern gilt ein Turmzug entlang der Reihe als seitlich. */
const SEITLICHER_TURMZUG = 3;
/** Figuren, deren neuer Angriff nach dem Zug einen Abzug anzeigt. */
const ABZUGSZIELE: ReadonlySet<Role> = new Set<Role>(["king", "queen", "rook"]);
const LANGSCHRITTLER: ReadonlySet<Role> = new Set<Role>(["queen", "rook", "bishop"]);
/** Figuren, die hinter einem Stein als Röntgenziel zählen (Kapitel 7: Fesselung, Spieß). */
const ROENTGENZIELE: ReadonlySet<Role> = new Set<Role>(["king", "queen", "rook"]);
/** Figuren, die auf der gegnerischen Grundreihe ein Grundreihenmotiv anzeigen (Kapitel 7). */
const GRUNDREIHENFIGUREN: ReadonlySet<Role> = new Set<Role>(["queen", "rook"]);
const ERSTE_REIHE = 0;
const LETZTE_REIHE = 7;

interface Zugbild {
  readonly pos: Chess;
  readonly danach: Chess;
  readonly farbe: Color;
  readonly rolle: Role;
  readonly von: Square;
  readonly nach: Square;
  readonly schlag: boolean;
  readonly umwandlung: boolean;
}

/** Zerlegt Stellung und Zug; null bei unlesbarer Stellung oder ungültigem Zug. */
function zugbild(fen: string, uci: string): Zugbild | null {
  const setup = parseFen(fen);
  const zug = parseUci(uci);
  if (setup.isErr || !zug || !("from" in zug)) return null;
  const regeln = Chess.fromSetup(setup.value);
  if (regeln.isErr) return null;
  const pos = regeln.value;
  const figur = pos.board.get(zug.from);
  if (!figur || !pos.isLegal(zug)) return null;
  const danach = pos.clone();
  danach.play(zug);
  return {
    pos,
    danach,
    farbe: pos.turn,
    rolle: figur.role,
    von: zug.from,
    nach: zug.to,
    schlag: istSchlag(pos, zug.from, zug.to),
    umwandlung: zug.promotion !== undefined,
  };
}

/** Geht der Zug Richtung eigene Grundreihe? */
function rueckwaerts(z: Zugbild): boolean {
  const dr = squareRank(z.nach) - squareRank(z.von);
  return z.farbe === "white" ? dr < 0 : dr > 0;
}

/**
 * Schlägt der Zug eine gegnerische Figur (auch en passant)? Seit 0.2.118: Die Rochade, in chessops
 * als König auf den eigenen Turm geschrieben, ist kein Schlag (vorher galt jede Stellung mit
 * Rochaderecht als „Schlag möglich“ und jeder Zug darin als ruhig).
 */
function istSchlag(pos: Chess, von: Square, nach: Square): boolean {
  const opfer = pos.board.get(nach);
  if (opfer) return opfer.color !== pos.turn;
  return pos.board.get(von)?.role === "pawn" && nach === pos.epSquare;
}

/** Hat die Seite am Zug irgendeinen Schlag zur Auswahl? */
function schlagMoeglich(pos: Chess): boolean {
  for (const [von, ziele] of pos.allDests()) {
    for (const ziel of ziele) {
      if (istSchlag(pos, von, ziel)) return true;
    }
  }
  return false;
}

/** Greift nach dem Zug eine andere eigene Langschrittfigur ein wichtiges Ziel neu an (Abzug)? */
function istAbzug(z: Zugbild): boolean {
  const gegner = opposite(z.farbe);
  for (const feld of z.pos.board[z.farbe]) {
    const figur = z.pos.board.get(feld);
    if (feld === z.von || !figur || !LANGSCHRITTLER.has(figur.role)) continue;
    const vorher = attacks(figur, feld, z.pos.board.occupied);
    const nachher = attacks(figur, feld, z.danach.board.occupied);
    for (const ziel of nachher.diff(vorher)) {
      const getroffen = z.danach.board.get(ziel);
      if (getroffen?.color === gegner && ABZUGSZIELE.has(getroffen.role)) return true;
    }
  }
  return false;
}

/** Angriffsfelder einer Langschrittfigur auf einem Brett mit der gegebenen Belegung. */
function strahlen(rolle: Role, feld: Square, belegt: Chess["board"]["occupied"]) {
  if (rolle === "rook") return rookAttacks(feld, belegt);
  if (rolle === "bishop") return bishopAttacks(feld, belegt);
  return queenAttacks(feld, belegt);
}

/**
 * Röntgen (Kapitel 7, Fesselung und Spieß): Die gezogene Langschrittfigur zielt durch den ersten
 * Stein auf ihrer Linie hindurch auf König, Dame oder Turm des Gegners.
 */
function istRoentgen(z: Zugbild): boolean {
  if (!LANGSCHRITTLER.has(z.rolle)) return false;
  const gegner = opposite(z.farbe);
  const brett = z.danach.board;
  const erste = strahlen(z.rolle, z.nach, brett.occupied);
  for (const block of erste) {
    if (!brett.get(block)) continue;
    const ohneBlock = brett.occupied.without(block);
    for (const ziel of strahlen(z.rolle, z.nach, ohneBlock).diff(erste)) {
      const figur = brett.get(ziel);
      if (figur?.color === gegner && ROENTGENZIELE.has(figur.role)) return true;
    }
  }
  return false;
}

/** Hängt eine eigene Figur (ab Leichtfigur) im Angriff des Gegners? */
function eigeneFigurAngegriffen(pos: Chess, farbe: Color, ausser: Square): boolean {
  for (const feld of pos.board[farbe]) {
    const figur = pos.board.get(feld);
    if (feld === ausser || !figur || figur.role === "pawn" || figur.role === "king") continue;
    if (attackersAuf(pos, feld, opposite(farbe))) return true;
  }
  return false;
}

/** Greift die Seite `von` das Feld an? */
function attackersAuf(pos: Chess, feld: Square, von: Color): boolean {
  for (const angreifer of pos.board[von]) {
    const figur = pos.board.get(angreifer);
    if (figur && attacks(figur, angreifer, pos.board.occupied).has(feld)) return true;
  }
  return false;
}

/**
 * Zwischenzug (Kapitel 7): Eine eigene Figur ist angegriffen, und statt sie zu retten gibt der
 * Zug mit einer anderen Figur Schach.
 */
function istZwischenzug(z: Zugbild): boolean {
  return z.danach.isCheck() && !z.schlag && eigeneFigurAngegriffen(z.pos, z.farbe, z.von);
}

/** Grundreihe (Kapitel 7): Dame oder Turm geht mit Schach auf die Grundreihe des Gegners. */
function istGrundreihe(z: Zugbild): boolean {
  const grundreihe = z.farbe === "white" ? LETZTE_REIHE : ERSTE_REIHE;
  return GRUNDREIHENFIGUREN.has(z.rolle) && squareRank(z.nach) === grundreihe && z.danach.isCheck();
}

/** Die Stellung nach einem Zug (UCI) als FEN; null, wenn der Zug nicht geht. */
export function fenNachUci(fen: string, uci: string): string | null {
  const z = zugbild(fen, uci);
  return z ? makeFen(z.danach.toSetup()) : null;
}

/**
 * Die blinden Flecken, zu denen ein Zug gehört (leer: ein Zug, den jeder sieht).
 * Beispiel: Grundstellung, „g1f3“ → []; Dame von d1 nach h5 → ["dame"]; ein Läufer von a1 nach
 * h8 → ["diagonale"]; ein Springer von f3 zurück nach g1 → ["springer", "rueckzug"].
 */
export function fleckeVon(fen: string, uci: string): BlinderFleck[] {
  const z = zugbild(fen, uci);
  if (!z) return [];
  const df = Math.abs(squareFile(z.nach) - squareFile(z.von));
  const dr = Math.abs(squareRank(z.nach) - squareRank(z.von));
  const schach = z.danach.isCheck();
  const flecke: BlinderFleck[] = [];
  if (z.rolle !== "pawn" && z.rolle !== "king" && !z.schlag && rueckwaerts(z)) {
    flecke.push("rueckzug");
  }
  if (z.rolle === "bishop" && df === dr && df >= LANGE_DIAGONALE) flecke.push("diagonale");
  if (z.rolle === "knight" && rueckwaerts(z)) flecke.push("springer");
  if (z.rolle === "queen" && Math.max(df, dr) >= LANGER_DAMENZUG) flecke.push("dame");
  if (z.rolle === "rook" && dr === 0 && df >= SEITLICHER_TURMZUG) flecke.push("turm");
  if (!z.schlag && !schach && schlagMoeglich(z.pos)) flecke.push("ruhig");
  if (istAbzug(z)) flecke.push("abzug");
  if (z.rolle === "pawn" && !z.schlag && !schach && !z.umwandlung) flecke.push("bauer");
  if (istRoentgen(z)) flecke.push("roentgen");
  if (istZwischenzug(z)) flecke.push("zwischenzug");
  if (istGrundreihe(z)) flecke.push("grundreihe");
  return flecke;
}

/** Der erste blinde Fleck des Gegners, zu dem der Zug gehört, sonst null. */
export function uebersehenerFleck(
  fen: string,
  uci: string,
  flecke: readonly BlinderFleck[],
): BlinderFleck | null {
  if (flecke.length === 0) return null;
  const arten = fleckeVon(fen, uci);
  return flecke.find((f) => arten.includes(f)) ?? null;
}

/** Ein übersehener Zug mit der Art des Flecks und dem Verlust gegenüber dem besten Zug. */
export interface Blindzug {
  readonly uci: string;
  readonly fehler: Fehlerart;
  readonly verlust: number;
}

/** Übersieht der Gegner seinen besten Zug: der nächstbeste anderer Art, höchstens eine Leichtfigur. */
function eigenenZugUebersehen(
  fen: string,
  varianten: readonly Variante[],
  flecke: readonly BlinderFleck[],
  bestwert: number,
  weissAmZug: boolean,
): Blindzug | null {
  const bester = varianten[0]?.zuege[0];
  const fleck = bester ? uebersehenerFleck(fen, bester, flecke) : null;
  if (!fleck) return null;
  for (const v of varianten.slice(1)) {
    const uci = v.zuege[0];
    if (!uci || uebersehenerFleck(fen, uci, flecke)) continue;
    const verlust = bestwert - wertFuer(v.wert, weissAmZug);
    if (verlust > BLIND_HOECHSTVERLUST) return null;
    return { uci, fehler: blindeFehlerart(fleck), verlust: Math.max(0, verlust) };
  }
  return null;
}

/**
 * Übersieht der Gegner die Widerlegung eines Kandidaten? Der erste Kandidat nach dem
 * besten, dessen Antwort der Engine zu einem blinden Fleck gehört und der höchstens eine
 * Leichtfigur kostet: Der Gegner hält ihn für gut, weil er die Antwort nicht sieht.
 */
function drohungUebersehen(
  fen: string,
  varianten: readonly Variante[],
  flecke: readonly BlinderFleck[],
  bestwert: number,
  weissAmZug: boolean,
): Blindzug | null {
  const drohungsflecken = flecke.filter((f) => !KEINE_DROHUNGSFLECKEN.has(f));
  if (drohungsflecken.length === 0) return null;
  for (const v of varianten.slice(1)) {
    const [uci, antwort] = v.zuege;
    if (!uci || !antwort) continue;
    const danach = fenNachUci(fen, uci);
    const fleck = danach ? uebersehenerFleck(danach, antwort, drohungsflecken) : null;
    if (!fleck) continue;
    const verlust = bestwert - wertFuer(v.wert, weissAmZug);
    if (verlust > BLIND_HOECHSTVERLUST) continue;
    return { uci, fehler: blindeFehlerart(fleck), verlust: Math.max(0, verlust) };
  }
  return null;
}

/**
 * Übersieht der Gegner den besten Zug oder die Widerlegung eines anderen Kandidaten? Dann dieser
 * andere Zug mit dem blinden Fleck und seinem Verlust (höchstens eine Leichtfigur); sonst null
 * (er spielt den besten Zug). Der Wurf gegen BLINDHEIT fällt einmal je Stellung.
 * Eingaben: Stellung, Kandidaten der Engine mit ihren Varianten (beste zuerst), blinde Flecken,
 * Zufall (für Tests fest). Beispiel: bester Zug Lh1–a8 (lange Diagonale), Gegner blind dafür,
 * Wurf 0,2 → der zweitbeste Zug mit „blindDiagonale“; oder bester Zug Kf1, Kandidat Th7 mit der
 * Antwort La8–e4 (lange Diagonale), Gegner blind dafür → Th7 mit „blindDiagonale“.
 */
export function blindeWahl(
  fen: string,
  varianten: readonly Variante[],
  flecke: readonly BlinderFleck[],
  zufall: () => number,
): Blindzug | null {
  const beste = varianten[0];
  if (!beste || flecke.length === 0 || zufall() >= BLINDHEIT) return null;
  const weissAmZug = fen.split(" ")[1] !== "b";
  const bestwert = wertFuer(beste.wert, weissAmZug);
  return (
    eigenenZugUebersehen(fen, varianten, flecke, bestwert, weissAmZug) ??
    drohungUebersehen(fen, varianten, flecke, bestwert, weissAmZug)
  );
}
