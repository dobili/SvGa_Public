/**
 * Kopfzeile eines Bildschirms im Stapel: Zurück-Knopf, Titel, optionale Knöpfe rechts.
 *
 * Seit P8 (R52) steht ganz rechts das Toursymbol, wenn es zum Bildschirm eine Tour gibt
 * (tour/TourKnopf.tsx); sonst bleibt die Stelle leer.
 * Abhängigkeiten: Navigation, i18n, Lucide-Symbole, Tour.
 */
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { TourKnopf } from "../../tour/TourKnopf";

interface KopfzeileEigenschaften {
  /** Der Titel, meist Text; an der Abbildung ein Knopf (Nummernsprung, seit 0.2.39). */
  readonly titel: ReactNode;
  /** Beschriftung des Zurück-Knopfs, etwa „Kapitel 1“. Ohne Angabe gibt es keinen Knopf. */
  readonly zurueckText?: string;
  readonly rechts?: ReactNode;
  /** Eigene Aktion für den Zurück-Knopf; sonst eine Ansicht zurück im Stapel. */
  readonly beiZurueck?: () => void;
}

/**
 * Die Kopfzeile eines Bildschirms: Zurück-Knopf, Titel, rechts eigene Knöpfe und das Toursymbol.
 */
export function Kopfzeile({ titel, zurueckText, rechts, beiZurueck }: KopfzeileEigenschaften) {
  const { zurueck } = useNavigation();
  return (
    <header className="kopfzeile">
      <div className="kopfzeile-links">
        {zurueckText && (
          <button type="button" className="knopf-flach" onClick={beiZurueck ?? zurueck}>
            <ChevronLeft size={20} aria-hidden="true" />
            {zurueckText}
          </button>
        )}
      </div>
      <h1 className="kopfzeile-titel">{titel}</h1>
      <div className="kopfzeile-rechts">
        {rechts}
        <TourKnopf />
      </div>
    </header>
  );
}
