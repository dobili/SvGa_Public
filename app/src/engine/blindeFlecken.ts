/**
 * Blinde Flecken eines Gegners: Zugarten, die er „nicht sieht“ (Wunsch des Autors, 17.10.2026,
 * Version 0.2.46, Recherche in docs/ENTSCHEIDUNGEN.md „Vormerkung: Bots mit Persönlichkeit“).
 *
 * Rolle im Gesamtbild: Menschen übersehen bestimmte Züge systematisch: Rückzüge (Christiansen–
 * Karpow), lange Läuferdiagonalen aus der Ecke, Springerzüge rückwärts, lange Damenzüge,
 * seitliche Turmzüge, ruhige Züge, wenn ein Schlag möglich wäre, Abzüge und stille Bauernzüge.
 * Ein Gegner mit einem blinden Fleck spielt, wenn der beste Zug der Engine von dieser Art ist,
 * mit einer Wahrscheinlichkeit den nächstbesten Zug anderer Art (engine/zugwahl.ts), begrenzt
 * auf den Verlust einer Leichtfigur; das Protokoll nennt den blinden Fleck für die Auswertung
 * („einen Rückzug nicht gesehen“). Anders als die Fehlerarten (Stufe 1 bis 4) wirken blinde
 * Flecken in jeder Stufe; so bekommen auch starke Gegner eine Persönlichkeit.
 * Abhängigkeiten: chessops, engine/spielbewerter.ts (wertFuer), engine/uci.ts (Variante).
 */
import { attacks } from "chessops/attacks";
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Color, Role, Square } from "chessops/types";
import { opposite, parseUci, squareFile, squareRank } from "chessops/util";
import type { Fehlerart } from "./fehlerart";
import { wertFuer } from "./spielbewerter";
import type { Variante } from "./uci";

export type BlinderFleck =
  "rueckzug" | "diagonale" | "springer" | "dame" | "turm" | "ruhig" | "abzug" | "bauer";

export const BLINDE_FLECKEN: readonly BlinderFleck[] = [
  "rueckzug",
  "diagonale",
  "springer",
  "dame",
  "turm",
  "ruhig",
  "abzug",
  "bauer",
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
/** Ab so vielen Feldern gilt eine Läuferdiagonale als lang. */
const LANGE_DIAGONALE = 4;
/** Ab so vielen Feldern (Königsabstand) gilt ein Damenzug als lang. */
const LANGER_DAMENZUG = 4;
/** Ab so vielen Feldern gilt ein Turmzug entlang der Reihe als seitlich. */
const SEITLICHER_TURMZUG = 3;
/** Figuren, deren neuer Angriff nach dem Zug einen Abzug anzeigt. */
const ABZUGSZIELE: ReadonlySet<Role> = new Set<Role>(["king", "queen", "rook"]);
const LANGSCHRITTLER: ReadonlySet<Role> = new Set<Role>(["queen", "rook", "bishop"]);

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
    schlag: pos.board.get(zug.to) !== undefined,
    umwandlung: zug.promotion !== undefined,
  };
}

/** Geht der Zug Richtung eigene Grundreihe? */
function rueckwaerts(z: Zugbild): boolean {
  const dr = squareRank(z.nach) - squareRank(z.von);
  return z.farbe === "white" ? dr < 0 : dr > 0;
}

/** Hat die Seite am Zug irgendeinen Schlag zur Auswahl? */
function schlagMoeglich(pos: Chess): boolean {
  for (const [von, ziele] of pos.allDests()) {
    for (const ziel of ziele) {
      if (pos.board.get(ziel) !== undefined && pos.board.get(von)?.color === pos.turn) return true;
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

/**
 * Übersieht der Gegner den besten Zug? Dann der nächstbeste Zug, der zu keinem seiner blinden
 * Flecken gehört und höchstens eine Leichtfigur kostet; sonst null (er spielt den besten Zug).
 * Eingaben: Stellung, Kandidaten der Engine (beste zuerst), blinde Flecken, Zufall (für Tests
 * fest). Beispiel: bester Zug Lh1–a8 (lange Diagonale), Gegner blind dafür, Wurf 0,2 → der
 * zweitbeste Zug mit „blindDiagonale“ und seinem Verlust.
 */
export function blindeWahl(
  fen: string,
  varianten: readonly Variante[],
  flecke: readonly BlinderFleck[],
  zufall: () => number,
): { uci: string; fehler: Fehlerart; verlust: number } | null {
  const beste = varianten[0];
  const bester = beste?.zuege[0];
  if (!beste || !bester) return null;
  const fleck = uebersehenerFleck(fen, bester, flecke);
  if (!fleck || zufall() >= BLINDHEIT) return null;
  const weissAmZug = fen.split(" ")[1] !== "b";
  const bestwert = wertFuer(beste.wert, weissAmZug);
  for (const v of varianten.slice(1)) {
    const uci = v.zuege[0];
    if (!uci || uebersehenerFleck(fen, uci, flecke)) continue;
    const verlust = bestwert - wertFuer(v.wert, weissAmZug);
    if (verlust > BLIND_HOECHSTVERLUST) return null;
    return { uci, fehler: blindeFehlerart(fleck), verlust: Math.max(0, verlust) };
  }
  return null;
}
