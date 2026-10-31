/**
 * Abschnitt „Kalender“ des Monatsrückblicks (Gamifizierung P12, RUECKBLICKABSCHNITTE, Rang 10):
 * die Tage des Monats, Lerntage gefüllt, darüber ein ruhiger Satz zur Zahl der Lerntage.
 *
 * Rolle im Gesamtbild: Lerntage kommen aus dem Tagesprotokoll (G2, speicher/aktivitaet.ts). Der
 * Ton bleibt freundlich, auch bei wenigen Tagen („Jeder zählt.“), ohne Vergleich mit dem Vormonat
 * (gamifizierung.md P12, Grenzen des Autors: kein Druck).
 * Abhängigkeiten: training/rueckblick.ts, monatstext.ts, i18n, Stil in ui/stil/rueckblick.css.
 */
import { t } from "../../../i18n/sprache";
import { kalenderwochen, lerntageIm } from "../../../training/rueckblick";
import "../../stil/rueckblick.css";
import { lerntagesatz, monatsname } from "./monatstext";
import type { Rueckblickangabe } from "./rueckblickabschnitte";

const WOCHENTAGE = [1, 2, 3, 4, 5, 6, 7] as const;

/** Der Abschnitt. */
export function Kalenderabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const { daten, monat } = angabe;
  const gelernt = new Set(lerntageIm(daten.aktivitaet, monat));
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-kalender">
      <p data-testid="rueckblick-lerntage">{lerntagesatz(gelernt.size, monatsname(monat))}</p>
      <div className="rueckblick-kalender" role="list" aria-label={t("rueckblick.kalender")}>
        {WOCHENTAGE.map((w) => (
          <span key={`k${w}`} className="rueckblick-wochentag" aria-hidden="true">
            {t(`rueckblick.wochentag.${w}`)}
          </span>
        ))}
        {kalenderwochen(monat)
          .flat()
          .map((tag, i) =>
            tag === null ? (
              <span key={`l${i}`} className="rueckblick-tag leer" aria-hidden="true" />
            ) : (
              <span
                key={tag}
                role="listitem"
                className={gelernt.has(tag) ? "rueckblick-tag gelernt" : "rueckblick-tag"}
                aria-label={t(gelernt.has(tag) ? "rueckblick.tagGelernt" : "rueckblick.tagFrei", {
                  tag: Number(tag.slice(-2)),
                })}
              >
                {Number(tag.slice(-2))}
              </span>
            ),
          )}
      </div>
    </section>
  );
}
