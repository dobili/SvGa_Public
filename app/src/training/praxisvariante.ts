/**
 * Die Linien der Praxis (Lichess) zu einer Eröffnung als Zugbaum, auf Wunsch verlängert um die
 * häufigsten Folgezüge im gewählten Band, und das Zusammenlegen mit dem Baum des Buches.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026). Grundlage sind
 * die Eröffnungen nach Spielstärke der App (spiel/eroeffnungsbaender.ts, variantenbaum: Familien,
 * Varianten, Gambits) und die verlängerten Fortsetzungen (training/praxisfortsetzung.ts), dieselben
 * Daten wie im Repertoire-Trainer. Zur Eröffnung gehört jede Linie, die mit ihrem Kern beginnt.
 * Die Züge tragen die Herkunft „partie“ (Züge echter Partien); im Baum mit dem Buch steht am
 * ersten Praxiszug hinter einem Buchzug ein kurzer Kommentar, damit man sieht, wo das Buch endet.
 * Reine Funktionen.
 * Abhängigkeiten: schach/baumvereinigung.ts, spiel/eroeffnungsbaender.ts,
 * training/praxisfortsetzung.ts, training/uebungsaufgabe.ts, training/variationsquellen.ts.
 */
import { vereinige } from "../schach/baumvereinigung";
import type { Bandfamilie, Eroeffnungsbaender } from "../spiel/eroeffnungsbaender";
import { GRUNDSTELLUNG } from "../spiel/stellungsbau";
import { folgezuege, type Praxisfortsetzungen } from "./praxisfortsetzung";
import { kanonischeLinie } from "./uebungsaufgabe";
import type { Variationsknoten } from "./variationen";
import { linieAlsKnoten } from "./variationsquellen";

/** Womit verlängert wird: die Fortsetzungen und der Index des Bandes; null ohne Verlängerung. */
export interface Bandwahl {
  readonly daten: Praxisfortsetzungen;
  readonly band: number;
}

/** Die Zugfolgen einer Familie: erst sie selbst, dann ihre Varianten nach Häufigkeit. */
function folgenDer(familie: Bandfamilie): string[] {
  const varianten = [...familie.varianten].sort((a, b) => b.anzahl - a.anzahl);
  return [familie.folge, ...varianten.map((v) => v.folge)];
}

/**
 * Alle Zugfolgen der Praxis in fester Reihenfolge: Familien mit ihren Varianten, dann die Gambits.
 * Mit ``familie`` nur diese Familie (eine Eröffnung, die das Buch nicht behandelt).
 */
export function praxisfolgen(daten: Eroeffnungsbaender, familie?: Bandfamilie): string[] {
  if (familie) return folgenDer(familie);
  return [...daten.familien.flatMap(folgenDer), ...daten.gambits.map((g) => g.folge)];
}

/** Eine Zugfolge, verlängert im Band; ist die Verlängerung regelwidrig, nur bis zum Namen. */
function linieZu(folge: string, band: Bandwahl | null): string[] | null {
  const name = folge.split(" ");
  const dazu = band ? folgezuege(band.daten, folge, band.band) : [];
  const lang = dazu.length > 0 ? kanonischeLinie(GRUNDSTELLUNG, [...name, ...dazu]) : null;
  return lang ?? kanonischeLinie(GRUNDSTELLUNG, name);
}

/** Beginnt die Linie mit dem Kern (ganze Züge)? */
function mitKern(linie: readonly string[], kern: readonly string[]): boolean {
  return kern.length <= linie.length && kern.every((z, i) => linie[i] === z);
}

/**
 * Der Baum der Praxis zur Eröffnung: jede Zugfolge, die (verlängert) mit dem Kern beginnt.
 *
 * Eingaben: Kern (Schreibweise von chessops), Zugfolgen (praxisfolgen), Band oder null.
 * Ausgabe: Knoten mit Herkunft „partie“; die häufigste Linie zuerst (Hauptvariante).
 * Beispiel: Kern e4 c5 (Sizilianisch), Band 1200 → Sizilianisch mit Old Sicilian, Smith-Morra …
 * Sonderfall: Zugfolgen, die nicht spielbar sind (neue Daten), fallen weg.
 */
export function praxisbaum(
  kern: readonly string[],
  folgen: readonly string[],
  band: Bandwahl | null,
): Variationsknoten[] {
  let baum: Variationsknoten[] = [];
  for (const folge of folgen) {
    const linie = linieZu(folge, band);
    if (!linie || !mitKern(linie, kern)) continue;
    baum = vereinige(baum, linieAlsKnoten(GRUNDSTELLUNG, linie, "partie").knoten);
  }
  return baum;
}

/**
 * Setzt einen kurzen Kommentar an jeden Praxiszug, der direkt auf einen Buchzug folgt.
 * Warum: In der Leiste sehen Buch- und Partiezüge gleich aus; so sieht man, wo das Buch endet
 * (Kennzeichnung nach Herkunft, Wunsch des Autors). Ein vorhandener Kommentar bleibt.
 */
export function mitPraxismarke(
  zuege: readonly Variationsknoten[],
  text: string,
  vorherBuch = true,
): Variationsknoten[] {
  return zuege.map((k) => {
    const neuMarke = vorherBuch && k.herkunft === "partie" && !k.kommentar;
    return {
      ...k,
      ...(neuMarke ? { kommentar: text } : {}),
      weiter: mitPraxismarke(k.weiter, text, k.herkunft === "buch"),
    };
  });
}

/**
 * Buch und Praxis in einem Baum: das Buch zuerst (seine Hauptvariante bleibt vorn, seine Züge
 * behalten Herkunft und Zeichen), die Praxis dahinter; jeder Praxiszug hinter dem Buch mit Marke.
 * Beispiel: Spanisch aus dem Buch und Ruy Lopez aus Lichess → gemeinsame Züge einmal, dazu die
 * Abzweige der Praxis, am ersten davon „Praxis (Lichess)“.
 */
export function buchUndPraxis(
  buch: readonly Variationsknoten[],
  praxis: readonly Variationsknoten[],
  marke: string,
): Variationsknoten[] {
  if (buch.length === 0) return [...praxis];
  return mitPraxismarke(vereinige(buch, praxis), marke);
}
