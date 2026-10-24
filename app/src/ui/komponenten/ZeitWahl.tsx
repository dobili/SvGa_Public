/**
 * Bedenkzeit als Raster gleich großer Kacheln: groß die Zeit mit dem Zeichen der Zeitklasse,
 * klein darunter ihr Name (seit 0.2.129, Vorschlag DS41, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Ersetzt auf dem Bildschirm Spielen die Chips unterschiedlicher Breite
 * („Schnellschach 15 + 10“ war doppelt so breit wie „Blitz 3 + 0“) auf drei Zeilen. Vier Kacheln je
 * Zeile wie bei Lichess; außerhalb der Grundstellung kommt „ohne Uhr“ dazu (uhrwahl.ts). Für
 * Bildschirmleser eine Gruppe von Optionsfeldern mit dem vollen Namen („Blitz 3 + 2“).
 * Abhängigkeiten: uhrwahl.ts, spiel/uhr.ts, spiel/elomodell.ts, Titelsymbol, i18n, lucide-react.
 */
import { Coffee, Infinity as Unendlich, Timer, Zap, type LucideIcon } from "lucide-react";
import { t } from "../../i18n/sprache";
import { wertungstempo, type Wertungstempo } from "../../spiel/elomodell";
import { UHR_VORGABEN } from "../../spiel/uhr";
import { Titelsymbol } from "./Titelsymbol";
import { OHNE_UHR, uhrname } from "./uhrwahl";
import { zeitklassenname } from "./wertungstext";

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;
const ZEICHENGROESSE = 13;

const KLASSENZEICHEN: Readonly<Record<Wertungstempo, LucideIcon>> = {
  blitz: Zap,
  rapid: Timer,
  classical: Coffee,
};

/** Zeit und Klasse einer Stelle: „3 + 2“ und „Blitz“; „ohne Uhr“ ohne Klasse. */
function kachelVon(stelle: string): { zeit: string; klasse: string; Zeichen: LucideIcon } {
  const vorgabe = UHR_VORGABEN[Number(stelle)];
  if (stelle === OHNE_UHR || !vorgabe) {
    return { zeit: "∞", klasse: t("spielen.uhr.ohne"), Zeichen: Unendlich };
  }
  const tempo = wertungstempo(vorgabe);
  return {
    zeit: `${vorgabe.grundzeitMs / MINUTE_MS} + ${vorgabe.zuschlagMs / SEKUNDE_MS}`,
    klasse: zeitklassenname(tempo),
    Zeichen: KLASSENZEICHEN[tempo],
  };
}

/**
 * Das Raster der Bedenkzeiten. Beispiel: Grundstellung → sieben Kacheln, „10 + 0 Schnellschach“
 * gewählt.
 */
export function ZeitWahl({
  stellen,
  gewaehlt,
  beiWahl,
}: {
  stellen: readonly string[];
  gewaehlt: string;
  beiWahl: (stelle: string) => void;
}) {
  return (
    <div className="einstellung-auswahl" role="radiogroup" aria-label={t("spielen.uhr")}>
      <span className="einstellung-name">
        <Titelsymbol art="bedenkzeit" />
        {t("spielen.uhr")}
      </span>
      <div className="zeitraster">
        {stellen.map((stelle) => {
          const { zeit, klasse, Zeichen } = kachelVon(stelle);
          return (
            <button
              key={stelle}
              type="button"
              role="radio"
              aria-checked={stelle === gewaehlt}
              aria-label={uhrname(stelle)}
              className="zeitkachel"
              onClick={() => beiWahl(stelle)}
            >
              <strong aria-hidden="true">
                <Zeichen size={ZEICHENGROESSE} />
                {zeit}
              </strong>
              <span aria-hidden="true">{klasse}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
