/**
 * Gewählter Titel unter dem Namen im Profil (Gamifizierung P3 mit P7), etwa „Taktiker“.
 *
 * Rolle im Gesamtbild: Titel sind Extras der Art „titel“ (training/extras.ts), freigeschaltet über
 * die Meisterschaft und gewählt in der Profilkarte „Deine Extras“. Die Wahl ist ein Merker auf
 * dem Gerät (extrawahl.ts). Ohne Wahl oder mit unbekanntem Wert steht nichts. Nie wegnehmen (E8):
 * Ein gewählter Titel bleibt sichtbar, auch wenn seine Bedingung gerade nicht erfüllt ist.
 * Abhängigkeiten: training/extras.ts, extras/extrawahl.ts, i18n, Stil in ui/stil/themen.css.
 */
import { istTextschluessel, t } from "../../../i18n/sprache";
import { extraZu } from "../../../training/extras";
import "../../stil/themen.css";
import { useProfiltitel } from "../extras/extrawahl";

/** Die Zeile; ohne Titel nichts. */
export function Titelzeile() {
  const wert = useProfiltitel();
  const schluessel = `themen.titel.${wert}`;
  if (!extraZu("titel", wert) || !istTextschluessel(schluessel)) return null;
  return (
    <span className="profiltitel" data-testid="profiltitel">
      {t(schluessel)}
    </span>
  );
}
