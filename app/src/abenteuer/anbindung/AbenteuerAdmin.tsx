/**
 * Karte „Schach-Abenteuer“ auf der Aufgabenseite des Autors (Adminmenü: drei Sekunden auf
 * „Profil“): öffnet das Spiel, beim ersten Mal mit „Spiel herunterladen“.
 *
 * Warum (Wunsch des Autors, 18.11.2026): Auf der veröffentlichten Testfassung soll das Spiel
 * optional über das Adminmenü zu laden und von dort zu starten sein, ohne dass Leser darauf stoßen.
 * Nach dem Laden erscheint zusätzlich die Karte auf „Spielen“ (Abenteuerkarte.tsx); die
 * Leserfassung zeigt die Aufgabenseite gar nicht (__VEROEFFENTLICHUNG__ in app/App.tsx).
 * Rolle im Gesamtbild: Gehört zum Kern der App (klein), nutzt nur die Adresse der Zusatzansicht.
 * Abhängigkeiten: app/navigationsKontext.ts, schnittstelle/modul.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { useNavigation } from "../../app/navigationsKontext";
import { ANSICHT_ABENTEUER } from "../schnittstelle/modul";

/** Die Karte; „Spiel öffnen“ führt in die Ansicht des Spiels (Startkarte mit Laden und Spielen). */
export function AbenteuerAdmin() {
  const { navigiere } = useNavigation();
  return (
    <section className="karte" data-testid="abenteuer-admin">
      <h2 className="karte-titel">{t("abenteuer.admin.titel")}</h2>
      <p className="hinweis">{t("abenteuer.admin.erklaerung")}</p>
      <button
        type="button"
        className="knopf-haupt"
        data-testid="abenteuer-admin-knopf"
        onClick={() => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER })}
      >
        {t("abenteuer.admin.knopf")}
      </button>
    </section>
  );
}
