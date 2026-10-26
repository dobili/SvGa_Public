/**
 * Bedenkzeit nach Zeitart geordnet: Je Zeitart eine Zeile mit dem Zeichen einmal groß und dem
 * Namen davor, daneben die Zeiten dieser Art zur Wahl (Wunsch des Autors, 26.10.2026, statt
 * vieler gleicher Kacheln mit je einem Zeichen).
 *
 * Rolle im Gesamtbild: Ersetzt seit 0.3.2 das Raster der Kacheln (DS41). Die Zeiten sind
 * Wahlknöpfe; „ohne Uhr“ (außerhalb der Grundstellung) steht als eigene Zeile. Für
 * Bildschirmleser bleibt es eine Gruppe von Optionsfeldern mit dem vollen Namen („Blitz 3 + 2“).
 * Abhängigkeiten: uhrwahl.ts, zeitartzeichen.ts, spiel/uhr.ts, spiel/elomodell.ts, Titelsymbol,
 * i18n, lucide-react.
 */
import { Infinity as Unendlich, type LucideIcon } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { wertungstempo } from "../../../spiel/elomodell";
import { UHR_VORGABEN } from "../../../spiel/uhr";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { ZEITARTZEICHEN } from "../bausteine/zeitartzeichen";
import { OHNE_UHR, uhrname } from "./uhrwahl";

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;
/** Größe des Zeichens der Zeitart, einmal je Zeile. */
const ZEICHENGROESSE = 26;

/** Eine Zeile der Wahl: Zeichen und Name der Zeitart, dazu die Zeiten (Stellen) dieser Art. */
interface Zeitzeile {
  readonly schluessel: string;
  readonly name: string;
  readonly Zeichen: LucideIcon;
  readonly stellen: string[];
}

/** Die Zeit einer Stelle: „3 + 2“; „ohne Uhr“ als Unendlichzeichen. */
function zeitVon(stelle: string): string {
  const vorgabe = UHR_VORGABEN[Number(stelle)];
  if (stelle === OHNE_UHR || !vorgabe) return "∞";
  return `${vorgabe.grundzeitMs / MINUTE_MS} + ${vorgabe.zuschlagMs / SEKUNDE_MS}`;
}

/** Ordnet die Stellen nach Zeitart in der Reihenfolge ihres ersten Auftretens. */
function zeilenVon(stellen: readonly string[]): Zeitzeile[] {
  const zeilen: Zeitzeile[] = [];
  for (const stelle of stellen) {
    const vorgabe = UHR_VORGABEN[Number(stelle)];
    const ohne = stelle === OHNE_UHR || !vorgabe;
    const tempo = ohne ? null : wertungstempo(vorgabe);
    const schluessel = tempo ?? OHNE_UHR;
    let zeile = zeilen.find((z) => z.schluessel === schluessel);
    if (!zeile) {
      zeile = {
        schluessel,
        name: tempo ? t(`spielstaerke.zeitklasse.${tempo}`) : t("spielen.uhr.ohne"),
        Zeichen: tempo ? ZEITARTZEICHEN[tempo] : Unendlich,
        stellen: [],
      };
      zeilen.push(zeile);
    }
    zeile.stellen.push(stelle);
  }
  return zeilen;
}

/**
 * Die Wahl der Bedenkzeit. Beispiel: Grundstellung → drei Zeilen (Blitz mit 3 + 0, 3 + 2 und
 * 5 + 3; Schnellschach mit 10 + 0 und 15 + 10; Klassisch mit 30 + 20 und 60 + 0), „10 + 0“
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
      <div className="zeitzeilen">
        {zeilenVon(stellen).map(({ schluessel, name, Zeichen, stellen: zeiten }) => (
          <div key={schluessel} className="zeitzeile">
            <span className="zeitart" aria-hidden="true">
              <Zeichen size={ZEICHENGROESSE} />
              <span>{name}</span>
            </span>
            <div className="zeitwahl">
              {zeiten.map((stelle) => (
                <button
                  key={stelle}
                  type="button"
                  role="radio"
                  aria-checked={stelle === gewaehlt}
                  aria-label={uhrname(stelle)}
                  className="zeitknopf"
                  onClick={() => beiWahl(stelle)}
                >
                  <span aria-hidden="true">{zeitVon(stelle)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
