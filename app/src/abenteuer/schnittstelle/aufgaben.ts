/**
 * Vertrag für Aufgabenrunden (Regelwerk R30 bis R32, Entscheidung A7): Was das Spiel der App
 * übergibt, damit sie eine Runde aus Buchübungen und Motivaufgaben spielt, und was zurückkommt.
 *
 * Rolle im Gesamtbild: Ein Dialog ruft `beginneAufgaben(runde)`; die Oberwelt baut daraus mit
 * runden.json, dem Club des Ortes und der Abenteuerwertung diesen Auftrag (regeln/aufgaben.ts)
 * und übergibt ihn den Appdiensten. Die App spielt die Runde im Trainer (anbindung/
 * AufgabenAnsicht.tsx) und legt das Ergebnis in den Spielstand; die Oberwelt liest es beim
 * Rückweg und wertet es aus (bestanden ab 70 Prozent, R31).
 * Beispiel: Sams Block der Aufgabenreihe in Maple Falls → buchuebungen [„ueb:droh-ignorieren“],
 * themen [„haengend“], anzahl 4, schwierigkeit 2.
 */
import type { Antwortergebnis } from "../../training/wiederholung";

export interface Aufgabenauftrag {
  /** Kennung dieses Versuchs (Runde plus Zeitstempel), zum Beispiel „mapleFalls.reiheSam#m3k9“. */
  readonly kennung: string;
  /** Kennung der Runde in runden.json, auf die Quests warten. */
  readonly runde: string;
  /** Textschlüssel des Namens der Figur, die die Aufgaben stellt (Kopfzeile der Runde). */
  readonly steller: string;
  /** Buchkapitel des Clubs, für die Buchübungen. */
  readonly kapitel: number;
  /** Labels der Buchübungen („ueb:…“), die als Aufgaben des Taktiktrainers vorliegen. */
  readonly buchuebungen: readonly string[];
  /** Motive und Themen der Trainer, wie in training/zusatzaufgaben.ts („haengend“, „matt1“ …). */
  readonly themen: readonly string[];
  /** Zahl der Motivaufgaben (zusätzlich zu den Buchübungen) und Zielschwierigkeit 1–5 (R30). */
  readonly anzahl: number;
  readonly schwierigkeit: number;
  /** Wievielter Versuch dieser Runde (R31: ab dem zweiten eine Stufe leichter). */
  readonly versuch: number;
  /** Zählt die Runde für Wiederholung und Tagesprotokoll der App (R32, Entscheidung A8)? */
  readonly zaehltFuerApp: boolean;
}

/** Ergebnis einer Aufgabenrunde für das Spiel. */
export interface Aufgabenergebnis {
  readonly kennung: string;
  /** Je Aufgabe in der gespielten Reihenfolge; „mitHilfe“ zählt einen halben Punkt (R31). */
  readonly ergebnisse: readonly Antwortergebnis[];
  readonly sekunden: number;
}

/** Was der Leser in einer Runde erreicht hat (im Spielstand, je Runde ein Eintrag). */
export interface Rundenstand {
  readonly kennung: string;
  readonly bestanden: boolean;
  readonly versuche: number;
  /** Punkte und mögliche Punkte des letzten Versuchs. */
  readonly punkte: number;
  readonly moeglich: number;
}
