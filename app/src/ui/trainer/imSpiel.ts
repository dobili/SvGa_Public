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
import { createContext, useContext, type ReactNode } from "react";

/** Der Kontext; ohne Rundenrahmen des Spiels immer false. */
export const ImSpielKontext = createContext(false);

/**
 * Läuft die Aufgabe in einer Runde des Schach-Abenteuers?
 * Beispiel: Taktikaufgabe in Sams Aufgabenreihe → true, im Taktiktrainer der App → false.
 */
export function useImSpiel(): boolean {
  return useContext(ImSpielKontext);
}

/**
 * Meldung „Ambrose gefragt“ (docs/spiel/29_Tischgespraech.md, Ereignis `hinweis`): Die Runde des
 * Abenteuers reicht hier einen Rückruf herein; die Aufgaben rufen ihn, wenn der Leser die Hilfe
 * holt. In der Buch-App ist nichts gesetzt (null).
 */
export const HinweisKontext = createContext<(() => void) | null>(null);

/** Der Rückruf für „Ambrose fragen“ oder null außerhalb des Spiels. */
export function useHinweismeldung(): (() => void) | null {
  return useContext(HinweisKontext);
}

/**
 * Darstellung der Runde im Spiel (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 4: „Rätsel
 * verlieren die weiße Trainerkarte“): Das Schach-Abenteuer reicht hier zwei Zeichenfunktionen
 * herein. `fortschritt` ersetzt den Fortschrittsbalken (dort eine Reihe kleiner Figuren),
 * `meldung` die grün-roten Rückmeldungen (dort Ambrose in einer Sprechblase). Fehlt eine, bleibt
 * die Darstellung der App; in der Buch-App ist nichts gesetzt (null).
 */
export interface Spielanzeige {
  readonly fortschritt?: (index: number, anzahl: number) => ReactNode;
  readonly meldung?: (richtig: boolean, text: string) => ReactNode;
}

/** Der Kontext der Spielanzeige; außerhalb des Spiels null. */
export const SpielanzeigeKontext = createContext<Spielanzeige | null>(null);

/** Die Spielanzeige der Runde oder null in der Buch-App. */
export function useSpielanzeige(): Spielanzeige | null {
  return useContext(SpielanzeigeKontext);
}
