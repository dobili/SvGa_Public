/**
 * Die Regel des Quadrats: Holt der gegnerische König einen Freibauern ein?
 *
 * Rolle im Gesamtbild: Baustein für k8-quadrat und k8-regeln (Regel 6). Pflichtenheft 6.3,
 * Kapitel 8: „Quadratregel (einschließlich Zugrecht und Doppelschritt): Grau: Quadrat,
 * Gold/Rot: König“.
 * Abhängigkeiten: chessops, bauernprofil.ts, bauernschwaechen.ts, koenigsweg.ts.
 * Buchbezug: Kapitel 8, „Holt der König ihn ein? Die Regel des Quadrats“: „Ziehe vom Freibauern
 * bis zum Umwandlungsfeld ein Quadrat, zur Seite des gegnerischen Königs hin … Kann der
 * gegnerische König es betreten, wenn er am Zug ist, holt er den Bauern ein … Steht der Bauer
 * noch auf seinem Ausgangsfeld … Zeichne das Quadrat dann so, als stünde der Bauer schon eine
 * Reihe weiter.“ Schachtipp: Die Regel gilt für einen einzelnen Freibauern, dem kein eigener
 * König hilft und den nichts aufhält.
 * Präzisierungen nach den Entscheidungen des Autors vom 16.10.2026: Steht der eigene König vor
 * oder neben dem Bauern, gilt die Regel nicht (C1.23, Abb. 8.19); verbundene Freibauern schützen
 * sich gegenseitig (C1.21, Abb. 8.50); ein Bauer hinter einem eigenen Bauern zählt nicht als
 * eigener Freibauer, und der Bauer, der mit dem nächsten Zug zum Freibauern wird, zählt mit
 * (C1.22, Abb. 8.46).
 */
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { eigeneReihe, feldAusEigener } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import { koenigsabstand } from "./koenigsweg";
import { gegner, stellungAusFen, type Stellung } from "./stellung";

/** Warum die Regel hier nur eine Näherung ist (Schachtipp des Buches). */
export type Vorbehalt = "blockiert" | "eigenerKoenig" | "weitereFiguren";

/**
 * Warum die Regel hier kein Urteil gibt: Der eigene König begleitet den Bauern (C1.23), oder ein
 * verbundener Freibauer schützt ihn, sodass der König ihn nicht einfach einholt (C1.21).
 */
export type Ausnahme = "begleitet" | "verbunden";

/** Ein gezeichnetes Quadrat: Startfeld, Länge, Ecken auf der Seite des Königs, alle Felder. */
export interface Quadratrahmen {
  /** Von welchem Feld aus gezählt wird: am Bauern, eine Reihe weiter beim Doppelschritt. */
  readonly start: Square;
  /** Züge des Bauern bis zur Umwandlung, von `start` aus. */
  readonly schritte: number;
  /** Die Ecke des Quadrats auf der Seite des Königs, in der Reihe des Starts und der Umwandlung. */
  readonly seiteStart: Square;
  readonly seiteEnde: Square;
  readonly felder: readonly Square[];
}

/** Das Quadrat eines Freibauern. */
export interface Quadrat extends Quadratrahmen {
  readonly bauer: Square;
  readonly farbe: Color;
  readonly umwandlungsfeld: Square;
  /**
   * Ist die Bauernseite am Zug: das Quadrat nach dem Bauernzug (eine Reihe kleiner). Daran wird
   * gemessen, ob der König einholt; gezeichnet wird wie im Buch das Quadrat am Bauern.
   */
  readonly nachZug: Quadratrahmen | null;
  readonly koenigGegner: Square | null;
  /** Holt der gegnerische König den Bauern ein? null ohne gegnerischen König. */
  readonly haeltAuf: boolean | null;
  readonly doppelschritt: boolean;
  readonly bauerAmZug: boolean;
  readonly vorbehalte: readonly Vorbehalt[];
  /** Gibt die Regel hier kein Urteil? Dann zählt `haeltAuf` nicht. */
  readonly ausnahme: Ausnahme | null;
  /** Der verbundene Freibauer daneben (Abb. 8.50: f6 neben e5), sonst null. */
  readonly partner: Square | null;
}

const GRUNDREIHE_DES_BAUERN = 1;
const LETZTE_REIHE = 7;
const LINIEN = 8;
/** Der König betritt das Quadrat, wenn er darin steht oder direkt daneben. */
const BETRETEN = 1;

/** Alle Felder des Rechtecks zwischen zwei Ecken. */
function rechteck(a: Square, b: Square): Square[] {
  const felder: Square[] = [];
  const [l1, l2] = [Math.min(squareFile(a), squareFile(b)), Math.max(squareFile(a), squareFile(b))];
  const [r1, r2] = [Math.min(squareRank(a), squareRank(b)), Math.max(squareRank(a), squareRank(b))];
  for (let r = r1; r <= r2; r += 1) for (let l = l1; l <= l2; l += 1) felder.push(r * 8 + l);
  return felder;
}

/** Steht etwas auf dem Weg des Bauern (ab dem Feld vor ihm bis zur Umwandlung)? */
function blockiert(stellung: Stellung, bauer: Square, farbe: Color): boolean {
  for (let reihe = eigeneReihe(bauer, farbe) + 1; reihe <= LETZTE_REIHE; reihe += 1) {
    const feld = feldAusEigener(squareFile(bauer), reihe, farbe);
    if (feld !== null && stellung.brett.get(feld)) return true;
  }
  return false;
}

/** Die Vorbehalte des Schachtipps: blockiert, eigener König hilft, weitere Figuren am Brett. */
function vorbehalte(
  stellung: Stellung,
  bauer: Square,
  farbe: Color,
  felder: readonly Square[],
): Vorbehalt[] {
  const liste: Vorbehalt[] = [];
  if (blockiert(stellung, bauer, farbe)) liste.push("blockiert");
  const eigener = stellung.brett.kingOf(farbe);
  if (eigener !== undefined && felder.some((feld) => koenigsabstand(feld, eigener) <= BETRETEN)) {
    liste.push("eigenerKoenig");
  }
  if (stellung.brett.occupied.diff(stellung.brett.king).diff(stellung.brett.pawn).nonEmpty()) {
    liste.push("weitereFiguren");
  }
  return liste;
}

/**
 * Steht der eigene König vor oder neben dem Bauern (C1.23)?
 *
 * Regel: Kapitel 8, Schachtipp zum Quadrat: Die Regel gilt für einen Bauern, dem kein eigener
 * König hilft. „Vor oder neben“: direkt daneben (Königsabstand 1) oder auf der Linie des Bauern
 * oder einer Nachbarlinie vor ihm. Beispiel: Abb. 8.19, König e4 vor dem Bauern e3.
 */
export function koenigBegleitet(stellung: Stellung, bauer: Square, farbe: Color): boolean {
  const koenig = stellung.brett.kingOf(farbe);
  if (koenig === undefined) return false;
  const nebenlinie = Math.abs(squareFile(koenig) - squareFile(bauer)) <= 1;
  const davor = eigeneReihe(koenig, farbe) > eigeneReihe(bauer, farbe);
  return koenigsabstand(koenig, bauer) <= BETRETEN || (nebenlinie && davor);
}

/**
 * Der verbundene Freibauer neben einem Freibauern: gleiche Farbe, Nachbarlinie, höchstens eine
 * Reihe Abstand, sodass einer den anderen deckt oder mit einem Zug decken kann (C1.21).
 * Beispiel: Abb. 8.50, e5 und f6: „Der König kann f6 nicht schlagen, weil e5 den Bauern deckt.“
 */
export function verbundenerFreibauer(
  stellung: Stellung,
  bauer: Square,
  farbe: Color,
): Square | null {
  const frei = bauernschwaechen(stellung.brett, farbe).freibauern.map((f) => f.feld);
  return (
    frei.find(
      (anderer) =>
        Math.abs(squareFile(anderer) - squareFile(bauer)) === 1 &&
        Math.abs(squareRank(anderer) - squareRank(bauer)) <= 1,
    ) ?? null
  );
}

/** Das Quadrat ab einer Reihe des Bauern (aus seiner Sicht), zur Seite des gegnerischen Königs. */
function rahmen(
  bauer: Square,
  farbe: Color,
  startreihe: number,
  koenigGegner: Square | null,
): Quadratrahmen {
  const linie = squareFile(bauer);
  const start = feldAusEigener(linie, Math.min(LETZTE_REIHE, startreihe), farbe) ?? bauer;
  const umwandlungsfeld = feldAusEigener(linie, LETZTE_REIHE, farbe) ?? bauer;
  const schritte = LETZTE_REIHE - Math.min(LETZTE_REIHE, startreihe);
  const koenigslinie = koenigGegner === null ? linie : squareFile(koenigGegner);
  const richtung = koenigslinie > linie || (koenigslinie === linie && linie < LINIEN / 2) ? 1 : -1;
  const seitenlinie = Math.max(0, Math.min(LINIEN - 1, linie + richtung * schritte));
  const seiteStart = squareRank(start) * LINIEN + seitenlinie;
  const seiteEnde = squareRank(umwandlungsfeld) * LINIEN + seitenlinie;
  return { start, schritte, seiteStart, seiteEnde, felder: rechteck(start, seiteEnde) };
}

/**
 * Zeichnet das Quadrat eines Bauern und prüft, ob der gegnerische König es betreten kann.
 *
 * Warum: Regel 6, „Rechne bis zur Umwandlung“, in der schnellen Form des Buches. Gezeichnet wird
 * wie im Buch immer am Bauern (Abb. 8.35 und 8.36: beide b4–f8), beim Doppelschritt eine Reihe
 * weiter. Ist die Bauernseite am Zug, zieht der Bauer zuerst: Dann schrumpft das Quadrat um eine
 * Reihe, und der König muss dieses kleinere Quadrat betreten können.
 * Eingaben: Stellung, Feld des Bauern. Ausgabe: das Quadrat mit Urteil und Vorbehalten.
 * Beispiel: Abb. 8.35 (Bauer b4, Weiß am Zug): Quadrat b4–f8, nach 1. b5 nur noch b5–e8, das der
 * König g5 nicht erreicht. Abb. 8.36 (Schwarz am Zug): Der König tritt in b4–f8 ein.
 * Abb. 8.63 (Bauer a2, Weiß am Zug): Doppelschritt, Quadrat a3–f8, nach 1. a4 nur a4–e8.
 * Sonderfälle: Zur Seite des Königs hin; steht er auf der Bauernlinie, nach der Seite mit Platz.
 * Begleitet der eigene König den Bauern oder schützt ihn ein verbundener Freibauer, steht die
 * Ausnahme in `ausnahme` (Abb. 8.19: begleitet; Abb. 8.50: verbunden).
 */
export function quadrat(stellung: Stellung, bauer: Square): Quadrat {
  const farbe = stellung.brett.get(bauer)?.color ?? "white";
  const koenigGegner = stellung.brett.kingOf(gegner(farbe)) ?? null;
  const doppelschritt = eigeneReihe(bauer, farbe) === GRUNDREIHE_DES_BAUERN;
  const bauerAmZug = stellung.amZug === farbe;
  const startreihe = eigeneReihe(bauer, farbe) + (doppelschritt ? 1 : 0);
  const gezeichnet = rahmen(bauer, farbe, startreihe, koenigGegner);
  const nachZug = bauerAmZug ? rahmen(bauer, farbe, startreihe + 1, koenigGegner) : null;
  const gemessen = nachZug ?? gezeichnet;
  const haeltAuf =
    koenigGegner === null
      ? null
      : gemessen.felder.some((feld) => koenigsabstand(feld, koenigGegner) <= BETRETEN);
  const partner = verbundenerFreibauer(stellung, bauer, farbe);
  const ausnahme = koenigBegleitet(stellung, bauer, farbe)
    ? "begleitet"
    : partner !== null && haeltAuf === true
      ? "verbunden"
      : null;
  return {
    ...gezeichnet,
    bauer,
    farbe,
    umwandlungsfeld: feldAusEigener(squareFile(bauer), LETZTE_REIHE, farbe) ?? bauer,
    nachZug,
    koenigGegner,
    haeltAuf,
    doppelschritt,
    bauerAmZug,
    vorbehalte: vorbehalte(stellung, bauer, farbe, gezeichnet.felder),
    ausnahme,
    partner,
  };
}

/** Steht ein eigener Bauer auf derselben Linie vor diesem Bauern? */
function hinterEigenemBauern(stellung: Stellung, bauer: Square, farbe: Color): boolean {
  for (const anderer of stellung.brett.pieces(farbe, "pawn")) {
    const davor = eigeneReihe(anderer, farbe) > eigeneReihe(bauer, farbe);
    if (squareFile(anderer) === squareFile(bauer) && davor) return true;
  }
  return false;
}

/**
 * Die Freibauern beider Farben, die eigene Farbe zuerst (Kapitel 5: kein gegnerischer Bauer hält
 * sie auf). Ein Bauer hinter einem eigenen Bauern derselben Linie zählt nicht als eigener
 * Freibauer (C1.22, Abb. 8.46: c7 hinter c6), denn er kommt erst nach dem vorderen voran.
 */
export function freibauernBeider(
  stellung: Stellung,
  eigen: Color,
): { feld: Square; farbe: Color }[] {
  const liste: { feld: Square; farbe: Color }[] = [];
  for (const farbe of [eigen, gegner(eigen)]) {
    for (const f of bauernschwaechen(stellung.brett, farbe).freibauern) {
      if (!hinterEigenemBauern(stellung, f.feld, farbe)) liste.push({ feld: f.feld, farbe });
    }
  }
  return liste;
}

/** Ein Bauer, der mit dem nächsten Zug zum Freibauern wird, und die Stellung danach. */
export interface KommenderFreibauer {
  readonly stellung: Stellung;
  readonly von: Square;
  readonly bauer: Square;
  readonly san: string;
}

/**
 * Wird der Bauer mit dem nächsten Zug zum Freibauern (C1.22)?
 *
 * Warum: Abb. 8.46: „Nach 3. a6 läuft der a-Bauer durch, der König h8 kommt zu spät.“ Vorher hält
 * der Bauer b6 den Bauern a5 auf; nach a6 kann er ihn nicht mehr schlagen.
 * Eingaben: Stellung, nächster Zug (SAN, englisch, etwa der nächste Buchzug). Ausgabe: der neue
 * Freibauer mit der Stellung nach dem Zug, oder null (kein Bauernzug, schon vorher frei, danach
 * nicht frei oder Zug nicht spielbar).
 */
export function kommenderFreibauer(stellung: Stellung, san?: string): KommenderFreibauer | null {
  if (!san || !stellung.regeln) return null;
  const zug = parseSan(stellung.regeln, san);
  if (!zug || !("from" in zug)) return null;
  const figur = stellung.brett.get(zug.from);
  if (figur?.role !== "pawn" || zug.promotion !== undefined) return null;
  const freiVorher = bauernschwaechen(stellung.brett, figur.color).freibauern;
  if (freiVorher.some((f) => f.feld === zug.from)) return null;
  const danach = stellung.regeln.clone();
  danach.play(zug);
  const nach = stellungAusFen(makeFen(danach.toSetup()));
  if (!nach.ok) return null;
  const frei = bauernschwaechen(nach.wert.brett, figur.color).freibauern;
  if (!frei.some((f) => f.feld === zug.to)) return null;
  return { stellung: nach.wert, von: zug.from, bauer: zug.to, san };
}
