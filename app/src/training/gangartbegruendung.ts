/**
 * Begründungen im Trainer „Gangarten“: warum die Figur auf ein Feld darf oder nicht.
 *
 * Rolle im Gesamtbild: Regel L des Nebenchats (Wunsch des Autors, 30.10.2026: falsch heißt
 * begründet). Nach dem Prüfen bekommt jedes übersehene Zielfeld und jedes zu viel getippte Feld
 * einen Satz. Gründe in der Reihenfolge, in der ein Anfänger prüft: Gangart der Figur, Weg
 * versperrt, eigene Figur auf dem Feld, und erst dann die Regeln, die eine an sich mögliche
 * Bewegung verbieten: Fesselung, König würde ins Schach ziehen, das Schach bliebe bestehen.
 * Abhängigkeiten: chessops (Angriffe, Wege), schach/fesselungen.ts, analyse/stellungsprofil.ts,
 * schach/stellung.ts, i18n.
 * Buchbezug: Kapitel 0, die Gangarten der Figuren, Schach und regelgerechte Züge; Kapitel 2,
 * Fesselung.
 */
import { attacks, between } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Piece, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { profil } from "../analyse/stellungsprofil";
import { figurenname } from "../analyse/texte";
import { t } from "../i18n/sprache";
import { fesselungslinien } from "../schach/fesselungen";
import { feldAusName, feldname, ROLLENBUCHSTABE, stellungAusFen, type Stellung } from "../schach/stellung";

/** Vorwärts und Grundreihe der Bauern je Farbe (Doppelschritt vom Startfeld). */
const VOR: Readonly<Record<Color, number>> = { white: 1, black: -1 };
const BAUERNSTART: Readonly<Record<Color, number>> = { white: 1, black: 6 };
const REIHEN_JE_DOPPELSCHRITT = 2;

/** Die Gründe ohne weitere Angabe; „versperrt“ nennt zusätzlich das Feld der Sperre. */
type Einfachgrund =
  | "gangart"
  | "eigene"
  | "schlagLeer"
  | "besetztVorn"
  | "insSchach"
  | "gefesselt"
  | "schachBleibt"
  | "verboten"
  | "rochade";
type Grund = Einfachgrund | { readonly sperre: Square };

/** Kann der Bauer das Feld nach seiner Gangart erreichen (ohne auf Schach zu achten)? */
function bauerErreicht(
  brett: Board,
  von: Square,
  nach: Square,
  farbe: Color,
  ep: Square | undefined,
): "ja" | Einfachgrund {
  const dLinie = squareFile(nach) - squareFile(von);
  const dReihe = (squareRank(nach) - squareRank(von)) * VOR[farbe];
  const ziel = brett.get(nach);
  if (Math.abs(dLinie) === 1 && dReihe === 1) return ziel?.color !== farbe && (ziel || nach === ep) ? "ja" : "schlagLeer";
  if (dLinie !== 0) return "gangart";
  if (dReihe === 1) return ziel ? "besetztVorn" : "ja";
  const doppel = dReihe === REIHEN_JE_DOPPELSCHRITT && squareRank(von) === BAUERNSTART[farbe];
  if (!doppel) return "gangart";
  return ziel || brett.occupied.intersects(between(von, nach)) ? "besetztVorn" : "ja";
}

/** Zwei Felder seitwärts von der Grundreihe: ein Versuch zu rochieren. */
const ROCHADE_LINIEN = 2;
/** Grundreihen (0 = erste Reihe, 7 = achte Reihe) der Farben. */
const GRUNDREIHE: Readonly<Record<Color, number>> = { white: 0, black: 7 };
function istRochadeversuch(von: Square, nach: Square, figur: Piece): boolean {
  const grundreihe = GRUNDREIHE[figur.color];
  return (
    figur.role === "king" &&
    squareRank(von) === grundreihe &&
    squareRank(nach) === grundreihe &&
    Math.abs(squareFile(nach) - squareFile(von)) === ROCHADE_LINIEN
  );
}

/** Der erste Grund, warum die Figur nach ihrer Gangart nicht auf das Feld kommt, oder null. */
function gangartGrund(s: Stellung, von: Square, nach: Square, figur: Piece): Grund | null {
  const brett = s.brett;
  const ziel = brett.get(nach);
  if (figur.role === "pawn") {
    const ergebnis = bauerErreicht(brett, von, nach, figur.color, s.regeln?.epSquare);
    if (ergebnis === "ja") return ziel?.color === figur.color ? "eigene" : null;
    return ergebnis;
  }
  if (!attacks(figur, von, SquareSet.empty()).has(nach)) {
    // Die Rochade ist ein Königszug über zwei Felder; legal ist sie, wenn sie in den Zielen steht.
    // Steht sie dort nicht, ist sie hier verboten, nicht „so zieht die Figur nicht“ (Prüfung beim
    // Übernehmen, 31.10.2026).
    return istRochadeversuch(von, nach, figur) ? "rochade" : "gangart";
  }
  const sperre = [...between(von, nach).intersect(brett.occupied)][0];
  if (sperre !== undefined) return { sperre };
  return ziel?.color === figur.color ? "eigene" : null;
}

/** Warum ist ein nach der Gangart möglicher Zug trotzdem verboten? */
function regelGrund(s: Stellung, von: Square, figur: Piece): Einfachgrund {
  if (figur.role === "king") return "insSchach";
  const gefesselt = fesselungslinien(s.brett, profil(s).angriffskarte, figur.color).some(
    (l) => l.art === "direkt" && l.absolut && l.gefesselt.feld === von,
  );
  if (gefesselt) return "gefesselt";
  return s.regeln?.isCheck() ? "schachBleibt" : "verboten";
}

/** Der Satz zu einem zu viel getippten Feld. */
function falschSatz(s: Stellung, von: Square, nach: Square, figur: Piece): string {
  const feld = feldname(nach);
  const name = figurenname({ feld: von, figur });
  const grund = gangartGrund(s, von, nach, figur) ?? regelGrund(s, von, figur);
  if (typeof grund !== "string") {
    const stein = s.brett.get(grund.sperre);
    const im = stein ? figurenname({ feld: grund.sperre, figur: stein }) : feldname(grund.sperre);
    return t("koordinatentrainer.grund.versperrt", { feld, im });
  }
  if (grund === "gangart")
    return t("koordinatentrainer.grund.gangart", {
      feld,
      gangart: t(`koordinatentrainer.gangart.${ROLLENBUCHSTABE[figur.role]}`),
    });
  return t(`koordinatentrainer.grund.${grund}`, { feld, figur: name });
}

/**
 * Die Sätze nach dem Prüfen: übersehene Zielfelder (mit Schlag, wenn eine Figur fällt), dann die
 * zu viel getippten Felder mit Grund.
 * Beispiel: Springer c3, gefesselt durch den Läufer b4 an den König e1, getippt d5 → „d5: Der
 * Springer c3 ist an den König gefesselt und darf die Linie nicht verlassen.“
 */
export function gangartbegruendungen(
  fen: string,
  figurFeld: string,
  fehlend: readonly string[],
  falsch: readonly string[],
): string[] {
  const gelesen = stellungAusFen(fen);
  const von = feldAusName(figurFeld);
  const figur = gelesen.ok && von !== null ? gelesen.wert.brett.get(von) : undefined;
  if (!gelesen.ok || von === null || !figur) return [];
  const s = gelesen.wert;
  const uebersehen = fehlend.map((f) => {
    const nach = feldAusName(f);
    const opfer = nach === null ? undefined : s.brett.get(nach);
    if (nach === null || !opfer || opfer.color === figur.color)
      return t("koordinatentrainer.grund.darf", { feld: f });
    return t("koordinatentrainer.grund.schlag", { feld: f, opfer: figurenname({ feld: nach, figur: opfer }) });
  });
  const zuViel = falsch.flatMap((f) => {
    const nach = feldAusName(f);
    return nach === null || nach === von ? [] : [falschSatz(s, von, nach, figur)];
  });
  return [...uebersehen, ...zuViel];
}
