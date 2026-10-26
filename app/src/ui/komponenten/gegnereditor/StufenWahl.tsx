/**
 * Drei Regler für die Stufe der Engine je Phase: Eröffnung, Mittelspiel, Endspiel.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026): „einen gerasterten Regler je Phase“. Die
 * Engine folgt der Phase der Stellung und wechselt Zug für Zug um höchstens eine Stufe
 * (usePartie.ts, stufeFuer). Jeder Regler zeigt Nummer und Namen der Stufe; seit 0.2.101 mit
 * Phasenzeichen (DS26) und der Nummer in der Stufenmarke (DS19).
 * Abhängigkeiten: engine/stufen.ts, spiel/phasen.ts (PHASEN), InfoKnopf, i18n.
 */
import { STUFEN, type Stufennummer } from "../../../engine/stufen";
import { t } from "../../../i18n/sprache";
import { PHASEN, type Phase } from "../../../spiel/phasen";
import { MitInfo } from "../bausteine/InfoKnopf";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { Phasenzeichen } from "../auswertung/Phasenzeichen";
import { Stufenmarke } from "../gegner/Stufenmarke";

const ERSTE = STUFEN[0]?.nummer ?? 1;
const LETZTE = STUFEN[STUFEN.length - 1]?.nummer ?? 8;

/** `praefix` macht die Kennungen eindeutig, wenn zwei Reglergruppen auf einer Seite stehen. */
export function StufenWahl({
  stufen,
  praefix = "stufe",
  beiWahl,
}: {
  stufen: Readonly<Record<Phase, Stufennummer>>;
  praefix?: string;
  beiWahl: (stufen: Readonly<Record<Phase, Stufennummer>>) => void;
}) {
  return (
    <div className="stufenwahl" role="group" aria-label={t("spielen.stufe")}>
      {/* Seit 0.2.137 steht der Satz zum Wechsel der Stufe hinter dem Fragezeichen (Wunsch des
          Autors: Erklärtexte stören, sobald man sie einmal gelesen hat). */}
      <MitInfo
        thema={t("spielen.stufe")}
        zeile={
          <span className="einstellung-name">
            <Titelsymbol art="stufe" />
            {t("spielen.stufe")}
          </span>
        }
        erklaerung={<p>{t("spielen.stufenHinweis")}</p>}
      />
      {PHASEN.map((ph) => {
        const id = `${praefix}-${ph}`;
        return (
          <div key={ph} className="stufenregler">
            <label htmlFor={id}>
              <Phasenzeichen phase={ph} />
              {t(`phase.name.${ph}`)}: <Stufenmarke stufe={stufen[ph]} klein />{" "}
              {/* Die Zahl steht in der Marke; für Bildschirmleser bleibt sie im Text (DS19). */}
              <span className="nur-vorlesen">{stufen[ph]} · </span>
              <strong>{t(`stufe.${stufen[ph]}`)}</strong>
            </label>
            <input
              id={id}
              type="range"
              min={ERSTE}
              max={LETZTE}
              step={1}
              value={stufen[ph]}
              onChange={(e) => beiWahl({ ...stufen, [ph]: Number(e.target.value) as Stufennummer })}
            />
          </div>
        );
      })}
    </div>
  );
}
