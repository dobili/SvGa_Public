/**
 * Kurze Partieformen des Abenteuers: wann eine Partie nach einer festen Zahl eigener Züge endet und
 * wie die Bewertung der Stellung dann den Ausgang bestimmt (Regelwerk R13 Stellungsduell, R13a
 * Endspiel, R13b Vorteil herausarbeiten; Wunsch des Autors vom 17.11.2026: nicht jede Begegnung
 * eine ganze Partie).
 *
 * Rolle im Gesamtbild: Reine Regeln ohne Engine und Oberfläche. Die Spielhülle
 * (anbindung/useKurzform.ts) fragt nach jedem Zug `wertungFaellig`, lässt die Stellung von der
 * Auswertungs-Engine bewerten und setzt mit `kurzformEnde` das Ende der Partie; das Partieergebnis
 * (anbindung/partieergebnis.ts) liest es mit `ausgangDerKurzform`.
 * Abhängigkeiten: schnittstelle/partie.ts (Partieformat), spiel/ergebnis.ts, spiel/partie.ts.
 * Regel: Kapitel 12, Stellungsbeurteilung (Vorteil in Bauerneinheiten).
 */
import type { Color } from "chessops/types";
import type { Partieende } from "../../spiel/ergebnis";
import type { Partie } from "../../spiel/partie";
import type { Partieformat } from "../schnittstelle/partie";

/** Die kurze Form einer Partie, so wie sie in der Partieeinstellung gespeichert wird. */
export interface Kurzform {
  readonly art: "stellungsduell" | "vorteil" | "endspiel";
  /** Eigene Züge des Lesers, nach denen bewertet wird. */
  readonly zuege: number;
  /** Stellungsduell und Vorteil: so viele Bauern braucht der Sieg. */
  readonly mindestvorteil?: number;
  /** Endspiel: gewinnen oder Remis halten. */
  readonly ziel?: "sieg" | "remis";
}

/** Endspiel „gewinnen“: ab diesem Vorteil gilt es als gewonnen (etwa eine Figur mehr). */
export const ENDSPIEL_GEWONNEN = 3.0;
/** Endspiel „Remis halten“: bis zu diesem Nachteil gilt die Stellung als gehalten. */
export const ENDSPIEL_GEHALTEN = 1.5;

/**
 * Die kurze Form aus dem Format einer Begegnung; null für ganze Partie und Wiedereinstieg.
 * Beispiel: { art: "vorteil", zuege: 10, mindestvorteil: 1 } → dieselben Werte.
 */
export function kurzformAus(format: Partieformat): Kurzform | null {
  switch (format.art) {
    case "stellungsduell":
    case "vorteil":
      return { art: format.art, zuege: format.zuege, mindestvorteil: format.mindestvorteil };
    case "endspiel":
      return { art: "endspiel", zuege: format.zuege, ziel: format.ziel };
    default:
      return null;
  }
}

/** Zahl der Züge des Lesers in der Partie. Beispiel: 1. e4 e5 2. Sf3 als Weiß → 2. */
export function eigeneZuege(partie: Pick<Partie, "zuege">): number {
  return partie.zuege.filter((z) => z.von === "leser").length;
}

/**
 * Ist jetzt die Wertung fällig? Ja, wenn die Partie läuft, der Leser seine Züge gemacht hat und
 * der Gegner geantwortet hat (der Leser wäre wieder am Zug). So zieht die Engine nicht mehr
 * dazwischen, und die bewertete Stellung ist die, die der Leser sieht.
 * Beispiel: 10 Züge, Leser Weiß, 20 Halbzüge gespielt → true; 19 Halbzüge → false.
 */
export function wertungFaellig(partie: Pick<Partie, "zuege" | "ende">, form: Kurzform): boolean {
  if (partie.ende) return false;
  const letzter = partie.zuege[partie.zuege.length - 1];
  return eigeneZuege(partie) >= form.zuege && letzter?.von === "engine";
}

/** Noch zu spielende eigene Züge (für die Anzeige), nie unter null. */
export function restzuege(partie: Pick<Partie, "zuege">, form: Kurzform): number {
  return Math.max(0, form.zuege - eigeneZuege(partie));
}

/**
 * Der Ausgang aus der Bewertung nach den Zügen (aus Sicht des Lesers, in Bauern).
 * Regeln: R13 und R13b: ≥ Mindestvorteil Sieg, 0 bis darunter Remis, < 0 Niederlage. R13a
 * gewinnen: ≥ ENDSPIEL_GEWONNEN Sieg, > −ENDSPIEL_GEHALTEN Remis, sonst Niederlage. R13a Remis
 * halten: ≥ −ENDSPIEL_GEHALTEN Sieg (gehalten), sonst Niederlage.
 * Beispiel: Stellungsduell mit Mindestvorteil 1, Wert +1,4 → „sieg“.
 */
export function ausgangNachWert(form: Kurzform, wert: number): "sieg" | "remis" | "niederlage" {
  if (form.art === "endspiel") {
    if (form.ziel === "remis") return wert >= -ENDSPIEL_GEHALTEN ? "sieg" : "niederlage";
    if (wert >= ENDSPIEL_GEWONNEN) return "sieg";
    return wert > -ENDSPIEL_GEHALTEN ? "remis" : "niederlage";
  }
  const mindest = form.mindestvorteil ?? 1;
  if (wert >= mindest) return "sieg";
  return wert >= 0 ? "remis" : "niederlage";
}

/**
 * Das Partieende nach der Wertung: „ziel“ mit Sieger oder „zielRemis“.
 * Beispiel: Leser Schwarz, Ausgang „niederlage“ → { art: "ziel", sieger: "white" }.
 */
export function kurzformEnde(form: Kurzform, wert: number, eigene: Color): Partieende {
  const ausgang = ausgangNachWert(form, wert);
  if (ausgang === "remis") return { art: "zielRemis" };
  const andere: Color = eigene === "white" ? "black" : "white";
  return { art: "ziel", sieger: ausgang === "sieg" ? eigene : andere };
}

/**
 * Ausgang einer kurzen Form, wenn die Partie nach den Regeln endete (Matt, Patt, Wiederholung):
 * Beim Endspiel „Remis halten“ ist ein Remis nach den Regeln das Ziel, also ein Sieg.
 * Ausgabe: der geänderte Ausgang oder null (dann gilt der gewöhnliche).
 */
export function ausgangDerKurzform(form: Kurzform | undefined, ende: Partieende): "sieg" | null {
  if (!form || form.art !== "endspiel" || form.ziel !== "remis") return null;
  // Ein angenommenes Remisangebot (Karte, „vereinbart“) ist kein gehaltenes Endspiel (R13a).
  if ("sieger" in ende || ende.art === "vereinbart") return null;
  return "sieg";
}
