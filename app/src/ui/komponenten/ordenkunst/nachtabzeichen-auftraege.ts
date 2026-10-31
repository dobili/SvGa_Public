/**
 * Bild des Abzeichens der Wochenaufträge (Gamifizierung P6) im Nachtstil, eigene Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 *
 * Rolle im Gesamtbild: Die Raute ist bei den Abzeichen sonst nicht vergeben; die Acht in der Mitte
 * nennt die Zahl der Aufträge im Monat.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Das Abzeichen „Acht Aufträge“ (Kennung wie in fortschritt/abzeichen-auftraege.ts). */
export const AUFTRAG_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  auftraege8: { form: "raute", motiv: "zahl:8", akzent: "#7cc4ff" },
};
