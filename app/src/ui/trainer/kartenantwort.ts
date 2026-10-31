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
import { notiereThemenantwort } from "../../speicher/themenprotokoll";
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
 * Gamifizierung G1: Mit Thema (etwa „taktik:gabel“, speicher/themenprotokoll.ts) zählt die
 * Antwort auch im Antwortprotokoll je Thema.
 * Sonderfall: Eine zweite Antwort auf dieselbe Aufgabe zählt nicht (wie in useRunde).
 */
export function antworteMitKarte(
  runde: Runde,
  trainer: WiederholterTrainer,
  aufgabe: string,
  richtig: boolean,
  thema: string | null = null,
): void {
  if (runde.ergebnis !== null) return;
  runde.beantworte(richtig);
  const karte = trainerkarte(trainer, aufgabe);
  const jetzt = new Date();
  void aendere((daten) => {
    const mitKarte = notiereTrainerantwort(daten, karte, richtig, jetzt);
    return thema === null ? mitKarte : notiereThemenantwort(mitKarte, thema, richtig, jetzt);
  });
}
