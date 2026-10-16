/**
 * Ausgaben der Engine (UCI-Protokoll) lesen.
 *
 * Rolle im Gesamtbild: Stockfish meldet seine Rechnung als Textzeilen („info depth 12 … pv e2e4“).
 * Dieses Modul macht daraus Werte, die der Engine-Dienst weitergibt. Rein und ohne Engine testbar.
 * Abhängigkeiten: keine.
 */

/** Ein Wert der Engine: Bauerneinheiten oder Matt in n Zügen. Immer aus Sicht von Weiß. */
export type Wert =
  | { readonly art: "bauern"; readonly bauern: number }
  | { readonly art: "matt"; readonly zuege: number };

/** Eine Variante der Engine: Wert und Zugfolge (UCI-Schreibweise wie „e2e4“). */
export interface Variante {
  readonly nummer: number;
  readonly wert: Wert;
  readonly zuege: readonly string[];
}

/** Gelesene Infozeile. */
export interface Infozeile {
  readonly tiefe: number;
  readonly variante: Variante;
  readonly knotenJeSekunde: number;
}

/** Hundertstel Bauern je Bauerneinheit („cp“ heißt centipawns). */
const HUNDERTSTEL_JE_BAUER = 100;

/** Liest den Wert hinter „score“. Die Engine wertet aus Sicht der Seite am Zug. */
function leseWert(teile: readonly string[], weissAmZug: boolean): Wert | null {
  const stelle = teile.indexOf("score");
  const art = teile[stelle + 1];
  const zahl = Number(teile[stelle + 2]);
  if (stelle < 0 || !Number.isFinite(zahl)) {
    return null;
  }
  const vorzeichen = weissAmZug ? 1 : -1;
  if (art === "cp") {
    return { art: "bauern", bauern: (vorzeichen * zahl) / HUNDERTSTEL_JE_BAUER };
  }
  return art === "mate" ? { art: "matt", zuege: vorzeichen * zahl } : null;
}

/** Liest die Zahl hinter einem Schlüsselwort, etwa „depth 12“. */
function zahlNach(teile: readonly string[], schluessel: string, ersatz: number): number {
  const stelle = teile.indexOf(schluessel);
  const zahl = stelle < 0 ? Number.NaN : Number(teile[stelle + 1]);
  return Number.isFinite(zahl) ? zahl : ersatz;
}

/**
 * Liest eine Infozeile der Engine.
 *
 * Warum: Werte sollen in der App immer aus Sicht von Weiß erscheinen (Konzept 8.1), die Engine
 * rechnet aber aus Sicht der Seite am Zug. Deshalb wird bei Schwarz am Zug das Vorzeichen gedreht.
 * Eingaben: Zeile, ob Weiß am Zug ist.
 * Ausgabe: Infozeile oder null (Zeilen ohne Variante, Zwischenstände mit „lowerbound“ und
 * „upperbound“ werden übergangen, weil sie keinen genauen Wert tragen).
 * Beispiel: „info depth 10 multipv 1 score cp -25 … pv c5d4“ bei Schwarz am Zug → +0,25 für Weiß.
 */
export function leseInfozeile(zeile: string, weissAmZug: boolean): Infozeile | null {
  const teile = zeile.trim().split(/\s+/);
  if (
    teile[0] !== "info" ||
    !teile.includes("pv") ||
    teile.includes("lowerbound") ||
    teile.includes("upperbound")
  ) {
    return null;
  }
  const wert = leseWert(teile, weissAmZug);
  if (!wert) {
    return null;
  }
  const zuege = teile.slice(teile.indexOf("pv") + 1);
  return {
    tiefe: zahlNach(teile, "depth", 0),
    knotenJeSekunde: zahlNach(teile, "nps", 0),
    variante: { nummer: zahlNach(teile, "multipv", 1), wert, zuege },
  };
}

/** Liest den Zug aus „bestmove e2e4 ponder e7e5“; „(none)“ heißt: kein legaler Zug. */
export function leseBesterZug(zeile: string): string | null | undefined {
  const treffer = /^bestmove\s+(\S+)/.exec(zeile.trim());
  if (!treffer?.[1]) {
    return undefined;
  }
  return treffer[1] === "(none)" ? null : treffer[1];
}
