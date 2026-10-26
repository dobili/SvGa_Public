/**
 * Wiederholungskarten im Taktiktrainer, in „Falle oder Köder“ (Empfehlung U9), im
 * Strukturerkenner und im Endspieltrainer.
 *
 * Rolle im Gesamtbild: Eine falsch gelöste Aufgabe wird zur Wiederholungskarte
 * (speicher/fortschritt.ts, notiereTrainerantwort). Die Auswahl des Trainers fragt hier die
 * fälligen Aufgaben ab und bietet sie als Runde an (Wiederholungsknopf.tsx).
 * Abhängigkeiten: speicher, training/wiederholung.ts, useRunde.
 */
import { notiereTrainerantwort } from "../../speicher/fortschritt";
import { aendere, useSpeicher } from "../../speicher/speicher";
import {
  aufgabenAusKarten,
  faellige,
  trainerkarte,
  type WiederholterTrainer,
} from "../../training/wiederholung";
import type { Runde } from "./useRunde";

/** Die Kennungen der fälligen Aufgaben eines Trainers, die am längsten wartenden zuerst. */
export function useFaelligeAufgaben(trainer: WiederholterTrainer): string[] {
  const karten = useSpeicher((z) => z.daten.karten);
  return aufgabenAusKarten(faellige(karten, new Date()), trainer);
}

/**
 * Meldet die Antwort an die Runde und an die Wiederholungskarte der Aufgabe.
 *
 * Beispiel: „Lösung zeigen“ bei „taktik-b-7.6“ → Runde zählt falsch, Karte in Kasten 1.
 * Sonderfall: Eine zweite Antwort auf dieselbe Aufgabe zählt nicht (wie in useRunde).
 */
export function antworteMitKarte(
  runde: Runde,
  trainer: WiederholterTrainer,
  aufgabe: string,
  richtig: boolean,
): void {
  if (runde.ergebnis !== null) return;
  runde.beantworte(richtig);
  const karte = trainerkarte(trainer, aufgabe);
  void aendere((daten) => notiereTrainerantwort(daten, karte, richtig, new Date()));
}
