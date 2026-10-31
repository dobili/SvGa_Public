/**
 * Rekorde eines Anlasses einmal nach dem Anzeigen prüfen (Gamifizierung P5), etwa am Rundenende.
 * Abhängigkeiten: training/rekorde.ts, training/rekordarten.ts, Speicher, React.
 */
import { useEffect, useRef, useState } from "react";
import { aendere } from "../../../speicher/speicher";
import { REKORDARTEN } from "../../../training/rekordarten";
import type { Nutzerdaten } from "../../../speicher/format";
import { pruefeRekorde, type Rekordanlass, type Verbesserung } from "../../../training/rekorde";

/**
 * Ändert die Nutzerdaten, prüft danach die Rekorde des Anlasses und speichert beides in einem Zug.
 * Ausgabe: die Verbesserungen, sobald gespeichert ist. Beispiel: Zeitrunde mit 14 richtigen →
 * Durchgang notieren, dann { quelle: "zeitrunde", wert: 14 } prüfen.
 */
export function aendereMitRekorden(
  aenderung: (daten: Nutzerdaten, jetzt: Date) => Nutzerdaten,
  anlass: Rekordanlass,
): Promise<readonly Verbesserung[]> {
  let gefunden: readonly Verbesserung[] = [];
  return aendere((daten) => {
    const jetzt = new Date();
    const geprueft = pruefeRekorde(aenderung(daten, jetzt), anlass, jetzt, REKORDARTEN);
    gefunden = geprueft.neue;
    return geprueft.daten;
  }).then(() => gefunden);
}

/**
 * Prüft die Rekorde eines Anlasses einmal nach dem Anzeigen und gibt die Verbesserungen zurück.
 *
 * Warum der Aufschub (queueMicrotask): Das Rundenende schreibt den Durchgang im Effekt der
 * Trainerkomponente (useRunde.ts), und Effekte der Eltern laufen nach denen der Kinder. Erst danach
 * steht die Runde im Tagesprotokoll, das etwa der Rekord „trainerTag“ liest.
 */
export function useRekordpruefung(anlass: Rekordanlass): readonly Verbesserung[] {
  const [neue, setzeNeue] = useState<readonly Verbesserung[]>([]);
  const geprueft = useRef(false);
  const { quelle, wert } = anlass;
  useEffect(() => {
    if (geprueft.current) return;
    geprueft.current = true;
    queueMicrotask(() => {
      void aendereMitRekorden((daten) => daten, { quelle, wert }).then(setzeNeue);
    });
  }, [quelle, wert]);
  return neue;
}
