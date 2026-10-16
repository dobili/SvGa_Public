/**
 * Kopfzeile eines Bildschirms im Stapel: Zurück-Knopf, Titel, optionale Knöpfe rechts.
 *
 * Abhängigkeiten: Navigation, i18n, Lucide-Symbole.
 */
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigation } from "../../app/navigationsKontext";

interface KopfzeileEigenschaften {
  readonly titel: string;
  /** Beschriftung des Zurück-Knopfs, etwa „Kapitel 1“. Ohne Angabe gibt es keinen Knopf. */
  readonly zurueckText?: string;
  readonly rechts?: ReactNode;
  /** Eigene Aktion für den Zurück-Knopf; sonst eine Ansicht zurück im Stapel. */
  readonly beiZurueck?: () => void;
}

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
      <div className="kopfzeile-rechts">{rechts}</div>
    </header>
  );
}
