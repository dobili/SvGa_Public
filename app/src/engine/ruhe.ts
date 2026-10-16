/**
 * Rechnung bis zur Ruhe mit der Engine: die Hauptvariante in Schritten zu höchstens vier
 * Halbzügen, bis kein Schach und kein Schlag mehr in der Luft liegt, dazu die Bilanz.
 *
 * Rolle im Gesamtbild: liefert die Züge für die Karte RuheKarte (Werkzeug k7-ruhe,
 * Pflichtenheft 6.3: „Die Engine rechnet bis zur Ruhe und zeigt die Bilanz in Bauerneinheiten.
 * Gold: Hauptvariante in Schritten zu höchstens vier Halbzügen.“).
 * Abhängigkeiten: chessops, engineDienst.ts (Bewertung), schach/stellung.ts (Faustwerte).
 * Buchbezug: Kapitel 7, „Schritt 3: Wann ist die Rechnung fertig?“ („bis zum Matt, bis zum
 * Dauerschach oder bis zur Ruhe“, „Die Bilanz: Zähle am Ende der Variante nach“).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Color } from "chessops/types";
import { parseUci } from "chessops/util";
import { FIGURENWERT } from "../schach/stellung";
import type { Bewertung } from "./engineDienst";
import type { Wert } from "./uci";

/** Ein Schritt der Hauptvariante umfasst höchstens so viele Halbzüge (Pflichtenheft 6.3). */
export const HALBZUEGE_JE_SCHRITT = 4;

/** Was die Rechnung von der Engine braucht. */
export interface Bewerter {
  bewerte(fen: string, rechenzeitMs: number, varianten: number): Promise<Bewertung>;
}

export interface Ruhe {
  /** Die Hauptvariante bis zur Ruhe (UCI). */
  readonly zuege: readonly string[];
  /** Dieselben Züge in Schritten zu höchstens vier Halbzügen. */
  readonly schritte: readonly (readonly string[])[];
  /** Wie die Folge endet. */
  readonly ende: "matt" | "ruhe" | "offen";
  /** Wert der Engine aus Sicht von Weiß. */
  readonly wert: Wert;
  /** Materialstand aus Sicht der Seite am Zug, vorher und am Ende der Folge (Bauerneinheiten). */
  readonly materialVorher: number;
  readonly materialNachher: number;
}

/** Materialstand aus Sicht einer Farbe in Bauerneinheiten (ohne Könige). */
export function material(pos: Chess, farbe: Color): number {
  let summe = 0;
  for (const feld of pos.board.occupied) {
    const figur = pos.board.get(feld);
    if (!figur || figur.role === "king") continue;
    summe += (figur.color === farbe ? 1 : -1) * FIGURENWERT[figur.role];
  }
  return summe;
}

/** So viele ruhige Halbzüge nacheinander (je einer pro Seite) bedeuten Ruhe. */
const RUHIGE_HALBZUEGE = 2;

/**
 * Spielt die Variante nach und kürzt sie an der ersten Ruhe.
 *
 * Regel: Kapitel 7, Schritt 3: Die Rechnung ist fertig, wenn kein Schach und kein Schlag mehr in
 * der Luft liegt. Ruhe heißt hier: Beide Seiten machen nacheinander je einen Zug ohne Schach und
 * ohne Schlag. Die Folge endet mit dem letzten Schach oder Schlag davor. Ein einzelner ruhiger Zug
 * (etwa der König weicht einem Schach aus) beendet die Rechnung nicht, wenn danach wieder
 * geschlagen wird (Abb. 7.14: 2... Kg8 3. Sxd6).
 * Sonderfall: Liegt hinter der Ruhe noch ein Schlag in der Variante der Engine (bei tiefer
 * Rechnung), gehört er nicht mehr dazu.
 * Eingaben: Stellung vor der Variante, Variante (UCI). Ausgabe: Züge bis zur Ruhe, wie die Folge
 * endet, Stellung am Ende. Auch das Werkzeug „Erzwingende Züge“ rechnet damit jeden Kandidaten
 * (kandidatenruhe.ts).
 */
export function bisZurRuhe(
  pos: Chess,
  zuege: readonly string[],
): { zuege: string[]; ende: Ruhe["ende"]; danach: Chess } {
  const kopie = pos.clone();
  const gespielt: string[] = [];
  let letzteUnruhe = 0;
  let danach = kopie.clone();
  for (const uci of zuege) {
    const zug = parseUci(uci);
    if (!zug || !kopie.isLegal(zug)) break;
    const schlag = kopie.board.occupied.has(zug.to);
    kopie.play(zug);
    gespielt.push(uci);
    if (kopie.isCheckmate()) return { zuege: gespielt, ende: "matt", danach: kopie };
    if (schlag || kopie.isCheck()) {
      letzteUnruhe = gespielt.length;
      danach = kopie.clone();
    } else if (gespielt.length - letzteUnruhe >= RUHIGE_HALBZUEGE) {
      break;
    }
  }
  if (letzteUnruhe === 0)
    return { zuege: gespielt.slice(0, 1), ende: "ruhe", danach: ersterZug(pos, gespielt) };
  const ruhig = gespielt.length - letzteUnruhe >= RUHIGE_HALBZUEGE;
  return { zuege: gespielt.slice(0, letzteUnruhe), ende: ruhig ? "ruhe" : "offen", danach };
}

/** Die Stellung nach dem ersten Zug (für eine ruhige Variante: der Zug selbst ist das Ergebnis). */
function ersterZug(pos: Chess, zuege: readonly string[]): Chess {
  const kopie = pos.clone();
  const erster = zuege[0] === undefined ? undefined : parseUci(zuege[0]);
  if (erster && kopie.isLegal(erster)) kopie.play(erster);
  return kopie;
}

/** Teilt eine Zugfolge in Schritte zu höchstens vier Halbzügen. */
export function inSchritten(zuege: readonly string[]): string[][] {
  const schritte: string[][] = [];
  for (let i = 0; i < zuege.length; i += HALBZUEGE_JE_SCHRITT)
    schritte.push([...zuege.slice(i, i + HALBZUEGE_JE_SCHRITT)]);
  return schritte;
}

/**
 * Rechnet die Hauptvariante bis zur Ruhe.
 *
 * Eingaben: Bewerter, Stellung (FEN), Rechenzeit. Ausgabe: Ruhe, oder null ohne Variante.
 * Beispiel: Abb. 7.14 (Weiß am Zug): „Th8+ Kxh8 Sxf7+ Kg8 Sxd6“, Ende „ruhe“, Material vorher
 * 0, nachher +5 (Dame und Bauer f7 gegen Turm); Wert der Engine deutlich für Weiß.
 * Sonderfälle: Endet die Variante der Engine mitten in Schlägen, ist das Ende „offen“.
 */
export async function rechneRuhe(
  bewerter: Bewerter,
  fen: string,
  rechenzeitMs: number,
): Promise<Ruhe | null> {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr) return null;
  const bewertung = await bewerter.bewerte(fen, rechenzeitMs, 1);
  const variante = bewertung.varianten[0];
  if (!variante || variante.zuege.length === 0) return null;
  const { zuege, ende, danach } = bisZurRuhe(pos.value, variante.zuege);
  return {
    zuege,
    schritte: inSchritten(zuege),
    ende,
    wert: variante.wert,
    materialVorher: material(pos.value, pos.value.turn),
    materialNachher: material(danach, pos.value.turn),
  };
}
