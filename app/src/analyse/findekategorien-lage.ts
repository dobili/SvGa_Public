/**
 * Finde-Kategorien F1 bis F10, gemeinsamer Teil: Eingabe, Ergebnis, Schwellen und die Lage, die
 * alle Prüfungen einmal je Zug brauchen (Stellung, bester und gespielter Zug, beide Folgen).
 *
 * Rolle im Gesamtbild: Erkennungsschicht für „So findest du den besseren Zug“ (Konzept
 * docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 3.2, freigegeben vom Autor). Die Prüfungen selbst
 * stehen in findekategorien-taktik.ts (F1 bis F5), findekategorien-endspiel.ts (F6, F7) und
 * findekategorien-plan.ts (F8 bis F10); findekategorien.ts wählt nach der Priorität aus.
 * Die Schicht hat keine Oberfläche und keine Texte: Sie liefert nur Kennung und Details. Welche
 * Anzeige, welches Kapitel und welcher Trainer dazugehören, steht in spiel/buchbezug.ts.
 * Warum die Schwellen hier gesammelt stehen: Der Messlauf an den Lichess-Stellungen (Konzept,
 * Abschnitt 7, Schritt 4) soll sie nachstellen können, ohne die Prüfungen anzufassen; jede
 * Prüfung nimmt sie als Eingabe.
 * Abhängigkeiten: chessops, schach/dauerschach.ts, schach/stellung.ts, schach/phase.ts (Typ),
 * schach/eroeffnungsindex.ts (Typ).
 * Buchbezug: Kapitel 1 (Faustwerte, Zählen), Kapitel 7 (erzwingende Züge), Kapitel 8.
 */
import { Chess, normalizeMove } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSanAndPlay } from "chessops/san";
import type { Color, NormalMove, Piece, Role } from "chessops/types";
import { makeUci, opposite, parseUci } from "chessops/util";
import { materialstand } from "../schach/dauerschach";
import type { Eroeffnungsindex } from "../schach/eroeffnungsindex";
import type { Phase } from "../schach/phase";
import type { Mattbild } from "../schach/mattbilder";
import type { Motiv } from "../schach/taktikmotive";
import { stellungAusFen, type Stellung } from "../schach/stellung";

/**
 * Die Schwellen aller Finde-Kategorien. Werte in Bauerneinheiten, Längen in Halbzügen.
 * Der Messlauf kann eine geänderte Kopie an findeKategorie übergeben.
 */
export interface Findeschwellen {
  /** Grundbedingung für jede Kategorie: Verlust des gespielten Zuges gegenüber dem besten. */
  readonly verlustAb: number;
  /** Ab diesem Wert meint die Engine ein Matt (spielbewerter.ts: 100 minus Züge bis Matt). */
  readonly mattAb: number;
  /** F1: so viele eigene Züge rechnet die Mattsuche (mattsuche.ts, höchstens drei). */
  readonly mattsucheZuege: number;
  /** F2: ab diesem Rückstand (Material oder Wert nach dem gespielten Zug) steht man auf Verlust. */
  readonly rettungVerlustAb: number;
  /** F2: Der beste Zug hält etwa den Ausgleich, wenn sein Wert höchstens so weit unter null liegt. */
  readonly rettungAusgleichBis: number;
  /** F2: so viele eigene Schachs in Folge braucht ein Dauerschach. */
  readonly dauerschachSchachsAb: number;
  /** F3: Materialgewinn der Fortsetzung (zwei Bauern, wie beim Kommentar in „Zug erraten“). */
  readonly motivGewinnAb: number;
  /** F3: so viele Halbzüge der Fortsetzung prüft die Motiverkennung. */
  readonly motivHalbzuege: number;
  /** F3: Material zählt nach so vielen Halbzügen (nach der zweiten Antwort des Gegners). */
  readonly motivMaterialNach: number;
  /** F4: Abtauschbilanz des ausgelassenen Schlages (Kapitel 1, Zählen). */
  readonly schlagBilanzAb: number;
  /** F5: Materialgewinn der Fortsetzung des erzwingenden Zuges. */
  readonly roentgenGewinnAb: number;
  /** F5: Material zählt nach so vielen Halbzügen. */
  readonly roentgenMaterialNach: number;
  /** F6 ohne Datenbank (mehr als ein Bauer): Mindestverlust, weil die Regel dort nur Faustregel ist. */
  readonly oppositionVerlustAb: number;
  /** F9, F10: Faustregeln nur ab diesem Verlust (Konzept: mindestens ein halber Bauer). */
  readonly faustregelVerlustAb: number;
  /** F9, F10: Abstand zum zweitbesten Zug; darunter gibt es mehrere gute Wege (Konzept 5.2). */
  readonly abstandZweitbesterAb: number;
  /** F10: Verliert die Widerlegung so viel Material, hat der Fehler einen taktischen Grund. */
  readonly taktischerGrundAb: number;
}

/** Die Schwellen nach dem Konzept (Abschnitte 3.2 und 5). */
export const FINDE_SCHWELLEN: Findeschwellen = {
  verlustAb: 0.5,
  mattAb: 50,
  mattsucheZuege: 3,
  rettungVerlustAb: 3,
  rettungAusgleichBis: 1,
  dauerschachSchachsAb: 2,
  motivGewinnAb: 2,
  motivHalbzuege: 5,
  motivMaterialNach: 4,
  schlagBilanzAb: 1,
  roentgenGewinnAb: 1,
  roentgenMaterialNach: 4,
  oppositionVerlustAb: 1,
  faustregelVerlustAb: 0.5,
  abstandZweitbesterAb: 0.3,
  taktischerGrundAb: 1,
};

/** Was nur mit Buchdaten geht (F8). Fehlt es, schweigt die Kategorie. */
export interface Buchkontext {
  readonly eroeffnungsindex?: Eroeffnungsindex;
}

/**
 * Eingabe einer Prüfung: ein Zug mit „Besser war …“. Alle Werte aus Sicht der Seite, die in
 * `fenVorher` am Zug ist, in Bauerneinheiten (Matt als großer Wert wie in spielbewerter.ts).
 */
export interface Findeeingabe {
  readonly fenVorher: string;
  readonly gespielterZugUci: string;
  readonly besterZugUci: string;
  /** Hauptvariante der Engine ab `fenVorher`, beginnt mit dem besten Zug, bis sechs Halbzüge. */
  readonly varianteBest: readonly string[];
  /** Widerlegung: Hauptvariante nach dem gespielten Zug, beginnt mit der Antwort des Gegners. */
  readonly varianteNachGespielt: readonly string[];
  readonly wertVorher: number;
  readonly wertNachBest: number;
  readonly wertNachGespielt: number;
  readonly phase: Phase;
  /** Stellung vor dem letzten Zug des Gegners, für „nicht zurückgeschlagen“ (F4) und den Rückschlag. */
  readonly fenDavor?: string;
  /** Abstand des besten zum zweitbesten Zug, falls bekannt (F9, F10 schweigen darunter). */
  readonly abstandZweitbester?: number;
  readonly buchkontext?: Buchkontext;
}

export type Findekennung = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10";

/** Das Motiv einer Finde-Kategorie: ein Grundmotiv, eine Kombination oder die Rettungsart. */
export type Findemotiv = Motiv | "kombination";

/** Details eines Treffers, damit Anzeige und Statistik ohne neue Rechnung auskommen. */
export interface Findedetails {
  /** Der beste Zug in englischer Kurznotation (SAN), etwa „Nc7+“. */
  readonly zug: string;
  /** Das wichtigste Feld als Name, etwa „c7“ (Ziel des Zuges, Figur der LAP …). */
  readonly feld?: string;
  readonly motiv?: Findemotiv;
  readonly mattbild?: Mattbild;
  /** F1: Matt in so vielen eigenen Zügen. */
  readonly mattIn?: number;
  /** Materialgewinn der Fortsetzung oder Abtauschbilanz (Bauerneinheiten). */
  readonly gewinn?: number;
  /** F4: Der Gegner hat gerade auf diesem Feld geschlagen („nicht zurückgeschlagen“). */
  readonly zurueckschlagen?: boolean;
  /** F5: welche Art erzwingender Zug. */
  readonly art?: "schach" | "schlag" | "drohung";
  /** F6, F7: welche Regel des Kapitels 8. */
  readonly idee?: "opposition" | "schluesselfeld" | "freibauer" | "umwandlung" | "quadrat";
  /** F6: Urteil aus der Datenbank König und Bauer gegen König. */
  readonly datenbank?: boolean;
  /** F8: Name der Eröffnung, der Buchzug (SAN) und die Abbildung des Steckbriefs. */
  readonly eroeffnung?: string;
  readonly buchzug?: string;
  readonly abbildung?: string;
  /** F9: welches Eröffnungsziel. */
  readonly ziel?: "rochade" | "entwicklung" | "zentrum";
  /** F10: die am wenigsten aktive Figur und ihre freien Felder. */
  readonly figur?: Role;
  readonly freieFelder?: number;
}

export interface Findetreffer {
  readonly kennung: Findekennung;
  readonly details: Findedetails;
}

/** Ein gespielter Halbzug mit Stellung davor und danach. */
export interface Halbzug {
  readonly zug: NormalMove;
  readonly san: string;
  readonly figur: Piece;
  readonly geschlagen: Piece | null;
  readonly vorher: Chess;
  readonly nachher: Chess;
}

/** Alles, was die Prüfungen eines Zuges gemeinsam brauchen; einmal je Zug gebaut. */
export interface Findelage {
  readonly eingabe: Findeeingabe;
  readonly schwellen: Findeschwellen;
  readonly regeln: Chess;
  readonly stellung: Stellung;
  readonly seite: Color;
  /** Bester Zug und Fortsetzung (der beste Zug zuerst). */
  readonly folgeBest: readonly Halbzug[];
  /** Gespielter Zug und Widerlegung (der gespielte Zug zuerst). */
  readonly folgeGespielt: readonly Halbzug[];
  readonly best: Halbzug;
  readonly gespielt: Halbzug;
  /** Der letzte Zug des Gegners, falls `fenDavor` passt. */
  readonly voriger: Halbzug | null;
  /** Wert nach dem besten minus Wert nach dem gespielten Zug. */
  readonly verlust: number;
  /** Material der Seite am Zug als Ausgangspunkt: der bessere Stand vor und nach dem letzten Zug des Gegners. */
  readonly materialBasis: number;
}

/** Stellung mit Regeln aus einer FEN; null bei unlesbarer oder regelwidriger Stellung. */
function regelnAus(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isOk ? pos.value : null;
}

/** Spielt einen Zug (UCI, Rochade auch als Königszug um zwei Felder) und beschreibt ihn; null, wenn er nicht geht. */
export function halbzugAus(pos: Chess, uci: string): Halbzug | null {
  const roh = parseUci(uci);
  if (!roh || !("from" in roh)) return null;
  const zug = normalizeMove(pos, roh);
  if (!("from" in zug) || !pos.isLegal(zug)) return null;
  const figur = pos.board.get(zug.from);
  if (!figur) return null;
  const imWeg = pos.board.get(zug.to);
  const enPassant = figur.role === "pawn" && zug.to === pos.epSquare;
  const geschlagen: Piece | null =
    imWeg && imWeg.color !== figur.color
      ? imWeg
      : enPassant
        ? { role: "pawn", color: opposite(figur.color) }
        : null;
  const nachher = pos.clone();
  const san = makeSanAndPlay(nachher, zug);
  return { zug, san, figur, geschlagen, vorher: pos, nachher };
}

/** Spielt eine Folge ab einer Stellung, bis ein Zug nicht geht. */
export function folgeAus(pos: Chess, zuege: readonly string[]): Halbzug[] {
  const folge: Halbzug[] = [];
  let jetzt = pos;
  for (const uci of zuege) {
    const h = halbzugAus(jetzt, uci);
    if (!h) break;
    folge.push(h);
    jetzt = h.nachher;
  }
  return folge;
}

/** Der Zug des Gegners, der von `fenDavor` nach `regeln` führt; null, wenn keiner passt. */
function vorigerZug(fenDavor: string | undefined, regeln: Chess): Halbzug | null {
  const davor = fenDavor ? regelnAus(fenDavor) : null;
  if (!davor || davor.turn === regeln.turn) return null;
  const ziel = brettteil(regeln);
  for (const [von, ziele] of davor.allDests()) {
    for (const nach of ziele) {
      const h = halbzugAus(davor, makeUci({ from: von, to: nach }));
      if (h && brettteil(h.nachher) === ziel) return h;
    }
  }
  return null;
}

/** Nur die Figurenstellung einer FEN, für den Vergleich zweier Stellungen. */
function brettteil(pos: Chess): string {
  return makeFen(pos.toSetup()).split(" ")[0] ?? "";
}

/** Die Folge des besten Zuges: die Variante, notfalls mit dem besten Zug davor ergänzt. */
function besteFolge(regeln: Chess, eingabe: Findeeingabe): Halbzug[] {
  const variante = eingabe.varianteBest;
  const mitBestem =
    variante[0] === eingabe.besterZugUci ? variante : [eingabe.besterZugUci, ...variante];
  return folgeAus(regeln, mitBestem);
}

/**
 * Baut die Lage eines Zuges.
 *
 * Eingaben: Eingabe der Prüfung, Schwellen. Ausgabe: die Lage, oder null bei unlesbarer
 * Stellung, unmöglichem Zug oder wenn der gespielte der beste Zug ist (dann gibt es nichts zu
 * finden).
 * Beispiel: Opernpartie vor 16. Db8+ (Abb. 7.46), bester Zug „b3b8“, gespielt „d1d2“.
 */
export function baueFindelage(eingabe: Findeeingabe, schwellen: Findeschwellen): Findelage | null {
  const regeln = regelnAus(eingabe.fenVorher);
  const stellung = stellungAusFen(eingabe.fenVorher);
  if (!regeln || !stellung.ok) return null;
  const folgeBest = besteFolge(regeln, eingabe);
  const gespielt = halbzugAus(regeln, eingabe.gespielterZugUci);
  const best = folgeBest[0];
  if (!best || !gespielt || gleicherZug(best.zug, gespielt.zug)) return null;
  const folgeGespielt = [gespielt, ...folgeAus(gespielt.nachher, eingabe.varianteNachGespielt)];
  const voriger = vorigerZug(eingabe.fenDavor, regeln);
  const seite = regeln.turn;
  const basis = Math.max(
    materialstand(regeln, seite),
    voriger ? materialstand(voriger.vorher, seite) : Number.NEGATIVE_INFINITY,
  );
  return {
    eingabe,
    schwellen,
    regeln,
    stellung: stellung.wert,
    seite,
    folgeBest,
    folgeGespielt,
    best,
    gespielt,
    voriger,
    verlust: eingabe.wertNachBest - eingabe.wertNachGespielt,
    materialBasis: basis,
  };
}

/** Sind zwei Züge gleich (Herkunft, Ziel, Umwandlung)? */
export function gleicherZug(a: NormalMove, b: NormalMove): boolean {
  return a.from === b.from && a.to === b.to && a.promotion === b.promotion;
}

/**
 * Materialgewinn einer Folge für die Seite am Zug nach höchstens `nach` Halbzügen, gemessen am
 * Ausgangspunkt der Lage (ein bloßes Zurückschlagen zählt so nicht als Gewinn). Setzt die Seite
 * in der Folge matt, ist der Gewinn unendlich; wird sie mattgesetzt, minus unendlich.
 *
 * Regel: Kapitel 1, Faustwerte der Figuren; Vorbild training/zugkommentar.ts (istTaktisch).
 * Beispiel: Abb. 7.47, 1. Sc7+ Kd8 2. Sxa8 → +5 (der Turm).
 */
export function materialgewinn(lage: Findelage, folge: readonly Halbzug[], nach: number): number {
  let gewinn = 0;
  for (const [index, h] of folge.entries()) {
    if (h.nachher.isCheckmate())
      return h.figur.color === lage.seite ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    if (index < nach) gewinn = materialstand(h.nachher, lage.seite) - lage.materialBasis;
  }
  return gewinn;
}

/** Die Stellung nach einem Halbzug als Stellung der App (für Quadrat, Profil …). */
export function stellungNach(h: Halbzug): Stellung | null {
  const s = stellungAusFen(makeFen(h.nachher.toSetup()));
  return s.ok ? s.wert : null;
}

/** Die Grundbedingung für alle Kategorien: Der gespielte Zug verliert merklich. */
export function verliertMerklich(lage: Findelage): boolean {
  return lage.verlust >= lage.schwellen.verlustAb;
}
