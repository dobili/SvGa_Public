/**
 * Kleiner Umschalter „Lichess | chess.com | FIDE“ für die eigene Wertung (Wunsch des Autors,
 * 26.10.2026; Bereiche seit 0.3.2, FIDE seit 0.3.3), dazu die Form einer Zahl im Maßstab.
 *
 * Rolle im Gesamtbild: Sitzt in den Karten „Deine Wertung“ (Wertungskurve.tsx) und „Deine
 * Spielstärke“ (LetzteSpielstaerke.tsx); was umgerechnet wird, bestimmt wertungsmassstab.ts.
 * Abhängigkeiten: Segmentwahl, wertungsmassstab.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Segmentwahl } from "../bausteine/Segmentwahl";
import { WERTUNGSMASSSTAEBE, type Massstabzahl, type Wertungsmassstab } from "./wertungsmassstab";

/**
 * Die Segmentleiste mit den drei Maßstäben.
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

/**
 * Die Zahl im Maßstab („1424“, „1080–1300“, „–“); ein Bereich darf nach dem Strich umbrechen,
 * damit er in die schmalen Kacheln passt. Beispiel: <Massstabtext zahl={zahlImMassstab(…)} />.
 */
export function Massstabtext({ zahl }: { zahl: Massstabzahl }) {
  if (!zahl.bereich) return <>{zahl.zahl}</>;
  const [von, bis] = zahl.zahl.split("–");
  return (
    <>
      {von}–<wbr />
      {bis}
    </>
  );
}
