/**
 * Nachspielen im Variantenbaum eines Beispiels: Stellung an einem Pfad, Zeile, Abzweigungen.
 *
 * Rolle im Gesamtbild: Die Zugleiste des Abbildung-Bildschirms (Konzept 10.1, Pflichtenheft 4
 * „Nachspielen“) fragt hier, welche Züge vor und nach der aktuellen Stellung stehen, wo im Buch
 * Abbildungen stehen und welche Abzweigungen es gibt. Ein Pfad ist die Liste der Züge in
 * englischer Kurznotation ab der Startstellung, genau wie in den Daten (`abbildung.beispiel.pfad`).
 * Abhängigkeiten: chessops, schach/notation.ts, erzeugte Typen.
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Zugnummern, „...“ für Schwarz).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import type { Beispiel, Knoten } from "../daten/generiert/beispiel";
import { sanInSprache } from "./notation";

export type { Beispiel, Knoten };

/** Ein Halbzug, wie die Zugleiste ihn zeigt. */
export interface Halbzug {
  /** Zug wie in den Daten („Qb6“). */
  readonly san: string;
  /** Zug in der Sprache des Buches mit Zugzeichen („Db6“, „Sxe5!!“). */
  readonly text: string;
  /** Zugnummer wie im Buch. */
  readonly nummer: number;
  readonly weiss: boolean;
  /** Abbildungen des Buches, die die Stellung nach diesem Zug zeigen. */
  readonly abbildungen: readonly string[];
  /** Pfad bis einschließlich dieses Zuges. */
  readonly pfad: readonly string[];
}

/** Die Knoten entlang eines Pfades; null, wenn ein Zug im Baum nicht vorkommt. */
function knotenEntlang(beispiel: Beispiel, pfad: readonly string[]): Knoten[] | null {
  const knoten: Knoten[] = [];
  let auswahl = beispiel.zuege;
  for (const san of pfad) {
    const naechster = auswahl.find((k) => k.zug === san);
    if (!naechster) return null;
    knoten.push(naechster);
    auswahl = naechster.weiter;
  }
  return knoten;
}

/**
 * Die Hauptvariante nach einem Pfad: höchstens so viele weitere Züge, immer die erste Fortsetzung.
 * Beispiel: Übung 7.46 ab der Aufgabenstellung → [„Qb8+“, „Nxb8“, „Rd8#“] (für k7-motiv).
 */
export function hauptlinie(beispiel: Beispiel, pfad: readonly string[], anzahl: number): string[] {
  const zuege: string[] = [];
  let weg = [...pfad];
  while (zuege.length < anzahl) {
    const naechster = fortsetzungen(beispiel, weg)[0];
    if (!naechster) break;
    zuege.push(naechster.zug);
    weg = [...weg, naechster.zug];
  }
  return zuege;
}

/** Die Fortsetzungen nach einem Pfad (die erste ist die Hauptvariante). */
export function fortsetzungen(beispiel: Beispiel, pfad: readonly string[]): readonly Knoten[] {
  const knoten = knotenEntlang(beispiel, pfad);
  if (!knoten) return [];
  return knoten.at(-1)?.weiter ?? beispiel.zuege;
}

function startstellung(beispiel: Beispiel): Chess | null {
  const setup = parseFen(beispiel.startFen);
  if (setup.isErr) return null;
  const stellung = Chess.fromSetup(setup.value);
  return stellung.isOk ? stellung.value : null;
}

/**
 * Die ganze Zeile durch einen Pfad: die Züge bis dorthin und danach die Hauptvariante bis zum Ende.
 *
 * Warum: Die Zugleiste zeigt immer die Linie, auf der der Leser gerade ist, mit dem aktuellen Zug
 * hervorgehoben; ein Tipp auf einen Zug springt dorthin.
 * Eingaben: Beispiel, Pfad, Sprache. Ausgabe: Halbzüge in Reihenfolge.
 * Beispiel aus dem Buch: k01-a26 mit dem Pfad bis 5... Qb6 → „1. e4 e6 2. d4 … 5... Db6 6. …“.
 * Sonderfälle: Ein unbekannter oder unspielbarer Zug beendet die Zeile an dieser Stelle.
 */
export function zeile(beispiel: Beispiel, pfad: readonly string[], sprachcode: string): Halbzug[] {
  const entlang = knotenEntlang(beispiel, pfad) ?? [];
  const knoten = [...entlang];
  for (let rest = fortsetzungen(beispiel, pfad)[0]; rest; rest = rest.weiter[0]) {
    knoten.push(rest);
  }
  const stellung = startstellung(beispiel);
  const halbzuege: Halbzug[] = [];
  if (!stellung) return halbzuege;
  for (const k of knoten) {
    const zug = parseSan(stellung, k.zug);
    if (!zug) break;
    const weiss = stellung.turn === "white";
    const nummer = stellung.fullmoves;
    stellung.play(zug);
    halbzuege.push({
      san: k.zug,
      text: sanInSprache(k.zug, sprachcode) + k.zeichen,
      nummer,
      weiss,
      abbildungen: k.abbildungen,
      pfad: [...(halbzuege.at(-1)?.pfad ?? []), k.zug],
    });
  }
  return halbzuege;
}

/**
 * Die Stellung nach einem Pfad als FEN.
 *
 * Ausgabe: FEN oder null, wenn der Pfad nicht im Baum steht oder ein Zug nicht spielbar ist.
 * Beispiel: k01-a26, Pfad bis „Qb6“ → die FEN von Abb. 1.26.
 */
export function fenNach(beispiel: Beispiel, pfad: readonly string[]): string | null {
  if (!knotenEntlang(beispiel, pfad)) return null;
  const stellung = startstellung(beispiel);
  if (!stellung) return null;
  for (const san of pfad) {
    const zug = parseSan(stellung, san);
    if (!zug) return null;
    stellung.play(zug);
  }
  return makeFen(stellung.toSetup());
}

/**
 * Andere Züge an dieser Stelle als der Hauptzug, als Halbzüge zum Hineinspringen.
 *
 * Warum: „Abzweigungen wählbar“ (Pflichtenheft 4). Gezeigt wird, was statt des nächsten Zuges der
 * Hauptvariante im Buch auch steht, etwa „statt 2... Sc6 auch 2... d6“.
 */
export function abzweigungen(
  beispiel: Beispiel,
  pfad: readonly string[],
  sprachcode: string,
): Halbzug[] {
  const andere = fortsetzungen(beispiel, pfad).slice(1);
  return andere.flatMap((knoten) =>
    zeile(beispiel, [...pfad, knoten.zug], sprachcode).slice(pfad.length, pfad.length + 1),
  );
}

/** Ob der Pfad die Hauptvariante verlässt (für den Hinweis „Nebenvariante“). */
export function inNebenvariante(beispiel: Beispiel, pfad: readonly string[]): boolean {
  let auswahl = beispiel.zuege;
  for (const san of pfad) {
    if (auswahl[0]?.zug !== san) return true;
    auswahl = auswahl[0].weiter;
  }
  return false;
}
