/**
 * Knopf zum Lernpfad „Dein Weg durchs Buch“ (Gamifizierung P2).
 *
 * Rolle im Gesamtbild: steht über der Kapitelliste der Buch-Startseite („Als Weg anzeigen“) und im
 * Profil unter „Dein Fortschritt“ („Dein Weg durchs Buch“). Öffnet die Zusatzansicht „lernpfad“
 * (app/zusatzansichten.ts), ohne den Router zu ändern.
 * Abhängigkeiten: Navigation, i18n, lucide-react.
 */
import { Route } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";

/** Größe des Wegzeichens im Knopf (Bildpunkte). */
const ZEICHENGROESSE = 18;

/** Der Knopf; `ort` wählt die Beschriftung: über der Kapitelliste oder im Profil. */
export function LernpfadKnopf({ ort }: { ort: "buch" | "profil" }) {
  const { navigiere } = useNavigation();
  return (
    <button
      type="button"
      className="knopf-zweit lernpfad-knopf"
      data-testid={`lernpfad-knopf-${ort}`}
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: "lernpfad" })}
    >
      <Route size={ZEICHENGROESSE} aria-hidden="true" />
      {t(ort === "buch" ? "lernpfad.knopf" : "lernpfad.titel")}
    </button>
  );
}
