/**
 * Erinnerungen Ambroses als Zugerraten (docs/spiel/08, F1 bis F3; Entscheidung C3): eine
 * Klassikerpartie ab einem Zug, mit einer Seite, als Aufgabe des Trainers „Zug erraten“.
 *
 * Rolle im Gesamtbild: App-Seite der Modulgrenze; die Aufgabenansicht (anbindung/AufgabenAnsicht.tsx)
 * spielt die Aufgabe im vorhandenen Zugerraten der App. Die Partie stammt aus
 * inhalte/zusatzpartien/klassiker.json (gemeinfreie Partien, LIZENZEN).
 * Abhängigkeiten: training/zusatzpartien.ts, training/uebungsaufgabe.ts, schnittstelle/aufgaben.ts.
 */
import type { Ratepartie } from "../../training/studientrainer";
import { partietitel, type Zusatzpartie } from "../../training/zusatzpartien";
import { kanonischeLinie, stellungNach } from "../../training/uebungsaufgabe";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Stelle des Zuges `zug` der Seite in der Liste der Halbzüge (0 = 1. Zug von Weiß). */
function halbzugIndex(zug: number, seite: "white" | "black"): number {
  return 2 * (zug - 1) + (seite === "black" ? 1 : 0);
}

/**
 * Die Aufgabe zur Erinnerung: Start in der Stellung vor dem Zug `abZug` der gewählten Seite,
 * die Züge der Partie bis zum Zug `bisZug` dieser Seite (ohne Angabe bis zum Ende) zum Raten.
 * Null, wenn die Partie fehlt oder zu kurz ist.
 * Warum `bisZug`: Der Werkstatt-Flashback zeigt nur den Anfang der Unsterblichen (Zug 1 bis 11,
 * Story-Bibel Szene 66); ihr Ende rät der Flashback in Riverton. Ohne Ende waren es 23 Züge.
 * Beispiel: Paulsen–Morphy ab Zug 13 mit Schwarz → Start nach 13. Weiß, erster geratener Zug 13… .
 */
export function erinnerungsaufgabe(
  partien: readonly Zusatzpartie[],
  erinnerung: NonNullable<Aufgabenauftrag["erinnerung"]>,
  sprachcode: string,
): Ratepartie | null {
  const partie = partien.find((p) => p.id === erinnerung.partie);
  const linie = partie ? kanonischeLinie(START, partie.zuege.split(" ")) : null;
  if (!partie || !linie) return null;
  const vorher = halbzugIndex(erinnerung.abZug, erinnerung.seite);
  if (vorher >= linie.length) return null;
  const ende =
    erinnerung.bisZug === undefined
      ? linie.length
      : halbzugIndex(erinnerung.bisZug, erinnerung.seite) + 1;
  return {
    titel: partietitel(partie, sprachcode),
    startFen: stellungNach(START, linie.slice(0, vorher)),
    linie: linie.slice(vorher, ende),
    seite: erinnerung.seite,
    zusatz: partie,
  };
}
