/**
 * Liste der Unterseiten unter den Reitern der Einstellungen und der Rahmen jeder Unterseite.
 *
 * Rolle im Gesamtbild: Entwurf K2 (Wahl des Autors, 31.10.2026): unten genau einmal die Zeilen
 * „Bots und Wertung“, „Deine Daten“, „Über die App“ mit Stand und Pfeil; ein Tipp öffnet die Seite
 * über die Ansicht „zusatz“. Die Seiten selbst stehen in einstellungsseiten.ts.
 * Abhängigkeiten: app/navigationsKontext.ts, einstellungsseiten, Kopfzeile, i18n.
 */
import { ChevronRight } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { Kopfzeile } from "../rahmen/Kopfzeile";
import { EINSTELLUNGSSEITEN, type Einstellungsseite } from "./einstellungsseiten";

/** Größe der Symbole in den Zeilen. */
const SYMBOLGROESSE = 21;
/** Größe des Pfeils rechts. */
const PFEILGROESSE = 18;

/** Eine Zeile der Liste: Symbol, Name, Stand, Pfeil; ein Tipp öffnet die Seite. */
function Seitenzeile({ seite }: { seite: Einstellungsseite }) {
  const { navigiere } = useNavigation();
  const stand = seite.useStand();
  const Symbol = seite.symbol;
  return (
    <button
      type="button"
      className="einstellungszeile seitenzeile"
      data-tour={seite.tour}
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: seite.kennung })}
    >
      <Symbol className="einstellungszeile-symbol" size={SYMBOLGROESSE} aria-hidden="true" />
      <span className="einstellungszeile-name">{t(seite.name)}</span>
      <span className="einstellungszeile-wert">
        {stand.warnung && <span className="seitenzeile-punkt" aria-hidden="true" />}
        {stand.text}
        <ChevronRight size={PFEILGROESSE} aria-hidden="true" />
      </span>
    </button>
  );
}

/** Die Liste der Unterseiten unter den Reitern. */
export function Seitenliste() {
  return (
    <nav className="einstellungsliste" aria-label={t("einstellungenneu.seiten")}>
      {EINSTELLUNGSSEITEN.map((seite) => (
        <Seitenzeile key={seite.kennung} seite={seite} />
      ))}
    </nav>
  );
}

/**
 * Eine Unterseite als Bildschirm: Kopfzeile mit „Einstellungen“ zurück, dann ihr Inhalt.
 * Beispiel: Kennung „einstellungen-daten“ → „Deine Daten“ mit Sicherung und Löschen.
 * Sonderfall: unbekannte Kennung zeigt nur die Kopfzeile der Einstellungen.
 */
export function Unterseite({ kennung }: { readonly kennung: string }) {
  const seite = EINSTELLUNGSSEITEN.find((s) => s.kennung === kennung);
  return (
    <div className="bildschirm einstellungen-neu">
      <Kopfzeile titel={seite ? t(seite.name) : t("ich.titel")} zurueckText={t("ich.titel")} />
      {seite && <seite.Inhalt />}
    </div>
  );
}
