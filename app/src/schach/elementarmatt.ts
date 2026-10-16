/**
 * Elementarmatt: Dame, Turm oder zwei Läufer mit König gegen den einzelnen König. Der Kasten
 * (die Felder, die dem König bleiben), Mattzüge, Pattgefahr, Sperr-, Abwarte- und Treibezüge.
 *
 * Rolle im Gesamtbild: Baustein für k8-elementarmatt. Pflichtenheft 6.3, Kapitel 8:
 * „Elementarmatt: Grau: Käfig, Rot: Pattgefahr“.
 * Abhängigkeiten: chessops, stellung.ts, opposition.ts, koenigsweg.ts.
 * Buchbezug: Kapitel 8, „Elementarmatt: Dame und König gegen König“ (Kastenmethode, Abb. 8.4 bis
 * 8.8) und „Turm und König gegen König“ (Gegenüberstellung, Abwartezug, Abb. 8.9 bis 8.15),
 * „Zwei Läufer“ (Wand, Abb. 8.16 bis 8.18).
 */
import { attacks, kingAttacks } from "chessops/attacks";
import type { Chess } from "chessops/chess";
import { makeSan } from "chessops/san";
import { SquareSet } from "chessops/squareSet";
import type { Color, NormalMove, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { koenigsabstand } from "./koenigsweg";
import { oppositionslage } from "./opposition";
import { gegner, type Stellung } from "./stellung";

/** Welches Elementarmatt vorliegt. */
export type Mattart = "dame" | "turm" | "zweiLaeufer" | "laeuferSpringer";

/** Ein Zug der starken Seite mit SAN. */
export interface Mattzug {
  readonly zug: NormalMove;
  readonly san: string;
  /** Größe des Kastens nach dem Zug, bei Sperr- und Abwartezügen. */
  readonly groesse?: number;
}

/** Die Lage eines Elementarmatts. */
export interface Elementarmatt {
  readonly art: Mattart;
  readonly stark: Color;
  readonly starkerKoenig: Square;
  readonly schwacherKoenig: Square;
  /** Der Kasten: die Felder, die der schwache König noch erreichen kann (sein Feld eingeschlossen). */
  readonly kaefig: readonly Square[];
  /** Stehen sich die Könige gegenüber (direkte Opposition)? */
  readonly gegenueber: boolean;
  readonly stand: "matt" | "patt" | "offen";
  /** Nur, wenn die starke Seite am Zug ist: */
  readonly mattzuege: readonly Mattzug[];
  readonly pattzuege: readonly Mattzug[];
  /** Stille, sichere Züge, die den Kasten verkleinern (Abb. 8.5: „verkleinert den Kasten“). */
  readonly sperrzuege: readonly Mattzug[];
  /** Züge der Sperrfigur, die den Kasten unverändert lassen und sicher sind. */
  readonly abwartezuege: readonly Mattzug[];
  /** Schachs, die den König sicher zurück- oder an den Rand treiben. */
  readonly treibezuege: readonly Mattzug[];
}

/** Die Dame darf den Kasten erst verkleinern, wenn der eigene König so nahe steht (Abb. 8.5). */
const DAME_NAHE_GENUG = 2;
/** Höchstens so viele Züge je Gruppe. */
const HOECHSTENS = { sperren: 3, abwarten: 6, treiben: 4 };
const LETZTE = 7;

/** Die Figuren der starken Seite außer dem König, als sortierte Rollenliste. */
function rollenOhneKoenig(stellung: Stellung, farbe: Color): string[] {
  const rollen: string[] = [];
  for (const feld of stellung.brett[farbe].diff(stellung.brett.king)) {
    rollen.push(stellung.brett.get(feld)?.role ?? "");
  }
  return rollen.sort();
}

/** Erkennt die Art aus den Figuren der starken Seite. */
function mattart(rollen: readonly string[]): Mattart | null {
  const schluessel = rollen.join(",");
  if (schluessel === "queen") return "dame";
  if (schluessel === "rook") return "turm";
  if (schluessel === "bishop,bishop") return "zweiLaeufer";
  if (schluessel === "bishop,knight") return "laeuferSpringer";
  return null;
}

/** Abstand eines Feldes zum nächsten Brettrand. */
function randabstand(feld: Square): number {
  const l = squareFile(feld);
  const r = squareRank(feld);
  return Math.min(l, LETZTE - l, r, LETZTE - r);
}

/** Sperrt die Figur in einer Richtung (Linie oder Reihe)? Vorzeichen des Abstands beider Könige. */
function sperrt(art: Mattart, schwach: number, stark: number): boolean {
  if (schwach === 0) return false;
  // Der Turm sperrt nur, wo er die Könige trennt (Abb. 8.9); die Dame auch zur Seite hin (8.4).
  return art === "dame" || stark === -schwach;
}

/**
 * Die Seite des Kastens: alle Felder jenseits der Reihe und der Linie der Sperrfigur, auf der
 * Seite des schwachen Königs (Abb. 8.4: „Die Dame sperrt die 6. Reihe und die c-Linie“).
 * Steht der König auf derselben Reihe oder Linie, sperrt sie in dieser Richtung nichts.
 */
function kastenseite(sperrfigur: Square, lage: Omit<Lage, "kasten">): SquareSet {
  const koenig = lage.schwacherKoenig;
  const dl0 = Math.sign(squareFile(koenig) - squareFile(sperrfigur));
  const dr0 = Math.sign(squareRank(koenig) - squareRank(sperrfigur));
  const sl = Math.sign(squareFile(lage.starkerKoenig) - squareFile(sperrfigur));
  const sr = Math.sign(squareRank(lage.starkerKoenig) - squareRank(sperrfigur));
  const dl = sperrt(lage.art, dl0, sl) ? dl0 : 0;
  const dr = sperrt(lage.art, dr0, sr) ? dr0 : 0;
  let felder = SquareSet.empty();
  for (let feld = 0; feld < 64; feld += 1) {
    const l = Math.sign(squareFile(feld) - squareFile(sperrfigur));
    const r = Math.sign(squareRank(feld) - squareRank(sperrfigur));
    if ((dl === 0 || l === dl) && (dr === 0 || r === dr)) felder = felder.with(feld);
  }
  return felder;
}

/** Alle Felder, die die starke Seite angreift (schwacher König weggedacht) oder besetzt. */
function gesperrt(brett: Stellung["brett"], stark: Color, schwacherKoenig: Square): SquareSet {
  const belegung = brett.occupied.without(schwacherKoenig);
  let felder = brett[stark];
  for (const feld of brett[stark]) {
    const figur = brett.get(feld);
    if (figur) felder = felder.union(attacks(figur, feld, belegung));
  }
  return felder;
}

/** Das Feld der Sperrfigur (Turm oder Dame) der starken Seite, sonst null. */
function sperrfigur(brett: Stellung["brett"], stark: Color): Square | null {
  const linienfiguren = brett[stark].intersect(brett.rook.union(brett.queen));
  return linienfiguren.first() ?? null;
}

/** Der Kasten als Fläche (Seite der Sperrfigur ohne gesperrte Felder) und als erreichbare Felder. */
interface Kasten {
  readonly flaeche: SquareSet;
  readonly felder: readonly Square[];
}

/**
 * Der Kasten: die Felder jenseits der Sperrfigur, die der schwache König über unangegriffene
 * Felder erreichen kann. Ohne Sperrfigur (zwei Läufer) zählt das ganze Brett.
 */
function kasten(brett: Stellung["brett"], lage: Omit<Lage, "kasten">): Kasten {
  const schwach = lage.schwacherKoenig;
  const figur = sperrfigur(brett, lage.stark);
  const seite = figur === null ? SquareSet.full() : kastenseite(figur, lage);
  // Die Fläche zählt nur die Sperre und den starken König; die Linien der Figur selbst teilen den
  // Kasten nur (Abb. 8.11: Th7 statt Te7 lässt den Kasten gleich, obwohl e8 frei wird).
  const flaeche = seite.diff(kingAttacks(lage.starkerKoenig)).diff(brett[lage.stark]);
  const erreichbar = flaeche.diff(gesperrt(brett, lage.stark, schwach));
  const gesehen = new Set<Square>([schwach]);
  const schlange: Square[] = [schwach];
  for (let i = 0; i < schlange.length; i += 1) {
    for (const nachbar of kingAttacks(schlange[i] as Square)) {
      if (gesehen.has(nachbar) || !erreichbar.has(nachbar)) continue;
      gesehen.add(nachbar);
      schlange.push(nachbar);
    }
  }
  return { flaeche, felder: [...gesehen].sort((a, b) => a - b) };
}

/** Spielt einen Zug auf einer Kopie der Regeln. */
function nach(regeln: Chess, zug: NormalMove): Chess {
  const kopie = regeln.clone();
  kopie.play(zug);
  return kopie;
}

/** Alle legalen Züge der Seite am Zug. */
function alleZuege(regeln: Chess): NormalMove[] {
  const zuege: NormalMove[] = [];
  for (const [from, ziele] of regeln.allDests()) {
    for (const to of ziele) zuege.push({ from, to });
  }
  return zuege;
}

/** Ist der Kasten danach kleiner geworden (Teilmenge mit weniger Feldern)? */
function kleiner(neu: SquareSet, alt: SquareSet): boolean {
  return neu.diff(alt).isEmpty() && neu.size() < alt.size();
}

/** Die Lage, aus der die Züge beurteilt werden. */
interface Lage {
  readonly art: Mattart;
  readonly stark: Color;
  readonly starkerKoenig: Square;
  readonly schwacherKoenig: Square;
  readonly kasten: Kasten;
}

/** Vergleichsmaß: bei Sperrfiguren die Fläche, bei Läufern die erreichbaren Felder. */
function mass(lage: Lage, k: Kasten): SquareSet {
  if (lage.art === "turm" || lage.art === "dame") return k.flaeche;
  return k.felder.reduce((menge, feld) => menge.with(feld), SquareSet.empty());
}

/**
 * Treibt das Schach den König zurück? Ja, wenn jede Antwort des Königs in einem kleineren Kasten
 * endet oder näher am Rand steht (Abb. 8.5: „3. Dc7+ treibt den König an den Rand“).
 */
function treibt(lage: Lage, danach: Chess, zug: NormalMove): boolean {
  const antworten = [...danach.dests(lage.schwacherKoenig)];
  if (antworten.length === 0) return false;
  const alt = mass(lage, lage.kasten);
  const alleKleiner = antworten.every((antwort) =>
    kleiner(mass(lage, kasten(danach.board, { ...lage, schwacherKoenig: antwort })), alt),
  );
  const naeherAmRand = antworten.every((a) => randabstand(a) < randabstand(lage.schwacherKoenig));
  return alleKleiner || (naeherAmRand && zug.to !== undefined);
}

/** Ordnet einen stillen Zug der Sperrfigur als Abwarte- oder Sperrzug ein. */
function stillerZug(
  lage: Lage,
  danach: Chess,
): { readonly art: "abwarten" | "sperren"; readonly groesse: number } | null {
  const alt = mass(lage, lage.kasten);
  const neu = mass(lage, kasten(danach.board, lage));
  if (neu.equals(alt)) return { art: "abwarten", groesse: neu.size() };
  if (!kleiner(neu, alt)) return null;
  const nahe = koenigsabstand(lage.starkerKoenig, lage.schwacherKoenig) <= DAME_NAHE_GENUG;
  return lage.art === "dame" && !nahe ? null : { art: "sperren", groesse: neu.size() };
}

/** Die Züge der starken Seite, sortiert nach Matt, Patt, Sperren, Abwarten und Treiben. */
function zuegeDerStarken(
  regeln: Chess,
  lage: Lage,
): Pick<Elementarmatt, "mattzuege" | "pattzuege" | "sperrzuege" | "abwartezuege" | "treibezuege"> {
  const gruppen = {
    matt: [] as Mattzug[],
    patt: [] as Mattzug[],
    sperren: [] as Mattzug[],
    abwarten: [] as Mattzug[],
    treiben: [] as Mattzug[],
  };
  for (const zug of alleZuege(regeln)) {
    const san = makeSan(regeln, zug);
    const danach = nach(regeln, zug);
    if (danach.isCheckmate()) gruppen.matt.push({ zug, san });
    else if (danach.isStalemate()) gruppen.patt.push({ zug, san });
    else if (regeln.board.get(zug.from)?.role === "king") continue;
    else if (koenigsabstand(zug.to, lage.schwacherKoenig) <= 1) continue;
    else if (danach.isCheck()) {
      if (treibt(lage, danach, zug)) gruppen.treiben.push({ zug, san });
    } else {
      const einordnung = stillerZug(lage, danach);
      if (einordnung) gruppen[einordnung.art].push({ zug, san, groesse: einordnung.groesse });
    }
  }
  return {
    mattzuege: gruppen.matt,
    pattzuege: gruppen.patt,
    sperrzuege: [...gruppen.sperren]
      .sort((a, b) => (a.groesse ?? 0) - (b.groesse ?? 0))
      .slice(0, HOECHSTENS.sperren),
    abwartezuege: gruppen.abwarten.slice(0, HOECHSTENS.abwarten),
    treibezuege: gruppen.treiben.slice(0, HOECHSTENS.treiben),
  };
}

/** Welche Seite allein steht und was die andere hat. */
function erkenne(stellung: Stellung): Omit<Lage, "kasten"> | null {
  for (const stark of ["white", "black"] as const) {
    const schwach = gegner(stark);
    if (stellung.brett[schwach].diff(stellung.brett.king).nonEmpty()) continue;
    const art = mattart(rollenOhneKoenig(stellung, stark));
    const starkerKoenig = stellung.brett.kingOf(stark);
    const schwacherKoenig = stellung.brett.kingOf(schwach);
    if (!art || starkerKoenig === undefined || schwacherKoenig === undefined) continue;
    return { art, stark, starkerKoenig, schwacherKoenig };
  }
  return null;
}

/**
 * Erkennt ein Elementarmatt und beschreibt den Kasten und die Züge der starken Seite.
 *
 * Eingabe: Stellung. Ausgabe: die Lage oder null, wenn nicht genau eine Seite allein mit dem König
 * steht und die andere Dame, Turm, zwei Läufer oder Läufer und Springer hat.
 * Beispiel: Abb. 8.4 (Dame c6, Könige d4 und e7): Kasten d8, e7, f7, f8, g7, g8, h7, h8.
 * Abb. 8.11 (Turm e7, Könige d6 und c8, Weiß am Zug): Abwartezüge Tf7, Tg7, Th7. Abb. 8.7:
 * Patt. Abb. 8.57 (Weiß am Zug): Kb6 wäre Patt (rot). Abb. 8.13: Sperrzug Ta4.
 * Sonderfälle: Züge nur, wenn die starke Seite am Zug ist und die Stellung offen ist; Züge der
 * Sperrfigur neben den König zählen nie („außer Reichweite des Königs“).
 */
export function elementarmatt(stellung: Stellung): Elementarmatt | null {
  const erkannt = erkenne(stellung);
  if (!erkannt) return null;
  const { regeln } = stellung;
  const stand = regeln?.isCheckmate() ? "matt" : regeln?.isStalemate() ? "patt" : "offen";
  const lage: Lage = {
    ...erkannt,
    kasten: kasten(stellung.brett, erkannt),
  };
  const leer = { mattzuege: [], pattzuege: [], sperrzuege: [], abwartezuege: [], treibezuege: [] };
  const zuege =
    regeln && stellung.amZug === lage.stark && stand === "offen"
      ? zuegeDerStarken(regeln, lage)
      : leer;
  return {
    ...erkannt,
    kaefig: lage.kasten.felder,
    gegenueber: oppositionslage(lage.starkerKoenig, lage.schwacherKoenig)?.art === "direkt",
    stand,
    ...zuege,
  };
}
