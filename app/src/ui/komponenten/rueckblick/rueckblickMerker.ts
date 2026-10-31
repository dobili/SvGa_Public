/**
 * Merker „rueckblickGesehen“ des Monatsrückblicks (Gamifizierung P12): der Monat, dessen
 * Rückblick der Leser zuletzt von der Startkarte aus geöffnet hat.
 *
 * Rolle im Gesamtbild: Die Startkarte „Dein Oktober ist fertig“ steht in den ersten sieben Tagen
 * des Novembers, bis der Oktober einmal angesehen ist. Ein Merker genügt (gamifizierung.md P12:
 * kein Speicherfeld); geht er verloren, erscheint die Karte höchstens noch einmal.
 * Abhängigkeiten: app/merker.ts, training/rueckblick.ts.
 */
import { liesMerker, schreibeMerker } from "../../../app/merker";
import type { Nutzerdaten } from "../../../speicher/format";
import {
  monatVon,
  rueckblickkarteSichtbar,
  vormonat,
  type Monat,
} from "../../../training/rueckblick";

/** Name des Merkers; Wert ist der Monatsschlüssel, etwa „2026-10“. */
export const MERKER_RUECKBLICK_GESEHEN = "rueckblickGesehen";

/** Für STARTKARTEN: erscheint die Karte jetzt? */
export function rueckblickkarteJetzt(daten: Nutzerdaten, jetzt: Date): boolean {
  return rueckblickkarteSichtbar(daten.aktivitaet, jetzt, liesMerker(MERKER_RUECKBLICK_GESEHEN));
}

/**
 * Merkt den Monat als gesehen, wenn es der Monat der Startkarte ist (der Vormonat); ältere Monate
 * aus dem Profil ändern den Merker nicht. Beispiel: am 03.11. „2026-10“ geöffnet → Karte weg.
 */
export function merkeRueckblickGesehen(monat: Monat, jetzt: Date): void {
  if (monat.schluessel === vormonat(monatVon(jetzt)).schluessel)
    schreibeMerker(MERKER_RUECKBLICK_GESEHEN, monat.schluessel);
}
