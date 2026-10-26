/**
 * Info-Knopf: ein Fragezeichen im Kreis, das eine Erklärung ein- und ausklappt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): Längere Erklärungen (Elo-System der
 * Wertung, Speicher auf dem iPhone, Datensicherung) stehen nicht mehr dauerhaft da, sondern
 * hinter einem Fragezeichen; anfangs eingeklappt. Der Knopf steht am Ende einer kurzen Zeile
 * (Überschrift oder Zusammenfassung); die Erklärung erscheint darunter.
 * Abhängigkeiten: React, Lucide-Symbole, i18n.
 */
import { CircleHelp } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";

const SYMBOLGROESSE = 20;

/**
 * Eine Zeile mit Text und Fragezeichen; darunter die Erklärung, wenn aufgeklappt.
 * Beispiel: <MitInfo zeile="Daten nur auf diesem Gerät." erklaerung="Auf dem iPhone …" />.
 */
export function MitInfo({
  zeile,
  erklaerung,
  thema,
}: {
  zeile: ReactNode;
  erklaerung: ReactNode;
  /** Wofür die Erklärung ist (für Bildschirmleser: „Erklärung: …“). */
  thema: string;
}) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className="mitinfo">
      <div className="mitinfo-zeile">
        <div className="mitinfo-text">{zeile}</div>
        <button
          type="button"
          className="infoknopf"
          aria-expanded={offen}
          aria-controls={kennung}
          aria-label={t("info.erklaerung", { thema })}
          onClick={() => setzeOffen(!offen)}
        >
          <CircleHelp size={SYMBOLGROESSE} aria-hidden="true" />
        </button>
      </div>
      {offen && (
        <div id={kennung} className="mitinfo-erklaerung hinweis">
          {erklaerung}
        </div>
      )}
    </div>
  );
}
