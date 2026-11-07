/**
 * Zeile „Aussehen (Brett, Figuren, Rahmen) im Profil wählen“ oben in den Einstellungen: führt zur
 * Profilkarte „Dein Aussehen“, Reiter „Brett“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (7.11.2026, Bildschirmfoto): Brett und Figuren ließen
 * sich bis 0.3.52 an zwei Stellen wählen, oben in den Einstellungen (Brettstudio) und in der
 * Profilkarte „Deine Extras“. Das war doppelt und verwirrte. Jetzt gibt es nur noch die
 * Profilkarte; dort sieht man, was es schon gibt und was man noch freischalten kann. Diese Zeile
 * steht dort, wo früher die Brettvorschau stand, damit niemand das Brett vergeblich sucht.
 * Abhängigkeiten: app/navigationsKontext.ts (useOeffne), extras/aussehenssprung.ts, i18n,
 * lucide-react.
 */
import { ChevronRight, Palette } from "lucide-react";
import { useOeffne } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { merkeAussehenssprung } from "../extras/aussehenssprung";

/** Größe des Symbols links (wie in Seitenliste.tsx). */
const SYMBOLGROESSE = 21;
/** Größe des Pfeils rechts. */
const PFEILGROESSE = 18;

/** Die Zeile; ein Tipp wechselt ins Profil, der Reiter „Brett“ steht offen im Bild. */
export function AussehenKnopf() {
  const oeffne = useOeffne();
  return (
    <div className="einstellungsliste">
      <button
        type="button"
        className="einstellungszeile seitenzeile"
        data-tour="einstellungen-aussehen"
        onClick={() => {
          merkeAussehenssprung("brett");
          oeffne({ bildschirm: "ich" });
        }}
      >
        <Palette className="einstellungszeile-symbol" size={SYMBOLGROESSE} aria-hidden="true" />
        <span className="einstellungszeile-name">{t("einstellungenneu.aussehen")}</span>
        <span className="einstellungszeile-wert">
          <ChevronRight size={PFEILGROESSE} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
