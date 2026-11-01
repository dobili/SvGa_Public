/**
 * Impressum, Datenschutz und Lizenzen aller Bausteine (Konzept 2 und 10.1).
 *
 * Rolle im Gesamtbild: Die GPL verlangt den Hinweis auf die Lizenz und den Quellcode; die
 * Figurenschrift SkakNew (LPPL) und die Schriften (OFL) verlangen Namensnennung.
 * Impressum und Datenschutz stehen als statische Seiten neben der Startseite des Buches
 * (/impressum/, /datenschutz/); hier nur die Verweise.
 * Alle Texte dieser Seite stehen in der Sprachdatei, damit es sie auch englisch gibt (AP 18).
 * Die Liste der Bausteine steht in lizenzbausteine.ts.
 * Abhängigkeiten: Kopfzeile, i18n, lizenzbausteine.ts.
 */
import { t, type Textschluessel } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { BAUSTEINE, type Lizenzbaustein } from "./lizenzbausteine";

/** Ein Text eines Bausteins: Name, Lizenz oder Herkunft. */
function bausteintext(baustein: Lizenzbaustein, feld: "name" | "lizenz" | "herkunft"): string {
  const schluessel = baustein.extra
    ? `extras.lizenz.${baustein.kennung}.${feld}`
    : `lizenzen.${baustein.kennung}.${feld}`;
  return t(schluessel as Textschluessel);
}

/** Die Seite mit Impressum, Datenschutz und den Lizenzen aller Bausteine der App. */
export function Lizenzen({ beiZurueck }: { beiZurueck?: () => void }) {
  return (
    <div className="bildschirm">
      <Kopfzeile
        titel={t("lizenzen.titel")}
        zurueckText={t("lizenzen.zurueck")}
        beiZurueck={beiZurueck}
      />
      <section className="karte">
        <h2 className="karte-titel">{t("lizenzen.rechtliches")}</h2>
        <p>
          <a href="/impressum/">{t("lizenzen.impressum")}</a> ·{" "}
          <a href="/datenschutz/">{t("lizenzen.datenschutz")}</a>
        </p>
      </section>
      <section className="karte">
        <h2 className="karte-titel">{t("lizenzen.titel")}</h2>
        <ul className="lizenzliste">
          {BAUSTEINE.map((baustein) => (
            <li key={baustein.kennung}>
              <strong>{bausteintext(baustein, "name")}</strong>
              <br />
              {bausteintext(baustein, "lizenz")} ·{" "}
              {baustein.quelle ? (
                <a href={baustein.quelle} target="_blank" rel="noreferrer">
                  {bausteintext(baustein, "herkunft")}
                </a>
              ) : (
                bausteintext(baustein, "herkunft")
              )}
              {baustein.text && (
                <>
                  {" · "}
                  <a href={baustein.text} target="_blank" rel="noreferrer">
                    {t("lizenzen.lizenztext")}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
