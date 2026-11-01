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
import { Play } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Ansicht } from "../../../app/stapel";
import { t } from "../../../i18n/sprache";
import { spielbar, type Partie } from "../../../spiel/partie";
import { alsProbewert } from "../../../spiel/probepartie";
import { Blatt } from "../spielstart/Blatt";
import { GabelSchalter, Variantenzahl } from "./VariantenHinweis";
import { alsWert, varianteAnsicht } from "./variantenwert";

const SYMBOL = 18;

/** Inhalt des Blatts: Schalter (nur ausgewertet), Öffnen, Von hier spielen, eigene Varianten. */
function Gabelwahl({
  id,
  ausgewertet,
  beiOeffnen,
  beiSpielen,
}: {
  id: string;
  ausgewertet: boolean;
  beiOeffnen: (engine: boolean) => void;
  beiSpielen: (() => void) | null;
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
      {beiSpielen && (
        <button type="button" className="knopf-zweit" onClick={beiSpielen}>
          <Play size={SYMBOL} aria-hidden="true" /> {t("varianten.vonHierSpielen")}
        </button>
      )}
      <Variantenzahl quelle={{ art: "partie", id }} />
    </div>
  );
}

/** Eingaben des Gabel-Knopfs der Partie. */
interface Gabeleingaben {
  readonly partie: Partie;
  readonly stelle: number;
  readonly fen: string;
  readonly ausgewertet: boolean;
}

/**
 * Der Knopf mit seinem Blatt. Eingaben: die Partie, gezeigte Stelle (Zahl der Züge) und ihre
 * Stellung, ob eine Auswertung vorliegt. „Von hier spielen“ beginnt eine Probepartie, die nicht
 * zählt (spiel/probepartie.ts); der Leser spielt wieder seine Farbe aus der Partie.
 */
export function PartieGabel({ partie, stelle, fen, ausgewertet }: Gabeleingaben) {
  const { navigiere } = useNavigation();
  const [offen, setzeOffen] = useState(false);
  const id = partie.id;
  const geheZu = (ansicht: Ansicht) => {
    setzeOffen(false);
    navigiere(ansicht);
  };
  const oeffne = (engine: boolean) =>
    geheZu(varianteAnsicht(alsWert({ art: "partie", id, stelle, engine })));
  const probe = alsProbewert({ art: "partie", id, stelle, farbe: partie.einstellung.eigeneFarbe });
  const spiele = () => geheZu({ bildschirm: "spielen", startFen: fen, probe });
  const inhalt = (
    <Gabelwahl
      id={id}
      ausgewertet={ausgewertet}
      beiOeffnen={oeffne}
      beiSpielen={spielbar(fen) ? spiele : null}
    />
  );
  return (
    <>
      <GabelSchalter beiTipp={() => setzeOffen(true)} />
      <Blatt
        titel={t("varianten.alsVariante")}
        offen={offen}
        schliessen={() => setzeOffen(false)}
        testid="partiegabel"
        kinder={inhalt}
      />
    </>
  );
}
