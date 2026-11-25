/**
 * Das Motiv eines Moments der Partiebesprechung als Begriff des Spiels: Was war der Fehler (der
 * Gegner bekam danach eine Gabel, eine Figur hing), oder was hätte der bessere Zug gehabt?
 *
 * Rolle im Gesamtbild: Brücke zwischen den Analysebausteinen der App und den Begriffen der
 * Besprechung (regeln/besprechung.ts). Für Fehler gilt dieselbe Regel wie in der Fehlersuche der
 * Engine und im Rückblick (engine/fehlerart.ts, fehlerbefundIn; Kapitel 1, 4 und 7), für
 * verpasste Chancen, starke Züge und Fehler des Gegners die Motiverkennung der Aufgaben
 * (schach/taktikmotive.ts, erkenneMotive) auf der Hauptvariante der Engine. Rechnet nur für die
 * gewählten Momente (höchstens acht Stellungen), ohne Engine.
 * Abhängigkeiten: engine/fehlerart.ts, schach/taktikmotive.ts, spiel/erklaerung.ts, spiel/zuege.ts.
 */
import { makeSanAndPlay } from "chessops/san";
import { parseUci } from "chessops/util";
import { fehlerbefundIn, lageVon, type Fehlerbefund } from "../../engine/fehlerart";
import { erkenneMotive, type Motiv } from "../../schach/taktikmotive";
import { widerlegungAus } from "../../spiel/erklaerung";
import { regelstellung, sanZuUci } from "../../spiel/zuege";
import type { Begriff } from "../regeln/besprechung";
import type { Besprechungsmoment } from "../regeln/besprechungsmomente";

/** Ein Begriff und für wen er spricht: gegen den Helden (sein Fehler) oder für ihn (seine Chance). */
export interface Momentmotiv {
  readonly begriff: Begriff;
  readonly richtung: "gegen" | "fuer";
}

/** Was die Rechnung über die ausgewertete Partie braucht (je Stellung bzw. Halbzug). */
export interface Motivgrundlage {
  readonly fens: readonly string[];
  readonly sans: readonly string[];
  readonly beste: readonly string[];
  readonly varianten: readonly (readonly string[])[];
  readonly verluste: readonly number[];
  /** Wert je Stellung aus Sicht von Weiß (Bauern), für die Lage vor dem Zug; fehlt in Tests. */
  readonly werte?: readonly number[];
}

/** Motive aus Kapitel 7 und ihr Begriff (Gabel und Doppelangriff sind für Kinder dasselbe Wort). */
const BEGRIFF_JE_MOTIV: Readonly<Partial<Record<Motiv, Begriff>>> = {
  gabel: "gabel",
  doppelangriff: "gabel",
  fesselung: "fesselung",
  spiess: "spiess",
  abzug: "abzug",
  doppelschach: "abzug",
  hinlenkung: "hinlenkung",
  ablenkung: "hinlenkung",
  umwandlung: "umwandlung",
};

/** Fehlerarten mit festem Begriff (engine/fehlerart-typen.ts). */
const BEGRIFF_JE_FEHLERART: Readonly<Partial<Record<Fehlerbefund["art"], Begriff>>> = {
  figurHaengen: "haengend",
  bauerEingestellt: "haengend",
  falscherAbtausch: "haengend",
  schlagreflex: "haengend",
  verfruehteDame: "eroeffnung",
  koenigMitte: "eroeffnung",
  tempoverlust: "eroeffnung",
  bauernvorstoss: "struktur",
  bauernzugOhneNot: "struktur",
  koenigPassiv: "endspiel",
  pattGesetzt: "endspiel",
};

/** Begriff einer übersehenen Taktik (neue Gabel, gefährliche Linie, Motiv der Antwort). */
function taktikbegriff(befund: Fehlerbefund): Begriff | null {
  const taktik = befund.taktik;
  if (!taktik) return null;
  if (taktik.art === "gabel") return "gabel";
  if (taktik.art === "motiv") return BEGRIFF_JE_MOTIV[taktik.motiv] ?? null;
  const linie = taktik.linie.art;
  if (linie === "fesselung" || linie === "abzug") return linie;
  return "spiess";
}

/** Begriff eines Fehlerbefunds; null, wenn er zu keinem Begriff passt („ungenau“). */
export function fehlerbegriff(befund: Fehlerbefund): Begriff | null {
  if (befund.art === "drohungIgnoriert") {
    return befund.drohung?.art === "matt" ? "matt" : "haengend";
  }
  if (befund.art === "taktikUebersehen") return taktikbegriff(befund);
  return BEGRIFF_JE_FEHLERART[befund.art] ?? null;
}

/** Wandelt eine Zugfolge in UCI ab einer Stellung in SAN (englisch); bricht beim ersten falschen Zug ab. */
function sanFolge(fen: string, folge: readonly string[]): string[] {
  const regeln = regelstellung(fen);
  if (!regeln) return [];
  const sans: string[] = [];
  for (const uci of folge) {
    const zug = parseUci(uci);
    if (!zug || !regeln.isLegal(zug)) break;
    sans.push(makeSanAndPlay(regeln, zug));
  }
  return sans;
}

/**
 * Der Begriff einer Zugfolge (Motiv oder Matt), die die ziehende Seite in dieser Stellung spielt.
 * Beispiel: Stellung vor 3... Sxe5 mit Folge „Sxe5 Lxf7+“ → nichts; vor Sd5 mit Gabel → „gabel“.
 */
export function folgebegriff(fen: string, folge: readonly string[]): Begriff | null {
  const regeln = regelstellung(fen);
  const sans = sanFolge(fen, folge);
  if (!regeln || sans.length === 0) return null;
  const befund = erkenneMotive(regeln, sans);
  if (!befund) return null;
  if (befund.mattbild) return "matt";
  for (const motiv of befund.motive) {
    const begriff = BEGRIFF_JE_MOTIV[motiv];
    if (begriff) return begriff;
  }
  return null;
}

/** Die Hauptvariante einer Stellung, die mit ihrem besten Zug beginnt. */
export function besteFolge(g: Motivgrundlage, stelle: number): readonly string[] {
  return widerlegungAus(g.beste[stelle], g.varianten[stelle]);
}

/**
 * Der Befund zum Zug am Index (engine/fehlerart.ts, mit der Widerlegung der Engine danach), oder
 * null bei unlesbarer Stellung. Beispiel: 3... Sf6?? im Schäfermatt → „drohungIgnoriert“ (Dxf7#).
 */
export function fehlerbefundAn(g: Motivgrundlage, index: number): Fehlerbefund | null {
  const fen = g.fens[index] ?? "";
  const lage = lageVon(fen);
  const uci = sanZuUci(fen, g.sans[index] ?? "");
  if (!lage || !uci) return null;
  const widerlegung = besteFolge(g, index + 1);
  return fehlerbefundIn(lage, uci, widerlegung, g.verluste[index] ?? 0, g.beste[index]);
}

/** Der Fehler eines Zuges des Helden als Begriff. */
function fehlermotiv(g: Motivgrundlage, index: number): Momentmotiv | null {
  const befund = fehlerbefundAn(g, index);
  if (!befund) return null;
  if (befund.art === "schlagVerpasst") return { begriff: "haengend", richtung: "fuer" };
  const begriff = fehlerbegriff(befund);
  return begriff ? { begriff, richtung: "gegen" } : null;
}

/**
 * Das Motiv eines Moments, oder null, wenn keins zu erkennen ist.
 * Fehler, Patzer, ungenau: was der Gegner danach bekam (gegen). Verpasst, brillant, stark: was die
 * beste Folge an dieser Stelle hatte (für). Fehler des Gegners: was der Held danach hätte spielen
 * können (für, an der Stelle nach dem Fehler).
 */
export function momentmotiv(g: Motivgrundlage, moment: Besprechungsmoment): Momentmotiv | null {
  const i = moment.index;
  switch (moment.kategorie) {
    case "fehler":
    case "patzer":
    case "ungenau":
      return fehlermotiv(g, i);
    case "verpasst":
    case "brillant":
    case "stark":
      return fuer(folgebegriff(g.fens[i] ?? "", besteFolge(g, i)));
    case "gegnerfehler":
      return fuer(folgebegriff(g.fens[i + 1] ?? "", besteFolge(g, i + 1)));
    default:
      return null;
  }
}

function fuer(begriff: Begriff | null): Momentmotiv | null {
  return begriff ? { begriff, richtung: "fuer" } : null;
}
