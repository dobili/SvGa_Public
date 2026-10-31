/**
 * Beim ersten Start auf einem Gerät, das nicht auf Deutsch eingestellt ist: das Angebot, die App
 * auf Englisch zu nutzen, mit dem Hinweis auf die Beta-Phase.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026). Englisch ist eine Vorschau und wird beim
 * Start nicht von selbst gewählt (app/sprachwahl.ts, seit 0.2.104); wer kein Deutsch liest, fände
 * die Umstellung sonst nur in den Einstellungen. Die Frage kommt einmal je Gerät, nur ohne
 * gemerkte Sprachwahl und nur, wenn die erste Sprache des Geräts nicht Deutsch ist. Der Text steht
 * auf Englisch und Deutsch, denn wer ihn liest, versteht vielleicht noch kein Deutsch. Er liegt
 * über der Frage nach dem Rundgang, die danach in der gewählten Sprache erscheint.
 * Abhängigkeiten: app/sprachangebot.ts, app/sprachwahl.ts, app/merker.ts, i18n, tour/haltFokus.ts.
 */
import { useEffect, useId, useRef, useState } from "react";
import { t } from "../i18n/sprache";
import { haltFokus } from "../tour/haltFokus";
import { schreibeMerker } from "./merker";
import { MERKER_SPRACHANGEBOT, sprachangebotFaellig } from "./sprachangebot";
import { waehleSprache } from "./sprachwahl";

const ENGLISCH = "en";
const DEUTSCH = "de";

/** Das Fenster mit der Frage; nach der Antwort nie wieder. */
export function Sprachangebot() {
  const [offen, setzeOffen] = useState(sprachangebotFaellig);
  const [ohneNetz, setzeOhneNetz] = useState(false);
  const ja = useRef<HTMLButtonElement>(null);
  const titelId = useId();
  const textId = useId();
  useEffect(() => {
    if (offen) ja.current?.focus();
  }, [offen]);
  if (!offen) return null;
  const behalten = () => {
    schreibeMerker(MERKER_SPRACHANGEBOT, "gefragt");
    setzeOffen(false);
  };
  const englisch = async () => {
    schreibeMerker(MERKER_SPRACHANGEBOT, "gefragt");
    // Gelingt der Wechsel, baut die App sich neu auf (neuer Schlüssel), das Fenster verschwindet.
    if ((await waehleSprache(ENGLISCH)) === "ohneNetz") setzeOhneNetz(true);
  };
  return (
    <div className="tour-ebene tour-ebene-dunkel" data-testid="sprachangebot">
      <div className="tour-sperre" aria-hidden="true" />
      <div
        className="tour-karte tour-karte-mitte"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        aria-describedby={textId}
        lang={ENGLISCH}
        onKeyDown={(e) => {
          if (e.key === "Escape") behalten();
          else if (e.key === "Tab") haltFokus(e);
        }}
      >
        <h2 id={titelId} className="tour-titel">
          {t("sprachangebot.titel")}
        </h2>
        <div id={textId}>
          <p className="tour-text">{t("sprachangebot.englisch")}</p>
          <p className="tour-text" lang={DEUTSCH}>
            {t("sprachangebot.deutsch")}
          </p>
        </div>
        {ohneNetz && (
          <p className="fehlertext" data-testid="sprachangebot-ohne-netz">
            {t("sprachangebot.ohneNetz")}
          </p>
        )}
        <div className="tour-fuss">
          <button type="button" className="knopf-zweit" onClick={behalten}>
            {t(ohneNetz ? "sprachangebot.schliessen" : "sprachangebot.behalten")}
          </button>
          {!ohneNetz && (
            <button ref={ja} type="button" className="knopf-haupt" onClick={() => void englisch()}>
              {t("sprachangebot.wechseln")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
