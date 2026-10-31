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
import { REKORDARTEN } from "../training/rekordarten";
import { pruefeRekorde } from "../training/rekorde";
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

/** Rekordtafel (P5): Rekorde der Quelle „partie“ prüfen (Lerntage, besiegte Bots …). */
const rekorde: Partiefolge = (daten, _partie, jetzt) =>
  pruefeRekorde(daten, { quelle: "partie" }, jetzt, REKORDARTEN).daten;

/** Alle Wirkungen nach dem Partieende; Pakete tragen hier je eine Zeile ein. */
export const NACH_PARTIEENDE: readonly Partiefolge[] = [protokolliere, rekorde];

/** Eine Wirkung nach der Auswertung einer Partie (Werte, Zugklassen): Daten, Kennung, Zeitpunkt. */
export type Auswertungsfolge = (daten: Nutzerdaten, partieId: string, jetzt: Date) => Nutzerdaten;

/**
 * Alle Wirkungen nach der Auswertung (Vorschlag aus P5, 31.10.2026): Was erst mit Werten und
 * Zugklassen feststeht (Wertung, längste Partie ohne Patzer), prüft sich hier statt erst beim
 * nächsten Öffnen der Rekordtafel. Pakete tragen je eine Zeile ein.
 */
export const NACH_AUSWERTUNG: readonly Auswertungsfolge[] = [
  (daten, _id, jetzt) => pruefeRekorde(daten, { quelle: "partie" }, jetzt, REKORDARTEN).daten,
];

/** Wendet die Wirkungen nach der Auswertung an. Beispiel: Auswertung fertig → Rekorde geprüft. */
export function nachAuswertung(daten: Nutzerdaten, partieId: string, jetzt: Date): Nutzerdaten {
  return NACH_AUSWERTUNG.reduce((d, folge) => folge(d, partieId, jetzt), daten);
}

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
