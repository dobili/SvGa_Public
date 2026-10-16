/**
 * Die stärkste Antwort des Gegners auf einen Kandidaten (Denkroutine Schritt 3) und ihr Wert
 * für den Vergleich in Schritt 4.
 *
 * Rolle im Gesamtbild: Rechenteil des Werkzeugs k12-kandidaten. Je Kandidat: Kandidat spielen,
 * die stärkste Antwort wählen (Matt, Schlag mit Gewinn, Schach, Drohung), danach Material,
 * Gabel der antwortenden Figur und König im Freien feststellen.
 * Abhängigkeiten: chessops, schach/drohungen.ts, schach/koenigImFreien.ts, schach/angreifer.ts.
 * Buchbezug: Kapitel 12, Schritt 3 („Was ist die stärkste, nicht die bequemste Antwort meines
 * Gegners?“) und Schritt 4 („zähle erst dann nach: Material, Königssicherheit, Aktivität. …
 * Wähle den Kandidaten, der gegen die stärkste Antwort das beste Ergebnis bringt“); Kapitel 7,
 * W6 Gabel (Ziele: König, wertvollere oder ungedeckte Figur).
 */
import { attacks } from "chessops/attacks";
import type { Chess } from "chessops/chess";
import { parseSan } from "chessops/san";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { parseSquare } from "chessops/util";
import { direkteAngreifer } from "../schach/angreifer";
import type { Figurenstand } from "../schach/angriffskarte";
import { erzwingendeZuege } from "../schach/drohungen";
import { koenigImFreien } from "../schach/koenigImFreien";
import { FIGURENWERT, type Stellung } from "../schach/stellung";

/** Die stärkste Antwort des Gegners auf einen Kandidaten. */
export interface Antwort {
  readonly san: string;
  readonly uci: string;
  readonly art: "matt" | "schach" | "schlag" | "drohung" | "keine";
  /** Materialstand aus eigener Sicht nach Kandidat und Antwort. */
  readonly bilanz: number;
  /** Eigene Figuren, die die antwortende Figur danach zugleich angreift (Gabel), sonst leer. */
  readonly gabel: readonly Figurenstand[];
  /** Ob der eigene König nach Kandidat und Antwort im Freien steht. */
  readonly imFreien: boolean;
  /** Ob schon der Kandidat mattsetzt (dann gibt es keine Antwort). */
  readonly mattGesetzt: boolean;
}

/** Ein Kandidat, der mit Matt beantwortet wird, ist der schlechteste (Befund C1.28). */
const WERT_MATT = Number.NEGATIVE_INFINITY;
/** Ein Kandidat, der selbst mattsetzt, ist der beste. */
const WERT_SELBST_MATT = Number.POSITIVE_INFINITY;
/** Eine Gabel greift mindestens zwei Ziele an (Kapitel 7, W6). */
const GABEL_ZIELE = 2;

/** Materialstand aus Sicht einer Farbe (Bauerneinheiten). */
export function materialstand(regeln: Chess, farbe: Color): number {
  let summe = 0;
  for (const feld of regeln.board.occupied) {
    const figur = regeln.board.get(feld);
    if (!figur || figur.role === "king") continue;
    summe += (figur.color === farbe ? 1 : -1) * FIGURENWERT[figur.role];
  }
  return summe;
}

/** Die Regeln als Stellung der App, für die Bausteine, die eine Stellung brauchen. */
function alsStellung(regeln: Chess): Stellung {
  return { fen: "", brett: regeln.board, amZug: regeln.turn, regeln };
}

/**
 * Ziele der Figur auf einem Feld: eigene Figuren, die sie angreift und die König, wertvoller oder
 * ungedeckt sind (Kapitel 7, W6). Erst ab zwei Zielen ist es eine Gabel.
 */
function gabelziele(regeln: Chess, feld: Square, eigen: Color): Figurenstand[] {
  const brett = regeln.board;
  const angreifer = brett.get(feld);
  if (!angreifer) return [];
  const getroffen = attacks(angreifer, feld, brett.occupied).intersect(brett[eigen]);
  const ziele = [...getroffen].flatMap((ziel): Figurenstand[] => {
    const figur = brett.get(ziel);
    if (!figur || figur.role === "pawn") return [];
    const wertvoller =
      figur.role === "king" || FIGURENWERT[figur.role] > FIGURENWERT[angreifer.role];
    const ungedeckt =
      direkteAngreifer(brett, ziel, eigen, brett.occupied, SquareSet.empty()).length === 0;
    return wertvoller || ungedeckt ? [{ feld: ziel, figur }] : [];
  });
  return ziele.length >= GABEL_ZIELE ? ziele : [];
}

/** Die Wahl unter den erzwingenden Antworten: Matt, Schlag mit Gewinn, Schach, Drohung. */
function waehle(danach: Chess): Pick<Antwort, "san" | "uci" | "art"> | null {
  const e = erzwingendeZuege(danach);
  const matt = e.schachs.find((s) => s.matt);
  if (matt) return { san: matt.san, uci: matt.uci, art: "matt" };
  const schlag = e.schlaege[0];
  if (schlag && schlag.bilanz > 0) return { san: schlag.san, uci: schlag.uci, art: "schlag" };
  const schach = e.schachs[0];
  if (schach) return { san: schach.san, uci: schach.uci, art: "schach" };
  const drohung = e.drohende[0];
  return drohung ? { san: drohung.san, uci: drohung.uci, art: "drohung" } : null;
}

/**
 * Spielt den Kandidaten und sucht die stärkste Antwort des Gegners.
 *
 * Eingaben: Regeln (eigene Seite am Zug), Kandidat in SAN, eigene Farbe. Ausgabe: Antwort mit
 * Materialstand danach, Gabel der antwortenden Figur und König im Freien.
 * Beispiel: Abb. 12.3, Kandidat 3... f5: Antwort 4. Sxe6, Gabel gegen Dame c7 und Turm f8, der
 * König steht weiter im Freien. Abb. 12.1, Kandidat 1. Lxh7+: Antwort Kxh7.
 * Sonderfälle: Kein erzwingender Zug: Art „keine“, Material nach dem Kandidaten. Setzt der
 * Kandidat selbst matt, gibt es keine Antwort („mattGesetzt“).
 */
export function staerksteAntwort(regeln: Chess, san: string, eigen: Color): Antwort {
  const leer = {
    san: "",
    uci: "",
    art: "keine" as const,
    gabel: [],
    imFreien: false,
    mattGesetzt: false,
  };
  const zug = parseSan(regeln, san);
  if (!zug) return { ...leer, bilanz: materialstand(regeln, eigen) };
  const danach = regeln.clone();
  danach.play(zug);
  const wahl = waehle(danach);
  const antwort = wahl ? parseSan(danach, wahl.san) : undefined;
  const nachAntwort = danach.clone();
  if (antwort) nachAntwort.play(antwort);
  const imFreien = wahl?.art !== "matt" && koenigImFreien(alsStellung(nachAntwort), eigen) !== null;
  const zielfeld = wahl && wahl.art !== "matt" ? parseSquare(wahl.uci.slice(2, 4)) : undefined;
  return {
    ...leer,
    ...wahl,
    mattGesetzt: danach.isCheckmate(),
    bilanz: materialstand(nachAntwort, eigen),
    gabel: zielfeld === undefined ? [] : gabelziele(nachAntwort, zielfeld, eigen),
    imFreien,
  };
}

/**
 * Wert einer Antwort für den Vergleich der Kandidaten: der Materialstand, bei Matt der
 * schlechteste mögliche Wert.
 *
 * Regel: Kapitel 12, Schritt 4 („Wähle den Kandidaten, der gegen die stärkste Antwort das beste
 * Ergebnis bringt“); ein Matt ist schlechter als jeder Materialverlust (Befund C1.28), ein
 * Kandidat, der selbst mattsetzt, besser als jeder Materialgewinn.
 * Beispiel: Abb. 12.4, Kandidat b5: Antwort Dxf7# → scheidet aus, unabhängig vom Material (−1).
 */
export function vergleichswert(antwort: Antwort): number {
  if (antwort.mattGesetzt) return WERT_SELBST_MATT;
  return antwort.art === "matt" ? WERT_MATT : antwort.bilanz;
}

/** Der beste Kandidat nach Schritt 4: Index, oder null, wenn jeder mit Matt beantwortet wird. */
export function besterKandidat(antworten: readonly Antwort[]): number | null {
  let beste: number | null = null;
  antworten.forEach((antwort, index) => {
    if (antwort.art === "matt") return;
    const bisher = beste === null ? undefined : antworten[beste];
    if (!bisher || vergleichswert(antwort) > vergleichswert(bisher)) beste = index;
  });
  return beste;
}
