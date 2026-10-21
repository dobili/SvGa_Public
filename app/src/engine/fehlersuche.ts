/**
 * Typische Fehlerzüge einer Stellung nach den Werkzeugen des Buches (ohne Engine).
 *
 * Rolle im Gesamtbild: Konzept 8.2, Fehlerarten. Die menschliche Zugwahl (engine/menschenwahl.ts,
 * seit 0.2.117) braucht je Fehlerart die Züge, die in der Stellung eine Gelegenheit zu diesem
 * Fehler sind; die Engine bewertet einige davon gezielt („searchmoves“), denn grobe Fehler fehlen
 * unter ihren besten Kandidaten. Bis 0.2.115 stand hier die Fehlersuche der Stufen 1 bis 4 mit
 * Fehlerwürfen und Fehlerprofilen je Stufe (ersetzt durch die Raten von Menschen je Gelegenheit).
 * Abhängigkeiten: engine/fehlerart.ts.
 */
import { alleZuege, fehlerartIn, type Fehlerart, type Lage } from "./fehlerart";

/** Ein typischer Fehlerzug aus den Werkzeugen, noch ohne Verlust. */
export interface Typischer {
  readonly uci: string;
  readonly art: Fehlerart;
}

/**
 * Alle typischen Fehlerzüge einer Stellung nach den Werkzeugen des Buches (ohne Engine).
 *
 * Beispiel: Abb. 1.13 nach 2. Dh5: 2... Sf6 (Drohung ignoriert), 2... Ke7 (ungedeckte Figuren
 * hängen) und weitere; Züge ohne erkannte Art fehlen.
 */
export function typischeFehlerzuege(lage: Lage): Typischer[] {
  return alleZuege(lage)
    .map((uci) => ({ uci, art: fehlerartIn(lage, uci, [], null) }))
    .filter((k) => k.art !== "ungenau");
}
