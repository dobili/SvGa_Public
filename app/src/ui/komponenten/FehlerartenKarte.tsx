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
 * Seit 0.2.82 (Wunsch des Autors) daneben „Blinde Flecken der Engine“ für die eigene Stufe, wie
 * bei den eigenen Gegnern (GegnerEditor.tsx), gespeichert in den Spielvorlieben.
 * Seit 0.2.126 bekommen beide Karten Wert und Änderung vom Spielbildschirm (EigeneStufe.tsx).
 * Vorher schrieben sie selbst in den Speicher, und der Bildschirm überschrieb die Änderung beim
 * Partiebeginn mit seiner älteren Kopie der Vorlieben; die Partie spielte dann mit dem alten Stand.
 * Abhängigkeiten: engine/fehlerart.ts, engine/blindeFlecken.ts, InfoKnopf, i18n.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart";
import { t } from "../../i18n/sprache";
import { MitInfo } from "./InfoKnopf";

/** Die Abhakliste der eigenen Stufe; `setzeErlaubte` schreibt sie in die Vorlieben des Bildschirms. */
export function FehlerartenKarte({
  erlaubt,
  setzeErlaubte,
}: {
  erlaubt: readonly Fehlerart[];
  setzeErlaubte: (erlaubt: readonly Fehlerart[]) => void;
}) {
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

/**
 * Abschnitt „Blinde Flecken der Engine“ für die eigene Stufe: Zugarten, die die Engine oft nicht
 * sieht (engine/blindeFlecken.ts). Vorgabe keine; der Stand steht in der Überschrift.
 * Beispiel: „Rückzüge“ angehakt → die Engine übersieht oft, dass ein Rückzug der beste Zug ist.
 */
export function BlindeFleckenKarte({
  flecken,
  setzeFlecken,
}: {
  flecken: readonly BlinderFleck[];
  setzeFlecken: (flecken: readonly BlinderFleck[]) => void;
}) {
  const schalte = (fleck: BlinderFleck, an: boolean) =>
    setzeFlecken(
      an
        ? BLINDE_FLECKEN.filter((f) => f === fleck || flecken.includes(f))
        : flecken.filter((f) => f !== fleck),
    );
  const stand = t("spielen.flecken.stand", { anzahl: String(flecken.length) });
  return (
    <details className="unterabschnitt" data-testid="blinde-flecken">
      <summary>
        {t("spielen.flecken.titel")} <span className="hinweis">({stand})</span>
      </summary>
      <MitInfo
        zeile={<p className="hinweis">{t("spielen.flecken.kurz")}</p>}
        erklaerung={t("spielen.eigene.blindeFleckenHinweis")}
        thema={t("spielen.flecken.titel")}
      />
      <fieldset className="fehlerartenwahl">
        <legend className="nur-vorlesen">{t("spielen.flecken.titel")}</legend>
        {BLINDE_FLECKEN.map((fleck) => (
          <label key={fleck} className="schalterzeile">
            <input
              type="checkbox"
              checked={flecken.includes(fleck)}
              onChange={(e) => schalte(fleck, e.target.checked)}
            />
            {t(`blind.${fleck}`)}
          </label>
        ))}
      </fieldset>
    </details>
  );
}
