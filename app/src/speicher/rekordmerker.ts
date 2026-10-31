/**
 * Übernahme der Bestwerte aus Merkern in die Rekorde (Gamifizierung G5): Taktik auf Zeit und die
 * beste Tagesserie.
 *
 * Rolle im Gesamtbild: Beide standen bisher nur als Merker im localStorage (ui/trainer/
 * ZeitrundeBereich.tsx) und gingen nicht in die Datensicherung. Ab Format 7 stehen sie zusätzlich
 * als Rekord in den Nutzerdaten; beim Laden wird der größere Wert übernommen, damit nichts
 * verloren geht. Die Merker bleiben (die Zeitrunde liest sie weiter), bis die Rekordtafel (P5)
 * sie ablöst.
 * Abhängigkeiten: speicher/gamifizierung.ts, training/kurzplaene.ts (Serie lesen).
 */
import { serieAus } from "../training/kurzplaene";
import type { Gamifizierungsdaten } from "./gamifizierung";

/** Kennung des Rekords „Taktik auf Zeit“ (richtige Aufgaben in drei Minuten). */
export const REKORD_TAKTIKZEIT = "taktikZeit";
/** Kennung des Rekords „beste Tagesserie“ (Tage mit Tagesaufgabe). */
export const REKORD_TAGESSERIE = "tagesserie";

/**
 * Übernimmt die Bestwerte aus den Merkern, wenn sie größer sind als die gespeicherten Rekorde.
 *
 * Eingaben: Daten, Text der Merker „taktikzeitBeste“ und „tagesserie“ (null ohne Merker),
 * Zeitpunkt für das Datum. Ausgabe: dieselben Daten, wenn nichts neu ist (dann wird nicht
 * geschrieben). Beispiel: Merker 11, Rekord fehlt → Rekord 11 mit heutigem Datum.
 */
export function mitMerkerRekorden<T extends Pick<Gamifizierungsdaten, "rekorde">>(
  daten: T,
  taktikzeit: string | null,
  serie: string | null,
  jetzt: Date,
): T {
  const werte: [string, number][] = [
    [REKORD_TAKTIKZEIT, Number(taktikzeit ?? 0)],
    [REKORD_TAGESSERIE, serieAus(serie).beste],
  ];
  let rekorde = daten.rekorde;
  for (const [kennung, wert] of werte) {
    if (!Number.isFinite(wert) || wert <= (rekorde[kennung]?.wert ?? 0)) continue;
    rekorde = { ...rekorde, [kennung]: { wert, datum: jetzt.toISOString() } };
  }
  return rekorde === daten.rekorde ? daten : { ...daten, rekorde };
}
