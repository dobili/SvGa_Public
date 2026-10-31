/**
 * Karte „Fundstücke“ im Profil (Gamifizierung P10 b, PROFILKARTEN Rang 40): wie viele gefunden
 * sind und der Weg ins Album.
 *
 * Rolle im Gesamtbild: Sichtbar erst nach dem ersten Fund (album.ts, fundstueckeSichtbar).
 * Abhängigkeiten: training/fundstuecke.ts, speicher, app/navigationsKontext.ts, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { FUNDSTUECKE } from "../../../training/fundstuecke";
import { ALBUM, gefundeneAnzahl } from "./album";

/** Die Karte im Profil. */
export function FundstueckProfilkarte() {
  const { navigiere } = useNavigation();
  const gefunden = useSpeicher((z) => z.daten.fundstuecke);
  return (
    <section className="karte" data-testid="profilkarte-fundstuecke">
      <h2 className="karte-titel">{t("fundstueck.karte.titel")}</h2>
      <p>
        {t("fundstueck.album.stand", {
          anzahl: gefundeneAnzahl(gefunden),
          gesamt: FUNDSTUECKE.length,
        })}
      </p>
      <button
        type="button"
        className="knopf-zweit"
        onClick={() => navigiere({ bildschirm: "zusatz", kennung: ALBUM })}
      >
        {t("fundstueck.karte.oeffnen")}
      </button>
    </section>
  );
}
