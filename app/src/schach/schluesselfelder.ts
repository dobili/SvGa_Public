/**
 * Schlüsselfelder eines Bauern: Wohin der König will, damit der Bauer umwandelt.
 *
 * Rolle im Gesamtbild: Baustein für k8-schluesselfelder und k8-regeln. Pflichtenheft 6.3,
 * Kapitel 8: „Schlüsselfelder: Gold“.
 * Abhängigkeiten: chessops, bauernprofil.ts, koenigsweg.ts.
 * Buchbezug: Kapitel 8, „Schlüsselfelder: Wohin der König will“: Bauer auf der 2., 3. oder
 * 4. Reihe: die drei Felder zwei Reihen vor dem Bauern; 5. oder 6. Reihe: die sechs Felder eine
 * und zwei Reihen davor; Randbauer: die beiden letzten Felder der Nachbarlinie. „Gelingt es dem
 * König der angreifenden Seite, ein Schlüsselfeld zu besetzen, gewinnt er, ganz gleich, wer am
 * Zug ist, solange der Bauer nicht sofort verloren geht.“
 */
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import { eigeneReihe, feldAusEigener } from "./bauernprofil";
import { koenigsabstand } from "./koenigsweg";
import { gegner, type Stellung } from "./stellung";

/** Welche Regel des Buches die Felder bestimmt. */
export type Schluesselart = "drei" | "sechs" | "rand" | "keine";

/** Die Schlüsselfelder eines Bauern. */
export interface Schluesselfelder {
  readonly bauer: Square;
  readonly farbe: Color;
  readonly art: Schluesselart;
  readonly felder: readonly Square[];
}

/** Eigene Reihen (0 = Grundreihe): 2. bis 4. Reihe → drei Felder, 5. und 6. Reihe → sechs. */
const LETZTE_REIHE_DREI = 3;
const LETZTE_REIHE_SECHS = 5;
/** Die beiden letzten Felder der Nachbarlinie beim Randbauern (eigene 7. und 8. Reihe). */
const RANDREIHEN: readonly number[] = [6, 7];
const LINIE_A = 0;
const LINIE_H = 7;
/** Nachbarlinien des Bauern: links, gleiche Linie, rechts. */
const NACHBARN: readonly number[] = [-1, 0, 1];

/** Die Felder der Nachbarlinien in dieser eigenen Reihe, innerhalb des Bretts. */
function reihenfelder(linie: number, reihe: number, farbe: Color): Square[] {
  return NACHBARN.map((d) => feldAusEigener(linie + d, reihe, farbe)).filter(
    (feld): feld is Square => feld !== null,
  );
}

/**
 * Bestimmt die Schlüsselfelder eines Bauern nach der Tabelle des Buches.
 *
 * Eingaben: Feld und Farbe des Bauern. Ausgabe: Art und Felder (leer auf der 7. Reihe, dort
 * nennt das Buch keine).
 * Beispiel: Abb. 8.25, Bauer e4 → d6, e6, f6. Abb. 8.26, Bauer e5 → d6, e6, f6, d7, e7, f7.
 * Abb. 8.61, Bauer a4 → b7 und b8. Für Schwarz gespiegelt (Bauer e5 → d3, e3, f3).
 */
export function schluesselfelder(bauer: Square, farbe: Color): Schluesselfelder {
  const linie = squareFile(bauer);
  const reihe = eigeneReihe(bauer, farbe);
  if (linie === LINIE_A || linie === LINIE_H) {
    const nachbar = linie === LINIE_A ? linie + 1 : linie - 1;
    const felder = RANDREIHEN.map((r) => feldAusEigener(nachbar, r, farbe)).filter(
      (feld): feld is Square => feld !== null,
    );
    return { bauer, farbe, art: "rand", felder };
  }
  if (reihe <= LETZTE_REIHE_DREI) {
    return { bauer, farbe, art: "drei", felder: reihenfelder(linie, reihe + 2, farbe) };
  }
  if (reihe <= LETZTE_REIHE_SECHS) {
    const felder = [
      ...reihenfelder(linie, reihe + 1, farbe),
      ...reihenfelder(linie, reihe + 2, farbe),
    ];
    return { bauer, farbe, art: "sechs", felder };
  }
  return { bauer, farbe, art: "keine", felder: [] };
}

/** Wie die Könige zu den Schlüsselfeldern stehen. */
export interface Schluesselstand {
  /** Das Schlüsselfeld, auf dem der eigene König steht, sonst null. */
  readonly besetzt: Square | null;
  /** Schlüsselfelder, die der eigene König mit einem Zug betreten darf (nach den Regeln). */
  readonly erreichbar: readonly Square[];
  /** Kleinster Abstand des eigenen und des gegnerischen Königs zu einem Schlüsselfeld. */
  readonly abstandEigen: number | null;
  readonly abstandGegner: number | null;
}

/** Kleinster Königsabstand eines Feldes zu einer Feldmenge. */
function kleinsterAbstand(von: Square | undefined, felder: readonly Square[]): number | null {
  if (von === undefined || felder.length === 0) return null;
  return Math.min(...felder.map((feld) => koenigsabstand(von, feld)));
}

/**
 * Stellt fest, ob der König der Bauernfarbe ein Schlüsselfeld besetzt oder erreicht.
 *
 * Warum: „Wichtig ist auch der Unterschied zwischen dem König vor dem Bauern (er besetzt
 * Schlüsselfelder) und dem König neben dem Bauern (er muss sie erst noch erreichen).“
 * Beispiel: Abb. 8.27 (Weiß am Zug): König d3 erreicht c4, d4 oder e4. Abb. 8.28 (Schwarz am
 * Zug): derselbe König, aber nach 1... Kd5 ist keines mehr erreichbar.
 * Sonderfall: Erreichbar nur, wenn die Bauernfarbe am Zug ist und die Regeln vorliegen.
 */
export function schluesselstand(stellung: Stellung, sf: Schluesselfelder): Schluesselstand {
  const eigener = stellung.brett.kingOf(sf.farbe);
  const fremder = stellung.brett.kingOf(gegner(sf.farbe));
  const besetzt = eigener !== undefined && sf.felder.includes(eigener) ? eigener : null;
  const darfZiehen = stellung.regeln && stellung.amZug === sf.farbe && eigener !== undefined;
  const ziele = darfZiehen && stellung.regeln ? stellung.regeln.dests(eigener) : null;
  return {
    besetzt,
    erreichbar: ziele ? sf.felder.filter((feld) => ziele.has(feld)) : [],
    abstandEigen: kleinsterAbstand(eigener, sf.felder),
    abstandGegner: kleinsterAbstand(fremder, sf.felder),
  };
}

/**
 * Sonderfall des Buches: Bauer auf der 6. Reihe, der verteidigende König direkt davor.
 *
 * Regel: „Hier entscheidet, ob der Bauer ohne Schach auf die 7. Reihe kommt. Rückt er mit Schach
 * vor, zieht der König vor ihn, und der Angreifer muss den Bauern aufgeben oder patt setzen.“
 * Ausgabe: null, wenn der Fall nicht vorliegt; sonst, ob der Bauernzug mit Schach käme (der
 * König steht schräg vor dem Bauern) und die Felder, von denen aus der Verteidiger das erzwingt.
 * Beispiel: Abb. 8.29 (König e8, Bauer e6): ohne Schach, Weiß gewinnt mit 1. e7. Abb. 8.30:
 * Schwarz am Zug spielt 1... Kd8, danach kommt e7 mit Schach.
 */
export function sechsteReihe(
  stellung: Stellung,
  bauer: Square,
  farbe: Color,
): { readonly mitSchach: boolean; readonly schachfelder: readonly Square[] } | null {
  const SECHSTE = 5;
  if (eigeneReihe(bauer, farbe) !== SECHSTE) return null;
  const fremder = stellung.brett.kingOf(gegner(farbe));
  const linie = squareFile(bauer);
  const vorne = [
    feldAusEigener(linie, SECHSTE + 1, farbe),
    feldAusEigener(linie, SECHSTE + 2, farbe),
  ];
  const schachfelder = [-1, 1]
    .map((d) => feldAusEigener(linie + d, SECHSTE + 2, farbe))
    .filter((feld): feld is Square => feld !== null);
  if (fremder === undefined || ![...vorne, ...schachfelder].includes(fremder)) return null;
  return { mitSchach: schachfelder.includes(fremder), schachfelder };
}
