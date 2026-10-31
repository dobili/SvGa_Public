/**
 * Knopf zum Lernpfad „Dein Weg durchs Buch“ (Gamifizierung P2).
 *
 * Rolle im Gesamtbild: steht als Symbol oben rechts auf der Buch-Startseite (Name für Vorlesehilfen
 * „Als Weg anzeigen“; seit der Gestaltung A2 vom 31.10.2026, damit die Kapitel weiter oben
 * beginnen) und mit Text im Profil unter „Dein Fortschritt“ („Dein Weg durchs Buch“). Öffnet die Zusatzansicht „lernpfad“
 * (app/zusatzansichten.ts), ohne den Router zu ändern.
 * Abhängigkeiten: Navigation, i18n, lucide-react.
 */
import { Route } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";

/** Größe des Wegzeichens im Knopf (Bildpunkte). */
const ZEICHENGROESSE = 18;

/** Größe des Wegzeichens als Symbolknopf im Buch (wie das Symbol der Tour). */
const SYMBOLGROESSE = 24;

/** Der Knopf; `ort` wählt die Form: Symbol im Kopf des Buches oder Knopf mit Text im Profil. */
export function LernpfadKnopf({ ort }: { ort: "buch" | "profil" }) {
  const { navigiere } = useNavigation();
  if (ort === "buch")
    return (
      <button
        type="button"
        className="knopf-symbol lernpfad-symbol"
        aria-label={t("lernpfad.knopf")}
        title={t("lernpfad.knopf")}
        data-testid="lernpfad-knopf-buch"
        onClick={() => navigiere({ bildschirm: "zusatz", kennung: "lernpfad" })}
      >
        <Route size={SYMBOLGROESSE} aria-hidden="true" />
      </button>
    );
  return (
    <button
      type="button"
      className="knopf-zweit lernpfad-knopf"
      data-testid={`lernpfad-knopf-${ort}`}
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: "lernpfad" })}
    >
      <Route size={ZEICHENGROESSE} aria-hidden="true" />
      {t("lernpfad.titel")}
    </button>
  );
}
