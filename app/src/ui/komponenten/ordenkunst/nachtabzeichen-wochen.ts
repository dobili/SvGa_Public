/**
 * Bilder der Abzeichen des Wochenziels (Gamifizierung P4) im Nachtstil, eigene Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 *
 * Rolle im Gesamtbild: Jedes Abzeichen hat eine eigene Form, ein Motiv und einen Akzent. Die Zahl
 * der Wochen steht als Motiv in der Mitte, damit man beide auf einen Blick unterscheidet; die
 * Formen unterscheiden sich vom Abzeichen „Eine Woche dabei“ (Kalender im abgerundeten Quadrat).
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Die Abzeichen des Wochenziels (Kennungen wie in fortschritt/abzeichen-wochen.ts). */
export const WOCHEN_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  wochenziel4: { form: "sechseck", motiv: "zahl:4", akzent: "#4fd1a5" },
  wochenziel12: { form: "strahl24", motiv: "zahl:12", akzent: "#ff9f43" },
};
