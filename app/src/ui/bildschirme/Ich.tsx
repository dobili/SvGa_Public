/**
 * Bereich „Profil“ (intern „ich“): oben Name und Porträt des Lesers (ProfilKarte.tsx), dann der
 * Knopf zu den Einstellungen, darunter die Wertung des Lesers (wertung/Wertungskarte.tsx, seit dem Profil neu am 31.10.2026 mit
 * drei Kacheln), sein
 * Fortschritt im Buch (Fortschrittsuebersicht.tsx), seine Orden und Abzeichen (erfolge/Erfolge.tsx) und seine gespielten Partien (Partienliste.tsx).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (25.10.2026): Die Leiste zeigt ein Profil statt des
 * Zahnrads; wer auf „Spielen“ tippt, will spielen und keine alten Partien sehen, deshalb stehen die
 * gespielten Partien hier. Die Einstellungen selbst liegen auf einem eigenen Bildschirm
 * (Einstellungen.tsx). Die laufende Partie bleibt auf „Spielen“ („Weiterspielen“).
 * Abhängigkeiten: Navigation, Speicher, Wertungskarte, Fortschrittsuebersicht, Partienliste, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { TourKnopf } from "../../tour/TourKnopf";
import { Erfolge } from "../komponenten/erfolge/Erfolge";
import { Fortschrittsuebersicht } from "../komponenten/fortschritt/Fortschrittsuebersicht";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Partienliste } from "../komponenten/partienliste/Partienliste";
import { Profilkarten } from "../komponenten/profilkarten/Profilkarten";
import { Wertungskarte } from "../komponenten/wertung/Wertungskarte";
import { ProfilKarte } from "../profil/ProfilKarte";
import { LernpfadKnopf } from "../komponenten/lernpfad/LernpfadKnopf";

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
      <Wertungskarte punkte={wertung} partien={partien} />
      <Fortschrittsuebersicht />
      {/* Profil neu (31.10.2026): Orden und Abzeichen mit Glanzstück und Regalen. */}
      <Erfolge />
      {/* Gamifizierung P2: der Fortschritt im Buch als Weg. */}
      <LernpfadKnopf ort="profil" />
      {/* Gamifizierung G4: Karten der Pakete (Themen, Rekorde, Rückblicke …). */}
      <Profilkarten />
      <Partienliste partien={partien} />
    </div>
  );
}
