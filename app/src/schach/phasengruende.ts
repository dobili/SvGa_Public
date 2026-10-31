/**
 * Gründe für das Ende der Eröffnung in eigenen Partien, auch wenn die Entwicklung nicht fertig ist:
 * Abtausch, ausgedünnte Grundreihe, Kontakt der Figuren. Dazu die Materialgrenze fürs Endspiel.
 *
 * Rolle im Gesamtbild: Entscheidungen 11 und 12 des Autors (30.10.2026). In eigenen Partien gilt
 * seither das Glossar des Buches (Mittelspiel, wenn beide Seiten entwickelt sind und rochiert
 * haben), dazu als Ausweg die drei Gründe, mit denen Lichess die Eröffnung beendet (scalachess,
 * Divider.scala, AGPL; hier nur die Regeln nachgebaut, kein Code übernommen): höchstens zehn
 * Figuren außer Königen und Bauern, eine Grundreihe mit weniger als vier eigenen Steinen,
 * „Durchmischung“ über 150 (weiße und schwarze Steine eng beieinander, besonders tief im Lager des
 * Gegners). So bleibt keine Partie ewig in der Eröffnung, auch wenn eine Seite nie fertig
 * entwickelt (Begründung des Autors vom 17.10.2026). Messung an 5654 Lichess-Partien
 * (spiel/phasenvergleich.messung.ts): Mittelspiel im Median ab Halbzug 20 statt 11.
 * Fürs Endspiel verlangen eigene Partien zusätzlich wenig Material, wie die Experten (Speelman:
 * höchstens 13 Punkte je Seite; Lichess: höchstens sechs Figuren).
 * Abhängigkeiten: chessops (Board), schach/stellung.ts (Figurenwerte).
 */
import type { Board } from "chessops/board";
import type { Color } from "chessops/types";
import { FIGURENWERT } from "./stellung";

/** Höchstens so viele Figuren (ohne Könige und Bauern): getauscht genug für das Mittelspiel. */
export const MITTELSPIEL_BIS_FIGUREN = 10;
/** Weniger eigene Steine auf der Grundreihe: Die Seite hat sich herausbewegt. */
export const GRUNDREIHE_UNTER = 4;
/** Ab dieser Durchmischung stehen die Lager ineinander (Kontakt, Angriff). */
export const DURCHMISCHUNG_UEBER = 150;
/** Fürs Endspiel höchstens so viele Figuren auf dem ganzen Brett (Lichess). */
export const ENDSPIEL_BIS_FIGUREN = 6;
/** Fürs Endspiel höchstens so viele Punkte Figurenmaterial je Seite ohne Bauern (Speelman). */
export const ENDSPIEL_BIS_FIGURENPUNKTE = 13;

const REIHEN = 8;
/** Kantenlänge der Teilquadrate für die Durchmischung. */
const QUADRAT = 2;

/** Zahl der Figuren ohne Könige und Bauern auf dem Brett. */
export function figurenanzahl(brett: Board): number {
  return brett.occupied.diff(brett.king).diff(brett.pawn).size();
}

/** Hat eine Seite weniger als vier eigene Steine auf ihrer Grundreihe? */
export function grundreiheDuenn(brett: Board): boolean {
  const auf = (farbe: Color, reihe: number) =>
    [...brett[farbe]].filter((feld) => Math.floor(feld / REIHEN) === reihe).length;
  return auf("white", 0) < GRUNDREIHE_UNTER || auf("black", REIHEN - 1) < GRUNDREIHE_UNTER;
}

/**
 * Wert eines 2×2-Quadrats mit w weißen und s schwarzen Steinen auf Höhe y (1 bis 7 von Weiß aus):
 * gemischte Quadrate zählen viel, Steine einer Seite tief im Lager der anderen ebenfalls.
 * Die Tabelle folgt Lichess (Divider.scala, „score“).
 */
function quadratwert(y: number, w: number, s: number): number {
  const tabelle: Record<string, () => number> = {
    "0,1": () => 1 + y,
    "0,2": () => (y < 6 ? 2 + (6 - y) : 0),
    "0,3": () => (y < 7 ? 3 + (7 - y) : 0),
    "0,4": () => (y < 7 ? 3 + (7 - y) : 0),
    "1,0": () => 1 + (8 - y),
    "1,1": () => 5 + Math.abs(4 - y),
    "1,2": () => 4 + (7 - y),
    "1,3": () => 5 + (7 - y),
    "2,0": () => (y > 2 ? 2 + (y - 2) : 0),
    "2,1": () => 4 + (y - 1),
    "2,2": () => 7,
    "3,0": () => (y > 1 ? 3 + (y - 1) : 0),
    "3,1": () => 5 + (y - 1),
    "4,0": () => (y > 1 ? 3 + (y - 1) : 0),
  };
  return tabelle[`${w},${s}`]?.() ?? 0;
}

/**
 * Durchmischung der Stellung: Summe über alle 49 überlappenden 2×2-Quadrate.
 * Beispiel: Grundstellung → 0 (die Lager sind getrennt); nach heftigem Kampf im Zentrum über 150.
 */
export function durchmischung(brett: Board): number {
  let summe = 0;
  for (let y = 0; y < REIHEN - 1; y++) {
    for (let x = 0; x < REIHEN - 1; x++) {
      let w = 0;
      let s = 0;
      for (let dy = 0; dy < QUADRAT; dy++) {
        for (let dx = 0; dx < QUADRAT; dx++) {
          const feld = (y + dy) * REIHEN + x + dx;
          if (brett.white.has(feld)) w++;
          else if (brett.black.has(feld)) s++;
        }
      }
      summe += quadratwert(y + 1, w, s);
    }
  }
  return summe;
}

/** Der Grund, aus dem die Eröffnung trotz offener Entwicklung vorbei ist, oder null. */
export type Ausweggrund = "abtausch" | "grundreihe" | "kontakt";

/**
 * Ist die Eröffnung vorbei, obwohl nicht beide Seiten entwickelt und rochiert sind?
 * Beispiel: vier Figuren getauscht → „abtausch“; Grundstellung → null.
 */
export function ausweg(brett: Board): Ausweggrund | null {
  if (figurenanzahl(brett) <= MITTELSPIEL_BIS_FIGUREN) return "abtausch";
  if (grundreiheDuenn(brett)) return "grundreihe";
  if (durchmischung(brett) > DURCHMISCHUNG_UEBER) return "kontakt";
  return null;
}

/** Figurenpunkte einer Seite ohne Bauern und König. */
function figurenpunkte(brett: Board, farbe: Color): number {
  let summe = 0;
  for (const feld of brett[farbe]) {
    const figur = brett.get(feld);
    if (figur && figur.role !== "king" && figur.role !== "pawn") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/**
 * Wenig Material fürs Endspiel in eigenen Partien: jede Seite höchstens 13 Figurenpunkte oder
 * höchstens sechs Figuren auf dem Brett. Beispiel: je Turm, Turm und Läufer (13) → ja; je zwei
 * Türme und zwei Leichtfiguren (16) → nein, das ist ein damenloses Mittelspiel.
 */
export function wenigMaterialFuerEndspiel(brett: Board): boolean {
  const punkte =
    figurenpunkte(brett, "white") <= ENDSPIEL_BIS_FIGURENPUNKTE &&
    figurenpunkte(brett, "black") <= ENDSPIEL_BIS_FIGURENPUNKTE;
  return punkte || figurenanzahl(brett) <= ENDSPIEL_BIS_FIGUREN;
}
