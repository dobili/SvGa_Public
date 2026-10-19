/**
 * Farbige Marke einer Spielstufe mit ihrer Nummer, in Gürtelfarben von Weiß (Stufe 1) bis Schwarz
 * (Stufe 8) (seit 0.2.101, Symbolsprache DS19).
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026, Seiten beim Scrollen ohne Lesen erfassbar
 * zu machen; die Stufen der vorgefertigten Bots waren als graue Textzeilen kaum zu unterscheiden.
 * Gürtelfarben kennt man aus Judo und Karate als Rangfolge: hell heißt Anfang, dunkel heißt
 * Meister. Die Zahl steht immer in der Marke, die Farbe ist nur ein zweites Merkmal (WCAG 1.4.1).
 * Die Gruppe „Zum Spaß“ bekommt eine bunte Marke mit Konfetti. Farben in ui/stil/symbole.css.
 * Abhängigkeiten: engine/stufen.ts, lucide-react.
 */
import { PartyPopper } from "lucide-react";
import type { Stufennummer } from "../../engine/stufen";

/** Größe des Konfetti-Zeichens in der Spaß-Marke (Bildpunkte). */
const KONFETTI_GROESSE = 16;

/**
 * Marke einer Stufe; `stufe` null steht für die Spaß-Bots. Nur Schmuck für Sehende: Die Stufe
 * steht immer auch im Text daneben, deshalb aria-hidden.
 * Beispiel: <Stufenmarke stufe={5} /> → blauer Kreis mit „5“.
 */
export function Stufenmarke({
  stufe,
  klein = false,
}: {
  stufe: Stufennummer | null;
  klein?: boolean;
}) {
  const groesse = klein ? " stufenmarke-klein" : "";
  if (stufe === null) {
    return (
      <span className={`stufenmarke stufe-spass${groesse}`} aria-hidden="true">
        <PartyPopper size={KONFETTI_GROESSE} />
      </span>
    );
  }
  return (
    <span className={`stufenmarke stufe-${String(stufe)}${groesse}`} aria-hidden="true">
      {stufe}
    </span>
  );
}
