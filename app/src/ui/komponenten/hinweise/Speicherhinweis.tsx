/**
 * Hinweis, wenn der Speicher nicht lesbar oder nicht beschreibbar ist.
 *
 * Rolle im Gesamtbild: Konzept 9.4 „Fehler werden dem Leser angezeigt“. Steht oben über jedem
 * Bildschirm, bis der Leser ihn schließt; ein späterer Fehler erscheint erneut. Ein erfolgreiches
 * Speichern nimmt den Hinweis „speichern“ von selbst zurück.
 * Abhängigkeiten: speicher/speicher.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";

/**
 * Der Hinweis oben, wenn die App ihre Daten auf dem Gerät nicht lesen oder nicht speichern kann.
 */
export function Speicherhinweis() {
  const fehler = useSpeicher((zustand) => zustand.fehler);
  const [geschlossen, setzeGeschlossen] = useState<typeof fehler>(null);
  if (!fehler || fehler === geschlossen) return null;
  return (
    <div className="speicher-hinweis" role="alert">
      <p>
        {t(`speicher.fehler.${fehler.art}`)}
        {fehler.meldung && <span className="speicher-meldung"> ({fehler.meldung})</span>}
      </p>
      <button type="button" onClick={() => setzeGeschlossen(fehler)}>
        {t("speicher.verstanden")}
      </button>
    </div>
  );
}
