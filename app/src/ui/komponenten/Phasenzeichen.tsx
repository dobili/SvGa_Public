/**
 * Zeichen einer Partiephase: Buch für die Eröffnung, gekreuzte Schwerter für das Mittelspiel,
 * Flagge für das Endspiel (seit 0.2.101, Symbolsprache DS26).
 *
 * Rolle im Gesamtbild: Die Zeichen standen bisher nur in den Tabellen der Auswertung
 * (zeilensymbole.ts). Jetzt tragen alle Stellen, an denen die drei Phasen nebeneinander stehen,
 * dieselben Zeichen: die Regler „Stufe der Engine“ und die Phasen der Denkroutine. So erkennt man
 * die Phase, bevor man das Wort liest.
 * Abhängigkeiten: zeilensymbole.ts, spiel/phasen.ts.
 */
import type { Phase } from "../../spiel/phasen";
import { PHASENSYMBOLE } from "./zeilensymbole";

/** Größe des Zeichens (Bildpunkte). */
const GROESSE = 18;

/**
 * Das Zeichen einer Phase vor ihrem Namen; für Bildschirmleser verborgen, der Name steht daneben.
 * Beispiel: <Phasenzeichen phase="endspiel" /> → Flagge.
 */
export function Phasenzeichen({ phase }: { phase: Phase }) {
  const Bild = PHASENSYMBOLE[phase];
  return <Bild className={`phasenzeichen phase-${phase}`} size={GROESSE} aria-hidden="true" />;
}
