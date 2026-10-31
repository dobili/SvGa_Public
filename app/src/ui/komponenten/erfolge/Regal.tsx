/**
 * Ein Regal der Karte „Deine Erfolge“ (Entwurf C, 31.10.2026): Titel mit Zähler („5 von 9“) und
 * eine waagrechte Reihe zum Wischen. Verdiente Stücke farbig, offene als Silhouette; ein Tipp zeigt
 * unter der Reihe wie bisher die Bedingung, bei verdienten Stücken dazu „Teilen“.
 *
 * Rolle im Gesamtbild: Ein Regal je Eintrag in ERFOLGSREGALE (erfolgsstuecke.ts). Die testids der
 * Abzeichen bleiben „abzeichen-<kennung>“ wie im früheren Raster; Orden heißen „orden-<kennung>“.
 * Unter offenen Stücken mit zählbarem Fortschritt steht der Stand („120 von 174“), wie früher an den
 * Ringen (zurückgeholt am 31.10.2026).
 * Abhängigkeiten: erfolgsstuecke.ts (Typen), Stueckbild.tsx, teilen/Stueckteilen.tsx, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { AbzeichenTeilen, OrdenTeilen } from "../teilen/Stueckteilen";
import { verdientSchluessel, type Erfolgsregal, type Erfolgsstueck } from "./erfolgsstuecke";
import { Stueckbild } from "./Stueckbild";

/** Unter der Reihe: Name, Bedingung, Stand und bei verdienten Stücken „Teilen“. */
function Bedingung({ stueck }: { stueck: Erfolgsstueck }) {
  return (
    <div className="regal-bedingung" data-testid="regal-bedingung">
      <p>
        <strong>{stueck.name}</strong> · {stueck.bedingung}
        {stueck.anteil && !stueck.verdient && (
          <> ({t("fortschritt.anteil", { ...stueck.anteil })})</>
        )}
      </p>
      {stueck.verdient &&
        (stueck.art === "orden" && stueck.ring ? (
          <OrdenTeilen ring={stueck.ring} name={stueck.name} />
        ) : (
          <AbzeichenTeilen kennung={stueck.kennung} />
        ))}
    </div>
  );
}

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
              <button
                type="button"
                aria-expanded={offen === schluessel}
                onClick={() => setzeOffen(offen === schluessel ? null : schluessel)}
              >
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
      {gewaehlt && <Bedingung stueck={gewaehlt} />}
    </section>
  );
}
