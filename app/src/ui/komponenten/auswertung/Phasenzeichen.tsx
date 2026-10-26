/**
 * Zeichen einer Partiephase: Buch für die Eröffnung, gekreuzte Schwerter für das Mittelspiel,
 * Flagge für das Endspiel (Symbolsprache DS26).
 *
 * Rolle im Gesamtbild: Alle Stellen, an denen die drei Phasen nebeneinander stehen, tragen
 * dieselben Zeichen: die Tabellen der Auswertung (zeilensymbole.ts), die Regler „Stufe der
 * Engine“ und die Phasen der Denkroutine. So erkennt man die Phase, bevor man das Wort liest.
 * Abhängigkeiten: zeilensymbole.ts, spiel/phasen.ts.
 */
import type { Phase } from "../../../spiel/phasen";
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
