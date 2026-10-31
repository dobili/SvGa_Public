/**
 * Bilder der Abzeichen zu Kapiteln (fortschritt/abzeichen-kapitel.ts) im Nachtstil, eigene
 * Teilliste der Abzeichenbilder in entwuerfe.ts.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** „Kurzer Prozess“ (Blitz, Kapitel 4) und „Neue Dame“ (Dame, Kapitel 8). */
export const KAPITEL_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  kurzerProzess: { form: "dreieck", motiv: "blitz:15", akzent: "#ff6b9a" },
  umwandlung: { form: "schild", motiv: "figur:dame", akzent: "#c39bff" },
};
