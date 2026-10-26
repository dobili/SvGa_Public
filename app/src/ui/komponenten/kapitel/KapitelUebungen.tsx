/**
 * Die Übungen eines Kapitels mit ihrem Stand und dem Einstieg zum Lösen (AP 13).
 *
 * Rolle im Gesamtbild: Teil der Karte „Training und Übungen“ im Kapitel-Bildschirm (seit
 * 0.2.80). Jede Übung öffnet den Bildschirm „Übung“; „Übungen lösen“ geht alle Übungen des
 * Kapitels der Reihe nach durch, die noch nicht gelösten zuerst. Der Stand kommt aus dem Fortschritt (speicher/format.ts, „uebungen“).
 * Abhängigkeiten: Navigation, Speicher, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import type { Uebungsverweis } from "../../../app/stapel";
import type { Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";

/**
 * Die Übungen eines Kapitels mit ihrem Stand; „Übungen lösen“ geht sie der Reihe nach durch, die
 * ungelösten zuerst.
 */
export function KapitelUebungen({ kapitel }: { kapitel: Kapitel }) {
  const { navigiere } = useNavigation();
  const staende = useSpeicher((z) => z.daten.fortschritt.uebungen);
  if (kapitel.uebungen.length === 0) return null;
  const verweis = (id: string): Uebungsverweis => ({ kapitel: kapitel.kapitel, id });
  const offen = kapitel.uebungen.filter((u) => !staende[u.id]?.geloest);
  const reihe = [...offen, ...kapitel.uebungen.filter((u) => staende[u.id]?.geloest)].map((u) =>
    verweis(u.id),
  );
  const erste = reihe[0];
  return (
    <div className="kapitel-uebungen" data-testid="kapitel-uebungen" data-tour="kapitel-uebungen">
      <h3 className="unterteil-titel">{t("kapitel.uebungen")}</h3>
      {erste && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => navigiere({ bildschirm: "uebung", ...erste, reihe })}
        >
          {t("kapitel.uebungenLoesen", { offen: offen.length, gesamt: kapitel.uebungen.length })}
        </button>
      )}
      {/* Seit 0.2.85 (Wunsch des Autors) ein Raster kleiner Nummern statt einer langen Liste:
          gelöst grün mit Haken, angefangen halb; der volle Name steht für Bildschirmleser da. */}
      <ul className="uebungsraster">
        {kapitel.uebungen.map((uebung) => {
          const stand = staende[uebung.id];
          const zustand = stand?.geloest ? "geloest" : stand ? "angefangen" : "offen";
          const name =
            t("uebung.titel", { nummer: uebung.nummer }) +
            (uebung.abbildungen[0]
              ? ` · ${t("abbildung.titel", { nummer: uebung.abbildungen[0] })}`
              : "");
          return (
            <li key={uebung.id}>
              <button
                type="button"
                className={`uebungsnummer uebungsnummer-${zustand}`}
                title={name}
                onClick={() => navigiere({ bildschirm: "uebung", ...verweis(uebung.id), reihe })}
              >
                <span aria-hidden="true">{uebung.nummer}</span>
                <span className="nur-vorlesen">
                  {name}
                  {stand?.geloest && ` ${t("kapitel.uebungGeloest")}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
