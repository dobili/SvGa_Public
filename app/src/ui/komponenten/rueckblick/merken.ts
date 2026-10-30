/**
 * Regeln für „Merken“ im Rückblick: welche Züge „Fehler“ vorwählen und wann der Knopf aufleuchtet.
 *
 * Rolle im Gesamtbild: Teil von Merkenbereich.tsx (Beschluss des Autors, 26.10.2026: ein Knopf für
 * Lernsammlung und Fehlerdatenbank; Aufleuchten „lieber zu selten als zu oft“).
 * Abhängigkeiten: spiel/auswertung.ts (Zugklasse), spiel/partie.ts, rueckblicktyp.ts.
 */
import type { Zugklasse } from "../../../spiel/auswertung";
import type { Partie } from "../../../spiel/partie";
import type { Rueckblick } from "./rueckblicktyp";

/** Bei diesen Klassen ist „Fehler“ vorgewählt (Zeichen ?, ?? und „verpasst“). */
export const FEHLERKLASSEN: ReadonlySet<Zugklasse> = new Set(["fehler", "patzer", "verpasst"]);
/** Bei diesen Klassen eines eigenen Zuges leuchtet der Knopf auf: klare Gelegenheiten. */
const GELEGENHEITEN: ReadonlySet<Zugklasse> = new Set(["patzer", "verpasst"]);

/**
 * Ob der Knopf zu diesem Zug aufleuchten soll: eigener Patzer (??) oder verpasster Gewinn.
 * Beispiel: dein Zug 2. g4?? → ja; ein Fehler (?) oder ein Zug der Engine → nein.
 */
export function istGelegenheit(partie: Partie, rueckblick: Rueckblick, index: number): boolean {
  const klasse = rueckblick.urteile[index]?.klasse;
  return partie.zuege[index]?.von === "leser" && klasse !== undefined && GELEGENHEITEN.has(klasse);
}
