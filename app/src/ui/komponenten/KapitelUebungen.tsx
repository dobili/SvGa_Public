/**
 * Die Übungen eines Kapitels mit ihrem Stand und dem Einstieg zum Lösen (AP 13).
 *
 * Rolle im Gesamtbild: Abschnitt im Kapitel-Bildschirm. Jede Übung öffnet den Bildschirm „Übung“;
 * „Übungen lösen“ geht alle Übungen des Kapitels der Reihe nach durch, die noch nicht gelösten
 * zuerst. Der Stand kommt aus dem Fortschritt (speicher/format.ts, „uebungen“).
 * Abhängigkeiten: Navigation, Speicher, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import type { Uebungsverweis } from "../../app/stapel";
import type { Kapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";

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
    <section className="abschnitt" data-testid="kapitel-uebungen">
      <h2 className="abschnitt-titel">{t("kapitel.uebungen")}</h2>
      {erste && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => navigiere({ bildschirm: "uebung", ...erste, reihe })}
        >
          {t("kapitel.uebungenLoesen", { offen: offen.length, gesamt: kapitel.uebungen.length })}
        </button>
      )}
      <ul className="uebungsliste">
        {kapitel.uebungen.map((uebung) => {
          const stand = staende[uebung.id];
          const zeichen = stand?.geloest ? "✓" : stand ? "◐" : "";
          return (
            <li key={uebung.id}>
              <button
                type="button"
                className="knopf-link links"
                onClick={() => navigiere({ bildschirm: "uebung", ...verweis(uebung.id), reihe })}
              >
                <span className="uebung-zeichen" aria-hidden="true">
                  {zeichen}
                </span>
                {t("uebung.titel", { nummer: uebung.nummer })}
                {uebung.abbildungen[0]
                  ? ` · ${t("abbildung.titel", { nummer: uebung.abbildungen[0] })}`
                  : ""}
                {stand?.geloest && (
                  <span className="nur-vorlesen"> {t("kapitel.uebungGeloest")}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
