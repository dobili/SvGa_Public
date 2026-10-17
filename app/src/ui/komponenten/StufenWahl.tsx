/**
 * Drei Regler für die Stufe der Engine je Phase: Eröffnung, Mittelspiel, Endspiel.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026): „einen gerasterten Regler je Phase“. Die
 * Engine folgt der Phase der Stellung und wechselt Zug für Zug um höchstens eine Stufe
 * (usePartie.ts, stufeFuer). Jeder Regler zeigt Nummer und Namen der Stufe.
 * Abhängigkeiten: engine/stufen.ts, spiel/phasen.ts (PHASEN), i18n.
 */
import { STUFEN, type Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { PHASEN, type Phase } from "../../spiel/phasen";

const ERSTE = STUFEN[0]?.nummer ?? 1;
const LETZTE = STUFEN[STUFEN.length - 1]?.nummer ?? 8;

/** „3 · Fortgeschrittener Anfänger“ */
function stufentext(nummer: Stufennummer): string {
  return `${nummer} · ${t(`stufe.${nummer}`)}`;
}

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
      <span className="einstellung-name">{t("spielen.stufe")}</span>
      {PHASEN.map((ph) => {
        const id = `${praefix}-${ph}`;
        return (
          <div key={ph} className="stufenregler">
            <label htmlFor={id}>
              {t(`phase.name.${ph}`)}: <strong>{stufentext(stufen[ph])}</strong>
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
      <p className="hinweis">{t("spielen.stufenHinweis")}</p>
    </div>
  );
}
