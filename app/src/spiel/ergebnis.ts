/**
 * Wann und wie eine Partie endet: Matt, Patt, 50-Züge-Regel, dreifache Wiederholung, zu wenig
 * Material, Aufgabe, Zeit.
 *
 * Rolle im Gesamtbild: Die Partie (spiel/partie.ts) prüft nach jedem Zug, ob die Partie vorbei
 * ist; die Oberfläche zeigt das Ergebnis, die PGN schreibt „1-0“, „0-1“ oder „1/2-1/2“.
 * Abhängigkeiten: chessops, spiel/zuege.ts.
 * Buchbezug: Kapitel 0, „Wie endet eine Partie?“ (Matt, Patt, Remis).
 */
import type { Color } from "chessops/types";
import { regelstellung } from "./zuege";

export type Partieende =
  | { readonly art: "matt"; readonly sieger: Color }
  | { readonly art: "aufgabe"; readonly sieger: Color }
  | { readonly art: "zeit"; readonly sieger: Color }
  | { readonly art: "patt" }
  | { readonly art: "fuenfzigZuege" }
  | { readonly art: "wiederholung" }
  | { readonly art: "material" }
  /** Zeit abgelaufen, aber der Gegner kann nicht mehr mattsetzen (Kapitel 0). */
  | { readonly art: "zeitRemis" }
  /** Remis durch Vereinbarung, nur bei eingelesenen Partien (PGN-Import). */
  | { readonly art: "vereinbart" };

/** 50 Züge je Seite ohne Bauernzug und ohne Schlag = 100 Halbzüge. */
const FUENFZIG_ZUEGE_HALBZUEGE = 100;
/** Dreimal dieselbe Stellung. */
const WIEDERHOLUNGEN = 3;
/** Figuren, Zugrecht, Rochade und en passant: daran erkennt man „dieselbe Stellung“. */
const STELLUNGSFELDER = 4;

function stellungsschluessel(fen: string): string {
  return fen.split(" ").slice(0, STELLUNGSFELDER).join(" ");
}

/**
 * Prüft, ob die Partie nach dem letzten Zug zu Ende ist.
 *
 * Regel: Kapitel 0, Matt und Patt; dazu die Remisregeln (50 Züge, dreifache Wiederholung, zu
 * wenig Material). Eingaben: alle Stellungen der Partie, die letzte ist die aktuelle.
 * Ausgabe: Partieende oder null, wenn weitergespielt wird.
 * Beispiel: Stellung nach 1. f3 e5 2. g4 Dh4# → { art: „matt“, sieger: „black“ }.
 * Sonderfall: Eine unlesbare Stellung beendet nichts (null).
 */
export function partieendeNach(stellungen: readonly string[]): Partieende | null {
  const fen = stellungen[stellungen.length - 1];
  const pos = fen ? regelstellung(fen) : null;
  if (!fen || !pos) return null;
  if (pos.isCheckmate()) {
    return { art: "matt", sieger: pos.turn === "white" ? "black" : "white" };
  }
  if (pos.isStalemate()) return { art: "patt" };
  if (pos.isInsufficientMaterial()) return { art: "material" };
  if (pos.halfmoves >= FUENFZIG_ZUEGE_HALBZUEGE) return { art: "fuenfzigZuege" };
  const schluessel = stellungsschluessel(fen);
  const gleich = stellungen.filter((s) => stellungsschluessel(s) === schluessel).length;
  return gleich >= WIEDERHOLUNGEN ? { art: "wiederholung" } : null;
}

/**
 * Ende durch abgelaufene Zeit.
 *
 * Regel: Wer die Zeit überschreitet, verliert, außer der Gegner kann mit seinem Material nicht
 * mehr mattsetzen; dann ist es remis. Beispiel: Weiß überschreitet, Schwarz hat nur noch den
 * König → „zeitRemis“.
 */
export function partieendeDurchZeit(fen: string, ueberschritten: Color): Partieende {
  const gegner: Color = ueberschritten === "white" ? "black" : "white";
  const pos = regelstellung(fen);
  if (pos?.hasInsufficientMaterial(gegner)) return { art: "zeitRemis" };
  return { art: "zeit", sieger: gegner };
}

/** Ergebnis in PGN-Schreibweise. */
export function pgnErgebnis(ende: Partieende | null): "1-0" | "0-1" | "1/2-1/2" | "*" {
  if (!ende) return "*";
  if ("sieger" in ende) return ende.sieger === "white" ? "1-0" : "0-1";
  return "1/2-1/2";
}
