/**
 * Gemeinsame Werte des Monatsrückblicks (Gamifizierung P12): Kennung des Bildschirms, Arten der
 * verdienten Stücke und ob die Profilkarte „Rückblicke“ erscheint.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit Karten, Abschnitte und die Listen (PROFILKARTEN,
 * RUECKBLICKABSCHNITTE) dieselben Werte nutzen, ohne sich gegenseitig zu laden.
 * Abhängigkeiten: training/rueckblick.ts, ordenkunst/entwuerfe.ts (Typ), speicher/format.ts (Typ).
 */
import type { Nutzerdaten } from "../../../speicher/format";
import { rueckblickMonate } from "../../../training/rueckblick";
import type { Stueckart } from "../ordenkunst/entwuerfe";

/** Kennung des Bildschirms in ZUSATZANSICHTEN. */
export const RUECKBLICK_ANSICHT = "rueckblick";

/** Die Arten verdienter Stücke im Abschnitt, in dieser Reihenfolge. */
export const STUECKARTEN: readonly Stueckart[] = ["orden", "abzeichen"];

/** Für PROFILKARTEN: gibt es einen abgeschlossenen Monat mit Lerntagen? */
export function rueckblickeSichtbar(daten: Nutzerdaten): boolean {
  return rueckblickMonate(daten.aktivitaet, new Date()).length > 0;
}
