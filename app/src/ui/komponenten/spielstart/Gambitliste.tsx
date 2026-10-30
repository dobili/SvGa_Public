/**
 * Die Gambits der gewählten Bänder in der Klappe „Eröffnungen nach Spielstärke“: je Band die drei
 * häufigsten, die noch nicht dastehen, beide Seiten zusammen; ein Tipp legt das Gambit fest.
 *
 * Rolle im Gesamtbild: Eröffnungspaket Stufe 3 (Ideensammlung, „Nur notiert“ Nr. 4: Gambits nach
 * Eröffnung, mit Häufigkeit). Der Name nennt die Eröffnung, aus der das Gambit stammt
 * („Sizilianische Verteidigung: Smith-Morra Gambit“). Rechnung in spiel/eroeffnungsbaender.ts.
 * Abhängigkeiten: spiel/eroeffnungsbaender.ts, i18n.
 */
import { sprache, t } from "../../../i18n/sprache";
import {
  gambitsNachStaerke,
  type Bandgambit,
  type Eroeffnungsbaender,
} from "../../../spiel/eroeffnungsbaender";
import { PRAXIS_VORSILBE } from "../../../spiel/partie";

/** Nachkommastellen der Häufigkeit. */
const STELLEN = 2;

/** Name mit deutscher Eröffnung davor: „Sicilian Defense: Smith-Morra Gambit“ → „Sizilianische …“. */
function gambitname(g: Bandgambit): string {
  if (sprache() !== "de" || !g.familie || !g.name.startsWith(g.familie)) return g.name;
  return `${g.familieDe}${g.name.slice(g.familie.length)}`;
}

/** Die Liste der Gambits für die Bänder von `von` bis `bis`. */
export function Gambitliste({
  daten,
  von,
  bis,
  bandname,
  gewaehlt,
  beiWahl,
}: {
  daten: Eroeffnungsbaender;
  von: number;
  bis: number;
  bandname: (index: number) => string;
  gewaehlt: string | null;
  beiWahl: (eroeffnung: string) => void;
}) {
  const liste = gambitsNachStaerke(daten, von, bis);
  if (liste.length === 0) return null;
  return (
    <div className="staerkewahl-seite" data-testid="gambitliste">
      <h4>{t("spielen.staerkewahl.gambits")}</h4>
      <ul className="staerkewahl-liste">
        {liste.map(({ familie: g, band }) => {
          const wert = `${PRAXIS_VORSILBE}${g.name}`;
          const anteil = (g.anteil[band] ?? 0).toLocaleString(sprache(), {
            maximumFractionDigits: STELLEN,
          });
          return (
            <li key={g.name}>
              <button
                type="button"
                className="staerkewahl-zeile"
                aria-pressed={gewaehlt === wert}
                onClick={() => beiWahl(wert)}
              >
                <span className="staerkewahl-name">{gambitname(g)}</span>
                <span className="staerkewahl-marke">
                  {t(
                    g.seite === "w"
                      ? "spielen.staerkewahl.weissSpielt"
                      : "spielen.staerkewahl.schwarzSpielt",
                  )}
                </span>
                <span className="hinweis">
                  {t("spielen.staerkewahl.anteil", { anteil, band: bandname(band) })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
