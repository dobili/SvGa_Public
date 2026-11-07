/**
 * Bildschirm „Einstellungen“: erreichbar über den Knopf „Einstellungen“ oben auf der Profilseite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 25.10.2026: Die Leiste zeigt ein Profil (Ich.tsx),
 * die selten gebrauchten Einstellungen liegen eine Ebene tiefer auf diesem Bildschirm. Aufbau
 * nach dem Entwurf K2 (Wahl des Autors, 31.10.2026): die Einstellungen in drei Reitern
 * (EinstellungenKarte.tsx) und genau einmal die Liste der Unterseiten „Bots und Wertung“, „Deine
 * Daten“, „Über die App“ (einstellungsseiten.ts). Die große Brettvorschau mit Brettfarbe, Figuren
 * und Koordinaten stand bis 0.3.52 oben; seit dem Wunsch des Autors vom 7.11.2026 wählt man das
 * Aussehen nur noch in der Profilkarte „Dein Aussehen“, oben führt eine Zeile dorthin
 * (AussehenKnopf.tsx).
 * Abhängigkeiten: AussehenKnopf, EinstellungenKarte, Seitenliste, Kopfzeile, i18n.
 */
import { t } from "../../i18n/sprache";
import { AussehenKnopf } from "../komponenten/einstellungen/AussehenKnopf";
import { EinstellungenKarte } from "../komponenten/einstellungen/EinstellungenKarte";
import { Seitenliste } from "../komponenten/einstellungen/Seitenliste";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";

/** Der Bildschirm „Einstellungen“: Zeile zum Aussehen, Reiter, Unterseiten. */
export function Einstellungen() {
  return (
    <div className="bildschirm einstellungen-neu">
      <Kopfzeile titel={t("ich.titel")} zurueckText={t("profil.titel")} />
      <AussehenKnopf />
      <EinstellungenKarte />
      <Seitenliste />
    </div>
  );
}
