/**
 * Abschnitt „Absichtliche Fehler der Engine“: die allgemeine Abhakliste der Fehlerarten (0.2.60,
 * Rest aus Rückfrage S7). Seit 0.2.80 aufklappbar beim Spielen unter den Stufenreglern statt als
 * Karte in den Einstellungen (Wunsch des Autors); die Erklärung hinter einem Fragezeichen.
 *
 * Rolle im Gesamtbild: Die Engine-Stufen 1 bis 4 und die vorgefertigten Gegner machen absichtliche
 * Fehler typischer Art (engine/fehlersuche.ts). Hier legt der Leser fest, welche Arten überhaupt
 * erlaubt sind, etwa um eine Art zu üben, die er gerade im Buch gelesen hat, oder eine zu
 * verbieten, die ihn nicht weiterbringt. Eigene Gegner haben ihre eigene Liste (GegnerEditor.tsx)
 * und bleiben unberührt. Die Liste liegt in den Spielvorlieben (speicher/partien.ts) und greift
 * bei der nächsten neuen Partie (Spielen.tsx, `gegnerprofil`).
 * Abhängigkeiten: engine/fehlerart.ts, speicher/partien.ts, speicher/speicher.ts, InfoKnopf, i18n.
 */
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart";
import { t } from "../../i18n/sprache";
import { mitVorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { MitInfo } from "./InfoKnopf";

/** Schreibt die Abhakliste in die Spielvorlieben. */
function setzeErlaubte(erlaubt: readonly Fehlerart[]): void {
  void aendere((d) => ({
    ...d,
    spiel: mitVorlieben(d.spiel, { ...d.spiel.vorlieben, erlaubteFehlerarten: erlaubt }),
  }));
}

export function FehlerartenKarte() {
  const erlaubt = useSpeicher((z) => z.daten.spiel.vorlieben.erlaubteFehlerarten);
  const schalte = (art: Fehlerart, an: boolean) =>
    setzeErlaubte(
      an
        ? FEHLERARTEN.filter((a) => a === art || erlaubt.includes(a))
        : erlaubt.filter((a) => a !== art),
    );
  const stand = t("einstellungen.fehlerarten.stand", {
    anzahl: String(erlaubt.length),
    gesamt: String(FEHLERARTEN.length),
  });
  return (
    <details className="unterabschnitt" data-testid="fehlerarten-abhakliste">
      <summary>
        {t("einstellungen.fehlerarten.titel")} <span className="hinweis">({stand})</span>
      </summary>
      <MitInfo
        zeile={<p className="hinweis">{t("einstellungen.fehlerarten.kurz")}</p>}
        erklaerung={t("einstellungen.fehlerarten.hinweis")}
        thema={t("einstellungen.fehlerarten.titel")}
      />
      <fieldset className="fehlerartenwahl">
        <legend className="nur-vorlesen">{t("einstellungen.fehlerarten.titel")}</legend>
        {FEHLERARTEN.map((art) => (
          <label key={art} className="schalterzeile">
            <input
              type="checkbox"
              checked={erlaubt.includes(art)}
              onChange={(e) => schalte(art, e.target.checked)}
            />
            {t(`fehlerart.${art}`)}
          </label>
        ))}
      </fieldset>
      <div className="knopfreihe">
        <button type="button" className="knopf-zweit" onClick={() => setzeErlaubte(FEHLERARTEN)}>
          {t("einstellungen.fehlerarten.alle")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => setzeErlaubte([])}>
          {t("einstellungen.fehlerarten.keine")}
        </button>
      </div>
      <p className="hinweis" role="status">
        {stand}
      </p>
    </details>
  );
}
