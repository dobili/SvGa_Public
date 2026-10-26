/**
 * Erklärkachel von „Zählen“ und „Ziehen“: wie man das Werkzeug am Brett bedient.
 *
 * Rolle im Gesamtbild: Sie erscheint, sobald Zählen oder Ziehen gewählt ist, und bleibt stehen,
 * bis man das Werkzeug abwählt. Der Autor wusste beim Handytest von AP 1 nicht, wie „Zählen“ zu
 * bedienen ist; daher die Kachel. Mit dem Haken „Nicht mehr anzeigen“ verschwindet sie dauerhaft
 * (useErklaerung.ts).
 * Abhängigkeiten: useErklaerung.ts, i18n.
 */
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Erklaerwerkzeug } from "./useErklaerung";

const TEXTE: Readonly<Record<Erklaerwerkzeug, readonly [Textschluessel, Textschluessel]>> = {
  zaehlen: ["werkzeug.k1-zaehlen.name", "werkzeug.k1-zaehlen.erklaerung"],
  ziehen: ["werkzeug.ziehen.name", "werkzeug.ziehen.erklaerung"],
};

/** Die Kachel mit Erklärung, Hinweis auf Irrtümer und dem Haken zum Ausblenden. */
export function Erklaerkarte({
  werkzeug,
  ausblenden,
}: {
  werkzeug: Erklaerwerkzeug;
  ausblenden: () => void;
}) {
  const [name, erklaerung] = TEXTE[werkzeug];
  return (
    <section className="karte erklaerung" data-testid="werkzeug-erklaerung">
      <div className="karte-kopf">
        <h2>{t("werkzeug.erklaerungTitel", { werkzeug: t(name) })}</h2>
      </div>
      <p>{t(erklaerung)}</p>
      <p className="hinweis">{t("werkzeug.irrtum")}</p>
      <label className="haken-zeile">
        <input type="checkbox" onChange={(e) => e.target.checked && ausblenden()} />
        {t("werkzeug.erklaerungAus")}
      </label>
    </section>
  );
}
