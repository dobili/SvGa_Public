/**
 * Kleiner Umschalter „Lichess | chess.com · FIDE“ für die eigene Wertung (Wunsch des Autors,
 * 26.10.2026).
 *
 * Rolle im Gesamtbild: Sitzt in den Einstellungen (Reiter „Anzeige“, seit dem Profil neu am
 * 31.10.2026 statt in der Karte „Deine Wertung“) und in der Karte „Deine Spielstärke“
 * (LetzteSpielstaerke.tsx); was umgerechnet wird, bestimmt wertungsmassstab.ts.
 * Abhängigkeiten: Segmentwahl, wertungsmassstab.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Segmentwahl } from "../bausteine/Segmentwahl";
import { WERTUNGSMASSSTAEBE, type Wertungsmassstab } from "./wertungsmassstab";

/**
 * Die Segmentleiste mit beiden Maßstäben.
 * Beispiel: <Massstabwahl massstab="lichess" beiWahl={setzeMassstab} />.
 */
export function Massstabwahl({
  massstab,
  beiWahl,
}: {
  massstab: Wertungsmassstab;
  beiWahl: (massstab: Wertungsmassstab) => void;
}) {
  return (
    <div className="massstabwahl" data-testid="massstabwahl">
      <Segmentwahl
        name={t("wertung.massstab.name")}
        werte={WERTUNGSMASSSTAEBE}
        gewaehlt={massstab}
        text={(m) => t(`wertung.massstab.${m}`)}
        beiWahl={beiWahl}
      />
    </div>
  );
}

/** Die Zahl groß mit dem Namen der Liste klein dahinter (nur wenn umgerechnet). */
export function Listenname({ liste }: { liste: string | null }) {
  return liste ? <span className="wertung-liste">{liste}</span> : null;
}
