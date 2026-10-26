/**
 * Bereich „Profil“ (intern „ich“, bis 0.2.133 „Einstellungen“ mit Zahnrad): oben Name und Porträt
 * des Lesers (seit 0.2.140, ProfilKarte.tsx), dann der Knopf zu den
 * Einstellungen, darunter die Wertung des Lesers (Wertungskurve.tsx), sein Fortschritt im Buch
 * (Fortschrittsuebersicht.tsx) und seine gespielten Partien (Partienliste.tsx).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Die Leiste zeigt ein Profil statt des
 * Zahnrads; wer auf „Spielen“ tippt, will spielen und keine alten Partien sehen, deshalb stehen die
 * gespielten Partien hier. Die Einstellungen selbst liegen auf einem eigenen Bildschirm
 * (Einstellungen.tsx). Die laufende Partie bleibt auf „Spielen“ („Weiterspielen“).
 * Abhängigkeiten: Navigation, Speicher, Wertungskurve, Fortschrittsuebersicht, Partienliste, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { TourKnopf } from "../../tour/TourKnopf";
import { Fortschrittsuebersicht } from "../komponenten/fortschritt/Fortschrittsuebersicht";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Partienliste } from "../komponenten/partienliste/Partienliste";
import { Wertungskurve } from "../komponenten/fortschritt/Wertungskurve";
import { ProfilKarte } from "../profil/ProfilKarte";

/** Die Profilseite. */
export function Ich() {
  const { navigiere } = useNavigation();
  const wertung = useSpeicher((z) => z.daten.spiel.wertung);
  const partien = useSpeicher((z) => z.daten.spiel.partien);
  return (
    <div className="bildschirm">
      <header className="seitenkopf">
        <h1>{t("profil.titel")}</h1>
        <TourKnopf />
      </header>
      {/* Seit 0.2.140 ganz oben: Name und Porträt des Lesers (Wunsch des Autors). */}
      <ProfilKarte />
      <button
        type="button"
        className="knopf-zweit profil-einstellungen"
        data-tour="profil-einstellungen"
        onClick={() => navigiere({ bildschirm: "einstellungen" })}
      >
        <Knopfsymbol art="einstellungen" />
        {t("ich.titel")}
      </button>
      <Wertungskurve punkte={wertung} partien={partien} />
      <Fortschrittsuebersicht />
      <Partienliste partien={partien} />
    </div>
  );
}
