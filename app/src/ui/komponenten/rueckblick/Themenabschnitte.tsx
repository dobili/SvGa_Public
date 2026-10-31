/**
 * Abschnitte „Deine Themen“ (Rang 60) und „Dein nächster Schritt für November“ (Rang 70) des
 * Monatsrückblicks (Gamifizierung P12).
 *
 * Rolle im Gesamtbild: Die Themen kommen aus dem Antwortprotokoll (G1): das sicherste Thema des
 * Monats und, wenn es eins unter 70 % gibt, eins zum Üben mit Knopf in den passenden Trainer
 * (Trainer aus dem Präfix der Kennung, training/themennamen.ts; ein neuer Trainer erscheint von
 * selbst). Der nächste Schritt ist der erste Vorschlag der Karte „Dein nächster Schritt“ (P1,
 * VORSCHLAGSARTEN); ein neuer Vorschlag eines späteren Trainers erscheint auch hier.
 * Abhängigkeiten: training/rueckblickinhalt.ts, training/themennamen.ts, training/rueckblick.ts,
 * start/naechsterLage.ts (Lage und Satz), Navigation, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { vorschlaege } from "../../../training/naechsterSchritt";
import { folgemonat } from "../../../training/rueckblick";
import { themenImMonat } from "../../../training/rueckblickinhalt";
import type { Themenquote } from "../../../training/themenstand";
import { themennameSchluessel, trainerZumThema } from "../../../training/themennamen";
import { useLage, vorschlagstext } from "../start/naechsterLage";
import { monatsname } from "./monatstext";
import type { Rueckblickangabe } from "./rueckblickabschnitte";

/** Name eines Themas; ohne Namen die Kennung. */
function themenname(thema: string): string {
  const schluessel = themennameSchluessel(thema);
  return schluessel ? t(schluessel) : thema;
}

/** Richtige und alle der letzten Antworten, für „9 von 10 richtig“. */
function anteil(quote: Themenquote, letzte: string): { richtig: number; anzahl: number } {
  const anzahl = letzte.length;
  return { richtig: Math.round(quote.quote * anzahl), anzahl };
}

/** Stärkstes Thema und Thema zum Üben. */
export function Themenabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const { navigiere } = useNavigation();
  const { themen } = angabe.daten;
  const { stark, ueben } = themenImMonat(themen, angabe.monat);
  const trainer = ueben ? trainerZumThema(ueben.thema) : null;
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-themen">
      <h2 className="karte-titel">{t("rueckblick.themen.titel")}</h2>
      {stark && (
        <p data-testid="rueckblick-stark">
          {t("rueckblick.themen.stark", {
            thema: themenname(stark.thema),
            ...anteil(stark, themen[stark.thema]?.letzte ?? ""),
          })}
        </p>
      )}
      {ueben && (
        <p data-testid="rueckblick-ueben">
          {t("rueckblick.themen.ueben", { thema: themenname(ueben.thema) })}{" "}
          {trainer && (
            <button
              type="button"
              className="knopf-link"
              onClick={() =>
                navigiere({ bildschirm: "trainer", kennung: trainer, thema: ueben.thema })
              }
            >
              {t("rueckblick.themen.knopf")}
            </button>
          )}
        </p>
      )}
    </section>
  );
}

/** Der erste Vorschlag von „Dein nächster Schritt“ für den Folgemonat; ohne Vorschlag nichts. */
export function Naechsterabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const { navigiere } = useNavigation();
  const lage = useLage();
  const erster = lage ? vorschlaege(lage)[0] : undefined;
  if (!erster) return null;
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-naechster">
      <h2 className="karte-titel">
        {t("rueckblick.naechster.titel", { monat: monatsname(folgemonat(angabe.monat)) })}
      </h2>
      <p>{vorschlagstext(erster)}</p>
      <button type="button" className="knopf-haupt" onClick={() => navigiere(erster.ziel)}>
        {t(erster.knopf)}
      </button>
    </section>
  );
}
