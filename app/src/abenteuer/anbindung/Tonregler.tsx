/**
 * Regler für Musik und Geräusche im Spielmenü des Abenteuers, dazu der Stummschalter (T1, T2).
 *
 * Rolle im Gesamtbild: Teil von anbindung/AbenteuerAnsicht.tsx (Spielmenü); die Werte stehen in
 * den Einstellungen der App (Feld abenteuerton) und gehen mit der Datensicherung mit. Ist der
 * allgemeine Ton der App aus, sagt ein Hinweis, dass die Regler erst damit wirken.
 * Abhängigkeiten: app/einstellungen.ts, i18n.
 */
import { aendereEinstellungen, useEinstellungen } from "../../app/einstellungen";
import { t } from "../../i18n/sprache";
import { Aktton } from "./Aktton";

/** Schrittweite der Regler in Prozent. */
const SCHRITT = 10;
const HOECHSTENS = 100;

export function Tonregler() {
  const { ton, abenteuerton } = useEinstellungen();
  const setze = (teil: Partial<typeof abenteuerton>) =>
    aendereEinstellungen({ abenteuerton: { ...abenteuerton, ...teil } });
  const regler = (art: "musik" | "geraeusche") => (
    <label className="abenteuer-tonregler">
      {t(`abenteuer.ton.${art}`)}
      <input
        type="range"
        min={0}
        max={HOECHSTENS}
        step={SCHRITT}
        value={abenteuerton[art]}
        disabled={abenteuerton.stumm}
        data-testid={`abenteuer-ton-${art}`}
        onChange={(e) => setze({ [art]: Number(e.target.value) })}
      />
    </label>
  );
  return (
    <fieldset className="abenteuer-ton" data-testid="abenteuer-ton">
      <legend>{t("abenteuer.ton.titel")}</legend>
      {regler("musik")}
      {regler("geraeusche")}
      <label className="abenteuer-tonregler">
        <input
          type="checkbox"
          checked={abenteuerton.stumm}
          data-testid="abenteuer-ton-stumm"
          onChange={(e) => setze({ stumm: e.target.checked })}
        />
        {t("abenteuer.ton.stumm")}
      </label>
      {ton !== "an" && <p className="abenteuer-ton-hinweis">{t("abenteuer.ton.appTonAus")}</p>}
      <Aktton />
    </fieldset>
  );
}
