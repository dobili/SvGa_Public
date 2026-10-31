/**
 * Bilder der Abzeichen der Rivalen (Gamifizierung P8) im Nachtstil, eigene Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 *
 * Rolle im Gesamtbild: Zwei gekreuzte Schwerter stehen für das Duell; die Figur darüber
 * unterscheidet die Stufen (Springer für drei, König für zehn Rivalen), dazu eigene Form und
 * Farbe, damit man beide auf einen Blick auseinanderhält.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Die Abzeichen der Rivalen (Kennungen wie in fortschritt/abzeichen-rivalen.ts). */
export const RIVALEN_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  rivalen3: { form: "schild", motiv: "schwerter:springer", akzent: "#ff7a59" },
  rivalen10: { form: "rosette", motiv: "schwerter:koenig", akzent: "#c792ea" },
};
