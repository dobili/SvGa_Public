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

/**
 * Die Aufgabe zur Erinnerung: Start in der Stellung vor dem Zug `abZug` der gewählten Seite,
 * die restlichen Züge der Partie zum Raten. Null, wenn die Partie fehlt oder zu kurz ist.
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
  const vorher = 2 * (erinnerung.abZug - 1) + (erinnerung.seite === "black" ? 1 : 0);
  if (vorher >= linie.length) return null;
  return {
    titel: partietitel(partie, sprachcode),
    startFen: stellungNach(START, linie.slice(0, vorher)),
    linie: linie.slice(vorher),
    seite: erinnerung.seite,
    zusatz: partie,
  };
}
