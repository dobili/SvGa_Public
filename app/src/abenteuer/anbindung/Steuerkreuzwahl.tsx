/**
 * Wahl im Spielmenü: Steuerkreuz rechts (Vorgabe, Einhand mit rechts) oder links; der
 * Aktionsknopf und „Weiter“ im Dialog liegen dann auf der anderen Seite
 * (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 2).
 *
 * Rolle im Gesamtbild: Teil von anbindung/AbenteuerAnsicht.tsx (Spielmenü), neben den Tonreglern.
 * Der Wert steht wie der Ton in den Einstellungen der App (Feld abenteuersteuerkreuz) und geht mit
 * der Datensicherung mit; AbenteuerAnsicht schreibt ihn als data-steuerkreuz an die Ansicht, die
 * Lage der Knöpfe regelt bedienung.css. Im Querformat gilt die feste Lage aus Abschnitt 3.
 * Abhängigkeiten: app/einstellungen.ts, i18n.
 */
import {
  aendereEinstellungen,
  useEinstellungen,
  type Steuerkreuzseite,
} from "../../app/einstellungen";
import { t } from "../../i18n/sprache";

const SEITEN: readonly Steuerkreuzseite[] = ["rechts", "links"];

/** Zwei Wahlknöpfe „Steuerkreuz rechts“ und „Steuerkreuz links“. */
export function Steuerkreuzwahl() {
  const { abenteuersteuerkreuz } = useEinstellungen();
  return (
    <fieldset className="abenteuer-ton" data-testid="abenteuer-steuerkreuzwahl">
      <legend>{t("abenteuer.steuerkreuz.titel")}</legend>
      {SEITEN.map((seite) => (
        <label key={seite} className="abenteuer-tonregler">
          <input
            type="radio"
            name="abenteuer-steuerkreuz"
            value={seite}
            checked={abenteuersteuerkreuz === seite}
            data-testid={`abenteuer-steuerkreuz-${seite}`}
            onChange={() => aendereEinstellungen({ abenteuersteuerkreuz: seite })}
          />
          {t(`abenteuer.steuerkreuz.${seite}`)}
        </label>
      ))}
    </fieldset>
  );
}
