/**
 * Abwehrzüge: die Antworten auf ein Schach und auf eine Mattdrohung.
 *
 * Rolle im Gesamtbild: Baustein für die Kandidaten der Denkroutine (k12-kandidaten). Steht die
 * Seite am Zug im Schach, sind alle Abwehrzüge die Kandidaten; droht der Gegner Matt in einem
 * Zug, kommt ein Zug hinzu, der die Drohung abwehrt.
 * Abhängigkeiten: chessops, drohungen.ts.
 * Buchbezug: Glossar „Schach: Der angegriffene Spieler muss sofort reagieren: den König
 * wegziehen, die angreifende Figur schlagen oder eine Figur dazwischenstellen“ (Kapitel 0);
 * Kapitel 12, Denkroutine Schritt 2: Jeder Kandidat erfüllt eine Aufgabe, etwa die
 * „Verteidigung einer Drohung“; Schritt 3 bei Abb. 12.2: „Jetzt hat der König vier Felder, und
 * für jedes brauchst du eine eigene Fortsetzung.“
 */
import type { Chess } from "chessops/chess";
import { makeSan } from "chessops/san";
import type { Color, NormalMove } from "chessops/types";
import { makeUci, squareRank } from "chessops/util";
import { legaleZuege, schachs, schlaege, type Zugangabe } from "./drohungen";

/** Die drei Arten, ein Schach abzuwehren, in der Reihenfolge des Glossars. */
export type Abwehrart = "wegziehen" | "schlagen" | "dazwischenstellen";
const REIHENFOLGE: readonly Abwehrart[] = ["wegziehen", "schlagen", "dazwischenstellen"];

/** Ein Zug, der ein Schach abwehrt, mit seiner Art. */
export interface Abwehrzug extends Zugangabe {
  readonly art: Abwehrart;
}

/** Welche der drei Arten ein Abwehrzug ist: Schlägt er eine Schach gebende Figur, ist es „schlagen“. */
function abwehrart(regeln: Chess, zug: NormalMove): Abwehrart {
  if (regeln.ctx().checkers.has(zug.to)) return "schlagen";
  return regeln.board.get(zug.from)?.role === "king" ? "wegziehen" : "dazwischenstellen";
}

/**
 * Alle Züge, die das Schach der Seite am Zug abwehren, geordnet nach wegziehen, schlagen,
 * dazwischenstellen.
 *
 * Warum: Im Schach gibt es nur diese Züge; jeder ist ein Kandidat, und für jeden braucht der
 * Gegner eine eigene Fortsetzung (Kapitel 12, Schritt 3 bei Abb. 12.2).
 * Eingaben: Regeln (Seite am Zug im Schach). Ausgabe: Abwehrzüge; leer, wenn kein Schach
 * besteht oder die Seite matt ist.
 * Beispiel: Abb. 12.3 nach 3. Dd3+: Kxg5, Kh5, Kh6 (wegziehen) und f5 (dazwischenstellen).
 * Sonderfall: Der König, der die Schach gebende Figur schlägt, zählt als „schlagen“.
 */
export function abwehrzuege(regeln: Chess): Abwehrzug[] {
  if (!regeln.isCheck()) return [];
  const zuege = legaleZuege(regeln).map((zug): Abwehrzug => ({
    von: zug.from,
    nach: zug.to,
    san: makeSan(regeln, zug),
    uci: makeUci(zug),
    art: abwehrart(regeln, zug),
  }));
  return zuege.sort((a, b) => REIHENFOLGE.indexOf(a.art) - REIHENFOLGE.indexOf(b.art));
}

/** Die Grundreihe einer Farbe (Reihe 1 für Weiß, Reihe 8 für Schwarz, gezählt ab 0). */
const GRUNDREIHE: Record<Color, number> = { white: 0, black: 7 };

/** Ob der Zug eine Leichtfigur von der Grundreihe entwickelt (Kapitel 1, Eröffnungsziel Entwicklung). */
function entwickelt(regeln: Chess, zug: NormalMove): boolean {
  const figur = regeln.board.get(zug.from);
  if (!figur || (figur.role !== "knight" && figur.role !== "bishop")) return false;
  return squareRank(zug.from) === GRUNDREIHE[figur.color];
}

/**
 * Die Züge der Seite am Zug, nach denen der Gegner kein Matt in einem Zug mehr hat; Schachs
 * zählen nicht (sie schieben die Drohung nur auf und stehen schon unter den Schachs).
 *
 * Warum: Kapitel 12, Schritt 2 nennt als Aufgabe eines Kandidaten die „Verteidigung einer
 * Drohung“. Droht Matt, muss ein solcher Kandidat dabei sein, sonst bleibt nur die Wahl
 * zwischen Zügen, nach denen man matt ist oder die Dame gibt (Befund C1.28, Abb. 12.4).
 * Eingaben: Regeln (Seite am Zug, nicht im Schach). Ausgabe: abwehrende Züge in der Reihenfolge
 * der legalen Züge.
 * Beispiel: Abb. 12.4 (Opernpartie nach 6. Lc4): Weiß droht Dxf7#; Sf6, Sh6, f6, De7 und Df6
 * wehren ab, b5 nicht.
 */
export function mattAbwehrende(regeln: Chess): NormalMove[] {
  return legaleZuege(regeln).filter((zug) => {
    const danach = regeln.clone();
    danach.play(zug);
    return !danach.isCheck() && !schachs(danach).some((schach) => schach.matt);
  });
}

/**
 * Der beste Zug gegen ein drohendes Matt: zuerst einer, nach dem der Gegner keinen Schlag mit
 * Gewinn hat, dann einer, der zugleich eine Leichtfigur von der Grundreihe entwickelt (Schritt 2:
 * „Verteidigung einer Drohung oder Verbesserung einer schlecht stehenden Figur“), sonst der erste.
 *
 * Eingaben: Regeln (Seite am Zug), UCI der Züge, die schon Kandidaten sind. Ausgabe: der Zug,
 * oder null, wenn kein weiterer Zug das Matt abwehrt.
 * Beispiel: Abb. 12.4: 6... Sf6 stellt sich zwischen Dame f3 und f7 und entwickelt den
 * Springer; so geht es auch in der Opernpartie (Kapitel 11) weiter.
 */
export function besteMattabwehr(regeln: Chess, ausgenommen: ReadonlySet<string>): Zugangabe | null {
  const zuege = mattAbwehrende(regeln).filter((zug) => !ausgenommen.has(makeUci(zug)));
  const ohneVerlust = zuege.filter((zug) => {
    const danach = regeln.clone();
    danach.play(zug);
    return !schlaege(danach).some((schlag) => schlag.bilanz > 0);
  });
  const auswahl = ohneVerlust.length > 0 ? ohneVerlust : zuege;
  const zug = auswahl.find((z) => entwickelt(regeln, z)) ?? auswahl[0];
  if (!zug) return null;
  return { von: zug.from, nach: zug.to, san: makeSan(regeln, zug), uci: makeUci(zug) };
}
