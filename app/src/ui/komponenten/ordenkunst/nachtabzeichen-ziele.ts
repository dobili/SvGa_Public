/**
 * Bild des Abzeichens der eigenen Ziele (Gamifizierung P13) im Nachtstil, eigene Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Das Abzeichen „Zehn eigene Ziele erreicht“ (Kennung wie in fortschritt/abzeichen-ziele.ts). */
export const ZIEL_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  zehnZiele: { form: "banner", motiv: "zahl:10", akzent: "#7bdff2" },
};
