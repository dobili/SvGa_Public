/**
 * Hinweis oben in der App: „Zeit für eine Datensicherung“ nach vier Stunden App-Zeit.
 *
 * Rolle im Gesamtbild: Antwort des Autors auf Q4 (15.10.2026). Erscheint wie der Update-Hinweis
 * oben, aber nur mit eigenen Daten und nach vier Stunden App-Zeit ohne Sicherung
 * (useSicherungshinweis.ts). „Jetzt sichern“ öffnet die Einstellungen, „Später“ blendet ihn aus,
 * „Nicht mehr nachfragen“ schaltet ihn dauerhaft ab.
 * Abhängigkeiten: useSicherungshinweis.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { useSicherungshinweis } from "./useSicherungshinweis";

/** Der Hinweis oben „Zeit für eine Datensicherung“ nach vier Stunden App-Zeit ohne Sicherung. */
export function SicherungsHinweis() {
  const hinweis = useSicherungshinweis();
  const { wechsleBereich } = useNavigation();
  if (!hinweis.faellig) return null;
  return (
    <div
      className="update-hinweis sicherungs-hinweis"
      role="status"
      data-testid="sicherungshinweis"
    >
      <span>{t("sicherung.hinweis.text")}</span>
      <div className="sicherungs-hinweis-knoepfe">
        <button
          type="button"
          onClick={() => {
            hinweis.spaeter();
            wechsleBereich("ich");
          }}
        >
          {t("sicherung.hinweis.jetzt")}
        </button>
        <button type="button" className="leise" onClick={hinweis.spaeter}>
          {t("sicherung.hinweis.spaeter")}
        </button>
      </div>
      <label className="sicherungs-hinweis-haken">
        <input type="checkbox" onChange={(e) => e.target.checked && hinweis.nichtMehr()} />
        {t("sicherung.hinweis.nichtMehr")}
      </label>
    </div>
  );
}
