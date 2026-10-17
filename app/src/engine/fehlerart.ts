/**
 * Welchen typischen Anfängerfehler ein Zug darstellt (Konzept 8.2, Tabelle „Fehlerarten“).
 *
 * Seit 0.2.39 liefert fehlerbefundIn zu jeder Art auch die Einzelheiten (welche Drohung, welche
 * Figur hängt, welche Gabel oder Linie), damit der Rückblick nach der Partie sie am Brett zeigen
 * kann (spiel/erklaerung.ts). Die Eröffnungsregeln stehen in fehlerart-eroeffnung.ts.
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
import type { NormalMove, Piece, Role, Square } from "chessops/types";
import { opposite, parseUci } from "chessops/util";
import { gefaehrlicheLinien, type GefaehrlicheLinie } from "../analyse/k4-warnsignale";
import { profil } from "../analyse/stellungsprofil";
import { abtausch } from "../schach/abtausch";
import {
  drohungenVon,
  schlaege,
  sofortigeGewinne,
  type Drohung,
  type Schlagzug,
} from "../schach/drohungen";
import { gabelfelder, type Gabelfeld } from "../schach/gabeln";
import { FIGURENWERT, type Stellung } from "../schach/stellung";
import { erkenneMotive, type Motiv } from "../schach/taktikmotive";
import { istKoenigMitte, istVerfruehteDame } from "./fehlerart-eroeffnung";

export type Fehlerart =
  | "figurHaengen"
  | "schlagreflex"
  | "verfruehteDame"
  | "koenigMitte"
  | "taktikUebersehen"
  | "drohungIgnoriert"
  | "ungenau";

/** Die übersehene Taktik: eine neue Gabel (W6), eine neue gefährliche Linie (W2) oder ein Motiv der Antwort. */
export type Taktikbefund =
  | { readonly art: "gabel"; readonly gabel: Gabelfeld }
  | { readonly art: "linie"; readonly linie: GefaehrlicheLinie }
  | { readonly art: "motiv"; readonly motiv: Motiv };

/** Die Fehlerart mit ihren Einzelheiten für den Rückblick (0.2.39). */
export interface Fehlerbefund {
  readonly art: Fehlerart;
  /** Bei „drohungIgnoriert“: die Drohung, die stehen blieb. */
  readonly drohung: Drohung | null;
  /** Bei „figurHaengen“: das Feld der Figur, die der Zug hängen lässt. */
  readonly haengt: Square | null;
  /** Bei „taktikUebersehen“: was übersehen wurde. */
  readonly taktik: Taktikbefund | null;
}

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
export interface Zugprobe {
  readonly zug: NormalMove;
  readonly figur: Piece;
  readonly danach: Chess;
  readonly geschlagen: Role | null;
}

function stellungVon(regeln: Chess): Stellung {
  return { fen: makeFen(regeln.toSetup()), brett: regeln.board, amZug: regeln.turn, regeln };
}

/** Schlüssel eines Gabelfelds (Figur, Feld, Ziele), um Gabeln vor und nach dem Zug zu vergleichen. */
function gabelschluessel(g: Gabelfeld): string {
  return `${g.figur.feld}-${g.feld}:${[...g.ziele].sort((a, b) => a - b).join(",")}`;
}

/** Gabelfelder einer Farbe mit Schlüssel. */
function gabelnVon(stellung: Stellung, farbe: Piece["color"]): Map<string, Gabelfeld> {
  const karte = profil(stellung).angriffskarte;
  return new Map(gabelfelder(stellung, karte, farbe).map((g) => [gabelschluessel(g), g]));
}

/** Schlüssel einer gefährlichen Linie (Art, Langschrittfigur, hintere Figur). */
function linienschluessel(l: GefaehrlicheLinie): string {
  return `${l.art}:${l.von.feld}-${l.hinten.feld}`;
}

/** Gefährliche Linien gegen eine Farbe mit Schlüssel. */
function linienGegen(stellung: Stellung, farbe: Piece["color"]): Map<string, GefaehrlicheLinie> {
  return new Map(gefaehrlicheLinien(profil(stellung), farbe).map((l) => [linienschluessel(l), l]));
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
    gabeln: new Set(imSchach ? [] : gabelnVon(stellung, feind).keys()),
    linien: new Set(linienGegen(stellung, regeln.turn).keys()),
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

export { alleZuege, engineUci } from "./engineZuege";

/** Eine stehengelassene Drohung mit ihrem Wert (Matt als MATTDROHUNG, sonst Bauerneinheiten). */
interface Stehengelassen {
  readonly wert: number;
  readonly drohung: Drohung | null;
}

const NICHTS: Stehengelassen = { wert: 0, drohung: null };

/**
 * Die stärkste Drohung, die der Zug stehen lässt; Wert 0 und keine Drohung, wenn keine.
 *
 * Regel: Kapitel 1, Röntgen-Frage 3 („Was droht mein Gegner?“): Eine Drohung von vorher gilt
 * noch, wenn der Gegner nach dem Zug denselben Schlag mit Gewinn oder ein Matt in einem Zug hat.
 * Gibt der Zug Schach, muss der Gegner erst darauf antworten; dann zählt nichts.
 */
function stehengelasseneDrohung(lage: Lage, p: Zugprobe): Stehengelassen {
  if (lage.drohungen.length === 0 || p.danach.isCheck()) return NICHTS;
  const danach = sofortigeGewinne(p.danach);
  let staerkste = NICHTS;
  const merke = (wert: number, drohung: Drohung) => {
    if (wert > staerkste.wert) staerkste = { wert, drohung };
  };
  for (const alt of lage.drohungen) {
    if (alt.art === "matt") {
      const matt = danach.find((d) => d.art === "matt");
      if (matt) merke(MATTDROHUNG, matt);
      continue;
    }
    if (alt.zug.bilanz < DROHUNG_AB) continue;
    for (const neu of danach) {
      const gleich =
        neu.art === "material" &&
        neu.zug.nach === alt.zug.nach &&
        neu.zug.geschlagen === alt.zug.geschlagen &&
        neu.zug.bilanz >= DROHUNG_AB;
      if (gleich) merke(neu.zug.bilanz, neu);
    }
  }
  return staerkste;
}

/**
 * Die eigene Figur (ab Leichtfigur), die erst durch den Zug verloren geht, mit dem größten
 * Abtauschgewinn des Gegners; Wert 0 ohne Feld, wenn keine. Regel: Kapitel 4, W1, mit der
 * Abtauschrechnung aus Kapitel 1 (Fesselungen bleiben wie im Buch unberücksichtigt).
 */
function neuVerlorene(lage: Lage, p: Zugprobe): { wert: number; feld: Square | null } {
  if (p.danach.isCheck()) return { wert: 0, feld: null };
  const eigen = opposite(p.danach.turn);
  let gefunden: { wert: number; feld: Square | null } = { wert: 0, feld: null };
  for (const feld of p.danach.board[eigen]) {
    const figur = p.danach.board.get(feld);
    if (!figur || figur.role === "king" || FIGURENWERT[figur.role] < LEICHTFIGUR) continue;
    const jetzt = abtausch(p.danach.board, feld);
    if (!jetzt || jetzt.bilanz < VERLOREN_AB) continue;
    const vorher = abtausch(lage.regeln.board, feld === p.zug.to ? p.zug.from : feld);
    if (vorher && vorher.bilanz >= VERLOREN_AB) continue;
    if (jetzt.bilanz > gefunden.wert) gefunden = { wert: jetzt.bilanz, feld };
  }
  return gefunden;
}

/** Schlagreflex (W5): ein Schlag mit negativer Abtauschbilanz oder laut Engine mit Verlust. */
function istSchlagreflex(lage: Lage, p: Zugprobe, verlust: number | null): boolean {
  if (p.geschlagen === null) return false;
  if (verlust !== null && verlust >= SCHLAG_VERLUST) return true;
  const schlag = lage.schlaege.find((s) => s.von === p.zug.from && s.nach === p.zug.to);
  return schlag !== undefined && schlag.bilanz < 0;
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
 */
function uebersehneTaktik(
  lage: Lage,
  p: Zugprobe,
  antwort: readonly string[],
): Taktikbefund | null {
  if (p.danach.isCheck()) return null;
  if (!lage.regeln.isCheck()) {
    const stellung = stellungVon(p.danach);
    const feind = p.danach.turn;
    for (const [schluessel, gabel] of gabelnVon(stellung, feind)) {
      if (!lage.gabeln.has(schluessel)) return { art: "gabel", gabel };
    }
    for (const [schluessel, linie] of linienGegen(stellung, opposite(feind))) {
      if (!lage.linien.has(schluessel)) return { art: "linie", linie };
    }
  }
  const motiv = antwortmotiv(p.danach, antwort);
  return motiv ? { art: "motiv", motiv } : null;
}

const OHNE_EINZELHEITEN = { drohung: null, haengt: null, taktik: null } as const;

/**
 * Ordnet einem Zug seine Fehlerart mit Einzelheiten zu.
 *
 * Eingaben: Lage vor dem Zug, Zug in UCI, die Antwort der Engine (UCI, darf leer sein) und
 * der Verlust des Zuges gegenüber dem besten in Bauerneinheiten (null, wenn noch unbekannt).
 * Ausgabe: Befund mit Art; „ungenau“ ohne Einzelheiten, wenn keine Regel passt oder der Zug
 * nicht geht.
 * Reihenfolge: Eine Mattdrohung oder eine Drohung ab Leichtfigur, die stehen bleibt, zuerst;
 * dann Schlagreflex, Figur hängen lassen, kleinere Drohungen, Taktik, Dame, König.
 * Beispiel: Abb. 1.13 nach 2. Dh5: 2... Sf6?? lässt Dxe5+ zu → „drohungIgnoriert“ mit der
 * Drohung Dxe5+ (gewinnt den Bauern e5).
 */
export function fehlerbefundIn(
  lage: Lage,
  uci: string,
  antwort: readonly string[],
  verlust: number | null,
): Fehlerbefund {
  const p = probe(lage, uci);
  if (!p) return { art: "ungenau", ...OHNE_EINZELHEITEN };
  const drohung = stehengelasseneDrohung(lage, p);
  const haengt = neuVerlorene(lage, p);
  const ignoriert: Fehlerbefund = { art: "drohungIgnoriert", ...OHNE_EINZELHEITEN, ...drohung };
  if (drohung.wert >= MATTDROHUNG || (drohung.wert >= LEICHTFIGUR && drohung.wert >= haengt.wert)) {
    return ignoriert;
  }
  if (istSchlagreflex(lage, p, verlust)) return { art: "schlagreflex", ...OHNE_EINZELHEITEN };
  if (haengt.feld !== null)
    return { art: "figurHaengen", ...OHNE_EINZELHEITEN, haengt: haengt.feld };
  if (drohung.wert > 0) return ignoriert;
  const taktik = uebersehneTaktik(lage, p, antwort);
  if (taktik) return { art: "taktikUebersehen", ...OHNE_EINZELHEITEN, taktik };
  if (istVerfruehteDame(lage, p)) return { art: "verfruehteDame", ...OHNE_EINZELHEITEN };
  if (istKoenigMitte(lage, p)) return { art: "koenigMitte", ...OHNE_EINZELHEITEN };
  return { art: "ungenau", ...OHNE_EINZELHEITEN };
}

/** Nur die Fehlerart eines Zuges (für die Fehlersuche der Engine, engine/fehlersuche.ts). */
export function fehlerartIn(
  lage: Lage,
  uci: string,
  antwort: readonly string[],
  verlust: number | null,
): Fehlerart {
  return fehlerbefundIn(lage, uci, antwort, verlust).art;
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
