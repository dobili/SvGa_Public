/**
 * Drohungen und erzwingende Züge: Schachs, Schläge mit Bilanz, Drohungen nach der Buchdefinition.
 *
 * Rolle im Gesamtbild: Baustein „Drohungen“ des Stellungsprofils (Konzept 7.2). Darauf bauen die
 * Schach-Röntgen-Regel (k1-roentgen), Schritt 2 „erzwingende Züge“ (k7-erzwingend) und der
 * Sicherheitsblick (k12) auf. Konzept 7.2: „Ein Zug baut eine Drohung auf, wenn dieselbe Seite
 * danach, nochmals am Zug, Material gewinnen könnte (ein Schlag mit positiver Abtauschbilanz,
 * der vorher nicht ging) oder ein Matt in einem Zug hätte. Für die Drohungen des Gegners wird
 * gefragt, was er spielen würde, wenn er jetzt noch einmal am Zug wäre. Steht die Seite am Zug
 * im Schach, entfällt diese Frage.“
 * Abhängigkeiten: chessops, abtausch.ts, angreifer.ts, stellung.ts.
 * Buchbezug: Kapitel 1, Schach-Röntgen-Regel („Ein Zug droht etwas, wenn er im nächsten Zug
 * Material gewinnen oder mattsetzen würde“); Kapitel 7, Schritt 2.
 */
import { attacks, ray } from "chessops/attacks";
import type { Chess } from "chessops/chess";
import { makeSan } from "chessops/san";
import { SquareSet } from "chessops/squareSet";
import type { Color, Move, NormalMove, Role, Square } from "chessops/types";
import { makeUci, opposite, squareRank } from "chessops/util";
import { abtausch } from "./abtausch";
import { FIGURENWERT } from "./stellung";

/** Ein Zug mit Herkunft, Ziel und Schreibweise (SAN englisch wie in den Daten, dazu UCI). */
export interface Zugangabe {
  readonly von: Square;
  readonly nach: Square;
  readonly san: string;
  readonly uci: string;
}

/** Ein Schlag mit der Abtauschbilanz aus Sicht des Schlagenden (Kapitel 1, billigste zuerst). */
export interface Schlagzug extends Zugangabe {
  readonly geschlagen: Role;
  /** Gewinn in Bauerneinheiten, wenn der Gegner bestmöglich zurückschlägt oder aufhört. */
  readonly bilanz: number;
}

/** Ein Schach; `matt` sagt, ob es zugleich Matt ist. */
export interface Schachzug extends Zugangabe {
  readonly matt: boolean;
}

/** Eine Drohung: Materialgewinn durch einen Schlag oder Matt in einem Zug. */
export type Drohung =
  | { readonly art: "material"; readonly zug: Schlagzug }
  | { readonly art: "matt"; readonly zug: Zugangabe };

/** Ein Zug, der eine neue Drohung aufbaut (Röntgen-Frage 3). */
export interface DrohenderZug extends Zugangabe {
  readonly drohungen: readonly Drohung[];
}

/** Die erzwingenden Züge einer Seite (Kapitel 7, Schritt 2: Schachs, Schläge, Drohungen). */
export interface ErzwingendeZuege {
  readonly farbe: Color;
  readonly schachs: readonly Schachzug[];
  readonly schlaege: readonly Schlagzug[];
  readonly drohende: readonly DrohenderZug[];
}

/** Eine Kopie der Regeln, in der die gewünschte Farbe am Zug ist (Nullzug des Gegners). */
export function nullzug(regeln: Chess, farbe: Color): Chess {
  const kopie = regeln.clone();
  if (kopie.turn !== farbe) {
    kopie.turn = farbe;
    kopie.epSquare = undefined;
  }
  return kopie;
}

function angabe(regeln: Chess, zug: NormalMove): Zugangabe {
  return { von: zug.from, nach: zug.to, san: makeSan(regeln, zug), uci: makeUci(zug) };
}

/** Alle legalen Züge der Seite am Zug als NormalMove (ohne Einsetzen, das gibt es nicht). */
export function legaleZuege(regeln: Chess): NormalMove[] {
  const zuege: NormalMove[] = [];
  for (const [von, ziele] of regeln.allDests()) {
    for (const nach of ziele) {
      zuege.push({ from: von, to: nach });
    }
  }
  return zuege;
}

/**
 * Vorprüfung, ob ein Zug Schach geben kann, ohne ihn zu spielen.
 *
 * Warum: Die Drohungssuche spielt sonst für jeden Kandidaten jeden Folgezug (über tausend Kopien
 * je Stellung). Ein Zug kann nur Schach geben, wenn die Figur vom Zielfeld aus den König trifft,
 * das Startfeld auf einer Linie mit dem König liegt (Abzugsschach), ein Bauer umwandelt oder
 * der König rochiert (der Turm könnte Schach geben). Was hier durchkommt, wird gespielt und
 * genau geprüft; die Vorprüfung lässt nie ein Schach aus.
 */
function kannSchachGeben(regeln: Chess, zug: NormalMove, koenig: Square): boolean {
  const figur = regeln.board.get(zug.from);
  if (!figur) return false;
  const belegung = regeln.board.occupied.without(zug.from).with(zug.to);
  if (attacks(figur, zug.to, belegung).has(koenig)) return true;
  if (ray(zug.from, koenig).nonEmpty()) return true;
  if (figur.role === "pawn" && (squareRank(zug.to) === 0 || squareRank(zug.to) === 7)) return true;
  return figur.role === "king" && regeln.board[regeln.turn].has(zug.to);
}

/** Die Stellung nach einem Zug, auf einer Kopie. */
function nachZug(regeln: Chess, zug: Move): Chess {
  const kopie = regeln.clone();
  kopie.play(zug);
  return kopie;
}

/**
 * Bilanz eines bestimmten Schlages: Der genannte Angreifer schlägt zuerst, danach läuft die
 * Abtauschrechnung mit der billigsten Figur weiter (Kapitel 1).
 *
 * Warum nicht einfach abtausch(): Dort schlägt die billigste Figur zuerst; hier fragt das Buch
 * „Was gewinnt dieser Zug?“ (etwa Sxd3 mit dem Springer, obwohl ein Bauer billiger wäre).
 */
function bilanzDesSchlages(regeln: Chess, zug: NormalMove, geschlagen: Role): number {
  const schlaeger = regeln.board.get(zug.from);
  if (!schlaeger) return 0;
  const danach = nachZug(regeln, zug);
  const rueckschlag = abtausch(danach.board, zug.to);
  const verlust = rueckschlag ? Math.max(0, rueckschlag.bilanz) : 0;
  return FIGURENWERT[geschlagen] - verlust;
}

/** Ob ein Zug die Figur auf dem Zielfeld oder en passant einen Bauern schlägt. */
function geschlageneRolle(regeln: Chess, zug: NormalMove): Role | null {
  const opfer = regeln.board.get(zug.to);
  if (opfer && opfer.color !== regeln.turn) return opfer.role;
  const bauer = regeln.board.get(zug.from);
  return bauer?.role === "pawn" && zug.to === regeln.epSquare ? "pawn" : null;
}

/**
 * Alle Schläge der Seite am Zug mit ihrer Bilanz.
 *
 * Beispiel: Abb. 1.23 (Weiß am Zug): Sxc5 mit Bilanz 0 („ein schlichter Abtausch“).
 * Abb. 1.28 (Schwarz am Zug): Sxd4 mit Bilanz +1 (Sxd4 Sxd4 Dxd4).
 */
export function schlaege(regeln: Chess): Schlagzug[] {
  const ergebnis: Schlagzug[] = [];
  for (const zug of legaleZuege(regeln)) {
    const geschlagen = geschlageneRolle(regeln, zug);
    if (geschlagen === null) continue;
    ergebnis.push({
      ...angabe(regeln, zug),
      geschlagen,
      bilanz: bilanzDesSchlages(regeln, zug, geschlagen),
    });
  }
  return ergebnis;
}

/** Alle Züge der Seite am Zug, die Schach geben; Matt ist dabei vermerkt. */
export function schachs(regeln: Chess): Schachzug[] {
  const ergebnis: Schachzug[] = [];
  const koenig = regeln.board.kingOf(opposite(regeln.turn));
  for (const zug of legaleZuege(regeln)) {
    if (koenig !== undefined && !kannSchachGeben(regeln, zug, koenig)) continue;
    const danach = nachZug(regeln, zug);
    if (!danach.isCheck()) continue;
    ergebnis.push({ ...angabe(regeln, zug), matt: danach.isCheckmate() });
  }
  return ergebnis;
}

/**
 * Was die Seite am Zug sofort hätte: Schläge mit Gewinn und Matt in einem Zug.
 *
 * Eingaben: Regeln (die fragliche Seite am Zug). Ausgabe: Drohungen, Matt zuerst.
 * Beispiel: Abb. 1.34 (Weiß am Zug): Matt mit Dxh7#. Für Schwarz, wenn er am Zug wäre:
 * Sxd3 (+6: Dame gegen Springer) und Dxg5 (+3 … nur wenn der Springer ungedeckt wäre).
 */
export function sofortigeGewinne(regeln: Chess): Drohung[] {
  const matt: Drohung[] = schachs(regeln)
    .filter((zug) => zug.matt)
    .map((zug) => ({ art: "matt", zug }));
  const material: Drohung[] = schlaege(regeln)
    .filter((zug) => zug.bilanz > 0)
    .map((zug) => ({ art: "material", zug }));
  return [...matt, ...material];
}

/** Schlüssel, mit dem sich Drohungen vergleichen lassen („vorher nicht ging“). */
function schluessel(drohung: Drohung): string {
  return `${drohung.art}:${drohung.zug.uci}`;
}

/**
 * Die Drohungen einer Farbe: was sie hätte, wenn sie jetzt (nochmals) am Zug wäre.
 *
 * Warum: Röntgen-Frage 3 für den Gegner („Baut der Zug meines Gegners eine Drohung auf?“).
 * Eingaben: Regeln, Farbe. Ausgabe: Drohungen, oder null, wenn die Seite am Zug im Schach steht
 * (dann entfällt die Frage, Konzept 7.2) oder die Farbe selbst am Zug ist und im Schach steht.
 * Beispiel: Abb. 1.30 (Weiß am Zug): Schwarz droht Sxd4 (+1), „damit ist die Drohung gegen d4
 * echt“. Abb. 1.34: Schwarz droht Sxd3 und Dxg5.
 */
export function drohungenVon(regeln: Chess, farbe: Color): Drohung[] | null {
  if (regeln.isCheck()) return null;
  return sofortigeGewinne(nullzug(regeln, farbe));
}

/**
 * Züge der Seite am Zug, die eine neue Drohung aufbauen.
 *
 * Regel: Konzept 7.2: Nach dem Zug, nochmals am Zug, gäbe es einen Schlag mit Gewinn, den es
 * vorher nicht gab, oder ein Matt in einem Zug. Schachs und Schläge selbst zählen hier nicht,
 * sie stehen in den eigenen Listen (Reihenfolge der Röntgen-Regel).
 * Beispiel: Abb. 7.8 (Weiß am Zug): 1. g5! droht gxf6 (und nach dem Wegzug Dxh7#).
 * Sonderfälle: Steht die Seite am Zug im Schach, gibt es keine „vorher“-Liste; dann zählt jede
 * Drohung nach dem Zug.
 */
export function drohendeZuege(regeln: Chess): DrohenderZug[] {
  const vorher = new Set((drohungenVon(regeln, regeln.turn) ?? []).map(schluessel));
  const ergebnis: DrohenderZug[] = [];
  for (const zug of legaleZuege(regeln)) {
    if (geschlageneRolle(regeln, zug) !== null) continue;
    const danach = nachZug(regeln, zug);
    if (danach.isCheck()) continue;
    const neue = sofortigeGewinne(nullzug(danach, regeln.turn)).filter(
      (drohung) => !vorher.has(schluessel(drohung)),
    );
    if (neue.length > 0) ergebnis.push({ ...angabe(regeln, zug), drohungen: neue });
  }
  return ergebnis;
}

/**
 * Die erzwingenden Züge der Seite am Zug in der Reihenfolge des Buches: Schachs, Schläge,
 * Drohungen (Kapitel 7, Schritt 2; Kapitel 1, Schach-Röntgen-Regel).
 *
 * Eingaben: Regeln. Ausgabe: drei Listen. Beispiel: Abb. 1.23: Schachs [Sf6+, …], Schläge
 * [Sxc5 (0)], Drohungen […]. Die Schläge sind nach Bilanz absteigend sortiert.
 */
export function erzwingendeZuege(regeln: Chess): ErzwingendeZuege {
  return {
    farbe: regeln.turn,
    schachs: schachs(regeln),
    schlaege: schlaege(regeln).sort((a, b) => b.bilanz - a.bilanz),
    drohende: drohendeZuege(regeln),
  };
}

/** Felder, die eine Liste von Drohungen trifft (für Markierungen). */
export function bedrohteFelder(drohungen: readonly Drohung[]): SquareSet {
  return drohungen.reduce((menge, drohung) => menge.with(drohung.zug.nach), SquareSet.empty());
}
