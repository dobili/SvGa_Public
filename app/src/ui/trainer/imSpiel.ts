/**
 * Schalter „im Spiel“ für die Trainerkomponenten: Läuft eine Runde im Schach-Abenteuer, blenden
 * Rundenrahmen und Aufgaben alles aus, was die Geschichte nicht braucht (Lernsammlung, „Als
 * Variante öffnen“, „Aufgabe wiederholen“, Kombo, Herkunftszeile, „Freunde herausfordern“).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (10.11.2026, docs/spiel/18_Spielhuelle.md): Die Logik
 * der Trainer bleibt, nur die Darstellung wird knapper. Der Rundenrahmen setzt den Schalter über
 * seine Eigenschaft `imSpiel` (Vorgabe aus) und reicht ihn als Kontext an die Aufgaben weiter,
 * damit nicht jede Aufgabenkomponente eine eigene Eigenschaft braucht. In der Buch-App ist der
 * Schalter immer aus; dort ändert sich nichts.
 * Abhängigkeiten: React.
 */
import { createContext, useContext } from "react";

/** Der Kontext; ohne Rundenrahmen des Spiels immer false. */
export const ImSpielKontext = createContext(false);

/**
 * Läuft die Aufgabe in einer Runde des Schach-Abenteuers?
 * Beispiel: Taktikaufgabe in Sams Aufgabenreihe → true, im Taktiktrainer der App → false.
 */
export function useImSpiel(): boolean {
  return useContext(ImSpielKontext);
}
