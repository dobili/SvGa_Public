/**
 * „Falle oder Köder“ (Kapitel 4): Der Gegner hat gerade den Köder-Zug gespielt und bietet damit
 * Material an. Nehmen oder nicht?
 *
 * Rolle im Gesamtbild: Trainer „falle“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/falle.json (pipeline/trainer/falle.py): die Fallenchecks aus Kapitel 4, die
 * Schläge mit Fragezeichen aus den Zugfolgen der Kapitel 2 und 3 und Aufgaben der freien
 * Lichess-Datenbank (CC0). Jede Aufgabe ist von der Engine entschieden (Verfahren aus P4, R50):
 * „falle“, wenn der Leser nach dem Nehmen eine Widerlegung erleidet und mindestens 1,5 Bauern
 * schlechter steht als vor dem Nehmen (und klar im Minus); „geschenk“, wenn das Nehmen höchstens
 * 0,3 hinter dem besten Zug liegt. Reine Funktionen.
 * Abhängigkeiten: training/zufall.ts, schach/weiterspielen.ts, schach/stellung.ts.
 * Buchbezug: Kapitel 4, „Der Fallencheck“ und „Köder: Material, das absichtlich angeboten wird,
 * damit der Gegner einen bestimmten Zug spielt“ (Abb. 4.18).
 */
import type { Fallenaufgabe } from "../daten/trainerdaten";
import { FIGURENWERT, stellungAusFen } from "../schach/stellung";
import { fenNachZuegen } from "../schach/weiterspielen";
import { mische, type Zufall } from "./zufall";

export type Fallenantwort = Fallenaufgabe["antwort"];

/** Ab diesem Materialverlust in der Widerlegung heißt die Wirkung „verliert Material“. */
const MATERIALVERLUST_AB = 1;

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

/** Was die Widerlegung einer Falle anrichtet (für den Erklärsatz). */
export type Wirkung = "matt" | "material" | "stellung";

/** Material der Seite in Bauerneinheiten (ohne Könige) aus einer FEN, oder null. */
function material(fen: string, seite: "w" | "b"): number | null {
  const s = stellungAusFen(fen);
  if (!s.ok) return null;
  const farbe = seite === "w" ? "white" : "black";
  let summe = 0;
  for (const feld of s.wert.brett.occupied) {
    const figur = s.wert.brett.get(feld);
    if (figur && figur.role !== "king")
      summe += (figur.color === farbe ? 1 : -1) * FIGURENWERT[figur.role];
  }
  return summe;
}

/**
 * Die Wirkung der Widerlegung: Am Ende der Fortsetzung ist der Leser matt, hat Material
 * verloren (gegenüber der Stellung vor dem Nehmen) oder steht nur schlechter.
 *
 * Warum: Der Erklärsatz soll die Widerlegung nennen, nicht nur den Zug (Wunsch des Autors,
 * P4 R50). Beispiel: Légal-Falle (Abb. 4.17): nach Lxd1 Lxf7+ Ke7 Sd5# → „matt“; Klammerfalle
 * (Abb. 4.2): nach cxb5 Df3 verliert Schwarz den Turm a8 → „material“.
 * Sonderfall: Lässt sich die Fortsetzung nicht spielen, gilt „stellung“.
 */
export function wirkungDerWiderlegung(aufgabe: Fallenaufgabe): Wirkung {
  const ende = fenNachZuegen(aufgabe.fen, aufgabe.fortsetzung);
  if (ende === null) return "stellung";
  const s = stellungAusFen(ende);
  if (s.ok && s.wert.regeln?.isCheckmate() && s.wert.amZug === farbeVon(aufgabe.amZug))
    return "matt";
  const vorher = material(aufgabe.fen, aufgabe.amZug);
  const nachher = material(ende, aufgabe.amZug);
  if (vorher !== null && nachher !== null && vorher - nachher >= MATERIALVERLUST_AB)
    return "material";
  return "stellung";
}

function farbeVon(seite: "w" | "b"): "white" | "black" {
  return seite === "w" ? "white" : "black";
}

/** Der Zug des Gegners in der Widerlegung (der zweite Halbzug der Fortsetzung), falls vorhanden. */
export function widerlegungszug(aufgabe: Fallenaufgabe): string | null {
  return aufgabe.fortsetzung[1] ?? null;
}
