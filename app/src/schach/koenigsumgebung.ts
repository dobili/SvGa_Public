/**
 * Königsumgebung: Nachbarfelder, Fluchtfelder, Bauernschild, Linien zum König.
 *
 * Rolle im Gesamtbild: Baustein „Königsumgebung“ des Stellungsprofils (Konzept 7.2), Grundlage
 * für W3 „König ohne Luft“ (Kapitel 4 und 7), die Königsprüfung der Zielbilanz (Kapitel 2), die
 * Königssicherheit der Faktorenbilanz (Kapitel 3) und die Mattbilder (Kapitel 7).
 * Abhängigkeiten: chessops, angreifer.ts, stellung.ts.
 * Buchbezug: Pflichtenheft 6.6, „W3 König ohne Luft: Der König hat kein Nachbarfeld, das leer
 * oder mit einer gegnerischen Figur besetzt ist und das der Gegner nicht angreift.“ Glossar
 * „Bauernschild: Die drei Bauern direkt vor dem rochierten König“.
 */
import { kingAttacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import { direkteAngreifer } from "./angreifer";
import { bauernJeLinie, eigeneReihe, feldAusEigener } from "./bauernprofil";
import { gegner, type Stellung } from "./stellung";

/** Linien, auf denen der König nach der Rochade steht: a bis c (lang), g und h (kurz). */
const LINIEN_LANG: readonly number[] = [0, 1, 2];
const LINIEN_KURZ: readonly number[] = [6, 7];
/** Schwerfiguren, die auf einer offenen Linie zum König gefährlich sind (Pflichtenheft 6.6). */
const SCHWERFIGUREN = new Set(["rook", "queen"]);

/** Eine Linie, die zum König führt, mit ihrem Zustand. */
export interface Koenigslinie {
  readonly linie: number;
  /** offen: ohne Bauern; halboffen: ohne eigene Bauern; geschlossen: mit eigenem Bauern. */
  readonly zustand: "offen" | "halboffen" | "geschlossen";
  /** Gegnerische Türme oder Damen auf dieser Linie. */
  readonly schwerfiguren: readonly Square[];
  /**
   * Die Schwerfiguren dieser Linie, zwischen denen und der Reihe des Königs kein Bauer steht:
   * Nur sie wirken wirklich auf der Linie zum König (C1.5: Der Turm f8 hinter f7 und f4 zählt in
   * Abb. 3.6 nicht).
   */
  readonly freieSchwerfiguren: readonly Square[];
}

/** Die Umgebung eines Königs. */
export interface Koenigsumgebung {
  readonly farbe: Color;
  readonly koenig: Square;
  readonly nachbarfelder: readonly Square[];
  /** Nachbarfelder, die der König betreten könnte: leer oder gegnerisch besetzt, nicht angegriffen. */
  readonly fluchtfelder: readonly Square[];
  /** Nachbarfelder, die eigene Figuren besetzen (Abb. 7.35: g7, h7, g8). */
  readonly eigeneBesetzt: readonly Square[];
  /** Nachbarfelder, die der Gegner angreift (Abb. 7.36: f8 und h8 beherrscht der Turm). */
  readonly angegriffen: readonly Square[];
  /** Steht der König auf einem Rochadeflügel und gibt es kein Rochaderecht mehr? */
  readonly rochiert: boolean;
  /** Die vordersten eigenen Bauern auf der Königslinie und ihren Nachbarlinien. */
  readonly bauernschild: readonly Square[];
  /** Wie viele Schildbauern höchstens ein Feld von ihrem Startfeld entfernt stehen. */
  readonly schildUnberuehrt: number;
  readonly linienZumKoenig: readonly Koenigslinie[];
  /** Steht der König im Schach? */
  readonly imSchach: boolean;
  /** Im Schach und am Zug: die Zahl der legalen Abwehrzüge; sonst null. */
  readonly abwehrzuege: number | null;
}

/** Die Zahl der legalen Züge, wenn die Farbe am Zug im Schach steht; sonst null. */
function abwehrzuegeVon(stellung: Stellung, farbe: Color): number | null {
  const regeln = stellung.regeln;
  if (!regeln || regeln.turn !== farbe || !regeln.isCheck()) return null;
  let anzahl = 0;
  for (const [, ziele] of regeln.allDests()) anzahl += ziele.size();
  return anzahl;
}

/** Ob die Farbe noch ein Rochaderecht hat. */
function hatRochaderecht(stellung: Stellung, farbe: Color): boolean {
  return stellung.regeln
    ? stellung.regeln.castles.castlingRights.intersect(stellung.brett[farbe]).nonEmpty()
    : false;
}

/**
 * Nachbarfelder, die der Gegner angreift. Der König selbst wird weggedacht, damit ein Turm auch
 * die Felder hinter dem König trifft (Abb. 7.36: Te8 beherrscht f8 und h8 durch den König).
 */
function angegriffeneNachbarn(
  brett: Board,
  koenig: Square,
  farbe: Color,
  nachbarn: SquareSet,
): Square[] {
  const ohneKoenig = brett.occupied.without(koenig);
  return [...nachbarn].filter(
    (feld) =>
      direkteAngreifer(brett, feld, gegner(farbe), ohneKoenig, SquareSet.empty()).length > 0,
  );
}

/**
 * Steht zwischen einer Figur und der Reihe des Königs auf ihrer Linie kein Bauer?
 *
 * Regel: Kapitel 3, Faktorenbilanz Abb. 3.6 („rochiert, aber ohne f-Bauern vor dem König“): Eine
 * Linie wirkt erst zum König, wenn kein Bauer, auch kein gegnerischer, sie sperrt.
 */
function ohneBauerDazwischen(brett: Board, von: Square, koenig: Square): boolean {
  const linie = squareFile(von);
  const unten = Math.min(squareRank(von), squareRank(koenig));
  const oben = Math.max(squareRank(von), squareRank(koenig));
  for (let reihe = unten + 1; reihe < oben; reihe++) {
    const feld = squareFromCoords(linie, reihe);
    if (feld !== undefined && brett.pawn.has(feld)) return false;
  }
  return true;
}

/** Die Linien des Königs und seiner Nachbarn mit Zustand und gegnerischen Schwerfiguren. */
function linienZum(brett: Board, koenig: Square, farbe: Color): Koenigslinie[] {
  const eigene = bauernJeLinie(brett, farbe);
  const gegnerische = bauernJeLinie(brett, gegner(farbe));
  const linie = squareFile(koenig);
  return [linie - 1, linie, linie + 1]
    .filter((l) => l >= 0 && l < 8)
    .map((l) => {
      const mitEigenen = (eigene[l] ?? []).length > 0;
      const mitGegnerischen = (gegnerische[l] ?? []).length > 0;
      const zustand = mitEigenen ? "geschlossen" : mitGegnerischen ? "halboffen" : "offen";
      const schwerfiguren = [...brett[gegner(farbe)]].filter((feld) => {
        const figur = brett.get(feld);
        return squareFile(feld) === l && figur !== undefined && SCHWERFIGUREN.has(figur.role);
      });
      const freieSchwerfiguren = schwerfiguren.filter((feld) =>
        ohneBauerDazwischen(brett, feld, koenig),
      );
      return { linie: l, zustand, schwerfiguren, freieSchwerfiguren };
    });
}

/** Der vorderste eigene Bauer vor dem König auf jeder der drei Linien (Glossar „Bauernschild“). */
function schildAus(brett: Board, koenig: Square, farbe: Color): Square[] {
  const eigene = bauernJeLinie(brett, farbe);
  const reiheKoenig = eigeneReihe(koenig, farbe);
  return [squareFile(koenig) - 1, squareFile(koenig), squareFile(koenig) + 1].flatMap((linie) => {
    const vorne = (eigene[linie] ?? []).find((bauer) => eigeneReihe(bauer, farbe) > reiheKoenig);
    return vorne === undefined ? [] : [vorne];
  });
}

/**
 * Die Umgebung des Königs einer Farbe.
 *
 * Eingaben: Stellung, Farbe. Ausgabe: Koenigsumgebung, oder null ohne König (Lehrbild).
 * Beispiel: Abb. 1.35 (nach 1. Dxh7#): Der schwarze König g8 hat kein Fluchtfeld: f8 ist durch
 * den eigenen Turm, g7 durch den eigenen Bauern verstellt, h8 und h7 kontrolliert die Dame.
 * Abb. 5.13: Das Luftloch h3 gibt dem König g1 das Fluchtfeld h2.
 * Sonderfälle: „rochiert“ ist aus einer Stellung allein nicht sicher ablesbar; die App nimmt es
 * an, wenn der König auf a bis c oder g bis h steht und kein Rochaderecht mehr besteht.
 */
export function koenigsumgebung(stellung: Stellung, farbe: Color): Koenigsumgebung | null {
  const { brett } = stellung;
  const koenig = brett.kingOf(farbe);
  if (koenig === undefined) return null;
  const nachbarn = kingAttacks(koenig);
  const eigeneBesetzt = [...nachbarn.intersect(brett[farbe])];
  const angegriffen = angegriffeneNachbarn(brett, koenig, farbe, nachbarn);
  const gesperrt = new Set([...eigeneBesetzt, ...angegriffen]);
  const fluchtfelder = [...nachbarn].filter((feld) => !gesperrt.has(feld));
  const bauernschild = schildAus(brett, koenig, farbe);
  const linieKoenig = squareFile(koenig);
  const aufRochadefluegel = LINIEN_LANG.includes(linieKoenig) || LINIEN_KURZ.includes(linieKoenig);
  const imSchach =
    direkteAngreifer(brett, koenig, gegner(farbe), brett.occupied, SquareSet.empty()).length > 0;
  return {
    farbe,
    koenig,
    nachbarfelder: [...nachbarn],
    fluchtfelder,
    eigeneBesetzt,
    angegriffen,
    rochiert: aufRochadefluegel && !hatRochaderecht(stellung, farbe),
    bauernschild,
    schildUnberuehrt: bauernschild.filter((bauer) => eigeneReihe(bauer, farbe) <= 2).length,
    linienZumKoenig: linienZum(brett, koenig, farbe),
    imSchach,
    abwehrzuege: abwehrzuegeVon(stellung, farbe),
  };
}

/** Feld vor dem König aus seiner Sicht, für Prüfungen wie „Luftloch“ (null am Rand). */
export function feldVorKoenig(umgebung: Koenigsumgebung, abstand = 1): Square | null {
  return feldAusEigener(
    squareFile(umgebung.koenig),
    eigeneReihe(umgebung.koenig, umgebung.farbe) + abstand,
    umgebung.farbe,
  );
}
