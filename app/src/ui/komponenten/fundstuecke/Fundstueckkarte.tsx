/**
 * Ein Fundstück als kleine Karte (Gamifizierung P10 b): Art, bei Merksätzen das Kapitel, der Text.
 *
 * Rolle im Gesamtbild: Dieselbe Karte erscheint am Rundenende (Fundstueckmeldung.tsx) und im
 * Album (Fundstueckalbum.tsx). Die Texte stehen in den Sprachdateien unter
 * fundstueck.text.<kennung>, der Katalog in inhalte/de/fundstuecke.json (training/fundstuecke.ts).
 * Abhängigkeiten: training/fundstuecke.ts, i18n.
 */
import type { Fundstueck } from "../../../training/fundstuecke";
import { fundstuecktext, fundstueckzeile } from "./album";

/**
 * Die Karte eines Fundstücks.
 * Beispiel: Merksatz „gabel“ → „Merksatz · Kapitel 7“ und der Satz zur Gabel.
 */
export function Fundstueckkarte({ fund }: { fund: Fundstueck }) {
  return (
    <div className={`fundstueck fundstueck-${fund.art}`} data-testid="fundstueck">
      <p className="fundstueck-zeile">{fundstueckzeile(fund)}</p>
      <p className="fundstueck-text">{fundstuecktext(fund.kennung)}</p>
    </div>
  );
}
