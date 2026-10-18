/**
 * Die vorgefertigten Gegner als Porträtgitter in acht aufklappbaren Gruppen je Stufe, dazu die
 * Kachel eines Gegners und die Adresse seines Porträts.
 *
 * Rolle im Gesamtbild: Teil der Gegnerwahl (GegnerWahl.tsx). Seit 0.2.85 (Wunsch des Autors) sind
 * die Stufen aufklappbar, damit nicht immer alle 64 Porträts zu sehen sind; die App merkt sich auf
 * dem Gerät, welche Stufen offen waren (app/merker.ts, eine Bequemlichkeit, die verloren gehen
 * darf). Ohne Merker ist die Stufe des gewählten Gegners offen.
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts, app/merker.ts, lucide, i18n.
 */
import { ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { gegnerDerStufe } from "../../engine/gegner";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { offeneStufenAnfangs, portraet, STUFENNUMMERN } from "./gegnerportraet";

/** Merker der offenen Stufen, als Liste der Nummern („1,3“). */
const MERKER_OFFEN = "gegnerstufenOffen";
const PFEIL_GROESSE = 18;

/** Eine Kachel des Gitters: Porträt oder Zeichen, Name darunter; gewählt mit goldenem Rand. */
export function Kachel({
  name,
  gewaehlt,
  beiWahl,
  kinder,
}: {
  name: string;
  gewaehlt: boolean;
  beiWahl: () => void;
  kinder: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={gewaehlt}
      className="gegnerkachel"
      onClick={beiWahl}
    >
      {kinder}
      <span className="gegnerkachel-name">{name}</span>
    </button>
  );
}

/** Die vorgefertigten Gegner: je Stufe eine aufklappbare Gruppe mit acht Porträts. */
export function VorgefertigteGitter({
  bot,
  beiBot,
}: {
  bot: string | null;
  beiBot: (bot: string | null) => void;
}) {
  const [offen, setzeOffen] = useState(() => offeneStufenAnfangs(liesMerker(MERKER_OFFEN), bot));
  const umschalten = (nummer: number, jetztOffen: boolean) => {
    const neu = new Set(offen);
    if (jetztOffen) neu.add(nummer);
    else neu.delete(nummer);
    if (neu.size === offen.size && neu.has(nummer) === offen.has(nummer)) return;
    setzeOffen(neu);
    schreibeMerker(MERKER_OFFEN, [...neu].sort((a, b) => a - b).join(","));
  };
  return (
    <div role="radiogroup" aria-label={t("spielen.bot")}>
      {STUFENNUMMERN.map((nummer) => (
        <details
          key={nummer}
          className="gegnerstufe"
          open={offen.has(nummer)}
          onToggle={(e) => umschalten(nummer, e.currentTarget.open)}
        >
          <summary>
            <ChevronRight className="klappzeichen" size={PFEIL_GROESSE} aria-hidden="true" />
            <h4 className="gegnerstufe-titel">
              {t("spielen.bot.stufe", { nummer: String(nummer), name: t(stufe(nummer).name) })}
            </h4>
          </summary>
          <div className="gegnergitter">
            {gegnerDerStufe(nummer).map((g) => (
              <Kachel
                key={g.kennung}
                name={g.name}
                gewaehlt={bot === g.kennung}
                beiWahl={() => beiBot(g.kennung)}
                kinder={<img className="gegner-portraet" src={portraet(g.kennung)} alt="" />}
              />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
