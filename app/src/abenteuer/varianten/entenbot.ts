/**
 * Bot für Entenschach (L6, Ray Castillo in der Prärie): Zug und Entenfeld von Fairy-Stockfish
 * (`duck`), zufällig unter den guten; ohne Engine ein einfacher eigener Plan.
 *
 * Warum: Fairy-Stockfish kennt Entenschach (src/variant.cpp, wallingRule DUCK) und liefert Züge wie
 * „e2e4,e4d5“. Lädt das Zusatzpaket nicht oder antwortet es nicht, soll die Partie trotzdem
 * weitergehen: Dann schlägt der Bot, was am meisten wert ist, und stellt die Ente dorthin, wo sie
 * die gefährlichsten Schläge des Gegners verstellt, zuerst den Schlag auf den eigenen König.
 * Abhängigkeiten: ente.ts, freistellung.ts, botwahl.ts.
 */
import { SquareSet } from "chessops/squareSet";
import type { Role, Square } from "chessops/types";
import { opposite } from "chessops/util";
import { waehle, type Bewerteterzug, type Botstil, type Zugbewerter } from "./botwahl";
import {
  ausEntenUci,
  entenFen,
  entenfelder,
  entenzuege,
  setzeEnte,
  zieheFigur,
  type Entenpartie,
} from "./ente";
import { alsUci, freizuege, gleich, type Freizug } from "./freistellung";

/** Ein ganzer Zug des Bots: Figurenzug und Entenfeld. */
export interface Entenbotzug {
  readonly zug: Freizug;
  readonly ente: Square;
}

/** Wert der Figuren für den Notplan (der König zählt am meisten: Schlagen gewinnt). */
const WERT: Record<Role, number> = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };

/** Wert des Schlags eines Zuges (0 ohne Schlag). */
function schlagwert(p: Entenpartie, zug: Freizug): number {
  const opfer = p.stellung.brett.get(zug.nach);
  return opfer ? WERT[opfer.role] : 0;
}

/** Bester Schlagwert, den der Gegner nach dem Zug mit der Ente auf `ente` hätte. */
function gefahr(nach: Entenpartie, ente: Square): number {
  const zuege = freizuege(nach.stellung, SquareSet.fromSquare(ente));
  return Math.max(0, ...zuege.map((z) => schlagwert(nach, z)));
}

/** Entenfeld nach dem Figurenzug: dort, wo die schlimmste Antwort des Gegners am kleinsten ist. */
function besteEnte(nach: Entenpartie, stil: Botstil): Square {
  const felder = entenfelder(nach);
  let bestes = felder[Math.floor(stil.zufall() * felder.length)] as Square;
  let kleinste = gefahr(nach, bestes);
  for (const f of felder) {
    const g = gefahr(nach, f);
    if (g < kleinste) [bestes, kleinste] = [f, g];
  }
  return bestes;
}

/**
 * Notplan ohne Engine: der wertvollste Schlag (König zuerst), sonst ein zufälliger Zug; die Ente
 * nach besteEnte. Beispiel: Dame kann den König schlagen → dieser Zug, ohne Ente (Partie aus).
 */
export function notplan(p: Entenpartie, stil: Botstil): Entenbotzug {
  const zuege = entenzuege(p);
  if (zuege.length === 0) throw new Error("Der Entenbot hat keinen Zug.");
  const besterWert = Math.max(...zuege.map((z) => schlagwert(p, z)));
  const auswahl = besterWert > 0 ? zuege.filter((z) => schlagwert(p, z) === besterWert) : zuege;
  const zug = auswahl[Math.floor(stil.zufall() * auswahl.length)] as Freizug;
  const nach = zieheFigur(p, zug);
  return { zug, ente: nach.ende ? -1 : besteEnte(nach, stil) };
}

/** Geht dieser Engine-Zug nach unseren Regeln (Figurenzug und Entenfeld)? */
function passt(p: Entenpartie, b: Bewerteterzug): boolean {
  const teile = ausEntenUci(b.zug);
  if (!teile || !entenzuege(p).some((z) => gleich(z, teile.zug))) return false;
  const nach = zieheFigur(p, teile.zug);
  return nach.ende !== null || entenfelder(nach).includes(teile.ente);
}

/**
 * Der Zug des Bots: Fairy-Stockfish mit Wahl unter den guten Zügen, sonst der Notplan.
 * Ausgabe: Figurenzug und Entenfeld (-1, wenn der Zug den König schlägt und die Partie endet).
 */
export async function entenbotZug(
  p: Entenpartie,
  bewerter: Zugbewerter,
  stil: Botstil,
): Promise<Entenbotzug> {
  const koenig = p.stellung.brett.kingOf(opposite(p.stellung.amZug));
  const fang = entenzuege(p).find((z) => z.nach === koenig);
  if (fang) return { zug: fang, ente: -1 };
  const liste = await bewerter(entenFen(p), stil.varianten).catch((fehler: unknown) => {
    console.warn("Entenbot: Engine ohne Antwort, Notplan.", fehler);
    return [];
  });
  const gute = liste.filter((b) => passt(p, b));
  if (gute.length === 0) return notplan(p, stil);
  const teile = ausEntenUci((gute[waehle(gute, stil)] as Bewerteterzug).zug);
  return teile ?? notplan(p, stil);
}

/** Spielt den Zug des Bots in der Partie (beide Teile). */
export function spieleBotzug(p: Entenpartie, b: Entenbotzug): Entenpartie {
  const nach = zieheFigur(p, b.zug);
  return nach.ende ? nach : setzeEnte(nach, b.ente);
}

/** Der Zug als Text für die Anzeige (Figurenzug in UCI). */
export const zugtext = (b: Entenbotzug): string => alsUci(b.zug);
