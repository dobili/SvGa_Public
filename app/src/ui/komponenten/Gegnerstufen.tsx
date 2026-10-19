/**
 * Die vorgefertigten Gegner als Porträtgitter in acht aufklappbaren Gruppen je Stufe, dazu die
 * Kachel eines Gegners und die Adresse seines Porträts.
 *
 * Rolle im Gesamtbild: Teil der Gegnerwahl (GegnerWahl.tsx). Seit 0.2.85 (Wunsch des Autors) sind
 * die Stufen aufklappbar, damit nicht immer alle 64 Porträts zu sehen sind; die App merkt sich auf
 * dem Gerät, welche Stufen offen waren (app/merker.ts, eine Bequemlichkeit, die verloren gehen
 * darf). Ohne Merker ist die Stufe des gewählten Gegners offen. An Stufe und Kachel steht seit 0.2.85
 * die Elo-Zahl (engine/botstaerke.ts, Rückfrage S23). Seit 0.2.88 steht vor Stufe 1 die Gruppe
 * „Zum Spaß“ mit den Spaß-Bots (Wunsch des Autors). Seit 0.2.101 (Symbolsprache DS19) trägt jede
 * Stufenzeile eine farbige Marke, die ersten Porträts und die Zahl besiegter Bots.
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts, engine/botstaerke.ts, staerkeangabe.ts,
 * app/merker.ts, lucide, i18n.
 */
import { ChevronDown, Star } from "lucide-react";
import { useState, type ReactNode } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { staerkeAusStufen, staerkeDesBots } from "../../engine/botstaerke";
import { gegnerDerStufe, spassbots, type Gegner } from "../../engine/gegner";
import { stufe, type Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { GegnerBild } from "./GegnerBild";
import { offeneStufenAnfangs, portraet, SPASSGRUPPE, STUFENNUMMERN } from "./gegnerportraet";
import { bereichstext, spassbereichstext, staerketext } from "./staerkeangabe";
import { Stufenmarke } from "./Stufenmarke";

/** Merker der offenen Stufen, als Liste der Nummern („1,3“). */
const MERKER_OFFEN = "gegnerstufenOffen";
const PFEIL_GROESSE = 18;
/** Stern am Zähler besiegter Bots in der Stufenzeile (Bildpunkte). */
const STERN_GROESSE = 14;
/** So viele Porträts zeigt die zugeklappte Stufenzeile (DS19). */
const VORSCHAU_GESICHTER = 4;

/** Eine Kachel des Gitters: Porträt oder Zeichen, Name darunter; gewählt mit goldenem Rand. */
export function Kachel({
  name,
  staerke,
  gewaehlt,
  beiWahl,
  kinder,
}: {
  name: string;
  /** „etwa 1300“ (0.2.85); fehlt bei Kacheln ohne Messung. */
  staerke?: string;
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
      {staerke && <span className="gegnerkachel-staerke">{staerke}</span>}
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
  // Stern an Bots, die der Leser schon gewertet besiegt hat (0.2.99, Wunsch des Autors).
  const besiegt = useSpeicher((z) => z.daten.spiel.besiegt);
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
      {gruppen().map((gruppe) => (
        <details
          key={gruppe.schluessel}
          className="gegnerstufe"
          open={offen.has(gruppe.schluessel)}
          onToggle={(e) => umschalten(gruppe.schluessel, e.currentTarget.open)}
        >
          <summary>
            <Stufenmarke stufe={gruppe.stufe} />
            <h4 className="gegnerstufe-titel">
              <span className="gegnerstufe-kopf">{gruppe.kopf}</span>
              {gruppe.bereich && (
                <span className="gegnerstufe-bereich">
                  <span className="nur-vorlesen"> · </span>
                  {gruppe.bereich}
                </span>
              )}
            </h4>
            <Gruppenvorschau bots={gruppe.bots} besiegt={besiegt} />
            <ChevronDown className="aufklapper" size={PFEIL_GROESSE} aria-hidden="true" />
          </summary>
          <div className="gegnergitter">
            {gruppe.bots.map((g) => (
              <Kachel
                key={g.kennung}
                name={g.name}
                staerke={staerketext(
                  staerkeDesBots(g.kennung) ?? staerkeAusStufen(g.stufenJePhase),
                )}
                gewaehlt={bot === g.kennung}
                beiWahl={() => beiBot(g.kennung)}
                kinder={
                  <GegnerBild
                    bot={g.kennung}
                    eigene={[]}
                    name={g.name}
                    besiegt={besiegt.includes(g.kennung)}
                  />
                }
              />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

/**
 * Rechts in der Stufenzeile (DS19): die ersten Porträts übereinander, damit man die Gruppe auch
 * zugeklappt erkennt, und ein Stern mit der Zahl schon gewertet besiegter Bots.
 * Beispiel: Stufe 1, Lotta und Mia besiegt → vier kleine Gesichter und „★ 2/8“.
 */
function Gruppenvorschau({
  bots,
  besiegt,
}: {
  bots: readonly Gegner[];
  besiegt: readonly string[];
}) {
  const geschlagen = bots.filter((g) => besiegt.includes(g.kennung)).length;
  return (
    <span className="gegnerstufe-vorschau">
      <span className="gesichterreihe" aria-hidden="true">
        {bots.slice(0, VORSCHAU_GESICHTER).map((g) => (
          <img key={g.kennung} src={portraet(g.kennung)} alt="" />
        ))}
      </span>
      {geschlagen > 0 && (
        <span className="gegnerstufe-besiegt">
          <Star size={STERN_GROESSE} aria-hidden="true" />
          <span aria-hidden="true">
            {geschlagen}/{bots.length}
          </span>
          <span className="nur-vorlesen">
            {t("spielen.bot.besiegtZahl", {
              anzahl: String(geschlagen),
              gesamt: String(bots.length),
            })}
          </span>
        </span>
      )}
    </span>
  );
}

/** Eine aufklappbare Gruppe: Schlüssel für den Merker, Marke, Überschrift in zwei Teilen, Bots. */
interface Gruppe {
  readonly schluessel: number;
  /** Stufe für die farbige Marke; null für „Zum Spaß“. */
  readonly stufe: Stufennummer | null;
  /** „Stufe 1 · Einsteiger“ */
  readonly kopf: string;
  /** „etwa 1050 bis 1300“; leer ohne Messung. */
  readonly bereich: string;
  readonly bots: readonly Gegner[];
}

/** Schwächster Bot zuerst (Wunsch des Autors, 19.10.2026); ohne Messung zählt die Schätzung. */
function nachStaerke(bots: readonly Gegner[]): Gegner[] {
  const zahl = (g: Gegner) => staerkeDesBots(g.kennung) ?? staerkeAusStufen(g.stufenJePhase);
  return [...bots].sort((a, b) => zahl(a) - zahl(b));
}

/**
 * Die Gruppen der Gegnerwahl: zuerst „Zum Spaß“ (die Spaß-Bots, 0.2.88, Wunsch des Autors), dann
 * die acht Stufen. Beispiel (seit 0.2.103): „Zum Spaß“ mit „unter 400 bis etwa 850“, „Stufe 1 ·
 * Einsteiger“ mit „etwa 850 bis 1100“.
 */
function gruppen(): Gruppe[] {
  const stufen = STUFENNUMMERN.map((nummer) => ({
    schluessel: nummer,
    stufe: nummer,
    kopf: t("spielen.bot.stufeKopf", { nummer: String(nummer), name: t(stufe(nummer).name) }),
    bereich: bereichstext(nummer),
    bots: nachStaerke(gegnerDerStufe(nummer)),
  }));
  const spass = nachStaerke(spassbots());
  if (spass.length === 0) return stufen;
  const kopf = t("spielen.bot.spassKopf");
  const bereich = spassbereichstext();
  return [{ schluessel: SPASSGRUPPE, stufe: null, kopf, bereich, bots: spass }, ...stufen];
}
