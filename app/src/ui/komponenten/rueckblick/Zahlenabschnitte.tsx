/**
 * Abschnitte „Zahlen“ (Rang 20) und „Wertung“ (Rang 30) des Monatsrückblicks (Gamifizierung P12).
 *
 * Rolle im Gesamtbild: Die Zahlen kommen aus dem Tagesprotokoll (G2) über die Liste
 * RUECKBLICKZAHLEN (training/rueckblickinhalt.ts); eine neue Zahl braucht dort eine Zeile und den
 * Text „rueckblick.zahl.<kennung>“. Die Wertung steht je Zeitklasse mit Wert am Monatsanfang und
 * am Monatsende, ohne Farbe und ohne Pfeil: ein Rückgang ist kein Vorwurf.
 * Abhängigkeiten: training/rueckblickinhalt.ts, i18n.
 */
import { istTextschluessel, t, tZahl } from "../../../i18n/sprache";
import { wertungImMonat, zahlenImMonat } from "../../../training/rueckblickinhalt";
import type { Rueckblickangabe } from "./rueckblickabschnitte";

/** Die Zahlen des Monats. */
export function Zahlenabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const zahlen = zahlenImMonat(angabe.daten.aktivitaet, angabe.monat);
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-zahlen">
      <h2 className="karte-titel">{t("rueckblick.zahlen.titel")}</h2>
      <ul className="rueckblick-zahlen">
        {zahlen.map(({ kennung, anzahl }) => {
          const schluessel = `rueckblick.zahl.${kennung}`;
          if (!istTextschluessel(schluessel)) return null;
          return <li key={kennung}>{tZahl(schluessel, anzahl, { anzahl })}</li>;
        })}
      </ul>
    </section>
  );
}

/** Die Wertung je Zeitklasse. */
export function Wertungsabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const wertungen = wertungImMonat(angabe.daten.spiel.wertung, angabe.monat);
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-wertung">
      <h2 className="karte-titel">{t("rueckblick.wertung.titel")}</h2>
      <ul className="rueckblick-zahlen">
        {wertungen.map(({ tempo, anfang, ende }) => {
          const zeitklasse = t(`spielstaerke.zeitklasse.${tempo}`);
          return (
            <li key={tempo}>
              {anfang === null
                ? t("rueckblick.wertung.erste", { zeitklasse, ende })
                : t("rueckblick.wertung.zeile", { zeitklasse, anfang, ende })}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
