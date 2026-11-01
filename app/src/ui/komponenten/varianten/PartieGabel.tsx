/**
 * Gabel-Knopf am Brett einer beendeten Partie: öffnet die Partie als Variante an der gezeigten
 * Stelle, auf Wunsch mit den Engine-Folgen.
 *
 * Rolle im Gesamtbild: Frage a (Gabel-Knopf am Partie-Rückblick) und die Ergänzung des Autors
 * vom 1.11.2026: „Auf Wunsch die Zugfolgen ‚besserer Zug‘ und ‚Bestrafung‘ der Engine bei Fehlern
 * automatisch in den Baum aufnehmen“. Ein Tipp öffnet ein kleines Blatt mit dem Schalter
 * „Engine-Folgen übernehmen“ (Vorgabe aus; nur bei ausgewerteten Partien) und „Öffnen“.
 * Abhängigkeiten: spielstart/Blatt.tsx, VariantenHinweis.tsx, variantenwert.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { Blatt } from "../spielstart/Blatt";
import { GabelSchalter, Variantenzahl } from "./VariantenHinweis";
import { alsWert, varianteAnsicht } from "./variantenwert";

/** Inhalt des Blatts: Schalter (nur ausgewertet), Öffnen, Zahl der eigenen Varianten. */
function Gabelwahl({
  id,
  ausgewertet,
  beiOeffnen,
}: {
  id: string;
  ausgewertet: boolean;
  beiOeffnen: (engine: boolean) => void;
}) {
  const [engine, setzeEngine] = useState(false);
  return (
    <div className="neuquelle">
      {ausgewertet && (
        <label className="schalterzeile">
          <input type="checkbox" checked={engine} onChange={(e) => setzeEngine(e.target.checked)} />
          <span>{t("varianten.engine.schalter")}</span>
        </label>
      )}
      <button
        type="button"
        className="knopf-haupt"
        onClick={() => beiOeffnen(engine && ausgewertet)}
      >
        {t("varianten.neu.oeffnen")}
      </button>
      <Variantenzahl quelle={{ art: "partie", id }} />
    </div>
  );
}

/**
 * Der Knopf mit seinem Blatt. Eingaben: Kennung der Partie, gezeigte Stelle (Zahl der Züge),
 * ob eine Auswertung vorliegt.
 */
export function PartieGabel({
  id,
  stelle,
  ausgewertet,
}: {
  id: string;
  stelle: number;
  ausgewertet: boolean;
}) {
  const { navigiere } = useNavigation();
  const [offen, setzeOffen] = useState(false);
  const oeffne = (engine: boolean) => {
    setzeOffen(false);
    navigiere(varianteAnsicht(alsWert({ art: "partie", id, stelle, engine })));
  };
  return (
    <>
      <GabelSchalter beiTipp={() => setzeOffen(true)} />
      <Blatt
        titel={t("varianten.alsVariante")}
        offen={offen}
        schliessen={() => setzeOffen(false)}
        testid="partiegabel"
        kinder={<Gabelwahl id={id} ausgewertet={ausgewertet} beiOeffnen={oeffne} />}
      />
    </>
  );
}
