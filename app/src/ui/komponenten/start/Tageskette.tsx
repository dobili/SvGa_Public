/**
 * Tageskette Mo bis So und kompakte Wahl des Wochenziels für die Karte „Heute“ (Gestaltung A2,
 * 31.10.2026; Wochenziel aus Gamifizierung P4).
 *
 * Rolle im Gesamtbild: Ersetzt Ring und Punkte der früheren Wochenkarte. Gelernte Tage sind goldene
 * Kreise, der heutige Tag hat einen goldenen Ring, eine dünne Linie verbindet die Tage. Das Kürzel
 * steht im Kreis statt darunter (spart eine Zeile, damit die Kapitel weiter oben beginnen).
 * Ohne Wochenziel stehen nur die Knöpfe 2, 3, 4, 5, 7 in einer Zeile; die Erklärung des Lerntags
 * steht hinter „Wochenziel?“. Vorlesehilfen hören je Tag „Montag: gelernt“ bzw. „noch nicht“.
 * Abhängigkeiten: training/wochenziel.ts, Speicher, i18n.
 */
import { t, type Textschluessel } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import {
  mitWochenziel,
  VORGESCHLAGENES_ZIEL,
  ZIELWAHL,
  type Wochentag,
} from "../../../training/wochenziel";

/** Die sieben Tage der Woche als Kette. */
export function Tageskette({ tage }: { tage: readonly Wochentag[] }) {
  return (
    <ol className="tageskette" aria-label={t("woche.punkte")}>
      {tage.map((tag, i) => {
        const name = t(`woche.tagLang.${i}` as Textschluessel);
        const klasse = ["tageskette-tag", tag.gelernt ? "gelernt" : "", tag.heute ? "heute" : ""];
        return (
          <li
            key={tag.schluessel}
            className={klasse.filter(Boolean).join(" ")}
            aria-label={t(tag.gelernt ? "woche.tagGelernt" : "woche.tagOffen", { tag: name })}
          >
            <span className="tageskette-kreis" aria-hidden="true">
              {t(`woche.tag.${i}` as Textschluessel)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Speichert das Ziel (null: keins) und meldet fertig. */
function waehle(ziel: number | null, fertig: () => void): void {
  void aendere((d) => mitWochenziel(d, ziel)).then(fertig);
}

/**
 * Knöpfe „Tage pro Woche“ in einer Zeile; beim Ändern dazu „Abbrechen“ und „Kein Wochenziel“.
 * Vorgeschlagen sind drei Tage (Entscheidung E5): hervorgehoben, aber nicht vorgewählt.
 */
export function Tageswahl({ aendern, fertig }: { aendern: boolean; fertig: () => void }) {
  return (
    <div className="tageswahl" data-testid="wochenziel-wahl">
      <div className="tageswahl-zeile" role="group" aria-label={t("woche.frage")}>
        <span className="tageswahl-frage" aria-hidden="true">
          {t("buchlook.tageProWoche")}
        </span>
        {ZIELWAHL.map((ziel) => (
          <button
            key={ziel}
            type="button"
            className={
              ziel === VORGESCHLAGENES_ZIEL ? "tageswahl-knopf vorschlag" : "tageswahl-knopf"
            }
            aria-label={t("woche.tage", { n: ziel })}
            onClick={() => waehle(ziel, fertig)}
          >
            {ziel}
          </button>
        ))}
      </div>
      {aendern && (
        <div className="knopfzeile">
          <button type="button" className="knopf-link" onClick={fertig}>
            {t("woche.abbrechen")}
          </button>
          <button type="button" className="knopf-link" onClick={() => waehle(null, fertig)}>
            {t("woche.keinZiel")}
          </button>
        </div>
      )}
    </div>
  );
}
