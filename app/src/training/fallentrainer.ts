/**
 * „Falle oder Köder“ (Kapitel 4): Der Gegner bietet Material an. Nehmen oder nicht?
 *
 * Rolle im Gesamtbild: Trainer „falle“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/falle.json (Fable): die zwölf Fallenchecks aus Kapitel 4 und Aufgaben der
 * freien Lichess-Datenbank (CC0). Jede Aufgabe ist von der Engine entschieden: „falle“, wenn das
 * Nehmen mindestens 1,5 Bauern gegenüber dem besten Zug verliert, „geschenk“, wenn es höchstens
 * 0,3 dahinter liegt. Reine Funktionen.
 * Abhängigkeiten: training/zufall.ts.
 * Buchbezug: Kapitel 4, „Der Fallencheck“.
 */
import type { Fallenaufgabe } from "../daten/trainerdaten";
import { mische, type Zufall } from "./zufall";

export type Fallenantwort = Fallenaufgabe["antwort"];

/**
 * Eine Runde: Fallen und Geschenke etwa zur Hälfte, nahe an der gewählten Stufe, leichteste
 * zuerst.
 *
 * Warum: Lernt der Leser, dass meist eine Falle kommt, nimmt er nie mehr; der Fallencheck aus
 * Kapitel 4 soll aber unterscheiden, nicht nur ablehnen. Deshalb kommen echte Geschenke ebenso oft.
 * Eingaben: Aufgaben, Stufe 1 bis 5 oder null, Anzahl, Zufall.
 */
export function fallenrunde(
  aufgaben: readonly Fallenaufgabe[],
  stufe: number | null,
  anzahl: number,
  zufall: Zufall,
): Fallenaufgabe[] {
  const abstand = (a: Fallenaufgabe) => (stufe === null ? 0 : Math.abs(a.schwierigkeit - stufe));
  const nahe = (art: Fallenantwort) =>
    mische(
      aufgaben.filter((a) => a.antwort === art),
      zufall,
    ).sort((a, b) => abstand(a) - abstand(b));
  const haelfte = Math.ceil(anzahl / 2);
  const fallen = nahe("falle").slice(0, haelfte);
  const geschenke = nahe("geschenk").slice(0, anzahl - fallen.length);
  return mische([...fallen, ...geschenke], zufall).sort(
    (a, b) => a.schwierigkeit - b.schwierigkeit,
  );
}

/** Ob die Entscheidung des Lesers stimmt: Bei einer Falle nicht nehmen, beim Geschenk nehmen. */
export function pruefeEntscheidung(aufgabe: Fallenaufgabe, nimmt: boolean): boolean {
  return nimmt === (aufgabe.antwort === "geschenk");
}
