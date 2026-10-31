/**
 * Nach dem Ende einer Partie: Eintrag ins Tagesprotokoll (Gamifizierung G2), gemeinsamer Ort für
 * weitere Pakete (Rekorde P5, Duelle P8, eigene Ziele P13).
 *
 * Rolle im Gesamtbild: Die Partie selbst (spiel/, ui/komponenten/partie/) ist für die
 * Arbeitschats gesperrt. Statt dort einzugreifen, hängen die Pakete ihre reinen Funktionen an
 * NACH_PARTIEENDE an; ui/komponenten/partie/botzug.ts ruft sie einmal auf, wenn eine Partie
 * gerade beendet wurde. Eingelesene Partien (PGN) zählen nicht.
 * Abhängigkeiten: speicher/aktivitaet.ts, spiel/partienfilter.ts, speicher/format.ts.
 */
import type { Partie } from "../spiel/partie";
import { ergebnisFuerLeser } from "../spiel/partienfilter";
import { zaehleAktivitaet } from "./aktivitaet";
import type { Nutzerdaten } from "./format";

/** Eine Wirkung nach dem Partieende: neue Daten aus alten, der Partie und dem Zeitpunkt. */
export type Partiefolge = (daten: Nutzerdaten, partie: Partie, jetzt: Date) => Nutzerdaten;

/** Tagesprotokoll: eine Partie, bei Sieg des Lesers auch ein Sieg. */
const protokolliere: Partiefolge = (daten, partie, jetzt) => {
  const mitPartie = zaehleAktivitaet(daten, "partie", 1, jetzt);
  return ergebnisFuerLeser(partie) === "gewonnen"
    ? zaehleAktivitaet(mitPartie, "sieg", 1, jetzt)
    : mitPartie;
};

/** Alle Wirkungen nach dem Partieende; Pakete tragen hier je eine Zeile ein. */
export const NACH_PARTIEENDE: readonly Partiefolge[] = [protokolliere];

/**
 * Wendet die Wirkungen an, wenn die Partie gerade beendet wurde (vorher lief sie noch).
 *
 * Eingaben: Daten vor dem Schreiben, die neue Partie, ob sie vorher schon beendet war, Zeitpunkt.
 * Beispiel: Matt im 30. Zug gegen Lotte → Protokoll partie + 1, sieg + 1.
 * Sonderfall: Dieselbe beendete Partie noch einmal geschrieben (Auswertung) → nichts.
 */
export function nachPartieende(
  daten: Nutzerdaten,
  partie: Partie,
  vorherBeendet: boolean,
  jetzt: Date,
): Nutzerdaten {
  if (!partie.ende || vorherBeendet || partie.einstellung.importiert) return daten;
  return NACH_PARTIEENDE.reduce((d, folge) => folge(d, partie, jetzt), daten);
}
