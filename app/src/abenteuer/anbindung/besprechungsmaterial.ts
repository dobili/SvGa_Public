/**
 * Was ein Fehler kostet oder eine Chance bringt, als Figur benannt, nie in Bauerneinheiten
 * (Wunsch des Autors, 26.11.2026; Entwurf docs/spiel/auftraege/partiebesprechung_25-11.md,
 * Abschnitt 11, Punkt 2): „Das kostet dich den Springer.“, „Damit gewinnst du die Dame.“
 *
 * Rolle im Gesamtbild: reine Rechnung für anbindung/besprechungsursache.ts. Grundlage ist die
 * gespeicherte Hauptvariante der Engine (keine neue Rechnung). Gezählt wird, was beide Seiten in
 * der Folge schlagen; die Bilanz gilt nur an einer ruhigen Stelle (der nächste Zug der Folge
 * schlägt nicht mehr), sonst fehlt vielleicht das Zurückschlagen. Genannt wird die schwerste
 * Figur, die netto verloren geht und zur Bilanz passt; passt keine (etwa Turm gegen Springer),
 * gibt es keinen Satz. Matt geht vor.
 * Regel: Kapitel 1, Wert der Figuren und Zählen von Angreifern und Verteidigern.
 * Abhängigkeiten: chessops (Rochade wie bei Stockfish über normalizeMove), spiel/zuege.ts,
 * schach/stellung.ts (FIGURENWERT).
 */
import { normalizeMove } from "chessops/chess";
import type { Color, Role } from "chessops/types";
import { parseUci } from "chessops/util";
import { FIGURENWERT } from "../../schach/stellung";
import { regelstellung } from "../../spiel/zuege";

/** Ergebnis: Matt, eine Figur (oder zwei Bauern) gewonnen oder verloren, oder nichts Sicheres. */
export type Materialfolge =
  | { readonly art: "matt"; readonly richtung: "verlust" | "gewinn" }
  | {
      readonly art: "figur";
      readonly rolle: Role | "zweiBauern";
      readonly richtung: "verlust" | "gewinn";
    };

/** Rollen, die geschlagen werden können, schwerste zuerst. */
const ROLLEN: readonly Role[] = ["queen", "rook", "bishop", "knight", "pawn"];
/** Figuren ohne Bauern, schwerste zuerst. */
const FIGUREN: readonly Role[] = ["queen", "rook", "bishop", "knight"];
/** So viel darf die Bilanz der Figuren unter dem Wert der Figur liegen (Läufer gegen Springer zählt als Ausgleich). */
const SPIELRAUM = 0.5;
/** Insgesamt muss mehr als ein Bauer fehlen, damit eine Figur als verloren gilt (Läufer gegen Bauer: zwei). */
const MEHR_ALS_BAUER = 1.5;
/** Zwei Bauern netto. */
const ZWEI = 2;

/** Ein gespielter Halbzug: Wer zog, was geschlagen wurde, ob Matt. */
interface Halbzug {
  readonly farbe: Color;
  readonly geschlagen: Role | null;
  readonly matt: boolean;
}

/** Spielt die Folge (UCI) nach, bis ein Zug nicht geht. */
function nachspielen(fen: string, folge: readonly string[]): Halbzug[] {
  const pos = regelstellung(fen);
  if (!pos) return [];
  const liste: Halbzug[] = [];
  for (const uci of folge) {
    const roh = parseUci(uci);
    const zug = roh ? normalizeMove(pos, roh) : null;
    if (!zug || !pos.isLegal(zug) || !("from" in zug)) break;
    const farbe = pos.turn;
    const ziel = pos.board.get(zug.to);
    const bauer = pos.board.get(zug.from)?.role === "pawn";
    const enPassant = bauer && pos.epSquare === zug.to;
    const geschlagen = ziel && ziel.color !== farbe ? ziel.role : enPassant ? "pawn" : null;
    pos.play(zug);
    liste.push({ farbe, geschlagen, matt: pos.isCheckmate() });
  }
  return liste;
}

/** Netto verlorene Rollen der Seite bis zum Halbzug `bis` (ausschließlich). */
function nettoVerluste(
  halbzuege: readonly Halbzug[],
  bis: number,
  seite: Color,
): Map<Role, number> {
  const netto = new Map<Role, number>();
  for (const h of halbzuege.slice(0, bis)) {
    if (!h.geschlagen) continue;
    const vorzeichen = h.farbe === seite ? -1 : 1;
    netto.set(h.geschlagen, (netto.get(h.geschlagen) ?? 0) + vorzeichen);
  }
  return netto;
}

/** Die längste ruhige Stelle der Folge: danach schlägt der nächste Zug nicht (oder die Folge endet ohne Schlag). */
function ruhigeStelle(halbzuege: readonly Halbzug[]): number {
  for (let bis = halbzuege.length; bis > 0; bis -= 1) {
    const letzter = halbzuege[bis - 1];
    const naechster = halbzuege[bis];
    if (naechster ? !naechster.geschlagen : !letzter?.geschlagen) return bis;
  }
  return 0;
}

/** Summe der Werte der Rollen (netto, positiv = verloren). */
function wertsumme(netto: Map<Role, number>, rollen: readonly Role[]): number {
  return rollen.reduce((s, r) => s + (netto.get(r) ?? 0) * FIGURENWERT[r], 0);
}

/**
 * Die Figur, die zur Bilanz passt, oder null. Eine Figur gilt als verloren, wenn die Bilanz der
 * Figuren (ohne Bauern) sie ganz trägt, also kein Figurenausgleich kam, und insgesamt mehr als ein
 * Bauer fehlt: Läufer gegen Bauer → „Läufer“; Turm gegen Springer → null (Qualität, kein Satz).
 */
function passendeRolle(netto: Map<Role, number>): Role | "zweiBauern" | null {
  const gesamt = wertsumme(netto, ROLLEN);
  const figuren = wertsumme(netto, FIGUREN);
  const schwerste = FIGUREN.find((r) => (netto.get(r) ?? 0) > 0);
  if (schwerste) {
    const getragen = figuren >= FIGURENWERT[schwerste] - SPIELRAUM;
    return getragen && gesamt >= MEHR_ALS_BAUER ? schwerste : null;
  }
  const bauern = netto.get("pawn") ?? 0;
  if (figuren !== 0 || bauern < 1) return null;
  return bauern >= ZWEI ? "zweiBauern" : "pawn";
}

/**
 * Was die Folge für die Seite bedeutet.
 * Eingaben: Stellung, Folge in UCI (beim eigenen Fehler mit dem gespielten Zug vorn), die Seite
 * des Helden, die Richtung, in der ein Satz Sinn ergibt („verlust“ beim Fehler, „gewinn“ bei der
 * Chance). Ausgabe: der Befund oder null.
 * Beispiel: nach 3... Sf6?? Dxf7# → Matt (Verlust); Folge Lxf7+ Kxf7 Sg5+ Kg8 Dxd8 → der Held
 * (Weiß) gewinnt die Dame für Läufer und Bauer → Gewinn „queen“.
 * Sonderfälle: Die Bilanz passt nicht zur Richtung oder zu keiner Figur → null.
 */
export function materialfolge(
  fen: string,
  folge: readonly string[],
  seite: Color,
  richtung: "verlust" | "gewinn",
): Materialfolge | null {
  const halbzuege = nachspielen(fen, folge);
  const matt = halbzuege.find((h) => h.matt);
  if (matt) {
    const fuerSeite = matt.farbe === seite ? "gewinn" : "verlust";
    return fuerSeite === richtung ? { art: "matt", richtung } : null;
  }
  const bis = ruhigeStelle(halbzuege);
  const verlorenVon = richtung === "verlust" ? seite : seite === "white" ? "black" : "white";
  const rolle = passendeRolle(nettoVerluste(halbzuege, bis, verlorenVon));
  return rolle ? { art: "figur", rolle, richtung } : null;
}
