/**
 * Faktorenbilanz, bewerteter Teil: Königssicherheit und Aktivität je Seite (gut, teils, schlecht).
 *
 * Rolle im Gesamtbild: Baustein für k3-faktorenbilanz. Pflichtenheft 6.2: „Königssicherheit und
 * Aktivität je Seite gut, teils oder schlecht“, Art N (automatische Einschätzung). Die Regeln
 * sind aus der Zählhilfe in Kapitel 3 abgeleitet und an den 18 Faktorenbilanzen des Buches
 * kalibriert (Königssicherheit 32 von 36, Aktivität 29 von 36 Wertungen wie im Buch).
 * Abweichung vom Pflichtenheft 6.6, vom Autor bestätigt (Entscheidungshilfe C2.1): Die dort
 * festgelegten Regeln trafen bei der Kalibrierung deutlich seltener (Königssicherheit 22 von 36,
 * Aktivität mit W7-Abzug höchstens 10 von 36, ohne 26 von 36). Dazu C1.5 (Grund „ohne f-Bauern“,
 * die Schwerfigur nur ohne Bauern dazwischen) und C1.6 (im Schach nie „gut“).
 * Abhängigkeiten: koenigsumgebung.ts, angriffskarte.ts, faktorenbilanz.ts.
 * Buchbezug: Kapitel 3, Zählhilfe („Wer ist rochiert oder kann bald rochieren? Welche Linien und
 * Diagonalen führen zum König? … Was tun alle Figuren, die im Spiel sind?“).
 */
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import type { Angriffskarte } from "./angriffskarte";
import type { Koenigslinie, Koenigsumgebung } from "./koenigsumgebung";

export type Einschaetzung = "gut" | "teils" | "schlecht";

/** Ab so vielen angegriffenen Nachbarfeldern ist ein König mit dünnem Schild in Gefahr (Abb. 6.31). */
const ANGEGRIFFEN_GEFAHR = 3;
/** Mindestens so viele Schildbauern (wie die Königsprüfung, Kapitel 2). */
const SCHILD_MINDESTENS = 2;
/** Ab so vielen Drohungen des Gegners „ist der Zug nicht frei“ (Abb. 3.14, 3.58). */
const DROHUNGEN_GEBUNDEN = 2;
/** Um so viel muss eine Seite bei der Aktivität vorn liegen, um „gut“ zu sein. */
const AKTIVITAET_VORSPRUNG = 2;

export interface Koenigseinschaetzung {
  readonly wertung: Einschaetzung;
  readonly grund:
    | "ohneDame"
    | "rochiertSchild"
    | "rochiertLinie"
    | "rochiertOhneBauer"
    | "rochiertGelockert"
    | "rochiertOffen"
    | "mitte"
    | "mitteOffen"
    | "imSchach"
    | "imSchachEinzig"
    | "fehlt";
  /**
   * Bei „rochiertOhneBauer“ die Linien ohne eigenen Bauern, auf denen eine gegnerische
   * Schwerfigur steht; bei „rochiertLinie“ die eine Linie, auf der sie frei zum König sieht.
   */
  readonly linien?: readonly Koenigslinie[];
  /** Bei „rochiertLinie“: der gegnerische Turm oder die Dame ohne Bauern vor sich. */
  readonly figur?: Square;
}

/** Linien ohne eigenen Bauern (offen oder halboffen), auf denen eine gegnerische Schwerfigur steht. */
function linienMitSchwerfigur(u: Koenigsumgebung): Koenigslinie[] {
  return u.linienZumKoenig.filter((l) => l.zustand !== "geschlossen" && l.schwerfiguren.length > 0);
}

/**
 * Rochierter König mit Schwerfigur auf einer Linie ohne eigenen Bauern, oder null.
 *
 * Regel: Kapitel 3, Abb. 3.6 und 3.42: „teils – rochiert, aber ohne f-Bauern vor dem König“.
 * Präzisierung nach C1.5 (Entscheidung des Autors): Den gegnerischen Turm oder die Dame nennt die
 * App nur, wenn zwischen ihm und dem König kein Bauer steht; der Turm f8 hinter f7 sieht nicht
 * zum König g1. Die Wertung „teils“ bleibt in beiden Fällen (am Buch geeicht).
 */
function linieAmKoenig(u: Koenigsumgebung): Koenigseinschaetzung | null {
  const linien = linienMitSchwerfigur(u);
  if (linien.length === 0) return null;
  const frei = linien.find((l) => l.freieSchwerfiguren.length > 0);
  const figur = frei?.freieSchwerfiguren[0];
  if (frei && figur !== undefined) {
    return { wertung: "teils", grund: "rochiertLinie", linien: [frei], figur };
  }
  return { wertung: "teils", grund: "rochiertOhneBauer", linien };
}

function rochierterKoenig(u: Koenigsumgebung): Koenigseinschaetzung {
  const linie = linieAmKoenig(u);
  if (linie) return linie;
  if (u.schildUnberuehrt < SCHILD_MINDESTENS && u.angegriffen.length >= ANGEGRIFFEN_GEFAHR) {
    return { wertung: "schlecht", grund: "rochiertOffen" };
  }
  if (u.schildUnberuehrt >= SCHILD_MINDESTENS || u.angegriffen.length === 0) {
    return { wertung: "gut", grund: "rochiertSchild" };
  }
  return { wertung: "teils", grund: "rochiertGelockert" };
}

/**
 * Königssicherheit einer Seite.
 *
 * Regeln (Kapitel 3, Zählhilfe; kalibriert): Ohne gegnerische Dame steht der König sicher, auch
 * in der Mitte (Abb. 3.24: „ohne Damen aber ungefährdet“). Rochiert: teils, wenn ein gegnerischer
 * Turm oder die Dame auf einer Linie ohne eigenen Bauern am König steht (Abb. 3.6: „ohne
 * f-Bauern vor dem König“), auch hinter gegnerischen Bauern; schlecht bei dünnem Schild und drei angegriffenen Nachbarfeldern
 * (Abb. 6.31); sonst gut. In der Mitte: schlecht, wenn die Königslinie offen oder halboffen ist
 * und der Gegner ein Nachbarfeld angreift (Abb. 3.10, 3.20, 11.26); sonst teils.
 * Steht der König im Schach, ist er nie „gut“, höchstens „teils“ (C1.6, Entscheidung des Autors:
 * Abb. 3.23, Weiß im Schach durch Lb4+, hieß vorher „gut, ohne gegnerische Dame“). Hat er im
 * Schach nur einen einzigen Zug, ist er „schlecht“ (Rückfrage C1 nach Nachlesen: Abb. 3.68,
 * „Weiß ist schon verloren“, nach 8. Ke2 folgt Lg4#).
 * Eingaben: Königsumgebung (oder null) und ob der Gegner eine Dame hat.
 * Ausgabe: Wertung, Grund und bei Linien die betroffenen Linien und die Schwerfigur.
 * Beispiel: Abb. 3.6 (Königsgambit), Weiß: „teils – rochiert, aber ohne f-Bauern vor dem König“.
 */
export function koenigssicherheit(
  u: Koenigsumgebung | null,
  gegnerHatDame: boolean,
): Koenigseinschaetzung {
  if (u === null) return { wertung: "schlecht", grund: "fehlt" };
  if (u.abwehrzuege === 1) return { wertung: "schlecht", grund: "imSchachEinzig" };
  const ohneSchach = koenigOhneSchach(u, gegnerHatDame);
  if (u.imSchach && ohneSchach.wertung === "gut") return { wertung: "teils", grund: "imSchach" };
  return ohneSchach;
}

/** Königssicherheit nach Rochade, Schild und Linien, ohne Blick auf ein Schach. */
function koenigOhneSchach(u: Koenigsumgebung, gegnerHatDame: boolean): Koenigseinschaetzung {
  if (!gegnerHatDame) return { wertung: "gut", grund: "ohneDame" };
  if (u.rochiert) return rochierterKoenig(u);
  const koenigslinie = u.linienZumKoenig.find((l) => l.linie === squareFile(u.koenig));
  const offen = koenigslinie !== undefined && koenigslinie.zustand !== "geschlossen";
  if (offen && u.angegriffen.length > 0) return { wertung: "schlecht", grund: "mitteOffen" };
  return { wertung: "teils", grund: "mitte" };
}

/** Kennzahlen der Aktivität einer Seite. */
export interface Aktivitaetszahlen {
  /** Figuren im Spiel (wie bei der Zeit). */
  readonly imSpiel: number;
  /** Gegnerische Figuren, die die Seite angreift. */
  readonly ziele: number;
  /** Drohungen der Seite (Schlag mit Gewinn oder Matt, als wäre sie am Zug). */
  readonly drohungen: number;
}

export interface Aktivitaetseinschaetzung {
  readonly wertung: Einschaetzung;
  readonly grund: "keineFigur" | "gebunden" | "vorn" | "ausgeglichen";
  readonly zahlen: Aktivitaetszahlen;
}

/** Kennzahlen einer Seite aus Angriffskarte, Zeit und Drohungen. */
export function aktivitaetszahlen(
  karte: Angriffskarte,
  farbe: Color,
  gegnerFarbe: Color,
  imSpiel: number,
  drohungen: number,
): Aktivitaetszahlen {
  const ziele = karte
    .figuren(gegnerFarbe)
    .filter((stand) => karte.angreiferVon(stand.feld, farbe).length > 0).length;
  return { imSpiel, ziele, drohungen };
}

function summe(z: Aktivitaetszahlen): number {
  return z.imSpiel + z.ziele + z.drohungen;
}

/**
 * Aktivität einer Seite im Vergleich mit dem Gegner.
 *
 * Regeln (Kapitel 3, Zählhilfe: „Greifen sie ein Ziel an, … stellen sie eine Drohung – oder sind
 * sie an eine Verteidigung gebunden? Muss die Seite am Zug eine Drohung abwehren?“; kalibriert):
 * schlecht, wenn keine Figur im Spiel ist (Abb. 3.10: „Keine Figur hat eine Aufgabe“) oder der
 * Gegner zwei Drohungen hat (Abb. 3.58: „Der Zug ist nicht frei“); gut, wenn Figuren im Spiel,
 * angegriffene Ziele und Drohungen zusammen mindestens zwei mehr sind als beim Gegner; sonst
 * teils.
 */
export function aktivitaet(
  eigen: Aktivitaetszahlen,
  gegner: Aktivitaetszahlen,
): Aktivitaetseinschaetzung {
  if (eigen.imSpiel === 0) return { wertung: "schlecht", grund: "keineFigur", zahlen: eigen };
  if (gegner.drohungen >= DROHUNGEN_GEBUNDEN) {
    return { wertung: "schlecht", grund: "gebunden", zahlen: eigen };
  }
  if (summe(eigen) >= summe(gegner) + AKTIVITAET_VORSPRUNG) {
    return { wertung: "gut", grund: "vorn", zahlen: eigen };
  }
  return { wertung: "teils", grund: "ausgeglichen", zahlen: eigen };
}
