/**
 * Bilder der Abzeichen der Meisterschaft (Gamifizierung P3) im Nachtstil, eigene Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Kennungen wie in fortschritt/abzeichen-meisterschaft.ts. */
export const MEISTERSCHAFT_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  erstesGold: { form: "strahl24", motiv: "rosette:1", akzent: "#f5c542" },
  fuenfSilber: { form: "stern8", motiv: "zahl:5", akzent: "#dfe4ea" },
  alleTaktikGold: { form: "schild", motiv: "figur:springer", akzent: "#ffd166" },
};
