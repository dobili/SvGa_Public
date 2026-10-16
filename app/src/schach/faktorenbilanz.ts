/**
 * Faktorenbilanz, gezählter Teil: Material und Zeit (Kapitel 3), beide als Vergleich mit Waage.
 *
 * Rolle im Gesamtbild: Baustein für das Werkzeug k3-faktorenbilanz. Pflichtenheft 6.2:
 * „Material: Vergleich nach Faustwerten. Zeit: Vergleich nach Buchregel (Springer, Läufer, Dame,
 * Türme außerhalb ihres Startfeldes, Rochadeturm zählt, König und Bauern nicht, getauschte nicht,
 * zurückgekehrte nicht, ist Schwarz am Zug, eine Figur vom weißen Vorsprung abziehen).“ Beide
 * Teile sind exakt (Art E). Königssicherheit und Aktivität bewertet koenigUndAktivitaet.ts.
 * Abhängigkeiten: chessops, stellung.ts.
 * Buchbezug: Kapitel 3, „Kompensation messen statt fühlen: die Faktorenbilanz“ und die Zählhilfe.
 */
import type { Board } from "chessops/board";
import type { Color, Role, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import { FIGURENWERT } from "./stellung";

/** Figuren, die bei der Zeit zählen (Kapitel 3: „Springer, Läufer, Dame und Türme“). */
const ZEITFIGUREN: ReadonlySet<Role> = new Set(["knight", "bishop", "rook", "queen"]);
/** Startlinien je Figurenart auf der Grundreihe. */
const STARTLINIEN: Readonly<Partial<Record<Role, readonly number[]>>> = {
  knight: [1, 6],
  bishop: [2, 5],
  rook: [0, 7],
  queen: [3],
};
const GRUNDREIHE: Readonly<Record<Color, number>> = { white: 0, black: 7 };
/** Reihenfolge der Figuren im Spiel wie im Buch: „Sc3, Ld3, De2, Tf1“ (Abb. 3.34). */
const ZEITFOLGE: readonly Role[] = ["knight", "bishop", "queen", "rook"];
/** Figuren in der Reihenfolge, in der das Buch Material aufzählt (Abb. 6.31). */
const MATERIALFOLGE: readonly Role[] = ["queen", "rook", "bishop", "knight", "pawn"];

/** Ein Vergleich wie auf der Waage im Buch: Wer liegt vorn, und um wie viel? */
export interface Waage {
  /** Die Seite, die vorn liegt; null bei Gleichstand. */
  readonly vorn: Color | null;
  /** Vorsprung (Material in Bauerneinheiten, Zeit in Figuren), immer mindestens 0. */
  readonly um: number;
}

export interface Materialvergleich extends Waage {
  /** Material je Seite in Bauerneinheiten (Faustwerte, Kapitel 1). */
  readonly summe: Readonly<Record<Color, number>>;
  /** Figuren je Seite und Art, für die Aufzählung „Dame, Turm, Springer, vier Bauern“. */
  readonly bestand: Readonly<Record<Color, ReadonlyMap<Role, number>>>;
}

export interface Zeitvergleich extends Waage {
  /** Figuren im Spiel je Seite (Gold am Brett). */
  readonly imSpiel: Readonly<Record<Color, readonly Figurenstand[]>>;
  /** Schwarz am Zug: Vom weißen Vorsprung ist eine Figur abgezogen. */
  readonly schwarzAmZug: boolean;
}

function waage(weissMinusSchwarz: number): Waage {
  if (weissMinusSchwarz === 0) return { vorn: null, um: 0 };
  return { vorn: weissMinusSchwarz > 0 ? "white" : "black", um: Math.abs(weissMinusSchwarz) };
}

function bestandVon(brett: Board, farbe: Color): Map<Role, number> {
  const bestand = new Map<Role, number>();
  for (const rolle of MATERIALFOLGE) {
    bestand.set(rolle, brett.pieces(farbe, rolle).size());
  }
  return bestand;
}

function summeVon(bestand: ReadonlyMap<Role, number>): number {
  let summe = 0;
  for (const [rolle, anzahl] of bestand) summe += FIGURENWERT[rolle] * anzahl;
  return summe;
}

/**
 * Material beider Seiten nach den Faustwerten.
 *
 * Regel: Kapitel 3, Zählhilfe: „Vergleichen: Wer hat mehr Material, und wie viel mehr nach den
 * Faustwerten aus Kapitel 1?“ Beispiel: Abb. 3.10 (Muzio-Gambit): Schwarz +3, ein Springer.
 */
export function materialvergleich(brett: Board): Materialvergleich {
  const weiss = bestandVon(brett, "white");
  const schwarz = bestandVon(brett, "black");
  const summe = { white: summeVon(weiss), black: summeVon(schwarz) };
  return {
    ...waage(summe.white - summe.black),
    summe,
    bestand: { white: weiss, black: schwarz },
  };
}

/** Steht die Figur auf einem Startfeld ihrer Art? Dann ist sie (noch oder wieder) nicht im Spiel. */
function aufStartfeld(stand: Figurenstand): boolean {
  const linien = STARTLINIEN[stand.figur.role] ?? [];
  return (
    squareRank(stand.feld) === GRUNDREIHE[stand.figur.color] &&
    linien.includes(squareFile(stand.feld))
  );
}

function imSpielVon(brett: Board, farbe: Color): Figurenstand[] {
  const liste: Figurenstand[] = [];
  for (const feld of brett[farbe]) {
    const figur = brett.get(feld);
    if (!figur || !ZEITFIGUREN.has(figur.role)) continue;
    const stand = { feld: feld as Square, figur };
    if (!aufStartfeld(stand)) liste.push(stand);
  }
  const rang = (stand: Figurenstand) => ZEITFOLGE.indexOf(stand.figur.role);
  return liste.sort((a, b) => rang(a) - rang(b) || squareFile(a.feld) - squareFile(b.feld));
}

/**
 * Zeit: Figuren im Spiel beider Seiten.
 *
 * Regel: Kapitel 3, Zählhilfe: „Es zählen Springer, Läufer, Dame und Türme, die ihr Startfeld
 * verlassen haben, auch der Turm, der mit der Rochade kommt. König und Bauern zählen nicht,
 * getauschte Figuren für keine Seite, und eine Figur, die auf ihr Startfeld zurückgekehrt ist,
 * zählt nicht mehr. … Ist Schwarz am Zug, ziehe vom weißen Vorsprung eine Figur ab.“
 * Beispiel: Abb. 3.14 (Evans-Gambit): zwei gegen zwei, Schwarz am Zug, also Schwarz +1.
 * Sonderfall: Eine Figur auf dem Startfeld einer anderen Figur gleicher Art (Springer b1 auf
 * g1) gilt als auf dem Startfeld; das lässt sich aus der Stellung allein nicht unterscheiden.
 */
export function zeitvergleich(brett: Board, amZug: Color): Zeitvergleich {
  const imSpiel = { white: imSpielVon(brett, "white"), black: imSpielVon(brett, "black") };
  const schwarzAmZug = amZug === "black";
  const abzug = schwarzAmZug ? 1 : 0;
  return {
    ...waage(imSpiel.white.length - imSpiel.black.length - abzug),
    imSpiel,
    schwarzAmZug,
  };
}
