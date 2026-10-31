/**
 * Konfettifarben der Feiern (Gamifizierung P7, freischaltbares Extra ab Stufe 2).
 *
 * Rolle im Gesamtbild: Das Feuerwerk (ui/komponenten/bausteine/Feuerwerk.tsx) zeigt seine Funken
 * in den Farben der App. Wer das Extra „Bunte Konfettifarben“ verdient und gewählt hat, sieht sie
 * bunt. Die Wahl ist ein Merker auf dem Gerät wie der Schalter „Feiereffekte“ (app/feiereffekte.ts);
 * das Speicherformat bleibt unverändert. Neue Paletten: eine Zeile in `KONFETTIPALETTEN` und ein
 * Extra in training/extras.ts.
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker } from "./merker";

/** Merker der Wahl; fehlt er, gelten die Farben der App. */
export const MERKER_KONFETTI = "konfettifarben";

/** Die Paletten; „app“ ist frei und die Vorgabe, die anderen sind Extras. */
export const KONFETTIPALETTEN = {
  app: ["var(--gold)", "var(--creme)", "#9fb8e6", "#f2d27a"],
  bunt: ["#e63946", "#f4a261", "#2a9d8f", "#4d96ff", "#c77dff", "#ffd60a"],
} as const satisfies Readonly<Record<string, readonly string[]>>;
export type Konfettipalette = keyof typeof KONFETTIPALETTEN;

/** Die gewählte Palette; Unbekanntes gilt als „app“. Beispiel: Merker „bunt“ → „bunt“. */
export function konfettipalette(): Konfettipalette {
  const wert = liesMerker(MERKER_KONFETTI);
  return wert !== null && wert in KONFETTIPALETTEN ? (wert as Konfettipalette) : "app";
}

/** Die Farben der Funken für das Feuerwerk. */
export function konfettifarben(): readonly string[] {
  return KONFETTIPALETTEN[konfettipalette()];
}
