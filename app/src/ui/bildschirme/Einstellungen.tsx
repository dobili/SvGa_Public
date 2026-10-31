/**
 * Bildschirm „Einstellungen“: erreichbar über den Knopf „Einstellungen“ oben auf der Profilseite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 25.10.2026: Die Leiste zeigt ein Profil (Ich.tsx),
 * die selten gebrauchten Einstellungen liegen eine Ebene tiefer auf diesem Bildschirm. Aufbau
 * nach dem Entwurf K2 „Brettvorschau oben“ (Wahl des Autors, 31.10.2026): oben die große
 * Brettvorschau mit Brettfarbe und Figuren (Brettstudio.tsx), darunter die übrigen Einstellungen
 * in drei Reitern (EinstellungenKarte.tsx) und genau einmal die Liste der Unterseiten „Bots und
 * Wertung“, „Deine Daten“, „Über die App“ (einstellungsseiten.ts).
 * Abhängigkeiten: Brettstudio, EinstellungenKarte, einstellungsseiten, Kopfzeile, i18n.
 */
import { t } from "../../i18n/sprache";
import { Brettstudio } from "../komponenten/einstellungen/Brettstudio";
import { EinstellungenKarte } from "../komponenten/einstellungen/EinstellungenKarte";
import { Seitenliste } from "../komponenten/einstellungen/Seitenliste";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";

/** Der Bildschirm „Einstellungen“: Brettvorschau, Reiter, Unterseiten. */
export function Einstellungen() {
  return (
    <div className="bildschirm einstellungen-neu">
      <Kopfzeile titel={t("ich.titel")} zurueckText={t("profil.titel")} />
      <Brettstudio />
      <EinstellungenKarte />
      <Seitenliste />
    </div>
  );
}
