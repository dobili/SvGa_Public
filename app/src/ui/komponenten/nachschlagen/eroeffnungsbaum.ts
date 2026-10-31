/**
 * Der Eröffnungsbaum der Steckbriefe: jede Eröffnung hängt an ihren ersten Zügen (1. e4 → 1... c5
 * Sizilianisch, 1... e6 Französisch …; 1. d4 → …).
 *
 * Rolle im Gesamtbild: Entwurf H2 „Eröffnungsbaum“ (Wahl des Autors, 31.10.2026). Der Baum
 * entsteht aus den Buchdaten, nicht aus einer festen Liste: Die Zeile „Wer wählt sie?“ jedes
 * Steckbriefs nennt die kennzeichnenden Züge („Weiß, mit 3. Lb5 nach 1. e4 e5 2. Sf3 Sc6“), die
 * Abbildung „Schlussstellung der Hauptvariante“ trägt die ganze Zugfolge der Hauptvariante. Aus
 * beiden zusammen ergibt sich die Kennzugfolge: die Hauptvariante bis zum letzten in „Wer wählt
 * sie?“ genannten Zug. Ein neuer Steckbrief hängt sich so von selbst ein. Regel 1: Es wird nichts
 * erfunden; passen Zeile und Hauptvariante nicht zusammen, steht der Steckbrief unter „Weitere“.
 * Abhängigkeiten: chessops (Stellung nach den Zügen), notation.ts (Figurenbuchstaben),
 * daten/laden.ts (Typen).
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Zugnummern, „3...“ für Schwarz am Zug).
 */
import { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Abbildung, Kapitel } from "../../../daten/laden";
import { ohneZugzeichen, sanInSprache } from "../../../schach/notation";

type Steckbrief = Kapitel["steckbriefe"][number];

/** Deutsche Figurenbuchstaben → englische, damit Buchzüge mit der Hauptvariante vergleichbar sind. */
const NACH_ENGLISCH: Readonly<Record<string, string>> = { D: "Q", T: "R", L: "B", S: "N" };

/** Zugnummer mit Punkt („2.“) oder mit drei Punkten für Schwarz („2...“, „2…“), Zug danach. */
const NUMMER = /^(\d+)(\.\.\.|…|\.)(.*)$/;
/** Ein Zug ohne Nummer, nur mit Auslassungspunkten („...g6“). */
const OHNE_NUMMER = /^(?:\.\.\.|…)(.+)$/;

/** Ein Zug im Vergleichsformat: englische Buchstaben, ohne Schach- und Bewertungszeichen. */
function vergleichbar(san: string): string {
  return ohneZugzeichen(san).replace(/[DTLS]/g, (b) => NACH_ENGLISCH[b] ?? b);
}

/** Ein Zug aus dem Buchtext mit der Nummer seines Halbzuges (1 = erster Zug von Weiß). */
interface Buchzug {
  /** Halbzug, null bei Zügen ohne Nummer („...g6“). */
  readonly halbzug: number | null;
  readonly san: string;
}

/**
 * Liest die Züge eines Zugtextes aus dem Buch.
 * Beispiel: „1. e4 e5 2. Sf3“ → e4 (1), e5 (2), Sf3 (3); „3... Sf6“ → Sf6 (6); „...g6“ → g6 (null).
 */
export function liesBuchzuege(text: string): readonly Buchzug[] {
  const zuege: Buchzug[] = [];
  let halbzug: number | null = null;
  for (const stueck of text.trim().split(/\s+/)) {
    const nummer = NUMMER.exec(stueck);
    const ohne = OHNE_NUMMER.exec(stueck);
    let san = stueck;
    if (nummer) {
      halbzug = 2 * Number(nummer[1]) - (nummer[2] === "." ? 1 : 0);
      san = nummer[3] ?? "";
    } else if (ohne) {
      halbzug = null;
      san = ohne[1] ?? "";
    }
    if (san === "") continue;
    zuege.push({ halbzug, san });
    if (halbzug !== null) halbzug += 1;
  }
  return zuege;
}

/** Die Züge (Teile der Art „zug“) aus der ersten Zeile eines Steckbriefs, die welche nennt. */
function zugtexte(steckbrief: Steckbrief): readonly string[] {
  for (const zeile of steckbrief.zeilen) {
    const texte = zeile.antwort.filter((teil) => teil.art === "zug").map((teil) => teil.text);
    if (texte.length > 0) return texte;
  }
  return [];
}

/**
 * Wie viele Halbzüge der Hauptvariante die Eröffnung kennzeichnen.
 *
 * Eingaben: die Zugtexte aus „Wer wählt sie?“ (der erste ist der Zug, „mit“ dem die Seite die
 * Eröffnung wählt), die Hauptvariante als SAN. Ausgabe: der späteste genannte Halbzug oder null,
 * wenn der erste Zugtext nicht zur Hauptvariante passt.
 * Beispiel aus dem Buch: Königsindische Verteidigung, „1... Sf6“, „...g6“, „1. d4“, „2. c4“ mit
 * Hauptvariante d4 Nf6 c4 g6 … → 4. Sonderfall: Ein Zug ohne Nummer zählt an der Stelle, an der er
 * in der Hauptvariante zuerst steht.
 */
export function kennzeichnendeTiefe(
  texte: readonly string[],
  pfad: readonly string[],
): number | null {
  const [erster, ...rest] = texte.map(liesBuchzuege);
  if (!erster || erster.length === 0) return null;
  const passt = erster.every(
    (zug) => zug.halbzug !== null && pfad[zug.halbzug - 1] === vergleichbar(zug.san),
  );
  if (!passt) return null;
  let tiefe = 0;
  for (const zug of [erster, ...rest].flat()) {
    const stelle = zug.halbzug ?? pfad.indexOf(vergleichbar(zug.san)) + 1;
    if (stelle <= pfad.length) tiefe = Math.max(tiefe, stelle);
  }
  return tiefe > 0 ? tiefe : null;
}

/**
 * Die Kennzugfolge eines Steckbriefs (SAN, englische Buchstaben) aus seiner Zeile „Wer wählt
 * sie?“ und der Schlussstellung der Hauptvariante.
 * Beispiel: Spanische Partie mit Abb. 2.11 → e4 e5 Nf3 Nc6 Bb5. Sonderfall: ohne Abbildung oder
 * Zugfolge, oder wenn beides nicht zusammenpasst → null.
 */
export function kennzugfolge(
  steckbrief: Steckbrief,
  schluss: Abbildung | null,
): readonly string[] | null {
  const pfad = schluss?.beispiel?.pfad;
  if (!pfad) return null;
  const tiefe = kennzeichnendeTiefe(zugtexte(steckbrief), pfad);
  return tiefe === null ? null : pfad.slice(0, tiefe);
}

/** Ein Knoten des Baumes; Ketten ohne eigenen Steckbrief sind zu einem Knoten zusammengefasst. */
export interface Baumknoten<T> {
  /** Die Halbzüge dieses Knotens (SAN, englisch), etwa e5 und Nf3 für „1... e5 2. Sf3“. */
  readonly zuege: readonly string[];
  /** Alle Züge vom Anfang bis zum Ende dieses Knotens. */
  readonly pfad: readonly string[];
  /** Die Einträge (Steckbriefe), deren Kennzugfolge hier endet. */
  readonly eintraege: readonly T[];
  readonly kinder: readonly Baumknoten<T>[];
}

interface Bauknoten<T> {
  readonly eintraege: T[];
  readonly kinder: Map<string, Bauknoten<T>>;
}

const neuerKnoten = <T>(): Bauknoten<T> => ({ eintraege: [], kinder: new Map() });

/**
 * Fasst einen Ast zusammen, solange ein Knoten keinen Eintrag und genau ein Kind ohne Eintrag hat.
 * Der Zug, der eine Eröffnung kennzeichnet, bleibt so ein eigener Knoten („3… Lb4“ nach
 * „2… e6 3. Sc3“), wie im Entwurf H2.
 */
function verdichte<T>(zug: string, knoten: Bauknoten<T>, davor: readonly string[]): Baumknoten<T> {
  const zuege = [zug];
  let aktuell = knoten;
  while (aktuell.eintraege.length === 0 && aktuell.kinder.size === 1) {
    const [naechsterZug, naechster] = [...aktuell.kinder.entries()][0] ?? [];
    if (naechsterZug === undefined || naechster === undefined) break;
    if (naechster.eintraege.length > 0) break;
    zuege.push(naechsterZug);
    aktuell = naechster;
  }
  const pfad = [...davor, ...zuege];
  return {
    zuege,
    pfad,
    eintraege: aktuell.eintraege,
    kinder: [...aktuell.kinder.entries()].map(([z, k]) => verdichte(z, k, pfad)),
  };
}

/**
 * Baut den Baum aus Einträgen mit ihren Zugfolgen; die Reihenfolge der Kinder ist die des ersten
 * Auftretens (also die Reihenfolge im Buch).
 * Beispiel: Spanisch (e4 e5 Nf3 Nc6 Bb5) und Petroff (e4 e5 Nf3 Nf6) → e4 → „e5 Nf3“ → Nc6 → Bb5
 * und Nf6. Sonderfall: leere Zugfolgen werden übergangen.
 */
export function baueBaum<T>(
  eintraege: readonly { readonly zuege: readonly string[]; readonly wert: T }[],
): readonly Baumknoten<T>[] {
  const wurzel = neuerKnoten<T>();
  for (const { zuege, wert } of eintraege) {
    if (zuege.length === 0) continue;
    let knoten = wurzel;
    for (const zug of zuege) {
      const kind = knoten.kinder.get(zug) ?? neuerKnoten<T>();
      knoten.kinder.set(zug, kind);
      knoten = kind;
    }
    knoten.eintraege.push(wert);
  }
  return [...wurzel.kinder.entries()].map(([zug, kind]) => verdichte(zug, kind, []));
}

/**
 * Die Züge eines Knotens als Text in der Sprache, mit Zugnummern wie im Buch.
 * Beispiel: Knoten e5 Nf3 nach e4, Deutsch → „1… e5 2. Sf3“; Bb5 nach vier Halbzügen → „3. Lb5“.
 */
export function zugbeschriftung(knoten: Baumknoten<unknown>, sprachcode: string): string {
  const start = knoten.pfad.length - knoten.zuege.length;
  const teile: string[] = [];
  knoten.zuege.forEach((san, i) => {
    const halbzug = start + i;
    const nummer = Math.floor(halbzug / 2) + 1;
    if (halbzug % 2 === 0) teile.push(`${nummer}.`);
    else if (i === 0) teile.push(`${nummer}…`);
    teile.push(sanInSprache(san, sprachcode));
  });
  return teile.join(" ");
}

/**
 * Die Stellung nach den Zügen ab der Grundstellung als FEN.
 * Beispiel: e4 c5 → Stellung der Sizilianischen Verteidigung. Sonderfall: Ein ungültiger Zug
 * beendet die Folge (die Daten kommen aus dem geprüften Buch, das sollte nie geschehen).
 */
export function fenNach(pfad: readonly string[]): string {
  const stellung = Chess.default();
  for (const san of pfad) {
    const zug = parseSan(stellung, san);
    if (!zug) break;
    stellung.play(zug);
  }
  return makeFen(stellung.toSetup());
}

/**
 * Der Charakter einer Eröffnung in wenigen Worten: der Anfang der Zeile „Charakter“ des
 * Steckbriefs bis zum ersten Semikolon oder Punkt.
 * Beispiel: „Klassisch und strategisch; indirekter Druck …“ → „Klassisch und strategisch“.
 * Sonderfall: ohne diese Zeile (andere Sprache der Buchdaten) → null.
 */
export function charakterKurz(steckbrief: Steckbrief, frage: string): string | null {
  const zeile = steckbrief.zeilen.find((z) => z.frage === frage);
  if (!zeile) return null;
  const text = zeile.antwort.map((teil) => teil.text).join("");
  const kurz = text.split(/[;.]/)[0]?.trim() ?? "";
  return kurz === "" ? null : kurz;
}
