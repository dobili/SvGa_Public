/**
 * Ring „2 von 3 Tagen“ und die sieben Punkte Mo bis So der Wochenkarte (Gamifizierung P4).
 *
 * Rolle im Gesamtbild: Sichtbarer, ehrlicher Fortschritt (Ziel-Gradient, Vorrecherche
 * Abschnitt 1). Gefüllte Punkte sind Lerntage, der heutige Tag hat einen Rand. Vorlesehilfen
 * hören je Tag „Montag: gelernt“ bzw. „noch nicht“.
 * Abhängigkeiten: training/wochenziel.ts (Typ), i18n.
 */
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Wochentag } from "../../../training/wochenziel";

const RING_RADIUS = 20;
const RING_MITTE = 24;
const RING_STRICH = 5;
const UMFANG = 2 * Math.PI * RING_RADIUS;

/** Der Ring mit dem Anteil gelernter Tage am Ziel (voll ab erreichtem Ziel). */
export function Wochenring({ gelernt, ziel }: { gelernt: number; ziel: number }) {
  const anteil = Math.min(1, gelernt / ziel);
  const text = t("woche.stand", { gelernt, ziel });
  return (
    <div className="wochenring" data-testid="wochenziel-stand">
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle
          className="wochenring-grund"
          cx={RING_MITTE}
          cy={RING_MITTE}
          r={RING_RADIUS}
          strokeWidth={RING_STRICH}
        />
        <circle
          className="wochenring-wert"
          cx={RING_MITTE}
          cy={RING_MITTE}
          r={RING_RADIUS}
          strokeWidth={RING_STRICH}
          strokeDasharray={`${anteil * UMFANG} ${UMFANG}`}
          transform={`rotate(-90 ${RING_MITTE} ${RING_MITTE})`}
        />
      </svg>
      <span>{text}</span>
    </div>
  );
}

/** Die sieben Punkte der Woche mit Kürzeln Mo bis So. */
export function Wochenpunkte({ tage }: { tage: readonly Wochentag[] }) {
  return (
    <ol className="wochenpunkte" aria-label={t("woche.punkte")}>
      {tage.map((tag, i) => {
        const name = t(`woche.tagLang.${i}` as Textschluessel);
        const klasse = ["wochenpunkt", tag.gelernt ? "gelernt" : "", tag.heute ? "heute" : ""];
        return (
          <li
            key={tag.schluessel}
            className={klasse.filter(Boolean).join(" ")}
            aria-label={t(tag.gelernt ? "woche.tagGelernt" : "woche.tagOffen", { tag: name })}
          >
            <span className="wochenpunkt-punkt" aria-hidden="true" />
            <span aria-hidden="true">{t(`woche.tag.${i}` as Textschluessel)}</span>
          </li>
        );
      })}
    </ol>
  );
}
