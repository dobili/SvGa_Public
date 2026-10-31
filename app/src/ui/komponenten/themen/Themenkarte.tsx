/**
 * Profilkarte „Deine Themen“ (Gamifizierung P3): je Thema eine Medaille in Bronze, Silber oder
 * Gold, darunter Name und Fortschritt („7 von 15 bis Silber“); ein Tipp zeigt die Bedingung, den
 * Knopf „Üben“ und, ab Bronze, „Teilen“.
 *
 * Rolle im Gesamtbild: Eintrag in PROFILKARTEN (Rang 10). Beim Öffnen trägt die Karte still alle
 * schon erreichten Stufen in „verdient“ ein (wie die Rekordtafel), damit sie bleiben (E4). „Üben“
 * öffnet den Trainer des Präfixes mit dem Thema (ui/trainer/trainerthema.ts); Themen ohne
 * spielbaren Trainer haben keinen Knopf.
 * Abhängigkeiten: useMeisterschaft.ts, Themenmedaille.tsx, MedailleTeilen.tsx, thementexte.ts,
 * training/meisterschaftsstand.ts, training/themennamen.ts, Navigation, Speicher, i18n,
 * Stil in ui/stil/themen.css.
 */
import { useEffect, useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import { naechsteRegel } from "../../../training/meisterschaft";
import {
  mitNeuenStufen,
  type Themenmedaille as Medaille,
} from "../../../training/meisterschaftsstand";
import { trainerZumThema } from "../../../training/themennamen";
import "../../stil/themen.css";
import { MedailleTeilen } from "./MedailleTeilen";
import { Themenmedaille } from "./Themenmedaille";
import { fortschrittstext, themenname } from "./thementexte";
import { useThemenmedaillen } from "./useMeisterschaft";

/** Was ein aufgeklapptes Thema zeigt: Bedingung, Auffrischen, Üben und Teilen. */
function Einzelheiten({ medaille }: { medaille: Medaille }) {
  const { navigiere } = useNavigation();
  const regel = naechsteRegel(medaille.stufe);
  const trainer = trainerZumThema(medaille.thema);
  return (
    <div className="themen-einzelheiten">
      <span className="hinweis">
        {regel ? t(`themen.bedingung.${regel.stufe}`) : t("themen.fertig")}
      </span>
      {trainer && (
        <button
          type="button"
          className="knopf-link klein"
          onClick={() =>
            navigiere({ bildschirm: "trainer", kennung: trainer, thema: medaille.thema })
          }
        >
          {t("themen.ueben")}
        </button>
      )}
      {medaille.stufe && <MedailleTeilen thema={medaille.thema} stufe={medaille.stufe} />}
    </div>
  );
}

/** Ein Thema im Raster. */
function Thema({
  medaille,
  offen,
  schalte,
}: {
  medaille: Medaille;
  offen: boolean;
  schalte: () => void;
}) {
  const name = themenname(medaille.thema);
  return (
    <li className={medaille.stufe ? "erreicht" : "offen"} data-testid={`thema-${medaille.thema}`}>
      <button type="button" aria-expanded={offen} onClick={schalte}>
        <Themenmedaille thema={medaille.thema} stufe={medaille.stufe} />
        <span className="themen-name" aria-hidden="true">
          {name}
        </span>
        <span className="themen-fortschritt">{fortschrittstext(medaille)}</span>
        {medaille.auffrischen && (
          <span className="themen-auffrischen">{t("themen.auffrischen")}</span>
        )}
      </button>
      {offen && <Einzelheiten medaille={medaille} />}
    </li>
  );
}

/** Die Karte im Profil. */
export function Themenkarte() {
  const medaillen = useThemenmedaillen();
  const [offen, setzeOffen] = useState<string | null>(null);
  useEffect(() => {
    void aendere((d) => mitNeuenStufen(d, new Date()).daten);
  }, []);
  return (
    <section className="karte" data-testid="themenkarte">
      <h2 className="karte-titel">{t("themen.karte.titel")}</h2>
      <p className="hinweis">
        {t(medaillen.length === 0 ? "themen.karte.leer" : "themen.karte.einleitung")}
      </p>
      <ul className="themenraster">
        {medaillen.map((m) => (
          <Thema
            key={m.thema}
            medaille={m}
            offen={offen === m.thema}
            schalte={() => setzeOffen(offen === m.thema ? null : m.thema)}
          />
        ))}
      </ul>
    </section>
  );
}
