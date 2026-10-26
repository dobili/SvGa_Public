/**
 * Hinweis auf die Sieben-Tage-Regel von Safari: Wann zeigt die App ihn?
 *
 * Rolle im Gesamtbild: Safari (iPhone, iPad, Mac) löscht den Speicher einer Website, die sieben
 * Tage lang nicht besucht wurde, mit allem Fortschritt; als App auf dem Home-Bildschirm gilt das
 * nicht. Wer die App nur im Browser nutzt, soll das einmal erfahren (Vorschlag vom 19.10.2026,
 * vom Autor angenommen). Die Anzeige steht in ui/komponenten/hinweise/SafariHinweis.tsx.
 * Abhängigkeiten: app/geraet.ts (Gerätetyp), app/merker.ts.
 */
import type { Geraet } from "./geraet";

/** Merker: „aus“, sobald der Leser den Hinweis mit „Verstanden“ geschlossen hat. */
export const MERKER_SAFARIHINWEIS = "safariHinweis";

/**
 * Braucht dieser Leser den Hinweis?
 *
 * Eingaben: Gerätetyp, ob die App installiert läuft, Wert des Merkers.
 * Ausgabe: true nur in Safari auf iPhone, iPad oder Mac, nicht installiert, nicht geschlossen.
 * Beispiel: ("iphone", false, null) → true; ("iphone", true, null) → false (Home-Bildschirm).
 * Sonderfall: Android und Chrome am Rechner kennen diese Regel nicht.
 */
export function safariHinweisNoetig(
  geraet: Geraet,
  installiert: boolean,
  merker: string | null,
): boolean {
  const safari = geraet === "iphone" || geraet === "mac-safari";
  return safari && !installiert && merker !== "aus";
}
