/**
 * Wahl des Wochenziels (Gamifizierung P4): „Wie oft willst du pro Woche üben?“ mit 2, 3, 4, 5, 7
 * Tagen, dazu „Später“ (ohne Ziel) oder „Abbrechen“ und „Kein Wochenziel“ (beim Ändern).
 *
 * Rolle im Gesamtbild: Teil der Wochenkarte. Das Ziel wählt der Leser selbst (Autonomie);
 * vorgeschlagen sind drei Tage (Entscheidung E5), hervorgehoben, aber nicht vorgewählt.
 * Abhängigkeiten: training/wochenziel.ts, Speicher, i18n.
 */
import { t } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import { mitWochenziel, VORGESCHLAGENES_ZIEL, ZIELWAHL } from "../../../training/wochenziel";

interface Eigenschaften {
  /** Ändern eines vorhandenen Ziels (statt erster Wahl). */
  readonly aendern: boolean;
  /** Nach der Wahl, nach „Abbrechen“ oder „Kein Wochenziel“. */
  readonly fertig: () => void;
  /** „Später“: nur bei der ersten Wahl. */
  readonly spaeter: () => void;
}

/** Speichert das Ziel (null: keins) und meldet fertig. */
function waehle(ziel: number | null, fertig: () => void): void {
  void aendere((d) => mitWochenziel(d, ziel)).then(fertig);
}

/** Die Knöpfe der Zielwahl mit Frage und Erklärung des Lerntags. */
export function Zielwahl({ aendern, fertig, spaeter }: Eigenschaften) {
  return (
    <div className="wochenkarte-wahl" data-testid="wochenziel-wahl">
      <p className="karte-titel">{t("woche.frage")}</p>
      <div className="knopfzeile" role="group" aria-label={t("woche.frage")}>
        {ZIELWAHL.map((ziel) => (
          <button
            key={ziel}
            type="button"
            className={ziel === VORGESCHLAGENES_ZIEL ? "knopf-haupt" : "knopf-zweit"}
            onClick={() => waehle(ziel, fertig)}
          >
            {t("woche.tage", { n: ziel })}
          </button>
        ))}
      </div>
      <p className="hinweis">{t("woche.lerntag")}</p>
      <div className="knopfzeile">
        {aendern ? (
          <>
            <button type="button" className="knopf-zweit" onClick={fertig}>
              {t("woche.abbrechen")}
            </button>
            <button type="button" className="knopf-zweit" onClick={() => waehle(null, fertig)}>
              {t("woche.keinZiel")}
            </button>
          </>
        ) : (
          <button type="button" className="knopf-zweit" onClick={spaeter}>
            {t("woche.spaeter")}
          </button>
        )}
      </div>
    </div>
  );
}
