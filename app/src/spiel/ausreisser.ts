/**
 * Verdächtige Werte der Auswertung: ein Sprung, der sofort zurückspringt.
 *
 * Rolle im Gesamtbild: Teil der Auswertung (spiel/auswertung.ts, dort weiter ausgeführt); eigene
 * Datei seit Stufe 3 der Varianten, damit auswertung.ts unter 400 Zeilen bleibt.
 * Abhängigkeiten: spiel/auswertung.ts (begrenzt).
 */
import { begrenzt } from "./auswertung";

/** Ein Sprung des Wertes ab dieser Größe, der sofort zurückspringt, ist verdächtig. */
const AUSREISSER_AB = 3;

/**
 * Stellungen, deren Wert verdächtig ist: Er springt gegenüber der Stellung davor um mindestens 3
 * und springt bei der nächsten Stellung in die Gegenrichtung ebenso weit zurück. Das sieht aus wie
 * ein Patzer, den der Gegner sofort zurückgibt, ist bei kurzer Rechenzeit aber meist ein Fehler
 * der Engine (Opernpartie, 15. Lxd7+ „??“ mit 7,4 bei 500 ms unter Last).
 *
 * Eingabe: Werte je Stellung aus Sicht von Weiß. Ausgabe: Indizes, die die Auswertung mit mehr
 * Rechenzeit nachprüft (ui/komponenten/useAuswertung.ts). Beispiel: [10, 10, 2.6, 10] → [2].
 */
export function ausreisser(werte: readonly number[]): number[] {
  const verdaechtig: number[] = [];
  for (let i = 1; i + 1 < werte.length; i += 1) {
    const hin = begrenzt(werte[i] ?? 0) - begrenzt(werte[i - 1] ?? 0);
    const zurueck = begrenzt(werte[i + 1] ?? 0) - begrenzt(werte[i] ?? 0);
    if (Math.abs(hin) >= AUSREISSER_AB && Math.abs(zurueck) >= AUSREISSER_AB && hin * zurueck < 0) {
      verdaechtig.push(i);
    }
  }
  return verdaechtig;
}
