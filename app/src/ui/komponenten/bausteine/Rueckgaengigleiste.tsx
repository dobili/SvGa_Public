/**
 * Die schwebende Leiste „Gelöscht. Rückgängig“ über der Navigation.
 *
 * Rolle im Gesamtbild: Anzeige zu useRueckgaengig.tsx (Löschen in Lernsammlung und
 * Fehlerdatenbank, Wunsch des Autors, 1.11.2026). Das Rückgängig-Zeichen ist der Pfeil zurück
 * wie beim Zurücknehmen eines Zuges (Knopfsymbol „zuruecknehmen“).
 * Abhängigkeiten: Knopfsymbol, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Knopfsymbol } from "./Knopfsymbol";

/** Die Leiste. Beispiel: nach „Löschen“ an Abb. 2.2 → „Gelöscht. ↶ Rückgängig“. */
export function Rueckgaengigleiste({ beiRueckgaengig }: { beiRueckgaengig: () => void }) {
  return (
    <div className="rueckgaengig-leiste" role="status" data-testid="rueckgaengig">
      <span>{t("eintrag.geloescht")}</span>
      <button type="button" className="knopf-zweit" onClick={beiRueckgaengig}>
        <Knopfsymbol art="zuruecknehmen" />
        {t("eintrag.rueckgaengig")}
      </button>
    </div>
  );
}
