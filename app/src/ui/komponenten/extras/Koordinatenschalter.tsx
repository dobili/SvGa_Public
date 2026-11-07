/**
 * Schalter „Koordinaten“ unter den Brettkacheln der Profilkarte „Dein Aussehen“: Buchstaben und
 * Zahlen am Rand jedes Brettes der App an oder aus.
 *
 * Rolle im Gesamtbild: Bis 0.3.52 stand der Schalter unter der großen Brettvorschau oben in den
 * Einstellungen (Brettstudio). Seit „Aussehen im Profil“ (Wunsch des Autors, 7.11.2026) liegt
 * alles, was nur das Aussehen des Brettes ändert, in der Profilkarte; der Schalter steht im
 * Reiter „Brett“ (extrawahl.ts, Feld `Zusatz`). Die Wahl bleibt ein Merker auf dem Gerät, den
 * Trainerbrett und Abbildungen beim Öffnen lesen.
 * Abhängigkeiten: app/merker.ts, einstellungen/Einstellungszeile (Schalter), i18n.
 */
import { useId, useState } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { t } from "../../../i18n/sprache";
import { Schalter } from "../einstellungen/Einstellungszeile";

/** Merker der Koordinaten auf dem Gerät (Trainerbrett.tsx und Abbildungen lesen ihn). */
const MERKER_KOORDINATEN = "koordinaten";

/** Die Zeile mit Namen und Schalter; ohne Merker sind die Koordinaten an. */
export function Koordinatenschalter() {
  const kennung = useId();
  const [an, setzeAn] = useState(liesMerker(MERKER_KOORDINATEN) !== "aus");
  return (
    <div className="extrasneu-koordinaten">
      <span id={kennung}>{t("einstellungenneu.koordinaten")}</span>
      <Schalter
        beschriftetVon={kennung}
        an={an}
        beiWechsel={(neu) => {
          schreibeMerker(MERKER_KOORDINATEN, neu ? "an" : "aus");
          setzeAn(neu);
        }}
      />
    </div>
  );
}
