/**
 * Zielwahl (Gamifizierung P13): bis zu fünf Vorschläge, nächste zuerst, und das eigene Ziel
 * „Bot besiegen“.
 *
 * Rolle im Gesamtbild: Teil des Abschnitts „Deine Ziele“ der Wochenkarte; erscheint ohne
 * angeheftete Ziele von selbst und sonst nach „Ziel wählen“. Jeder Vorschlag sagt, was genau fehlt
 * („Dir fehlen noch 2 Bots …: Lotte, Paul“), und lässt sich mit einem Tipp anheften; der Knopf
 * daneben führt direkt hin, ohne anzuheften.
 * Abhängigkeiten: training/zielvorschlaege.ts, training/ziele.ts, zielhilfen.ts, Botzielwahl.tsx,
 * Speicher, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import { mitAngeheftetem, zielschluessel } from "../../../training/ziele";
import { zielvorschlaege, type Zielvorschlag } from "../../../training/zielvorschlaege";
import { Botzielwahl } from "./Botzielwahl";
import { useHinfuehrung, useZielkontext, zieltext } from "./zielhilfen";

/** Ein Vorschlag mit „Anheften“ und dem Knopf, der hinführt. */
function Vorschlagszeile({ vorschlag, fertig }: { vorschlag: Zielvorschlag; fertig: () => void }) {
  const kontext = useZielkontext();
  const fuehreHin = useHinfuehrung();
  const { anzeige, ziel } = vorschlag;
  const hin = anzeige.hin;
  return (
    <li className="zielzeile" data-testid="ziel-vorschlag">
      <p>{zieltext(anzeige.text)}</p>
      <div className="knopfzeile">
        <button
          type="button"
          className="knopf-haupt"
          onClick={() =>
            void aendere((d) => mitAngeheftetem(d, ziel, kontext.kapitel)).then(fertig)
          }
        >
          {t("ziel.anheften")}
        </button>
        {hin && (
          <button type="button" className="knopf-zweit" onClick={() => fuehreHin(hin)}>
            {t(anzeige.knopf)}
          </button>
        )}
      </div>
    </li>
  );
}

/** Vorschläge und eigenes Ziel; `fertig` nach dem Anheften oder Abbrechen. */
export function Zielauswahl({ fertig, abbrechbar }: { fertig: () => void; abbrechbar: boolean }) {
  const kontext = useZielkontext();
  const [eigenes, setzeEigenes] = useState(false);
  if (eigenes) return <Botzielwahl fertig={() => setzeEigenes(false)} />;
  const vorschlaege = zielvorschlaege(kontext);
  return (
    <div className="zielwahl" data-testid="ziel-wahl">
      {vorschlaege.length === 0 ? (
        <p className="hinweis">{t("ziel.keineVorschlaege")}</p>
      ) : (
        <ul className="zielliste">
          {vorschlaege.map((v) => (
            <Vorschlagszeile key={zielschluessel(v.ziel)} vorschlag={v} fertig={fertig} />
          ))}
        </ul>
      )}
      <div className="knopfzeile">
        <button type="button" className="knopf-zweit" onClick={() => setzeEigenes(true)}>
          {t("ziel.eigenes")}
        </button>
        {abbrechbar && (
          <button type="button" className="knopf-zweit" onClick={fertig}>
            {t("ziel.abbrechen")}
          </button>
        )}
      </div>
    </div>
  );
}
