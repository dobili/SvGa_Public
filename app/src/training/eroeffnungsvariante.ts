/**
 * Eine ganze Eröffnung als ein Zugbaum: alle Zugfolgen des Buches zu dieser Eröffnung
 * (Kapitel 2 und 3) und, auf Wunsch, die Linien der Praxis (Lichess) im Band des Lesers.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026: „eine Eröffnung
 * mit all ihren Abzweigungen und Varianten laden, aus dem Buch und aus der Eröffnungsdatenbank der
 * App, gekennzeichnet nach Herkunft“). Jede Eröffnung hat eine Kennzugfolge (Kern): aus dem
 * Steckbrief (Kapitel 2), sonst die längste Lichess-Zugfolge, mit der die Hauptvariante des Buches
 * beginnt, sonst der Weg zur ersten Abbildung. Zum Baum der Eröffnung kommt jede andere Zugfolge
 * des Buches, die die Stellung des Kerns erreicht, auch über eine Zugumstellung (Übungen, Gambits,
 * „Zugumstellungen“). Die Buchzüge tragen die Herkunft „buch“ und ihre Zugzeichen; die Züge der
 * Praxis die Herkunft „partie“ (Züge echter Partien), am ersten Praxiszug hinter dem Buch steht
 * der Kommentar „Praxis (Lichess)“. Das Speicherformat bleibt Format 8. Reine Funktionen.
 * Die Praxis steht in training/praxisvariante.ts.
 * Abhängigkeiten: daten (Typen, buchbeispiele), schach/baumvereinigung.ts,
 * spiel/eroeffnungsbaender.ts (Typen), training/repertoiretrainer.ts,
 * training/abweichungstrainer.ts, training/variationsquellen.ts, training/uebungsaufgabe.ts.
 * Buchbezug: Kapitel 2 (Eröffnungen mit Steckbrief, 2.12 „Zugumstellungen“), Kapitel 3 (Gambits).
 */
import { buchbeispiele } from "../daten/buchbeispiele";
import type { Beispiel } from "../daten/generiert/beispiel";
import type { Kapitel } from "../daten/generiert/kapitel";
import { ohneArtikel } from "../schach/eroeffnungsindex";
import { eingehaengt, schluesselNach, stellungsfunde } from "../schach/baumvereinigung";
import { stellungAus } from "../schach/variationsbaum";
import type { Eroeffnungsbaender } from "../spiel/eroeffnungsbaender";
import { GRUNDSTELLUNG } from "../spiel/stellungsbau";
import { gambitsAus } from "./abweichungstrainer";
import { eroeffnungenAus } from "./repertoiretrainer";
import { kanonischeLinie } from "./uebungsaufgabe";
import type { Variationsknoten } from "./variationen";
import { ausBuchbaum } from "./variationsquellen";

/** Kleinste Länge eines Kerns aus dem Weg zur ersten Abbildung (Halbzüge). */
const MINDESTKERN = 2;

/** Eine Eröffnung des Buches mit ihrem Baum (Kapitel 2 oder 3). */
export interface Bucheroeffnung {
  /** Kennung des Beispiels („k02-a1“). */
  readonly id: string;
  readonly titel: string;
  readonly kapitel: number;
  readonly beispiel: Beispiel;
  /** Kennzugfolge in der Schreibweise von chessops (e4 e5 Nf3 Nc6 Bb5). */
  readonly kern: readonly string[];
  /** Erste Abbildung zu diesem Beispiel (Quelle der Variante), sonst null. */
  readonly abbildung: string | null;
}

/** Die Hauptvariante eines Beispiels (immer die erste Fortsetzung), regelgerecht geschrieben. */
export function hauptlinieVon(beispiel: Beispiel): string[] {
  const zuege: string[] = [];
  for (let k = beispiel.zuege[0]; k; k = k.weiter[0]) zuege.push(k.zug);
  return kanonischeLinie(beispiel.startFen, zuege) ?? [];
}

/** Ist ``kurz`` der Anfang von ``lang`` (ganze Züge)? */
function istAnfang(kurz: readonly string[], lang: readonly string[]): boolean {
  return kurz.length <= lang.length && kurz.every((z, i) => z === lang[i]);
}

/** Die Zugfolgen der Lichess-Eröffnungen und -Gambits, regelgerecht (für den Kern). */
export function lichessfolgen(daten: Eroeffnungsbaender | null): string[][] {
  if (!daten) return [];
  return [...daten.familien, ...daten.gambits]
    .map((e) => kanonischeLinie(GRUNDSTELLUNG, e.folge.split(" ")))
    .filter((l): l is string[] => l !== null && l.length > 0);
}

/** Die längste Lichess-Zugfolge, mit der die Hauptvariante beginnt; null ohne. */
function lichesskern(haupt: readonly string[], folgen: readonly (readonly string[])[]): string[] | null {
  const passend = folgen.filter((f) => istAnfang(f, haupt));
  const laengste = passend.sort((a, b) => b.length - a.length)[0];
  return laengste ? [...laengste] : null;
}

/** Der Kern ohne Steckbrief: Lichess, sonst der Weg zur ersten Abbildung des Beispiels. */
function kernOhneSteckbrief(
  haupt: readonly string[],
  abbildungspfad: readonly string[] | null,
  folgen: readonly (readonly string[])[],
): string[] {
  const lichess = lichesskern(haupt, folgen);
  if (lichess) return lichess;
  const pfad = abbildungspfad ? (kanonischeLinie(GRUNDSTELLUNG, abbildungspfad) ?? []) : [];
  return istAnfang(pfad, haupt) && pfad.length >= MINDESTKERN ? pfad : haupt.slice(0, MINDESTKERN);
}

/** Eine Eröffnung beim Bestimmen der Kerne: fest, wenn der Kern aus dem Steckbrief stammt. */
interface Kernkandidat extends Bucheroeffnung {
  readonly fest: boolean;
  readonly haupt: readonly string[];
}

/** Wie viele Züge zwei Linien am Anfang gemeinsam haben. */
function gemeinsamerAnfang(a: readonly string[], b: readonly string[]): number {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i += 1;
  return i;
}

/** Muss ``e`` seinen Kern wegen ``x`` verlängern? Fest vor fallback, Kapitel 2 vor Kapitel 3. */
function weicht(e: Kernkandidat, x: Kernkandidat): boolean {
  if (e.fest) return false;
  return x.fest || x.kapitel < e.kapitel || x.kapitel === e.kapitel;
}

/**
 * Teilen sich zwei Eröffnungen denselben Kern, verlängert die nachrangige ihren Kern entlang ihrer
 * Hauptvariante bis zum ersten Zug, in dem sie sich unterscheiden. Ein Kern aus dem Steckbrief
 * bleibt, und Kapitel 2 geht vor Kapitel 3.
 * Beispiel: Französisch (Kapitel 2, 1... e6) und Milner-Barry-Gambit (Kapitel 3, nach Lichess
 * ebenfalls 1. e4 e6) → Französisch bleibt bei 1... e6, das Gambit verlängert bis 11. Ld3.
 */
function eindeutigeKerne(kandidaten: readonly Kernkandidat[]): Bucheroeffnung[] {
  return kandidaten.map(({ fest, haupt, ...e }) => {
    const gleich = (x: Kernkandidat) => x.id !== e.id && x.kern.join(" ") === e.kern.join(" ");
    const vor = kandidaten.filter((x) => gleich(x) && weicht({ ...e, fest, haupt }, x));
    if (vor.length === 0) return e;
    const gemeinsam = Math.max(...vor.map((x) => gemeinsamerAnfang(haupt, x.haupt)));
    const laenge = Math.max(e.kern.length, Math.min(haupt.length, gemeinsam + 1));
    return { ...e, kern: haupt.slice(0, laenge) };
  });
}

/** Die erste Abbildung eines Beispiels und ihr Weg; null ohne. */
function ersteAbbildungZu(kapitel: Kapitel, id: string): { nummer: string; pfad: string[] } | null {
  const a = kapitel.abbildungen.find((x) => x.beispiel?.id === id);
  return a?.beispiel ? { nummer: a.id, pfad: a.beispiel.pfad } : null;
}

/**
 * Die Eröffnungen des Buches: die Eröffnungen mit Steckbrief aus Kapitel 2 und die Gambits aus
 * Kapitel 3 (dieselbe Liste wie im Repertoire-Trainer), jede mit ihrem Kern.
 *
 * Eingaben: Kapitel 2 und 3, die Kennzugfolgen der Steckbriefe je Beispiel (eroeffnungsbaum.ts),
 * die Lichess-Zugfolgen (lichessfolgen).
 * Beispiel: Spanische Partie → Kern e4 e5 Nf3 Nc6 Bb5; Evans-Gambit → … Bc5 b4.
 */
export function bucheroeffnungen(
  kapitel2: Kapitel,
  kapitel3: Kapitel,
  steckbriefkern: (beispielId: string) => readonly string[] | null,
  folgen: readonly (readonly string[])[],
): Bucheroeffnung[] {
  const gambits = gambitsAus(kapitel3, kapitel2);
  const alle = [
    ...eroeffnungenAus(kapitel2).map((e) => ({ ...e, titel: ohneArtikel(e.titel), kapitel: kapitel2 })),
    ...gambits.map((e) => ({ ...e, kapitel: e.id.startsWith("k02") ? kapitel2 : kapitel3 })),
  ].filter((e, i, liste) => liste.findIndex((x) => x.id === e.id) === i);
  const roh = alle.map((e): Kernkandidat => {
    const haupt = hauptlinieVon(e.beispiel);
    const erste = ersteAbbildungZu(e.kapitel, e.id);
    const steckbrief = steckbriefkern(e.id);
    const kanonisch = steckbrief ? kanonischeLinie(GRUNDSTELLUNG, steckbrief) : null;
    const fest = kanonisch !== null && istAnfang(kanonisch, haupt);
    const kern = fest ? kanonisch : kernOhneSteckbrief(haupt, erste?.pfad ?? null, folgen);
    const { id, titel, beispiel } = e;
    const abbildung = erste?.nummer ?? null;
    return { id, titel, kapitel: e.kapitel.kapitel, beispiel, kern, abbildung, fest, haupt };
  });
  return eindeutigeKerne(roh);
}

/** Der Baum eines Beispiels als Variationsknoten (Buchzüge mit Zeichen); [] ohne Regeln. */
function baumVon(beispiel: Beispiel): Variationsknoten[] {
  const pos = stellungAus(beispiel.startFen);
  return pos ? ausBuchbaum(pos, beispiel.zuege) : [];
}

/**
 * Alle Zugfolgen des Buches (Kapitel 2 und 3) zur Eröffnung in einem Baum: der Baum ihres
 * Beispiels, dazu die Fortsetzungen jedes anderen Beispiels ab der Stellung des Kerns.
 *
 * Warum: Übungen, Gambits und „Zugumstellungen“ stehen im Buch in eigenen Beispielen, gehören aber
 * zur Eröffnung (Wunsch des Autors: „mit all ihren Abzweigungen“).
 * Beispiel: Italienische Partie (Kern bis 3... Lc5) → dazu 4. Sg5?? aus Übung 8 und 4. b4 aus dem
 * Evans-Gambit (Kapitel 3).
 * Sonderfall: Beispiele mit anderer Startstellung (Studien) bleiben draußen.
 */
export function buchbaum(eroeffnung: Bucheroeffnung, kapitel: readonly Kapitel[]): Variationsknoten[] {
  const schluessel = schluesselNach(GRUNDSTELLUNG, eroeffnung.kern);
  let zuege: readonly Variationsknoten[] = baumVon(eroeffnung.beispiel);
  if (!schluessel) return [...zuege];
  const andere = kapitel
    .flatMap((k) => buchbeispiele(k))
    .filter((b) => b.id !== eroeffnung.id && b.startFen === GRUNDSTELLUNG);
  for (const b of andere) {
    for (const fund of stellungsfunde(GRUNDSTELLUNG, baumVon(b), schluessel)) {
      zuege = eingehaengt(zuege, eroeffnung.kern, fund.weiter);
    }
  }
  return [...zuege];
}
