/**
 * Einmalige Erklärungen der Zahlen des Spiels (Spieltest „einstieg“, 15.11.2026, R9): Münzen und
 * Spielstärke bekommen je einen kurzen Satz, wenn sie zum ersten Mal etwas bedeuten.
 *
 * Warum: Im Test standen nach Sieg und zwei Runden „0 Münzen“ und „Spielstärke 616“ da, ohne dass
 * ein Kind wusste, wofür. Gute Einsteigerspiele erklären jede neue Zahl genau einmal, im Moment, in
 * dem sie zählt.
 * Rolle im Gesamtbild: reine Regel für oberwelt/Orientierung.tsx (zeigt die Meldung und hakt ab).
 * Abhängigkeiten: schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Dialogvariablen: Die Erklärung kam schon. */
const MUENZEN_ERKLAERT = "muenzenErklaert";
const STAERKE_ERKLAERT = "staerkeErklaert";

/** Eine fällige Erklärung: Textschlüssel, Werte und die Dialogvariable, die sie abhakt. */
export interface Erklaerung {
  readonly schluessel: string;
  readonly werte: Readonly<Record<string, number>>;
  readonly variable: string;
}

/**
 * Die Erklärung, die jetzt fällig ist, oder null. Münzen ab der ersten Münze, Spielstärke ab der
 * ersten gewerteten Partie; Münzen zuerst.
 * Beispiel: 10 Münzen, noch nicht erklärt → „erklaerung.muenzen“; danach, mit einer gewerteten
 * Partie → „erklaerung.staerke“ mit der Wertung.
 */
export function faelligeErklaerung(stand: Abenteuerstand): Erklaerung | null {
  const v = stand.dialogvariablen;
  if (stand.muenzen > 0 && !v[MUENZEN_ERKLAERT]) {
    return { schluessel: "erklaerung.muenzen", werte: {}, variable: MUENZEN_ERKLAERT };
  }
  if (stand.wertungPartien > 0 && !v[STAERKE_ERKLAERT]) {
    const werte = { wertung: stand.wertung };
    return { schluessel: "erklaerung.staerke", werte, variable: STAERKE_ERKLAERT };
  }
  return null;
}
