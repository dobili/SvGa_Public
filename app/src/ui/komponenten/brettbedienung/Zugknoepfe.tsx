/**
 * Die vier Zugknöpfe: Zum Anfang, Halbzug zurück, Halbzug vor, Zum Ende.
 *
 * Rolle im Gesamtbild: Gemeinsame Knopfreihe der Zugleiste (Abbildung), der Zugliste der Partie
 * und der Leiste beim Zug erraten. Wunsch des Autors (26.10.2026: „Die Knöpfe zum ersten und zum
 * letzten Zug drücke ich immer aus Versehen“): „Zum Anfang“ steht ganz links und „Zum Ende“ ganz
 * rechts; „Zurück“ und „Vor“ stehen als breitere Hauptknöpfe zusammen in der Mitte, mit
 * deutlichem Abstand zu den äußeren.
 * Abhängigkeiten: i18n, lucide-react.
 */
import { ChevronFirst, ChevronLast, StepBack, StepForward } from "lucide-react";
import type { ReactNode } from "react";
import { t } from "../../../i18n/sprache";

const SYMBOLGROESSE = 22;

/** Die vier Richtungen der Zugnavigation; die Namen sind zugleich die Textschlüssel. */
export type Zugrichtung = "anfang" | "zurueck" | "vor" | "ende";

/**
 * Knopfreihe der Zugnavigation.
 *
 * Eingaben: je Richtung, ob der Knopf gesperrt ist, und was ein Tipp auslöst.
 * Beispiel aus dem Buch: Abb. 1.26 nach 5... Db6: „Vor“ zeigt 6. Ld3?!, „Zum Anfang“ die
 * Grundstellung.
 * Sonderfall: Gesperrte Knöpfe bleiben an ihrem Platz, damit die Reihe nicht springt.
 */
export function Zugknoepfe({
  gesperrt,
  beiRichtung,
}: {
  gesperrt: Readonly<Record<Zugrichtung, boolean>>;
  beiRichtung: (richtung: Zugrichtung) => void;
}) {
  const knopf = (richtung: Zugrichtung, symbol: ReactNode, haupt: boolean) => (
    <button
      type="button"
      className={haupt ? "knopf-symbol zugknopf-haupt" : "knopf-symbol"}
      aria-label={t(`zugleiste.${richtung}`)}
      disabled={gesperrt[richtung]}
      onClick={() => beiRichtung(richtung)}
    >
      {symbol}
    </button>
  );
  return (
    <div className="zugknoepfe">
      {knopf("anfang", <ChevronFirst size={SYMBOLGROESSE} />, false)}
      <div className="zugknoepfe-mitte">
        {knopf("zurueck", <StepBack size={SYMBOLGROESSE} />, true)}
        {knopf("vor", <StepForward size={SYMBOLGROESSE} />, true)}
      </div>
      {knopf("ende", <ChevronLast size={SYMBOLGROESSE} />, false)}
    </div>
  );
}
