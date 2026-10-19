/**
 * Die Zugfolgen des Buches eines Kapitels, ohne die von Claude konstruierten Partien.
 *
 * Rolle im Gesamtbild: Seit 0.2.96 (Entscheidung des Autors vom 18.10.2026) gibt es zu Abbildungen
 * ohne Zugfolge im Buch konstruierte Partien ab der Grundstellung (`status` „konstruiert“). Sie
 * dienen nur dem Nachspielen bis zur Abbildung. Alles, was Buchzüge als Wissen nutzt (Studien und
 * „Zug erraten“, Repertoire-Trainer, Eröffnungsindex mit den Buchzügen der Engine), nimmt nur die
 * Zugfolgen des Buches (Regel 1: Das Buch ist die einzige Quelle).
 * Abhängigkeiten: erzeugte Typen aus den Schemas.
 */
import type { Kapitel } from "./generiert/kapitel";

type Beispiel = Kapitel["beispiele"][number];

/**
 * Die Beispiele des Kapitels, die aus dem Buch stammen (freigegeben oder Entwurf).
 * Beispiel: Kapitel 10 mit der konstruierten Partie zu Abb. 10.21 → alle außer k10-a21-k.
 */
export function buchbeispiele(kapitel: Pick<Kapitel, "beispiele">): Beispiel[] {
  return kapitel.beispiele.filter((b) => b.status !== "konstruiert");
}
