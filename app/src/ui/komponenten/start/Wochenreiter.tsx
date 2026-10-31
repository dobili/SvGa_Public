/**
 * Die Abschnitte der Woche als kurze Reiter in der Karte „Heute“ (Gestaltung A2, 31.10.2026):
 * „Aufträge 1/3 · Plan heute · Ziele 2“ in einer Zeile; ein Tipp klappt den Abschnitt darunter auf,
 * ein zweiter Tipp wieder zu.
 *
 * Rolle im Gesamtbild: Liest die Einträge aus WOCHENABSCHNITTE (über die Karte). Alle Abschnitte
 * bleiben gerendert und sind nur verborgen, weil manche beim Anzeigen etwas festhalten (Wahl der
 * Aufträge, erreichte Ziele). Eine Zeile pro Reiter wäre für die Handyhöhe zu lang (Auftrag: Kapitel
 * in der oberen Bildschirmhälfte), deshalb stehen die Reiter nebeneinander und brechen bei Bedarf um.
 * Abhängigkeiten: wochenabschnitte.ts (Typ), i18n.
 */
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Wochenabschnitt } from "./wochenabschnitte";

/** Größe des Pfeils im Reiter (Bildpunkte). */
const PFEIL = 16;

/** Die Reiter und darunter die Abschnitte; ohne Abschnitt nichts. */
export function Wochenreiter({ abschnitte }: { abschnitte: readonly Wochenabschnitt[] }) {
  const [offen, setzeOffen] = useState<string | null>(null);
  const basis = useId();
  if (abschnitte.length === 0) return null;
  return (
    <div className="wochenreiter" data-testid="wochenreiter">
      <div className="wochenreiter-zeile">
        {abschnitte.map(({ kennung, titel, Stand }) => (
          <button
            key={kennung}
            type="button"
            className="wochenreiter-knopf"
            aria-expanded={offen === kennung}
            aria-controls={`${basis}-${kennung}`}
            data-testid={`reiter-${kennung}`}
            onClick={() => setzeOffen(offen === kennung ? null : kennung)}
          >
            <span>{t(titel)}</span>
            <Stand />
            <ChevronDown size={PFEIL} aria-hidden="true" className="wochenreiter-pfeil" />
          </button>
        ))}
      </div>
      {abschnitte.map(({ kennung, Abschnitt }) => (
        <div key={kennung} id={`${basis}-${kennung}`} hidden={offen !== kennung}>
          <Abschnitt />
        </div>
      ))}
    </div>
  );
}
