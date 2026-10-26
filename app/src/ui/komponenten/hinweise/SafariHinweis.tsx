/**
 * Hinweis oben in der App: Safari löscht nach sieben Tagen ohne Besuch, installiert nicht.
 *
 * Rolle im Gesamtbild: Erscheint wie der Sicherungshinweis oben, aber nur in Safari im Browser
 * (app/safarihinweis.ts). „So installierst du die App“ führt zur Installationsseite,
 * „Verstanden“ schließt ihn dauerhaft (Merker auf dem Gerät).
 * Abhängigkeiten: app/geraet.ts, app/merker.ts, app/safarihinweis.ts, i18n.
 */
import { useState } from "react";
import { geraet, istInstalliert } from "../../../app/geraet";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { MERKER_SAFARIHINWEIS, safariHinweisNoetig } from "../../../app/safarihinweis";
import { t } from "../../../i18n/sprache";

/** Die Installationsseite der Website (Anleitung je Gerät). */
const INSTALLATIONSSEITE = "/installieren/";

/**
 * Der Hinweis oben, nur in Safari im Browser: Safari löscht die Daten nach sieben Tagen ohne
 * Besuch, deshalb die App installieren.
 */
export function SafariHinweis() {
  const [sichtbar, setzeSichtbar] = useState(() =>
    safariHinweisNoetig(geraet(), istInstalliert(), liesMerker(MERKER_SAFARIHINWEIS)),
  );
  if (!sichtbar) return null;
  const verstanden = () => {
    schreibeMerker(MERKER_SAFARIHINWEIS, "aus");
    setzeSichtbar(false);
  };
  return (
    <div className="update-hinweis sicherungs-hinweis" role="status" data-testid="safarihinweis">
      <span>{t("safari.hinweis.text")}</span>
      <div className="sicherungs-hinweis-knoepfe">
        <a className="knopf-link" href={INSTALLATIONSSEITE}>
          {t("safari.hinweis.installieren")}
        </a>
        <button type="button" className="leise" onClick={verstanden}>
          {t("safari.hinweis.verstanden")}
        </button>
      </div>
    </div>
  );
}
