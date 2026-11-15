/**
 * Schalter im Spielmenü: Zielhinweis im Bild an oder aus (Spieltest „einstieg“, 15.11.2026, R1).
 * Vorgabe: an. Wer lieber selbst sucht, schaltet ihn ab.
 *
 * Rolle im Gesamtbild: Teil von anbindung/AbenteuerAnsicht.tsx (Spielmenü), neben Steuerkreuz und
 * Ton. Der Wert ist ein Merker des Geräts (anbindung/zielhinweis.ts).
 * Abhängigkeiten: anbindung/zielhinweis.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { schalteZielhinweis, useZielhinweisAn } from "./zielhinweis";

/** Ein Kästchen „Pfeil zum nächsten Ziel zeigen“. */
export function Zielhinweiswahl() {
  const an = useZielhinweisAn();
  return (
    <fieldset className="abenteuer-ton" data-testid="abenteuer-zielhinweiswahl">
      <legend>{t("abenteuer.zielhinweis.titel")}</legend>
      <label className="abenteuer-tonregler">
        <input
          type="checkbox"
          checked={an}
          data-testid="abenteuer-zielhinweis"
          onChange={(e) => schalteZielhinweis(e.target.checked)}
        />
        {t("abenteuer.zielhinweis.an")}
      </label>
    </fieldset>
  );
}
