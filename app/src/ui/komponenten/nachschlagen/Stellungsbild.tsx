/**
 * Ein kleines Diagramm einer Abbildung des Buches im Nachschlagen, mit Pfeilen und Feldern wie im
 * Buch; ein Tipp öffnet die Abbildung.
 *
 * Rolle im Gesamtbild: Paket F der Ideensammlung (26.10.2026): Steckbriefe zeigen die
 * Schlussstellung der Hauptvariante, Fallenchecks den Stopp-Moment (steckbriefbild.ts). Das Brett
 * ist dasselbe wie in der Galerie der Kapitelübersicht, nur als Bild ohne Koordinaten.
 * Abhängigkeiten: ui/brett, buchmarkierungen.ts, daten/laden.ts (Typ), i18n.
 */
import type { Abbildung } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { Brett } from "../../brett/Brett";
import { buchmarkierungen } from "../abbildung/buchmarkierungen";

/**
 * Das Diagramm als Knopf: oben das Brett, darunter die Zeile `text` (etwa „Zum Stopp-Moment
 * (Abb. 4.2)“), die auch der Name des Knopfes ist.
 */
export function Stellungsbild({
  abbildung,
  text,
  beiKlick,
}: {
  abbildung: Abbildung;
  text: string;
  beiKlick: () => void;
}) {
  return (
    <button
      type="button"
      className="stellungsbild"
      data-testid="stellungsbild"
      aria-label={text}
      onClick={beiKlick}
    >
      <Brett
        fen={abbildung.fen}
        markierungen={buchmarkierungen(abbildung)}
        koordinaten={false}
        beschriftung={t("abbildung.titel", { nummer: abbildung.id })}
      />
      <span className="stellungsbild-text" aria-hidden="true">
        {text}
      </span>
    </button>
  );
}
