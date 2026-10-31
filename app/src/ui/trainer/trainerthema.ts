/**
 * Thema, mit dem ein Trainer geöffnet wurde (Gamifizierung Welle 2): „Üben“ an einer Medaille der
 * Meisterschaft (P3), ein Vorschlag aus „Dein nächster Schritt“ (P1) oder der Monatsrückblick
 * (P12) öffnen den Trainer gleich beim richtigen Thema.
 *
 * Rolle im Gesamtbild: Die Ansicht `{ bildschirm: "trainer", kennung, thema }` (app/stapel.ts)
 * trägt die Themenkennung des Antwortprotokolls („taktik:gabel“, „endspiel:opposition“,
 * speicher/themenprotokoll.ts). Der Trainer-Bildschirm stellt sie über diesen Kontext bereit;
 * jeder Bereich liest sie mit `useTrainerthema()` und wählt das Thema vor, sobald er es kann.
 * Bereiche, die es (noch) nicht auswerten, öffnen wie bisher. So braucht ein neuer Trainer keine
 * neue Navigation, nur eine Zeile, die das Thema liest.
 * Abhängigkeiten: React.
 */
import { createContext, useContext } from "react";

/** Themenkennung oder null (Trainer ohne Vorwahl geöffnet). */
export const TrainerthemaKontext = createContext<string | null>(null);

/**
 * Das Thema, mit dem der Trainer geöffnet wurde, ohne Präfix des Trainers; null ohne Vorwahl.
 * Beispiel: geöffnet mit „taktik:gabel“, gefragt im Taktiktrainer mit „taktik“ → „gabel“.
 * Sonderfall: Thema eines anderen Trainers (anderes Präfix) → null.
 */
export function useTrainerthema(praefix: string): string | null {
  return themaFuer(useContext(TrainerthemaKontext), praefix);
}

/** Rein: der Teil nach dem Präfix, sonst null. Beispiel: („falle“, „falle“) → „falle“. */
export function themaFuer(thema: string | null, praefix: string): string | null {
  if (thema === null) return null;
  if (thema === praefix) return thema;
  return thema.startsWith(`${praefix}:`) ? thema.slice(praefix.length + 1) : null;
}
