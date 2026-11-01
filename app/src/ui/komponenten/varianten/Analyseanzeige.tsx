/**
 * Anzeige der Variantenanalyse: Fortschritt mit „Abbrechen“ unter der Kopfzeile, die drei Schalter
 * „Symbole“, „Balken“, „Engine-Pfeil“ über dem Brett und der Knopf „Analyse“ der Knopfzeile.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 3, Bild A der Entscheidung f (1.11.2026): oben ein
 * schmaler Balken „Analyse 12 von 18 Stellungen“, man kann dabei weiter blättern; sobald es Werte
 * gibt, erscheinen die drei Schalter als Chips über dem Brett (Wunsch des Autors: Symbole, Balken
 * und Pfeil der Engine ein- und ausblendbar). Eine kurze Erklärung steht hinter dem ⓘ.
 * Abhängigkeiten: useVariantenanalyse.ts, bausteine (Fortschrittsbalken, InfoKnopf), i18n, lucide.
 */
import { ChartNoAxesColumn, CircleCheck, Cpu, MoveUpRight, type LucideIcon } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { Fortschrittsbalken } from "../bausteine/Fortschrittsbalken";
import { MitInfo } from "../bausteine/InfoKnopf";
import {
  ANALYSESCHALTER,
  type Analyseschalter,
  type Variantenanalyse,
} from "./useVariantenanalyse";
import "../../stil/variantenanalyse.css";

const SYMBOL = 16;
const SYMBOL_KNOPF = 18;

/** Symbol je Schalter (wie im Bild A: Haken, Balken, Pfeil). */
const SCHALTERSYMBOL: Readonly<Record<Analyseschalter, LucideIcon>> = {
  symbole: CircleCheck,
  balken: ChartNoAxesColumn,
  pfeil: MoveUpRight,
};

/**
 * Fortschritt der laufenden Analyse mit „Abbrechen“; bei einem Fehler die Meldung; sonst nichts.
 * Beispiel: „Analyse 12 von 18 Stellungen“ mit Balken zu zwei Dritteln.
 */
export function Analysefortschritt({ analyse }: { analyse: Variantenanalyse }) {
  const { stand } = analyse;
  if (stand.art === "fehler") {
    return (
      <p className="fehlertext" role="alert">
        {t("varianten.analyse.fehler", { meldung: stand.meldung })}
      </p>
    );
  }
  if (stand.art !== "laeuft") return null;
  const text = t("varianten.analyse.fortschritt", {
    erledigt: stand.erledigt,
    gesamt: stand.gesamt,
  });
  return (
    <div className="analysefortschritt" data-testid="analysefortschritt" role="status">
      <Fortschrittsbalken
        anteil={{ erreicht: stand.erledigt, gesamt: stand.gesamt }}
        beschriftung={text}
      />
      <span className="analysefortschritt-text">{text}</span>
      <button type="button" className="knopf-link klein" onClick={analyse.brichAb}>
        {t("varianten.analyse.abbrechen")}
      </button>
    </div>
  );
}

/** Die drei Chips über dem Brett, sobald es Werte gibt; mit ⓘ. */
export function Analysechips({ analyse }: { analyse: Variantenanalyse }) {
  if (!analyse.sichtbar) return null;
  const chips = (
    <div
      className="analysechips"
      role="group"
      aria-label={t("varianten.analyse.schalter")}
      data-tour="variante-analysechips"
    >
      {ANALYSESCHALTER.map((s) => {
        const Symbol = SCHALTERSYMBOL[s];
        return (
          <button
            key={s}
            type="button"
            className="chip analysechip"
            aria-pressed={analyse.zeige[s]}
            data-testid={`analysechip-${s}`}
            onClick={() => analyse.schalte(s)}
          >
            <span className="chip-zeichen">
              <Symbol size={SYMBOL} aria-hidden="true" />
            </span>
            {t(`varianten.analyse.chip.${s}`)}
          </button>
        );
      })}
    </div>
  );
  return (
    <MitInfo
      zeile={chips}
      erklaerung={t("varianten.analyse.info")}
      thema={t("varianten.analyse.knopf")}
    />
  );
}

/**
 * Der Knopf „Analyse“ in der Knopfzeile: an (Analyse gewünscht) oder aus; während des Laufs mit
 * Zahl. Antippen schaltet: an startet die Analyse, aus bricht sie ab (Fertiges bleibt).
 */
export function Analyseknopf({ analyse, an }: { analyse: Variantenanalyse; an: boolean }) {
  const { stand } = analyse;
  const text =
    stand.art === "laeuft"
      ? t("varianten.analyse.laeuftKurz", { erledigt: stand.erledigt, gesamt: stand.gesamt })
      : t("varianten.analyse.knopf");
  return (
    <button
      type="button"
      className="knopf-zweit analyseknopf"
      aria-pressed={an}
      data-tour="variante-analyse"
      data-testid="analyseknopf"
      onClick={an ? analyse.brichAb : analyse.starte}
    >
      <Cpu
        size={SYMBOL_KNOPF}
        aria-hidden="true"
        className={stand.art === "laeuft" ? "dreht" : undefined}
      />{" "}
      {text}
    </button>
  );
}
