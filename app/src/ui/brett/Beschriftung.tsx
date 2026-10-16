/**
 * Kurze Beschriftungen auf Feldern, etwa „W1“ oder „W2·W4“ für die Warnsignale aus Kapitel 4.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 verlangt bei den Warnsignalen „Rot: betroffene Figuren
 * und Linien, beschriftet mit W1 bis W5“. Die Beschriftung sitzt in der oberen rechten Ecke des
 * Feldes über Figuren und Pfeilen, in der Farbe der Markierung mit heller Kontur, damit sie auf
 * jedem Feld lesbar bleibt (Konzept 10.3).
 * Abhängigkeiten: geometrie.ts, masse.ts, analyse/werkzeug.ts.
 */
import type { Markierung } from "../../analyse/werkzeug";
import { feldEcke } from "./geometrie";
import { FARBEN, FELD } from "./masse";

/** Schriftgröße der Beschriftung als Anteil der Feldbreite. */
const GROESSE = 0.3 * FELD;
/** Abstand der Beschriftung vom Feldrand. */
const RAND = 0.06 * FELD;
/** Breite der hellen Kontur um die Schrift. */
const KONTUR = 0.06 * FELD;

/**
 * Zeichnet die Beschriftungen aller Feldmarkierungen, die einen Text tragen.
 *
 * Eingaben: Markierungen und ob das Brett gedreht ist. Beispiel: Abb. 4.2, Turm a8 mit „W1“.
 */
export function Beschriftungen({
  markierungen,
  gedreht,
}: {
  markierungen: readonly Markierung[];
  gedreht: boolean;
}) {
  return (
    <g
      fontFamily="'Source Sans 3', sans-serif"
      fontWeight={700}
      fontSize={GROESSE}
      aria-hidden="true"
    >
      {markierungen.map((m, i) => {
        if (m.typ !== "feld" || !m.text) return null;
        const ecke = feldEcke(m.feld, gedreht);
        if (!ecke) return null;
        return (
          <text
            key={`t${i}`}
            x={ecke.x + FELD - RAND}
            y={ecke.y + RAND + GROESSE * 0.8}
            textAnchor="end"
            fill={FARBEN[m.farbe]}
            stroke={FARBEN.creme}
            strokeWidth={KONTUR}
            paintOrder="stroke"
          >
            {m.text}
          </text>
        );
      })}
    </g>
  );
}
