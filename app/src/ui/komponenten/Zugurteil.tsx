/**
 * Anzeige des Urteils über den letzten Zug in der Engine-Karte (seit 0.2.31).
 *
 * Rolle im Gesamtbild: Teil der Engine-Karte. Sagt in einem Satz, wie gut der zuletzt gespielte
 * Zug war, mit Zeichen und Verlust in Bauerneinheiten, und nennt den besten Zug der Engine.
 * Abhängigkeiten: engine/letzterzug.ts, spiel/zuege.ts, schach/notation.ts, i18n.
 */
import type { LetzterZug, LetzterZugUrteil } from "../../engine/letzterzug";
import { sprache, t } from "../../i18n/sprache";
import { zugfolgeAlsText } from "../../schach/notation";
import { regelstellung } from "../../spiel/zuege";
import type { Urteilstand } from "./useZugurteil";

/** Unter diesem Verlust (gerundet 0,0) gilt ein Zug als so gut wie der beste. */
const GLEICHWERTIG_UNTER = 0.05;

/** Verlust mit einer Nachkommastelle und deutschem Komma. */
function bauern(verlust: number): string {
  return verlust.toFixed(1).replace(".", ",");
}

/** Ein Zug in der Stellung vor dem letzten Zug als Text mit Nummer, etwa „5... Db6“. */
function zugtext(vorherFen: string, uci: string): string {
  const pos = regelstellung(vorherFen);
  return pos ? zugfolgeAlsText(pos, [uci], sprache(), 1) : uci;
}

/** Der Satz zum Urteil. Beispiel: „6. Ld3?! kostet etwa 0,7 Bauerneinheiten. Besser: 6. a3.“ */
function satz(urteil: LetzterZugUrteil, letzterZug: LetzterZug): string {
  const zug = zugtext(letzterZug.vorherFen, letzterZug.uci);
  const bester = urteil.besterZug ? zugtext(letzterZug.vorherFen, urteil.besterZug) : "";
  if (urteil.zeichen === "!") return t("engine.urteil.einziger", { zug });
  if (urteil.warBester) return t("engine.urteil.bester", { zug });
  if (urteil.verlust < GLEICHWERTIG_UNTER) return t("engine.urteil.gleich", { zug, bester });
  if (urteil.zeichen === null)
    return t("engine.urteil.gut", { zug, verlust: bauern(urteil.verlust), bester });
  return t("engine.urteil.verlust", {
    zug,
    zeichen: urteil.zeichen,
    verlust: bauern(urteil.verlust),
    bester,
  });
}

/** Der Stand des Urteils: rechnet, Satz, Fehler oder (ausgeschaltet) nichts. */
export function Urteil({ stand, letzterZug }: { stand: Urteilstand; letzterZug: LetzterZug }) {
  if (stand.art === "aus") return null;
  if (stand.art === "rechnet")
    return (
      <p className="lade">
        <span className="ladepunkt" aria-hidden="true" /> {t("engine.urteil.rechnet")}
      </p>
    );
  if (stand.art === "fehler")
    return <p className="fehlertext">{t("engine.fehler", { fehler: stand.meldung })}</p>;
  return (
    <p className="engine-urteil" data-testid="engine-urteil">
      {stand.urteil ? satz(stand.urteil, letzterZug) : t("engine.urteil.keins")}
    </p>
  );
}
