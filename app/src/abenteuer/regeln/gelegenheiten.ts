/**
 * Gelegenheiten des Helden vor seinem Zug (Atmosphäre T11): Köderbauer und Turmopfer.
 *
 * Rolle im Gesamtbild: Merkmale für regeln/partiemomente.ts. Ein geführter Moment (Clubkampf gegen
 * Mrs. Okafor, Roman Kapitel 15) soll genau dann kommen, wenn die Stellung eine Versuchung bietet:
 * ein Bauer, der ungedeckt aussieht und doch vergiftet ist, oder ein Turmopfer gegen den König.
 * Ob das Opfer korrekt wäre, prüft die App nicht; der Roman will gerade den Zweifel.
 * Leistung: Ergebnisse je FEN gemerkt, weil die Momente bei jedem Halbzug den Verlauf ansehen.
 * Buchbezug: Kapitel 1, Abtausch (Zählen von Angreifern und Verteidigern); Kapitel 7, Matt in
 * zwei („Erzwingende Züge zuerst“).
 * Abhängigkeiten: chessops, schach/mattsuche.ts, schach/abtausch.ts.
 */
import type { Chess } from "chessops/chess";
import type { NormalMove, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { abtausch } from "../../schach/abtausch";
import { erzwingtMatt } from "../../schach/mattsuche";

/** Matt in höchstens so vielen Zügen des Gegners macht einen Bauern zum Köder. */
const KOEDER_MATT_ZUEGE = 2;
/** Gemerkte Ergebnisse je Merkmal und FEN; begrenzt, damit lange Sitzungen nicht wachsen. */
const MERKER_GROESSE = 500;
const merker = new Map<string, boolean>();

/** Alle legalen Züge der Seite am Zug. */
function zuegeVon(pos: Chess): NormalMove[] {
  const zuege: NormalMove[] = [];
  for (const [von, ziele] of pos.allDests()) {
    for (const nach of ziele) zuege.push({ from: von, to: nach });
  }
  return zuege;
}

/** Stellung nach einem Zug (die Eingabe bleibt unverändert). */
function nach(pos: Chess, zug: NormalMove): Chess {
  const kopie = pos.clone();
  kopie.play(zug);
  return kopie;
}

/** Abstand zweier Felder in Königszügen. */
function koenigsabstand(a: Square, b: Square): number {
  return Math.max(Math.abs(squareFile(a) - squareFile(b)), Math.abs(squareRank(a) - squareRank(b)));
}

/**
 * Köder: Der Held (am Zug) kann einen Bauern schlagen, und danach hat der Gegner ein Matt in
 * höchstens zwei Zügen. Beispiel: Grundreihe, der Turm schlägt auf der siebten Reihe, die Dame
 * des Gegners setzt auf der ersten Reihe matt.
 */
export function hatKoeder(pos: Chess): boolean {
  for (const zug of zuegeVon(pos)) {
    if (pos.board.get(zug.to)?.role !== "pawn") continue;
    const danach = nach(pos, zug);
    if (zuegeVon(danach).some((a) => erzwingtMatt(danach, a, KOEDER_MATT_ZUEGE).art !== "keins")) {
      return true;
    }
  }
  return false;
}

/**
 * Turmopfer: Ein Turm des Helden (am Zug) kann auf ein Feld neben dem gegnerischen König ziehen
 * (auch schlagend) und ginge dort im Abtausch verloren. Sonderfall: ohne gegnerischen König nie.
 */
export function hatTurmopfer(pos: Chess): boolean {
  const koenig = pos.board.kingOf(pos.turn === "white" ? "black" : "white");
  if (koenig === undefined) return false;
  for (const zug of zuegeVon(pos)) {
    if (pos.board.get(zug.from)?.role !== "rook") continue;
    if (koenigsabstand(zug.to, koenig) !== 1) continue;
    const bilanz = abtausch(nach(pos, zug).board, zug.to)?.bilanz ?? 0;
    // Bilanz aus Sicht des Gegners: Gewinnt er beim Schlagen auf dem Feld, ist der Turm geopfert.
    if (bilanz > 0) return true;
  }
  return false;
}

/** Gemerkte Prüfung je Merkmal und Stellung. */
export function gelegenheit(merkmal: "koeder" | "turmopfer", fen: string, pos: Chess): boolean {
  const schluessel = `${merkmal} ${fen}`;
  const bekannt = merker.get(schluessel);
  if (bekannt !== undefined) return bekannt;
  const ergebnis = merkmal === "koeder" ? hatKoeder(pos) : hatTurmopfer(pos);
  if (merker.size >= MERKER_GROESSE) merker.clear();
  merker.set(schluessel, ergebnis);
  return ergebnis;
}
