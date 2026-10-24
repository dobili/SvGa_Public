/**
 * Hinweis beim ersten Start: Kleiner Rundgang? Einmal je Gerät, mit „Rundgang starten“ und
 * „Später“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors R52 (23.10.2026): Beim ersten Start weist die App einmal
 * auf das Toursymbol hin und fragt nach einem Rundgang; sonst laufen Touren nur auf Wunsch. Die
 * Frage liegt unter der Startanimation und ist nach ihr zu sehen. Sie kommt nicht, wenn das
 * Symbol in den Einstellungen aus ist oder die App über einen Sprung geöffnet wurde (etwa
 * „#abb-6.20“ von den Trainingsseiten der Website): Dann erst beim nächsten normalen Start.
 * Gleich, wie die Antwort ausfällt, merkt sich das Gerät, dass gefragt wurde (tourMerker.ts).
 * Abhängigkeiten: tourMerker.ts, tourStand.ts, Navigation, i18n, lucide-react.
 */
import { Compass } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigation } from "../app/navigationsKontext";
import { t } from "../i18n/sprache";
import { haltFokus } from "./haltFokus";
import { merkeAngeboten, useTourMerker } from "./tourMerker";
import { starteTour } from "./tourStand";

const SYMBOLGROESSE = 28;

/** Die Frage nach dem Rundgang, solange sie offen ist. */
export function TourAngebot() {
  const merker = useTourMerker();
  const { ansicht } = useNavigation();
  // Schon beim ersten Zeichnen lesen: Die Hülle entfernt einen Sprung gleich danach aus der Adresse.
  const [ohneSprung] = useState(() => window.location.hash === "");
  const ja = useRef<HTMLButtonElement>(null);
  const titelId = useId();
  const textId = useId();
  const offen = ohneSprung && !merker.angeboten && merker.symbolAn && ansicht.bildschirm === "buch";
  useEffect(() => {
    if (offen) ja.current?.focus();
  }, [offen]);
  if (!offen) return null;
  return (
    <div className="tour-ebene tour-ebene-dunkel" data-testid="tour-angebot">
      <div className="tour-sperre" aria-hidden="true" />
      <div
        className="tour-karte tour-karte-mitte"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        aria-describedby={textId}
        onKeyDown={(e) => {
          if (e.key === "Escape") merkeAngeboten();
          else if (e.key === "Tab") haltFokus(e);
        }}
      >
        <div className="tour-kopf">
          <Compass size={SYMBOLGROESSE} aria-hidden="true" className="tour-angebot-symbol" />
          <h2 id={titelId} className="tour-titel">
            {t("tour.angebot.titel")}
          </h2>
        </div>
        <p id={textId} className="tour-text">
          {t("tour.angebot.text")}
        </p>
        <div className="tour-fuss">
          <button type="button" className="knopf-zweit" onClick={merkeAngeboten}>
            {t("tour.angebot.spaeter")}
          </button>
          <button
            ref={ja}
            type="button"
            className="knopf-haupt"
            onClick={() => {
              merkeAngeboten();
              starteTour("haupt");
            }}
          >
            {t("tour.angebot.ja")}
          </button>
        </div>
      </div>
    </div>
  );
}
