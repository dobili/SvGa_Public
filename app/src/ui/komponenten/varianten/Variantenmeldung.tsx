/**
 * Kurze Meldungen über der Zugleiste: Entwurf oder gespeichert, eine erreichte Grenze, „Rückgängig“
 * nach dem Löschen.
 *
 * Rolle im Gesamtbild: Entwurf, Abschnitt 5: An einer Grenze sagt die App es dem Leser, statt
 * still etwas zu löschen. Abschnitt 3: Der erste eigene Inhalt speichert automatisch („Gespeichert
 * unter Varianten“). Gelöschte Züge lassen sich zurückholen, bis der Leser etwas anderes ändert.
 * Abhängigkeiten: useVariante.ts, training/variationsquellen.ts, i18n, lucide.
 */
import { Check, PenLine, Undo2 } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { ENTWURF } from "../../../training/variationsquellen";
import type { Variantenstand } from "./useVariante";

const SYMBOL = 16;

/** Die Meldungen; Grenzen haben Vorrang vor dem Speicherstand. */
export function Variantenmeldung({ stand }: { stand: Variantenstand }) {
  const entwurf = stand.variation.id === ENTWURF;
  return (
    <div className="variantenmeldung" aria-live="polite">
      {stand.grenze && (
        <p className="fehlertext" data-testid="variante-grenze">
          {t(`varianten.grenze.${stand.grenze}`)}
        </p>
      )}
      {stand.voll && <p className="fehlertext">{t("varianten.grenze.fortsetzungen")}</p>}
      {stand.geloescht && (
        <p className="hinweis variantenmeldung-zeile">
          {t("varianten.geloescht")}
          <button type="button" className="knopf-link klein" onClick={stand.rueckgaengig}>
            <Undo2 size={SYMBOL} aria-hidden="true" /> {t("varianten.rueckgaengig")}
          </button>
        </p>
      )}
      <p className="hinweis variantenstatus" data-testid="variantenstatus">
        {entwurf ? (
          <PenLine size={SYMBOL} aria-hidden="true" />
        ) : (
          <Check size={SYMBOL} aria-hidden="true" />
        )}{" "}
        {t(entwurf ? "varianten.status.entwurf" : "varianten.status.gespeichert")}
      </p>
    </div>
  );
}
