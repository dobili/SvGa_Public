/**
 * Hinweis „Neue Version verfügbar – Jetzt aktualisieren“.
 *
 * Rolle im Gesamtbild: Erscheint erst, wenn die neue Version vollständig geladen ist, und
 * aktualisiert nur nach Tippen (Konzept 11.3).
 * Abhängigkeiten: app/offline.ts, i18n.
 */
import { aktualisiereJetzt, useOfflineStand } from "../../../app/offline";
import { t } from "../../../i18n/sprache";

/**
 * Der Hinweis „Neue Version verfügbar“: erscheint, wenn die neue Version geladen ist, und
 * aktualisiert erst nach Tippen.
 */
export function UpdateHinweis() {
  const { updateVerfuegbar } = useOfflineStand();
  if (!updateVerfuegbar) {
    return null;
  }
  return (
    <div className="update-hinweis" role="status">
      <span>{t("update.text")}</span>
      <button type="button" onClick={() => void aktualisiereJetzt()}>
        {t("update.knopf")}
      </button>
    </div>
  );
}
