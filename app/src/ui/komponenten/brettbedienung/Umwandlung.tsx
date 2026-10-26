/**
 * Auswahl der Figur bei der Umwandlung eines Bauern (Dame, Turm, Läufer, Springer) mit Abbruch.
 *
 * Rolle im Gesamtbild: Erscheint, wenn ein Bauer die letzte Reihe erreicht, beim Weiterspielen an
 * einer Abbildung (Brettbereich.tsx) wie im Stellungseditor (Stellungseditor.tsx).
 * Abhängigkeiten: schach/weiterspielen.ts (UMWANDLUNGEN), schach/stellung.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { ROLLENBUCHSTABE, type Rolle } from "../../../schach/stellung";
import { UMWANDLUNGEN } from "../../../schach/weiterspielen";

/**
 * Die Auswahl der Figur, wenn ein Bauer die letzte Reihe erreicht (Dame, Turm, Läufer, Springer
 * oder Abbruch).
 */
export function Umwandlung({ beiWahl }: { beiWahl: (rolle: Rolle | null) => void }) {
  return (
    <div className="umwandlung" role="dialog" aria-label={t("zugleiste.umwandlung")}>
      <span>{t("zugleiste.umwandlung")}</span>
      {UMWANDLUNGEN.map((rolle) => (
        <button key={rolle} type="button" className="chip" onClick={() => beiWahl(rolle)}>
          {t(`figur.${ROLLENBUCHSTABE[rolle]}`)}
        </button>
      ))}
      <button type="button" className="knopf-link klein" onClick={() => beiWahl(null)}>
        {t("loeschen.nein")}
      </button>
    </div>
  );
}
