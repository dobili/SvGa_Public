/**
 * Fesselungslinien für den Fesselungs-Check (Prüffrage F3): direkte und verdeckte Fesselungen.
 *
 * Rolle im Gesamtbild: Baustein für k4-prueffragen. Pflichtenheft 6.2: „F3: alle absoluten und
 * relativen Fesselungen, auch die, die erst durch den geplanten Zug entstehen (zweite
 * Fesselung).“ Direkte Fesselungen kommen aus den Linienmotiven (Kapitel 7, Motiv 2). Verdeckt
 * heißt: Zwischen Langschrittfigur und gefesselter Figur steht noch eine weitere Figur; zieht
 * sie weg, ist die Fesselung da (Kapitel 4, Kieninger- und Benko-Falle).
 * Abhängigkeiten: chessops, strahlen.ts, linienmotive.ts, angriffskarte.ts.
 * Buchbezug: Kapitel 2 (Fesselung, absolut und relativ), Kapitel 4, F3 und Kategorie III
 * „Die zweite Fesselung“ (Abb. 4.21, 4.25).
 */
import type { Board } from "chessops/board";
import type { Chess } from "chessops/chess";
import { makeSan } from "chessops/san";
import type { Color } from "chessops/types";
import { Angriffskarte, type Figurenstand } from "./angriffskarte";
import { legaleZuege, nullzug, sofortigeGewinne } from "./drohungen";
import { FIGURENWERT, gegner } from "./stellung";
import { fesselungen, linienmotive } from "./linienmotive";
import { strahl, strahlen, verlaesstLinie, type Strahl } from "./strahlen";

type Fesselungsmotiv = ReturnType<typeof fesselungen>[number];

/** Eine Fesselung: Langschrittfigur, gefesselte Figur und die Figur dahinter. */
export interface Fesselungslinie {
  /** Direkt: die Fesselung besteht jetzt. Verdeckt: Sie entsteht, sobald `abschirmend` wegzieht. */
  readonly art: "direkt" | "verdeckt";
  /** Absolut gegen den König, sonst relativ gegen eine wertvollere Figur. */
  readonly absolut: boolean;
  readonly von: Figurenstand;
  /** Bei verdeckten Fesselungen die Figur zwischen Langschrittfigur und gefesselter Figur. */
  readonly abschirmend: Figurenstand | null;
  readonly gefesselt: Figurenstand;
  readonly hinten: Figurenstand;
}

/**
 * Verdeckte Fesselung auf einem Strahl, oder null.
 *
 * Regel: Kapitel 4, Kategorie III („Die Dame e7 fesselt den Bauern e2 an den König, sobald die
 * e-Linie frei ist“). Auf dem Strahl stehen eine beliebige Figur (nicht der König), dahinter eine
 * gegnerische Figur und direkt dahinter der gegnerische König. Nur gegen den König, denn nur dort
 * ist die zweite Fesselung im Buch gefährlich (Abb. 4.22, 4.26: Erstickungsmatt).
 */
function verdeckt(brett: Board, s: Strahl): Fesselungslinie | null {
  const { erste: abschirmend, zweite: gefesselt } = s;
  if (!abschirmend || !gefesselt || abschirmend.figur.role === "king") return null;
  if (gefesselt.figur.color === s.figur.color || gefesselt.figur.role === "king") return null;
  if (!verlaesstLinie(brett, abschirmend, s.richtung)) return null;
  const hinten = strahl(brett, gefesselt.feld, s.figur, s.richtung).erste;
  if (!hinten || hinten.figur.role !== "king" || hinten.figur.color === s.figur.color) return null;
  const von = { feld: s.von, figur: s.figur };
  return { art: "verdeckt", absolut: true, von, abschirmend, gefesselt, hinten };
}

/**
 * Zählt eine direkte Fesselung für F3?
 *
 * Regel: Kapitel 4, F3 („Ist sie relativ, musst du prüfen, ob der Materialverlust … den Zug
 * widerlegt“). Absolute Fesselungen zählen immer. Eine relative zählt nur, wenn ein
 * Materialverlust droht: Die hintere Figur ist wertvoller als die Langschrittfigur oder
 * ungedeckt, und die gefesselte Figur könnte die Linie überhaupt verlassen. Kalibriert an den
 * Fallenchecks: Läufer c4 vor Bauer f7 und gedecktem Springer g8 ist „keine Fesselung im Spiel“
 * (Abb. 4.5, 4.34), Läufer g5 vor Springer f6 und Dame d8 ist eine (Abb. 4.13).
 */
function bedeutsam(brett: Board, karte: Angriffskarte, motiv: Fesselungsmotiv): boolean {
  if (motiv.absolut) return true;
  if (!verlaesstLinie(brett, motiv.vorn, motiv.strahl.richtung)) return false;
  const wertvoller = FIGURENWERT[motiv.hinten.figur.role] > FIGURENWERT[motiv.strahl.figur.role];
  const ungedeckt = karte.angreiferVon(motiv.hinten.feld, motiv.hinten.figur.color).length === 0;
  return wertvoller || ungedeckt;
}

/**
 * Alle Fesselungslinien einer Stellung, auf Wunsch nur gegen eine Farbe.
 *
 * Warum: F3 fragt, ob eine Fesselung absolut oder relativ ist und ob eine zweite wartet
 * (Kapitel 4). Eingaben: Brett, Angriffskarte, optional die Farbe der gefesselten Figuren.
 * Ausgabe: erst die direkten, dann die verdeckten Fesselungen.
 * Beispiel: Abb. 4.21: direkt Läufer b4 – Springer d2 – König e1 (absolut), verdeckt Dame e7 –
 * Springer e5 – Bauer e2 – König e1.
 * Sonderfälle: Lehrbilder ohne König haben nur relative Fesselungen.
 */
export function fesselungslinien(
  brett: Board,
  karte: Angriffskarte,
  gegen?: Color,
): Fesselungslinie[] {
  const motive = fesselungen(linienmotive(brett, karte)).filter((m) => bedeutsam(brett, karte, m));
  const direkte: Fesselungslinie[] = motive.map((motiv) => ({
    art: "direkt",
    absolut: motiv.absolut,
    von: { feld: motiv.strahl.von, figur: motiv.strahl.figur },
    abschirmend: null,
    gefesselt: motiv.vorn,
    hinten: motiv.hinten,
  }));
  const verdeckte = strahlen(brett).flatMap((s) => verdeckt(brett, s) ?? []);
  return [...direkte, ...verdeckte].filter(
    (linie) => gegen === undefined || linie.gefesselt.figur.color === gegen,
  );
}

/** Schlüssel einer Fesselungslinie zum Vergleich vor und nach einem Zug. */
export function linienschluessel(linie: Fesselungslinie): string {
  const felder = [linie.von, linie.abschirmend, linie.gefesselt, linie.hinten];
  return `${linie.art}:${felder.map((stand) => stand?.feld ?? "-").join("-")}`;
}

/** Eine Antwort des Gegners, die eine neue Fesselung gegen den König aufbaut (Abb. 4.24: De2). */
export interface Aufbau {
  readonly san: string;
  readonly linie: Fesselungslinie;
}

/** Fesselungen gegen die eigene Seite vor und nach einem geplanten Zug (zweiter Teil von F3). */
export interface Fesselungsvergleich {
  readonly aufgehoben: readonly Fesselungslinie[];
  readonly neu: readonly Fesselungslinie[];
  readonly bleibt: readonly Fesselungslinie[];
  readonly antworten: readonly Aufbau[];
}

/** Fesselungen gegen eine Farbe in einer Regelstellung. */
function linienIn(regeln: Chess, gegen: Color): Fesselungslinie[] {
  return fesselungslinien(regeln.board, new Angriffskarte(regeln.board), gegen);
}

/**
 * Mindestgewinn einer aufbauenden Antwort: eine Leichtfigur. Kalibriert an den Fallenchecks: In
 * Abb. 4.2 baut Da4 eine Fesselung gegen den Bauern b5 auf, das Buch nennt dort „keine Fesselung
 * im Spiel“; in Abb. 4.24 kostet De2 den Springer e4, das Buch sagt „Ja“.
 */
const MINDESTGEWINN = FIGURENWERT.knight;

/**
 * Gewinnt die Fesselung nach der Antwort sofort etwas? Der Gegner könnte, wäre er nochmals am Zug,
 * die gefesselte oder die abschirmende eigene Figur mit Gewinn schlagen.
 */
function gewinntSofort(folge: Chess, linie: Fesselungslinie, eigen: Color): boolean {
  if (folge.isCheck()) return false;
  const ziele = new Set(
    [linie.gefesselt, linie.abschirmend].flatMap((stand) =>
      stand && stand.figur.color === eigen ? [stand.feld] : [],
    ),
  );
  const gewinne = sofortigeGewinne(nullzug(folge, gegner(eigen)));
  return gewinne.some(
    (d) => d.art === "material" && ziele.has(d.zug.nach) && d.zug.bilanz >= MINDESTGEWINN,
  );
}

/**
 * Antworten des Gegners, nach denen eine neue absolute Fesselung (direkt oder verdeckt) gegen
 * die eigene Seite steht, die sofort Material gewinnt, oder die mattsetzen.
 *
 * Regel: Kapitel 4, Benko-Falle: Nach 7... Sxe4 baut 8. De2 die Fesselung auf und greift den
 * Springer an („zieht der Springer von e4 weg, ist der Bauer e7 an den König gefesselt“). Nur
 * gegen den König und nur mit sofortigem Gewinn, sonst baut fast jeder Damenzug eine Fesselung
 * auf (an den Fallenchecks geprüft).
 */
function aufbauendeAntworten(danach: Chess, eigen: Color, bekannt: ReadonlySet<string>): Aufbau[] {
  const ergebnis: Aufbau[] = [];
  for (const zug of legaleZuege(danach)) {
    const san = makeSan(danach, zug);
    const folge = danach.clone();
    folge.play(zug);
    const neue = linienIn(folge, eigen).filter(
      (linie) => linie.absolut && !bekannt.has(linienschluessel(linie)),
    );
    const treffer = folge.isCheckmate()
      ? neue[0]
      : neue.find((l) => gewinntSofort(folge, l, eigen));
    if (treffer) ergebnis.push({ san, linie: treffer });
  }
  return ergebnis;
}

/**
 * Vergleicht die Fesselungen gegen die eigene Seite vor und nach dem geplanten Zug.
 *
 * Warum: F3, zweiter Teil: „Entsteht durch meinen Zug eine zweite Fesselung?“ (Kapitel 4).
 * Eingaben: Fesselungslinien vorher (alle), Regeln nach dem Zug, eigene Farbe.
 * Ausgabe: aufgehobene, neue und bleibende absolute Fesselungen sowie Antworten des Gegners, die eine
 * neue Fesselung gegen den König aufbauen.
 * Beispiel: Abb. 4.21 mit 8. axb4: aufgehoben Lb4–Sd2–Ke1, bleibt verdeckt De7–Se5–e2–Ke1.
 * Sonderfälle: Steht der Gegner nach dem Zug matt oder patt, gibt es keine Antworten.
 */
export function vergleicheFesselungen(
  vorher: readonly Fesselungslinie[],
  danach: Chess,
  eigen: Color,
): Fesselungsvergleich {
  const nachher = linienIn(danach, eigen);
  const alt = new Set(
    vorher.filter((l) => l.gefesselt.figur.color === eigen).map(linienschluessel),
  );
  const jetzt = new Set(nachher.map(linienschluessel));
  return {
    aufgehoben: vorher.filter(
      (l) => l.gefesselt.figur.color === eigen && !jetzt.has(linienschluessel(l)),
    ),
    neu: nachher.filter((l) => !alt.has(linienschluessel(l))),
    // Bleibende relative Fesselungen nennt schon der erste Teil von F3; die zweite Fesselung im
    // Buch richtet sich immer gegen den König (Abb. 4.21, 4.24).
    bleibt: nachher.filter((l) => l.absolut && alt.has(linienschluessel(l))),
    antworten: aufbauendeAntworten(danach, eigen, jetzt),
  };
}
