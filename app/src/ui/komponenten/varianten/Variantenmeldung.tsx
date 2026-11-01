/**
 * Kurze Meldungen über der Zugleiste: Entwurf oder gespeichert, eine erreichte Grenze, „Rückgängig“
 * nach dem Löschen.
 *
 * Rolle im Gesamtbild: Entwurf, Abschnitt 5: An einer Grenze sagt die App es dem Leser, statt
 * still etwas zu löschen. Ein Entwurf wird nur auf Wunsch gespeichert (Wunsch des Autors,
 * 1.11.2026): Die Statuszeile sagt „Nicht gespeichert“ und trägt den Knopf „Speichern“. Gelöschte Züge lassen sich zurückholen, bis der Leser etwas anderes ändert.
 * Abhängigkeiten: useVariante.ts, training/variationsquellen.ts, i18n, lucide.
 */
import { Check, PenLine, Save, Undo2 } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { ENTWURF } from "../../../training/variationsquellen";
import type { Variantenstand } from "./useVariante";

const SYMBOL = 16;

/** Speicherstand: Entwurf, nicht gespeichert (mit „Speichern“) oder gespeichert. */
function Status({ stand }: { stand: Variantenstand }) {
  const entwurf = stand.variation.id === ENTWURF;
  const text = stand.ungespeichert
    ? "varianten.status.ungespeichert"
    : entwurf
      ? "varianten.status.entwurf"
      : "varianten.status.gespeichert";
  return (
    <p className="hinweis variantenstatus variantenmeldung-zeile" data-testid="variantenstatus">
      {entwurf ? (
        <PenLine size={SYMBOL} aria-hidden="true" />
      ) : (
        <Check size={SYMBOL} aria-hidden="true" />
      )}{" "}
      {t(text)}
      {entwurf && (
        <button
          type="button"
          className="knopf-link klein"
          data-testid="variante-speichern"
          onClick={() => stand.speichereEntwurf()}
        >
          <Save size={SYMBOL} aria-hidden="true" /> {t("varianten.speichern")}
        </button>
      )}
    </p>
  );
}

/** Die Meldungen; Grenzen haben Vorrang vor dem Speicherstand. */
export function Variantenmeldung({ stand }: { stand: Variantenstand }) {
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
      <Status stand={stand} />
    </div>
  );
}
