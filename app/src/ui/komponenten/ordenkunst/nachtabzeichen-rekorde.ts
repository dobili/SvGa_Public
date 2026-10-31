/**
 * Bild des Abzeichens der Rekordtafel (Gamifizierung P5) im Nachtstil, eigene Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Das Abzeichen „Drei Rekorde“ (Kennung wie in fortschritt/abzeichen-rekorde.ts). */
export const REKORD_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  dreiRekorde: { form: "stern8", motiv: "zahl:3", akzent: "#f5c542" },
};
