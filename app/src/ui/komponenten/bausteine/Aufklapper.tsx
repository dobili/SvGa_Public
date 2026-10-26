/**
 * Ein Knopf, der einen Bereich auf- und wieder zuklappt, mit Fragezeichen für die Erklärung
 * daneben (Wunsch des Autors, 19.10.2026: „In die Fehlerdatenbank“ und „In die Lernsammlung“
 * im Rückblick ließen sich nicht wieder schließen und hatten keine Erklärung).
 *
 * Rolle im Gesamtbild: gemeinsame Hülle für die Formulare unter einem Zug (Rückblick, Trainer).
 * Abhängigkeiten: MitInfo (InfoKnopf.tsx), i18n.
 */
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { MitInfo } from "./InfoKnopf";

const SYMBOLGROESSE = 16;

/**
 * Zeigt den Knopf mit Fragezeichen; ein Tipp klappt `children` auf, ein zweiter wieder zu.
 *
 * Eingaben: Knopftext, Erklärung und Thema für das Fragezeichen, Inhalt.
 * Beispiel: Rückblick, „In die Lernsammlung“ → Formular mit Plan, Notiz, Eröffnung.
 * Sonderfall: Der Inhalt wird beim Zuklappen verworfen; beim nächsten Öffnen beginnt er neu.
 */
export function Aufklapper({
  text,
  erklaerung,
  thema,
  children,
}: {
  text: string;
  erklaerung: ReactNode;
  thema: string;
  children: ReactNode;
}) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className="aufklapper">
      <MitInfo
        zeile={
          <button
            type="button"
            className="knopf-link aufklapper-knopf"
            aria-expanded={offen}
            aria-controls={kennung}
            onClick={() => setzeOffen(!offen)}
          >
            {text}
            <ChevronDown
              size={SYMBOLGROESSE}
              aria-hidden="true"
              className={offen ? "aufklapper-pfeil offen" : "aufklapper-pfeil"}
            />
          </button>
        }
        erklaerung={erklaerung}
        thema={thema}
      />
      {offen && <div id={kennung}>{children}</div>}
    </div>
  );
}
