/**
 * Karten des Monatsrückblicks (Gamifizierung P12): Startkarte „Dein Oktober ist fertig“
 * (STARTKARTEN), Profilkarte „Rückblicke“ mit den älteren Monaten (PROFILKARTEN) und die Probe
 * auf der Aufgabenseite des Autors.
 *
 * Rolle im Gesamtbild: Alle drei öffnen den Bildschirm „rueckblick“ (app/zusatzansichten.ts) mit
 * dem Monat als Wert. Die Probe öffnet den laufenden Monat, damit der Autor den Rückblick auch
 * außerhalb der ersten sieben Tage eines Monats prüfen kann; sie ändert keine Daten.
 * Abhängigkeiten: training/rueckblick.ts, monatstext.ts, Navigation, Speicher, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { monatVon, rueckblickMonate, vormonat, type Monat } from "../../../training/rueckblick";
import { RUECKBLICK_ANSICHT } from "./rueckblickwerte";
import { monatMitJahr, monatsname } from "./monatstext";

/** Öffnet den Rückblick eines Monats. */
function useOeffneRueckblick(): (monat: Monat) => void {
  const { navigiere } = useNavigation();
  return (monat) =>
    navigiere({ bildschirm: "zusatz", kennung: RUECKBLICK_ANSICHT, wert: monat.schluessel });
}

/** Die Startkarte im Buch, in den ersten sieben Tagen eines Monats. */
export function RueckblickStartkarte() {
  const oeffne = useOeffneRueckblick();
  const monat = vormonat(monatVon(new Date()));
  const name = monatsname(monat);
  return (
    <section className="karte rueckblick-karte" data-testid="rueckblick-karte">
      <h2 className="karte-titel">{t("rueckblick.karte.titel", { monat: name })}</h2>
      <p>{t("rueckblick.karte.text", { monat: name })}</p>
      <button type="button" className="knopf-haupt" onClick={() => oeffne(monat)}>
        {t("rueckblick.karte.knopf")}
      </button>
    </section>
  );
}

/** Die Profilkarte mit einem Knopf je Monat, der jüngste zuerst. */
export function RueckblickProfilkarte() {
  const oeffne = useOeffneRueckblick();
  const aktivitaet = useSpeicher((z) => z.daten.aktivitaet);
  const monate = rueckblickMonate(aktivitaet, new Date());
  return (
    <section className="karte" data-testid="rueckblicke">
      <h2 className="karte-titel">{t("rueckblick.profil.titel")}</h2>
      <p className="hinweis">{t("rueckblick.profil.einleitung")}</p>
      <ul className="rueckblick-monate">
        {monate.map((monat) => (
          <li key={monat.schluessel}>
            <button type="button" className="knopf-zweit" onClick={() => oeffne(monat)}>
              {monatMitJahr(monat)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Probe für den Autor (Aufgabenseite): öffnet den Rückblick des laufenden Monats. */
export function RueckblickProbe() {
  const oeffne = useOeffneRueckblick();
  return (
    <details className="karte anleitung" data-testid="rueckblick-probe">
      <summary>{t("rueckblick.probe.titel")}</summary>
      <p className="hinweis">{t("rueckblick.probe.erklaerung")}</p>
      <button type="button" className="knopf-zweit" onClick={() => oeffne(monatVon(new Date()))}>
        {t("rueckblick.probe.knopf")}
      </button>
    </details>
  );
}
