/**
 * Bilder der 18 Grundabzeichen im Nachtstil (Wahl des Autors, 30.10.2026), erste Teilliste der
 * Abzeichenbilder in entwuerfe.ts.
 *
 * Rolle im Gesamtbild: Seit Welle 0 der Gamifizierung tragen die Pakete die Bilder ihrer
 * Abzeichen in eigenen Dateien bei (Form, Motiv, Akzent wie hier; Motive in motive.ts).
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Die 18 Grundabzeichen im Nachtstil (Kennungen wie in fortschritt/abzeichen-grund.ts). */
export const GRUND_NACHTABZEICHEN: Readonly<Record<string, Nachtangabe>> = {
  erstePartie: { form: "banner", motiv: "figur:bauer", akzent: "#2ee6d6" },
  ersterSieg: { form: "schild", motiv: "pokal", akzent: "#ffd166" },
  partien10: { form: "kreis", motiv: "schwerter", akzent: "#e0a06a" },
  partien50: { form: "schild", motiv: "zahl:50", akzent: "#dfe4ea" },
  partien100: { form: "rosette", motiv: "stern:100", akzent: "#ffd166" },
  erstesMatt: { form: "kreis", motiv: "koenigFaellt", akzent: "#ff5a5a" },
  siegOhneHilfe: { form: "stern8", motiv: "figur:dame", akzent: "#ffa94d" },
  siegGegenStaerkeren: { form: "dreieck", motiv: "figur:bauer", akzent: "#a78bfa" },
  remisGegenStaerkeren: { form: "sechseck", motiv: "turmHalb", akzent: "#9fb6dd" },
  brillant: { form: "achteck", motiv: "edelstein", akzent: "#38e8ff" },
  ersteUebung: { form: "kreis", motiv: "rosette:1", akzent: "#5ea8ff" },
  kapitelUebungen: { form: "schild", motiv: "buchHaken", akzent: "#3ddc84" },
  warum: { form: "kreis", motiv: "frage", akzent: "#ffd84a" },
  eingeschaetzt: { form: "tropfen", motiv: "blick", akzent: "#ffd84a", tiefer: 9 },
  sammlung: { form: "rundquadrat", motiv: "lesezeichen", akzent: "#ff6bc1" },
  fehler: { form: "kreis", motiv: "kreispfeil", akzent: "#ff7f6b" },
  trainer: { form: "zahnrad", motiv: "blitz:100", akzent: "#ffd166" },
  woche: { form: "rundquadrat", motiv: "kalender", akzent: "#ff7a1a" },
};
