/**
 * Ein Regal der Karte „Deine Erfolge“ (Entwurf C, 31.10.2026): Titel mit Zähler („5 von 9“) und
 * eine waagrechte Reihe zum Wischen. Verdiente Stücke farbig, offene als Silhouette. Ein Tipp
 * öffnet seit dem 31.10.2026 das Infofenster (Infofenster.tsx) mit Bedingung, Stand oder Datum,
 * „Teilen“ und dem Knopf zum Ort; vorher stand die Bedingung als leicht übersehene Zeile unter der
 * Reihe (Befund des Autors).
 *
 * Rolle im Gesamtbild: Ein Regal je Eintrag in ERFOLGSREGALE (erfolgsstuecke.ts). Die testids der
 * Abzeichen bleiben „abzeichen-<kennung>“ wie im früheren Raster; Orden heißen „orden-<kennung>“.
 * Unter offenen Stücken mit zählbarem Fortschritt steht der Stand („120 von 174“), wie früher an den
 * Ringen (zurückgeholt am 31.10.2026).
 * Abhängigkeiten: erfolgsstuecke.ts (Typen), Stueckbild.tsx, Infofenster.tsx, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { verdientSchluessel, type Erfolgsregal, type Erfolgsstueck } from "./erfolgsstuecke";
import { Infofenster } from "./Infofenster";
import { Stueckbild } from "./Stueckbild";

/** Ein Regal. Beispiel: „Bots besiegt · 5 von 9“ mit neun Orden zum Wischen. */
export function Regal({
  regal,
  stuecke,
}: {
  regal: Erfolgsregal;
  stuecke: readonly Erfolgsstueck[];
}) {
  const [offen, setzeOffen] = useState<string | null>(null);
  if (stuecke.length === 0) return null;
  const gewaehlt = stuecke.find((s) => verdientSchluessel(s) === offen) ?? null;
  const verdient = stuecke.filter((s) => s.verdient).length;
  return (
    <section className="regal" data-testid={`erfolge-regal-${regal.kennung}`}>
      <div className="regal-kopf">
        <h3>{t(regal.titel)}</h3>
        <span className="regal-zaehler" data-testid={`erfolge-zaehler-${regal.kennung}`}>
          {t("fortschritt.anteil", { erreicht: verdient, gesamt: stuecke.length })}
        </span>
      </div>
      <ul className="erfolge-reihe regal-reihe">
        {stuecke.map((s) => {
          const schluessel = verdientSchluessel(s);
          return (
            <li
              key={schluessel}
              className={s.verdient ? "verdient" : "offen"}
              data-testid={`${s.art}-${s.kennung}`}
            >
              <button type="button" aria-haspopup="dialog" onClick={() => setzeOffen(schluessel)}>
                <Stueckbild stueck={s} klasse="erfolg-regal" />
                <span className="erfolg-name" aria-hidden="true">
                  {s.name}
                </span>
                {/* Zurückgeholt (31.10.2026): der Stand offener Stücke auf einen Blick. */}
                {!s.verdient && s.anteil && (
                  <span className="erfolg-zahl" data-testid={`stand-${s.art}-${s.kennung}`}>
                    {t("fortschritt.anteil", { ...s.anteil })}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {gewaehlt && <Infofenster stuecke={[gewaehlt]} beiSchliessen={() => setzeOffen(null)} />}
    </section>
  );
}
