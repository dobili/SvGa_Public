/**
 * Das Toursymbol oben rechts: ein kleiner Kompass ohne Beschriftung, der die Tour des gezeigten
 * Bildschirms startet.
 *
 * Rolle im Gesamtbild: Wunsch des Autors R52 (23.10.2026). Das Symbol steht in der Kopfzeile jedes
 * Bildschirms im Stapel (Kopfzeile.tsx) und im Seitenkopf der Bereiche (Buch, Training,
 * Nachschlagen, Einstellungen). Es erscheint nur, wenn es zum Bildschirm eine Tour gibt und es in
 * den Einstellungen nicht ausgeschaltet ist. Solange die Tour ungesehen ist, trägt es einen kleinen
 * goldenen Punkt. Der Kompass, weil das Fragezeichen schon die Erklärungen hinter „?“ öffnet.
 * Abhängigkeiten: Navigation, touren.ts, tourStand.ts, tourMerker.ts, i18n, lucide-react.
 */
import { Compass } from "lucide-react";
import { useNavigation } from "../app/navigationsKontext";
import { t } from "../i18n/sprache";
import { useTourMerker } from "./tourMerker";
import { starteTour } from "./tourStand";
import { tourFuerAnsicht, type TourKennung } from "./touren";

const SYMBOLGROESSE = 22;
const STRICHSTAERKE = 1.8;

/** Die Tour zum gezeigten Bildschirm, wenn das Symbol erscheinen soll, und ob sie ungesehen ist. */
function useSymbolstand(): { kennung: TourKennung; neu: boolean } | null {
  const { ansicht } = useNavigation();
  const merker = useTourMerker();
  const kennung = tourFuerAnsicht(ansicht);
  if (!kennung || !merker.symbolAn) return null;
  return { kennung, neu: !merker.gesehen.has(kennung) };
}

function Symbol({ kennung, neu }: { kennung: TourKennung; neu: boolean }) {
  return (
    <button
      type="button"
      className="knopf-symbol tourknopf"
      aria-label={neu ? t("tour.symbolNeu") : t("tour.symbol")}
      title={t("tour.symbol")}
      data-tour="tour-symbol"
      onClick={() => starteTour(kennung)}
    >
      <Compass size={SYMBOLGROESSE} strokeWidth={STRICHSTAERKE} aria-hidden="true" />
      {neu && <span className="tourknopf-punkt" aria-hidden="true" />}
    </button>
  );
}

/** Das Symbol zum gezeigten Bildschirm, oder nichts (keine Tour oder ausgeschaltet). */
export function TourKnopf() {
  const stand = useSymbolstand();
  return stand ? <Symbol {...stand} /> : null;
}
