/**
 * Seite „Bots und Wertung“: das Maia-Zusatzpaket und der Maßstab der eigenen Wertung.
 *
 * Rolle im Gesamtbild: Bis 0.3.31 hatten die Bots einen eigenen Reiter und der Maßstab stand im
 * Reiter „Anzeige“. Seit dem Entwurf K2 (Wahl des Autors, 31.10.2026) stehen beide auf einer Seite
 * hinter der Zeile „Bots und Wertung“ (einstellungsseiten.ts), wie im Entwurf zusammengefasst.
 * Abhängigkeiten: MaiaWahl, fortschritt/Massstabwahl, fortschritt/wertungsmassstab, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Massstabwahl } from "../fortschritt/Massstabwahl";
import { useWertungsmassstab } from "../fortschritt/wertungsmassstab";
import { MaiaWahl } from "./MaiaWahl";

/** Maia laden, schalten, löschen; darunter der Maßstab der Wertung (Profil neu, 31.10.2026). */
export function BotsUndWertung() {
  const [massstab, setzeMassstab] = useWertungsmassstab();
  return (
    <>
      <section className="karte">
        <MaiaWahl />
      </section>
      <section className="karte">
        <h2 className="einstellung-name">{t("wertung.massstab.name")}</h2>
        <Massstabwahl massstab={massstab} beiWahl={setzeMassstab} />
        <p className="hinweis">{t("profil.wertung.massstabHinweis")}</p>
      </section>
    </>
  );
}
