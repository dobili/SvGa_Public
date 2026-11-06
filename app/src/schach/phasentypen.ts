/**
 * Typen von Endspiel und Mittelspiel, die sich zuverlässig aus der Stellung ablesen lassen: das
 * Endspiel nach dem Material, das Mittelspiel nach der Bauernstruktur und wenigen Merkmalen
 * (Rochaden, Läufer).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (6.11.2026, Q15-1): Karten für Mittel- und Endspiel wie
 * die Eröffnungskarte, dort, wo die Phase beginnt. Nur Einordnungen, die eine Rechnung sicher
 * trifft; Pläne („Angriff am Damenflügel“) bleiben weg, weil sie sich nicht zuverlässig ablesen
 * lassen. Reine Funktionen; die Auswertung zeigt das Ergebnis als Karte.
 * Abhängigkeiten: chessops (Board, SquareSet).
 * Buchbezug: Kapitel 5 (Bauernstruktur als Skelett der Stellung), Kapitel 8 bis 10 (Endspiele nach
 * Material: Bauern-, Turm-, Leichtfiguren- und Damenendspiele).
 */
import type { Board } from "chessops/board";
import type { Color, Role, Square } from "chessops/types";
import { parseSquare, squareFile, squareRank } from "chessops/util";

/** Endspieltypen nach Material (ohne Könige). */
export type Endspieltyp =
  | "bauern"
  | "turm"
  | "dame"
  | "laeuferGleich"
  | "laeuferUngleich"
  | "springer"
  | "laeuferSpringer"
  | "turmLeichtfigur"
  | "gemischt";

/** Mittelspielmerkmale nach Bauernstruktur und Figuren. */
export type Mittelspielmerkmal =
  | "isolani"
  | "haengendeBauern"
  | "karlsbad"
  | "maroczy"
  | "igel"
  | "stonewall"
  | "franzoesischeKette"
  | "koenigsindischeKette"
  | "entgegengesetzteRochaden"
  | "ungleichfarbigeLaeufer"
  | "laeuferpaar";

const FARBEN: readonly Color[] = ["white", "black"];
const FIGUREN: readonly Role[] = ["knight", "bishop", "rook", "queen"];
/** Linien a bis h als Zahlen 0 bis 7 (chessops). */
const LINIE_C = 2;
const LINIE_D = 3;
const LINIE_E = 4;
const LINIE_B = 1;
/** König auf diesen Linien: Damenflügel (a bis c) bzw. Königsflügel (g, h). */
const DAMENFLUEGEL_BIS = 2;
const KOENIGSFLUEGEL_AB = 6;

/** Wie viele Figuren einer Art eine Seite hat. */
function anzahl(brett: Board, farbe: Color, rolle: Role): number {
  return brett.pieces(farbe, rolle).size();
}

/** Steht ein Bauer der Farbe auf dem Feld („d4“)? */
function bauer(brett: Board, farbe: Color, feld: string): boolean {
  const f = parseSquare(feld);
  return f !== undefined && brett.pieces(farbe, "pawn").has(f);
}

/** Hat die Farbe Bauern auf dieser Linie (0 = a)? */
function aufLinie(brett: Board, farbe: Color, linie: number): boolean {
  for (const f of brett.pieces(farbe, "pawn")) if (squareFile(f) === linie) return true;
  return false;
}

/** Die Feldfarbe (0 dunkel, 1 hell) eines Läufers. */
function feldfarbe(feld: Square): number {
  return (squareFile(feld) + squareRank(feld)) % 2;
}

/** Feldfarben der Läufer einer Seite. */
function laeuferfarben(brett: Board, farbe: Color): number[] {
  return [...brett.pieces(farbe, "bishop")].map(feldfarbe);
}

/** Je Seite: welche Figurenarten (ohne Bauern und König) sie hat. */
function figurenarten(brett: Board): Set<Role> {
  const arten = new Set<Role>();
  for (const farbe of FARBEN)
    for (const rolle of FIGUREN) if (anzahl(brett, farbe, rolle) > 0) arten.add(rolle);
  return arten;
}

/**
 * Der Endspieltyp nach Material. Beispiel: nur Türme und Bauern → „turm“; je ein Läufer auf
 * verschiedenen Feldfarben → „laeuferUngleich“.
 * Sonderfall: Mehrere Figurenarten ohne klare Gruppe → „gemischt“.
 */
export function endspieltyp(brett: Board): Endspieltyp {
  const arten = figurenarten(brett);
  if (arten.size === 0) return "bauern";
  const nur = (...r: Role[]) => [...arten].every((a) => r.includes(a));
  if (nur("rook")) return "turm";
  if (nur("queen")) return "dame";
  if (nur("bishop")) {
    const [w, s] = FARBEN.map((f) => laeuferfarben(brett, f));
    const eins = w?.length === 1 && s?.length === 1;
    return eins && w[0] !== s[0] ? "laeuferUngleich" : "laeuferGleich";
  }
  if (nur("knight")) return "springer";
  if (nur("bishop", "knight")) return "laeuferSpringer";
  if (nur("rook", "bishop", "knight") && arten.has("rook")) return "turmLeichtfigur";
  return "gemischt";
}

/** Isolani: d-Bauer ohne Bauern auf c- und e-Linie derselben Seite. */
function isolani(brett: Board, farbe: Color): boolean {
  return (
    aufLinie(brett, farbe, LINIE_D) &&
    !aufLinie(brett, farbe, LINIE_C) &&
    !aufLinie(brett, farbe, LINIE_E)
  );
}

/** Hängende Bauern: c- und d-Bauer nebeneinander, ohne b- und e-Bauern. */
function haengend(brett: Board, farbe: Color): boolean {
  const reihe = farbe === "white" ? "4" : "5";
  return (
    bauer(brett, farbe, `c${reihe}`) &&
    bauer(brett, farbe, `d${reihe}`) &&
    !aufLinie(brett, farbe, LINIE_B) &&
    !aufLinie(brett, farbe, LINIE_E)
  );
}

/** Feste Muster aus Bauernfeldern beider Seiten. */
const MUSTER: readonly {
  readonly merkmal: Mittelspielmerkmal;
  readonly passt: (b: Board) => boolean;
}[] = [
  {
    merkmal: "karlsbad",
    passt: (b) =>
      bauer(b, "white", "d4") &&
      bauer(b, "black", "d5") &&
      bauer(b, "black", "c6") &&
      !aufLinie(b, "white", LINIE_C) &&
      !aufLinie(b, "black", LINIE_E),
  },
  {
    merkmal: "maroczy",
    passt: (b) =>
      bauer(b, "white", "c4") &&
      bauer(b, "white", "e4") &&
      !aufLinie(b, "white", LINIE_D) &&
      !aufLinie(b, "black", LINIE_C),
  },
  {
    merkmal: "igel",
    passt: (b) =>
      ["a6", "b6", "d6", "e6"].every((f) => bauer(b, "black", f)) && !aufLinie(b, "black", LINIE_C),
  },
  {
    merkmal: "stonewall",
    passt: (b) =>
      ["c3", "d4", "e3", "f4"].every((f) => bauer(b, "white", f)) ||
      ["c6", "d5", "e6", "f5"].every((f) => bauer(b, "black", f)),
  },
  {
    merkmal: "franzoesischeKette",
    passt: (b) =>
      ["d4", "e5"].every((f) => bauer(b, "white", f)) &&
      ["d5", "e6"].every((f) => bauer(b, "black", f)),
  },
  {
    merkmal: "koenigsindischeKette",
    passt: (b) =>
      ["d5", "e4"].every((f) => bauer(b, "white", f)) &&
      ["d6", "e5"].every((f) => bauer(b, "black", f)),
  },
];

/** Stehen die Könige auf verschiedenen Flügeln (einer a bis c, der andere g oder h)? */
function entgegengesetzt(brett: Board): boolean {
  const linien = FARBEN.map((f) => {
    const k = brett.kingOf(f);
    return k === undefined ? null : squareFile(k);
  });
  const [w, s] = linien;
  if (w === null || s === null || w === undefined || s === undefined) return false;
  const dame = (l: number) => l <= DAMENFLUEGEL_BIS;
  const koenig = (l: number) => l >= KOENIGSFLUEGEL_AB;
  return (dame(w) && koenig(s)) || (koenig(w) && dame(s));
}

/** Läufermerkmale: ungleichfarbige Einzelläufer, oder eine Seite mit Läuferpaar gegen keins. */
function laeufermerkmale(brett: Board): Mittelspielmerkmal[] {
  const [w = [], s = []] = FARBEN.map((f) => laeuferfarben(brett, f));
  const ergebnis: Mittelspielmerkmal[] = [];
  if (w.length === 1 && s.length === 1 && w[0] !== s[0]) ergebnis.push("ungleichfarbigeLaeufer");
  if ((w.length === 2) !== (s.length === 2)) ergebnis.push("laeuferpaar");
  return ergebnis;
}

/**
 * Die Merkmale einer Mittelspielstellung, in fester Reihenfolge.
 * Beispiel: Damengambit, Abtauschvariante (W d4, S c6 d5, ohne weißen c- und schwarzen e-Bauern)
 * → „karlsbad“. Sonderfall: keine passende Struktur → leere Liste (die Karte entfällt).
 */
export function mittelspielmerkmale(brett: Board): Mittelspielmerkmal[] {
  const ergebnis: Mittelspielmerkmal[] = [];
  if (FARBEN.some((f) => isolani(brett, f))) ergebnis.push("isolani");
  if (FARBEN.some((f) => haengend(brett, f))) ergebnis.push("haengendeBauern");
  for (const m of MUSTER) if (m.passt(brett)) ergebnis.push(m.merkmal);
  if (entgegengesetzt(brett)) ergebnis.push("entgegengesetzteRochaden");
  return [...ergebnis, ...laeufermerkmale(brett)];
}
