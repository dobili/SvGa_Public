/**
 * Album der Fundstücke (Gamifizierung P10 b), Bildschirm „fundstuecke“ in der Ansicht „zusatz“
 * (app/zusatzansichten.ts): alle Fundstücke in fester Reihenfolge, gefundene als Karte, die
 * übrigen als nummerierte Lücke.
 *
 * Rolle im Gesamtbild: Sammlung zum Durchblättern; geöffnet aus der Profilkarte und aus der
 * Meldung am Rundenende. Lücken verraten keinen Inhalt, nur dass es noch mehr gibt.
 * Abhängigkeiten: training/fundstuecke.ts, Fundstueckkarte, Kopfzeile, speicher, i18n.
 */
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { FUNDSTUECKE } from "../../../training/fundstuecke";
import { Kopfzeile } from "../rahmen/Kopfzeile";
import { gefundeneAnzahl } from "./album";
import { Fundstueckkarte } from "./Fundstueckkarte";

/** Das Album; den Wert der Ansicht braucht es nicht. */
export function Fundstueckalbum() {
  const gefunden = useSpeicher((z) => z.daten.fundstuecke);
  const schon = new Set(gefunden);
  return (
    <div className="bildschirm" data-testid="fundstueckalbum">
      <Kopfzeile titel={t("fundstueck.album.titel")} zurueckText={t("fundstueck.album.zurueck")} />
      <p>
        {t("fundstueck.album.stand", {
          anzahl: gefundeneAnzahl(gefunden),
          gesamt: FUNDSTUECKE.length,
        })}
      </p>
      <p className="hinweis">{t("fundstueck.album.erklaerung")}</p>
      <ol className="fundstueck-album">
        {FUNDSTUECKE.map((fund, i) => (
          <li key={fund.kennung}>
            {schon.has(fund.kennung) ? (
              <Fundstueckkarte fund={fund} />
            ) : (
              <div className="fundstueck fundstueck-luecke">
                <p className="fundstueck-zeile">
                  {t("fundstueck.album.nummer", { nummer: i + 1 })}
                </p>
                <p className="fundstueck-text">{t("fundstueck.album.luecke")}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
