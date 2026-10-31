/**
 * Schalter für die ruhige Ansicht der Partie, unten rechts am Brett bei den anderen Brettschaltern.
 *
 * Rolle im Gesamtbild: Aus ui/bildschirme/Partie.tsx herausgelöst (0.3.40, Datei unter 400
 * Zeilen); Verhalten unverändert. Die Wahl steht in den Spielvorlieben (speicher/partien.ts).
 * Abhängigkeiten: speicher, i18n, lucide-react.
 */
import { Eye, EyeOff } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { mitVorlieben } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";

/** Größe des Augen-Symbols. */
const SYMBOLGROESSE = 20;

/** Der Schalter; `ruhig` ist die aktuelle Wahl. */
export function RuhigSchalter({ ruhig }: { ruhig: boolean }) {
  const schalte = () =>
    void aendere((d) => ({
      ...d,
      spiel: mitVorlieben(d.spiel, { ...d.spiel.vorlieben, ruhigeAnsicht: !ruhig }),
    }));
  return (
    <button
      type="button"
      className="knopf-symbol brettschalter"
      data-tour="partie-ruhig"
      aria-pressed={ruhig}
      aria-label={t("partie.ruhig")}
      title={t("partie.ruhig")}
      onClick={schalte}
    >
      {ruhig ? <EyeOff size={SYMBOLGROESSE} /> : <Eye size={SYMBOLGROESSE} />}
      <span className="brettschalter-text" aria-hidden="true">
        {t("partie.ruhigKurz")}
      </span>
    </button>
  );
}
