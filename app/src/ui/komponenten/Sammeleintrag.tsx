/**
 * Ein Eintrag der Lernsammlung: zugeklappt Fundstelle und Plan, offen mit Brett, Notiz,
 * Sprung zur Abbildung, Bearbeiten und Löschen.
 *
 * Rolle im Gesamtbild: Teil des Bildschirms Lernsammlung (AP 15). Bearbeiten ändert Plan, Notiz
 * und Eröffnung; Stellung und Fundstelle bleiben.
 * Abhängigkeiten: training/lernsammlung.ts, speicher/speicher.ts, Trainerbrett, sammeltexte.ts,
 * Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { aendere } from "../../speicher/speicher";
import {
  EROEFFNUNG_HOECHSTENS,
  geaenderterEintrag,
  NOTIZ_HOECHSTENS,
  ohneSammeleintrag,
  PLAN_HOECHSTENS,
  type Sammeleintrag,
} from "../../training/lernsammlung";
import { Trainerbrett } from "../trainer/Trainerbrett";
import { fundstelle } from "./sammeltexte";
import { Knopfsymbol } from "./Knopfsymbol";

/** Felder zum Bearbeiten von Plan, Notiz und Eröffnung. */
function Bearbeiten({ eintrag, beiFertig }: { eintrag: Sammeleintrag; beiFertig: () => void }) {
  const [plan, setzePlan] = useState(eintrag.plan);
  const [notiz, setzeNotiz] = useState(eintrag.notiz);
  const [eroeffnung, setzeEroeffnung] = useState(eintrag.eroeffnung);
  const speichern = () => {
    const teil = { plan: plan.trim(), notiz: notiz.trim(), eroeffnung: eroeffnung.trim() };
    void aendere((daten) => ({
      ...daten,
      sammlung: geaenderterEintrag(daten.sammlung, eintrag.id, teil),
    }));
    beiFertig();
  };
  return (
    <div className="fehlerformular">
      <input
        type="text"
        className="textfeld"
        aria-label={t("sammlung.plan")}
        maxLength={PLAN_HOECHSTENS}
        value={plan}
        onChange={(e) => setzePlan(e.target.value)}
      />
      <textarea
        className="textfeld"
        aria-label={t("sammlung.notiz")}
        maxLength={NOTIZ_HOECHSTENS}
        rows={2}
        value={notiz}
        onChange={(e) => setzeNotiz(e.target.value)}
      />
      <input
        type="text"
        className="textfeld"
        aria-label={t("sammlung.eroeffnung")}
        maxLength={EROEFFNUNG_HOECHSTENS}
        value={eroeffnung}
        onChange={(e) => setzeEroeffnung(e.target.value)}
      />
      <div className="knopfreihe">
        <button type="button" className="knopf-haupt" onClick={speichern}>
          <Knopfsymbol art="speichern" />
          {t("sammlung.aenderungSpeichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiFertig}>
          {t("sammlung.abbrechen")}
        </button>
      </div>
    </div>
  );
}

/** Plan und Notiz zum Lesen, mit Hinweis, wenn der Plan noch fehlt. */
function Inhalt({ eintrag }: { eintrag: Sammeleintrag }) {
  return (
    <>
      <p>
        <strong>{t("sammlung.plan")}:</strong> {eintrag.plan || t("sammlung.ohnePlan")}
      </p>
      {eintrag.notiz && <p className="vorformatiert">{eintrag.notiz}</p>}
    </>
  );
}

/**
 * Ein Eintrag der Lernsammlung: zugeklappt Fundstelle und Plan, aufgeklappt mit Brett, Notiz,
 * Sprung zur Abbildung, Bearbeiten und Löschen.
 */
export function SammeleintragKarte({ eintrag }: { eintrag: Sammeleintrag }) {
  const { navigiere } = useNavigation();
  const [bearbeiten, setzeBearbeiten] = useState(false);
  const loeschen = () =>
    void aendere((daten) => ({
      ...daten,
      sammlung: ohneSammeleintrag(daten.sammlung, eintrag.id),
    }));
  return (
    <details className="sammeleintrag" data-testid="sammeleintrag">
      <summary>
        {fundstelle(eintrag)}
        {eintrag.plan ? ` · ${eintrag.plan}` : ""}
      </summary>
      <Trainerbrett fen={eintrag.fen} beschriftung={t("sammlung.stellung")} />
      {bearbeiten ? (
        <Bearbeiten eintrag={eintrag} beiFertig={() => setzeBearbeiten(false)} />
      ) : (
        <Inhalt eintrag={eintrag} />
      )}
      {!bearbeiten && (
        <div className="knopfreihe">
          {eintrag.herkunft === "abbildung" && (
            <button
              type="button"
              className="knopf-zweit"
              onClick={() => navigiere({ bildschirm: "abbildung", nummer: eintrag.quelle })}
            >
              {t("sammlung.zurAbbildung", { nummer: eintrag.quelle })}
            </button>
          )}
          <button type="button" className="knopf-zweit" onClick={() => setzeBearbeiten(true)}>
            {t("sammlung.bearbeiten")}
          </button>
          <button type="button" className="knopf-zweit" onClick={loeschen}>
            <Knopfsymbol art="loeschen" />
            {t("sammlung.loeschen")}
          </button>
        </div>
      )}
    </details>
  );
}
