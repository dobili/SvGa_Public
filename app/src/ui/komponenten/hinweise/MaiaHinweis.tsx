/**
 * Einmaliges Fenster mit dem Hinweis auf Maia beim ersten Antippen eines vorgefertigten Bots
 * (Wunsch des Autors, 26.10.2026; wann es kommt: maiahinweis.ts).
 *
 * Rolle im Gesamtbild: Maia (MaiaWahl.tsx) steht sonst nur unter Zahnrad › Bots, und wer die
 * Einstellungen nicht durchsieht, spielt nie mit ihr. Das Fenster erklärt sie in zwei Sätzen und
 * enthält gleich den Knopf zum Laden und den Schalter (MaiaWahl in Kurzform).
 * Abhängigkeiten: MaiaWahl.tsx, i18n; Aussehen wie die Gratulation (ui/stil/gegnerbild.css).
 */
import { createPortal } from "react-dom";
import { t } from "../../../i18n/sprache";
import { MaiaWahl } from "../einstellungen/MaiaWahl";

/** Das Fenster über allem: Titel, Erklärung, Laden oder Schalter, Weg in die Einstellungen. */
export function MaiaHinweis({ schliessen }: { schliessen: () => void }) {
  return createPortal(
    <div className="gruppen-gratulation" role="dialog" aria-modal="true" data-testid="maia-hinweis">
      <div className="gruppen-gratulation-karte">
        <h2>{t("maia.hinweis.titel")}</h2>
        <p>{t("maia.hinweis.text")}</p>
        <MaiaWahl kurz />
        <p className="hinweis">{t("maia.hinweis.wo")}</p>
        <button type="button" className="knopf-haupt" onClick={schliessen}>
          {t("maia.hinweis.weiter")}
        </button>
      </div>
    </div>,
    document.body,
  );
}
