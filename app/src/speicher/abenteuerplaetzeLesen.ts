/**
 * Liest die ruhenden Speicherplätze des Schach-Abenteuers (Feld `abenteuerplaetze` der
 * Nutzerdaten, seit 27.11.2026).
 *
 * Warum: Der Autor wünscht beliebig viele Spielstände mit einem Hauptmenü (27.11.2026). Der
 * gespielte Stand bleibt im Feld `abenteuer`; die übrigen ruhen hier, jeder mit der offenen Partie,
 * die zu ihm gehörte (abenteuer/anbindung/speicherplaetze.ts). Ein zusätzliches Feld wie
 * `zugErraten`: Format 11 bleibt, ältere Daten haben keine ruhenden Plätze (leere Liste). In der
 * Beta darf eine ältere App das Feld beim Speichern verlieren (Wunsch des Autors, 6.11.2026).
 * Abhängigkeiten: abenteuer/regeln/spielstand.ts (ein Stand), speicher/partienLesen.ts (Partie).
 */
import { abenteuerstandAus } from "../abenteuer/regeln/spielstand";
import type { Ruheplatz } from "../abenteuer/schnittstelle/spielstand";
import { partieAus } from "./partienLesen";

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/**
 * Die ruhenden Plätze aus Rohdaten (IndexedDB oder Sicherung).
 * Eingabe: der Rohwert des Feldes. Ausgabe: lesbare Plätze in der gespeicherten Reihenfolge.
 * Beispiel: [{ stand: <Stand von Kim>, laufend: null }] bleibt; „kaputt“ wird [].
 * Sonderfälle: Unlesbare Stände (auch aus einer neueren Spielversion) fallen einzeln weg; zwei
 * Plätze mit demselben Beginn gelten als einer (der erste bleibt); eine unlesbare Partie wird null.
 */
export function abenteuerplaetzeAus(roh: unknown): readonly Ruheplatz[] {
  if (!Array.isArray(roh)) return [];
  const plaetze: Ruheplatz[] = [];
  const gesehen = new Set<string>();
  for (const eintrag of roh) {
    if (!istObjekt(eintrag)) continue;
    const stand = abenteuerstandAus(eintrag.stand);
    if (!stand || gesehen.has(stand.begonnen)) continue;
    gesehen.add(stand.begonnen);
    plaetze.push({ stand, laufend: eintrag.laufend ? partieAus(eintrag.laufend) : null });
  }
  return plaetze;
}
