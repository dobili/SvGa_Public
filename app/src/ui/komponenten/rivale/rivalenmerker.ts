/**
 * Merker und Sichtbarkeit der Rivalenkarte (Gamifizierung P8).
 *
 * Rolle im Gesamtbild: Zwei Bequemlichkeiten auf dem Gerät, die verloren gehen dürfen (kein
 * Speicherfeld nötig): welcher besiegte Rivale schon gefeiert wurde, und an welchem Tag der Leser
 * zuletzt „Anderer Rivale“ gewählt hat (höchstens einmal am Tag). Dazu die Sichtbarkeit der Karte
 * für die Liste STARTKARTEN: erst, wenn der Leser eine Partie gegen einen Bot beendet hat (dann
 * gibt es eine Bilanz), und solange es einen Rivalen oder eine offene Feier gibt.
 * Abhängigkeiten: app/merker.ts, training/kurzplaene.ts (Tagesschlüssel), training/rivalen.ts,
 * speicher/format.ts (Typ).
 */
import { liesMerker, schreibeMerker } from "../../../app/merker";
import type { Nutzerdaten } from "../../../speicher/format";
import { tagesschluessel } from "../../../training/kurzplaene";
import { aktuellerRivale, besiegteRivalen, RIVALE_VERDIENT } from "../../../training/rivalen";

/** Merker: Kennung des zuletzt gefeierten besiegten Rivalen. */
export const MERKER_RIVALE_GEFEIERT = "rivaleGefeiert";
/** Merker: Tagesschlüssel des letzten Wechsels („2026-10-31“). */
export const MERKER_RIVALE_GEWECHSELT = "rivaleGewechselt";

/** So lange nach dem Sieg wird noch gefeiert (danach nicht mehr, etwa nach einer Sicherung). */
const FEIER_TAGE = 7;
const MS_JE_TAG = 86_400_000;

/**
 * Der zuletzt besiegte Rivale, wenn seine Feier noch aussteht: Sieg in den letzten sieben Tagen
 * und noch nicht gefeiert. Beispiel: gestern Lotte besiegt, Merker leer → "lotte".
 */
export function offeneFeier(daten: Nutzerdaten, jetzt: Date): string | null {
  const letzter = besiegteRivalen(daten).at(-1);
  if (!letzter || liesMerker(MERKER_RIVALE_GEFEIERT) === letzter) return null;
  const datum = Date.parse(daten.verdient[`${RIVALE_VERDIENT}${letzter}`] ?? "");
  return jetzt.getTime() - datum <= FEIER_TAGE * MS_JE_TAG ? letzter : null;
}

/** Merkt sich, dass dieser besiegte Rivale gefeiert ist. */
export function merkeGefeiert(kennung: string): void {
  schreibeMerker(MERKER_RIVALE_GEFEIERT, kennung);
}

/** Darf der Leser heute noch wechseln? Beispiel: am 31.10. gewechselt → am 31.10. nein. */
export function wechselHeuteMoeglich(jetzt: Date): boolean {
  return liesMerker(MERKER_RIVALE_GEWECHSELT) !== tagesschluessel(jetzt);
}

/** Merkt sich den Wechsel heute. */
export function merkeWechsel(jetzt: Date): void {
  schreibeMerker(MERKER_RIVALE_GEWECHSELT, tagesschluessel(jetzt));
}

/** Sichtbarkeit für STARTKARTEN: nach der ersten Partie gegen einen Bot, mit Rivale oder Feier. */
export function rivalenkarteSichtbar(daten: Nutzerdaten, jetzt: Date): boolean {
  if (Object.keys(daten.duelle).length === 0) return false;
  return offeneFeier(daten, jetzt) !== null || aktuellerRivale(daten) !== null;
}
