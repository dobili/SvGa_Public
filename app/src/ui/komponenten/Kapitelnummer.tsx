/**
 * Kapitelnummer im Kreis mit goldenem Fortschrittsrand (seit 0.2.101, Symbolsprache DS27).
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026, „farbige Symbole für Zahlen“. Im Buch und
 * in der Gesamt-Checkliste stand der Fortschritt bisher nur als Text („12 von 43“). Jetzt füllt
 * sich der Rand der Nummer wie ein Ring im Uhrzeigersinn; ist alles erledigt, wird die Marke gold
 * mit Haken. Der Text daneben bleibt, der Ring ist für Bildschirmleser verborgen.
 * Abhängigkeiten: speicher/fortschritt.ts (Anteil), lucide-react.
 */
import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import type { Anteil } from "../../speicher/fortschritt";

/** Größe des Hakens bei erledigtem Kapitel (Bildpunkte). */
const HAKEN_GROESSE = 18;
const VOLL = 100;

/**
 * Beispiel: Kapitel 1, 20 von 43 Abbildungen gesehen → navy Kreis „1“, Rand knapp zur Hälfte gold.
 */
export function Kapitelnummer({ nummer, anteil }: { nummer: number; anteil: Anteil }) {
  const prozent = anteil.gesamt > 0 ? Math.round((anteil.erreicht / anteil.gesamt) * VOLL) : 0;
  const erledigt = anteil.gesamt > 0 && anteil.erreicht >= anteil.gesamt;
  const stil = { "--anteil": `${String(prozent)}%` } as CSSProperties;
  return (
    <span
      className={`kapitel-nummer mit-anteil${erledigt ? " erledigt" : ""}`}
      style={stil}
      aria-hidden="true"
    >
      {erledigt ? <Check size={HAKEN_GROESSE} /> : nummer}
    </span>
  );
}
