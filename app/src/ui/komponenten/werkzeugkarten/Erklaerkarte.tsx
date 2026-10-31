/**
 * Erklärkachel von „Zählen“ und „Ziehen“: wie man das Werkzeug am Brett bedient.
 *
 * Rolle im Gesamtbild: Sie erscheint, sobald Zählen oder Ziehen gewählt ist, und bleibt stehen,
 * bis man das Werkzeug abwählt. Der Autor wusste beim Handytest von AP 1 nicht, wie „Zählen“ zu
 * bedienen ist; daher die Kachel. Mit dem Haken „Nicht mehr anzeigen“ verschwindet sie dauerhaft
 * (useErklaerung.ts). Seit der Runde „Weniger Text“ (P8, 31.10.2026) ist die Kachel von „Zählen“
 * nur noch eine goldene Zeile: Hand und „Feld antippen“; Erklärung und Irrtumshinweis stehen
 * hinter dem Infoknopf. Weil sie nur eine Zeile ist, entfällt bei ihr der Haken.
 * Abhängigkeiten: useErklaerung.ts, bausteine/InfoKnopf.tsx, lucide-react, i18n.
 */
import { Pointer } from "lucide-react";
import { MitInfo } from "../bausteine/InfoKnopf";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Erklaerwerkzeug } from "./useErklaerung";

const TEXTE: Readonly<Record<Erklaerwerkzeug, readonly [Textschluessel, Textschluessel]>> = {
  zaehlen: ["werkzeug.k1-zaehlen.name", "werkzeug.k1-zaehlen.erklaerung"],
  ziehen: ["werkzeug.ziehen.name", "werkzeug.ziehen.erklaerung"],
};

const HANDGROESSE = 24;

/**
 * Die Zeile von „Zählen“: Hand und „Feld antippen“, dahinter die Erklärung (P8).
 * Beispiel: Abb. 1.26, Zählen gewählt → „👆 Feld antippen ⓘ“ über den Karten.
 */
function Zaehlzeile() {
  return (
    <section className="karte erklaerung tippzeile" data-testid="werkzeug-erklaerung">
      <MitInfo
        thema={t("werkzeug.k1-zaehlen.name")}
        zeile={
          <p className="tippzeile-text">
            <Pointer size={HANDGROESSE} aria-hidden="true" />
            <strong>{t("wenigertext.werkzeug.feldAntippen")}</strong>
          </p>
        }
        erklaerung={
          <>
            <p>{t("werkzeug.k1-zaehlen.erklaerung")}</p>
            <p className="hinweis">{t("werkzeug.irrtum")}</p>
          </>
        }
      />
    </section>
  );
}

/** Die Kachel mit Erklärung, Hinweis auf Irrtümer und dem Haken zum Ausblenden. */
export function Erklaerkarte({
  werkzeug,
  ausblenden,
}: {
  werkzeug: Erklaerwerkzeug;
  ausblenden: () => void;
}) {
  if (werkzeug === "zaehlen") return <Zaehlzeile />;
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
